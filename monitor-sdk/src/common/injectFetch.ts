import { httpMetrics } from "@/type";
import { calcDuration } from "@/util";

// 调用 proxyFetch 即可完成全局监听 fetch
export const proxyFetch = (sendHandler: Function | null | undefined, loadHandler: Function) => {
  if (isExistsFetch()) {

    const _Fetch = getNewFetch();

    // 修改原始的fetch请求
    (window as any).fetch = async (input: any, init: RequestInit) => {
      // init 是用户手动传入的 fetch 请求互数据，包括了 method、body、headers，要做统一拦截数据修改，直接改init即可

      if (typeof sendHandler === 'function') sendHandler(init);
      let metrics = {} as httpMetrics;


      initMetrics();

      return _Fetch.call(window, input, init).then(async (response) => {
        // clone 出一个新的 response,再用其做.text(),避免 body stream already read 问题
        const { status, statusText, url } = response;
        let message: string

        setMessageByStatus();

        const res = response.clone();
        await setMetrics();

        calcDuration(metrics);

        if (typeof loadHandler === 'function') loadHandler(metrics);

        console.log('fetch then', metrics);


        return metrics;

        function setMessageByStatus() {
          if (status >= 200 && status < 300) {
            // 正常情况
            message = 'success';
          } else if (status === 404) {
            // Not Found
            message = 'Request failed with status code 404';
          } else if (status === 500) {
            // Internal Server Error
            message = 'Request failed with status code 500';
          }
        }

        async function setMetrics() {
          metrics = {
            ...metrics,
            message,
            status,
            statusText,
            response: await res.text(),
            responseTime: new Date().getTime(),
            url
          };
        }
      }).catch(async e => {
        const { message } = e

        setErrorMetrics();

        calcDuration(metrics)

        console.log('fetch error', metrics);

        return metrics


        function setErrorMetrics() {
          metrics = {
            ...metrics,
            message,
            status: 0,
            statusText: "error",
            responseTime: new Date().getTime()
          };
        }
      });

      function initMetrics() {
        metrics = {
          method: init?.method.toUpperCase() || '',
          url: (input && typeof input !== 'string' ? input?.url : input) || '',
          body: init?.body || '',
          requestTime: new Date().getTime()
        };
      }
    };
  }

  // 返回fetch函数以及将其绑定到_fetch属性上
  function getNewFetch() {
    const _Fetch = window.fetch;
    if (!(window as any)._Fetch) {
      (window as any)._Fetch = _Fetch;
    }
    return _Fetch;
  }

  function isExistsFetch() {
    return 'fetch' in window && typeof window.fetch === 'function';
  }
};


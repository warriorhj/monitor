import {httpMetrics} from "../../../monitor-sdk/src/type";

/**
 * @Description:
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-06--22:27
 **/

export function proxyxmlHttp(sendHandler: Function | null | undefined, loadHandler: Function) {

    // 拦截xmlhttprequest请求
    const _XMLHttpRequest = window.XMLHttpRequest;
    if (!(window as any)._XMLHttpRequest) {
        (window as any)._XMLHttpRequest = _XMLHttpRequest;
    }

    (window as any).XMLHttpRequest = function () {
        // 生成一个请求对象
        const xhr = new _XMLHttpRequest();
        // 获取建立连接和发送数据函数
        const { open, send } = xhr;
        let metrics = initMetrics();

        function initMetrics() {
            let metrics = {} as httpMetrics;
            xhr.open = (method: string, url: string) => {
                metrics.method = method.toUpperCase();
                metrics.url = url;
                open.call(xhr, method, url, true);
            };
            xhr.send = (body) => {
                metrics.body = body || '';
                metrics.requestTime = new Date().getTime();
                if (typeof sendHandler === 'function')
                    sendHandler(xhr);
                send.call(xhr, body);
            };
            return metrics;
        }
    }
}
<template>
  <div class="left">
    <h1>异常数据</h1>

    <h2>前端异常</h2>
    <button class="hello" @click="bugJs">JS 代码执行异常</button>
    <button class="world" @click="bugPromise">Promise 异常</button>
    <button class="hi" @click="bugAsset">静态资源加载异常</button>
    <button class="foursheep" @click="bugConsole">console.error 异常</button>
    <button class="good" @click="bugCors">跨域异常</button>
     <img src="http://localhost:8888/nottrue.jpg" />

    <br />

    <h2>接口异常</h2>
    <button @click="bugNoRespond">未响应/超时响应异常</button>
    <button @click="bugInterface4">4xx 请求异常</button>
    <button @click="bugInterface5">fetch 请求异常</button>
    <button @click="bugPowerless">权限不足</button>

    <h1>白屏异常</h1>
    <button @click="bugWhiteScreen">白屏异常</button>
  </div>

  <div class="right">
    <h1>行为数据</h1>
    <button>用户设备类型，浏览器版本，webview引擎类型</button>
    <button>获取页面性能指标</button>
    <button>点击事件</button>
    <button>
      <RouterLink to="/">路由跳转</RouterLink>
    </button>
    <!-- <button @click="getPv">PV、UV</button> -->
  </div>



  <!--  <br />-->
  <!--  <hr />-->
  <!--  <br />-->

  <!--    <div>-->
  <!--      <strong><h1>性能监控</h1></strong>-->
  <!--      <button @click="">白屏时间</button>-->
  <!--      <button @click="">页面资源加载耗时</button>-->
  <!--      <button @click="">首屏渲染耗时</button>-->
  <!--      <button @click="">接口请求耗时</button>-->
  <!--      <button @click="">收集长时间运行任务（longtasks）</button>-->
  <!--    </div>-->
</template>
<!--<script async src="http://xxxxxx:8081/texterror.js"> </script>-->
<script setup lang="ts">
import { axiosIntance } from "@/utils/axios";
import axios from "axios";
import { login } from "@/api/modules/user";

let lastEvent: Event;

(function () {
  console.log(document.readyState)

  console.log(performance.getEntries())
  window.addEventListener('error',(event)=>{
    event.preventDefault();
    // console.log(event instanceof ErrorEvent);
    // console.log(event.target.src, event.target.outerHTML, event.target.tagName);
    if (event instanceof ErrorEvent){
      console.log(event)
      console.log(event.message)
      console.log(event.error)
    }else {
      console.log(event)
    }

    // const { src, outerHTML, tagName } = event.target;
    // console.log(src,outerHTML,tagName)
  },true)

  window.addEventListener('unhandledrejection',(event)=>{
    // console.log(event)
    const t = lastEvent;
    console.log(event)
    // console.log(lastEvent);
    // let matchResult = event.reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
    // let filename = matchResult[1];
    // let line = matchResult[2];
    // let column = matchResult[3];
    // console.log(matchResult)
  },true)

  let consoleError = window.console.error;

  window.console.error = function (error) {
    console.log(error)
    console.log(error.message)
    console.log(error.stack)
    const stack = error.stack;
    const message = error.message;
    const url: string = window.location.href;
    let row: number = 0, column: number = 0;
    if (stack) {
      let mres = stack.match(/\(.*?\)/g) || [];
      let firstLine = (mres[0] || "").replace("(", "").replace(")", ""); // 获取到堆栈信息的第一条

      // 根据:分隔获取行列
      let info = firstLine.split(':');
      row = +info[info.length - 2]; // 行
      column = +info[info.length - 1]; // 列
    }
    console.log(row,column,url,stack)
    let opt = {
      url,
      row,
      column,
      message,
      stack // 错误堆栈信息
    }
  // 将opt错误信息进行上传

    return consoleError.apply(console, arguments as any)
  }


})();

(function getLastEvent() {

  [
    'click',
    'mousedown',
    // 'mouseover',
    'keydown',
    'touchstart',
  ].forEach(eventType => {
    window.addEventListener(eventType, (event) => {
      lastEvent = event;
    }, {
      capture: true,
      passive: true // 默认不阻止默认事件
    });
  })

})()



const bugJs = (e) => {
  console.log(document.readyState);
  console.log(e);
  console.log(e.target.tagName)
  window.someVar.error = "error";
};
const bugPromise = () => {
  // new Promise(function (_, reject) {
  //   window.someVar.error = "error";
  // });

  Promise.reject().catch(()=>{
    console.log(t)
  });
};
const bugAsset = function () {
  console.log("bugAsset");
};
const bugConsole = function () {
  console.error(new Error("错误捕获222"));
};
const bugCors = function () {


    axios({
      url:"https://www.baidu.com"
    }).then(res=>{
      console.log(res)})



  login({
    url: "/test",
    method: "post",
    data: "你好foursheep",
  });
  //     console.error(e);
  //     // if (ErrorEvent) {
  //     //   window.dispatchEvent(new ErrorEvent('error', { e, message: e.message })) // 这里也会触发window.onerror
  //     // } else {
  //     //   window.onerror && window.onerror(null, null, null, null, e)
  //     // }
  //
};
const bugNoRespond = function () {
  // timeout
  axiosIntance
    .get("/api", {
      timeout: 10,
    })
    .then((res) => {
      console.log("请求成功");
      console.log(res);
    })
    .catch((e) => {
      console.log("请求失败");
      console.log(e);
    });
};
const bugInterface4 = function () {
  // 404
  axios
    .get("/api")
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log("请求失败");
      console.log(e);
    });

  // 200
  // axiosIntance
  //   .get("/api/info")
  //   .then((res) => {
  //     console.log("请求成功");
  //     console.log(res);
  //   })
  //   .catch((e) => {
  //     console.log("请求失败");
  //     console.log(e);
  //   });
};
// const getPv = () => {
//   console.log("getPv");
// };
const bugInterface5 = function () {
  fetch("/asdasdasdasd", {
    method: "post",
    body: "kongming",
  });
};
const bugPowerless = function () {
  console.log("powerless");
};
const bugWhiteScreen = function () {
  console.log("页面 load 时已监控");
};
</script>

<style></style>

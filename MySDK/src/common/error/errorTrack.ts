/**
 * @Description:
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-12--19:26
 **/

import {ExceptionMetrics, HttpMetrics, mechanismType} from "../../type/store";


// 判断异常类型
export const getErrorKey = (event:ErrorEvent|Event)=>{
    // 存在两种用于区分为静态资源错误还是其他错误

    const isJsError = event instanceof ErrorEvent;  // errorevent是事件对象在脚本发生错误时产生，它可以提供发生错误的脚本文件的文件名，以及发生错误时所在的行号等信息
    const isRsError = event.target instanceof HTMLImageElement || event.target instanceof HTMLScriptElement || event.target || HTMLLinkElement;
    // 静态资源错误
    if(!isJsError) return mechanismType.RS;

    // 是否为跨域资源 引入axios中axioserror类型
    // return event instanceof AxiosError? mechanismType.CS:mechanismType.JS;

    // 通过event中的message信息
    return event.message === 'Script error.'? mechanismType.CS:mechanismType.JS;
}


export default class ErrorVitals{
    // private engineInstance: EngineInstance;

    // 已经提交的错误id
    private submitErrorUids: Array<string>;

    constructor() {

        this.submitErrorUids = [];
        this.initJsError();
        // 初始化 静态资源加载错误
        this.initResourceError();
        // 初始化 Promise异常
        this.initPromiseError();
        // 初始化 HTTP请求异常
        this.initHttpError();
        // 初始化 跨域异常
        this.initCorsError();
        // 初始化 Vue异常
        this.initVueError();
    }


    // // 封装错误的上报入口，上报前，判断错误是否已经发生过
    // errorSendHandler = (data: ExceptionMetrics) => {
    //     // 统一加上 用户行为追踪 和 页面基本信息
    //     const submitParams = {
    //         ...data,
    //         breadcrumbs: this.engineInstance.userInstance.breadcrumbs.get(),
    //         pageInformation: this.engineInstance.userInstance.metrics.get('page-information'),
    //     } as ExceptionMetrics;
    //     // 判断同一个错误在本次页面访问中是否已经发生过;
    //     const hasSubmitStatus = this.submitErrorUids.includes(submitParams.errorUid);
    //     // 检查一下错误在本次页面访问中，是否已经产生过
    //     if (hasSubmitStatus) return;
    //     this.submitErrorUids.push(submitParams.errorUid);
    //     // 记录后清除 breadcrumbs
    //     this.engineInstance.userInstance.breadcrumbs.clear();
    //     // 一般来说，有报错就立刻上报;
    //     this.engineInstance.transportInstance.kernelTransportHandler(
    //         this.engineInstance.transportInstance.formatTransportData(transportCategory.ERROR, submitParams),
    //     );
    // };

    // ^ 匹配开头
    // \s 匹配空白字符 * 匹配0到多个
    FULL_MATCH = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;




    initJsError = ():void =>{
        // 可以使用两种方式 一种为window.error(只能是位于冒泡阶段) 一种是通过监听error（可以同时处理静态资源异常）
        const handler = (event:ErrorEvent)=>{

            // 非js错误
            if(getErrorKey(event) !== mechanismType.JS) return;

            const exception = {
                mechanism : {
                    type : mechanismType.JS
                },
                value: event.message, //控制台报错信息的提示信息
                type: event.error && event.error.name, // 控制台的全部报错信息，其中有错误原因以及整个错误栈
                stackTrace: {
                    frame : event.error // 将错误栈进行解析后的获得出错位置 文件
                },
                errorUid: '',
                meta: {
                    file: event.filename, // 当前出错的文件 但是为打包后的位置
                    col: event.colno, // 错误的列
                    row: event.lineno, // 错误的行
                }
            } as ExceptionMetrics;

            // 上报该信息

        }
        window.addEventListener('error',(e)=>handler(e),true) // 捕获阶段
    }


    initResourceError() {
        // 可以使用两种方式 一种为window.error(只能是位于冒泡阶段) 一种是通过监听error（可以同时处理静态资源异常）
        const handler = (event:ErrorEvent)=>{

            // 非js错误
            if(getErrorKey(event) !== mechanismType.RS) return;
            const target = event.target;

            const exception = {
                mechanism : {
                    type : mechanismType.RS
                },
                value: '', //控制台报错信息的提示信息
                type: 'ResourceError', // 控制台的全部报错信息，其中有错误原因以及整个错误栈
                errorUid: '',
                meta: {
                    file: target.src, // 请求的静态资源位置
                    col: target.outHtml, // 出错的哪一行html
                    row: target.tagName, // 出错的标签
                }
            } as ExceptionMetrics;

            // 上报该信息

        }
        window.addEventListener('error',(e)=>handler(e),true) // 捕获阶段
    }

    initPromiseError() {

        // reject 没有被捕获
        // promise中出现了js错误
        // 可以使用两种方式 一种为window.error(只能是位于冒泡阶段) 一种是通过监听error（可以同时处理静态资源异常）
        const handler = (event:PromiseRejectionEvent)=>{



            const value = event.reason.message || event.reason; // 报错信息
            const type = event.reason.name; // 错误类型


            const exception = {
                mechanism : {
                    type : mechanismType.UJ
                },
                value, //控制台报错信息的提示信息
                type, // 控制台的全部报错信息，其中有错误原因以及整个错误栈
                errorUid: '',
                stackTrace:{
                    frames: event.reason;
                },
                meta:{}
            } as ExceptionMetrics;

            // 上报该信息

        }
        window.addEventListener('unhandledrejection',(e)=>handler(e),true) // 捕获阶段

    }

    initHttpError() {

        // 首先检查一下window对象中xmlhttprequest 和 fetch 是否存在
        // 劫持xmlhttprequest请求
        if('XMLHttpRequest' in window && typeof window.XMLHttpRequest === 'function'){
            const _XMLHttpRequest = window.XMLHttpRequest;
            if(!(window as any)._XMLHttpRequest){
                (window as any)._XMLHttpRequest = _XMLHttpRequest;
            }

            (window as any).XMLHttpRequest = function () {
                const xhr = new _XMLHttpRequest();
                const {open,send} = xhr;
                let metrics = {} as HttpMetrics;

                // 拦截open方法 获取其中method以及url值
                xhr.open = (method,url)=>{

                    metrics.method = method;
                    metrics.url = url;
                    open.call(xhr,method,url,true); //最后的一个true表示是否执行异步操作

                }

                // 拦截send方法 获取其中body数据以及请求时间
                xhr.send = (body) =>{
                    const now = new Date().getTime();
                    metrics.requestTime = now;
                    metrics.body = body;
                    send.call(xhr,body);
                }

                xhr.addEventListener('loadend',function () {
                    const {status,statusText,response} = xhr;
                    const now = new Date().getTime();
                    metrics.status = status;
                    metrics.statusText = statusText;
                    metrics.responseTime = now;
                    metrics.response = response;
                })

                return xhr;

            }

        }


        // 劫持fetch
        if('fetch' in window && typeof window.fetch === 'function'){
            const _fetch = window.fetch;
            if(!(window as any)._fetch){
                (window as any)._fetch = _fetch;
            }



            (window as any).fetch =  async function (input: any,init: RequestInit) {

                let Fmetrics = {} as HttpMetrics;
                Fmetrics.url = input;
                Fmetrics.method = init?.method || '';
                Fmetrics.body = init.body;
                Fmetrics.requestTime = new Date().getTime();

                return _fetch.call(window,input,init).then(async (response)=>{
                    Fmetrics = {
                        ...Fmetrics,
                        status:response.status,
                        statusText: response.statusText,
                        responseTime: new Date().getTime(),
                        response: response.text(),

                    }
                    return response;
                })


                const xhr = new _XMLHttpRequest();
                const {open,send} = xhr;
                let metrics = {} as HttpMetrics;

                // 拦截open方法 获取其中method以及url值
                xhr.open = (method,url)=>{

                    metrics.method = method;
                    metrics.url = url;
                    open.call(xhr,method,url,true); //最后的一个true表示是否执行异步操作

                }

                // 拦截send方法 获取其中body数据以及请求时间
                xhr.send = (body) =>{
                    const now = new Date().getTime();
                    metrics.requestTime = now;
                    metrics.body = body;
                    send.call(xhr,body);
                }

                xhr.addEventListener('loadend',function () {
                    const {status,statusText,response} = xhr;
                    const now = new Date().getTime();
                    metrics.status = status;
                    metrics.statusText = statusText;
                    metrics.responseTime = now;
                    metrics.response = response;
                })

                return xhr;

            }

        }

    }

    initCorsError() {

        // 跨域错误不能捕获到具体的错误 即 当前错误的行号以及列号
        const handle = function (event: ErrorEvent) {

            event.preventDefault();

            if (getErrorKey(event) !== mechanismType.CS ) return;

            const exception = {
                mechanism:{
                    type: mechanismType.CS,
                },
                value: event.message,
                errorUid: '',
                type: 'CorsError'
            } as ExceptionMetrics;

        }

        window.addEventListener('error',(e)=>handle(e))

    }

    initVueError() {

    }
}
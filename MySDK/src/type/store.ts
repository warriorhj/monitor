/**
 * @Description:
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-11--16:59
 **/
// 定义性能指标 通过枚举
export enum metricsName{
    FP = 'first-paint',
    FCP = 'first-contentful-paint',
    LCP = 'largest-contentful-paint',
    FID = 'first-input-delay', // 首次输入延迟
    CLS = 'cumulative-layout-shift', //
    NT = 'navigation-timing',
    RF = 'resource-flow',
}

export interface IMetrics {
    [props : string | number]: any;
}

export default class metricsStore{

    state: Map<metricsName|string,IMetrics>;

    constructor() {
        this.state = new Map<metricsName | string, IMetrics>();
    }

    // 保存指标
    set(key:metricsName|string, value:IMetrics):void{
        this.state.set(key,value);
    }

    get(key:metricsName|string):IMetrics|undefined{
        return this.state.get(key);
    }

}

export enum metricsName {
    PI = 'page-information',  // 页面信息
    OI = 'origin-information',  //
    RCR = 'router-change-record', // 路由更改记录
    CBR = 'click-behavior-record', // 点击行为记录
    CDR = 'custom-define-record',  // 用户定义记录
    HT = 'http-record', // http 记录
}

// 捕捉错误类型
export enum mechanismType{
    JS = 'js',
    RS = 'resource',
    UJ = 'unhandledrejection',
    HP = 'http',
    CS = 'cors',
    REACT = 'react',
    VUE = 'vue'
}

// 异常数据结构体
export interface ExceptionMetrics{
    mechanism: Object;
    value?: string;
    type: string;
    stackTrace?: Object;
    pageInformation?: Object;
    breadcrumbs?: Array<behaviorStack>;
    errorUid: string;
    meta?: any;
}

// http请求数据封装
export interface HttpMetrics{
    method: string;  // 请求方法
    url: string | URL;  // 请求url
    body:  Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream; // 请求体
    requestTime: number; // 请求时间
    responseTime: number;  // 响应时间
    status: number;  // 响应状态
    statusText: string;  // 响应状态文本
    response?: any;  // 响应体
}

// 页面信息
export interface PageInformation {
    host: string;
    hostname: string;
    href: string;
    protocol: string;
    origin: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    title: string;
    language: string;
    userAgent?: string;
    winScreen: string;
    docScreen: string;
}
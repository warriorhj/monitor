/**
 * @Description:  定义的类型
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-04--22:36
 **/


// 用于配置sdk的信息
export interface initOptions {
    appId?: string;
    cookie: string;
    reportUrl: string;
    delay?: number;
    hashPage: boolean;
    errorReport: boolean;
    performanceReport: boolean;
}

// 定义错误类型
export enum mechanismType {
    JS = 'jsError',
    RS = 'resourceError',
    UJ = 'unhandledrejectionError',
    CS = 'corsError'
}

// 定义请求信息
export interface httpMetrics {
    method: string;
    url: string | URL;
    body: Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream;
    requestTime: number;
    responseTime?: number;
    status?: number;
    statusText?: string;
    response?: any;
    type?: string,
    timeStamp?: string,
    message?: string,
    duration?: number

}
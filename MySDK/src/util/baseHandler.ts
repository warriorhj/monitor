/**
 * @Description:
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-04--22:47
 **/

import {getErrorKey} from "./index";
import {mechanismType} from "../type";


export function handleJS(event: any):void {

    // 阻止默认事件， 实质上是向控制台报错
    event.preventDefault();

    // 获取当前错误类型
    const type = getErrorKey(event);
    if (type == mechanismType.RS){
        const { src , outerHTML, tagName } = event.target;
        // 根据错误信息封装成对象，然后将其上报到服务器
    }
    //其他的两种错误也是同样的处理
}

export function handlePromise(event:any):void {

    // 首要要区分是promise错误还是跨域错误
    console.log(event.reason.name);
    const isCors = event?.reason?.name === "AxiosError";

    if (!isCors){

        // 当前为promise错误
        let reason = event.reason;

        let message: string = '';
        let filename: string = '';
        let line: number = 0;
        let column: number = 0;
        // 获取报错位置以及行数以及列数
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        line = matchResult[2];
        column = matchResult[3];
        message = reason.message;

        // 封装成promise错误对象 然后将其上报
    }else{
        // axios错误 获取跨域请求信息
        const { config, name, message, response, request } = event.reason;
        let { url, method, params, data } = config;
        // 封装成跨域错误对象 然后将其上报
    }




}
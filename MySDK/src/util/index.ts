/**
 * @Description:
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-06--16:20
 **/
import {mechanismType} from "../type";
import {AxiosError} from "axios";


export function getErrorKey(event: ErrorEvent | Event) {

    const target = event.target;
    // 通过event来判断当前的错误是什么错误
    const isJsError = event instanceof ErrorEvent;
    if(!isJsError){
        console.log("静态资源错误");
    }else if(event.message === 'script error.'){
        console.log("跨域错误");
    }else{
        console.log("js错误");
    }


    //  判断当前为资源错误
    const isElementTarget: boolean = target instanceof HTMLScriptElement || target instanceof HTMLImageElement || target instanceof HTMLLinkElement;
    if (isElementTarget){
        return mechanismType.RS;
    }
    if (event instanceof AxiosError){
        return mechanismType.CS
    }
}
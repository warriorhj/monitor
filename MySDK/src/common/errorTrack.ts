/**
 * @Description:
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-04--22:43
 **/
import {handleJS} from "../util/baseHandler";
import {handlePromise} from "../util/baseHandler";


export function errorCatch(){

    // 监控js错误
    window.addEventListener('error',(event)=>{
        handleJS(event);
    })
    // promise 和 跨域错误都会发出unhandledrejection错误
    window.addEventListener('unhandledrejection',(event)=>{
        handlePromise(event)
    })
    // 控制台的拦截
    injectConsole()
    // http拦截
    initHttpHandler()

    // 获取控制台的报出的错误 拦截console中的error
    function injectConsole() {
        let consoleError = window.console.error;

        window.console.error = function (error) {

        }
    }

    function initHttpHandler(){

    }

}
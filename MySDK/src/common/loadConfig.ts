/**
 * @Description: 用于开启sdk监控
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-04--22:34
 **/

import {initOptions} from "../type"
import {errorCatch} from "./errorTrack"


export function loadConfig(options:initOptions):void {

    const {
        cookie,
        reportUrl,
        delay,
        hashPage,
        errorReport,
        performanceReport
    } = options;

    // 开启错误监控和白屏监控
    if(errorReport){
        errorCatch();
    }
}
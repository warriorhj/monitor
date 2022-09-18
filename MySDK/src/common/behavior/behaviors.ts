/**
 * @Description:
 * @Content:
 * @Version:
 * @project monitor-system-master
 * @author warrior
 * @date 2022-09-14--21:14
 **/
import {PageInformation} from "../../type/store";


export class Behaviors {

    clickMountList: Array<string>;

    constructor() {


        // 作为 真实sdk 的时候，需要在初始化时传入与默认值合并;
        this.clickMountList = ['button'].map((x) => x.toLowerCase());
        // 重写事件
        wrHistory();
        // 初始化页面基本信息
        this.initPageInfo();
        // 初始化路由跳转获取
        this.initRouteChange();
        // 初始化用户来路信息获取
        this.initOriginInfo();
        // 初始化 PV 的获取;
        this.initPV();
        // 初始化 click 事件捕获
        this.initClickHandler(this.clickMountList);
        // 初始化 Http 请求事件捕获
        this.initHttpHandler();
        // 上报策略在后几篇细说


    }

    getPageInfo = ():PageInformation=>{
        const { host, hostname, href, protocol, origin, port, pathname, search, hash } = window.location;
        const { width, height } = window.screen;
        const { language, userAgent } = navigator;

        return {
            host,
            hostname,
            href,
            protocol,
            origin,
            port,
            pathname,
            search,
            hash,
            title: document.title,
            language: language.substr(0, 2),
            userAgent,
            winScreen: `${width}x${height}`,
            docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${
                document.documentElement.clientHeight || document.body.clientHeight
            }`,
        };
    };



    initPageInfo = ():void =>{
        const info: PageInformation = this.getPageInfo();
        const metrics = info;
    }

    initRouteChange = ():void =>{

    }







}
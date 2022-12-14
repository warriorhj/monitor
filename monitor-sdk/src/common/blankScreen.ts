import { BlackScreenDataType as initData } from "@/type";
import { isLoad } from "../util";
import {lazyReport} from "../common/report";

export function blankScreen(): void {
    console.log('%c%s', 'font-size: 24px; color: orange', '开始监控网页是否白屏');

    // 屏幕上空白点的数量
    let { wrapperElements, emptyPoints }: initData = initElementsAndPoints();
    const getSelector = function (element) {
        const { id, className, nodeName } = element;

        if (id) {
            return `#${id}`;
        } else if (className && typeof className === 'string') {
            return concatClassName();
        } else
            return nodeName ? nodeName.toLowerCase() : element;

        function concatClassName() {
            return `.${className.split(' ').filter(item => !!item).join('.')}`;
        }
    }

    const isWrapper = function (element): void {
        let selector = getSelector(element);
        if (wrapperElements.indexOf(selector) !== -1) {
            emptyPoints++;
        }
    }

    const judge = function (): void {
        // 屏幕的长宽
        const { innerWidth, innerHeight } = window;
        findElements();

        if (emptyPoints >= 18) {
            const centerElements: Element[] = document.elementsFromPoint(innerWidth / 2, innerHeight / 2);
            const log = {
                type: "error",
                errorType: "blank",
                emptyPoints,
                screen: screen.width + "x" + screen.height,
                viewPoint: innerWidth + "x" + innerHeight,
                selector: getSelector(centerElements[0]),
            }
            console.log('%c%s', 'color: orange', 'log', log);
            // 上报
            lazyReport('/blankScreen', log);
        } else {
            console.log('%c%s', 'color: orange', '白屏监控之空白点数量：', emptyPoints);
        }

        function findElements() {
            for (let i = 1; i <= 9; i++) {
                const xElements: Element[] = document.elementsFromPoint(innerWidth * i / 10, innerHeight / 2);
                const yElements: Element[] = document.elementsFromPoint(innerWidth / 2, innerHeight * i / 10);

                isWrapper(xElements);
                isWrapper(yElements);
            }
        }
    }

    // 等到当前页面已经加载完成后才开始最是否白屏做判断
    isLoad(judge);

    function initElementsAndPoints() {
        const wrapperElements: string[] = ['html', 'body', '#container', '.content.main'];
        let emptyPoints: number = 0; // 屏幕上空白点的数量
        return { wrapperElements, emptyPoints };
    }
}
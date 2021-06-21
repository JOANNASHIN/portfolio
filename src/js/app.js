import _ from "lodash";
import $ from 'jquery';
import moment from "moment";

window.$ = window.jquery = window.jQuery = $;
window.moment = moment;

//공통
import common from "./divide/common";

//
import findAddress from "./divide/findAddress";
import weather from "./divide/weather";
import olenzFreegift from "./divide/olenzFreegift";
import brandIndexer from "./divide/brandIndexer";

 /* resize */
 const htmlDoc = document.documentElement;
 let enSizing = false;
 
 function setFontSize() {
     if (window.innerWidth > window.innerHeight) return ;
     htmlDoc.style.fontSize =  parseInt(htmlDoc.offsetWidth / 360 * 100) + '%';
 }
 
 window.onresize = function() {
     if (!enSizing) {
         window.requestAnimationFrame(function() {
             setFontSize();
             enSizing = false;
         });
     }
     enSizing = true;
 }
 
 window.dispatchEvent(new Event('resize'));

const appMethods = {
    common,
    findAddress,
    weather,
    olenzFreegift,
    brandIndexer
}

//페이지별 공통
const pageCommonMethod = {
    // "search": search_common,
}

const appInit = () => {
    const appName = $("body").attr("id");

    if (appName) {
        [common, appMethods[appName]].forEach(method => {
            if (method) method();
        });

        for (let [page, method] of Object.entries(pageCommonMethod)) {
            if (appName.indexOf(page)!= -1) {
                if(method) method();
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    appInit();
})
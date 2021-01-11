import _ from "lodash";
import $ from 'jquery';
import moment from "moment";

window.$ = window.jquery = window.jQuery = $;
window.moment = moment;

//공통
import common from "./divide/common";

//
import main from "./divide/main";
import findAddress from "./divide/findAddress";
import weather from "./divide/weather";

const appMethods = {
    common,
    main,
    findAddress,
    weather
}

const appInit = () => {
    const appName = $("body").attr("id");

    if (appName) [common, appMethods[appName]].forEach(method => {
        if (method) method();
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    appInit();
})
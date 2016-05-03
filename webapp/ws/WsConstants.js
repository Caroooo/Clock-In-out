/**
 * Created by Caroline on 12.04.2016.
 */


/*
 * ************** W A R N I N G ***************
 *
 * THIS FILE MUST NEVER BE DELIEVERED TO GITHUB
 *
 */
sap.ui.define([], function () {
    "use strict";

    var wsSettings = jQuery.sap.sjax({
        url: "ws/ws-settings.json"
    }).data;
    var mode = jQuery.sap.getUriParameters().get("mode");
    if (!mode) {
        mode = "extern";
    } else if (!wsSettings.modes[mode]) {
        console.error("The mode: " + mode + " doesn't seem to be supported. Valid modes would be: " + Object.keys(wsSettings.modes));
    }
    var WsConstants = {

        LOGON_WS_URL: wsSettings.modes[mode].LOGON_WS_URL,
        CREATE_TIME_EVENT_WS_URL: wsSettings.modes[mode].CREATE_TIME_EVENT_WS_URL,
        WS_USER: wsSettings.modes[mode].WS_USER,
        WS_PWD: wsSettings.modes[mode].WS_PWD

    };

    return WsConstants;

});
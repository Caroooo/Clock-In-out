/**
 * Created by Caroline on 31.01.2016.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/GroupHeaderListItem',
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/wt/ws/WsCreateTimeEvent",
    "sap/ui/demo/wt/ws/WsLogon",
    'sap/m/MessageBox'
], function (Controller, GroupHeaderListItem, JSONModel, WsCreateTimeEvent, WsLogon, MessageBox) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Outbox", {

        onInit : function () {
            this.wsLogon = new WsLogon();
            this.wsCreateTimeEvent = new WsCreateTimeEvent();
        },

        handleRefresh : function (evt) {
            var that = this;
            this.loadData();
            setTimeout(function () {
                that.getView().byId("pullToRefresh").hide();
            }, 1000);
        },

        loadData : function(){
            this.getOwnerComponent().sendOutbox();

        },

        formatClockType: function(value){
            // read from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var inType = oBundle.getText("stampTypeIn");
            var outType = oBundle.getText("stampTypeOut");

            return value === "P10" ? inType : outType;
        },
        getGroupHeader: function (oGroup){
            return new GroupHeaderListItem({
                //format the text of the grouping --> convert Date yyyyMMdd into dd.MM.yyyy
                title: oGroup.key[6] + oGroup.key[7] +"."+ oGroup.key[4] + oGroup.key[5]+"."+ oGroup.key[0] + oGroup.key[1] + oGroup.key[2] + oGroup.key[3],
                upperCase: false
            } );
        }

    });
});
/**
 * Created by Caroline on 31.01.2016.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/wt/ws/WsCreateTimeEvent",
    "sap/ui/demo/wt/ws/WsLogon",
    'sap/m/MessageBox'
], function (Controller, JSONModel, WsCreateTimeEvent, WsLogon, MessageBox) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Outbox", {

        onInit : function () {
            this.wsLogon = new WsLogon(); // loading this, so I know it will be fully initialized and ready to use if I need it (it needs time to load the
            // request.xml)
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
            //WHAT TODO HERE?
        },
        handleSendToWebService: function(oEvent) {
            var userContext = this.getOwnerComponent().getModel("userContext");
            var outbox = this.getView().getModel("outbox");
            var that = this;
            /*
             * Notice the spelling mistake!!! tickedId (when it should have been ticketId). Used the wrongly spelled word :-(
             */
            if (!userContext.getProperty("/tickedId")) {
                this.wsLogon.send(userContext).done(function(newUserContext) {
                    var component = that.getOwnerComponent();
                    component.setModel(newUserContext, "userContext");
                    if (component.isLoggedIn() === true) {
                        userContext = this.getOwnerComponent().getModel("userContext");
                        this.sendOutbox(userContext, outbox);
                    } else {
                        MessageBox.error("Login failed. Cannot send Outbox to server. Logout and back in again before retrying.");
                    }
                });
            } else {
                this.sendOutbox(userContext, outbox);
            }

        },


        formatClockType: function(value){
            return value === "P10" ? "In" : "Out";
        },


        sendOutbox: function(userContext, outbox) {

            this.wsCreateTimeEvent.send(userContext, outbox).then(function(result) {
                if (result.text === "successfully processed") {
                    MessageBox.success("The outbox with " + outbox.length + " records, was successfully sent to the server");
                    outbox.setData({});
                    outbox.updateBindings();
                } else {
                    MessageBox.error("An error occured sending the Outbox. Please try again later.\n\n" + result.text);
                }
            });

        }

    });
});
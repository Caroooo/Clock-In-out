/**
 * Created by Caroline on 31.01.2016.
 */

var stampedIn = false;

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    'sap/m/Button',
    'sap/m/Dialog',
    'sap/m/Text',

], function (Controller, JSONModel, MessageToast, Button, Dialog, Text) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Stamp", {

        onInit: function () {

            this._iEvent = 0;

        },

        handleChange: function (oEvent) {
            //var oText = this.byId("T3");
            //var oTP = oEvent.oSource;
            //var sValue = oEvent.getParameter("value");
            //var bValid = oEvent.getParameter("valid");
            //this._iEvent++;
            //
            //if (bValid) {
            //    oTP.setValueState(sap.ui.core.ValueState.None);
            //} else {
            //    oTP.setValueState(sap.ui.core.ValueState.Error);
            //}
        },
        newBooking : function (type) {

            var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd"});
            var timeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "HHMMSS"});

            var currentDate = new Date();
            var newBooking = {
                Date: dateFormat.format(currentDate),
                Time: timeFormat.format(currentDate),
                ClockType: type
            }
            var model = this.getOwnerComponent().getModel("outbox");
            model.getData().push(newBooking);
            this.getOwnerComponent().sendOutbox()
                .done(function(result){
                    if(result.outcome === "sentToServer") {
                        that.generateMessageStrip("Success", result.message);
                    }else if(result.outcome === "savedLocally"){
                        that.generateMessageStrip("Warning", result.message);
                    }
                })
                .fail(function(result){
                    that.generateMessageStrip("ERROR", result.message);

                }).always(function(){
                    model.updateBindings();
                });

        },

        onClockIn: function () {
            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var cancleButton = oBundle.getText("cancelButton");
            var warningTitle = oBundle.getText("warningTitle");
            var inType = oBundle.getText("stampTypeIn");
            var that = this;
            if(stampedIn == false){
                this.newBooking("P10");

            }else{

                var dialog = new Dialog({
                    title: warningTitle,
                    type: 'Message',
                    state: 'Warning',
                    content: new Text({
                        text: oBundle.getText("alreadyInWarning")
                    }),
                    beginButton: new Button({
                        text: oBundle.getText("clockInButtonText"),
                        press: function () {
                            this.newBooking("P10");

                        }
                    }),
                    endButton: new Button({
                        text: cancleButton,
                        press: function(){
                            dialog.close();
                        }
                    }),
                    afterClose: function() {
                        dialog.destroy();
                    }
                });

                dialog.open();
            }
            stampedIn= true;
        },
        generateMessageStrip : function(type, text){
            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var messageText = text;

            var oMs = sap.ui.getCore().byId("msgStrip");

            if (oMs) {
                oMs.destroy();
            }
            var aType = type,
                oVC = this.getView().byId("oVerticalContent"),

                oMsgStrip = new sap.m.MessageStrip("msgStrip", {
                    text: messageText,
                    showCloseButton: false,
                    showIcon: true,
                    type: aType
                });

            oVC.addContent(oMsgStrip);
            var oMs = sap.ui.getCore().byId("msgStrip");
            setTimeout(function(){
                oMs.destroy();
            }, 2000);

        },

        onClockOut: function () {
            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var cancleButton = oBundle.getText("cancelButton");
            var warningTitle = oBundle.getText("warningTitle");
            var outType = oBundle.getText("stampTypeOut");

            if(stampedIn == true){

                this.newBooking("P20");


            }else{
                var dialog = new Dialog({
                    title: warningTitle,
                    type: 'Message',
                    state: 'Warning',
                    content: new Text({
                        text: oBundle.getText("alreadyOutWarning")
                    }),
                    beginButton: new Button({
                        text: oBundle.getText("clockOutButtonText"),
                        press: function ()
                        {
                            this.newBooking("P20");

                        }
                    }),
                    endButton: new Button({
                        text: cancleButton,
                        press: function(){
                            dialog.close();
                        }
                    }),
                    afterClose: function() {

                        dialog.destroy();
                    }
                });
                dialog.open();
            }
            stampedIn= false;
        }
    });
});
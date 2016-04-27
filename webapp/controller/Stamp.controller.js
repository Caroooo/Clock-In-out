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
            //localStorage.clear();

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
        newBooking : function (type, baunumber) {

            var currentDate = new Date();
            var newBooking = {
                type: type,
                date: currentDate.toDateString(),
                time: currentDate.toTimeString(),
                person: baunumber
            }
            var rand = Math.random();
            localStorage.setItem(type+rand, JSON.stringify(newBooking));
        },

        onClockIn: function () {
            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var cancleButton = oBundle.getText("cancelButton");
            var warningTitle = oBundle.getText("warningTitle");

            if(stampedIn == false){
                this.newBooking("in", "BAU14105");
                this.generateMessageStrip("Success");

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
                            this.newBooking("in", "BAU14105");
                            dialog.close();
                            //todo: does not work: generateMessageStrip
                            this.generateMessageStrip("Success");
                            //localStorage.setItem("stamps"+Date.now(), "In"+Date.now());

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
        generateMessageStrip : function(type){
            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var messageText = oBundle.getText("successMsg");

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

            if(stampedIn == true){

                this.newBooking("out", "BAU14105");
                this.generateMessageStrip("Success");

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
                            this.newBooking("out", "BAU14105");
                            dialog.close();
                            //todo: does not work: generateMessageStrip
                            this.generateMessageStrip("Success");
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
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
            // create model
            var oModel = new JSONModel();
            oModel.setData({
                myDate: new Date()
            });
            this.getView().setModel(oModel);

            this.byId("TP3").setDateValue(new Date());

            this._iEvent = 0;
        },

        handleChange: function (oEvent) {
            var oText = this.byId("T3");
            var oTP = oEvent.oSource;
            var sValue = oEvent.getParameter("value");
            var bValid = oEvent.getParameter("valid");
            this._iEvent++;

            if (bValid) {
                oTP.setValueState(sap.ui.core.ValueState.None);
            } else {
                oTP.setValueState(sap.ui.core.ValueState.Error);
            }
        },

        onClockIn: function () {

            if(stampedIn == false){

                localStorage.setItem("stamps"+Date.now(), "In"+Date.now());
                this.generateMessageStrip("Success");
              //  MessageToast.show("successfully saved");

            }else{
                var dialog = new Dialog({
                    title: 'Warning',
                    type: 'Message',
                    state: 'Warning',
                    content: new Text({
                        text: 'You are already stamped in. Are you sure you want to stamp in again?'
                    }),
                    beginButton: new Button({
                        text: 'Stamp In',
                        press: function () {
                            dialog.close();
                            localStorage.setItem("stamps"+Date.now(), "In"+Date.now());

                            this.generateMessageStrip("Success");

                          //  MessageToast.show("successfully saved");

                        }
                    }),
                    endButton: new Button({
                        text: 'cancel',
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
            var oMs = sap.ui.getCore().byId("msgStrip");

            if (oMs) {
                oMs.destroy();
            }
            var aType = type,
                oVC = this.getView().byId("oVerticalContent"),

                oMsgStrip = new sap.m.MessageStrip("msgStrip", {
                    text: "Successfully saved",
                    showCloseButton: true,
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

            if(stampedIn == true){

                localStorage.setItem("stamps"+Date.now(), "Out"+Date.now());
                this.generateMessageStrip("Success");
              //  MessageToast.show("successfully saved");

            }else{
                var dialog = new Dialog({
                    title: 'Warning',
                    type: 'Message',
                    state: 'Warning',
                    content: new Text({
                        text: 'You are already stamped out. Are you sure you want to stamp out again?'
                    }),
                    beginButton: new Button({
                        text: 'Stamp Out',
                        press: function () {
                            dialog.close();
                            localStorage.setItem("stamps"+Date.now(), "Out"+Date.now());
                            this.generateMessageStrip("Success");
                         //   MessageToast.show("successfully saved");
                        }
                    }),
                    endButton: new Button({
                        text: 'cancel',
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


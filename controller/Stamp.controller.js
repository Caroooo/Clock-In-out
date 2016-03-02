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
    'sap/m/Text'

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

                MessageToast.show("successfully saved");

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

        onClockOut: function () {

            if(stampedIn == true){

                MessageToast.show("successfully saved");

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



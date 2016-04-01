/**
 * Created by Caroline on 02.02.2016.
 */

sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/SimpleType',
    'sap/ui/model/ValidateException',
    'sap/ui/model/json/JSONModel'
], function (jQuery, MessageBox, MessageToast, Controller, SimpleType, ValidateException, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Login", {


        onInit: function () {
            this.getView().setModel(new JSONModel({
                number: ""
            }));

            // attach handlers for validation errors
            sap.ui.getCore().attachValidationError(function (evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("Error");
                }
            });
            sap.ui.getCore().attachValidationSuccess(function (evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("None");
                }
            });
        },

        onLogin : function (evt) {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("main");

            //// collect input controls
            //var view = this.getView();
            //var inputs = [
            //    view.byId("numberInput"),
            //    view.byId("passwordInput")
            //];
            //
            //// check that inputs are not empty
            //// this does not happen during data binding as this is only triggered by changes
            //jQuery.each(inputs, function (i, input) {
            //    if (!input.getValue()) {
            //        input.setValueState("Error");
            //    }
            //});
            //
            //// check states of inputs
            //var canContinue = true;
            //jQuery.each(inputs, function (i, input) {
            //    if ("Error" === input.getValueState()) {
            //        canContinue = false;
            //        return false;
            //    }
            //});
            //
            //// output result
            //if (canContinue) {
            //    MessageToast.show("The input is correct. You could now continue to the next screen.");
            //} else {
            //    jQuery.sap.require("sap.m.MessageBox");
            //    MessageBox.alert("Complete your input first.");
            //}
        }

    });
});

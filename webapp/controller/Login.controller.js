sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/demo/wt/ws/WsLogon',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/SimpleType',
    'sap/ui/model/ValidateException',
    'sap/ui/model/json/JSONModel' ], function(jQuery, MessageBox, MessageToast, WsLogon, Controller, SimpleType, ValidateException, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Login", {

        onInit: function() {
            this.config = new sap.ui.core.Configuration();

            this.getView().setModel(new JSONModel());

            this.loginWebService = new WsLogon();

            // attach handlers for validation errors
            sap.ui.getCore().attachValidationError(function(evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("Error");
                }
            });
            sap.ui.getCore().attachValidationSuccess(function(evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("None");
                }
            });
        },

        onLogin: function(evt) {

            var component = this.getOwnerComponent();

            // collect input controls
            var that = this;
            var model = this.getView().getModel();
            var userid = model.getProperty("/userid");
            var password = b64_md5(model.getProperty("/password"));
            console.log("username: " + userid + ", password: " + password);

            var userContext = component.getModel("userContext");
            userContext.setProperty("/username", userid);
            userContext.setProperty("/password", password);

            this.loginWebService.send(userContext).done(function(newUserContext) {
                component.setModel(newUserContext, "userContext");
                if (component.isLoggedIn() === true) {
                    component.getRouter().navTo("main");
                } else {
                    MessageBox.error("Logon Failed. Please check username/password and try again.");
                }
            });

        }

    });
});
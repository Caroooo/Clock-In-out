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
    return Controller.extend("sap.ui.demo.wt.controller.Login2", {


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

        onLogin: function (evt) {

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
            this.sendRequest(null, null);

        },
        sendRequest: function (username, password) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {

                // Check if the XMLHttpRequest object has a "withCredentials" property.
                // "withCredentials" only exists on XMLHTTPRequest2 objects.
                console.log("with credentials");
                xhr.open("POST", "https://e-services.blum.com/SUS1001/services/SUS", true);

            } else if (typeof XDomainRequest != "undefined") {

                // Otherwise, check if XDomainRequest.
                // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                xhr = new XDomainRequest();
                console.log("xdomainrequest != undefined");
                xhr.open("POST", "https://e-services.blum.com/SUS1001/services/SUS");

            } else {

                // Otherwise, CORS is not supported by the browser.
                xhr = null;
                console.log("Cors not supported");

            }
            if (!xhr) {
                alert("An Error occurred when trying to initialize XMLHttpRequest!");
                return; // exit
            }

            xhr.onload = function() {
                var responseText = xhr.responseText;
                console.log("response text=" +responseText);
                // process the response.
            };

            xhr.onerror = function() {
                console.log('There was an error!');
                alert("there was an error!");
            };

            xhr.onreadystatechange = this.sendRequest_callback(xhr);
            // xhr.open("POST", "https://e-services.blum.com/SUS1001/services/SUS", true);
            xhr.setRequestHeader("Content-Type", "application/soap+xml; charset=utf-8; action=urn:logon;");
            //content-type application/xml
            //  xhr.setRequestHeader("Host", "https://e-services.blum.com/");
            xhr.send("<soapenv:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:ser=\"http://services.ws.sus.blum.com\" xmlns:xsd=\"http://ws.utils.framework.blum.com/xsd\">"
                +"<soap:Header>"
                +"<wsse:Security>"
                +"<wsse:UsernameToken>"
                +"<wsse:Username></wsse:Username>"
                +"<wsse:Password></wsse:Password>"
                +"</wsse:UsernameToken>"
                +"</wsse:Security>"
                +"</soap:Header>"
                + "<soap:Body>"
                + "<ser:logon>"
                + "<ser:reqHeader>"
                + "<xsd:callAppl>Zeiterfassung</xsd:callAppl>"
                + "<xsd:consumer></xsd:consumer>"
                + "<xsd:function></xsd:function>"
                + "<xsd:language>de</xsd:language>"
                + "<xsd:locale></xsd:locale>"
                + "<xsd:maxRows></xsd:maxRows>"
                + "<xsd:password></xsd:password>"
                + "<xsd:readFrom></xsd:readFrom>"
                + "<xsd:sequenceId></xsd:sequenceId>"
                + "<xsd:username></xsd:username>"
                + "</ser:reqHeader>"
                + "</ser:logon>"
                + "</soap:Body>"
                + "</soap:Envelope>");
            // alert(xhr.responseXML);

        },
        sendRequest_callback: function (xhr) {
            if ((xhr.readyState == 4) && (xhr.status == 200)) {
                document.getElementById("demo").innerHTML = xhr.responseText;
                document.title = xhr.responseText;
            }
        }

    });
});
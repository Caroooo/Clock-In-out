/**
 * Created by Caroline on 12.04.2016.
 */

sap.ui.define([
    "jquery.sap.global",
    "./WsConstants",
    "./WebService",
    "../model/SOAPModel",
    "sap/ui/model/json/JSONModel" ], function(jQuery, WsConstants, WebService, SOAPModel, JSONModel) {
    "use strict";

    var REQUEST_TEMPATE_PATH = "/ws/login.request.xml";

    var requestTemplate;

    var WsLogon = WebService.extend("sap.ui.demo.wt.ws.WSLogon", {

        constructor: function() {
            var that = this;
            this.loadRequestTemplate(REQUEST_TEMPATE_PATH).success(function(xml) {
                that.requestTemplate = $(xml);
            });
            this.soapModel = new SOAPModel(WsConstants.LOGON_WS_URL, WsConstants.WS_USER, WsConstants.WS_PWD);
        }

    });

    WsLogon.prototype.send = function(userContext) {
        var that = this;
        var deferred = jQuery.Deferred();

        // requestTemplate.find("consumer").text(loginData.consumer);
        // requestTemplate.find("language").text(loginData.language);
        // requestTemplate.find("locale").text(loginData.locale);
        // requestTemplate.find("username").text(loginData.username);
        // requestTemplate.find("password").text(loginData.password);

        var userContextData = userContext.getData();
        var keys = Object.keys(userContextData);
        keys.forEach(function(key) {
            that.requestTemplate.find(key).text(userContextData[key]);
        })

        this.soapModel.loadData(this.requestTemplate[0]).done(function(data) {

            var respHeader = data.find("respHeader");
            var respHeader = {
                language: that.getXmlValue(respHeader, "language"),
                more: that.getXmlValue(respHeader, "more"),
                sequenceId: that.getXmlValue(respHeader, "sequenceId"),
            }

            //saving the login Result in a simple JS object (it was a dom object before)
            var loginResults = {
                country: that.getXmlValue(data, "country"),
                email: that.getXmlValue(data, "email"),
                firstname: that.getXmlValue(data, "firstname"),
                language1: that.getXmlValue(data, "language1"),
                language2: that.getXmlValue(data, "language2"),
                lastname: that.getXmlValue(data, "lastname"),
                locale: that.getXmlValue(data, "locale"),
                logonResult: that.getXmlValue(data, "logonResult"),
                measureSystem: that.getXmlValue(data, "measureSystem"),
                respHeader: respHeader,
                tickedId: that.getXmlValue(data, "tickedId"),
                userType: that.getXmlValue(data, "userType"),
                username: that.getXmlValue(data, "username"),
            };
            deferred.resolve(new JSONModel(loginResults));
        });

        return deferred.promise();
    }

    return WsLogon;

});
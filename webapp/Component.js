/**
 * Created by Caroline on 01.02.2016.
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"], function (UIComponent, JSONModel) {
    "use strict";
    var Component = UIComponent.extend("sap.ui.demo.wt.Component", {
        metadata: {
            manifest: "json"
        }
    });

    Component.prototype.init = function () {

        UIComponent.prototype.init.apply(this, arguments);

        // model for Date and Time
        var oData = {
            myDate: new Date()
        };

        var oModel = new JSONModel(oData);
        this.setModel(oModel);

        function updateTime() {
            oModel.updateCurrentTime;
            oModel.setData({"myDate": new Date()});
            oModel.updateBindings();
        }

        setInterval(updateTime, 1000);

        var outboxModel = new JSONModel();
        this.setModel(outboxModel, "outbox");
        var outboxStr = localStorage.getItem("outbox");
        if (outboxStr) {
            outboxModel.setData(JSON.parse(outboxStr));

        } else {
            outboxModel.setData([]);
        }

        var credentialModel = new JSONModel();
        this.setModel(credentialModel, "credential");
        var credentialStr = localStorage.getItem("credential");
        if (credentialStr) {
            credentialModel.setData(JSON.parse(credentialStr));

        } else {
            credentialModel.setData([]);
        }


        var configuration = new sap.ui.core.Configuration();
        var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;

        //model for usercontext --> login
        var userContext = new JSONModel({
            "callAppl": sNamespace,
            "language": configuration.getLocale().getLanguage(),
            "locale": configuration.getLocale().toString()
        });
        this.setModel(userContext, "userContext");

        // create the views based on the url/hash
        this.getRouter().initialize();

    };

    Component.prototype.saveOutbox = function () {
        var outboxData = this.getModel("outbox").getData();
        localStorage.setItem("outbox", JSON.stringify(outboxData));
    };
    Component.prototype.saveCredentials = function (username, password) {
        var credentialData = {
            username: username,
            password: password
        };
        //var credentialData = this.getModel("credential").getData();
        localStorage.setItem("credential", JSON.stringify(credentialData));
    };

    /*
     * A Convinience method, that simply looks at the current userContext for login status returns boolean true if user is logged in.
     */
    Component.prototype.isLoggedIn = function () {
        return this.getModel("userContext").getProperty("/logonResult") === "OK";
    };

});
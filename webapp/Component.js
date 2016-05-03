/**
 * Created by Caroline on 01.02.2016.
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/wt/ws/WsCreateTimeEvent",
    "sap/ui/demo/wt/ws/WsLogon"], function (UIComponent, JSONModel, WsCreateTimeEvent, WsLogon) {
    "use strict";
    var Component = UIComponent.extend("sap.ui.demo.wt.Component", {
        metadata: {
            manifest: "json"
        }
    });

    Component.prototype.init = function () {

        UIComponent.prototype.init.apply(this, arguments);

        this.wsLogon = new WsLogon(); // loading this, so I know it will be fully initialized and ready to use if I need it (it needs time to load the
        // request.xml)
        this.wsCreateTimeEvent = new WsCreateTimeEvent();

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
            "locale": configuration.getLocale().toString(),
        });

        var credentials = this.getCredentials();
        if (credentials && credentials.username) {
            userContext.setProperty("/username", credentials.username);
            userContext.setProperty("/password", credentials.password);
        }
        this.setModel(userContext, "userContext");

        // create the views based on the url/hash
        this.getRouter().initialize();

        //check if credentials are saved
        if (credentials.username && credentials.password) {
            this.sendOutbox(); //will maybe fail --> fix it!
            this.getRouter().navTo("main");
        } else {
            this.getRouter().navTo("login");
        }


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

    Component.prototype.getCredentials = function () {
        var credentialStr = localStorage.getItem("credential");
        if (credentialStr) {
            return JSON.parse(credentialStr);
        }else{
            return {};
        }

    };

    /*
     * A Convinience method, that simply looks at the current userContext for login status returns boolean true if user is logged in.
     */
    Component.prototype.isLoggedIn = function () {
        return this.getModel("userContext").getProperty("/logonResult") === "OK";
    };

    Component.prototype.isConnected = function () {

        return false;
    };

    Component.prototype.sendOutbox = function () {
        var deferred = jQuery.Deferred();
        var timeEvents = this.getModel("outbox");
        var userContext = this.getModel("userContext");
        var that = this;

        //if timeEvents actually have data...
        if (timeEvents.getData() && timeEvents.getData().length > 0) {
            //check if we are connected, if so, try login and send
            if (this.isConnected() === true) {
                this.wsLogon.send(userContext).done(function (newUserContext) {
                    that.setModel(newUserContext, "userContext");
                    if (that.isLoggedIn() === true) {
                        that.wsCreateTimeEvent.send(userContext, timeEvents).done(function (result) {
                            if (result.text === "successfully processed") {
                                that.clearOutbox(timeEvents);
                                deferred.resolve({outcome: "sentToServer", message: "All records succesfully sent"});
                            } else {
                                //error handling!!!
                                console.error("FAILED SEND OUTBOX " + result.text);
                                deferred.reject({
                                    outcome: "failedOutboxSend",
                                    message: "User no logged in, re-routing to login page"
                                });
                            }
                        });
                    } else {
                        deferred.reject({
                            outcome: "silentLoginFail",
                            message: "User no logged in, re-routing to login page"
                        });
                        that.getRouter().navTo("login");
                    }
                });
            } else {
                deferred.resolve({outcome: "savedLocally", message: "Not Conencted"});
            }
        }
        return deferred.promise;
    };
    Component.prototype.clearOutbox = function (outboxModel) {
        //clear outbox and save in history
        outboxModel.setData([]);
    }

});
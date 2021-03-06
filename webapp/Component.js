/**
 * Created by Caroline on 01.02.2016.
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/wt/ws/WsCreateTimeEvent",
    "sap/ui/demo/wt/ws/WsLogon",
    "sap/m/NavContainer"], function (UIComponent, JSONModel, WsCreateTimeEvent, WsLogon, NavContainer) {
    "use strict";
    var Component = UIComponent.extend("sap.ui.demo.wt.Component", {
        metadata: {
            manifest: "json"
        }
    });

    Component.prototype.init = function () {
        //swipe
        this._setUpSwipeAnimations();

        UIComponent.prototype.init.apply(this, arguments);

        this.wsLogon = new WsLogon();
        this.wsCreateTimeEvent = new WsCreateTimeEvent();


        // model for Date and Time in StampView
        var oData = {
            myDate: new Date()
        };
        var oModel = new JSONModel(oData);
        this.setModel(oModel);

        //update Time every second
        function updateTime() {
            oModel.updateCurrentTime;
            oModel.setData({
                "myDate": new Date()
            });
            oModel.updateBindings();
        }
        setInterval(updateTime, 1000);

        //model for Outbox, get Data from localStorage
        var outboxModel = new JSONModel();
        this.setModel(outboxModel, "outbox");
        var outboxStr = localStorage.getItem("outbox");
        if (outboxStr) {
            outboxModel.setData(JSON.parse(outboxStr));
        } else {
            outboxModel.setData([]);
        }

        //credential Model, get Credentials from LocalStorage
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

        // model for usercontext --> login
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

        // check if credentials are saved and route to the right page
        if (credentials.username && credentials.password) {
            this.sendOutbox();
            this.getRouter().navTo("main");
        } else {
            this.getRouter().navTo("login");
        }

        // hisotry model
        var historyModel = new JSONModel();
        this.setModel(historyModel, "history");
        var historyStr = localStorage.getItem("history");
        if (historyStr) {
            historyModel.setData(JSON.parse(historyStr));
        } else {
            historyModel.setData([]);
        }

        // connection model for testing
        var connectionModel = new JSONModel();
        this.setModel(connectionModel, "connection");
        connectionModel.setData(true);

    };

    Component.prototype.saveOutbox = function () {
        var outboxData = this.getModel("outbox").getData();
        localStorage.setItem("outbox", JSON.stringify(outboxData));
    };

    Component.prototype.saveHistory = function () {
        var histData = this.getModel("history").getData();
        localStorage.setItem("history", JSON.stringify(histData));
    };
    Component.prototype.saveCredentials = function (username, password) {
        var credentialData = {
            username: username,
            password: password
        };
        localStorage.setItem("credential", JSON.stringify(credentialData));
    };

    Component.prototype.getCredentials = function () {
        var credentialStr = localStorage.getItem("credential");
        if (credentialStr) {
            return JSON.parse(credentialStr);
        } else {
            return {};
        }

    };

    Component.prototype.isLoggedIn = function () {
        return this.getModel("userContext").getProperty("/logonResult") === "OK";
    };

    Component.prototype.isConnected = function () {
        if (navigator.connection) {
            if (this.checkConnection() == "none") {
                return false;
            } else {
                return true;
            }

        } else {
            var model = this.getModel("connection");
            if (model.getData() === true) {
                console.log("you have connection");
                return true;
            } else {
                console.log("you dont have connection");
                return false;
            }
        }
    };
    Component.prototype.checkConnection = function () {
        var networkState = navigator.connection.type;
        var states = {};
        states[navigator.connection.UNKNOWN] = 'Unknown connection';
        states[navigator.connection.ETHERNET] = 'Ethernet connection';
        states[navigator.connection.WIFI] = 'WiFi connection';
        states[navigator.connection.CELL_2G] = 'Cell 2G connection';
        states[navigator.connection.CELL_3G] = 'Cell 3G connection';
        states[navigator.connection.CELL_4G] = 'Cell 4G connection';
        states[navigator.connection.NONE] = 'No network connection';
        return networkState;
    };

    Component.prototype.sendOutbox = function () {
        var deferred = jQuery.Deferred();
        var timeEvents = this.getModel("outbox");
        var userContext = this.getModel("userContext");
        var that = this;

        // read from i18n
        var oBundle = this.getModel("i18n").getResourceBundle();
        var successSentMsg = oBundle.getText("successSentMsg");
        var noConnectionMsg = oBundle.getText("noConnectionMsg");
        var problemMsg = oBundle.getText("problemMsg")
        var problemLoginMsg = oBundle.getText("problemLoginMsg");

        var sendTimeEvents = function (userContext, timeEvents) {
            that.wsCreateTimeEvent.send(userContext, timeEvents).done(function (result) {
                if (result.text === "successfully processed") {
                    that.clearOutbox(timeEvents);
                    deferred.resolve({
                        outcome: "sentToServer",
                        message: successSentMsg
                    });
                } else {
                    // error handling!!!
                    console.error("FAILED SEND OUTBOX " + result.text);
                    deferred.reject({
                        outcome: "failedOutboxSend",
                        message: problemMsg
                    });
                }
            });
        }

        // if timeEvents actually have data...
        if (timeEvents.getData() && timeEvents.getData().length > 0) {
            // check if we are connected, if so, try login and send
            if (this.isConnected() === true) {

                if (this.isLoggedIn() === true) {
                    sendTimeEvents(userContext, timeEvents);
                } else {
                    this.wsLogon.send(userContext).done(function (newUserContext) {
                        that.setModel(newUserContext, "userContext");
                        if (that.isLoggedIn() === true) {
                            sendTimeEvents(newUserContext, timeEvents);
                        } else {
                            console.error("NOT LOGGED IN");
                            deferred.reject({
                                outcome: "silentLoginFail",
                                message: problemLoginMsg
                            });
                            that.getRouter().navTo("login");
                        }
                    });
                }

            } else {
                deferred.resolve({
                    outcome: "savedLocally",
                    message: noConnectionMsg
                });
            }
        }
        return deferred.promise();
    };
    Component.prototype.clearOutbox = function (outboxModel) {
        //clear outbox and save in history
        var hisModel = this.getModel("history");

        if (outboxModel && outboxModel.getData() && outboxModel.getData().length > 0) {
            console.log("outmodel != null");
            localStorage.setItem("history", JSON.stringify(outboxModel.getData()));

            outboxModel.getData().forEach(function (element) {
                hisModel.getData().push(element);
            });

            this.saveHistory();
            localStorage.removeItem("outbox");
            hisModel.updateBindings();
        }
        outboxModel.setData([]);
        outboxModel.updateBindings();


    };
    //swipe
    Component.prototype._setUpSwipeAnimations = function() {

        console.log("NavCon: "+ NavContainer);
        console.log("transitions: " +NavContainer.transitions);
        console.log("slide: " +NavContainer.transitions.slide);

        var slide = NavContainer.transitions.slide;

        NavContainer.transitions["slide-left"] = slide;
        NavContainer.transitions["slide-right"] = {
            to: slide.back,
            back: slide.to
        };
    };

});
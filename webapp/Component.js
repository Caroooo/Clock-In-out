/**
 * Created by Caroline on 01.02.2016.
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel" ], function(UIComponent, JSONModel) {
    "use strict";
    var Component = UIComponent.extend("sap.ui.demo.wt.Component", {
        metadata: {
            manifest: "json"
        }
    });

    Component.prototype.init = function() {

        UIComponent.prototype.init.apply(this, arguments);

        // set current date to datepicker
        var oData = {
            myDate: new Date()
        };
        var oModel = new JSONModel(oData);
        this.setModel(oModel);

        // // set i18n model on view
        // var i18nModel = new ResourceModel({
        // bundleName: "sap.ui.demo.wt.i18n.i18n"
        // });
        // this.setModel(i18nModel, "i18n");

        // set invoice model - local
        var oConfig = this.getMetadata().getConfig();
        var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
        var oOutboxModel = new JSONModel(jQuery.sap.getModulePath(sNamespace, oConfig.outboxLocal));
        this.setModel(oOutboxModel, "out");

        var configuration = new sap.ui.core.Configuration()

        var userContext = new JSONModel({
            "callAppl": sNamespace,
            "language": configuration.getLocale().getLanguage(),
            "locale": configuration.getLocale().toString()
        });
        this.setModel(userContext, "userContext");

        // create the views based on the url/hash
        this.getRouter().initialize();

    }

    /*
     * A Convinience method, that simply looks at the current userContext for login status returns boolean true if user is logged in.
     */
    Component.prototype.isLoggedIn = function() {
        return this.getModel("userContext").getProperty("/logonResult") === "OK";
    }

});
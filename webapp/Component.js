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

        // model for Date and Time
        var oData = {
            myDate: new Date()
            //,savedBookings: null
        };

        //var savedItems = { savedItems: new Array(localStorage.length)};
        //for (var i = 0; i < localStorage.length; i++){
        //    savedItems[i]= JSON.parse(localStorage.getItem(localStorage.key(i)));
        //    console.log(savedItems[i]);
        //}
        //
        //oData.savedBookings = savedItems;

        var oModel = new JSONModel(oData);
        this.setModel(oModel);


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

    }

    /*
     * A Convinience method, that simply looks at the current userContext for login status returns boolean true if user is logged in.
     */
    Component.prototype.isLoggedIn = function() {
        return this.getModel("userContext").getProperty("/logonResult") === "OK";
    }

});
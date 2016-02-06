/**
 * Created by Caroline on 31.01.2016.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Outbox", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
             //set data model
            var oData = {
                recipient : {
                    name : "World"
                }
            };
            var oModel = new JSONModel();
            this.setModel(oModel);
            // set invoice model - local
            //var oConfig = this.getMetadata().getConfig();
            //var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
            //var oOutboxModel = new JSONModel(jQuery.sap.getModulePath(sNamespace, oConfig.outboxLocal));
            //this.setModel(oOutboxModel, "outbox");
        }

    });
});
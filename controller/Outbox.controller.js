/**
 * Created by Caroline on 31.01.2016.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function ( Controller, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Outbox", {
        metadata : {
            manifest: "json"
        },
        init : function () {

            // set explored app's demo model on this sample
            var oConfig = this.getMetadata().getConfig();
            var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
            var oOutboxModel = new JSONModel(jQuery.sap.getModulePath(sNamespace, oConfig.outboxLocal));
            this.setModel(oOutboxModel, "outbox");
        }

    });
});
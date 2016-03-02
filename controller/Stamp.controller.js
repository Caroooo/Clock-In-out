/**
 * Created by Caroline on 31.01.2016.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageStrip"

], function (Controller, JSONModel, MessageToast, MessageStrip) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Stamp", {

        onInit: function () {
            // create model
            var oModel = new JSONModel();
            oModel.setData({
                myDate: new Date()
            });
            this.getView().setModel(oModel);

            this.byId("TP3").setDateValue(new Date());

            this._iEvent = 0;
        },

        handleChange: function (oEvent) {
            var oText = this.byId("T3");
            var oTP = oEvent.oSource;
            var sValue = oEvent.getParameter("value");
            var bValid = oEvent.getParameter("valid");
            this._iEvent++;

            if (bValid) {
                oTP.setValueState(sap.ui.core.ValueState.None);
            } else {
                oTP.setValueState(sap.ui.core.ValueState.Error);
            }
        },

        onClockIn: function () {

            var oDraftIndi = this.getView().byId("draftIndi");

            oDraftIndi.showDraftSaving();
            oDraftIndi.showDraftSaved();
            oDraftIndi.clearDraftState();
        },

        onClockOut: function () {

            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sMsg = oBundle.getText("clockOutMsg");
            // show message
            MessageToast.show("saving...");
            MessageToast.setStyle("sapMMsgStripSuccess");
            MessageToast.show("successfully saved");
        }
    });
});



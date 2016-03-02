/**
 * Created by Caroline on 31.01.2016.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Main", {



        handlePressConfiguration: function(oEvent) {
            var oItem = oEvent.getSource();
            var oShell = this.getView().byId("myShell");
            var bState = oShell.getShowPane();
            oShell.setShowPane(!bState);
          //  oItem.setShowMarker(!bState);
            // oItem.setSelected(!bState);

        },

        onLogout : function(oEvent){
            var oShell = this.getView().byId("myShell");
            var bState = oShell.getShowPane();
            oShell.setShowPane(!bState);


            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("login");
        }

    });
});
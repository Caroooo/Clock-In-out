/**
 * Created by Caroline on 31.01.2016.
 */


sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Main", {


        handlePressConfiguration : function(oEvent) {
            var oItem = oEvent.getSource();
            var oShell = this.getView().byId("myShell");
            var bState = oShell.getShowPane();
            oShell.setShowPane(!bState);
            if(bState == false){
                //make view disable
               // var x = document.getElementById("idIconTabBarSeparatorNoIcon");
               // x.setAttribute("disable", "true");
                console.log("menu open");
            }else{
                //make view able
                console.log("menu closed");
            }
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
/**
 * Created by Caroline on 31.01.2016.
 */


sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Main", {
        onInit: function () {
            //var username = JSON.parse(localStorage.getItem("credential")).username;
            //console.log("CREDENTIALS: " +username);


            //if connected and outbox not empty,
                    //send Outbox

        },

        handlePressConfiguration: function(oEvent) {
            var oItem = oEvent.getSource();
            var oShell = this.getView().byId("myShell");
            var bState = oShell.getShowPane();
            oShell.setShowPane(!bState);
            if (bState === false){
                oShell.$().find(".sapUiUfdSpltContCanvas").append("<div class='shellOverlay'></div>");
                oShell.$().find(".sapUiUfdSpltContCanvas .shellOverlay").one("click", function(){
                    oShell.setShowPane(false);
                    oShell.$().find(".sapUiUfdSpltContCanvas .shellOverlay").remove();
                });
            }else{
                oShell.$().find(".sapUiUfdSpltContCanvas .shellOverlay").remove();
            }
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
/**
 * Created by Caroline on 31.01.2016.
 */


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/IconTabBar",
    "jquery.sap.global"
], function (Controller,IconTabBar, jQuery) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Main", {
        onInit: function () {

            this.getOwnerComponent().sendOutbox()

            //swipe
            this._setupTransitions();
        },
        //needed for testing on computer --> switch to turn on and off internet-connection. Not needed for mobile app
        change : function(oControlEvent){
            var model = this.getOwnerComponent().getModel("connection");

            if(oControlEvent.getParameters().state === true){
                console.log("switch changed: TRUE");
                model.setData(true);
            }else{
                console.log("switch changed: FALSE");
                model.setData(false);
            }
        },
        //open/close Menu
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
            localStorage.removeItem("credential");
            oRouter.navTo("login");
        },
        //swipe
        _setupTransitions: function() {
            console.log("setUpTransition started!");
            $('body').on('swipeleft', '.swipe-page', function(e) {
                this._navigate(e.currentTarget.id, 'left');
            }.bind(this));
            $('body').on('swiperight', '.swipe-page', function(e) {
                this._navigate(e.currentTarget.id, 'right');
            }.bind(this));
        },
        //swipe
        _navigate: function(id, direction) {
            console.log("navigate started");
            var actualTabKey = parseInt(this.byId('idIconTabBarSeparatorNoIcon').getSelectedKey().substring(8,9));
            if(direction === 'left' && actualTabKey < 2){
                var nextTabKey = actualTabKey + 1;
            }else if(actualTabKey > 0){
                var nextTabKey = actualTabKey - 1;
            }else{
                var nextTabKey = actualTabKey;
            }

            this.byId('idIconTabBarSeparatorNoIcon').setSelectedKey("__filter" + (nextTabKey));
        }

    });
});
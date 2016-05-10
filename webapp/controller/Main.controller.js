/**
 * Created by Caroline on 31.01.2016.
 */


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'jquery.sap.global'
], function (Controller, jQuery) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Main", {
        onInit: function () {

            this.getOwnerComponent().sendOutbox();
            this._setupTransitions();
        },
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
        _setupTransitions: function() {
            $('body').on('swipeleft', '.swipe-page', function(e) {
                this._navigate(e.currentTarget.parentNode.id, 'left');
            }.bind(this));
            $('body').on('swiperight', '.swipe-page', function(e) {
                this._navigate(e.currentTarget.parentNode.id, 'right');
            }.bind(this));
        },
        _navigate: function(id, direction) {
            var newId, match, add;
            match = id.match(/.*swipe-page([0-9]{1,}$)/);
            add = (direction === 'left') ? 1 : -1
            if (match && match.length > 1) {
                newId = this.createId('swipe-page' + (Number(match[1]) + add));
                this.byId('viewPadding').to(newId, 'slide-' + direction);
            }
        }

    });
});
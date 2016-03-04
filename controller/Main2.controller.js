/**
 * Created by Caroline on 04.03.2016.
 */
sap.ui.define([
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller'
], function(MessageToast, Fragment, Controller) {
    "use strict";

    return Controller.extend("sap.ui.demo.wt.controller.Main2", {

        init: function(){
            this.byId("openMenu").attachBrowserEvent("tab keyup", function(oEvent){
                this._bKeyboard = oEvent.type == "keyup";
            }, this);
        },

        handlePressOpenMenu: function(oEvent) {
            var oButton = oEvent.getSource();

            // create menu only once
            if (!this._menu) {
                this._menu = sap.ui.xmlfragment(
                    "sap.ui.demo.wt.view.Menu",
                    this
                );
                this.getView().addDependent(this._menu);
            }

            var eDock = sap.ui.core.Popup.Dock;
            this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
        },

        handleMenuItemPress: function(oEvent) {
            if(oEvent.getParameter("item").getSubmenu()) {
                return;
            }

            var msg = "";
            if(oEvent.getParameter("item").getMetadata().getName() == "sap.ui.unified.MenuTextFieldItem") {
                msg = "'" + oEvent.getParameter("item").getValue() + "' entered";
            }
            else {
                msg = "'" + oEvent.getParameter("item").getText() + "' pressed";
            }

            MessageToast.show(msg);
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
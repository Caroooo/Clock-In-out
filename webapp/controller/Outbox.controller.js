/**
 * Created by Caroline on 31.01.2016.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function ( Controller, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.Outbox", {

        onInit : function () {

            var oData = {
                savedBookings: null
            };

            var oSavedItems = { savedItems: new Array(localStorage.length)};
            for (var i = 0; i < localStorage.length; i++){
                oSavedItems[i]= JSON.parse(localStorage.getItem(localStorage.key(i)));
                console.log(oSavedItems[i]);
            }

            oData.savedBookings = oSavedItems;

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);

            //this.loadData();
            //var list = this.getView().byId("outboxList");

            //list.bindObject({
            //    path : "/savedBookings",
            //    //sorter : new sap.ui.model.Sorter("date"),
            //    template : new sap.m.ObjectListItem({
            //        title: "{type}",
            //        description: "{time}"
            //    })
            //});

            //var binding = new sap.ui.model.Binding(oModel, "/savedBookings", oModel.getContext("/"));
            //binding.attachChange(function(){
            //    this.loadData();
            //});

        },

        handleRefresh : function (evt) {
            var that = this;
            this.loadData();
            setTimeout(function () {
                that.getView().byId("pullToRefresh").hide();
            }, 1000);
        },

        loadData : function(){

            var savedItems = { savedItems: new Array(localStorage.length)};
            for (var i = 0; i < localStorage.length; i++){
                savedItems[i]= JSON.parse(localStorage.getItem(localStorage.key(i)));
                console.log(savedItems[i]);
            }

            var oData = this.getView().getModel();
            //oData.savedBookings = savedItems;

            oData.setProperty("/savedBookings", savedItems);

            this.getView().setModel(oData);
        }

    });
});
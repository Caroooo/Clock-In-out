
sap.ui.define([
    "sap/ui/base/EventProvider",
    "sap/ui/demo/wt/model/soap/SOAPModel" ], function(EventProvider, SOAPModel) {
    "use strict";

    // Super class for the webservices
    var WebService = EventProvider.extend("sap.ui.demo.wt.webservices.WebService", {});


    WebService.prototype.loadRequestTemplate = function(path) {
        return jQuery.ajax({
            type: "GET",
            url: path,
            dataType: "xml",
        });
    }

    WebService.prototype.getXmlValue = function(xml, tagname) {
        return xml.find(tagname).text();
    }

    return WebService;

});
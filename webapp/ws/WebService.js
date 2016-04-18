/**
 * Created by Caroline on 12.04.2016.
 */

sap.ui.define([
    "sap/ui/base/EventProvider",
    "../model/SOAPModel" ], function(EventProvider, SOAPModel) {
    "use strict";

    //Super class for the webservices
    var WebService = EventProvider.extend("sap.ui.demo.wt.ws.WebService", {});

    WebService.prototype.loadRequestTemplate = function(path) {
        return jQuery.ajax({
            type: "GET",
            url: path,
            dataType: "xml",
        });
    }

   //find a tag in the webservice request xml and sets value to it
    WebService.prototype.getXmlValue = function(xml, tagname) {
        return xml.find(tagname).text();
    }

    return WebService;

});
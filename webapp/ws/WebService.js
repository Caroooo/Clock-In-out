/**
 * Created by Caroline on 12.04.2016.
 */

sap.ui.define([
    "sap/ui/base/EventProvider",
    "../model/soap/SOAPModel" ], function(EventProvider, SOAPModel) {
    "use strict";

    /*
     * Super class for the webservices, expected it to fill up with a lot more stuff, now it hardly seems worth it. Extended by WsCreateTimeEvent & WsLogon
     */
    var WebService = EventProvider.extend("sap.ui.demo.wt.webservices.WebService", {});

    /*
     * In order to make the code a little more readable, and easier to edit, validate and change the requests we want to send as WebService Requests, each request is
     * stored as an xml document, which is loaded when the WebService Class is constructed. This could certainly be improved upon. Perhaps the WebService Constructor
     * could take the path to the request and load it automatically. Then subclasses would only need call getRequestTemplate() and they receive a "clone" of the
     * template and fill it in.
     */
    WebService.prototype.loadRequestTemplate = function(path) {
        return jQuery.ajax({
            type: "GET",
            url: path,
            dataType: "xml",
        });
    }

    /*
     * Convenience method to retrieve the text value from an XML Dom element. Done it this way in case .text() needed to be changed, this way I can change it in one
     * place.
     */
    WebService.prototype.getXmlValue = function(xml, tagname) {
        return xml.find(tagname).text();
    }

    return WebService;

});
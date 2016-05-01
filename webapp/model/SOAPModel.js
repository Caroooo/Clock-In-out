sap.ui.define([
        "jquery.sap.global",
        "sap/ui/model/ClientModel",
        "../../ws/WsConstants" ],

    function(jQuery, ClientModel, WsConstants) {
        "use strict";

        var createNonce = function() {
            var nonceLength = 24;
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/=+-";
            for (var i = 0; i < nonceLength; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return btoa(text);
        }

        var setSecurityHeader = function($wsRequest) {

            var $securityUserToken = $wsRequest.find("UsernameToken");
            $securityUserToken.find("Username").text(WsConstants.WS_USER);
            $securityUserToken.find("Password").text(WsConstants.WS_PWD);
            $securityUserToken.find("Nonce").text(createNonce);
            $securityUserToken.find("Created").text(new Date().toISOString());

        }

        /**
         * Constructor for a new SOAPModel. The soap model loads soap template which forms the basis of the SOAP Request. The template is populated with the relevant
         * data and then sent. What comes back, is converted to JSON data that can be read via getProperty()
         *
         * @author
         *
         * @param {string} url URL for the REST API
         * @constructor
         * @public
         */
        var SOAPModel = ClientModel.extend("sap.ui.demo.wt.model.soap.SOAPModel", /** @lends sap.ui.demo.wt.model.soap.SOAPModel.prototype */
            {
                constructor: function(url, wsUser, wsPwd) {
                    this.url = url;
                    this.wsUser = wsUser;
                    this.wsPwd = wsPwd;
                    ClientModel.apply(this);
                }
            });

        /**
         *
         * @param $wsRequest the request is a JQuery wrapped XML Dom object which represents our WS Request
         * @returns A Promise (which resolves when the request is complete).
         */
        SOAPModel.prototype.loadData = function($wsRequest) {
            var that = this;
            var deferred = jQuery.Deferred();

            setSecurityHeader($wsRequest);

            var oSerializer = new XMLSerializer();
            var sXML = oSerializer.serializeToString($wsRequest[0]);

            var ajaxRequestOptions = {
                url: this.url,
                data: sXML,
                type: 'POST',
                contentType: "application/soap+xml; charset=UTF-8;",
                dataType: "xml",
                success: function(data, status, xhr) {
                    that.logonResponse = $(data);
                    deferred.resolve(that.logonResponse);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                    deferred.reject(xhr, thrownError);
                }
            };

            /*
             * Reference for getting Authentication working for Ajax Requests (shows both JQuery way and Vanilla way)
             *
             * http://zinoui.com/blog/ajax-basic-authentication
             */
            // if (this.wsUser && this.wsPwd) {
            // ajaxRequestOptions.beforeSend = function(xhr) {
            // // xhr.setRequestHeader("Authorization", "Basic " + btoa(that.wsUser + ":" + that.wsPwd));
            // }
            // ajaxRequestOptions.withCredentials = true;
            // }
            //
            jQuery.ajax(ajaxRequestOptions);
            return deferred.promise();
        };

        SOAPModel.prototype.getProperty = function(property) {
            if (this.logonResponse) {
                return this.logonResponse.find(property).text();
            }
        }

        return SOAPModel;
    });
/**
 * Created by Caroline on 12.04.2016.
 */

sap.ui.define([
        "jquery.sap.global",
        "sap/ui/model/ClientModel" ],

    function(jQuery, ClientModel) {
        "use strict";
        var SOAPModel = ClientModel.extend("sap.ui.demo.wt.model.soap.SOAPModel",
            {
                constructor: function(url, wsUser, wsPwd) {
                    //url for webservice
                    this.url = url;
                    //username and passwort for webservice authentification
                    this.wsUser = wsUser;
                    this.wsPwd = wsPwd;
                    //parent class ClientModel constructor
                    ClientModel.apply(this);
                }
            });

        SOAPModel.prototype.loadData = function(wsRequest) {
            var that = this;
            var deferred = jQuery.Deferred();

            var oSerializer = new XMLSerializer();
            var sXML = oSerializer.serializeToString(wsRequest);

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


            if (this.wsUser && this.wsPwd) {
                ajaxRequestOptions.beforeSend = function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(that.wsUser + ":" + that.wsPwd));
                }
                ajaxRequestOptions.withCredentials = true;
            }

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
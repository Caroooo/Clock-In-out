sap.ui.define([
		"jquery.sap.global",
		"./WsConstants",
		"./WebService",
		"../model/soap/SOAPModel" ], function(jQuery, WsConstants, WebService, SOAPModel) {
	"use strict";

	var REQUEST_TEMPATE_PATH = "ws/createTimeEvent.request.xml";

	var requestTemplate;

	var WsCreateTimeEvent = WebService.extend("sap.ui.demo.wt.ws.WsCreateTimeEvent", {

		constructor: function() {
			var that = this;
			this.loadRequestTemplate(REQUEST_TEMPATE_PATH).success(function(xml) {
				that.requestTemplate = $(xml);
			});
			this.soapModel = new SOAPModel(WsConstants.CREATE_TIME_EVENT_WS_URL, WsConstants.WS_USER, WsConstants.WS_PWD);
		}

	});

	/*
	 * This function assumes user is logged in, so the caller should have checked this. Currently this check is not implemented. This function takes the userContext
	 * (stored in the Component), and a JSONModel of all time events and builds the XML Request object from this information and passes it to the SOAPModel which
	 * should send the request.
	 */
	WsCreateTimeEvent.prototype.send = function(userContext, timeEventsModel) {
		var that = this;

		var deferred = jQuery.Deferred();
		var request = that.requestTemplate.find("Envelope").clone();

		request.find("consumer").text("hybrid-app"); // this should change to something that helps identify the device (can be useful for debugging logs).
		request.find("username").text(userContext.getProperty("/username"));

		var reqInput = request.find("reqInput");
		reqInput.find("userName").text(userContext.getProperty("/username"));
		reqInput.find("ticketId").text(userContext.getProperty("/tickedId"));
		var personnelTimeEvent = reqInput.find("personnelTimeEvents").clone();
		reqInput.find("personnelTimeEvents").remove(); // pop the original.

		var timeEvents = timeEventsModel.getData();
		timeEvents.forEach(function(timeEvent) {
			var pte = personnelTimeEvent.clone();
			pte.find("logDate").text(timeEvent.Date);
			pte.find("logTime").text(timeEvent.Time);
			pte.find("timeEventType").text(timeEvent.ClockType);
			reqInput.append(pte);
		})

		this.soapModel.loadData(request).done(function(data) {
			// a very VERY basic test to see if what was sent
			// is reporting success. A more complete solution
			// would be to get (and understand) all the responses
			// that could come back (so we can handle failure cases
			// more correctly. Right now, if we don't get "success"
			// we resport error (and give no clues as to what the
			// error was - just like microsoft :-) ).
			var $data = $(data);
			var $messages = $data.find("messages");

			var result = {
				module: $messages.find("module").text(),
				number: $messages.find("number").text(),
				recordId: $messages.find("recordId").text(),
				replace: $messages.find("replace").text(),
				tagName: $messages.find("tagName").text(),
				text: $messages.find("text").text(),
				type: $messages.find("type").text(),
			}

			deferred.resolve(result);
		});

		return deferred.promise();
	}

	return WsCreateTimeEvent;

});
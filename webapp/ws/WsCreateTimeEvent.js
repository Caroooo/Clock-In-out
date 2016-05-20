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

	//user should already be logedin on this point
	WsCreateTimeEvent.prototype.send = function(userContext, timeEventsModel) {
		var that = this;

		var deferred = jQuery.Deferred();
		var request = that.requestTemplate.find("Envelope").clone();

		request.find("consumer").text("hybrid-app");
		request.find("username").text(userContext.getProperty("/username"));

		var reqInput = request.find("reqInput");
		reqInput.find("userName").text(userContext.getProperty("/username"));
		reqInput.find("ticketId").text(userContext.getProperty("/tickedId"));
		var personnelTimeEvent = reqInput.find("personnelTimeEvents").clone();
		reqInput.find("personnelTimeEvents").remove();

		var timeEvents = timeEventsModel.getData();
		timeEvents.forEach(function(timeEvent) {
			var pte = personnelTimeEvent.clone();
			pte.find("logDate").text(timeEvent.Date);
			pte.find("logTime").text(timeEvent.Time);
			pte.find("timeEventType").text(timeEvent.ClockType);
			reqInput.append(pte);
		})

		this.soapModel.loadData(request).done(function(data) {
			//check if the response is positive
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
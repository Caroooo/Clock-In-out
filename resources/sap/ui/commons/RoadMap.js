/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control'],function(q,l,C){"use strict";var R=C.extend("sap.ui.commons.RoadMap",{metadata:{library:"sap.ui.commons",properties:{numberOfVisibleSteps:{type:"int",group:"Misc",defaultValue:null},firstVisibleStep:{type:"string",group:"Misc",defaultValue:null},selectedStep:{type:"string",group:"Misc",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'}},defaultAggregation:"steps",aggregations:{steps:{type:"sap.ui.commons.RoadMapStep",multiple:true,singularName:"step"}},events:{stepSelected:{parameters:{stepId:{type:"string"}}},stepExpanded:{parameters:{stepId:{type:"string"}}}}}});(function(){R.prototype.init=function(){this.iStepWidth=-1;this.sCurrentFocusedStepRefId=null;};R.prototype.exit=function(){if(this.sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}};R.prototype.setNumberOfVisibleSteps=function(n){var i=this.getDomRef()?true:false;this.setProperty("numberOfVisibleSteps",n,i);if(i){sap.ui.commons.RoadMapRenderer.updateScrollArea(this,true);}return this;};R.prototype.setFirstVisibleStep=function(F){var i=this.getDomRef()?true:false;if(i){if(F){var S=sap.ui.getCore().byId(F);if(S&&S.getParent()&&(S.getParent()===this||S.getParent().getParent()===this)&&S.getVisible()){this.setProperty("firstVisibleStep",F,true);sap.ui.commons.RoadMapRenderer.updateScrollArea(this);}}else{this.setProperty("firstVisibleStep","",true);sap.ui.commons.RoadMapRenderer.updateScrollArea(this);}}else{this.setProperty("firstVisibleStep",F);}return this;};R.prototype.setWidth=function(w){var i=this.getDomRef()?true:false;this.setProperty("width",w,i);if(i){sap.ui.commons.RoadMapRenderer.setRoadMapWidth(this,w);sap.ui.commons.RoadMapRenderer.updateScrollArea(this,true);}return this;};R.prototype.setSelectedStep=function(S){var i=this.getDomRef()?true:false;if(i){if(S){var o=sap.ui.getCore().byId(S);if(o&&o.getParent()&&(o.getParent()===this||o.getParent().getParent()===this)&&o.getEnabled()&&o.getVisible()){sap.ui.commons.RoadMapRenderer.selectStepWithId(this,S);this.setProperty("selectedStep",S,true);}}else{sap.ui.commons.RoadMapRenderer.selectStepWithId(this,"");this.setProperty("selectedStep","",true);}}else{this.setProperty("selectedStep",S);}return this;};R.prototype.onThemeChanged=function(e){this.iStepWidth=-1;if(this.getDomRef()){this.invalidate();}};R.prototype.doBeforeRendering=function(){var I=false;var b=false;var S=this.getSteps();for(var i=0;i<S.length;i++){var o=S[i];if(o.getSubSteps().length==0||!o.getEnabled()){o.setProperty("expanded",false,true);}if(!o.getEnabled()&&!o.getVisible()&&this.getSelectedStep()==o.getId()){this.setProperty("selectedStep","",true);}else if(o.getEnabled()&&o.getVisible()&&this.getSelectedStep()==o.getId()){I=true;}if(o.getVisible()&&this.getFirstVisibleStep()==o.getId()){b=true;}var a=o.getSubSteps();for(var j=0;j<a.length;j++){var c=a[j];c.setProperty("expanded",false,true);if(!c.getEnabled()&&!c.getVisible()&&this.getSelectedStep()==c.getId()){this.setProperty("selectedStep","",true);}else if(c.getEnabled()&&c.getVisible()&&this.getSelectedStep()==c.getId()){I=true;}if(c.getVisible()&&this.getFirstVisibleStep()==c.getId()){b=true;}}}if(!I){this.setProperty("selectedStep","",true);}if(!b){this.setProperty("firstVisibleStep","",true);}if(this.sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}};R.prototype.onAfterRendering=function(){var S=this.getSteps();if(this.iStepWidth==-1&&S.length>0){var a=S[0].$();this.iStepWidth=a.outerWidth();}for(var i=0;i<S.length;i++){var o=S[i];sap.ui.commons.RoadMapRenderer.addEllipses(o);var b=o.getSubSteps();for(var j=0;j<b.length;j++){sap.ui.commons.RoadMapRenderer.addEllipses(b[j]);}}sap.ui.commons.RoadMapRenderer.updateScrollArea(this);this.sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef(),q.proxy(this.onresize,this));};R.prototype.onresize=function(e){var d=function(){if(this.getDomRef()){sap.ui.commons.RoadMapRenderer.updateScrollArea(this,true);r(this,"prev");this.sResizeInProgress=null;}};if(!!sap.ui.Device.browser.firefox){d.apply(this,[]);}else{if(!this.sResizeInProgress){this.sResizeInProgress=q.sap.delayedCall(300,this,d);}}};R.prototype.onclick=function(e){h(this,e);};R.prototype.onsapselect=function(e){h(this,e);};R.prototype.onfocusin=function(e){var t=q(e.target);var T=t.attr("id");if(T&&q.sap.endsWith(T,"-box")){this.sCurrentFocusedStepRefId=T.substring(0,T.length-4);}else if(T&&(q.sap.endsWith(T,"-Start")||q.sap.endsWith(T,"-End"))){}else{this.sCurrentFocusedStepRefId=sap.ui.commons.RoadMapRenderer.getFirstVisibleRef(this).attr("id");r(this);}this.$().attr("tabindex","-1");};R.prototype.onfocusout=function(e){this.$().attr("tabindex","0");};R.prototype.onsapprevious=function(e){f(e,this,"prev");};R.prototype.onsapnext=function(e){f(e,this,"next");};R.prototype.onsaphome=function(e){f(e,this,"first");};R.prototype.onsapend=function(e){f(e,this,"last");};var h=function(t,e){e.stopPropagation();e.preventDefault();var T=q(e.target);var a=T.attr("id");if(!a){return;}var i=a.lastIndexOf("-expandend");if(i!=-1){var S=sap.ui.getCore().byId(a.substring(0,i));if(S&&t.indexOfStep(S)>=0){S.handleSelect(e,true);return;}}if(a==t.getId()+"-Start"){if(T.hasClass("sapUiRoadMapStartScroll")){s(t,"prev",true);}else{r(t);}}else if(a==t.getId()+"-End"){if(T.hasClass("sapUiRoadMapEndScroll")){s(t,"next",true);}else{r(t);}}};var s=function(t,d,u){sap.ui.commons.RoadMapRenderer.scrollToNextStep(t,d,function(F){var i=F.lastIndexOf("-expandend");if(i!=-1){F=F.substring(0,i);}t.setProperty("firstVisibleStep",F,true);if(u){r(t,d);}});};var f=function(e,t,d){if(e){e.stopPropagation();e.preventDefault();}if(!t.sCurrentFocusedStepRefId){return;}var F=d+"All";var i=false;if(d=="first"){F="prevAll";i=true;}else if(d=="last"){F="nextAll";i=true;}var c=q.sap.byId(t.sCurrentFocusedStepRefId);var j=c[F](":visible");var a=q(j.get(i?j.length-1:0)).attr("id");if(a){if(!sap.ui.commons.RoadMapRenderer.isVisibleRef(t,a)){s(t,d);}q.sap.byId(a+"-box").get(0).focus();}};var r=function(t,d){if(!t.sCurrentFocusedStepRefId){return;}if(d&&!sap.ui.commons.RoadMapRenderer.isVisibleRef(t,t.sCurrentFocusedStepRefId)){f(null,t,d);}else{q.sap.byId(t.sCurrentFocusedStepRefId+"-box").get(0).focus();}};}());return R;},true);

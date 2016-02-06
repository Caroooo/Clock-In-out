/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/theming/Parameters'],function(q,l,C,P){"use strict";var B=C.extend("sap.m.BusyIndicator",{metadata:{library:"sap.m",properties:{text:{type:"string",group:"Data",defaultValue:""},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit},customIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:""},customIconRotationSpeed:{type:"int",group:"Appearance",defaultValue:1000},customIconDensityAware:{type:"boolean",defaultValue:true},customIconWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"44px"},customIconHeight:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"44px"},size:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"1rem"},design:{type:"string",group:"Appearance",defaultValue:"auto"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}}});B.prototype.init=function(){this.setBusyIndicatorDelay(0);};B.prototype.setText=function(t){this.setProperty("text",t,true);this._createLabel("setText",t);return this;};B.prototype.setTextDirection=function(d){this.setProperty("textDirection",d,true);this._createLabel("setTextDirection",d);return this;};B.prototype.setCustomIcon=function(s){this.setProperty("customIcon",s,false);this._createCustomIcon("setSrc",s);return this;};B.prototype.setCustomIconRotationSpeed=function(s){if(isNaN(s)||s<0){s=0;}if(s!==this.getCustomIconRotationSpeed()){this.setProperty("customIconRotationSpeed",s,true);this._setRotationSpeed();}return this;};B.prototype.setCustomIconDensityAware=function(a){this.setProperty("customIconDensityAware",a,true);this._createCustomIcon("setDensityAware",a);return this;};B.prototype.setCustomIconWidth=function(w){this.setProperty("customIconWidth",w,true);this._createCustomIcon("setWidth",w);return this;};B.prototype.setCustomIconHeight=function(h){this.setProperty("customIconHeight",h,true);this._createCustomIcon("setHeight",h);return this;};B.prototype.onBeforeRendering=function(){if(this.getCustomIcon()){this.setBusy(false);}else{this.setBusy(true,"busy-area");}};B.prototype.exit=function(){if(this._iconImage){this._iconImage.destroy();this._iconImage=null;}if(this._busyLabel){this._busyLabel.destroy();this._busyLabel=null;}};B.prototype._createCustomIcon=function(n,v){if(!this._iconImage){this._iconImage=new sap.m.Image(this.getId()+"-icon",{width:"44px",height:"44px"}).addStyleClass("sapMBsyIndIcon");this._iconImage.addEventDelegate({onAfterRendering:function(){this._setRotationSpeed();}},this);}this._iconImage[n](v);this._setRotationSpeed();};B.prototype._createLabel=function(n,v){if(!this._busyLabel){this._busyLabel=new sap.m.Label(this.getId()+"-label",{labelFor:this.getId(),textAlign:"Center"});}this._busyLabel[n](v);};B.prototype._setRotationSpeed=function(){if(!this._iconImage){return;}if(q.support.cssAnimations){var $=this._iconImage.$();var r=this.getCustomIconRotationSpeed()+"ms";$.css("-webkit-animation-duration",r).css("animation-duration",r);$.css("display","none");setTimeout(function(){$.css("display","inline");},0);}else{this._rotateCustomIcon();}};B.prototype._rotateCustomIcon=function(){if(!this._iconImage){return;}var $=this._iconImage.$();if(!$[0]||!$[0].offsetWidth){return;}var r=this.getCustomIconRotationSpeed();if(!r){return;}if(!this._fnRotateCustomIcon){this._fnRotateCustomIcon=q.proxy(this._rotateCustomIcon,this);}var R=this._fnRotateCustomIcon;if(!this._$CustomRotator){this._$CustomRotator=q({deg:0});}var a=this._$CustomRotator;if(a.running){return;}a[0].deg=0;a.animate({deg:360},{duration:r,easing:"linear",step:function(n){a.running=true;$.css("-ms-transform",'rotate('+n+'deg)');},complete:function(){a.running=false;window.setTimeout(R,10);}});};return B;},true);

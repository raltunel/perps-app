"use strict";(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[925,8673],{6921:(e,t,r)=>{r.r(t),r.d(t,{LineToolExtended:()=>n});var i=r(99294);class n extends i.LineToolTrendLine{constructor(e,t,r,i){super(e,t??n.createProperties(e.backgroundTheme().spawnOwnership()),r,i)}name(){return"Extended Line"}static createProperties(e,t){const r=i.LineToolTrendLine._createPropertiesImpl("linetoolextended",e,t);return n._configureProperties(r),r}}},99294:(e,t,r)=>{r.r(t),r.d(t,{Consts:()=>i,LineToolTrendLine:()=>l});var i,n=r(32679),s=r(12988),o=r(10568),a=r(90793);!function(e){e[e.PointsCount=2]="PointsCount",e.Name="Trend Line"}(i||(i={}));class l extends o.InplaceTextLineDataSource{constructor(e,t,i,n){super(e,t??l.createProperties(e.backgroundTheme().spawnOwnership()),i,n),this._trendLinePaneView=null,Promise.all([r.e(2870),r.e(2211),r.e(1583)]).then(r.bind(r,29710)).then((({TrendLinePaneView:e})=>{this._trendLinePaneView=new e(this,this._model,this._openTextEditor.bind(this),this._closeTextEditor.bind(this),this.onSelectionChange.bind(this)),this._setPaneViews([this._trendLinePaneView])}))}dataAndViewsReady(){return super.dataAndViewsReady()&&null!==this._trendLinePaneView}pointsCount(){return 2}name(){return"Trend Line"}canHasAlert(){return!0}showPriceLabels(){return this._properties.childs().showPriceLabels.value()}createPriceAxisView(e){return new a.LineToolPriceAxisView(this,{pointIndex:e,backgroundPropertyGetter:()=>this.showPriceLabels()?this._properties.childs().linecolor.value():null})}isForcedDrawPriceAxisLabel(){return this.showPriceLabels()}template(){const e=super.template();return e.text=this.properties().childs().text.value(),e}editableTextProperties(){const e=this.properties().childs();return{text:e.text,textColor:e.textcolor,textVisible:e.showLabel}}snapTo45DegreesAvailable(){return!0}static createProperties(e,t,r){return l._createPropertiesImpl("linetooltrendline",e,t,r)}_getAlertPlots(){const e=this._linePointsToAlertPlot(this._points,null,this._properties.childs().extendLeft.value(),this._properties.childs().extendRight.value());return null===e?[]:[e]}async _getPropertyDefinitionsViewModelClass(){return(await Promise.all([r.e(3401),r.e(3889),r.e(8009),r.e(6204),r.e(1963),r.e(8537)]).then(r.bind(r,26360))).TrendLineDefinitionsViewModel}_applyTemplateImpl(e){super._applyTemplateImpl(e),this.properties().childs().text.setValue(e.text||"")}static _createPropertiesImpl(e,t,r,i){r&&void 0===r.showPercentPriceRange&&(r.showPercentPriceRange=r.showPriceRange,r.showPipsPriceRange=r.showPriceRange);const s=new n.DefaultProperty({theme:t,defaultName:e,state:r,useUserPreferences:i});return this._configureProperties(s),s}static _configureProperties(e){super._configureProperties(e),e.hasChild("text")||e.addChild("text",new s.Property("")),e.addExcludedKey("text",1)}}}}]);
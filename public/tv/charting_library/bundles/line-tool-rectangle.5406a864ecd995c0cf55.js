"use strict";(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[8422],{63397:(e,t,i)=>{i.r(t),i.d(t,{Constants:()=>k,LineToolRectangle:()=>A});var o=i(50151),n=i(86441),r=i(88960),s=i(42752),l=i(12988),c=i(10568),a=i(73305),h=i(24633),p=i(49156),d=i(32679),u=i(11402),x=i(31229),P=i(85904),_=i(30699),T=i(6590),g=i(38039),b=i(35578);const f={intervalsVisibilities:{...x.intervalsVisibilitiesDefaults},color:p.colors.colorGrapesPurple500,fillBackground:!0,backgroundColor:p.colors.colorGrapesPurple500Alpha20,linewidth:b.DEFAULT_LINE_TOOL_LINE_WIDTH,transparency:50,showLabel:!1,horzLabelsAlign:_.HorizontalAlign.Center,vertLabelsAlign:_.VerticalAlign.Middle,textColor:p.colors.colorGrapesPurple500,fontSize:14,bold:!1,italic:!1,extendLeft:!1,extendRight:!1,middleLine:{showLine:!1,lineWidth:1,lineColor:p.colors.colorGrapesPurple500,lineStyle:P.LineStyle.Dashed},linestyle:P.LineStyle.Solid},m=new Map([[h.StdTheme.Light,{}],[h.StdTheme.Dark,{}]]),y=(0,d.extractThemedColors)((0,o.ensureDefined)(m.get(h.StdTheme.Light)),(0,o.ensureDefined)(m.get(h.StdTheme.Dark))),w=(0,d.extractAllPropertiesKeys)((0,o.ensureDefined)(m.get(h.StdTheme.Light))),S=(0,d.extractAllPropertiesKeys)(f),C=[...new Set([...w,...S,...T.commonLineToolPropertiesStateKeys,"text"])],N=[...new Set([...w,...S,"text"])];class L extends g.LineDataSourceProperty{constructor(e){super(e),this.hasChild("text")||this.addProperty("text","")}static create(e,t,i){return new this({defaultName:"linetoolrectangle",factoryDefaultsSupplier:()=>(0,u.factoryDefaultsForCurrentTheme)(f,m),nonThemedDefaultsKeys:S,themedDefaultsKeys:w,allStateKeys:C,themedColors:y,templateKeys:N,replaceThemedColorsOnThemeChange:!0,state:t,theme:e,useUserPreferences:i})}}var k;!function(e){e[e.LeftTopAnchor=0]="LeftTopAnchor",e[e.TopMiddleAnchor=6]="TopMiddleAnchor",e[e.RightTopAnchor=3]="RightTopAnchor",e[e.RightMiddleAnchor=5]="RightMiddleAnchor",e[e.RightBottomAnchor=1]="RightBottomAnchor",e[e.BottomMiddleAnchor=7]="BottomMiddleAnchor",e[e.LeftBottomAnchor=2]="LeftBottomAnchor",e[e.LeftMiddleAnchor=4]="LeftMiddleAnchor"}(k||(k={}));class A extends c.InplaceTextLineDataSource{constructor(e,t,o,n){super(e,t??A.createProperties(e.backgroundTheme().spawnOwnership()),o,n),Promise.all([i.e(2870),i.e(2211),i.e(1583)]).then(i.bind(i,41883)).then((({RectanglePaneView:t})=>{const i=[new t(this,e,this._openTextEditor.bind(this),this._closeTextEditor.bind(this),this.onSelectionChange.bind(this))];this._setPaneViews(i)}))}pointsCount(){return 2}textColorsProperty(){return this.properties().childs().showLabel.value()?super.textColorsProperty():null}name(){return"Rectangle"}setPoint(e,t,i){if(e<2)return void super.setPoint(e,t,i);if(this._snapTo45DegreesApplicable(i)){const i=this._getSnapTo45DegreesAnchorPoint(e);if(e>=4)return this._correctMiddlePoints(e,t,i),void this._normalizePoints();this.snapPoint45Degree(t,i)}const o=this._model.mainSeries().interval();switch(e){case 2:this._points[1].price=t.price,this._points[0].index=t.index,this._points[0].interval=o;break;case 3:
this._points[0].price=t.price,this._points[1].index=t.index,this._points[1].interval=o;break;case 4:this._points[0].index=t.index,this._points[0].interval=o;break;case 5:this._points[1].index=t.index,this._points[1].interval=o;break;case 6:this._points[0].price=t.price;break;case 7:this._points[1].price=t.price}this._normalizePoints()}getPoint(e){return e<2?super.getPoint(e):this._getAnchorPointForIndex(e)}template(){return this._properties.template()}snapTo45DegreesAvailable(){return!0}snapPoint45Degree(e,t,i){const n=this._priceScale,r=this.ownerSource();if(null===n||null===r)return;const s=r.firstValue();if(null===s)return;const l=this._model.timeScale(),c=(0,o.ensureNotNull)(this.pointToScreenPoint(e)),a=(0,o.ensureNotNull)(this.pointToScreenPoint(t)),h=c.x-a.x,p=c.y-a.y,d=h<0?-1:1,u=p<0?-1:1,x=Math.max(Math.abs(h),Math.abs(p)),P=Math.round(l.coordinateToIndex(a.x+x*d)),_=Math.abs(l.indexToCoordinate(P)-a.x),T=n.coordinateToPrice(a.y+_*u,s);e.index=P,e.price=T}editableTextProperties(){const e=this.properties().childs();return{text:e.text,textColor:e.textColor,textVisible:e.showLabel}}static createProperties(e,t,i){const o=L.create(e,t,i);return this._configureProperties(o),o}_getPropertyDefinitionsViewModelClass(){return Promise.all([i.e(3401),i.e(3889),i.e(8009),i.e(6204),i.e(1963),i.e(8537)]).then(i.bind(i,15041)).then((e=>e.RectangleDefinitionsViewModel))}_applyTemplateImpl(e){super._applyTemplateImpl(e),this.properties().childs().text.setValue(e.text)}_createDataSourceBackgroundColorWV(){const{fillBackground:e,backgroundColor:t}=this.properties().childs();return(0,r.combine)((()=>e.value()?t.value():null),(0,s.convertPropertyToWatchedValue)(e).ownership(),(0,s.convertPropertyToWatchedValue)(t).ownership()).ownership()}_correctMiddlePoints(e,t,i){e<6?this._correctRightLeftMiddlePoint(e,t,i):this._correctTopBottomMiddlePoint(e,t,i)}_correctRightLeftMiddlePoint(e,t,i){const r=(0,o.ensureNotNull)(this.pointToScreenPoint(t)),s=(0,o.ensureNotNull)(this.pointToScreenPoint(i)),l=(0,o.ensureNotNull)(this.pointToScreenPoint(this._points[0])),c=(0,o.ensureNotNull)(this.pointToScreenPoint(this._points[1]));let a=r.x-s.x;if(0===a)return;const h=l.x<c.x?1:-1,p=l.y<c.y?1:-1;switch(a*=h,e){case 4:{const e=c.y-p*a/2,t=(0,o.ensureNotNull)(this.screenPointToPoint(new n.Point(c.x,e)));this._points[1].price=t.price;const i=(0,o.ensureNotNull)(this.screenPointToPoint(new n.Point(l.x+h*a,l.y+p*a/2)));this._points[0].price=i.price,this._points[0].index=i.index;break}case 5:{const e=l.y-p*a/2,t=(0,o.ensureNotNull)(this.screenPointToPoint(new n.Point(l.x,e)));this._points[0].price=t.price;const i=(0,o.ensureNotNull)(this.screenPointToPoint(new n.Point(c.x+h*a,c.y+p*a/2)));this._points[1].price=i.price,this._points[1].index=i.index;break}}}_correctTopBottomMiddlePoint(e,t,i){const r=this._priceScale,s=this.ownerSource();if(null===r||null===s)return;const l=this._model.timeScale(),c=s.firstValue();if(null===c)return;const a=(0,o.ensureNotNull)(this.pointToScreenPoint(t)),h=(0,o.ensureNotNull)(this.pointToScreenPoint(i)),p=(0,
o.ensureNotNull)(this.pointToScreenPoint(this._points[0])),d=(0,o.ensureNotNull)(this.pointToScreenPoint(this._points[1])),u=a.y-h.y,x=u<0?-1:1,P=p.x<d.x?1:-1,_=p.y<d.y?1:-1;switch(e){case 6:{const e=Math.floor(d.x-P*u/2),t=(0,o.ensureNotNull)(this.screenPointToPoint(new n.Point(e,d.y))),i=Math.abs(this._points[1].index-t.index),s=P*_*x*Math.ceil(i/2);if(0===s)return;this._points[1].index=this._points[1].index-s;const a=x*Math.abs(l.indexToCoordinate(this._points[1].index)-d.x);this._points[0].price=r.coordinateToPrice(p.y+a,c),this._points[0].index=this._points[0].index+s;break}case 7:{const e=Math.floor(p.x-P*u/2),t=(0,o.ensureNotNull)(this.screenPointToPoint(new n.Point(e,p.y))),i=Math.abs(this._points[0].index-t.index),s=P*_*x*Math.ceil(i/2);if(0===s)return;this._points[0].index=this._points[0].index-s;const a=x*Math.abs(l.indexToCoordinate(this._points[0].index)-p.x);this._points[1].price=r.coordinateToPrice(d.y+a,c),this._points[1].index=this._points[1].index+s;break}}}static _configureProperties(e){super._configureProperties(e),e.hasChild("text")||e.addChild("text",new l.Property("")),e.addChild("linesColors",new a.LineToolColorsProperty([e.childs().color])),e.addChild("textsColors",new a.LineToolColorsProperty([e.childs().textColor],e.childs().showLabel)),e.addExcludedKey("text",1),e.addExcludedKey("linesColors",1),e.addExcludedKey("textsColors",1)}_getAnchorPointForIndex(e){const t=this.points(),i=t[0],o=t[1];let n=0,r=0;switch(e){case 0:n=i.price,r=i.index;break;case 1:n=o.price,r=o.index;break;case 2:n=o.price,r=i.index;break;case 3:n=i.price,r=o.index;break;case 4:n=(o.price+i.price)/2,r=i.index;break;case 5:n=(o.price+i.price)/2,r=o.index;break;case 6:n=i.price,r=(o.index+i.index)/2;break;case 7:n=o.price,r=(o.index+i.index)/2}return{index:r,price:n}}_getSnapTo45DegreesAnchorPoint(e){if(e>=4)return this._getAnchorPointForIndex(e);const t=this.points(),i=t[0],o=t[1];let n=0,r=0;switch(e){case 0:n=o.price,r=o.index;break;case 1:n=i.price,r=i.index;break;case 2:n=i.price,r=o.index;break;case 3:n=o.price,r=i.index}return{index:r,price:n}}}}}]);
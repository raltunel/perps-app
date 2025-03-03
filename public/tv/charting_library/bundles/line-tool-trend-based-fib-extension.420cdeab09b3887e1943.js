"use strict";(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[4731],{15399:(e,t,s)=>{s.d(t,{LevelsProperty:()=>x});var i=s(90054),r=s(16738),l=s(37265),n=s(32679),o=s(35039);const a={prefixes:[""],range:[0,0],names:["coeff","color","visible","linestyle","linewidth"],typecheck:{pack:()=>Object(),unpack:()=>[]}};function c(e,t,s,i){return i.push(s[t]),i}function d(e,t,s,i){return i[t]=s[e],i}function u(){return[]}function p(){return{}}function h(e,t,s){return s.prefixes.forEach((i=>{const r=i+"level";for(let i=s.range[0];i<=s.range[1];i++)if(e[r+i]&&(0,l.isSameType)(e[r+i],t.typecheck())){let l=t.tpl();s.names.forEach(((s,n)=>{l=t.fill(""+n,s,e[r+i],l)})),e[r+i]=l}})),e}function v(e,t,s){return s(e,{tpl:p,fill:d,typecheck:t.typecheck.unpack},t)}class x extends n.DefaultProperty{constructor(e){const{levelsIterator:t=h,map:s={},...i}=e,r={...a,...s};i.state&&(i.state=v(i.state,r,t)),super(i),this._map=r,this._levelsIterator=t}state(e,t,s){const i=super.state(e,t);return s?i:(r=i,l=this._map,(0,this._levelsIterator)(r,{tpl:u,fill:c,typecheck:l.typecheck.pack},l));var r,l}preferences(){return(0,n.extractState)(this.state(this._excludedDefaultsKeys,void 0,!0),this._allDefaultsKeys)}applyTemplate(e,t){this.mergeAndFire((0,n.extractState)((0,r.default)((0,i.default)(t),v(e,this._map,this._levelsIterator)),this._allStateKeys,this._excludedTemplateKeys))}saveDefaults(){this._useUserPreferences&&(0,o.saveDefaults)(this._defaultName,this.preferences())}clone(){return new x(this._options())}merge(e,t){return super.merge(this._map?v(e,this._map,this._levelsIterator):e,t)}_options(){return{...super._options(),map:{...this._map},levelsIterator:this._levelsIterator}}}},96851:(e,t,s)=>{s.d(t,{LineToolFibWithInplaceTextBase:()=>c,getLevelProps:()=>o});var i=s(50151),r=s(12988),l=s(10568);const n=new r.Property(!1);function o(e,t){return(0,i.ensureDefined)(e.child(`level${t}`))}class a extends l.InplaceTextUndoCommand{constructor(e,t,s,i,r){super(e,t,s,i),this._levelIndex=r}_textProperty(e){return o(e.properties(),this._levelIndex).childs().text}}class c extends l.InplaceTextLineDataSource{constructor(){super(...arguments),this._inplaceEditLevelIndex=1}editableTextStyle(){return{...super.editableTextStyle(),forbidLineBreaks:!0,maxLength:50}}editableTextProperties(){const e=this.properties().childs();return{text:e.editableText,textColor:e.editableTextColor,wordWrap:n}}setInplaceEditLevelIndex(e){this._destroyEditableTextSubscriptions?.();const t=this.properties(),s=t.childs().editableText,r=t.childs().editableTextColor,l=o(t,e),n=(0,i.ensureDefined)(l).childs().text,a=(0,i.ensureDefined)(l).childs().color,c={};s.setValue(n.value()),r.setValue(a.value()),s.subscribe(c,(()=>n.setValue(s.value()))),n.subscribe(c,(()=>s.setValue(n.value()))),r.subscribe(c,(()=>a.setValue(r.value()))),a.subscribe(c,(()=>r.setValue(a.value()))),this._destroyEditableTextSubscriptions=()=>{s.unsubscribeAll(c),n.unsubscribeAll(c),r.unsubscribeAll(c),a.unsubscribeAll(c)},this._inplaceEditLevelIndex=e,this._editableText.setValue(s.value())}
_changeEditableTextUndoCommand(e,t){return new a(this._model,this,e,t,this._inplaceEditLevelIndex)}static _configureProperties(e){super._configureProperties(e),e.addChild("editableText",new r.Property("")),e.addChild("editableTextColor",new r.Property("")),e.addExcludedKey("editableText",3),e.addExcludedKey("editableTextColor",3)}}},68554:(e,t,s)=>{s.r(t),s.d(t,{Constants:()=>d,LineToolTrendBasedFibExtension:()=>u});var i=s(11542),r=s(45126),l=s(15399),n=s(73305),o=s(85719),a=s(96851);const c=new r.TranslatedString("erase level line",i.t(null,void 0,s(77114)));var d;!function(e){e[e.Version=2]="Version",e[e.LevelsCount=24]="LevelsCount",e[e.PointsCount=3]="PointsCount",e.Name="Trend-Based Fib Extension"}(d||(d={}));class u extends a.LineToolFibWithInplaceTextBase{constructor(e,t,i,r){super(e,t??u.createProperties(e.backgroundTheme().spawnOwnership()),i,r),this.version=2,Promise.all([s.e(2870),s.e(2211),s.e(1583)]).then(s.bind(s,90413)).then((({TrendBasedFibExtensionPaneView:e})=>{this._setPaneViews([new e(this,this._model,this._openTextEditor.bind(this),this._closeTextEditor.bind(this),this.onSelectionChange.bind(this))])}))}levelsCount(){return 24}pointsCount(){return 3}name(){return"Trend-Based Fib Extension"}migrateVersion(e,t){1===e&&this.properties().childs().extendLines.setValue(!0)}processErase(e,t){const s="level"+t,i=this.properties().childs()[s].childs().visible;e.setProperty(i,!1,c,o.lineToolsDoNotAffectChartInvalidation)}fibLevelsBasedOnLogScale(){return this.properties().childs().fibLevelsBasedOnLogScale.value()&&Boolean(this.priceScale()?.isLog())}template(){const e=super.template();for(let t=1;t<=24;t++){const s=(0,a.getLevelProps)(this._properties,t);e[`level${t}`].text=s.childs().text.value()}return e}static createProperties(e,t){const s=new l.LevelsProperty({defaultName:"linetooltrendbasedfibextension",state:t,map:{names:["coeff","color","visible","linestyle","linewidth","text"],range:[0,24]},theme:e});return this._configureProperties(s),s}_applyTemplateImpl(e){for(let t=1;t<=24;t++){const s=(0,a.getLevelProps)(this._properties,t),i=e[`level${t}`];s.childs().text.setValue(i.text??i[3]??"")}super._applyTemplateImpl(e)}async _getPropertyDefinitionsViewModelClass(){return(await Promise.all([s.e(3401),s.e(3889),s.e(8009),s.e(6204),s.e(1963),s.e(8537)]).then(s.bind(s,75450))).FibDrawingsWith24LevelsDefinitionsViewModel}static _configureProperties(e){const t=e.childs();super._configureProperties(e);const s=[t.trendline.childs().color];for(let t=1;t<=24;t++){const i=(0,a.getLevelProps)(e,t);s.push(i.childs().color),e.addExcludedKey(`level${t}.text`,1)}e.addChild("linesColors",new n.LineToolColorsProperty(s));const i=[t.trendline.childs().linewidth,t.levelsStyle.childs().linewidth];e.addChild("linesWidths",new n.LineToolWidthsProperty(i))}}}}]);
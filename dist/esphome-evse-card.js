/* ESPHome EVSE Card 0.2.0 - https://github.com/clowrey/esphome-evse-card */
var Bt=Object.defineProperty;var qt=(n,t,e)=>t in n?Bt(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var P=(n,t,e)=>qt(n,typeof t!="symbol"?t+"":t,e);var Y=globalThis,Z=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,rt=Symbol(),$t=new WeakMap,T=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Z&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=$t.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&$t.set(e,t))}return t}toString(){return this.cssText}},xt=n=>new T(typeof n=="string"?n:n+"",void 0,rt),z=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new T(e,n,rt)},yt=(n,t)=>{if(Z)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Y.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},ot=Z?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return xt(e)})(n):n;var{is:Kt,defineProperty:Xt,getOwnPropertyDescriptor:Gt,getOwnPropertyNames:Jt,getOwnPropertySymbols:Yt,getPrototypeOf:Zt}=Object,Q=globalThis,wt=Q.trustedTypes,Qt=wt?wt.emptyScript:"",te=Q.reactiveElementPolyfillSupport,L=(n,t)=>n,at={toAttribute(n,t){switch(t){case Boolean:n=n?Qt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},At=(n,t)=>!Kt(n,t),kt={attribute:!0,type:String,converter:at,reflect:!1,useDefault:!1,hasChanged:At};Symbol.metadata??=Symbol("metadata"),Q.litPropertyMetadata??=new WeakMap;var k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=kt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Xt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=Gt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let c=i?.call(this);r?.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??kt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=Zt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,s=[...Jt(e),...Yt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(ot(i))}else t!==void 0&&e.push(ot(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:at).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:at;this._$Em=i;let c=o.fromAttribute(e,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let o=this.constructor;if(i===!1&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??At)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:o}=r,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[L("elementProperties")]=new Map,k[L("finalized")]=new Map,te?.({ReactiveElement:k}),(Q.reactiveElementVersions??=[]).push("2.1.2");var mt=globalThis,St=n=>n,tt=mt.trustedTypes,Et=tt?tt.createPolicy("lit-html",{createHTML:n=>n}):void 0,Nt="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Ot="?"+S,ee=`<${Ot}>`,O=document,V=()=>O.createComment(""),B=n=>n===null||typeof n!="object"&&typeof n!="function",ft=Array.isArray,se=n=>ft(n)||typeof n?.[Symbol.iterator]=="function",ct=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ct=/-->/g,Mt=/>/g,I=RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pt=/'/g,zt=/"/g,Wt=/^(?:script|style|textarea|title)$/i,gt=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),l=gt(1),A=gt(2),ve=gt(3),W=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),It=new WeakMap,N=O.createTreeWalker(O,129);function Ut(n,t){if(!ft(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Et!==void 0?Et.createHTML(t):t}var ie=(n,t)=>{let e=n.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",o=j;for(let c=0;c<e;c++){let a=n[c],d,m,h=-1,f=0;for(;f<a.length&&(o.lastIndex=f,m=o.exec(a),m!==null);)f=o.lastIndex,o===j?m[1]==="!--"?o=Ct:m[1]!==void 0?o=Mt:m[2]!==void 0?(Wt.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=I):m[3]!==void 0&&(o=I):o===I?m[0]===">"?(o=i??j,h=-1):m[1]===void 0?h=-2:(h=o.lastIndex-m[2].length,d=m[1],o=m[3]===void 0?I:m[3]==='"'?zt:Pt):o===zt||o===Pt?o=I:o===Ct||o===Mt?o=j:(o=I,i=void 0);let v=o===I&&n[c+1].startsWith("/>")?" ":"";r+=o===j?a+ee:h>=0?(s.push(d),a.slice(0,h)+Nt+a.slice(h)+S+v):a+S+(h===-2?c:v)}return[Ut(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},q=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0,c=t.length-1,a=this.parts,[d,m]=ie(t,e);if(this.el=n.createElement(d,s),N.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=N.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Nt)){let f=m[o++],v=i.getAttribute(h).split(S),$=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:$[2],strings:v,ctor:$[1]==="."?dt:$[1]==="?"?ht:$[1]==="@"?pt:D}),i.removeAttribute(h)}else h.startsWith(S)&&(a.push({type:6,index:r}),i.removeAttribute(h));if(Wt.test(i.tagName)){let h=i.textContent.split(S),f=h.length-1;if(f>0){i.textContent=tt?tt.emptyScript:"";for(let v=0;v<f;v++)i.append(h[v],V()),N.nextNode(),a.push({type:2,index:++r});i.append(h[f],V())}}}else if(i.nodeType===8)if(i.data===Ot)a.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(S,h+1))!==-1;)a.push({type:7,index:r}),h+=S.length-1}r++}}static createElement(t,e){let s=O.createElement("template");return s.innerHTML=t,s}};function R(n,t,e=n,s){if(t===W)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=B(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=R(n,i._$AS(n,t.values),i,s)),t}var lt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);N.currentNode=i;let r=N.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new K(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new ut(r,this,t)),this._$AV.push(d),a=s[++c]}o!==a?.index&&(r=N.nextNode(),o++)}return N.currentNode=O,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},K=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=R(this,t,e),B(t)?t===g||t==null||t===""?(this._$AH!==g&&this._$AR(),this._$AH=g):t!==this._$AH&&t!==W&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):se(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==g&&B(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=q.createElement(Ut(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new lt(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=It.get(t.strings);return e===void 0&&It.set(t.strings,e=new q(t)),e}k(t){ft(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new n(this.O(V()),this.O(V()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=St(t).nextSibling;St(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=g,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=g}_$AI(t,e=this,s,i){let r=this.strings,o=!1;if(r===void 0)t=R(this,t,e,0),o=!B(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{let c=t,a,d;for(t=r[0],a=0;a<r.length-1;a++)d=R(this,c[s+a],e,a),d===W&&(d=this._$AH[a]),o||=!B(d)||d!==this._$AH[a],d===g?t=g:t!==g&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},dt=class extends D{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===g?void 0:t}},ht=class extends D{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==g)}},pt=class extends D{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=R(this,t,e,0)??g)===W)return;let s=this._$AH,i=t===g&&s!==g||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==g&&(s===g||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ut=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){R(this,t)}};var ne=mt.litHtmlPolyfillSupport;ne?.(q,K),(mt.litHtmlVersions??=[]).push("3.3.3");var Rt=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new K(t.insertBefore(V(),r),r,void 0,e??{})}return i._$AI(n),i};var vt=globalThis,E=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};E._$litElement$=!0,E.finalized=!0,vt.litElementHydrateSupport?.({LitElement:E});var re=vt.litElementPolyfillSupport;re?.({LitElement:E});(vt.litElementVersions??=[]).push("4.2.2");var C=class extends E{setConfig(t){this._config={prefix:"evse_0",...t}}get prefix(){return this._config.prefix}eid(t){if(t.includes("."))return t;let[e,s]=t.includes(":")?t.split(":"):["sensor",t];return`${e}.${this.prefix}_${s}`}stateObj(t){return this.hass?.states[this.eid(t)]}has(t){return!!this.stateObj(t)}num(t){let e=parseFloat(this.stateObj(t)?.state);return Number.isFinite(e)?e:void 0}str(t){let e=this.stateObj(t)?.state;return e===void 0||e==="unknown"||e==="unavailable"?void 0:e}unit(t){return this.stateObj(t)?.attributes.unit_of_measurement??""}numIn(t,e){return ae(this.num(t),this.unit(t),e)}watched(){return[]}shouldUpdate(t){if(t.size!==1||!t.has("hass"))return!0;let e=t.get("hass");return e?this.watched().some(s=>{let i=this.eid(s);return e.states[i]!==this.hass.states[i]}):!0}moreInfo(t){let e=this.eid(t);this.hass?.states[e]&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}getCardSize(){return 6}};P(C,"properties",{hass:{attribute:!1},_config:{state:!0}});var oe=[{V:1,mV:.001,kV:1e3},{A:1,mA:.001},{W:1,mW:.001,kW:1e3,MW:1e6},{Wh:1,kWh:1e3,MWh:1e6},{s:1,ms:.001,min:60,h:3600}];function ae(n,t,e){if(n===void 0||!Number.isFinite(n))return;let s=(t??"").trim();if(s===""||s===e)return n;let i=oe.find(r=>s in r&&e in r);return i?n*i[s]/i[e]:void 0}function u(n,t,e=1){if(t==null||!Number.isFinite(t))return"\u2013";let s=n?.locale?.language??navigator.language;return t.toLocaleString(s,{minimumFractionDigits:e,maximumFractionDigits:e})}function _t(n,t){return t===void 0?["\u2013","kW"]:Math.abs(t)>=1?[u(n,t,2),"kW"]:[u(n,t*1e3,0),"W"]}function Dt(n){let t=Date.parse(n);if(!Number.isFinite(t))return"";let e=Math.max(0,(Date.now()-t)/1e3);return e<45?"just now":e<3600?`${Math.round(e/60)} min ago`:e<86400?`${Math.round(e/3600)} h ago`:`${Math.round(e/86400)} d ago`}var et=z`
  :host {
    --ev-good: var(--success-color, #43a047);
    --ev-warn: var(--warning-color, #ffa600);
    --ev-bad: var(--error-color, #db4437);
    --ev-info: var(--info-color, #039be5);
    --ev-fast: #ffb74d;
    --ev-car: var(--energy-grid-consumption-color, #488fc2);
    --ev-charge: var(--energy-battery-in-color, #f06292);
    --ev-discharge: var(--energy-battery-out-color, #4db6ac);
    --ev-muted: var(--secondary-text-color);
    --ev-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --ev-track: rgba(127, 127, 127, 0.18);
    display: block;
  }
  ha-card {
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ev-muted);
  }
  .num {
    font-variant-numeric: tabular-nums;
  }
  .unit {
    font-size: 0.55em;
    color: var(--ev-muted);
    margin-left: 2px;
  }
  .dim {
    color: var(--ev-muted);
  }
  .clickable {
    cursor: pointer;
    border-radius: 8px;
  }
  .clickable:hover {
    background: rgba(127, 127, 127, 0.08);
  }
`;var Ht=new Map;async function Ft(n,t){let e=t.join(","),s=Ht.get(e);if(s&&Date.now()-s.at<3e5)return s.promise;let i=new Date,r=new Date(i.getTime()-24*3600*1e3),o=n.callWS({type:"recorder/statistics_during_period",start_time:r.toISOString(),end_time:i.toISOString(),statistic_ids:t,period:"5minute",types:["mean"],units:{power:"kW"}}).then(c=>Object.fromEntries(t.map(a=>[a,(c[a]??[]).filter(d=>Number.isFinite(d.mean)).map(d=>[d.start,d.mean])]))).catch(()=>Object.fromEntries(t.map(c=>[c,[]])));return Ht.set(e,{at:Date.now(),promise:o}),o}var X={0:{name:"Stopped",short:"Stop",color:"var(--ev-bad)",icon:"mdi:power"},1:{name:"Manual",short:"Manual",color:"var(--ev-info)",icon:"mdi:hand-back-right-outline"},2:{name:"Normal",short:"Normal",color:"var(--ev-good)",icon:"mdi:lightning-bolt"},3:{name:"Fast",short:"Fast",color:"var(--ev-fast)",icon:"mdi:flash"}},ce={Idle:{text:"No vehicle",icon:"mdi:power-plug-off-outline",color:"var(--ev-muted)"},"EV Connected":{text:"Vehicle connected",icon:"mdi:ev-plug-type1",color:"var(--ev-info)"},"EV Charging":{text:"Charging",icon:"mdi:ev-plug-type1",color:"var(--ev-good)"},"EV Vent":{text:"Vent required",icon:"mdi:alert-circle-outline",color:"var(--ev-bad)"},Error:{text:"Pilot error",icon:"mdi:alert-circle-outline",color:"var(--ev-bad)"}},H=6,bt=.05,G=class extends C{static getStubConfig(t){let e=Object.keys(t?.states??{}).find(s=>/^sensor\.(\w+)_cp_output_pwm_duty_cycle$/.test(s));return{prefix:e?e.match(/^sensor\.(\w+)_cp_output_pwm_duty_cycle$/)[1]:"evse_0"}}setConfig(t){super.setConfig({show_controls:!0,show_chart:!0,soc_entities:[],...t})}watched(){return["power","current_measured","voltage","daily_energy","daily_cost","daily_percent","cp_state","state_text_sensor_output","event_flag","battery_power_source","ha_battery_power","ha_battery_power_filtered","active_target","ha_inputs_debug","temperature_pcb","number:charger_mode","number:current_setpoint","number:max_current_limit","number:normal_target","number:fast_target","number:charge_control_deadband","number:car_battery_size","select:charge_profile","binary_sensor:ac_relay",...this._config?.soc_entities??[]]}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now(),this._config?.show_chart&&this._loadDay()},60*1e3)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._timer)}updated(t){t.has("hass")&&!this._day&&!this._loading&&this.hass&&this._config?.show_chart&&this._loadDay()}async _loadDay(){if(!this.hass)return;this._loading=!0;let t=[this.eid("power"),this.eid("ha_battery_power_filtered")],e=await Ft(this.hass,t);this._day={car:e[t[0]],battery:e[t[1]]},this._loading=!1}_mode(){let t=this.num("number:charger_mode");return t===void 0?void 0:Math.max(0,Math.min(3,Math.round(t)))}_cp(){let t=this.str("cp_state");return t?ce[t]??{text:t,icon:"mdi:help-circle-outline",color:"var(--ev-muted)"}:void 0}_soc(){let t=(this._config.soc_entities??[]).map(e=>parseFloat(this.hass.states[e]?.state)).filter(Number.isFinite);return t.length?Math.min(...t):void 0}_debug(){let t=this.str("ha_inputs_debug")??"",e=s=>{let i=t.match(s);return i?parseFloat(i[1]):void 0};return{cap:e(/cap:(\d+)A/),limit:e(/lim:(\d+)A/),settle:e(/settle:(\d+)s/),interval:e(/int:([\d.]+)s/),minSoc:e(/min:(\d+)/)}}_target(){let t=this._mode(),e=this.numIn("active_target","kW");return e!==void 0?e:t===3?this.numIn("number:fast_target","kW"):this.numIn("number:normal_target","kW")}_deadband(){let t=this.numIn("voltage","V"),e=(t&&t>150?t:230)/1e3;return Math.max(this.numIn("number:charge_control_deadband","kW")??.25,1.5*e)}_deviceName(){let t=this.hass.entities?.[this.eid("power")]?.device_id,e=t&&this.hass.devices?.[t];return e?.name_by_user||e?.name||this.prefix.replace(/_/g,"-").toUpperCase()}_press(t){this.hass.callService("button","press",{entity_id:this.eid(`button:${t}`)})}_stepSetpoint(t){let e=this.num("number:current_setpoint")??H,s=this.num("number:max_current_limit")??40,i=Math.max(H,Math.min(s,Math.round(e)+t));i!==Math.round(e)&&this.hass.callService("number","set_value",{entity_id:this.eid("number:current_setpoint"),value:i})}render(){if(!this.hass||!this._config)return g;if(!this.has("cp_state")&&!this.has("power"))return l`<ha-card><div class="wrap missing">No EVSE entities found for prefix <b>${this.prefix}</b>.</div></ha-card>`;let t=this._mode();return l`
      <ha-card>
        ${this._banners(t)}
        <div class="wrap">
          ${this._header(t)} ${this._flow(t)}
          ${t===2||t===3?this._controller(t):this._manualLine(t)}
          ${this._config.show_controls?this._controls(t):""}
          ${this._footer()}
          ${this._config.show_chart?this._chart():""}
        </div>
      </ha-card>
    `}_banners(t){let e=this.str("state_text_sensor_output")??"",s=this.str("battery_power_source")??"",i=[];if(/LV lockout/i.test(e))i.push({color:"var(--ev-bad)",icon:"mdi:battery-alert-variant-outline",text:e.replace(/^.*?-\s*/,"")||"Low-voltage lockout",key:"state_text_sensor_output"});else if(/Paused/i.test(e)){let r=e.replace(/^.*?Paused\s*-?\s*/i,"");i.push({color:"var(--ev-warn)",icon:"mdi:pause-circle-outline",text:`Paused${r?": "+r:""}`,key:"state_text_sensor_output"})}return(t===2||t===3)&&s.startsWith("none")&&i.push({color:"var(--ev-warn)",icon:"mdi:database-off-outline",text:"No house-battery data: holding the current, never raising it",key:"battery_power_source"}),/Vent|error/i.test(e)&&/Pilot error|Vent/i.test(e)&&i.push({color:"var(--ev-bad)",icon:"mdi:alert-circle-outline",text:e.replace(/^.*?-\s*/,""),key:"cp_state"}),i.map(r=>l`<div class="banner clickable" style="--c:${r.color}" @click=${()=>this.moreInfo(r.key)}>
        <ha-icon icon=${r.icon}></ha-icon><div>${r.text}</div>
      </div>`)}_header(t){let e=t===void 0?void 0:X[t],s=this._cp(),i=this.str("battery_power_source"),r=this.str("select:charge_profile");return l`
      <div class="header">
        <div class="title">
          <ha-icon icon="mdi:ev-station"></ha-icon>
          <span>${this._config.title??this._deviceName()}</span>
        </div>
        <div class="chips">
          ${e?l`<span class="chip" style="--c:${e.color}" @click=${()=>this.moreInfo("number:charger_mode")}><i></i>${e.name}</span>`:""}
          ${s?l`<span class="chip" style="--c:${s.color}" @click=${()=>this.moreInfo("cp_state")}><ha-icon icon=${s.icon}></ha-icon>${s.text}</span>`:""}
          ${i&&i!=="primary"&&(t===2||t===3)?l`<span class="chip" style="--c:${i.startsWith("none")?"var(--ev-bad)":"var(--ev-warn)"}" @click=${()=>this.moreInfo("battery_power_source")}
                ><ha-icon icon="mdi:source-branch"></ha-icon>${i.startsWith("fallback")?"Fallback input":"No battery input"}</span
              >`:""}
          ${t===0&&r?l`<span class="chip" style="--c:var(--ev-muted)" @click=${()=>this.moreInfo("select:charge_profile")}>Next: ${r}</span>`:""}
        </div>
      </div>
    `}_flow(t){let e=this.numIn("ha_battery_power","kW")??this.numIn("ha_battery_power_filtered","kW"),s=this.numIn("power","kW"),i=this.numIn("current_measured","A"),r=this.numIn("voltage","V"),o=this.num("number:current_setpoint"),c=this._cp(),a=this.str("binary_sensor:ac_relay"),d=this._soc(),m=this.numIn("daily_energy","kWh"),h=this.num("daily_percent"),f=this.num("daily_cost"),v=(this.unit("daily_cost")||"USD").replace("USD","$"),$=this.num("number:car_battery_size"),b=e===void 0?"unknown":e>bt?"charging":e<-bt?"discharging":"idle",y={charging:"var(--ev-charge)",discharging:"var(--ev-discharge)"}[b]??"var(--ev-muted)",[x,U]=_t(this.hass,e===void 0?void 0:Math.abs(e)),[w,p]=_t(this.hass,s),_=(s??0)>bt,M=t!==0&&c&&c.text!=="No vehicle";return l`
      <div class="flow">
        <div class="node clickable" @click=${()=>this.moreInfo("ha_battery_power")}>
          <div class="label">House battery</div>
          <ha-icon class="node-icon" style="color:${y}" icon=${b==="charging"?"mdi:battery-charging":b==="discharging"?"mdi:battery-arrow-up-outline":"mdi:battery-outline"}></ha-icon>
          <div class="big num" style="color:${y}">${x}<span class="unit">${U}</span></div>
          <div class="sub">${{charging:"charging",discharging:"discharging",idle:"idle",unknown:"no data"}[b]}${d!==void 0?l` · ${u(this.hass,d,0)} %`:""}</div>
        </div>
        ${this._connector(_&&b==="discharging"?"fwd":"","var(--ev-discharge)",Math.min(s??0,Math.abs(e??0)))}
        <div class="node evse clickable" @click=${()=>this.moreInfo("number:current_setpoint")}>
          <div class="label">EVSE</div>
          <ha-icon class="node-icon" style="color:${M?"var(--ev-car)":"var(--ev-muted)"}" icon="mdi:ev-station"></ha-icon>
          <div class="big num">${o===void 0?"\u2013":u(this.hass,o,0)}<span class="unit">A</span></div>
          <div class="sub">
            ${M?"offered":"idle"}${i!==void 0?l` · <span class="num">${u(this.hass,i,i<10?1:0)} A</span> drawn`:""}
          </div>
          <div class="sub dim">
            ${r!==void 0?l`<span class="num">${u(this.hass,r,0)} V</span>`:""}${a?l` · relay ${a}`:""}
          </div>
        </div>
        ${this._connector(_?"fwd":"","var(--ev-car)",s??0)}
        <div class="node clickable" @click=${()=>this.moreInfo("power")}>
          <div class="label">Car</div>
          <ha-icon class="node-icon" style="color:${_?"var(--ev-good)":c?.color??"var(--ev-muted)"}" icon=${_?"mdi:car-electric":c&&c.text!=="No vehicle"?"mdi:car-electric-outline":"mdi:car-off"}></ha-icon>
          <div class="big num" style=${_?"":"color:var(--ev-muted)"}>${w}<span class="unit">${p}</span></div>
          <div class="sub">${c?.text??"\u2013"}</div>
          ${m!==void 0?l`<div class="sub dim today" @click=${J=>{J.stopPropagation(),this.moreInfo("daily_energy")}}>
                <span class="num">${u(this.hass,m,1)} kWh</span> today${h!==void 0?l` · <span class="num">${u(this.hass,h,0)} %</span>${$?l` of ${u(this.hass,$,0)} kWh`:""}`:""}${f!==void 0?l` · <span class="num">${v}${u(this.hass,f,2)}</span>`:""}
              </div>`:""}
        </div>
      </div>
    `}_connector(t,e,s){let i=t?Math.max(.6,Math.min(3,3-Math.min(s,8)*.3)):0;return l`
      <div class="link ${t}" style="--c:${e};--t:${i}s">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          ${A`<line class="rail" x1="0" y1="12" x2="100" y2="12"></line>
          ${t?A`<line class="dash" x1="0" y1="12" x2="100" y2="12"></line>`:""}`}
        </svg>
        ${t?l`<ha-icon class="arrow" icon=${t==="fwd"?"mdi:chevron-right":"mdi:chevron-left"}></ha-icon>`:""}
      </div>
    `}_controller(t){let e=this._target(),s=this._deadband(),i=this.numIn("ha_battery_power_filtered","kW")??this.numIn("ha_battery_power","kW"),r=this.num("number:current_setpoint"),o=this.num("number:max_current_limit")??40,c=this._debug(),a=c.cap!==void 0?Math.min(c.cap,o):o,d=X[t];if(e===void 0)return"";let m=Math.max(5,Math.abs(e)+s+1,Math.abs(i??0)+.5),h=p=>50+Math.max(-m,Math.min(m,p))/m*50,f=h(e-s),v=h(e+s),$=i===void 0?void 0:h(i),b=i===void 0?void 0:i-e,y=this._cp(),x=!y||y.text==="No vehicle",U=b===void 0?"":x?"no vehicle to charge":Math.abs(b)<=s?"in the band":b>0?`${u(this.hass,b-s,2)} kW of room to raise the car`:`${u(this.hass,-b-s,2)} kW over, lowering the car`,w=p=>(Math.max(H,Math.min(40,p))-H)/(40-H)*100;return l`
      <div class="ctl">
        <div class="ctl-head">
          <span class="label">Controller</span>
          <span class="ctl-text" style="color:${d.color}">
            ${d.name} holds the battery at <b class="num">${u(this.hass,e,1)} kW</b>
            <span class="dim">(${e<0?"discharging":"charging"} · band ±${u(this.hass,s,2)} kW)</span>
          </span>
        </div>
        <div class="bar clickable" @click=${()=>this.moreInfo("ha_battery_power_filtered")} title="Filtered house-battery power against the target band">
          <div class="zone" style="left:${Math.min(f,v)}%;width:${Math.abs(v-f)}%;--c:${d.color}"></div>
          <div class="zero"></div>
          <div class="tgt" style="left:${h(e)}%"></div>
          ${$!==void 0?l`<div class="marker" style="left:${$}%"></div>`:""}
        </div>
        <div class="bar-text">
          <span class="dim num">−${u(this.hass,m,0)} kW</span>
          <span class="num mid">${i===void 0?"no battery data":l`<b>${u(this.hass,i,2)} kW</b> · ${U}`}</span>
          <span class="dim num">+${u(this.hass,m,0)} kW</span>
        </div>
        <div class="bar amps clickable" @click=${()=>this.moreInfo("number:current_setpoint")} title="Offered current between 6 A and the limit">
          <div class="zone" style="left:0;width:${w(a)}%;--c:var(--ev-car)"></div>
          ${a<o?l`<div class="tgt cap" style="left:${w(a)}%" title="SOC limit ${a} A"></div>`:""}
          <div class="tgt" style="left:${w(o)}%" title="Max Current Limit ${o} A"></div>
          ${r!==void 0?l`<div class="marker" style="left:${w(r)}%"></div>`:""}
        </div>
        <div class="bar-text">
          <span class="dim num">6 A</span>
          <span class="num mid"><b>${u(this.hass,r,0)} A</b> offered${a<o?l` · SOC cap <b>${a} A</b>`:""}${c.settle?l` · <span class="dim">settle ${c.settle} s</span>`:""}</span>
          <span class="dim num">${u(this.hass,o,0)} A max</span>
        </div>
      </div>
    `}_manualLine(t){let e=this.num("number:current_setpoint"),s=this.num("number:max_current_limit")??40,i=this.str("state_text_sensor_output");return l`
      <div class="ctl">
        <div class="ctl-head">
          <span class="label">Controller</span>
          <span class="ctl-text dim">
            ${t===1?l`Manual: the car is offered <b class="num">${u(this.hass,e,0)} A</b> (limit ${u(this.hass,s,0)} A); the house battery is not watched.`:l`Stopped: the pilot is off. ${i&&i!=="Stopped"?i:""}`}
          </span>
        </div>
      </div>
    `}_controls(t){let e=this.num("number:current_setpoint"),s=this.num("number:max_current_limit")??40,i=t!==0&&e!==void 0,r=(o,c,a)=>l`
      <button class="mode ${a?"active":""}" style="--c:${c.color}" @click=${()=>this._press(o)} title=${c.name}>
        <ha-icon icon=${c.icon}></ha-icon><span>${c.short}</span>
      </button>
    `;return l`
      <div class="controls">
        <div class="modes">${r("stop",X[0],t===0)} ${r("normal",X[2],t===2)} ${r("fast",X[3],t===3)}</div>
        <div class="stepper ${i?"":"off"}">
          <button @click=${()=>this._stepSetpoint(-1)} ?disabled=${!i||e<=H} title="1 A less"><ha-icon icon="mdi:minus"></ha-icon></button>
          <span class="val num clickable" @click=${()=>this.moreInfo("number:current_setpoint")}>${u(this.hass,e,0)}<span class="unit">A</span></span>
          <button @click=${()=>this._stepSetpoint(1)} ?disabled=${!i||e>=s} title="1 A more"><ha-icon icon="mdi:plus"></ha-icon></button>
          <span class="dim max clickable" @click=${()=>this.moreInfo("number:max_current_limit")}>max ${u(this.hass,s,0)} A</span>
        </div>
      </div>
    `}_footer(){let t=this.stateObj("event_flag"),e=this.num("temperature_pcb");if(!t&&e===void 0)return"";let s=t&&t.state!=="unknown"&&t.state!=="unavailable"?t.state:void 0;return l`
      <div class="footer">
        ${s?l`<span class="clickable" @click=${()=>this.moreInfo("event_flag")}><ha-icon icon="mdi:flag-outline"></ha-icon>${s} <span class="dim">· ${Dt(t.last_changed)}</span></span>`:""}
        ${e!==void 0?l`<span class="clickable right" @click=${()=>this.moreInfo("temperature_pcb")}><ha-icon icon="mdi:thermometer"></ha-icon><span class="num">${u(this.hass,e,0)} ${this.unit("temperature_pcb")}</span></span>`:""}
      </div>
    `}_chart(){let t=Date.now(),e=t-24*36e5,s=[...this._day?.car??[]],i=[...this._day?.battery??[]],r=this.numIn("power","kW"),o=this.numIn("ha_battery_power_filtered","kW");r!==void 0&&s.push([t,r]),o!==void 0&&i.push([t,o]);let c=1e3,a=100,d=p=>(p-e)/(t-e)*c,m=Math.max(1,...s.map(([,p])=>Math.abs(p)),...i.map(([,p])=>Math.abs(p))),h=i.some(([,p])=>p<-.05),f=h?a/2:a,v=p=>h?f-p/m*(a/2):a-p/m*a,$=s.length>1?`M${d(s[0][0]).toFixed(1)},${f} L${s.map(([p,_])=>`${d(p).toFixed(1)},${v(Math.max(0,_)).toFixed(1)}`).join(" L")} L${d(s[s.length-1][0]).toFixed(1)},${f}Z`:"",b=i.length>1?"M"+i.map(([p,_])=>`${d(p).toFixed(1)},${v(_).toFixed(1)}`).join(" L"):"",y=[24,18,12,6,0].map(p=>t-p*36e5),x=this._hover,U=(p,_)=>{let M;for(let J of p)(!M||Math.abs(J[0]-_)<Math.abs(M[0]-_))&&(M=J);return M?.[1]},w=p=>new Date(p).toLocaleTimeString(this.hass.locale?.language,{hour:"2-digit",minute:"2-digit"});return l`
      <div class="chart">
        <div class="chart-head">
          <span class="label">Last 24 h</span>
          <span class="legend"><i style="background:var(--ev-car)"></i>Car</span>
          <span class="legend"><i style="background:var(--ev-discharge)"></i>House battery</span>
          <span class="dim num scale">±${u(this.hass,m,1)} kW</span>
        </div>
        <div
          class="plot"
          @mousemove=${p=>{let _=p.currentTarget.getBoundingClientRect();this._hover=Math.max(0,Math.min(1,(p.clientX-_.left)/_.width))}}
          @mouseleave=${()=>this._hover=void 0}
          @click=${()=>this.moreInfo("power")}
        >
          <svg viewBox="0 0 ${c} ${a}" preserveAspectRatio="none">
            ${A`
              <line x1="0" x2=${c} y1=${f} y2=${f} class="zero-line"></line>
              <path d=${$} fill="var(--ev-car)" fill-opacity="0.35"></path>
              <path d=${b} fill="none" stroke="var(--ev-discharge)" stroke-width="2" vector-effect="non-scaling-stroke"></path>
              ${x!==void 0?A`<line x1=${x*c} x2=${x*c} y1="0" y2=${a} class="cursor"></line>`:""}
            `}
          </svg>
          ${this._day?"":l`<div class="loading dim">Loading history…</div>`}
          ${x!==void 0?(()=>{let p=e+x*(t-e);return l`<div class="tip" style="left:${x*100}%;${x>.6?"transform:translateX(-100%)":""}">
                  <div class="dim">${w(p)}</div>
                  <div class="num">Car ${u(this.hass,U(s,p),2)} kW</div>
                  <div class="num">Battery ${u(this.hass,U(i,p),2)} kW</div>
                </div>`})():""}
        </div>
        <div class="ticks">${y.map((p,_)=>l`<span>${_===4?"now":w(p)}</span>`)}</div>
      </div>
    `}getGridOptions(){return{columns:"full",rows:"auto"}}};P(G,"properties",{...C.properties,_day:{state:!0},_hover:{state:!0},_tick:{state:!0}}),P(G,"styles",[et,z`
      .wrap {
        padding: 16px 20px 18px;
        container-type: inline-size;
      }
      .missing {
        color: var(--ev-muted);
      }
      .banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 20px;
        border-radius: 0;
        background: color-mix(in srgb, var(--c) 18%, transparent);
        border-bottom: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
        font-size: 14px;
      }
      .banner ha-icon {
        color: var(--c);
        flex: none;
      }
      .header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
        margin-bottom: 14px;
      }
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }
      .title ha-icon {
        --mdc-icon-size: 22px;
        color: var(--state-icon-color, var(--primary-color));
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px 4px 10px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 500;
        color: var(--c);
        background: color-mix(in srgb, var(--c) 14%, transparent);
        cursor: pointer;
        white-space: nowrap;
      }
      .chip i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--c);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent);
      }
      .chip ha-icon {
        --mdc-icon-size: 16px;
      }

      /* flow */
      .flow {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(28px, 0.45fr) minmax(0, 1fr) minmax(28px, 0.45fr) minmax(0, 1fr);
        align-items: center;
        gap: 4px;
        margin: 0 -6px;
      }
      .node {
        padding: 6px;
        text-align: center;
        min-width: 0;
      }
      .node-icon {
        --mdc-icon-size: 34px;
        display: block;
        margin: 4px auto 2px;
      }
      .big {
        font-size: 30px;
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
      }
      .sub {
        font-size: 12.5px;
        margin-top: 2px;
        color: var(--primary-text-color);
      }
      .sub.dim,
      .sub .dim {
        color: var(--ev-muted);
      }
      .today {
        border-radius: 6px;
        padding: 1px 4px;
        margin: 2px -4px 0;
      }
      .today:hover {
        background: rgba(127, 127, 127, 0.12);
      }
      .link {
        position: relative;
        height: 24px;
        align-self: center;
        margin-top: 6px;
      }
      .link svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
      }
      .link .rail {
        stroke: var(--ev-track);
        stroke-width: 6;
        vector-effect: non-scaling-stroke;
        stroke-linecap: round;
      }
      .link .dash {
        stroke: var(--c);
        stroke-width: 6;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
        stroke-dasharray: 10 14;
        animation: flow var(--t) linear infinite;
      }
      .link.back .dash {
        animation-direction: reverse;
      }
      .link .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        --mdc-icon-size: 18px;
        color: var(--c);
      }
      .link.fwd .arrow {
        right: -6px;
      }
      .link.back .arrow {
        left: -6px;
      }
      @keyframes flow {
        to {
          stroke-dashoffset: -24;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .link .dash {
          animation: none;
        }
      }
      /* Narrow column: the flow runs top to bottom, one row per node. */
      @container (max-width: 480px) {
        .wrap {
          padding: 14px 14px 16px;
        }
        .flow {
          grid-template-columns: 1fr;
          gap: 0;
          margin: 0 -4px;
        }
        .node {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) auto;
          grid-template-rows: auto auto auto;
          column-gap: 10px;
          align-items: center;
          text-align: left;
          padding: 4px 6px;
        }
        .node .label {
          grid-column: 2;
          grid-row: 1;
        }
        .node .node-icon {
          grid-column: 1;
          grid-row: 1 / span 3;
          --mdc-icon-size: 30px;
          margin: 0;
        }
        .node .big {
          grid-column: 3;
          grid-row: 1 / span 2;
          font-size: 26px;
          text-align: right;
        }
        .node .sub {
          grid-column: 2;
          grid-row: 2;
          margin-top: 0;
        }
        .node .sub.dim {
          grid-column: 2 / span 2;
          grid-row: 3;
        }
        .link {
          width: 28px;
          height: 26px;
          margin: -2px 0 -2px 12px;
        }
        .link svg {
          transform: rotate(90deg);
        }
        .link .arrow {
          top: auto;
          left: 50%;
          right: auto;
          bottom: -9px;
          transform: translateX(-50%) rotate(90deg);
        }
        .link.back .arrow {
          bottom: auto;
          top: -9px;
          left: 50%;
        }
      }

      /* controller */
      .ctl {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--ev-line);
      }
      .ctl-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 12px;
        margin-bottom: 8px;
      }
      .ctl-text {
        font-size: 14px;
      }
      .ctl-text b {
        font-weight: 500;
      }
      .bar {
        position: relative;
        height: 10px;
        border-radius: 5px;
        background: var(--ev-track);
        margin: 8px 0 0;
      }
      .bar.amps {
        margin-top: 12px;
      }
      .bar .zone {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 5px;
        background: color-mix(in srgb, var(--c) 40%, transparent);
      }
      .bar .zero {
        position: absolute;
        left: 50%;
        top: -3px;
        bottom: -3px;
        width: 2px;
        margin-left: -1px;
        background: var(--ev-muted);
        opacity: 0.5;
      }
      .bar .tgt {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 2px;
        margin-left: -1px;
        background: var(--primary-text-color);
        opacity: 0.7;
      }
      .bar .tgt.cap {
        background: var(--ev-warn);
        opacity: 1;
      }
      .bar .marker {
        position: absolute;
        top: 50%;
        width: 16px;
        height: 16px;
        margin: -8px 0 0 -8px;
        border-radius: 50%;
        background: var(--primary-text-color);
        border: 3px solid var(--card-background-color, #fff);
        box-sizing: border-box;
        transition: left 0.6s ease;
      }
      .bar-text {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 6px;
        font-size: 12px;
      }
      .bar-text b {
        font-weight: 500;
      }
      .bar-text .mid {
        text-align: center;
      }

      /* controls */
      .controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px 16px;
        margin-top: 16px;
      }
      .modes {
        display: flex;
        gap: 8px;
      }
      button {
        font: inherit;
        color: inherit;
        border: 0;
        cursor: pointer;
        background: var(--ev-track);
        border-radius: 12px;
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .mode {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        width: 72px;
        padding: 8px 0 6px;
        font-size: 12px;
        color: var(--ev-muted);
      }
      .mode ha-icon {
        --mdc-icon-size: 24px;
      }
      .mode:hover {
        background: rgba(127, 127, 127, 0.28);
      }
      .mode.active {
        color: var(--c);
        background: color-mix(in srgb, var(--c) 18%, transparent);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 50%, transparent);
      }
      .stepper {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .stepper.off {
        opacity: 0.6;
      }
      .stepper button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: grid;
        place-items: center;
      }
      .stepper .val {
        min-width: 58px;
        text-align: center;
        font-size: 24px;
        padding: 2px 4px;
      }
      .stepper .max {
        font-size: 12px;
        padding: 2px 6px;
      }

      /* footer */
      .footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 6px 14px;
        margin-top: 14px;
        padding-top: 10px;
        border-top: 1px solid var(--ev-line);
        font-size: 12.5px;
      }
      .footer span.clickable {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 2px 6px;
        margin: 0 -6px;
      }
      .footer ha-icon {
        --mdc-icon-size: 16px;
        color: var(--ev-muted);
      }

      /* chart */
      .chart {
        margin-top: 14px;
      }
      .chart-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;
      }
      .legend {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: var(--ev-muted);
      }
      .legend i {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }
      .scale {
        margin-left: auto;
        font-size: 12px;
      }
      .plot {
        position: relative;
        cursor: crosshair;
        height: 110px;
        border-left: 1px solid var(--ev-line);
        border-bottom: 1px solid var(--ev-line);
      }
      .plot svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .zero-line {
        stroke: var(--ev-line);
        stroke-dasharray: 4 4;
        vector-effect: non-scaling-stroke;
      }
      .cursor {
        stroke: var(--primary-text-color);
        stroke-opacity: 0.5;
        vector-effect: non-scaling-stroke;
      }
      .loading {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        font-size: 13px;
      }
      .tip {
        position: absolute;
        top: 4px;
        margin: 0 8px;
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 1.5;
        white-space: nowrap;
        pointer-events: none;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--ev-line);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        margin-top: 4px;
        font-size: 11px;
        color: var(--ev-muted);
      }
    `]);customElements.get("esphome-evse-card")||customElements.define("esphome-evse-card",G);var le=[{key:"stop",mode:0,label:"Stop",icon:"mdi:power",color:"#FF5252"},{key:"normal",mode:2,label:"Normal",icon:"mdi:lightning-bolt",color:"#42D66A"},{key:"fast",mode:3,label:"Fast",icon:"mdi:flash",color:"#FFB74D"}],Tt=[[0,"#2E7D32"],[3.6,"#F9A825"],[7.2,"#EF6C00"],[11,"#C62828"]],de=100,he=100,Lt=86,jt=67,F=135,st=270;function Vt(n,t){let e=t*Math.PI/180;return[de+n*Math.cos(e),he+n*Math.sin(e)]}function it(n,t,e){let s=e>=t,i=Math.abs(e-t);if(i<.01)return"";let[r,o]=Vt(n,t),[c,a]=Vt(n,e);return`M${r.toFixed(2)} ${o.toFixed(2)} A${n} ${n} 0 ${i>180?1:0} ${s?1:0} ${c.toFixed(2)} ${a.toFixed(2)}`}var nt=class extends C{static getStubConfig(t){let e=Object.keys(t?.states??{}).find(s=>/^sensor\.(\w+)_cp_output_pwm_duty_cycle$/.test(s));return{prefix:e?e.match(/^sensor\.(\w+)_cp_output_pwm_duty_cycle$/)[1]:"evse_0"}}setConfig(t){super.setConfig({show_status:!0,show_buttons:!0,power_max_kw:11,battery_max_kw:10,...t})}watched(){return["power","daily_energy","daily_cost","daily_percent","state_text_sensor_output","ha_battery_power","ha_battery_power_filtered","number:charger_mode"]}_press(t){this.hass.callService("button","press",{entity_id:this.eid(`button:${t}`)})}render(){if(!this.hass||!this._config)return g;if(!this.has("power")&&!this.has("number:charger_mode"))return l`<ha-card><div class="wrap dim">No EVSE entities found for prefix <b>${this.prefix}</b>.</div></ha-card>`;let t=Math.round(this.num("number:charger_mode")??-1),e=this.str("state_text_sensor_output");return l`
      <ha-card>
        <div class="wrap">
          ${this._config.title?l`<div class="title">${this._config.title}</div>`:""}
          ${this._config.show_status&&e?l`<div class="status clickable" @click=${()=>this.moreInfo("state_text_sensor_output")}>${e}</div>`:""}
          ${this._config.show_buttons?l`<div class="modes">
                ${le.map(s=>l`<button class=${t===s.mode?"active":""} style="--c:${s.color}" @click=${()=>this._press(s.key)} title=${s.label}>
                    <ha-icon icon=${s.icon}></ha-icon><span>${s.label}</span>
                  </button>`)}
              </div>`:""}
          ${this._gauge()}
        </div>
      </ha-card>
    `}_gauge(){let t=Math.max(0,this.numIn("power","kW")??0),e=this.has("power"),s=this.numIn("ha_battery_power","kW")??this.numIn("ha_battery_power_filtered","kW"),i=this.numIn("daily_energy","kWh"),r=this.num("daily_cost"),o=this.num("daily_percent"),c=(this.unit("daily_cost")||"USD").replace("USD","$"),a=this._config.power_max_kw,d=this._config.battery_max_kw,m=F+st*Math.min(1,t/a),h=Tt.reduce((b,[y,x])=>t>=y?x:b,Tt[0][1]),f=s===void 0?0:Math.max(-1,Math.min(1,s/d)),v=270+st/2*f,$=(s??0)>0?"#31FF00":"#FF1E1E";return l`
      <div class="gauge">
        <svg viewBox="0 0 200 200" role="img" aria-label="Charger power ${u(this.hass,t,2)} kW">
          ${A`
            <path class="track" d=${it(Lt,F,F+st)} stroke-width="13"></path>
            <path class="track inner" d=${it(jt,F,F+st)} stroke-width="8"></path>
            ${t>.005?A`<path class="value" d=${it(Lt,F,m)} stroke=${h} stroke-width="13"></path>`:""}
            ${Math.abs(f)>.002?A`<path class="value" d=${it(jt,270,v)} stroke=${$} stroke-width="8"></path>`:""}
            <line x1="100" y1="27" x2="100" y2="39" class="zero"></line>
          `}
        </svg>
        <div class="inside">
          <div class="net clickable" @click=${()=>this.moreInfo("ha_battery_power")}>
            <div class="label">Net</div>
            <div class="net-val num">${s===void 0?"\u2013":u(this.hass,s,2)} <span class="small">kW</span></div>
          </div>
          <div class="power clickable" @click=${()=>this.moreInfo("power")}>
            <span class="num">${e?u(this.hass,t,2):"\u2013"}</span><span class="pu">kW</span>
          </div>
          <div class="today clickable" @click=${()=>this.moreInfo("daily_energy")}>
            <div class="label">Added today</div>
            <div class="row num"><span>${u(this.hass,i,2)}</span><span class="u">kWh</span></div>
            ${r!==void 0?l`<div class="row num"><span>${u(this.hass,r,2)}</span><span class="u">${c}</span></div>`:""}
            ${o!==void 0?l`<div class="row num"><span>${u(this.hass,o,1)}</span><span class="u">%</span></div>`:""}
          </div>
        </div>
      </div>
    `}getCardSize(){return 5}};P(nt,"styles",[et,z`
      .wrap {
        padding: 14px 16px 16px;
        container-type: inline-size;
      }
      .title {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 6px;
      }
      .status {
        text-align: center;
        font-size: clamp(0.95rem, 4cqw, 1.3rem);
        font-weight: 700;
        line-height: 1.2;
        padding: 10px 8px;
        margin: 0 -4px 10px;
        overflow-wrap: anywhere;
      }
      .modes {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 8px;
      }
      button {
        font: inherit;
        color: var(--primary-text-color);
        border: 0;
        cursor: pointer;
        border-radius: 12px;
        background: rgb(45, 45, 45);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 0 10px;
        font-size: 13px;
        transition: background 0.2s ease;
      }
      button ha-icon {
        --mdc-icon-size: 28px;
        color: #cfcfcf;
      }
      button:hover {
        background: rgb(62, 62, 62);
      }
      button.active {
        background: var(--c);
        color: #111;
      }
      button.active ha-icon {
        color: #111;
      }
      .gauge {
        position: relative;
        width: min(100%, 330px);
        margin: 0 auto;
        aspect-ratio: 1;
        container-type: inline-size;
      }
      .gauge svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .track {
        fill: none;
        stroke: var(--ev-track);
        stroke-linecap: butt;
      }
      .track.inner {
        stroke: rgba(127, 127, 127, 0.1);
      }
      .value {
        fill: none;
        stroke-linecap: butt;
        transition: d 0.6s ease;
      }
      .zero {
        stroke: var(--ev-muted);
        stroke-width: 1.5;
        opacity: 0.6;
      }
      .inside {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5cqw;
        text-align: center;
        /* inside the inner ring (radius 67/100): start below its top edge, run into the open bottom */
        padding: 23% 20% 5%;
        box-sizing: border-box;
      }
      .inside .clickable {
        padding: 1cqw 3cqw;
      }
      .inside .label {
        font-size: 4cqw;
        letter-spacing: 0.1em;
      }
      .net-val {
        font-size: 6.5cqw;
        color: var(--primary-text-color);
      }
      .net-val .small {
        font-size: 0.6em;
        color: var(--ev-muted);
      }
      .power {
        display: flex;
        align-items: baseline;
        gap: 2cqw;
        font-size: 18cqw;
        font-weight: 500;
        line-height: 1;
        letter-spacing: -0.02em;
      }
      .power .pu {
        font-size: 0.35em;
        color: var(--ev-muted);
      }
      .today .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2cqw;
        font-size: 6.5cqw;
        line-height: 1.3;
      }
      .today .row span:first-child {
        text-align: right;
      }
      .today .row .u {
        text-align: left;
        color: var(--ev-muted);
      }
    `]);customElements.get("esphome-evse-simple-card")||customElements.define("esphome-evse-simple-card",nt);window.customCards??=[];window.customCards.push({type:"esphome-evse-card",name:"ESPHome EVSE Card (Advanced)",description:"Power flow, charge controller, controls and 24 h history for the ESPHome EVSE.",preview:!0,documentationURL:"https://github.com/clowrey/esphome-evse-card"},{type:"esphome-evse-simple-card",name:"ESPHome EVSE Card (Simple)",description:"Status, Stop / Normal / Fast and the power gauge for the ESPHome EVSE.",preview:!0,documentationURL:"https://github.com/clowrey/esphome-evse-card"});console.info("%c ESPHOME-EVSE-CARD %c 0.2.0 ","color: white; background: #ef6c00","");

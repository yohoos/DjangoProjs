webpackJsonp([1],{"9tAn":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("section",[n("v-parallax",{attrs:{src:"/static/images/spring.jpg",height:"600"}},[n("v-layout",{attrs:{column:"","align-center":"","justify-center":""}},[n("v-flex",{attrs:{lg:""}}),t._v(" "),n("v-flex",{attrs:{lg:"","text-lg-center":""}},[n("h2",[t._v(t._s(t.welcome))]),t._v(" "),n("h4",[n("i",[t._v(t._s(t.profession))])])]),t._v(" "),n("v-flex",{attrs:{lg:"","text-lg-center":""}},[n("p")])],1)],1)],1),t._v(" "),n("section",[n("v-parallax",{attrs:{src:"/static/images/summer.jpg",height:"600"}},[n("v-layout",{attrs:{column:"","align-center":"","justify-center":""}},[n("v-flex",{attrs:{lg:""}}),t._v(" "),n("v-flex",{attrs:{lg:"","text-lg-center":""}},[n("h2",[t._v(t._s(t.welcome))]),t._v(" "),n("h4",[n("i",[t._v(t._s(t.profession))])])]),t._v(" "),n("v-flex",{attrs:{lg:"","text-lg-center":""}},[n("p")])],1)],1)],1)])},i=[],s={render:a,staticRenderFns:i};e.a=s},DErK:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-layout",{attrs:{"justify-center":"","align-center":""}},[n("v-flex",{attrs:{lg10:"","text-lg-center":""}},[n("p",[t._v(t._s(t.msg))])])],1)},i=[],s={render:a,staticRenderFns:i};e.a=s},Fs8J:function(t,e,n){"use strict";e.a={name:"home",data:function(){return{welcome:"Yuhua Ni",profession:"Data Engineer"}}}},"If/i":function(t,e){},M93x:function(t,e,n){"use strict";function a(t){n("QKa5")}var i=n("xJD8"),s=n("toAc"),r=n("VU/8"),o=a,c=r(i.a,s.a,o,null,null);e.a=c.exports},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("7+uW"),i=n("M93x"),s=n("YaEn"),r=n("3EgV"),o=n.n(r);n.e(0).then(n.bind(null,"7zck")),a.a.use(o.a),a.a.config.productionTip=!1,new a.a({el:"#app",router:s.a,template:"<App/>",components:{App:i.a}})},QKa5:function(t,e){},YaEn:function(t,e,n){"use strict";var a=n("7+uW"),i=n("/ocq"),s=n("lO7g"),r=n("wSug");a.a.use(i.a),e.a=new i.a({routes:[{path:"/",name:"Home",component:s.a},{path:"/map",name:"WifiMap",component:r.a}]})},lO7g:function(t,e,n){"use strict";function a(t){n("If/i")}var i=n("Fs8J"),s=n("9tAn"),r=n("VU/8"),o=a,c=r(i.a,s.a,o,"data-v-19c9ed48",null);e.a=c.exports},"qY/j":function(t,e){},toAc:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{attrs:{id:"inspire"}},[n("v-navigation-drawer",{attrs:{persistent:"",light:"","mini-variant":t.mini},on:{"update:miniVariant":function(e){t.mini=e}},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[n("v-toolbar",{staticClass:"transparent",attrs:{flat:""}},[n("v-list",{staticClass:"pa-0"},[n("v-list-tile",{attrs:{avatar:""}},[n("v-list-tile-avatar",[n("img",{attrs:{src:"https://avatars2.githubusercontent.com/u/12375128?v=4&s=400&u=44411691244718d092661e0dc4e4a9704c6b5365"}})]),t._v(" "),n("v-list-tile-content",[n("v-list-tile-title",[t._v("Yuhua Ni")])],1),t._v(" "),n("v-list-tile-action",[n("v-btn",{attrs:{icon:""},nativeOn:{click:function(e){e.stopPropagation(),t.mini=!t.mini}}},[n("v-icon",[t._v("chevron_left")])],1)],1)],1)],1)],1),t._v(" "),n("v-list",{staticClass:"pt-0",attrs:{dense:""}},[n("v-divider"),t._v(" "),t._l(t.items,function(e){return n("v-list-tile",{key:e.title,on:{click:function(n){t.goTo(e.title)}}},[n("v-list-tile-action",[n("v-icon",[t._v(t._s(e.icon))])],1),t._v(" "),n("v-list-tile-content",[n("v-list-tile-title",[t._v(t._s(e.title))])],1)],1)})],2)],1),t._v(" "),n("v-toolbar",{staticClass:"orange lighten-2",attrs:{dark:"",fixed:"",app:""}},[n("v-toolbar-title",[t._v("Portfolio")])],1),t._v(" "),n("main",[n("v-content",[n("router-view")],1)],1),t._v(" "),n("v-footer",{staticClass:"orange lighten-2",attrs:{app:""}},[n("span",{staticClass:"white--text"},[t._v("© 2017")])])],1)},i=[],s={render:a,staticRenderFns:i};e.a=s},wSug:function(t,e,n){"use strict";function a(t){n("qY/j")}var i=n("z5o5"),s=n("DErK"),r=n("VU/8"),o=a,c=r(i.a,s.a,o,"data-v-331633a4",null);e.a=c.exports},xJD8:function(t,e,n){"use strict";e.a={data:function(){return{drawer:!0,items:[{title:"Home",icon:"dashboard"},{title:"WifiMap",icon:"assignment"}],mini:!0,right:null}},props:{source:String},methods:{goTo:function(t){this.$router.push({name:t,params:{}})}}}},z5o5:function(t,e,n){"use strict";e.a={name:"wifimap",data:function(){return{msg:"Welcome to the Map"}}}}},["NHnr"]);
//# sourceMappingURL=app.aae1feb831cdac71a430.js.map
webpackJsonp([1],{"9I4D":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("section",[i("v-parallax",{attrs:{src:"/static/images/spring.jpg",height:"600"}},[i("v-layout",{attrs:{column:"","align-center":"","justify-center":""}},[i("v-flex",{attrs:{xs:"","text-xs-center":""}},[i("h2",[t._v(t._s(t.welcome))]),t._v(" "),i("h4",[i("i",[t._v(t._s(t.profession))])])]),t._v(" "),i("v-flex",{attrs:{md:""}},[i("v-avatar",{attrs:{size:t.img_width}},[i("img",{attrs:{src:"https://avatars2.githubusercontent.com/u/12375128?v=4&s=400&u=44411691244718d092661e0dc4e4a9704c6b5365",alt:"My Face"}})])],1)],1)],1)],1),t._v(" "),i("section",[i("v-parallax",{attrs:{src:"/static/images/summer.jpg",height:"600"}},[i("v-layout",{attrs:{column:"","align-center":"","justify-center":""}},[i("v-flex",{attrs:{lg:""}}),t._v(" "),i("v-flex",{attrs:{lg:"","text-lg-center":""}},[i("h2",[t._v(t._s(t.welcome))]),t._v(" "),i("h4",[i("i",[t._v(t._s(t.profession))])])]),t._v(" "),i("v-flex",{attrs:{lg:"","text-lg-center":""}},[i("p")])],1)],1)],1)])},a=[],s={render:n,staticRenderFns:a};e.a=s},Fs8J:function(t,e,i){"use strict";e.a={name:"home",data:function(){return{welcome:"Yuhua Ni",profession:"Data Engineer",img_width:"200px",current_job:null,jobs:[]}},mounted:function(){}}},IUbK:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-layout",{attrs:{"justify-center":"","align-center":""}},[i("v-flex",{attrs:{lg10:"","text-lg-center":""}},[i("p",[t._v(t._s(t.msg))])])],1)},a=[],s={render:n,staticRenderFns:a};e.a=s},M93x:function(t,e,i){"use strict";function n(t){i("WpCr")}var a=i("xJD8"),s=i("Vq/C"),r=i("VU/8"),o=n,c=r(a.a,s.a,!1,o,null,null);e.a=c.exports},NHnr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("7+uW"),a=i("M93x"),s=i("YaEn"),r=i("3EgV"),o=i.n(r);i.e(0).then(i.bind(null,"7zck")),n.a.use(o.a),n.a.config.productionTip=!1,new n.a({el:"#app",router:s.a,template:"<App/>",components:{App:a.a}})},"Vq/C":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",{attrs:{id:"inspire"}},[i("v-navigation-drawer",{attrs:{clipped:"",persistent:"",light:"","mini-variant":t.mini,"enable-resize-watcher":"",app:""},on:{"update:miniVariant":function(e){t.mini=e}},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[i("v-toolbar",{staticClass:"transparent",attrs:{flat:""}},[i("v-list",{staticClass:"pa-0"},[i("v-list-tile",{attrs:{avatar:""}},[i("v-list-tile-avatar",[i("img",{attrs:{src:"https://avatars2.githubusercontent.com/u/12375128?v=4&s=400&u=44411691244718d092661e0dc4e4a9704c6b5365"}})]),t._v(" "),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Yuhua Ni")])],1),t._v(" "),i("v-list-tile-action",[i("v-btn",{attrs:{icon:""},nativeOn:{click:function(e){e.stopPropagation(),t.mini=!t.mini}}},[i("v-icon",[t._v("chevron_left")])],1)],1)],1)],1)],1),t._v(" "),i("v-list",{staticClass:"pt-0",attrs:{dense:""}},[i("v-divider"),t._v(" "),t._l(t.items.slice(0,1),function(e){return i("v-list-tile",{key:e.title,on:{click:function(i){t.goTo(e.title)}}},[i("v-list-tile-action",[i("v-icon",[t._v(t._s(e.icon))])],1),t._v(" "),i("v-list-tile-content",[i("v-list-tile-title",[t._v(t._s(e.title))])],1)],1)}),t._v(" "),i("v-list-tile",[i("v-list-tile-content",[i("v-list-tile-title",[t._v("Projects")])],1)],1),t._v(" "),t._l(t.items.slice(1),function(e){return i("v-list-tile",{key:e.title,on:{click:function(i){t.goTo(e.title)}}},[i("v-list-tile-action",[i("v-icon",[t._v(t._s(e.icon))])],1),t._v(" "),i("v-list-tile-content",[i("v-list-tile-title",[t._v(t._s(e.title))])],1)],1)})],2)],1),t._v(" "),i("v-toolbar",{attrs:{color:"primary","clipped-left":"",dark:"",fixed:"",app:""}},[i("v-toolbar-side-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v(" "),i("v-toolbar-title",[t._v("Welcome")])],1),t._v(" "),i("main",[i("v-content",[i("router-view")],1)],1),t._v(" "),i("v-footer",{attrs:{color:"primary",app:""}},[i("span",{staticClass:"white--text"},[t._v("© 2017. Powered by VueJS and Vuetify")])])],1)},a=[],s={render:n,staticRenderFns:a};e.a=s},WpCr:function(t,e){},YaEn:function(t,e,i){"use strict";var n=i("7+uW"),a=i("/ocq"),s=i("lO7g"),r=i("wSug");n.a.use(a.a),e.a=new a.a({routes:[{path:"/",name:"Home",component:s.a},{path:"/map",name:"WifiMap",component:r.a}]})},lO7g:function(t,e,i){"use strict";function n(t){i("uWqz")}var a=i("Fs8J"),s=i("9I4D"),r=i("VU/8"),o=n,c=r(a.a,s.a,!1,o,"data-v-246bbd84",null);e.a=c.exports},no7s:function(t,e){},uWqz:function(t,e){},wSug:function(t,e,i){"use strict";function n(t){i("no7s")}var a=i("z5o5"),s=i("IUbK"),r=i("VU/8"),o=n,c=r(a.a,s.a,!1,o,"data-v-abd8b310",null);e.a=c.exports},xJD8:function(t,e,i){"use strict";e.a={data:function(){return{drawer:!0,items:[{title:"Home",icon:"dashboard"},{title:"WifiMap",icon:"assignment"}],mini:!1,right:null}},props:{source:String},methods:{goTo:function(t){this.$router.push({name:t,params:{}})}}}},z5o5:function(t,e,i){"use strict";e.a={name:"wifimap",data:function(){return{msg:"Welcome to the Map"}}}}},["NHnr"]);
//# sourceMappingURL=app.325b445f94d66b327810.js.map
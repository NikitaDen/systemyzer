(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c754a848"],{"0e74":function(e,t,r){"use strict";var n=r("3af2"),o=r.n(n);o.a},"3af2":function(e,t,r){},"48d5":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.isLoading?r("Loader"):r("div",{staticClass:"home"},[r("h2",[e._v("Favorites")]),e.favoriteTopics.length?r("el-collapse",{model:{value:e.activeNamesForFavorites,callback:function(t){e.activeNamesForFavorites=t},expression:"activeNamesForFavorites"}},e._l(e.favoriteTopics,(function(t){return r("el-collapse-item",{key:t.id,attrs:{title:t.title+" — "+t.groupTitle,name:t.id}},[r("TopicItems",{attrs:{topic:t,groupId:t.groupId},on:{onTopicToFav:function(t){return e.addTopicToFavoritesHandler(t)},onTopicDone:function(t){return e.setTopicDoneHandler(t)},onDeleteTopic:function(t){return e.deleteTopicHandler(t)}}})],1)})),1):e._e()],1)},o=[],a=(r("99af"),r("4de4"),r("4160"),r("d81d"),r("159b"),r("2909")),i=(r("96cf"),r("1da1")),c=r("5530"),s=r("555f"),u=r("2af7"),p=r("2f62"),d={name:"Favorites",components:{Loader:s["a"],TopicItems:u["a"]},data:function(){return{activeNamesForFavorites:[],isLoading:!0,addingLink:!1}},methods:Object(c["a"])(Object(c["a"])({},Object(p["b"])(["fetchGroups","deleteTopic","createTopic","addTopicToFavorites","setTopicDone"])),{},{deleteTopicHandler:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){var n,o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.groupId,o=e.id,t.isLoading=!0,r.prev=2,r.next=5,t.deleteTopic({groupId:n,id:o});case 5:r.next=10;break;case 7:r.prev=7,r.t0=r["catch"](2),console.log(r.t0);case 10:t.isLoading=!1;case 11:case"end":return r.stop()}}),r,null,[[2,7]])})))()},setTopicDoneHandler:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){var n,o,a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.groupId,o=e.id,a=e.done,r.prev=1,t.updatingTopic=!0,r.next=5,t.setTopicDone({groupId:n,id:o,done:a});case 5:t.updatingTopic=!1,a?t.$message({message:"Topic done.",type:"success"}):t.$message({message:"Topic is not done.",type:"warning"}),r.next=12;break;case 9:r.prev=9,r.t0=r["catch"](1),console.log(r.t0);case 12:case"end":return r.stop()}}),r,null,[[1,9]])})))()},addTopicToFavoritesHandler:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){var n,o,a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.groupId,o=e.id,a=e.favorite,r.prev=1,t.updatingTopic=!0,r.next=5,t.addTopicToFavorites({groupId:n,id:o,favorite:a});case 5:t.updatingTopic=!1,a?t.$message({message:"Topic added to favorites.",type:"success"}):t.$message({message:"Topic removed from favorites.",type:"warning"}),r.next=12;break;case 9:r.prev=9,r.t0=r["catch"](1),console.log(r.t0);case 12:case"end":return r.stop()}}),r,null,[[1,9]])})))()}}),computed:Object(c["a"])(Object(c["a"])({},Object(p["c"])(["groups"])),{},{favoriteTopics:function(){var e=[];return this.groups.forEach((function(t){var r=Object(a["a"])(t.topics).filter((function(e){return!0===e.favorite})).map((function(e){return Object(c["a"])(Object(c["a"])({},e),{},{groupTitle:t.title})}));e=[].concat(Object(a["a"])(e),Object(a["a"])(r))})),e}}),mounted:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.$store.commit("setActivePage",e.$router.history.current.meta.index),t.next=3,e.fetchGroups();case 3:e.isLoading=!1;case 4:case"end":return t.stop()}}),t)})))()}},l=d,v=(r("0e74"),r("2877")),f=Object(v["a"])(l,n,o,!1,null,"0e62170e",null);t["default"]=f.exports}}]);
//# sourceMappingURL=chunk-c754a848.2f92b8fe.js.map
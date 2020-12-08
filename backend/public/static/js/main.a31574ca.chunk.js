(this.webpackJsonpchess_on_the_go_frontend=this.webpackJsonpchess_on_the_go_frontend||[]).push([[0],{115:function(e,t,s){"use strict";s.r(t);var n=s(0),a=s(1),c=s.n(a),i=s(39),r=s.n(i),l=(s(70),s(30),s(31),s(15));function o(){return Object(n.jsx)("div",{children:Object(n.jsx)("div",{className:"container",children:Object(n.jsx)("div",{className:"row",children:Object(n.jsx)("div",{className:"col",children:Object(n.jsxs)("div",{className:"jumbotron brown-border content-container",children:[Object(n.jsx)("div",{className:"row",children:Object(n.jsx)("div",{className:"col",children:Object(n.jsxs)("p",{className:"lead",children:["Looking for an available opponent",Object(n.jsx)("br",{})]})})}),Object(n.jsx)("div",{className:"row",children:Object(n.jsx)("div",{className:"col",children:Object(n.jsx)(l.a,{icon:"spinner",className:"fa-pulse fa-3x",style:{marginLeft:15}})})})]})})})})})}var d=s(14);function j(){return Object(n.jsxs)("div",{className:"container player_menu",children:[Object(n.jsx)("div",{className:"row",children:Object(n.jsx)("div",{className:"col",children:Object(n.jsxs)("div",{className:"jumbotron brown-border content-container",children:[Object(n.jsxs)("p",{className:"lead",children:[Object(n.jsx)(l.a,{icon:"chess-king",className:"chess-king fa-3x",style:{marginLeft:15}}),"Games played: ",4]}),Object(n.jsxs)("p",{className:"lead",children:[Object(n.jsx)(l.a,{icon:"chess-king",className:"chess-king fa-3x"}),"Games won: ",4]}),Object(n.jsxs)("p",{className:"lead",children:[Object(n.jsx)(l.a,{icon:"chess-king",className:"chess-king fa-3x"}),"Games lost: ",4]}),Object(n.jsxs)("p",{className:"lead",children:[Object(n.jsx)(l.a,{icon:"chess-king",className:"chess-king fa-3x"}),"Games tied: ",4]})]})})}),Object(n.jsxs)("div",{className:"row",children:[Object(n.jsx)("div",{className:"col",children:Object(n.jsx)(d.b,{className:"btn btn-secondary",to:"../Game",children:"New Game"})}),Object(n.jsx)("div",{className:"col",children:Object(n.jsx)(d.b,{className:"btn btn-secondary",to:"../PlayerStatistics",children:"Player Stats"})})]})]})}var b=s(8),m=s(9),u=(s(48),s(49),s.p+"static/media/playerStats.92a31c20.png");function h(){var e=Object(a.useState)(Object),t=Object(b.a)(e,2),s=(t[0],t[1]),c=Object(a.useState)(Object),i=Object(b.a)(c,2),r=(i[0],i[1]);var o=[{opponent:"Player 1",status:"Won",timestamp:"11/19/2020 18:47",duration:"18:42"},{opponent:"Player 2",status:"Lost",timestamp:"11/12/2020 17:26",duration:"11:59"},{opponent:"Player 3",status:"Draw",timestamp:"11/09/2020 16:35",duration:"6:34"},{opponent:"Player 4",status:"Won",timestamp:"11/08/2020 15:44",duration:"9:27"}];return Object(n.jsxs)("div",{className:"stats",children:[Object(n.jsx)("img",{src:u,className:"img-fluid banner",alt:"Statistics"}),Object(n.jsxs)("div",{className:"total_games",children:[Object(n.jsx)(l.a,{icon:"chess-king",className:"chess-king fa-3x"}),"Games Played: ",o.length]}),Object(n.jsxs)("div",{className:"container",children:[Object(n.jsx)("div",{className:"row",children:Object(n.jsx)("div",{className:"col",children:Object(n.jsx)("div",{className:"stats_grid ag-theme-alpine",style:{width:"100%",height:"100%"},children:Object(n.jsxs)(m.AgGridReact,{onGridReady:function(e){s(e.api),r(e.columnApi),e.api.sizeColumnsToFit()},domLayout:"autoHeight",defaultColDef:{resizable:!0},rowData:o,children:[Object(n.jsx)(m.AgGridColumn,{field:"opponent"}),Object(n.jsx)(m.AgGridColumn,{field:"status"}),Object(n.jsx)(m.AgGridColumn,{field:"timestamp"}),Object(n.jsx)(m.AgGridColumn,{field:"duration"})]})})})}),Object(n.jsx)("div",{className:"row mt-4",children:Object(n.jsx)("div",{className:"col",children:Object(n.jsx)(d.b,{className:"btn btn-secondary",to:"./menu",children:"Main Menu"})})})]})]})}s(44);var O=s(42),x=s(28);function f(e,t,s){if(null===e)throw new Error("error, no connection to server");e.emit(t,s)}function g(){var e=function(e){var t=Object(a.useRef)(null),s=Object(a.useState)(null),n=Object(b.a)(s,2),c=n[0],i=n[1],r=Object(a.useState)([]),l=Object(b.a)(r,2),o=l[0],d=l[1];Object(a.useEffect)((function(){var s=Object(O.io)().connect();s.on("user",(function(e){return i(JSON.parse(e))})),s.on("users",(function(e){return d(JSON.parse(e))})),s.on("input_error",(function(t){return e(new Error(t))})),t.current=s}),[e]);var j=Object(a.useCallback)(Object(x.throttle)((function(e){var s=new Set(e),n=o.filter((function(e){return s.has(e.email)}));if(n.length!==e.length)throw new Error("The email address you selected does not belong to a registered user.");if(n.some((function(e){return e.isAdmin})))throw new Error("You can't delete an admin user.");if(n.some((function(e){return"none"!==e.state})))throw new Error("You can't delete users who are currently queued or playing a game.");f(t.current,"delete_users",JSON.stringify(e))}),2e3),[o]);return{thisUser:c,allUsers:Object(a.useMemo)((function(){return o.filter((function(e){return"deleted"!==e.state}))}),[o]),deleteUsers:j}}(console.log),t=e.deleteUsers,s=e.allUsers,c=(e.thisUser,Object(a.useState)(Object)),i=Object(b.a)(c,2),r=i[0],l=i[1],o=Object(a.useState)(Object),d=Object(b.a)(o,2),j=(d[0],d[1]);return Object(n.jsxs)("div",{className:"admin",children:[Object(n.jsx)("div",{className:"table_heading",children:"Delete Accounts"}),Object(n.jsx)("div",{className:"ag-theme-alpine",style:{width:"100%",height:"100%"},children:Object(n.jsxs)(m.AgGridReact,{onGridReady:function(e){l(e.api),j(e.columnApi),e.api.sizeColumnsToFit()},domLayout:"autoHeight",defaultColDef:{resizable:!0},rowData:s,rowSelection:"multiple",children:[Object(n.jsx)(m.AgGridColumn,{field:"delete",maxWidth:150,checkboxSelection:!0}),Object(n.jsx)(m.AgGridColumn,{field:"username",maxWidth:300}),Object(n.jsx)(m.AgGridColumn,{field:"email"})]})}),Object(n.jsxs)("div",{className:"user_count",children:["Total Users: ",s.length]}),Object(n.jsx)("button",{className:"btn btn-secondary",onClick:function(e){var s=r.getSelectedNodes();if(0===s.length)alert("Please select a user to delete.");else{var n=s.map((function(e){return e.data})).map((function(e){return e.email}));try{t(n)}catch(e){alert(e.message)}}},children:"Delete"})]})}var p=s.p+"static/media/logo.d89d36b0.png";function v(){return Object(n.jsx)("nav",{className:"navbar navbar-inverse p-3",children:Object(n.jsxs)("div",{className:"container-fluid header-container",children:[Object(n.jsx)("div",{className:"navbar-header",children:Object(n.jsx)("a",{className:"navbar-brand site-logo",href:"#",children:Object(n.jsx)("img",{src:p,className:"img-responsive"})})}),Object(n.jsxs)("ul",{className:"nav navbar-nav navbar-right d-inline-block",children:[Object(n.jsx)("li",{className:"navbar-text navbar-right d-inline-block",children:"Name   |"}),Object(n.jsx)("li",{className:"active d-inline-block",children:Object(n.jsx)(d.b,{className:"btn btn-outline-light btn-logout d-inline-block",to:"./",children:"Logout"})})]})]})})}var N=s(21),w=s(43),y=s(3);N.b.add(w.a,w.b);var k=function(){return Object(n.jsx)(d.a,{children:Object(n.jsx)("div",{className:"App",children:Object(n.jsx)(y.c,{children:Object(n.jsxs)(a.Fragment,{children:[Object(n.jsx)(v,{}),Object(n.jsx)("div",{children:Object(n.jsxs)("div",{className:"App d-flex justify-content-center h-100 align-middle",children:[Object(n.jsx)(y.a,{path:"/",component:j}),Object(n.jsx)(y.a,{path:"/queue",component:o}),Object(n.jsx)(y.a,{path:"/playerstats",component:h}),Object(n.jsx)(y.a,{path:"/admin",component:g})]})})]})})})})},S=function(e){e&&e instanceof Function&&s.e(3).then(s.bind(null,116)).then((function(t){var s=t.getCLS,n=t.getFID,a=t.getFCP,c=t.getLCP,i=t.getTTFB;s(e),n(e),a(e),c(e),i(e)}))};r.a.render(Object(n.jsx)(c.a.StrictMode,{children:Object(n.jsx)(k,{})}),document.getElementById("root")),S()},30:function(e,t,s){},70:function(e,t,s){}},[[115,1,2]]]);
//# sourceMappingURL=main.a31574ca.chunk.js.map
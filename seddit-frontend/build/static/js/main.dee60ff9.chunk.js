(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{36:function(e,t,a){e.exports=a(80)},42:function(e,t,a){},80:function(e,t,a){"use strict";a.r(t);a(37);var n=a(0),s=a.n(n),r=a(33),l=a.n(r),o=(a(42),a(5)),i=a(6),c=a(8),m=a(7),u=a(10),d=a(9),h=(a(43),a(23)),p=a.n(h),b=(a(44),a(16)),g=a(24),f=a(11),v=a.n(f),E="https://seddit-backend.herokuapp.com/";function k(e){return fetch(E+e).then(function(e){return e.json()}).then(function(e){return console.log(e),e})}function y(e,t){return fetch(E+e,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)}).then(function(e){return e.json()}).then(function(e){return console.log(e),e})}var j=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).isToday=function(e){var t=new Date;return e.getDate()===t.getDate()&&e.getMonth()===t.getMonth()&&e.getFullYear()===t.getFullYear()},a.state={commenting:!1},a.toggleComment=a.toggleComment.bind(Object(u.a)(a)),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"formatDate",value:function(e){return e=new Date(e),e=new Date(e.getTime()-6e4*e.getTimezoneOffset()),this.isToday(e)?e.toLocaleTimeString("en-US",{hour12:!0,hour:"numeric",minute:"numeric"}):e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}},{key:"toggleComment",value:function(){this.props.user?this.setState({commenting:!this.state.commenting}):alert("Please login")}},{key:"render",value:function(){return s.a.createElement("div",{className:"card my-4 mx-md-3"},s.a.createElement("p",{className:"card-header"},this.props.author," ",s.a.createElement("span",{className:"text-muted ml-3"},this.formatDate(this.props.created))),s.a.createElement("div",{className:"card-body"},s.a.createElement("h2",{className:"card-title"},this.props.title),s.a.createElement("p",{className:"card-text"},this.props.body),s.a.createElement(w,{post_id:this.props.id,user:this.props.user}),s.a.createElement("a",{role:"button",className:"btn btn-light card-link",onClick:this.toggleComment},"Comment")),s.a.createElement("div",{className:"card-footer"},s.a.createElement(O,{post_id:this.props.id,user:this.props.user,sendComment:this.state.commenting,toggleView:this.toggleComment})))}}]),t}(s.a.Component),w=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).componentDidMount=function(){a.getLikes(),a.isLiked(),a.interval=setInterval(function(){a.getLikes()},3e4)},a.state={likes:null,liked:null},a.getLikes=a.getLikes.bind(Object(u.a)(a)),a.isLiked=a.isLiked.bind(Object(u.a)(a)),a.handleClick=a.handleClick.bind(Object(u.a)(a)),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"getLikes",value:function(){var e=this;k("like/"+this.props.post_id+"/").then(function(t){e.setState({likes:t.likes})})}},{key:"isLiked",value:function(){var e=this;this.props.user?y("isliked/",{user:this.props.user,post_id:this.props.post_id}).then(function(t){e.setState({liked:t.liked})}):this.setState({liked:!1})}},{key:"handleClick",value:function(e){var t=this;e.preventDefault(),this.props.user?this.state.liked?y("unlike/",{user:this.props.user,post_id:this.props.post_id}).then(function(e){"OK"===e.status&&t.setState({likes:t.state.likes-1,liked:!1})}):y("like/"+this.props.post_id+"/",{user:this.props.user,post_id:this.props.post_id}).then(function(e){"OK"===e.status&&t.setState({likes:t.state.likes+1,liked:!0})}):alert("Please login")}},{key:"render",value:function(){return s.a.createElement("a",{role:"button",className:"btn btn-outline-light card-link",onClick:this.handleClick},this.state.liked?s.a.createElement("img",{src:"/images/like-color.svg",width:"45",height:"30",alt:""}):s.a.createElement("img",{src:"/images/like-gray.svg",width:"45",height:"30",alt:""}),s.a.createElement("span",{className:"ml-1"},this.state.likes))}}]),t}(s.a.Component),O=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).isLoading=function(){return null==a.state.posts},a.state={rows:1,body:"",comments:null},a.handleSubmit=a.handleSubmit.bind(Object(u.a)(a)),a.handleChange=a.handleChange.bind(Object(u.a)(a)),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this;k("allcomments/"+this.props.post_id+"/").then(function(t){var a=t.comments;e.setState({comments:a})}),this.interval=setInterval(function(){k("allcomments/"+e.props.post_id+"/").then(function(t){var a=t.comments;e.setState({comments:a})})},3e4)}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.user?(y("allcomments/"+this.props.post_id+"/",{user:this.props.user,body:this.state.body}).then(function(e){var a=e.comment;t.setState({comments:t.state.comments.concat({user:a.user,body:a.body,id:a.id})})}),this.props.toggleView()):alert("Please login")}},{key:"handleChange",value:function(e){this.setState(Object(b.a)({},e.target.name,e.target.value))}},{key:"render",value:function(){if(null==this.state.comments)return s.a.createElement(g.BarLoader,{sizeUnit:"px",size:40,loading:this.isLoading()});var e;e=this.state.comments.length>0?this.state.comments.map(function(e,t){return s.a.createElement("div",{className:"comment",key:e.id},s.a.createElement("p",null,s.a.createElement("b",null,e.user,":")," ",e.body))}):s.a.createElement("p",{className:"text-muted"},"No comments!");var t=this.props.sendComment?s.a.createElement("div",{className:"mb-3"},s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("div",{className:"form-row"},s.a.createElement("div",{className:"w-75 col-auto"},s.a.createElement("textarea",{className:"form-control",name:"body",rows:this.state.rows,onChange:this.handleChange,placeholder:"Comment",required:!0})),s.a.createElement("div",{className:"w-25 col-auto"},s.a.createElement("input",{type:"submit",className:"btn btn-secondary",value:"Send"}))))):"";return s.a.createElement("div",null,t,e)}}]),t}(s.a.Component),N=j,C=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).componentWillMount=function(){k("feed/0/").then(function(e){a.setState({posts:e.feed})})},a.componentDidMount=function(){},a.isLoading=function(){return null==a.state.posts},a.handleChange=function(e){var t;a.setState((t={},Object(b.a)(t,e.target.name,e.target.value),Object(b.a)(t,"length",e.target.value.length),t))},a.loadPosts=function(){a.setState({page:a.state.page+1}),k("feed/"+a.state.page+"/").then(function(e){a.setState({posts:a.state.posts.concat(e.feed)})})},a.state={posts:null,title:"",body:"",length:0,page:0},a.handleSubmit=a.handleSubmit.bind(Object(u.a)(a)),window.onscroll=function(){document.documentElement.offsetHeight-(window.innerHeight+document.documentElement.scrollTop)<=400&&a.loadPosts()},a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.state.length<280?alert("Posts must be at least 280 characters long."):(y("post/",{user:v.a.get("user"),auth_token:v.a.get("auth_token"),title:this.state.title,body:this.state.body}).then(function(e){var a=e.post,n=t.state.posts.slice();n.unshift(a),t.setState({posts:n})}),p()("#closeModal").click())}},{key:"render",value:function(){var e,t=this;if(null==this.state.posts)return s.a.createElement(g.BarLoader,{sizeUnit:"px",size:40,loading:this.isLoading()});e=0===this.state.posts.length?s.a.createElement("div",null,"No posts yet!"):this.state.posts.map(function(e,a){return s.a.createElement(N,{key:e.id,id:e.id,user:t.props.user,author:e.author,title:e.title,body:e.body,created:e.created,likes:e.likes})});var a=this.props.user?s.a.createElement("button",{className:"btn btn-primary btn-lg",id:"write-post",type:"button","data-toggle":"modal","data-target":"#write-post-modal"},"Write Post"):"";return s.a.createElement("div",{className:"mx-sm-5"},s.a.createElement("div",{className:"mx-md-5"},e,a,s.a.createElement("div",{className:"modal fade",id:"write-post-modal",tabIndex:"-1",role:"dialog","aria-labelledby":"exampleModalLongTitle","aria-hidden":"true"},s.a.createElement("div",{className:"modal-dialog",role:"document"},s.a.createElement("div",{className:"modal-content"},s.a.createElement("div",{className:"modal-header"},s.a.createElement("h5",{className:"modal-title",id:"exampleModalLongTitle"},"Compose"),s.a.createElement("button",{type:"button",id:"closeModal",className:"close","data-dismiss":"modal","aria-label":"Close"},s.a.createElement("span",{"aria-hidden":"true"},"\xd7"))),s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("div",{className:"modal-body"},s.a.createElement("input",{id:"title",className:"form-control",type:"text",name:"title",placeholder:"What's on your mind?",value:this.state.title,onChange:this.handleChange,required:!0}),s.a.createElement("br",null),s.a.createElement("textarea",{id:"body",className:"form-control",type:"text",name:"body",value:this.state.body,onChange:this.handleChange,required:!0})),s.a.createElement("div",{className:"modal-footer"},s.a.createElement("span",null,this.state.length),s.a.createElement("input",{type:"submit",className:"btn btn-primary",value:"Post!"}))))))))}}]),t}(s.a.Component),S=a(21),x=a.n(S),L=a(26),M=a(17),P=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).handleChange=function(e){a.setState(Object(b.a)({},e.target.name,e.target.value))},a.handleSubmit=function(){var e=Object(L.a)(x.a.mark(function e(t){return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault(),y("login/",{username:a.state.username,password:a.state.password}).then(function(e){"OK"===e.status?(a.props.onLogin(a.state.username),v.a.set("user",a.state.username),v.a.set("auth_token",e.auth_token),a.setState({toFeed:!0})):(console.log(e.error),a.setState({password:"",errorMsg:e.error}))});case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.state={username:"",password:"",errorMsg:"",toFeed:!1},a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"validateForm",value:function(){return this.state.username.length>0&&this.state.password.length>0}},{key:"render",value:function(){return!0===this.state.toFeed?s.a.createElement(M.a,{to:"/feed/"}):s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-sm-3 mx-auto"},s.a.createElement("h1",{id:"auth-header",className:"my-4"},"Login"),s.a.createElement("div",{className:"errorMsg"},this.state.errorMsg),s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("label",null,s.a.createElement("b",null,"Username")),s.a.createElement("br",null),s.a.createElement("input",{type:"text",name:"username",className:"mb-2",value:this.state.username,onChange:this.handleChange,required:!0,autoFocus:!0}),s.a.createElement("br",null),s.a.createElement("label",null,s.a.createElement("b",null,"Password")),s.a.createElement("br",null),s.a.createElement("input",{type:"password",name:"password",className:"mb-2",value:this.state.password,onChange:this.handleChange,required:!0}),s.a.createElement("br",null),s.a.createElement("input",{className:"btn btn-primary btn-block",type:"submit",disabled:!this.validateForm(),value:"Login"}))))}}]),t}(s.a.Component),D=function(e){function t(e){return Object(o.a)(this,t),Object(c.a)(this,Object(m.a)(t).call(this,e))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return y("logout/",{user:v.a.get("user")}),this.props.onLogout(""),v.a.remove("user"),s.a.createElement(M.a,{to:"/login/"})}}]),t}(s.a.Component),_=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).handleSubmit=function(){var e=Object(L.a)(x.a.mark(function e(t){return x.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),a.validateForm()){e.next=3;break}return e.abrupt("return");case 3:y("register/",{username:a.state.username,password:a.state.password}).then(function(e){"OK"===e.status?(a.props.onRegister(a.state.username),v.a.set("user",a.state.username),a.setState({toFeed:!0})):(console.log(e.error),a.setState({username:"",password:"",confirmPassword:"",errorMsg:e.error}))});case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.state={username:"",password:"",confirmPassword:"",errorMsg:"",toFeed:!1},a.handleChange=a.handleChange.bind(Object(u.a)(a)),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"validateForm",value:function(){return this.state.username.length>0&&this.state.password.length>0&&this.state.password===this.state.confirmPassword||(0===this.state.username.length||0===this.state.password.length||0===this.state.confirmPassword?this.setState({errorMsg:"All fields not filled out"}):this.state.password!==this.state.confirmPassword?this.setState({errorMsg:"Passwords do not match"}):this.state.password===this.state.confirmPassword&&this.setState({errorMsg:""}),!1)}},{key:"handleChange",value:function(e){this.setState(Object(b.a)({},e.target.name,e.target.value))}},{key:"render",value:function(){return!0===this.state.toFeed?s.a.createElement(M.a,{to:"/feed/"}):s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:" col-sm-3 mx-auto"},s.a.createElement("h1",{id:"auth-header",className:"my-4"},"Register"),s.a.createElement("p",{className:"errorMsg"},this.state.errorMsg),s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("label",null,s.a.createElement("b",null,"Username")),s.a.createElement("br",null),s.a.createElement("input",{type:"text",name:"username",className:"mb-2",value:this.state.username,onChange:this.handleChange,required:!0,autoFocus:!0}),s.a.createElement("br",null),s.a.createElement("label",null,s.a.createElement("b",null,"Password")),s.a.createElement("br",null),s.a.createElement("input",{type:"password",name:"password",className:"mb-2",value:this.state.password,onChange:this.handleChange,required:!0}),s.a.createElement("br",null),s.a.createElement("label",null,s.a.createElement("b",null,"Confirm Password")),s.a.createElement("br",null),s.a.createElement("input",{type:"password",name:"confirmPassword",className:"mb-2",value:this.state.confirmPassword,onChange:this.handleChange,required:!0}),s.a.createElement("br",null),s.a.createElement("input",{className:"btn btn-primary btn-block",type:"submit",value:"Register"}))))}}]),t}(s.a.Component),F=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"jumbotron mt-3"},s.a.createElement("h1",null,"Welcome to Seddit!"),s.a.createElement("p",{className:"lead"},"The social media site for thoughtful discussion. The character MINIMUM, not maximum (",s.a.createElement("span",{role:"img","aria-label":"eye emoji"},"\ud83d\udc40")," Twitter), is 280."),s.a.createElement("p",null,"Please navigate to the links in the header to register or login. If you run into any bugs or glitches, please contact Aaron Gu. Enjoy!"))}}]),t}(s.a.Component),T=a(15),U=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).state={user:v.a.get("user"),auth_token:""},a.handleUserChange=a.handleUserChange.bind(Object(u.a)(a)),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"handleUserChange",value:function(e){this.setState({user:e})}},{key:"render",value:function(){var e=this,t=this.state.user;this.state.auth_token;return s.a.createElement("div",{className:"App"},s.a.createElement(q,{user:t}),s.a.createElement("main",{role:"main",className:"container"},s.a.createElement("div",{className:"content"},s.a.createElement(M.b,{path:"/",exact:!0,component:F}),s.a.createElement(M.b,{path:"/feed/",render:function(e){return s.a.createElement(C,{user:t})}}),s.a.createElement(M.b,{path:"/login/",render:function(a){return s.a.createElement(P,{user:t,onLogin:e.handleUserChange})}}),s.a.createElement(M.b,{path:"/register/",render:function(a){return s.a.createElement(_,{user:t,onRegister:e.handleUserChange})}}),s.a.createElement(M.b,{path:"/logout/",render:function(a){return s.a.createElement(D,{user:t,onLogout:e.handleUserChange})}}))))}}]),t}(s.a.Component),q=function(e){function t(e){return Object(o.a)(this,t),Object(c.a)(this,Object(m.a)(t).call(this,e))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e,t;return this.props.user?(console.log(this.props.user),e=s.a.createElement("span",{className:"nav-item navbar-text mx-2"},this.props.user),t=s.a.createElement(T.b,{className:"nav-item nav-link mx-2",to:"/logout/"},"Logout")):(e=s.a.createElement(T.b,{className:"nav-item nav-link mx-2",to:"/login/"},"Login"),t=s.a.createElement(T.b,{className:"nav-item nav-link mx-2",to:"/register/"},"Register")),s.a.createElement("header",null,s.a.createElement("nav",{className:"navbar navbar-expand-md navbar-light"},s.a.createElement(T.b,{className:"navbar-brand",to:"/feed/"},s.a.createElement("img",{src:"/images/megaphone-white.svg",width:"35",height:"35",alt:""}),s.a.createElement("span",{className:"ml-2"},"Seddit")),s.a.createElement("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarsExampleDefault","aria-controls":"navbarsExampleDefault","aria-expanded":"false","aria-label":"Toggle navigation"},s.a.createElement("span",{className:"navbar-toggler-icon"})),s.a.createElement("div",{className:"collapse navbar-collapse justify-content-end",id:"navbarsExampleDefault"},s.a.createElement("div",{className:"navbar-nav"},e,t))))}}]),t}(s.a.Component),I=(s.a.Component,U);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(s.a.createElement(T.a,null,s.a.createElement(I,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[36,1,2]]]);
//# sourceMappingURL=main.dee60ff9.chunk.js.map
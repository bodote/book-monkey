"use strict";(self.webpackChunkbook_monkey=self.webpackChunkbook_monkey||[]).push([[488],{1488:(Q,u,r)=>{r.r(u),r.d(u,{BooksModule:()=>R});var s=r(6895),_=r(2791),g=r(9646),k=r(262),o=r(8256),d=r(458);let O=(()=>{class n{constructor(){this.smallActive=!0}get elementClasses(){return{"px-10":this.smallActive,"pt-10":this.smallActive,"pb-10":this.smallActive}}smallOn(){this.smallActive=!1}smallOff(){this.smallActive=!0}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275dir=o.lG2({type:n,selectors:[["","bmZoom",""]],hostVars:2,hostBindings:function(e,t){1&e&&o.NdJ("mouseenter",function(){return t.smallOn()})("mouseleave",function(){return t.smallOff()}),2&e&&o.Tol(t.elementClasses)}}),n})(),b=(()=>{class n{transform(e,...t){if(e)return e.slice(0,3)+"-"+e.slice(3)}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275pipe=o.Yjl({name:"isbn",type:n,pure:!0}),n})();function T(n,i){1&n&&(o.TgZ(0,"span"),o._uU(1,", "),o.qZA())}function B(n,i){if(1&n&&(o.TgZ(0,"div",8),o._uU(1),o.YNc(2,T,2,0,"span",9),o.qZA()),2&n){const e=i.$implicit,t=i.last;o.xp6(1),o.hij(" ",e,""),o.xp6(1),o.Q6J("ngIf",!t)}}const A=function(n){return["/books/detail",n]};let h=(()=>{class n{constructor(){}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=o.Xpm({type:n,selectors:[["bm-book-list-item"]],inputs:{book:"book"},decls:17,vars:11,consts:[[1,"container","py-4"],[1,"card","md:card-side","bg-base-100","shadow-xl"],["bmZoom","",1,"h-full","w-20","lg:object-cover","md:h-full","md:w-48","sm:h-full","sm:w-24",3,"src","alt"],[1,"card-body"],[1,"card-title"],[1,"text-lg"],["class","text-xs",4,"ngFor","ngForOf"],["data-cy","btn/books/detail",1,"btn","btn-primary","basis-1/4","m-2",3,"routerLink"],[1,"text-xs"],[4,"ngIf"]],template:function(e,t){1&e&&(o.TgZ(0,"div",0)(1,"div",1)(2,"figure"),o._UZ(3,"img",2),o.qZA(),o.TgZ(4,"div",3)(5,"h2",4),o._uU(6),o.qZA(),o.TgZ(7,"div",5),o._uU(8),o.qZA(),o.TgZ(9,"div"),o.YNc(10,B,3,2,"div",6),o._UZ(11,"br"),o.TgZ(12,"span"),o._uU(13),o.ALo(14,"isbn"),o.qZA(),o.TgZ(15,"button",7),o._uU(16," Details "),o.qZA()()()()()),2&e&&(o.xp6(3),o.s9C("src",null==t.book||null==t.book.thumbnails||null==t.book.thumbnails[0]?null:t.book.thumbnails[0].url,o.LSH),o.s9C("alt",null==t.book||null==t.book.thumbnails||null==t.book.thumbnails[0]?null:t.book.thumbnails[0].title),o.xp6(3),o.Oqu(null==t.book?null:t.book.title),o.xp6(2),o.Oqu(null==t.book?null:t.book.subtitle),o.xp6(2),o.Q6J("ngForOf",null==t.book?null:t.book.authors),o.xp6(3),o.hij("ISBN: ",o.lcZ(14,7,null==t.book?null:t.book.isbn)," "),o.xp6(2),o.Q6J("routerLink",o.VKq(9,A,null==t.book?null:t.book.isbn)))},dependencies:[s.sg,s.O5,_.rH,O,b]}),n})();function S(n,i){if(1&n&&(o.ynx(0),o.TgZ(1,"div",3)(2,"div"),o.O4$(),o.TgZ(3,"svg",4),o._UZ(4,"path",5),o.qZA(),o.kcU(),o.TgZ(5,"span"),o._uU(6),o.ALo(7,"json"),o.qZA()()(),o.BQk()),2&n){const e=o.oxw();o.xp6(6),o.hij(" ",o.lcZ(7,1,e.error)," ")}}const v=function(n){return["/books/detail",n]};function Z(n,i){if(1&n&&o._UZ(0,"bm-book-list-item",8),2&n){const e=i.$implicit;o.Q6J("book",e)("routerLink",o.VKq(2,v,e.isbn))}}function C(n,i){if(1&n&&(o.ynx(0),o.YNc(1,Z,1,4,"bm-book-list-item",7),o.BQk()),2&n){const e=i.ngIf;o.xp6(1),o.Q6J("ngForOf",e)}}function D(n,i){if(1&n&&(o.ynx(0),o.YNc(1,C,2,1,"ng-container",6),o.ALo(2,"async"),o.BQk()),2&n){const e=o.oxw(),t=o.MAs(4);o.xp6(1),o.Q6J("ngIf",o.lcZ(2,2,e.books$))("ngIfElse",t)}}function L(n,i){1&n&&(o.TgZ(0,"div",9)(1,"div",10),o._uU(2," Loading... "),o.TgZ(3,"div",11),o._UZ(4,"div",12),o.qZA()()())}let x=(()=>{class n{constructor(e,t){this.bs=e,this.cd=t}ngOnInit(){this.books$=this.bs.getAll().pipe((0,k.K)(e=>(this.error=e,this.cd.detectChanges(),(0,g.of)(null)))),this.listView=!0}}return n.\u0275fac=function(e){return new(e||n)(o.Y36(d.T),o.Y36(o.sBO))},n.\u0275cmp=o.Xpm({type:n,selectors:[["bm-book-list"]],decls:5,vars:2,consts:[[1,"container","px-8","py-8"],[4,"ngIf"],["loading",""],[1,"alert","alert-error","shadow-lg"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24",1,"stroke-current","flex-shrink-0","h-6","w-6"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"],[4,"ngIf","ngIfElse"],["class","item",3,"book","routerLink",4,"ngFor","ngForOf"],[1,"item",3,"book","routerLink"],[1,"relative","rounded-xl","overflow-auto","p-8"],[1,"flex","items-center","justify-center"],[1,"pl-5"],[1,"w-6","h-6","border-b-2","border-slate-900","rounded-full","animate-spin"]],template:function(e,t){1&e&&(o.TgZ(0,"div",0),o.YNc(1,S,8,3,"ng-container",1),o.YNc(2,D,3,4,"ng-container",1),o.YNc(3,L,5,0,"ng-template",null,2,o.W1O),o.qZA()),2&e&&(o.xp6(1),o.Q6J("ngIf",t.error),o.xp6(1),o.Q6J("ngIf",!t.error))},dependencies:[s.sg,s.O5,_.rH,h,s.Ov,s.Ts]}),n})();var c=r(3530);let E=(()=>{class n{constructor(){this.visibility="hidden"}ngOnChanges(e){const{bmDelay:t}=e;setTimeout(()=>{this.visibility="visible"},t.currentValue)}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275dir=o.lG2({type:n,selectors:[["","bmDelay",""]],hostVars:2,hostBindings:function(e,t){2&e&&o.Udp("visibility",t.visibility)},inputs:{bmDelay:"bmDelay"},features:[o.TTD]}),n})();function I(n,i){1&n&&(o.ynx(0),o.TgZ(1,"div",2)(2,"div",3),o._uU(3," Loading... "),o.TgZ(4,"div",4),o._UZ(5,"div",5),o.qZA()()(),o.BQk())}function y(n,i){if(1&n&&(o.ynx(0),o.TgZ(1,"div",6)(2,"div"),o.O4$(),o.TgZ(3,"svg",7),o._UZ(4,"path",8),o.qZA(),o.kcU(),o.TgZ(5,"span"),o._uU(6),o.ALo(7,"json"),o.qZA()()(),o.BQk()),2&n){const e=o.oxw();o.xp6(6),o.hij(" ",o.lcZ(7,1,e.error)," ")}}function M(n,i){if(1&n&&(o.ynx(0),o._uU(1),o._UZ(2,"br"),o.BQk()),2&n){const e=i.$implicit;o.xp6(1),o.hij(" ",e,"")}}function N(n,i){if(1&n&&(o.ynx(0),o._UZ(1,"star-solid-icon",34),o.BQk()),2&n){const e=i.index;o.xp6(1),o.Q6J("bmDelay",1e3+500*e)}}function K(n,i){if(1&n&&(o.ynx(0),o.TgZ(1,"div",33),o.YNc(2,N,2,1,"ng-container",16),o.qZA(),o.BQk()),2&n){const e=o.oxw(2);o.xp6(2),o.Q6J("ngForOf",",".repeat(e.book.rating-1).split(","))}}function P(n,i){if(1&n&&(o.ynx(0),o.TgZ(1,"div",35)(2,"div"),o.O4$(),o.TgZ(3,"svg",7),o._UZ(4,"path",8),o.qZA(),o.kcU(),o.TgZ(5,"span"),o._uU(6),o.ALo(7,"json"),o.qZA()()(),o.BQk()),2&n){const e=o.oxw(2);o.xp6(6),o.hij(" ",o.lcZ(7,1,e.error)," ")}}const w=function(n){return["/admin/edit",n]};function $(n,i){if(1&n){const e=o.EpF();o.ynx(0),o.TgZ(1,"div",9)(2,"div",10),o._uU(3),o.qZA(),o.TgZ(4,"div",11),o._uU(5),o.qZA(),o._UZ(6,"div",12),o.TgZ(7,"div",13)(8,"div",14)(9,"div",11),o.SDv(10,15),o.qZA(),o.YNc(11,M,3,1,"ng-container",16),o.qZA(),o.TgZ(12,"div",17)(13,"div",11),o._uU(14,"ISBN:"),o.qZA(),o._uU(15),o.ALo(16,"isbn"),o.qZA(),o.TgZ(17,"div",18)(18,"div",19),o.SDv(19,20),o.qZA(),o._uU(20),o.ALo(21,"date"),o.qZA(),o.TgZ(22,"div",18)(23,"div",11),o.SDv(24,21),o.qZA(),o.YNc(25,K,3,1,"ng-container",1),o.qZA()(),o.TgZ(26,"div",22),o.SDv(27,23),o.qZA(),o.TgZ(28,"p"),o._uU(29),o.qZA(),o._UZ(30,"img",24)(31,"br")(32,"br"),o.YNc(33,P,8,3,"ng-container",1),o.TgZ(34,"div",25)(35,"button",26),o._uU(36," Edit "),o.qZA(),o.TgZ(37,"button",27),o.NdJ("click",function(){o.CHM(e);const l=o.oxw();return o.KtG(l.delete(l.book.isbn))}),o.SDv(38,28),o.qZA(),o.TgZ(39,"button",29),o.SDv(40,30),o.qZA(),o.TgZ(41,"button",31),o.SDv(42,32),o.qZA()()(),o.BQk()}if(2&n){const e=o.oxw();o.xp6(3),o.Oqu(e.book.title),o.xp6(2),o.Oqu(e.book.subtitle),o.xp6(6),o.Q6J("ngForOf",e.book.authors),o.xp6(4),o.hij(" ",o.lcZ(16,11,e.book.isbn)," "),o.xp6(5),o.hij(" ",o.xi3(21,13,e.book.published,"longDate")," "),o.xp6(5),o.Q6J("ngIf",e.book.rating),o.xp6(4),o.Oqu(e.book.description),o.xp6(1),o.s9C("src",null==e.book.thumbnails||null==e.book.thumbnails[0]?null:e.book.thumbnails[0].url,o.LSH),o.s9C("alt",null==e.book.thumbnails||null==e.book.thumbnails[0]?null:e.book.thumbnails[0].title),o.xp6(3),o.Q6J("ngIf",e.error),o.xp6(2),o.Q6J("routerLink",o.VKq(16,w,e.book.isbn))}}const U=[{path:"list",component:x},{path:"detail/:isbn",component:(()=>{class n{constructor(e,t,l){this.router=e,this.route=t,this.bookService=l,this.id=0,this.confirmMessage="Really delete book?"}ngOnInit(){this.route.paramMap.subscribe(e=>{let t;null!=(t=e.get("isbn"))?this.getABook(t):(console.error("no isbn param found in route, rerouting to /home (should actually route to an error page) "),this.router.navigate(["/home"]))})}getABook(e){this.bookService.getBook(e).subscribe({next:t=>{this.book=t},error:t=>this.error=t})}delete(e){this.confirm(this.confirmMessage).subscribe(t=>{t&&this.reallyDelete(e)})}reallyDelete(e){this.bookService.deleteBook(e).subscribe({next:()=>{this.router.navigate(["/books/list"])},error:t=>{this.error=t}})}confirm(e){const t=window.confirm(e);return(0,g.of)(t)}}return n.\u0275fac=function(e){return new(e||n)(o.Y36(_.F0),o.Y36(_.gz),o.Y36(d.T))},n.\u0275cmp=o.Xpm({type:n,selectors:[["bm-book-details"]],decls:4,vars:3,consts:function(){let i,e,t,l,p,m,f;return i=$localize`:@@Authors:Authors:`,e=$localize`:@@published: published: `,t=$localize`:@@rating:Rating:`,l=$localize`:@@bookDescription: Description: `,p=$localize`:@@deleteButton: Delete `,m=$localize`:@@backToBookListButton: back to book list `,f=$localize`:@@next: Next `,[[1,"container","px-8","py-8"],[4,"ngIf"],[1,"relative","rounded-xl","overflow-auto","p-8"],[1,"flex","items-center","justify-center"],[1,"pl-5"],[1,"w-6","h-6","border-b-2","border-slate-900","rounded-full","animate-spin"],["id","errorNoBook",1,"alert","alert-error","shadow-lg"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24",1,"stroke-current","flex-shrink-0","h-6","w-6"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"],[1,"container"],[1,"text-2xl","font-bold","pb-8"],[1,"text-lg","font-bold"],[1,"divider"],[1,"flex","flex-row","flex-wrap","pb-8"],[1,"basis-1/5","pr-2","pb-2"],i,[4,"ngFor","ngForOf"],["id","isbn",1,"basis-1/4","pr-2","pb-2"],[1,"basis-1/4","pr-2","pb-2"],["id","published",1,"text-lg","font-bold"],e,t,[1,"text-lg","font-bold","pb-2"],l,[1,"h-full","w-48",3,"src","alt"],[1,"flex","flex-row"],["id","editButton",1,"btn","btn-primary","basis-1/4","m-2",3,"routerLink"],[1,"btn","btn-secondary","basis-1/4","m-2",3,"click"],p,["routerLink","/books/list",1,"btn","btn-secondary","basis-1/4","m-2"],m,[1,"btn","btn-secondary","basis-1/4","m-2"],f,[1,"flex","flex-wrap"],["color","goldenrod",3,"bmDelay"],["id","error",1,"alert","alert-error","shadow-lg"]]},template:function(e,t){1&e&&(o.TgZ(0,"div",0),o.YNc(1,I,6,0,"ng-container",1),o.YNc(2,y,8,3,"ng-container",1),o.YNc(3,$,43,18,"ng-container",1),o.qZA()),2&e&&(o.xp6(1),o.Q6J("ngIf",!t.book&&!t.error),o.xp6(1),o.Q6J("ngIf",!t.book&&t.error),o.xp6(1),o.Q6J("ngIf",t.book))},dependencies:[s.sg,s.O5,_.rH,c.j0F,E,s.Ts,s.uU,b],styles:["p[_ngcontent-%COMP%]{white-space:pre-wrap}"]}),n})()}];let q=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=o.oAB({type:n}),n.\u0275inj=o.cJS({imports:[_.Bz.forChild(U),_.Bz]}),n})(),R=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=o.oAB({type:n}),n.\u0275inj=o.cJS({imports:[s.ez,q,c.zwd,c.$Xq]}),n})()}}]);
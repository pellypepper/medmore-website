"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[302],{498:(e,s,a)=>{a.d(s,{A:()=>n});a(43);var r=a(204),t=a(579);function n(){return(0,t.jsxs)("footer",{children:[(0,t.jsx)("div",{className:"footer-wrapper",children:(0,t.jsxs)("div",{className:"row p-3",children:[(0,t.jsxs)("div",{className:"col-12 col-md-6",children:[(0,t.jsx)("h1",{children:"CONTACT US"}),(0,t.jsxs)("div",{className:"d-flex flex-row row-1 mt-4",children:[(0,t.jsx)(r.dRU,{size:20,color:"green"}),(0,t.jsx)("p",{children:"07398653511"})]}),(0,t.jsxs)("div",{className:"d-flex flex-row row-1",children:[(0,t.jsx)(r.vq8,{size:20,color:"red"}),(0,t.jsx)("p",{children:"35 Golders Green Liverpool L7 6HG"})]}),(0,t.jsxs)("div",{className:"d-flex icon-wrapper mt-2",children:[(0,t.jsx)(r.XOS,{size:50,color:"#1a1f71",title:"Visa"}),(0,t.jsx)(r.OTR,{size:50,color:"#ff5f00",title:"MasterCard"}),(0,t.jsx)(r.LBI,{size:50,color:"#2e77bc",title:"American Express"}),(0,t.jsx)(r.XFH,{size:50,color:"#ff6000",title:"Discover"})]})]}),(0,t.jsxs)("div",{className:"col-12 col-md-6 mt-5 mt-md-0 footer-2",children:[(0,t.jsx)("h1",{children:"SIGNUP FOR DISCOUNT AND UPDATE"}),(0,t.jsx)("textarea",{placeholder:"Enter your email"}),(0,t.jsx)("button",{children:"Submit"})]})]})}),(0,t.jsx)("div",{className:"footer-bottom",children:(0,t.jsx)("p",{children:"\xa9 2021 FoodStuff. All Rights Reserved"})})]})}},786:(e,s,a)=>{a.d(s,{A:()=>d});var r=a(43),t=a(204),n=a(906),l=a(579);function i(e){let{product:s,index:a,onIncrease:r,onDecrease:t,onRemove:n}=e;return console.log("CartItem.js: product:",s.name),(0,l.jsxs)("div",{className:"cart-item",children:[(0,l.jsxs)("div",{className:"cart-item-details",children:[(0,l.jsx)("p",{children:s.productName}),(0,l.jsxs)("p",{children:["\xa3",(s.price*s.quantity).toFixed(2)]})]}),(0,l.jsxs)("div",{className:"cart-item-controls",children:[(0,l.jsxs)("div",{className:"quantity-controls",children:[(0,l.jsx)("button",{className:"btn-1",onClick:()=>t(a),children:"-"}),(0,l.jsx)("span",{children:s.quantity}),(0,l.jsx)("button",{className:"btn-1",onClick:()=>r(a),children:"+"})]}),(0,l.jsx)("button",{className:"btn-2",onClick:()=>n(s),children:"Remove"})]})]},a)}function c(e){let{removeFromCart:s,cartRef:a}=e;const[c,o]=(0,r.useState)(JSON.parse(sessionStorage.getItem("cart"))||[]),[d,m]=(0,r.useState)(""),[u,x]=(0,r.useState)(!1),h=(0,n.Zp)(),j=e=>{o(e),sessionStorage.setItem("cart",JSON.stringify(e))},p=e=>{s(e),j(c.filter((s=>s.productId!==e.productId))),m(`${e.productName} has been removed from your cart.`)};return(0,r.useEffect)((()=>{if(d){const e=setTimeout((()=>x(!0)),5e3);return()=>clearTimeout(e)}}),[d]),(0,l.jsx)("main",{className:"cart-main",children:(0,l.jsxs)("div",{className:"cart-section",children:[(0,l.jsxs)("div",{className:"cart-section-text",children:[(0,l.jsx)(t.QCr,{className:"times",onClick:()=>{null!==a&&void 0!==a&&a.current&&a.current.classList.remove("active")}}),(0,l.jsx)("h2",{children:"Shopping Cart"})]}),(0,l.jsx)("div",{className:"cart-list",children:0===c.length?(0,l.jsx)("p",{children:"Your cart is empty"}):c.map(((e,s)=>(0,l.jsx)(i,{product:e,index:s,onIncrease:()=>j(c.map(((e,a)=>a===s?{...e,quantity:e.quantity+1}:e))),onDecrease:()=>j(c.map(((e,a)=>a===s&&e.quantity>1?{...e,quantity:e.quantity-1}:e))),onRemove:p},s)))}),(0,l.jsxs)("div",{className:"cart-total",children:[(0,l.jsxs)("h4",{children:["Total: \xa3",c.reduce(((e,s)=>e+s.price*s.quantity),0).toFixed(2)]}),(0,l.jsx)("button",{onClick:()=>{h("/checkout",{state:{cart:c}})},children:"Proceed to Checkout"})]}),d&&(0,l.jsx)("div",{className:"alert-popup "+(u?"alert-popup-exit":""),children:d})]})})}var o=a(453);function d(e){let{cart:s,setCart:a,removeFromCart:i,setSearchQuery:d}=e;const m=(0,r.useRef)(null),u=(0,r.useRef)(null),x=(0,r.useRef)(null),h=(0,r.useRef)(null),[j,p]=(0,r.useState)(""),[v,N]=(0,r.useState)(""),[f,b]=(0,r.useState)(!1),y=(0,n.Zp)(),C=e=>{var s;return null===(s=e.current)||void 0===s?void 0:s.classList.toggle("active")},g=e=>{var s;return null===(s=e.current)||void 0===s?void 0:s.classList.remove("active")};return(0,l.jsxs)("main",{className:"main",children:[(0,l.jsx)("div",{className:"container-fluid",children:(0,l.jsxs)("div",{className:"row h-100",children:[(0,l.jsx)("div",{className:"logo-wrapper col-6",children:(0,l.jsx)(n.N_,{to:"/",children:(0,l.jsx)("div",{className:"logo",children:"MEDMORE"})})}),(0,l.jsxs)("nav",{className:"col-6 d-flex justify-content-end",children:[(0,l.jsx)("button",{onClick:()=>C(u),"aria-label":"Search Button",className:"rounded-pill",children:(0,l.jsx)(t.KSO,{className:"icon"})}),(0,l.jsx)("button",{onClick:()=>C(x),"aria-label":"Profile-icon",className:"rounded-pill",children:(0,l.jsx)(t.x$1,{className:"icon"})}),(0,l.jsx)("button",{onClick:()=>C(m),"aria-label":"Menu-icon",className:"rounded-pill",children:(0,l.jsx)(t.OXb,{className:"icon"})}),(0,l.jsx)("button",{onClick:()=>C(h),"aria-label":"Shopping-cart",className:"rounded-pill",children:(0,l.jsx)(t.AsH,{className:"icon"})})]})]})}),(0,l.jsxs)("aside",{className:"side-menu",ref:m,children:[(0,l.jsx)("div",{onClick:()=>g(m),className:"close-div",children:(0,l.jsx)(t.QCr,{className:"times"})}),(0,l.jsx)("nav",{children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)(n.N_,{to:"/",children:"Home"})}),(0,l.jsx)("p",{}),(0,l.jsx)("li",{children:(0,l.jsx)(n.N_,{to:"/about",children:"About"})}),(0,l.jsx)("p",{}),(0,l.jsx)("li",{children:(0,l.jsx)(n.N_,{to:"/services",children:"Services"})}),(0,l.jsx)("p",{}),(0,l.jsx)("li",{children:(0,l.jsx)(n.N_,{to:"/contact",children:"Contact"})}),(0,l.jsx)("p",{})]})})]}),(0,l.jsxs)("form",{className:"form",ref:u,onSubmit:e=>e.preventDefault(),children:[(0,l.jsx)("input",{type:"search",placeholder:"Search",onChange:e=>d(e.target.value)}),(0,l.jsx)(t.QCr,{onClick:()=>g(u),className:"times"})]}),(0,l.jsx)("div",{className:"login",ref:x,children:(0,l.jsxs)("div",{className:"login-wrapper",children:[(0,l.jsx)(t.QCr,{onClick:()=>g(x),className:"times"}),(0,l.jsx)("h3",{children:"LOGIN"}),(0,l.jsx)("p",{className:"border"}),(0,l.jsxs)("form",{onSubmit:async e=>{if(e.preventDefault(),j&&v){b(!0);try{var s;const e=await fetch("https://medmorestore.onrender.com/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:j,password:v})});if(!e.ok){const s=await e.json();return void alert(s.error||"Login failed")}const a=await e.json();console.log("Login successful:",a),null!==(s=a.user)&&void 0!==s&&s.isadmin?y("/admin"):alert("You do not have permission to access the admin page.")}catch(a){console.error("Network error:",a),alert("An error occurred. Please try again later.")}finally{b(!1)}}else alert("Please enter both email and password.")},children:[(0,l.jsx)("input",{placeholder:"Email Address",value:j,onChange:e=>p(e.target.value),type:"email",required:!0}),(0,l.jsx)("input",{placeholder:"Password",value:v,onChange:e=>N(e.target.value),type:"password",required:!0}),(0,l.jsxs)("div",{className:"remember-wrapper",children:[(0,l.jsxs)("div",{className:"d-flex",children:[(0,l.jsx)("input",{type:"checkbox"}),(0,l.jsx)("span",{children:"Remember me"})]}),(0,l.jsx)(n.N_,{to:"/forgot-password",children:"Forgot Password?"})]}),(0,l.jsx)("button",{type:"submit",children:f?(0,l.jsx)(o.A,{}):"Submit"})]})]})}),(0,l.jsx)("div",{ref:h,className:"cart",children:(0,l.jsx)(c,{cartRef:h,cart:s,removeFromCart:i,setCart:a})})]})}},453:(e,s,a)=>{a.d(s,{A:()=>t});a(43);var r=a(579);const t=()=>(0,r.jsx)("aside",{className:"spinner-container",children:(0,r.jsx)("div",{className:"spinner"})})},302:(e,s,a)=>{a.r(s),a.d(s,{default:()=>o});var r=a(43),t=a(786),n=a(498),l=a(453),i=a(906),c=a(579);function o(){var e,s,a;const[o,d]=(0,r.useState)(""),[m,u]=(0,r.useState)(!1),x=(0,i.Zp)(),h=(0,i.zy)(),j=(null===(e=h.state)||void 0===e?void 0:e.cart)||[],p=(null===(s=h.state)||void 0===s?void 0:s.total)||0,v=(null===(a=h.state)||void 0===a?void 0:a.form)||{};return(0,c.jsxs)("main",{className:"payment-main",children:[(0,c.jsx)("section",{children:(0,c.jsx)(t.A,{})}),(0,c.jsxs)("section",{className:"payment-section",children:[(0,c.jsx)("h2",{className:"payment-title",children:"Choose Payment Method"}),m&&(0,c.jsx)(l.A,{})," ",(0,c.jsxs)("form",{className:"payment-options",onSubmit:e=>{e.preventDefault(),u(!0),setTimeout((()=>{console.log(j),x("bank-transfer"===o?"/detail":"/card",{state:{total:p,form:v,cart:j}}),u(!1)}),1e3)},children:[(0,c.jsxs)("div",{className:"payment-option",children:[(0,c.jsx)("input",{type:"radio",id:"pay-online",name:"payment",value:"pay-online",checked:"pay-online"===o,onChange:()=>d("pay-online"),required:!0}),(0,c.jsx)("label",{htmlFor:"pay-online",children:"Pay Online"})]}),(0,c.jsxs)("div",{className:"payment-option",children:[(0,c.jsx)("input",{type:"radio",id:"bank-transfer",name:"payment",value:"bank-transfer",checked:"bank-transfer"===o,onChange:()=>d("bank-transfer"),required:!0}),(0,c.jsx)("label",{htmlFor:"bank-transfer",children:"Pay Via Bank Transfer"})]}),(0,c.jsxs)("div",{className:"payment-btn d-flex justify-content-center",children:[(0,c.jsx)("button",{type:"button",onClick:()=>{x("/checkout")},className:"payment-button",children:"Go Back"}),(0,c.jsx)("button",{type:"submit",className:"payment-button",disabled:!o||m,children:m?"Processing...":"Proceed to Pay"})]})]})]}),(0,c.jsx)("section",{children:(0,c.jsx)(n.A,{})})]})}}}]);
//# sourceMappingURL=302.35d19156.chunk.js.map
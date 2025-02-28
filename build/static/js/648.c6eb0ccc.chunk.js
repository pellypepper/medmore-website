"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[648],{498:(a,e,n)=>{n.d(e,{A:()=>o});n(43);var i=n(204),r=n(579);function o(){return(0,r.jsxs)("footer",{children:[(0,r.jsx)("div",{className:"footer-wrapper",children:(0,r.jsxs)("div",{className:"row p-3",children:[(0,r.jsxs)("div",{className:"col-12 col-md-6",children:[(0,r.jsx)("p",{children:"CONTACT US"}),(0,r.jsxs)("div",{className:"d-flex flex-row row-1 mt-4",children:[(0,r.jsx)("span",{children:(0,r.jsx)(i.dRU,{size:20,color:"green"})}),(0,r.jsx)("span",{children:"07398653511"})]}),(0,r.jsxs)("div",{className:"d-flex flex-row row-1",children:[(0,r.jsx)("span",{children:(0,r.jsx)(i.vq8,{size:20,color:"red"})}),(0,r.jsx)("p",{children:"35 Golders Green Liverpool L7 6HG"})]}),(0,r.jsxs)("div",{className:"d-flex icon-wrapper mt-2",children:[(0,r.jsx)("span",{children:(0,r.jsx)(i.XOS,{color:"#1a1f71"})}),(0,r.jsx)("span",{children:(0,r.jsx)(i.OTR,{color:"#ff5f00"})}),(0,r.jsx)("span",{children:(0,r.jsx)(i.LBI,{color:"#2e77bc"})}),(0,r.jsx)("span",{children:(0,r.jsx)(i.XFH,{color:"#ff6000"})})]})]}),(0,r.jsxs)("div",{className:"col-12 col-md-6 footer-2",children:[(0,r.jsx)("p",{children:"SIGN UP FOR DISCOUNT AND UPDATES"}),(0,r.jsx)("textarea",{placeholder:"Enter your email"}),(0,r.jsx)("button",{children:"Submit"})]})]})}),(0,r.jsx)("div",{className:"footer-bottom",children:(0,r.jsx)("p",{children:"\xa9 2024 MedMore Foods. All Rights Reserved"})})]})}},786:(a,e,n)=>{n.d(e,{A:()=>c});var i=n(43),r=n(204),o=n(906),s=n(579);function t(a){let{product:e,index:n,onIncrease:i,onDecrease:r,onRemove:o}=a;return console.log("CartItem.js: product:",e.name),(0,s.jsxs)("div",{className:"cart-item",children:[(0,s.jsxs)("div",{className:"cart-item-details",children:[(0,s.jsx)("p",{children:e.productName}),(0,s.jsxs)("p",{children:["\xa3",(e.price*e.quantity).toFixed(2)]})]}),(0,s.jsxs)("div",{className:"cart-item-controls",children:[(0,s.jsxs)("div",{className:"quantity-controls",children:[(0,s.jsx)("button",{className:"btn-1",onClick:()=>r(n),children:"-"}),(0,s.jsx)("span",{children:e.quantity}),(0,s.jsx)("button",{className:"btn-1",onClick:()=>i(n),children:"+"})]}),(0,s.jsx)("button",{className:"btn-2",onClick:()=>o(e),children:"Remove"})]})]},n)}function l(a){let{removeFromCart:e,cartRef:n}=a;const[l,u]=(0,i.useState)(JSON.parse(sessionStorage.getItem("cart"))||[]),[c,d]=(0,i.useState)(""),[h,m]=(0,i.useState)(!1),p=(0,o.Zp)(),g=a=>{u(a),sessionStorage.setItem("cart",JSON.stringify(a))},j=a=>{e(a),g(l.filter((e=>e.productId!==a.productId))),d(`${a.productName} has been removed from your cart.`)};return(0,i.useEffect)((()=>{if(c){const a=setTimeout((()=>m(!0)),5e3);return()=>clearTimeout(a)}}),[c]),(0,s.jsx)("main",{className:"cart-main",children:(0,s.jsxs)("div",{className:"cart-section",children:[(0,s.jsxs)("div",{className:"cart-section-text",children:[(0,s.jsx)(r.QCr,{className:"times",onClick:()=>{null!==n&&void 0!==n&&n.current&&n.current.classList.remove("active")}}),(0,s.jsx)("h2",{children:"Shopping Cart"})]}),(0,s.jsx)("div",{className:"cart-list",children:0===l.length?(0,s.jsx)("p",{children:"Your cart is empty"}):l.map(((a,e)=>(0,s.jsx)(t,{product:a,index:e,onIncrease:()=>g(l.map(((a,n)=>n===e?{...a,quantity:a.quantity+1}:a))),onDecrease:()=>g(l.map(((a,n)=>n===e&&a.quantity>1?{...a,quantity:a.quantity-1}:a))),onRemove:j},e)))}),(0,s.jsxs)("div",{className:"cart-total",children:[(0,s.jsxs)("h4",{children:["Total: \xa3",l.reduce(((a,e)=>a+e.price*e.quantity),0).toFixed(2)]}),(0,s.jsx)("button",{onClick:()=>{p("/checkout",{state:{cart:l}})},children:"Proceed to Checkout"})]}),c&&(0,s.jsx)("div",{className:"alert-popup "+(h?"alert-popup-exit":""),children:c})]})})}var u=n(453);function c(a){let{cart:e,setCart:n,removeFromCart:t,setSearchQuery:c}=a;const d=(0,i.useRef)(null),h=(0,i.useRef)(null),m=(0,i.useRef)(null),p=(0,i.useRef)(null),[g,j]=(0,i.useState)(""),[x,b]=(0,i.useState)(""),[S,v]=(0,i.useState)(!1),N=(0,o.Zp)(),y=a=>{var e;return null===(e=a.current)||void 0===e?void 0:e.classList.toggle("active")},k=a=>{var e;return null===(e=a.current)||void 0===e?void 0:e.classList.remove("active")};return(0,s.jsxs)("main",{className:"main",children:[(0,s.jsx)("div",{className:"container-fluid",children:(0,s.jsxs)("div",{className:"row h-100",children:[(0,s.jsx)("div",{className:"logo-wrapper col-6",children:(0,s.jsx)(o.N_,{to:"/",children:(0,s.jsx)("div",{className:"logo",children:"MEDMORE"})})}),(0,s.jsxs)("nav",{className:"col-6 d-flex justify-content-end",children:[(0,s.jsx)("button",{onClick:()=>y(h),"aria-label":"Search Button",className:"rounded-pill",children:(0,s.jsx)(r.KSO,{className:"icon"})}),(0,s.jsx)("button",{onClick:()=>y(m),"aria-label":"Profile-icon",className:"rounded-pill",children:(0,s.jsx)(r.x$1,{className:"icon"})}),(0,s.jsx)("button",{onClick:()=>y(d),"aria-label":"Menu-icon",className:"rounded-pill",children:(0,s.jsx)(r.OXb,{className:"icon"})}),(0,s.jsx)("button",{onClick:()=>y(p),"aria-label":"Shopping-cart",className:"rounded-pill",children:(0,s.jsx)(r.AsH,{className:"icon"})})]})]})}),(0,s.jsxs)("aside",{className:"side-menu",ref:d,children:[(0,s.jsx)("div",{onClick:()=>k(d),className:"close-div",children:(0,s.jsx)(r.QCr,{className:"times"})}),(0,s.jsx)("nav",{children:(0,s.jsxs)("ul",{children:[(0,s.jsx)("li",{children:(0,s.jsx)(o.N_,{to:"/",children:"Home"})}),(0,s.jsx)("p",{}),(0,s.jsx)("li",{children:(0,s.jsx)(o.N_,{to:"/about",children:"About"})}),(0,s.jsx)("p",{}),(0,s.jsx)("li",{children:(0,s.jsx)(o.N_,{to:"/services",children:"Services"})}),(0,s.jsx)("p",{}),(0,s.jsx)("li",{children:(0,s.jsx)(o.N_,{to:"/contact",children:"Contact"})}),(0,s.jsx)("p",{})]})})]}),(0,s.jsxs)("form",{className:"form",ref:h,onSubmit:a=>a.preventDefault(),children:[(0,s.jsx)("input",{type:"search",placeholder:"Search",onChange:a=>c(a.target.value)}),(0,s.jsx)(r.QCr,{onClick:()=>k(h),className:"times"})]}),(0,s.jsx)("div",{className:"login",ref:m,children:(0,s.jsxs)("div",{className:"login-wrapper",children:[(0,s.jsx)(r.QCr,{onClick:()=>k(m),className:"times"}),(0,s.jsx)("h3",{children:"LOGIN"}),(0,s.jsx)("p",{className:"border"}),(0,s.jsxs)("form",{onSubmit:async a=>{if(a.preventDefault(),g&&x){v(!0);try{var e;const a=await fetch("https://medmorestore.onrender.com/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:g,password:x})});if(!a.ok){const e=await a.json();return void alert(e.error||"Login failed")}const n=await a.json();console.log("Login successful:",n),null!==(e=n.user)&&void 0!==e&&e.isadmin?N("/admin"):alert("You do not have permission to access the admin page.")}catch(n){console.error("Network error:",n),alert("An error occurred. Please try again later.")}finally{v(!1)}}else alert("Please enter both email and password.")},children:[(0,s.jsx)("input",{placeholder:"Email Address",value:g,onChange:a=>j(a.target.value),type:"email",required:!0}),(0,s.jsx)("input",{placeholder:"Password",value:x,onChange:a=>b(a.target.value),type:"password",required:!0}),(0,s.jsxs)("div",{className:"remember-wrapper",children:[(0,s.jsxs)("div",{className:"d-flex",children:[(0,s.jsx)("input",{type:"checkbox"}),(0,s.jsx)("span",{children:"Remember me"})]}),(0,s.jsx)(o.N_,{to:"/forgot-password",children:"Forgot Password?"})]}),(0,s.jsx)("button",{type:"submit",children:S?(0,s.jsx)(u.A,{}):"Submit"})]})]})}),(0,s.jsx)("div",{ref:p,className:"cart",children:(0,s.jsx)(l,{cartRef:p,cart:e,removeFromCart:t,setCart:n})})]})}},453:(a,e,n)=>{n.d(e,{A:()=>r});n(43);var i=n(579);const r=()=>(0,i.jsx)("aside",{className:"spinner-container",children:(0,i.jsx)("div",{className:"spinner"})})},648:(a,e,n)=>{n.r(e),n.d(e,{default:()=>m});var i=n(43),r=n(906),o=n(786),s=n(498),t=n(204);const l={Afghanistan:["Kabul","Kandahar","Herat","Mazar-i-Sharif"],Albania:["Tirana","Durr\xebs","Shkod\xebr","Vlor\xeb"],Algeria:["Algiers","Oran","Constantine","Annaba"],Andorra:["Andorra la Vella","Escaldes-Engordany","Encamp","La Massana"],Angola:["Luanda","Huambo","Lobito","Benguela"],Argentina:["Buenos Aires","C\xf3rdoba","Santa Fe","Mendoza"],Armenia:["Yerevan","Gyumri","Vagharshapat","Vanadzor"],Australia:["New South Wales","Victoria","Queensland","Western Australia"],Austria:["Vienna","Graz","Linz","Salzburg"],Azerbaijan:["Baku","Ganja","Sumqayit","Lankaran"],Bahamas:["Nassau","Freeport","West End","Georgetown"],Bahrain:["Manama","Riffa","Muharraq","Sitra"],Bangladesh:["Dhaka","Chittagong","Khulna","Rajshahi"],Barbados:["Bridgetown","Speightstown","Oistins","Bathsheba"],Belarus:["Minsk","Gomel","Mogilev","Vitebsk"],Belgium:["Brussels","Antwerp","Ghent","Bruges"],Belize:["Belmopan","San Ignacio","Corozal","Belize City"],Benin:["Porto-Novo","Cotonou","Djougou","Parakou"],Bhutan:["Thimphu","Phuentsholing","Punakha","Paro"],Bolivia:["Sucre","La Paz","Santa Cruz","Cochabamba"],"Bosnia and Herzegovina":["Sarajevo","Banja Luka","Tuzla","Zenica"],Botswana:["Gaborone","Francistown","Molepolole","Maun"],Brazil:["Bras\xedlia","S\xe3o Paulo","Rio de Janeiro","Salvador"],Brunei:["Bandar Seri Begawan","Kuala Belait","Seria","Tutong"],Bulgaria:["Sofia","Plovdiv","Varna","Burgas"],"Burkina Faso":["Ouagadougou","Bobo-Dioulasso","Koudougou","Banfora"],Burundi:["Gitega","Bujumbura","Ngozi","Muramvya"],Cambodia:["Phnom Penh","Siem Reap","Battambang","Sihanoukville"],Cameroon:["Yaound\xe9","Douala","Garoua","Bamenda"],Canada:["Alberta","British Columbia","Ontario","Quebec","Manitoba"],"Cape Verde":["Praia","Mindelo","Santa Maria","S\xe3o Filipe"],Chad:["N'Djamena","Moundou","Sarh","Ab\xe9ch\xe9"],Chile:["Santiago","Valpara\xedso","Concepci\xf3n","La Serena"],China:["Beijing","Shanghai","Guangzhou","Shenzhen"],Colombia:["Bogot\xe1","Medell\xedn","Cali","Barranquilla"],Comoros:["Moroni","Moutsamoudou","Domoni","Moya"],Congo:["Brazzaville","Pointe-Noire","Dolisie","Nkayi"],"Costa Rica":["San Jos\xe9","Alajuela","Cartago","Heredia"],Croatia:["Zagreb","Split","Rijeka","Osijek"],Cuba:["Havana","Santiago de Cuba","Camag\xfcey","Holgu\xedn"],Cyprus:["Nicosia","Limassol","Larnaca","Famagusta"],"Czech Republic":["Prague","Brno","Ostrava","Plze\u0148"],Denmark:["Copenhagen","Aarhus","Odense","Aalborg"],Djibouti:["Djibouti","Ali Sabieh","Tadjourah","Dikhil"],Dominica:["Roseau","Portsmouth","Salisbury","Marigot"],"Dominican Republic":["Santo Domingo","Santiago","La Romana","Puerto Plata"],Ecuador:["Quito","Guayaquil","Cuenca","Machala"],Egypt:["Cairo","Alexandria","Giza","Sharm El Sheikh"],"El Salvador":["San Salvador","Santa Ana","San Miguel","Sonsonate"],Estonia:["Tallinn","Tartu","Narva","Kohtla-J\xe4rve"],Eswatini:["Mbabane","Manzini","Siteki","Piggs Peak"],Ethiopia:["Addis Ababa","Gondar","Mekele","Dire Dawa"],Fiji:["Suva","Nadi","Lautoka","Labasa"],Finland:["Helsinki","Espoo","Vantaa","Tampere"],France:["Paris","Marseille","Lyon","Toulouse"],Gabon:["Libreville","Port-Gentil","Franceville","Moanda"],Gambia:["Banjul","Serekunda","Brikama","Bakau"],Georgia:["Tbilisi","Kutaisi","Batumi","Zugdidi"],Germany:["Berlin","Munich","Hamburg","Frankfurt"],Ghana:["Accra","Kumasi","Tamale","Takoradi"],Greece:["Athens","Thessaloniki","Patras","Heraklion"],Grenada:["St. George's","Grenville","Sauteurs","Carriacou"],Guatemala:["Guatemala City","Quetzaltenango","Escuintla","San Marcos"],Guinea:["Conakry","Kankan","Nz\xe9r\xe9kor\xe9","Kindia"],Guyana:["Georgetown","Linden","New Amsterdam","Anna Regina"],Haiti:["Port-au-Prince","Cap-Ha\xeftien","Les Cayes","Jacmel"],Honduras:["Tegucigalpa","San Pedro Sula","Choloma","La Ceiba"],Hungary:["Budapest","Debrecen","Szeged","Miskolc"],Iceland:["Reykjavik","Kopavogur","Akureyri","Selfoss"],India:["Delhi","Karnataka","Maharashtra","Tamil Nadu","Uttar Pradesh"],Indonesia:["Jakarta","Surabaya","Bandung","Medan"],Iran:["Tehran","Mashhad","Isfahan","Shiraz"],Iraq:["Baghdad","Basra","Mosul","Erbil"],Ireland:["Dublin","Cork","Limerick","Galway"],Israel:["Jerusalem","Tel Aviv","Haifa","Rishon Lezion"],Italy:["Rome","Milan","Naples","Turin"],Jamaica:["Kingston","Montego Bay","Mandeville","Ocho Rios"],Japan:["Tokyo","Osaka","Yokohama","Nagoya"],Jordan:["Amman","Irbid","Zarqa","Aqaba"],Kazakhstan:["Almaty","Nur-Sultan","Shymkent","Karaganda"],Kenya:["Nairobi","Mombasa","Kisumu","Eldoret"],Kiribati:["Tarawa","Betio","Bairiki","Nikunau"],Kuwait:["Kuwait City","Al Ahmadi","Hawalli","Salmiya"],Kyrgyzstan:["Bishkek","Osh","Jalal-Abad","Talas"],Laos:["Vientiane","Luang Prabang","Pakse","Savannakhet"],Latvia:["Riga","Daugavpils","Liepaja","Jelgava"],Lebanon:["Beirut","Tripoli","Sidon","Tyre"],Lesotho:["Maseru","Teyateyaneng","Maputsoe","Leribe"],Liberia:["Monrovia","Gbarnga","Bong","Buchanan"],Libya:["Tripoli","Benghazi","Misrata","Zliten"],Liechtenstein:["Vaduz","Schaan","Balzers","Eschen"],Lithuania:["Vilnius","Kaunas","Klaipeda","\u0160iauliai"],Luxembourg:["Luxembourg City","Esch-sur-Alzette","Differdange","Ettelbruck"],Madagascar:["Antananarivo","Toamasina","Antsiranana","Mahajanga"],Malawi:["Lilongwe","Blantyre","Mzuzu","Zomba"],Malaysia:["Kuala Lumpur","George Town","Johor Bahru","Malacca"],Maldives:["Mal\xe9","Addu City","Fuvahmulah","Dhidhdhoo"],Mali:["Bamako","Sikasso","Segou","Koutiala"],Malta:["Valletta","Sliema","Birkirkara","Mosta"]," Marshall Islands":["Majuro","Ebeye","Laura","Rongelap"],Mauritania:["Nouakchott","Nouadhibou","Ka\xe9di","Selibaby"],Mauritius:["Port Louis","Beau Bassin","Quatre Bornes","Vacoas"],Mexico:["Mexico City","Guadalajara","Monterrey","Puebla"],Micronesia:["Palikir","Kolonia","Weno","Madolenihmw"],Moldova:["Chi\u0219in\u0103u","B\u0103l\u021bi","Bender","R\xeebni\u021ba"],Monaco:["Monaco","Monte Carlo","La Condamine","Menton"],Mongolia:["Ulaanbaatar","Erdenet","Darkhan","Choibalsan"],Montenegro:["Podgorica","Nik\u0161i\u0107","Herceg Novi","Bijelo Polje"],Morocco:["Rabat","Casablanca","Marrakech","Fes"],Mozambique:["Maputo","Beira","Nampula","Chimoio"],Myanmar:["Naypyidaw","Yangon","Mandalay","Mawlamyine"],Namibia:["Windhoek","Swakopmund","Walvis Bay","Oshakati"],Nepal:["Kathmandu","Pokhara","Lalitpur","Bhaktapur"],Netherlands:["Amsterdam","Rotterdam","The Hague","Utrecht"]," New Zealand":["Wellington","Auckland","Christchurch","Hamilton"],Nicaragua:["Managua","Le\xf3n","Granada","Masaya"],Niger:["Niamey","Zinder","Maradi","Diffa"],Nigeria:["Abuja","Lagos","Kano","Port Harcourt","Ibadan","Benin City","Maiduguri","Zaria","Jos","Aba","Ilorin","Kaduna","Enugu","Warri","Onitsha","Calabar","Uyo","Yola","Abeokuta","Owerri","Sokoto","Bauchi","Osogbo","Akure","Minna","Katsina","Gombe","Makurdi","Ekiti","Asaba","Awka","Jalingo","Lokoja","Birnin Kebbi","Damaturu","Gusau","Yenagoa","Umuahia"]," North Korea":["Pyongyang","Hamhung","Nampo","Wonsan"],Norway:["Oslo","Bergen","Stavanger","Drammen"],Oman:["Muscat","Salalah","Sohar","Nizwa"],Pakistan:["Islamabad","Karachi","Lahore","Peshawar"],Palau:["Ngerulmud","Melekeok","Koror","Airai"],Panama:["Panama City","Col\xf3n","David","La Chorrera"],"   Papua New Guinea":["Port Moresby","Lae","Mount Hagen","Madang"],Paraguay:["Asunci\xf3n","Ciudad del Este","Luque","Encarnaci\xf3n"],Peru:["Lima","Arequipa","Cusco","Trujillo"],Philippines:["Manila","Quezon City","Cebu City","Davao City"],Poland:["Warsaw","Krak\xf3w","Wroc\u0142aw","Gda\u0144sk"],Portugal:["Lisbon","Porto","Braga","Coimbra"],Qatar:["Doha","Al Rayyan","Umm Salal","Al Khor"],Romania:["Bucharest","Cluj-Napoca","Timi\u0219oara","Ia\u0219i"],Russia:["Moscow","Saint Petersburg","Novosibirsk","Yekaterinburg"],Rwanda:["Kigali","Butare","Gisenyi","Musanze"]," Saint Kitts and Nevis":["Basseterre","Charlestown","Nanny Cay","Dieppe Bay Town"]," Saint Lucia":["Castries","Soufri\xe8re","Vieux Fort","Gros Islet"]," Saint Vincent and the Grenadines":["Kingstown","Argyle","Bequia","Union Island"],Samoa:["Apia","Mulifanua","Salelologa","Savaii"],"  San Marino":["San Marino","Serravalle","Borgo Maggiore","Domagnano"],"  Saudi Arabia":["Riyadh","Jeddah","Mecca","Dammam"],Senegal:["Dakar","Touba","Thi\xe8s","Saint-Louis"],Serbia:["Belgrade","Novi Sad","Ni\u0161","Kragujevac"],Seychelles:["Victoria","Anse Royale","Beau Vallon","La Digue"]," Sierra Leone":["Freetown","Bo","Kenema","Makeni"],Singapore:["Singapore","Jurong East","Tampines","Yishun"],Slovakia:["Bratislava","Ko\u0161ice","Nitra","Pre\u0161ov"],Slovenia:["Ljubljana","Maribor","Celje","Kranj"],"Solomon Islands":["Honiara","Gizo","Auki","Lata"],Somalia:["Mogadishu","Hargeisa","Kismayo","Baidoa"],"South Africa":["Pretoria","Cape Town","Durban","Johannesburg"],"South Korea":["Seoul","Busan","Incheon","Daegu"]," South Sudan":["Juba","Wau","Malakal","Bor"],Spain:["Madrid","Barcelona","Valencia","Sevilla"],"Sri Lanka":["Sri Jayawardenepura Kotte","Colombo","Kandy","Galle"],Sudan:["Khartoum","Omdurman","Port Sudan","Nyala"],Sweden:["Stockholm","Gothenburg","Malm\xf6","Uppsala"],Switzerland:["Bern","Zurich","Geneva","Lausanne"],Syria:["Damascus","Aleppo","Homs","Latakia"],Taiwan:["Taipei","Kaohsiung","Taichung","Tainan"],Tajikistan:["Dushanbe","Khujand","Kulyab","Istaravshan"],Tanzania:["Dodoma","Dar es Salaam","Arusha","Mwanza"],Thailand:["Bangkok","Chiang Mai","Phuket","Nakhon Ratchasima"],Togo:["Lom\xe9","Sokod\xe9","Kara","Atakpam\xe9"],Tonga:["Nuku'alofa","Ha'apai","Vava'u","Eua"]," Trinidad and Tobago":["Port of Spain","San Fernando","Scarborough","Chaguanas"],Tunisia:["Tunis","Sfax","Sousse","Kairouan"],Turkey:["Ankara","Istanbul","Izmir","Antalya"],Turkmenistan:["Ashgabat","Turkmenabat","Mary","Dashoguz"],Tuvalu:["Funafuti","Vaiaku","Nanumea","Nukufetau"],Uganda:["Kampala","Entebbe","Gulu","Mbarara"],Ukraine:["Kyiv","Kharkiv","Odesa","Lviv"],"  United Arab Emirates":["Abu Dhabi","Dubai","Sharjah","Ajman"],"United Kingdom":["London","Birmingham","Manchester","Glasgow","Liverpool","Leeds","Sheffield","Bristol","Newcastle upon Tyne","Nottingham","Leicester","Southampton","Portsmouth","Sunderland","Coventry","Wolverhampton","Derby","Plymouth","Stoke-on-Trent","Bradford","Kingston upon Hull","Cambridge","Oxford","Bath","Canterbury","Chester","Exeter","Lancaster","York","Winchester","Salisbury","Ely","Truro","Worcester","Hereford","Lichfield","Ripon","Wells","Gloucester","Edinburgh","Aberdeen","Dundee","Inverness","Stirling","Perth","Cardiff","Swansea","Newport","Wrexham","St. Asaph","Bangor","Belfast","Derry/Londonderry","Lisburn","Newry"],"United States":["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],Uruguay:["Montevideo","Salto","Paysand\xfa","Maldonado"],Uzbekistan:["Tashkent","Samarkand","Bukhara","Andijan"],Vanuatu:["Port Vila","Luganville","Norsup","Lenakel"],"Vatican City":["Vatican City"],Venezuela:["Caracas","Maracaibo","Valencia","Barquisimeto"],Vietnam:["Hanoi","Ho Chi Minh City","Da Nang","Hai Phong"],Yemen:["Sana'a","Aden","Taiz","Hudaida"],Zambia:["Lusaka","Ndola","Kitwe","Livingstone"],Zimbabwe:["Harare","Bulawayo","Gweru","Mutare"]};var u=n(579);function c(a){let{onCountrySelect:e,onStateSelect:n}=a;const[r,o]=(0,i.useState)(""),[s,c]=(0,i.useState)(Object.keys(l)),[d,h]=(0,i.useState)([]),[m,p]=(0,i.useState)(""),[g,j]=(0,i.useState)(!1),[x,b]=(0,i.useState)(!1),S=()=>{b(!x)};return(0,u.jsxs)("div",{className:"dropdown-wrapper",children:[(0,u.jsxs)("div",{className:"input-container",children:[(0,u.jsx)("input",{type:"text",value:r,onChange:a=>{const e=a.target.value.toLowerCase();o(e),c(Object.keys(l).filter((a=>a.toLowerCase().includes(e))))},onFocus:()=>j(!0),onBlur:()=>setTimeout((()=>j(!1)),100),placeholder:"Search for a country...",className:"dropdown-input p-2"}),(0,u.jsx)("button",{onClick:()=>{j(!g)},type:"button",className:"dropdown-toggle",children:g?(0,u.jsx)(t.Ucs,{}):(0,u.jsx)(t.Vr3,{})})]}),g&&s.length>0&&(0,u.jsx)("ul",{className:"dropdown-list",children:s.map(((a,n)=>(0,u.jsx)("li",{onClick:()=>(a=>{o(a),h(l[a]||[]),p(""),j(!1),b(!1),e(a)})(a),className:"dropdown-item",children:a},n)))}),(0,u.jsxs)("div",{className:"input-container mt-2",children:[(0,u.jsx)("input",{type:"text",value:m,onClick:S,placeholder:"Select a state/region...",readOnly:!0,className:"dropdown-input p-2"}),(0,u.jsx)("button",{onClick:S,type:"button",className:"dropdown-toggle",children:x?(0,u.jsx)(t.Ucs,{}):(0,u.jsx)(t.Vr3,{})})]}),x&&d.length>0&&(0,u.jsx)("ul",{className:"dropdown-list",children:d.map(((a,e)=>(0,u.jsx)("li",{onClick:()=>(a=>{p(a),b(!1),n(a)})(a),className:"dropdown-item",children:a},e)))})]})}const d=function(a){let{shippingMethod:e,handleChange:n}=a;return(0,u.jsxs)("select",{className:"col-12 p-2 shipping-select",name:"shippingMethod",value:e,onChange:n,children:[(0,u.jsx)("option",{value:"standard",children:"Standard $10"}),(0,u.jsx)("option",{value:"express",children:"Express $20"}),(0,u.jsx)("option",{value:"cash-on-delivery",children:"Cash on Delivery"})]})};var h=n(453);function m(a){let{removeFromCart:e}=a;const n=(0,r.Zp)(),[t,l]=(0,i.useState)(JSON.parse(sessionStorage.getItem("cart"))||[]),[m,p]=(0,i.useState)({firstname:"",lastname:"",email:"",number:"",address:"",shippingMethod:"standard",country:"",state:"",postcode:""}),[g,j]=(0,i.useState)(""),[x,b]=(0,i.useState)(!1),S={standard:10,express:20,"cash-on-delivery":0},v=()=>t.reduce(((a,e)=>a+e.price*e.quantity),0)+(S[m.shippingMethod]||0),N=a=>{let{target:{name:e,value:n}}=a;p((a=>({...a,[e]:n})))},y=a=>{var n;e(a),n=t.filter((e=>e.productId!==a.productId)),l(n),sessionStorage.setItem("cart",JSON.stringify(n)),j(`${a.productName} has been removed from your cart.`)};(0,i.useEffect)((()=>{if(g){const a=setTimeout((()=>j("")),5e3);return()=>clearTimeout(a)}}),[g]);return(0,u.jsxs)("main",{className:"checkout-section",children:[(0,u.jsx)(o.A,{}),(0,u.jsx)("section",{className:"checkout-main",children:(0,u.jsxs)("div",{className:"checkout-container",children:[x&&(0,u.jsx)(h.A,{}),(0,u.jsxs)("div",{className:"cart-section",children:[(0,u.jsx)("h2",{children:"Your Cart"}),(0,u.jsx)("div",{className:"cart-list",children:0===t.length?(0,u.jsx)("p",{children:"Your cart is empty."}):t.map(((a,e)=>(0,u.jsxs)("div",{className:"cart-item",children:[(0,u.jsxs)("div",{className:"cart-item-details",children:[(0,u.jsx)("p",{children:a.productName}),(0,u.jsxs)("p",{children:["\xa3",a.price," x ",a.quantity]})]}),(0,u.jsx)("button",{onClick:()=>y(a),"aria-label":`Remove ${a.productName} from cart`,children:"Remove"})]},e)))}),g&&(0,u.jsx)("div",{className:"alert-popup",children:g}),(0,u.jsxs)("div",{className:"shipping-wrapper",children:[(0,u.jsx)("h3",{children:"Shipping Method"}),(0,u.jsx)(d,{shippingMethod:m.shippingMethod,handleChange:N})]}),(0,u.jsxs)("div",{className:"cart-total",children:[(0,u.jsxs)("h4",{children:["Items: ",t.length]}),(0,u.jsxs)("h4",{children:["Total: \xa3",v().toFixed(2)]})]})]}),(0,u.jsxs)("div",{className:"checkout-form-section",children:[(0,u.jsx)("h2",{children:"Checkout Details"}),(0,u.jsxs)("form",{onSubmit:async a=>{a.preventDefault(),b(!0);const e=v();await new Promise((a=>setTimeout(a,1e3))),console.log(m),n("/payment",{state:{total:e,cart:t,form:m}}),b(!1)},children:[(0,u.jsxs)("div",{className:"input-wrapper",children:[(0,u.jsx)("input",{type:"text",name:"firstname",value:m.firstname,onChange:N,placeholder:"First Name",className:"col-6 p-2",required:!0}),(0,u.jsx)("input",{type:"text",name:"lastname",value:m.lastname,onChange:N,placeholder:"Last Name",className:"col-5 p-2",required:!0})]}),(0,u.jsxs)("div",{className:"input-wrapper",children:[(0,u.jsx)("input",{type:"email",name:"email",value:m.email,onChange:N,placeholder:"Email",className:"col-6 p-2",required:!0}),(0,u.jsx)("input",{type:"tel",name:"number",value:m.number,onChange:N,placeholder:"Phone Number",className:"col-5 p-2",required:!0})]}),(0,u.jsx)("textarea",{name:"address",value:m.address,onChange:N,placeholder:"Shipping Address",className:"col-12 p-2",required:!0}),(0,u.jsx)(c,{onCountrySelect:a=>{p((e=>({...e,country:a})))},onStateSelect:a=>{p((e=>({...e,state:a})))}}),(0,u.jsx)("input",{name:"postcode",type:"text",value:m.postcode,onChange:N,placeholder:"Zip/Post code",className:"col-12 p-2",required:!0}),(0,u.jsx)("button",{type:"submit",disabled:x,children:x?"Processing...":"Proceed to Payment"})]})]})]})}),(0,u.jsx)(s.A,{})]})}}}]);
//# sourceMappingURL=648.c6eb0ccc.chunk.js.map
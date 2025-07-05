(()=>{var e={};e.id=626,e.ids=[626],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2615:e=>{"use strict";e.exports=require("http")},5240:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},8621:e=>{"use strict";e.exports=require("punycode")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1568:e=>{"use strict";e.exports=require("zlib")},6654:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>i.a,__next_app__:()=>x,originalPathname:()=>m,pages:()=>o,routeModule:()=>h,tree:()=>d}),t(6701),t(9862),t(5663),t(6185);var a=t(3826),r=t(9930),l=t(2049),i=t.n(l),c=t(8405),n={};for(let e in c)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(n[e]=()=>c[e]);t.d(s,n);let d=["",{children:["projects",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,6701)),"/Users/natxo/Documents/GitHub/gemini-cli/src/app/projects/[id]/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,9862)),"/Users/natxo/Documents/GitHub/gemini-cli/src/app/layout.tsx"],error:[()=>Promise.resolve().then(t.bind(t,5663)),"/Users/natxo/Documents/GitHub/gemini-cli/src/app/error.tsx"],"not-found":[()=>Promise.resolve().then(t.bind(t,6185)),"/Users/natxo/Documents/GitHub/gemini-cli/src/app/not-found.tsx"]}],o=["/Users/natxo/Documents/GitHub/gemini-cli/src/app/projects/[id]/page.tsx"],m="/projects/[id]/page",x={require:t,loadChunk:()=>Promise.resolve()},h=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/projects/[id]/page",pathname:"/projects/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},7285:(e,s,t)=>{Promise.resolve().then(t.bind(t,9183))},9183:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>d});var a=t(6808),r=t(1694),l=t(9805);t(7571);var i=t(6022);let c=({project:e,mcdaScore:s,evaluations:t,bmc:a})=>{let r=e=>{let s=t.filter(s=>s.category===e);return 0===s.length?null:s.reduce((e,s)=>e+s.value,0)/s.length},l=e=>null===e?"#cccccc":e>7.5?"#4CAF50":e>=6?"#FFC107":"#F44336",i=Object.keys(t.reduce((e,s)=>(e[s.category]||(e[s.category]=[]),e[s.category].push(s),e),{})).map(e=>({name:e,score:r(e)}));return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Project Summary Report</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap">
        <style>
            @page {
                size: A4 portrait;
                margin: 1.5cm;
            }

            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #333;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .page-container {
                width: 100%;
                max-width: 21cm; /* A4 width */
                margin: 0 auto;
                box-sizing: border-box;
            }

            .report-header {
                text-align: center;
                margin-bottom: 2cm;
                border-bottom: 2px solid #eee;
                padding-bottom: 1cm;
            }

            .report-header h1 {
                font-size: 2.2em;
                color: #2c3e50;
                margin-bottom: 0.5em;
                font-weight: 700;
            }

            .section {
                margin-bottom: 1.5cm;
                padding-bottom: 1cm;
                border-bottom: 1px solid #eee;
            }

            .section:last-of-type {
                border-bottom: none;
            }

            .section h2 {
                font-size: 1.8em;
                color: #34495e;
                margin-bottom: 1em;
                font-weight: 600;
            }

            .section h3 {
                font-size: 1.4em;
                color: #34495e;
                margin-bottom: 0.8em;
                font-weight: 600;
            }

            /* MCDA Summary */
            .mcda-summary .score-overview {
                display: flex;
                align-items: center;
                margin-bottom: 1.5em;
            }

            .mcda-summary .overall-score {
                font-size: 1.5em;
                font-weight: 700;
                color: #2c3e50;
                margin-right: 15px;
            }

            .mcda-summary .score-indicator {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: inline-block;
                vertical-align: middle;
            }

            .mcda-summary .score-green {
                background-color: #4CAF50;
            }

            .mcda-summary .score-yellow {
                background-color: #FFC107;
            }

            .mcda-summary .score-red {
                background-color: #F44336;
            }

            .bar-chart-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* Responsive grid for cards */
                gap: 15px;
                padding-top: 20px;
                border-bottom: none; /* Remove border from container */
            }

            .score-card {
                background-color: #f9f9f9;
                border: 1px solid #eee;
                border-radius: 8px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* Subtle shadow for card effect */
                height: 180px; /* Fixed height for consistency */
                justify-content: flex-end; /* Align content to bottom */
                position: relative;
                overflow: hidden; /* Hide overflow for bars */
            }

            .score-card .bar {
                width: 100%; /* Bar takes full width of card */
                position: absolute;
                bottom: 0;
                left: 0;
                border-radius: 0 0 8px 8px; /* Rounded bottom corners for the bar */
            }

            .score-card-label {
                font-size: 0.9em;
                font-weight: 600;
                color: #333;
                z-index: 1; /* Ensure label is above the bar */
                margin-bottom: 5px; /* Space between label and bar */
            }

            /* Business Model Canvas */
            .bmc-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5cm;
            }

            .bmc-item {
                background-color: #f9f9f9;
                border: 1px solid #eee;
                padding: 1.2em;
                border-radius: 5px;
            }

            .bmc-item h3 {
                font-size: 1.2em;
                color: #2c3e50;
                margin-top: 0;
                margin-bottom: 0.5em;
                font-weight: 700;
            }

            .bmc-item p {
                font-size: 0.9em;
                color: #555;
                margin-bottom: 0;
            }

            /* Footer */
            .report-footer {
                text-align: center;
                margin-top: 2cm;
                padding-top: 1cm;
                border-top: 1px solid #eee;
                font-size: 0.8em;
                color: #777;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            /* Page breaks for printing */
            @media print {
                html, body {
                    height: auto;
                }
                .page-container {
                    margin: 0;
                    width: auto;
                }
                .section {
                    page-break-inside: avoid;
                }
                .bmc-grid {
                    page-break-inside: avoid;
                }
                .report-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1cm 1.5cm;
                    background-color: #fff;
                    border-top: 1px solid #eee;
                }
            }
        </style>
    </head>
    <body>
        <div class="page-container">
            <header class="report-header">
                <h1>Project Summary: ${e.name}</h1>
            </header>

            <section class="section mcda-summary">
                <h2>MCDA Score Overview</h2>
                <div class="score-overview">
                    <span class="overall-score">Overall GEOCUBO Score: ${null!==s?s.toFixed(1):"N/A"}</span>
                    <span class="score-indicator ${null===s?"score-gray":s>7.5?"score-green":s>=6?"score-yellow":"score-red"}"></span>
                </div>
                
                <h3>Category Scores</h3>
                <div class="bar-chart-container">
                    ${i.map((e,s)=>{let t=r(e.name);return`
                            <div class="score-card">
                                <div class="bar" style="height: ${null!==t?t/10*100:0}%; background-color: ${l(t)};"></div>
                                <span class="score-card-label">${e.name} (${null!==t?t.toFixed(1):"N/A"})</span>
                            </div>
                        `}).join("")}
                </div>
            </section>

            <section class="section bmc-section">
                <h2>Business Model Canvas</h2>
                ${a?`
                    <div class="bmc-grid">
                        <div class="bmc-item">
                            <h3>Key Partners</h3>
                            <p>${a.key_partners||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Key Activities</h3>
                            <p>${a.key_activities||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Key Resources</h3>
                            <p>${a.key_resources||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Value Propositions</h3>
                            <p>${a.value_proposition||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Customer Relationships</h3>
                            <p>${a.customer_relationships||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Customer Segments</h3>
                            <p>${a.customer_segments||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Channels</h3>
                            <p>${a.channels||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Cost Structure</h3>
                            <p>${a.cost_structure||"N/A"}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Revenue Streams</h3>
                            <p>${a.revenue_streams||"N/A"}</p>
                        </div>
                    </div>
                `:"<p>No Business Model Canvas data available for this project.</p>"}
            </section>

            <footer class="report-footer">
                <span>Generated by GEOCUBO</span>
                <span>Date: ${new Date().toLocaleDateString()}</span>
            </footer>
        </div>
    </body>
    </html>
  `};var n=t(2166);function d({params:e}){let{id:s}=e;(0,a.createClientComponentClient)();let{0:t,1:i}=(0,r.useState)(null),{0:d,1:o}=(0,r.useState)(null),{0:m,1:x}=(0,r.useState)([]),{0:h,1:b}=(0,r.useState)(null),{0:u,1:p}=(0,r.useState)(!0),{0:g,1:j}=(0,r.useState)("overview");return t?.coordinates&&(t.coordinates.y,t.coordinates.x),(0,n.jsxs)("div",{className:"animate-fade-in",children:[n.jsx("section",{className:"bg-black py-16",children:n.jsx("div",{className:"container-urbop",children:u?n.jsx("div",{className:"flex items-center justify-center py-12",children:(0,n.jsxs)("svg",{className:"animate-spin h-12 w-12 text-lime-500",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[n.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),n.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]})}):t&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between mb-6",children:[(0,n.jsxs)("div",{children:[(0,n.jsxs)(l.default,{href:"/projects",className:"text-gray-400 hover:text-lime-500 flex items-center mb-4",children:[n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 mr-1",viewBox:"0 0 20 20",fill:"currentColor",children:n.jsx("path",{fillRule:"evenodd",d:"M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z",clipRule:"evenodd"})}),"Volver a Proyectos"]}),n.jsx("h1",{className:"mb-2",children:t.name}),(0,n.jsxs)("div",{className:"flex items-center text-gray-400 mb-2",children:[(0,n.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[n.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"}),n.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 11a3 3 0 11-6 0 3 3 0 016 0z"})]}),n.jsx("span",{children:t.location})]})]}),(0,n.jsxs)("div",{className:"flex items-center space-x-4 mt-4 md:mt-0",children:[n.jsx("span",{className:`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(e=>{switch(e?.toLowerCase()){case"active":return"bg-green-500";case"under_review":return"bg-yellow-500";case"suspended":return"bg-red-500";case"completed":return"bg-blue-500";default:return"bg-gray-500"}})(t.status)} text-white`,children:t.status}),null!==d&&n.jsx("div",{className:"bg-gray-900 rounded-full w-14 h-14 flex items-center justify-center",children:n.jsx("span",{className:"text-lime-500 text-xl font-bold",children:d.toFixed(1)})})]})]}),n.jsx("div",{className:"accent-line"}),n.jsx("p",{className:"text-xl text-gray-300 mt-6",children:t.description}),(0,n.jsxs)("div",{className:"flex flex-wrap border-b border-gray-800 mt-12",children:[n.jsx("button",{className:`tab ${"overview"===g?"active":""}`,onClick:()=>j("overview"),children:"Resumen"}),n.jsx("button",{className:`tab ${"location"===g?"active":""}`,onClick:()=>j("location"),children:"Ubicaci\xf3n"}),n.jsx("button",{className:`tab ${"mcda"===g?"active":""}`,onClick:()=>j("mcda"),children:"An\xe1lisis MCDA"}),n.jsx("button",{className:`tab ${"bmc"===g?"active":""}`,onClick:()=>j("bmc"),children:"Business Model Canvas"}),n.jsx("button",{className:`tab ${"financial"===g?"active":""}`,onClick:()=>j("financial"),children:"An\xe1lisis Financiero"})]})]})})}),!u&&t&&n.jsx("section",{className:"bg-gray-900 py-12",children:(0,n.jsxs)("div",{className:"container-urbop",children:["overview"===g&&n.jsx("div",{className:"animate-fade-in",children:(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[(0,n.jsxs)("div",{className:"md:col-span-2",children:[(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg mb-8",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Detalles del Proyecto"}),(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Tipo de Proyecto"}),n.jsx("div",{className:"text-white",children:t.asset_class})]}),(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Categor\xeda de Desarrollo"}),n.jsx("div",{className:"text-white",children:t.development_category})]}),(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"\xc1rea Total (m\xb2)"}),n.jsx("div",{className:"text-white",children:t.area_total?.toLocaleString()||"N/A"})]}),(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Unidades"}),n.jsx("div",{className:"text-white",children:t.units_count||"N/A"})]}),(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Pisos"}),n.jsx("div",{className:"text-white",children:t.floors_count||"N/A"})]})]}),(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Fecha de Creaci\xf3n"}),n.jsx("div",{className:"text-white",children:new Date(t.created_at).toLocaleDateString()})]}),(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"\xdaltima Actualizaci\xf3n"}),n.jsx("div",{className:"text-white",children:new Date(t.updated_at).toLocaleDateString()})]}),(0,n.jsxs)("div",{className:"mb-4",children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Presupuesto"}),(0,n.jsxs)("div",{className:"text-white",children:["$",t.budget?.toLocaleString()||"N/A"]})]})]})]})]}),(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Cronograma del Proyecto (Placeholder)"}),n.jsx("div",{className:"text-gray-400",children:"El cronograma del proyecto se mostrar\xe1 aqu\xed."})]})]}),(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg mb-8",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Puntuaci\xf3n MCDA"}),n.jsx("div",{className:"flex items-center justify-center mb-6",children:n.jsx("div",{className:"w-32 h-32 rounded-full border-8 border-lime-500 flex items-center justify-center",children:n.jsx("span",{className:"text-4xl font-bold",children:d?.toFixed(1)||"N/A"})})}),n.jsx("div",{className:"space-y-4",children:m.map(e=>(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"flex justify-between mb-1",children:[n.jsx("span",{className:"text-gray-400",children:e.parameter_name}),n.jsx("span",{className:"text-lime-500",children:e.value.toFixed(1)})]}),n.jsx("div",{className:"w-full bg-gray-700 rounded-full h-2",children:n.jsx("div",{className:"bg-lime-500 h-2 rounded-full",style:{width:`${e.value/10*100}%`}})})]},e.parameter_id))})]}),(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Acciones"}),(0,n.jsxs)("div",{className:"space-y-4",children:[n.jsx(l.default,{href:`/projects/${s}/edit`,className:"btn btn-primary w-full text-center",children:"Editar Proyecto"}),n.jsx("button",{className:"btn btn-secondary w-full",onClick:()=>{if(!t||null===d||!m||!h){console.error("Data not fully loaded for report generation.");return}let e=e=>{let s=m.filter(s=>s.category===e);return 0===s.length?null:s.reduce((e,s)=>e+s.value,0)/s.length};Object.keys(m.reduce((e,s)=>(e[s.category]||(e[s.category]=[]),e[s.category].push(s),e),{})).map(s=>({name:s,score:e(s)}));let s=window.open("","_blank");if(s){let e=c({project:t,mcdaScore:d,evaluations:m,bmc:h});s.document.write(e),s.document.close(),s.print()}},children:"Generar Reporte"}),n.jsx("button",{className:"btn btn-outline w-full",children:"Compartir"})]})]})]})]})}),"location"===g&&n.jsx("div",{className:"animate-fade-in",children:(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[n.jsx("div",{className:"md:col-span-2",children:n.jsx("div",{className:"bg-black rounded-lg overflow-hidden",style:{height:"500px"},children:n.jsx("div",{className:"h-full relative",children:n.jsx("div",{className:"absolute inset-0 bg-gray-800",children:(0,n.jsxs)("div",{className:"h-full w-full relative overflow-hidden",children:[n.jsx("div",{className:"absolute inset-0 bg-gray-900"}),n.jsx("div",{className:"absolute inset-0",style:{backgroundImage:"linear-gradient(to right, rgba(75, 85, 99, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(75, 85, 99, 0.1) 1px, transparent 1px)",backgroundSize:"50px 50px"}}),(0,n.jsxs)("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",children:[n.jsx("div",{className:"w-6 h-6 rounded-full bg-lime-500 animate-ping opacity-50"}),n.jsx("div",{className:"w-6 h-6 rounded-full bg-lime-500 absolute top-0 left-0"})]})]})})})})}),(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg mb-8",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Detalles de Ubicaci\xf3n"}),(0,n.jsxs)("div",{className:"space-y-4",children:[(0,n.jsxs)("div",{children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Direcci\xf3n"}),n.jsx("div",{className:"text-white",children:t.location})]}),(0,n.jsxs)("div",{children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Coordenadas"}),(0,n.jsxs)("div",{className:"text-white",children:[t.coordinates?.y,", ",t.coordinates?.x]})]}),(0,n.jsxs)("div",{children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Municipalidad"}),n.jsx("div",{className:"text-white",children:"N/A"})]}),(0,n.jsxs)("div",{children:[n.jsx("label",{className:"block text-gray-400 text-sm mb-1",children:"Departamento"}),n.jsx("div",{className:"text-white",children:"N/A"})]})]})]}),(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Proximidad (Placeholder)"}),n.jsx("div",{className:"text-gray-400",children:"Los datos de proximidad se mostrar\xe1n aqu\xed."})]})]})]})}),"mcda"===g&&n.jsx("div",{className:"animate-fade-in",children:(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[n.jsx("div",{className:"md:col-span-2",children:(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg mb-8",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"An\xe1lisis MCDA"}),n.jsx("div",{className:"space-y-8",children:Object.entries(m.reduce((e,s)=>(e[s.category]||(e[s.category]=[]),e[s.category].push(s),e),{})).map(([e,s])=>(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[n.jsx("h3",{className:"text-xl font-semibold",children:e}),n.jsx("span",{className:"text-lime-500 font-bold text-xl",children:(s.reduce((e,s)=>e+s.value,0)/s.length).toFixed(1)})]}),n.jsx("div",{className:"space-y-4",children:s.map(e=>(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"flex justify-between mb-1",children:[n.jsx("span",{className:"text-gray-400",children:e.parameter_name}),n.jsx("span",{className:"text-lime-500",children:e.value.toFixed(1)})]}),n.jsx("div",{className:"w-full bg-gray-700 rounded-full h-2",children:n.jsx("div",{className:"bg-lime-500 h-2 rounded-full",style:{width:`${e.value/10*100}%`}})})]},e.parameter_id))})]},e))})]})}),(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg mb-8",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Resumen MCDA"}),n.jsx("div",{className:"flex items-center justify-center mb-6",children:n.jsx("div",{className:"w-32 h-32 rounded-full border-8 border-lime-500 flex items-center justify-center",children:n.jsx("span",{className:"text-4xl font-bold",children:d?.toFixed(1)||"N/A"})})}),n.jsx("div",{className:"space-y-4",children:Object.entries(m.reduce((e,s)=>(e[s.category]||(e[s.category]={total:0,count:0}),e[s.category].total+=s.value,e[s.category].count++,e),{})).map(([e,s])=>(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"flex justify-between mb-1",children:[n.jsx("span",{className:"text-gray-400",children:e}),n.jsx("span",{className:"text-lime-500",children:(s.total/s.count).toFixed(1)})]}),n.jsx("div",{className:"w-full bg-gray-700 rounded-full h-2",children:n.jsx("div",{className:"bg-lime-500 h-2 rounded-full",style:{width:`${s.total/s.count/10*100}%`}})})]},e))})]}),(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Acciones"}),(0,n.jsxs)("div",{className:"space-y-4",children:[n.jsx(l.default,{href:`/projects/${s}/edit`,className:"btn btn-primary w-full text-center",children:"Editar Proyecto"}),n.jsx(l.default,{href:`/projects/${s}/mcda/edit`,className:"btn btn-secondary w-full text-center",children:"Editar Evaluaciones MCDA"}),n.jsx("button",{className:"btn btn-secondary w-full",children:"Generar Reporte"}),n.jsx("button",{className:"btn btn-outline w-full",children:"Compartir"})]})]})]})]})}),"bmc"===g&&(0,n.jsxs)("div",{className:"animate-fade-in",children:[(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg mb-8",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Business Model Canvas"}),h?(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-4",children:[(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Socios Clave"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.key_partners})]}),(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Actividades Clave"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.key_activities})]}),(0,n.jsxs)("div",{className:"bg-lime-500 bg-opacity-10 border border-lime-500 p-4 rounded-lg",children:[n.jsx("h3",{className:"font-semibold mb-2 text-lime-500",children:"Propuesta de Valor"}),n.jsx("p",{className:"text-gray-300 text-sm",children:h.value_proposition})]}),(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Relaciones con Clientes"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.customer_relationships})]}),(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Segmentos de Clientes"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.customer_segments})]}),(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Recursos Clave"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.key_resources})]}),(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg md:col-start-4",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Canales"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.channels})]}),(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg md:col-span-2",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Estructura de Costos"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.cost_structure})]}),(0,n.jsxs)("div",{className:"bg-gray-900 p-4 rounded-lg md:col-span-3",children:[n.jsx("h3",{className:"font-semibold mb-2",children:"Fuentes de Ingresos"}),n.jsx("p",{className:"text-gray-400 text-sm",children:h.revenue_streams})]})]}):n.jsx("div",{className:"text-gray-400",children:"No hay Business Model Canvas disponible para este proyecto."})]}),n.jsx("div",{className:"flex justify-end mt-6",children:h?n.jsx(l.default,{href:`/projects/${s}/bmc/edit`,className:"btn btn-secondary",children:"Editar BMC"}):n.jsx(l.default,{href:`/projects/${s}/bmc/edit`,className:"btn btn-primary",children:"Crear BMC"})})]}),"financial"===g&&n.jsx("div",{className:"animate-fade-in",children:(0,n.jsxs)("div",{className:"bg-black p-6 rounded-lg mb-8",children:[n.jsx("h2",{className:"text-2xl font-bold mb-6",children:"An\xe1lisis Financiero (Placeholder)"}),n.jsx("div",{className:"text-gray-400",children:"Los datos financieros se mostrar\xe1n aqu\xed."})]})})]})})]})}(0,i.default)(async()=>null,{ssr:!1}),(0,i.default)(async()=>null,{ssr:!1}),(0,i.default)(async()=>null,{ssr:!1}),(0,i.default)(async()=>null,{ssr:!1})},6701:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>a});let a=(0,t(7866).createProxy)(String.raw`/Users/natxo/Documents/GitHub/gemini-cli/src/app/projects/[id]/page.tsx#default`)}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[769,634,808,141,762],()=>t(6654));module.exports=a})();
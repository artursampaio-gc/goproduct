import{t as o,d as s,j as e}from"./index-B7aS2nJw.js";import{I as l}from"./IconAt-DF07bCJE.js";import{aY as p,V as d,aZ as m,G as f,aU as v}from"./InvenTreeTable-C22gTutR.js";/**
 * @license @tabler/icons-react v3.40.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",key:"svg-0"}],["path",{d:"M5.75 15a8.015 8.015 0 1 0 9.25 -13",key:"svg-1"}],["path",{d:"M11 17v4",key:"svg-2"}],["path",{d:"M7 21h8",key:"svg-3"}]],_=o("outline","globe","Globe",h);/**
 * @license @tabler/icons-react v3.40.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M13 20l7 -7",key:"svg-0"}],["path",{d:"M13 20v-6a1 1 0 0 1 1 -1h6v-7a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7",key:"svg-1"}]],x=o("outline","note","Note",k);function F({manufacturerId:r,manufacturerPartId:n,partId:a}){const[t,u]=s.useState({});return s.useMemo(()=>({part:{value:a,disabled:!!a,filters:{part:a,purchaseable:!0,active:!0},onValueChange:(i,c)=>{u(c)}},manufacturer_part:{value:n,autoFill:!0,filters:{manufacturer:r,part_detail:!0,manufacturer_detail:!0},adjustFilters:i=>({...i.filters,part:i.data.part}),addCreateFields:{part:{value:t==null?void 0:t.pk,disabled:!!(t!=null&&t.pk)},manufacturer:{},MPN:{},description:{},link:{}}},supplier:{filters:{active:!0,is_supplier:!0},addCreateFields:{name:{},description:{},is_supplier:{value:!0,hidden:!0}}},SKU:{icon:e.jsx(v,{})},description:{},link:{icon:e.jsx(f,{})},note:{icon:e.jsx(x,{})},pack_quantity:{},packaging:{icon:e.jsx(m,{})},primary:{},active:{}}),[r,n,a,t])}function b(){return s.useMemo(()=>({part:{},manufacturer:{filters:{active:!0,is_manufacturer:!0},addCreateFields:{name:{},description:{},is_manufacturer:{value:!0,hidden:!0}}},MPN:{},description:{},link:{}}),[])}function C(){return{name:{},description:{},website:{icon:e.jsx(_,{})},currency:{icon:e.jsx(d,{})},phone:{icon:e.jsx(p,{})},email:{icon:e.jsx(l,{})},tax_id:{},is_supplier:{},is_manufacturer:{},is_customer:{},active:{}}}export{F as a,C as c,b as u};
//# sourceMappingURL=CompanyForms-DXDFGnqx.js.map

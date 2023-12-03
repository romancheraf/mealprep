
document.addEventListener("DOMContentLoaded",function(){const t=document.getElementById("input-section");let A,n,e,i;let T=[];let E=-1;let f;let o=1;let F="";let I=false;let L=false;let s=true;const a=document.getElementById("meal-type");const r=document.getElementById("calories");const c=document.getElementById("diet-type");const l=document.getElementById("ingredient-count");const d=document.querySelector(".hidden-questions");a.addEventListener("change",u);r.addEventListener("change",u);c.addEventListener("change",u);l.addEventListener("change",u);function u(){const t=a.value;const e=r.value;const n=c.value;const i=l.value;const o=document.querySelector(".hidden-questions");if(t!==""&&e!==""&&n!==""&&i!==""){o.classList.add("active")}else{o.classList.remove("active")}}function p(t){if(A==="breakfast"){return t.includes("main course")||t.includes("egg")&&t.length===1}else{if(i==="vegetarian"){return t.includes("main course")||t.includes("vegetarian")}else{return t.includes("main course")&&!t.includes("egg")&&!t.includes("omelet")}}}function k(t){if((A==="breakfast"||A==="lunch/dinner")&&t.includes("snack")){return false}else{const e=["breakfast","brunch","lunch/dinner"];return t.some(t=>e.includes(t))}}function q(t){const e=t.totalNutrients["SUGAR.added"];return e&&e.quantity>50}function B(t,e,n){if(e==="keto-friendly"&&n!=="breakfast"&&n!=="lunch"){if(t.ingredients.some(t=>t.foodCategory==="plant-based protein")){return false}if(!t.ingredients.some(t=>t.foodCategory==="meats"||t.foodCategory==="seafood"||t.foodCategory==="Poultry"||t.foodCategory==="seafood"||t.foodCategory==="cured meats"||t.foodCategory==="Cheese")){return false}}return true}async function m(t=false){const e="661f99af";const n="b940cbcb8bfc0ca6aa6e5e922840ac46";const i=document.getElementById("calories");const o=parseFloat(i.value);const s=document.querySelectorAll('input[name="allergies"]:checked');const a=Array.from(s).map(t=>t.value);const r=Math.round(o*.85/10)*10;const c=Math.round(o*1.05/10)*10;let l=[];const d=document.getElementById("ingredient-count");ingredientCount=d.value;const u=document.getElementById("diet-type").value;if(u!=="healthlabel"){l.push(u)}if(u!=="none"){l.push(u)}l=l.concat(a);let f="salad&dishType=main course&dishType=starter&dishType=cereals";const p=M.querySelector("#diet-label");let m=p.value;if(m==="none"){m=""}if(u!=="none"){l=l.concat(a)}else{l=a}const g=l.filter(t=>t!=="none").map(t=>`health=${t}`).join("&");const y=`https://api.edamam.com/api/recipes/v2?type=public&mealType=${A}&calories=${r}-${c}&${g}&&dishType=${f}&ingr=${ingredientCount}&app_id=${e}&app_key=${n}${m?`&diet=${m}`:""}${t?"":F}`;if(t){L=false;F="";t=false}if(I)return null;I=true;try{const v=await fetch(y,{method:"GET",mode:"cors",headers:{Accept:"application/json","Content-Type":"application/json"}});if(!v.ok){throw new Error("Error fetching data from EDMAM API")}const b=await v.json();const $=b._links.next;if($){const C=$.href.match(/&_cont=([^&]+)/);if(C){F=`&_cont=${C[1]}`}}T=b.hits.filter(t=>{const e=t.recipe["yield"]||1;const n=t.recipe.calories/e;return n>=r&&n<=c}).filter(t=>{const e=t.recipe.mealType;return k(e)}).filter(t=>{const e=t.recipe["yield"]||1;const n=(t.recipe.totalNutrients["PROCNT"]?.quantity||0)/e;return n>=5}).filter(t=>{const e=t.recipe.ingredients;const n=e.length;const i=e.filter(t=>t.foodCategory==="Condiments and sauces").length;const o=i/n*100;return o<40||q(t.recipe)}).filter(t=>!q(t.recipe)).filter(t=>B(t.recipe,u,A)).map(t=>{const e=t.recipe["yield"]||1;const n={...t.recipe};n.ingredients.forEach(t=>{t.weight/=e;if(t.quantity>0){t.quantity/=e}});n.calories/=e;for(const i in n.totalNutrients){n.totalNutrients[i].quantity/=e}return n});if(T.length===0){L=true;I=false;S.innerHTML="<p>No matching recipes found. Consider adjusting your selected options for better results</p>";S.style.display="block";return null}E=-1;return w()}catch(h){console.error("Error fetching data:",h);return null}finally{I=false}}async function y(){const t=document.getElementById("cooking-instructions");const e=document.getElementById("loading-gif");const n=document.getElementById("load-instructions-button");const i="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";const o="https://api.openai.com/v1/chat/completions";e.style.display="block";n.style.display="none";let s=h(f);if(!Array.isArray(s)){s=[s]}const a=s.join("\n\n");const r=`You are a world-class chef. Just start with the cooking instructions. No need to mention quantities and meal names in the response. End with Enjoy! Provide cooking instructions for making ${f.label} using the following ingredients:\n\n${a}`;const c=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"system",content:"You are a helpful world-class chef that provides cooking instructions without mentioning meal name in the end."},{role:"user",content:r}]})});const l=await c.json();const d=l.choices[0].message.content;const u=d.split("\n").map(t=>`<p>${t}</p>`).join("");e.style.display="none";t.innerHTML=`<p>${u}</p>`}function g(t){const e=1e-9;let n=1;let i=0;let o=0;let s=1;let a=t;do{const r=Math.floor(a);let t=n;n=r*n+i;i=t;t=o;o=r*o+s;s=t;a=1/(a-r)}while(Math.abs(t-n/o)>t*e);return`${n}/${o}`}function h(t){return t.ingredients.map(i=>{if(i.quantity===0){return`<li>
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <img src="${i.image}" alt="${i.food}" width="45" style="border-radius: 20%; overflow: hidden;">
                                <div style="margin-left: 18px;">
                                    <b>${i.food.charAt(0).toUpperCase()+i.food.slice(1)}</b>
                                </div>
                            </div>
                        </li>`}else{let t;if(i.food.toLowerCase()==="eggs"){t=Math.abs(Math.round(i.quantity))}else{if(Number.isInteger(i.quantity)){t=i.quantity}else{const s=Math.floor(i.quantity);const a=i.quantity-s;const r=g(a);if(s===0){t=r}else{t=`${s} ${r}`}}}let e=i.measure==="<unit>"?"average-size":i.measure;if(i.measure!=="<unit>"&&i.quantity>1){e+="s"}else if(i.food==="Total Fat"||i.food==="Total Carbohydrates"){e="g"}let n="";if(i.measure!=="gram"){const c=(Math.round(i.weight*100)/100).toFixed(2);n=`(${c} grams)`}const o=`<b>${i.food.charAt(0).toUpperCase()+i.food.slice(1)}</b>`;return`<li class="ingredient-item">
        <div class="ingredient-info">
            <div class="ingredient-left">
                <img src="${i.image}" alt="${i.food}" width="45" style="border-radius: 20%; overflow: hidden;">
                <span class="ingredient-name">${o}</span>
            </div>
            <div class="ingredient-right">
                <span class="ingredient-quantity">${t} ${e}</span>
                <span class="ingredient-weight">${n}</span>
            </div>
        </div>
    </li>`}}).join("")}async function v(r){const t=r.label;const e=r.ingredientLines;const n=r.calories.toFixed(2);const i=h(r);const o=r.totalTime;const c={"SUGAR.added":"Added sugar",CA:"Calcium","CHOCDF.net":"Total Carbohydrate (g)",CHOLE:"Cholesterol",ENERC_KCAL:"Energy",FAMS:"Monounsaturated Fat",FAPU:"Polyunsaturated Fat",FASAT:"Saturated Fat",FIBTG:"Dietary Fiber",FOLFD:"Folate",FOLAC:"Folic acid",FE:"Iron",MG:"Magnesium",NIA:"Niacin",P:"Phosphorus",K:"Potassium",PROCNT:"Protein",RIBF:"Riboflavin",NA:"Sodium","Sugar.alcohol":"Sugar alcohols",SUGAR:"Sugars",THIA:"Thiamin",FAT:"Total Fat (g)",VITA_RAE:"Vitamin A",VITB12:"Vitamin B-12",VITB6A:"Vitamin B-6",VITC:"Vitamin C",VITD:"Vitamin D ",TOCPHA:"Vitamin E ",VITK1:"Vitamin K ",WATER:"Water",ZN:"Zinc"};const s=["CHOCDF","FOLDFE"];const l=r.totalNutrients;const a=Object.keys(l).filter(t=>l[t].quantity>0&&!s.includes(t));const d={macronutrients:["ENERC_KCAL",["FAT","FASAT","FAMS","FAPU"],["CHOCDF.net","FIBTG","SUGAR"],"PROCNT"],micronutrients:["CA","CHOLE","FE","MG","P","K","NA","ZN","THIA","RIBF","NIA","VITB6A","FOLFD","FOLAC","VITB12","VITD","TOCPHA","VITK1","VITA_RAE","VITC"]};const u=d.macronutrients.map(t=>{if(Array.isArray(t)){const e=c[t[0]]||t[0];const n=t.slice(1).map(t=>{const e=l[t];if(e){const n=c[t]||t;const i=e.quantity||0;const o=e.unit||"";const s=["Saturated Fat","Monounsaturated Fat","Polyunsaturated Fat","Dietary Fiber","Sugars"].includes(n);return`<li class="${s?"special-nutrient":""}">
                <b>${n}:</b> ${i.toFixed(2)} ${o}
              </li>`}return""}).join("");const i=l[t[0]];const o=i?i.quantity.toFixed(2):"";return`<li><h5>${e}: ${o}</h5><ul>${n}</ul></li>`}else{const s=l[t];if(s){const a=c[t]||t;return`<li><span class="nutrition-label">${a}:</span> ${s.quantity.toFixed(2)} ${s.unit}</li>`}return""}}).join("");const f=d.micronutrients.map(e=>{const n=l[e];if(n){const i=c[e]||e;const o=n.quantity||0;const s=n.unit||"";const a=r.totalDaily[e];let t="";if(a){t=(a.quantity/r["yield"]).toFixed(2)}return`<div style="border-bottom: 1px solid #ccc; padding: 5px 0;">
                <div><b>${i}:</b> ${o.toFixed(2)} ${s}</div>
                <div>RDV: ${t}%</div>
              </div>`}return""}).join("");S.innerHTML=`
<div class="output-header" style="position: relative; padding-top: 40px;">
    <button id="regenerate-button" style="position: absolute; top: 0; left: 0;">    <i class="fas fa-redo" style="margin-right: 5px; font-size: 14px;"></i>Refresh</button>     <h1>${t}</h1>
    <div class="output-header-details">
        <div class="output-header-left">
            <img src="${r.image}" alt="${t}" width="250">
        </div>
        <div class="output-header-right">
            <p><i class="fas fa-fire output-icon"></i> Calories: ${n} kcal</p>
            <p><i class="fas fa-stopwatch output-icon"></i> Time to Prepare: ${o} minutes</p>
        </div>
    </div>
    </div>
    <div class="output-main">
        <div class="output-main-left">
            <h3><i class="fas fa-shopping-cart output-icon"></i> Ingredients (Per serving):</h3>
            <ul>${i}</ul>
            <h3><i class="fas fa-utensils output-icon"></i> Cooking Instructions:</h3>
            <div id="cooking-instructions"></div>
            <button id="load-instructions-button">Load Cooking Instructions</button>
<div id="loading-gif" style="display: none;">
    <img src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/04de2e31234507.564a1d23645bf.gif" alt="Loading" width="75">
</div>
        </div>
        <div class="output-main-right">
            <h3><i class="fas fa-info-circle output-icon"></i> Nutritional Facts (Per serving):</h3>
            <div class="nutrition-table">
                <div class="macronutrients">
                    <h4>Macronutrients</h4>
                    <ul>${u}</ul>
                </div>
<div class="micronutrients-container">

            <button id="toggle-micronutrients-button">Detailed Micronutrients 
    <i class="fas fa-chevron-down" style="margin-left: 5px;"></i>

</button>

                <div class="micronutrients" style="display: none;">
                    <h4>Micronutrients</h4>
                    <ul>${f}</ul>
                </div>

            </div>
    
   

    `;const p=document.getElementById("load-instructions-button");p.addEventListener("click",y);const m=document.getElementById("toggle-micronutrients-button");const g=document.querySelector(".micronutrients");m.addEventListener("click",()=>{g.classList.toggle("active");if(g.style.display==="none"){g.style.display="block"}else{g.style.display="none"}});S.style.display="block"}function w(){if(L&&E===T.length-1){return null}E++;if(E>=T.length){return m()}return T[E]}const M=t.querySelector("#meal-form");M.addEventListener("submit",async function(t){t.preventDefault();A=M.querySelector("#meal-type").value;n=M.querySelector("#calories").value;const e=await m(true);if(e){f=e;v(e);$()}else{S.innerHTML="<p>No matching recipes found. Consider adjusting your selected options for better results.</p>"}});const b=document.getElementById("regenerate-button");b.style.display="none";function $(){b.style.display="block"}const S=document.getElementById("output-section");S.addEventListener("click",async function(t){if(t.target&&t.target.id==="regenerate-button"){const e=w();if(e){f=e;v(e)}else{S.innerHTML="<p>No more recipes available.</p>"}}})});         

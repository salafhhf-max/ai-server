const translations = {

en:{
home:"Home",
resume:"Resume Generator",
email:"Email Writer",
summary:"Text Summarizer",
translate:"Translator",
idea:"Startup Idea Generator",
button:"Generate"
},

ar:{
home:"الرئيسية",
resume:"منشئ السيرة الذاتية",
email:"كاتب الايميل",
summary:"تلخيص النص",
translate:"مترجم",
idea:"مولد افكار المشاريع",
button:"انشاء"
},

he:{
home:"בית",
resume:"מחולל קורות חיים",
email:"כותב אימייל",
summary:"סיכום טקסט",
translate:"מתרגם",
idea:"מחולל רעיונות",
button:"צור"
},

ru:{
home:"Главная",
resume:"Генератор резюме",
email:"Генератор email",
summary:"Суммаризация текста",
translate:"Переводчик",
idea:"Генератор стартап идей",
button:"Создать"
}

}

function changeLang(){

const lang = document.getElementById("lang").value

document.querySelectorAll("[data-key]").forEach(el=>{
const key = el.getAttribute("data-key")
el.innerText = translations[lang][key]
})

}
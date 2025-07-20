const grids = [...document.querySelectorAll("#grid1, #grid2, #grid3, #grid4, #grid5, #grid6, #grid7, #grid8, #grid9")];

grids.forEach((elemento) =>{
    elemento.addEventListener("click", (evt)=>{
        const elementoClicado = evt.target;
        elementoClicado.classList.add("selected"); 
        console.log(elementoClicado.id + " foi clicado");
    })
})

/*
let cores = document.documentElement;
const cor = getComputedStyle(cores);

const listaCores = cor.cssText.split(';').map(name => name.trim()).filter(Boolean);
const variaveis = listaCores.filter(name => name.startsWith('--'));
console.log(variaveis);


const lista = [
    
]

const misturaCores = [...lista].sort(() => Math.random() - 0.5);

for (let i = 0; i < Math.min(9, misturaCores.length); i++) {
    const cor = misturaCores[i];
}

/*

/*
let cores = document.documentElement;
const cor = getComputedStyle(cores);
const listaCores= Array.from(cor).filter(name => name.startsWith('--'));

console.log(listaCores);
*/

/*
let cores = document.documentElement;
const cor = getComputedStyle(cores).getPropertyValue('root');
console.log(cor); 
*/
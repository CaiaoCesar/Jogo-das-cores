// Variáveis do jogo
let pontuacao = 0;
let tempoRestante = 10; // Tempo inicial em segundos
let intervalo = null;

// Elementos DOM
const displayPontuacao = document.querySelector('.score h2');
const displayTempo = document.querySelector('.timer h2');
const displayCorAlvo = document.querySelector('.chosen-color h2');

const grids = [...document.querySelectorAll("#grid1, #grid2, #grid3, #grid4, #grid5, #grid6, #grid7, #grid8, #grid9")];

// Contador regressivo
function iniciarContador() {
    tempoRestante = 10;
    atualizarDisplay();
    
    intervalo = setInterval(() => {
        tempoRestante -= 0.1;
        atualizarDisplay();
        
        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            fimDeJogo();
        }
    }, 100);
}

function atualizarDisplay() {
    displayTempo.textContent = `Tempo Restante: ${tempoRestante.toFixed(1)}s`;
    displayPontuacao.textContent = `Pontuação: ${pontuacao}`;
}


function reconheceClick(){
    grids.forEach((elemento) =>{
        elemento.addEventListener("click", (evt)=>{
            const elementoClicado = evt.target;
            elementoClicado.classList.add("selected"); 
            console.log(elementoClicado.id + " foi clicado");
        })
    })
}

function atualizaRanking(){
    const ranking = JSON.parse(localStorage.getItem('Ranking') || []);
    const listaRanking = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    ranking.forEach(( item => {
        const li = document.createElement('li');
        li.textContent = `${item.pontuacao}`;
        listaRanking.appendChild(li);
    }))
}

function salvaPontuação(){
    const ranking = JSON.parse(localStorage.getItem('Ranking') || []);
    ranking.push({pontuacao: pontuacao});

    //seleciona as 10 melhores pontuações
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 10)));
}

function iniciarJogo(){
    iniciarContador();
    reconheceClick();
    atualizarDisplay();
    atualizaRanking();
}

function fimDeJogo() {
    alert(`Fim de jogo! Sua pontuação final: ${pontuacao}`);
    salvaPontuação();
    // Reinicia o jogo
    pontuacao = 0;
    iniciarJogo();
}

document.addEventListener('DOMContentLoaded', iniciarJogo);

/*
const listaCores = [...document.querySelectorAll(":root")];

const misturaCores = [...lista].sort(() => Math.random() - 0.5);

for (let i = 0; i < Math.min(9, misturaCores.length); i++) {
    const cor = misturaCores[i];
}


/*
let cores = document.documentElement;
const cor = getComputedStyle(cores);

const listaCores = cor.cssText.split(';').map(name => name.trim()).filter(Boolean);
const variaveis = listaCores.filter(name => name.startsWith('--'));
console.log(variaveis);


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
// Variáveis do jogo
let pontuacao = 0;
let tempoRestante = 30;
let intervalo = null;
let corAlvo = null;
let jogoAtivo = false;
let playerName = "";
let btnReiniciar = null;

// Elementos DOM
const displayPontuacao = document.querySelector('.score h2');
const displayTempo = document.querySelector('.timer h2');
const displayCorAlvo = document.querySelector('.chosen-color h2');
const grids = [...document.querySelectorAll("#grid1, #grid2, #grid3, #grid4, #grid5, #grid6, #grid7, #grid8, #grid9")];

// Dados das Cores
const cores = ['yellow', 'blue', 'red', 'brown', 'green', 'orange', 'white', 'gray', 'pink'];

const traducoes = {
    'yellow': 'amarelo',
    'blue': 'azul',
    'red': 'vermelho',
    'brown': 'marrom',
    'green': 'verde',
    'orange': 'laranja',
    'white': 'branco',
    'gray': 'cinza',
    'pink': 'rosa'
};

//Funções do Jogo
function sorteiaCor() {
    return cores[Math.floor(Math.random() * cores.length)];
}

function adicionaCoresGrid() {
    corAlvo = sorteiaCor();
    let coresGrid = [...cores].filter(c => c !== corAlvo)
                          .sort(() => Math.random() - 0.5)
                          .slice(0, 8);
    coresGrid.push(corAlvo);
    coresGrid = coresGrid.sort(() => Math.random() - 0.5);

    grids.forEach((grid, i) => {
        grid.style.backgroundColor = coresGrid[i];
        grid.dataset.cor = coresGrid[i];
    });
}

function iniciarContador() {
    if (intervalo) clearInterval(intervalo);
    
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
    
    const nomeCorTraduzido = traducoes[corAlvo] || corAlvo;
    displayCorAlvo.textContent = `A cor escolhida agora é: ${nomeCorTraduzido}`;
    displayCorAlvo.style.color = corAlvo;

    if (['white', 'yellow', 'pink'].includes(corAlvo)) {
        displayCorAlvo.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
    } else {
        displayCorAlvo.style.textShadow = 'none';
    }
}

function iniciaRodada() {
    jogoAtivo = true;
    adicionaCoresGrid();
    
    if (!intervalo) {
        iniciarContador();
    }
    
    atualizarDisplay();
}

function reconheceClick() {
    grids.forEach(grid => {
        grid.replaceWith(grid.cloneNode(true));
    });

    const freshGrids = [...document.querySelectorAll("#grid1, #grid2, #grid3, #grid4, #grid5, #grid6, #grid7, #grid8, #grid9")];

    freshGrids.forEach((elemento) => {
        elemento.addEventListener("click", (evt) => {
            if (!jogoAtivo) return;
            
            const elementoClicado = evt.target;
            const corClicada = elementoClicado.dataset.cor;
            
            if (corClicada === corAlvo) {
                pontuacao += 10;
                elementoClicado.classList.add("certo");
                atualizarDisplay();
                
                setTimeout(() => {
                    elementoClicado.classList.remove("certo");
                    iniciaRodada();
                }, 500);
            } else {
                clearInterval(intervalo);
                intervalo = null;
                
                pontuacao = Math.max(0, pontuacao - 5);
                tempoRestante = Math.max(0.1, tempoRestante - 6); 
                elementoClicado.classList.add("errado");
                atualizarDisplay();
                
                setTimeout(() => {
                    elementoClicado.classList.remove("errado");
                    iniciarContador();
                    iniciaRodada();
                }, 300);
            }
        });
    });
}

function iniciarJogo() {
    playerName = document.getElementById('playerName').value || "Jogador";
    if (!playerName.trim()) {
        alert("Por favor, digite seu nome!");
        return;
    }
    
    if (btnReiniciar) {
        btnReiniciar.remove();
        btnReiniciar = null;
    }
    
    const rankingDiv = document.getElementById('ranking');
    if (rankingDiv) rankingDiv.remove();
    
    pontuacao = 0;
    tempoRestante = 30;
    clearInterval(intervalo);
    intervalo = null;
    jogoAtivo = true;
    
    iniciaRodada();
    reconheceClick();
}

function fimDeJogo() {
    jogoAtivo = false;
    clearInterval(intervalo);
    intervalo = null;

    alert(`${playerName}, sua pontuação final: ${pontuacao}`);
    
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({
        nome: playerName,
        pontos: pontuacao,
        data: new Date().toLocaleDateString()
    });
    
    ranking.sort((a, b) => b.pontos - a.pontos);
    localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 10)));
    
    mostrarRanking();
    
    grids.forEach(grid => {
        grid.style.pointerEvents = 'none';
    });

    if (!btnReiniciar) {
        btnReiniciar = document.createElement('button');
        btnReiniciar.textContent = "Jogar Novamente";
        btnReiniciar.addEventListener('click', iniciarJogo);
        document.querySelector('.container').appendChild(btnReiniciar);
    }
}

function mostrarRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const rankingHTML = ranking.map((jogador, i) => {
        let medalha = '';
        if (i === 0) medalha = '🥇';
        else if (i === 1) medalha = '🥈';
        else if (i === 2) medalha = '🥉';
        
        return `<li>${medalha} ${jogador.nome} - ${jogador.pontos} pontos (${jogador.data})</li>`;
    }).join('');
    
    const rankingDiv = document.createElement('div');
    rankingDiv.id = 'ranking';
    rankingDiv.innerHTML = `<h3>Top 10 Jogadores</h3><ol>${rankingHTML}</ol>`;
    document.querySelector('.container').appendChild(rankingDiv);
}
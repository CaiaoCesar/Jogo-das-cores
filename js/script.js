// Variáveis do jogo
let pontuacao = 0;
let tempoRestante = 30;
let intervalo = null;
let corAlvo = null;
let jogoAtivo = false;

// Elementos DOM
const displayPontuacao = document.querySelector('.score h2');
const displayTempo = document.querySelector('.timer h2');
const displayCorAlvo = document.querySelector('.chosen-color h2');
const grids = [...document.querySelectorAll("#grid1, #grid2, #grid3, #grid4, #grid5, #grid6, #grid7, #grid8, #grid9")];

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

function sorteiaCor() {
    const misturaCores = [...cores].sort(() => Math.random() - 0.5);
    return misturaCores[0];
}

function adicionaCoresGrid() {
    corAlvo = sorteiaCor();
    let coresGrid = [...cores].sort(() => Math.random() - 0.5).slice(0, 8);
    coresGrid.push(corAlvo);
    coresGrid = coresGrid.sort(() => Math.random() - 0.5);

    grids.forEach((grid, i) => {
        grid.style.backgroundColor = coresGrid[i];
        grid.dataset.cor = coresGrid[i];
    });
}

function iniciarContador() {
    if (intervalo) {
        clearInterval(intervalo);
    }
    
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
    
    // Só inicia o contador se não estiver ativo
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
                
                // Ajuste de dificuldade após 50 pontos
                if (pontuacao >= 50) {
                    tempoRestante = Math.min(tempoRestante, 20);
                }
                
                atualizarDisplay();
                
                setTimeout(() => {
                    elementoClicado.classList.remove("certo");
                    iniciaRodada(); // Continua com o mesmo tempo
                }, 500);
            } else {
                elementoClicado.classList.add("errado");
                setTimeout(() => {
                    elementoClicado.classList.remove("errado");
                    fimDeJogo();
                }, 300);
            }
        });
    });
}

function iniciarJogo() {
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

    alert(`Fim de jogo! Sua pontuação final: ${pontuacao}`);
    
    grids.forEach(grid => {
        grid.style.pointerEvents = 'none';
    });

    const btnReiniciar = document.createElement('button');
    btnReiniciar.textContent = "Jogar Novamente";
    btnReiniciar.addEventListener('click', iniciarJogo);
    document.querySelector('.container').appendChild(btnReiniciar);
}

// Inicia o jogo quando a página carrega
window.onload = iniciarJogo;
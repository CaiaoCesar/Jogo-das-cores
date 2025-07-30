// script.js - Versão melhorada mantendo seu design
class ColorGame {
    constructor() {
        // Configurações do jogo (adaptadas para seu design)
        this.config = {
            initialTime: 30,
            timePenalty: 6,    // Como no seu código original
            scoreCorrect: 10,   // Como no seu código original
            scoreWrong: -5,     // Como no seu código original
            colors: ['yellow', 'blue', 'red', 'brown', 'green', 'orangered', 'white', 'darkgray', 'purple'],
            traducoes: {
                'yellow': 'amarelo',
                'blue': 'azul',
                'red': 'vermelho',
                'brown': 'marrom',
                'green': 'verde',
                'orangered': 'laranja',
                'white': 'branco',
                'darkgray': 'cinza',
                'purple': 'roxo'
            }
        };

        // Estado do jogo
        this.state = {
            score: 0,
            timeLeft: this.config.initialTime,
            isPlaying: false,
            playerName: '',
            targetColor: null,
            timerInterval: null
        };

        // Elementos DOM (usando seus seletores)
        this.elements = {
            playerName: document.getElementById('playerName'),
            displayPontuacao: document.querySelector('.score h2'),
            displayTempo: document.querySelector('.timer h2'),
            displayCorAlvo: document.querySelector('.chosen-color h2'),
            grids: [...document.querySelectorAll("#grid1, #grid2, #grid3, #grid4, #grid5, #grid6, #grid7, #grid8, #grid9")]
        };

        // Inicializa os eventos
        document.querySelector('.btn-start button').addEventListener('click', () => this.startGame());
    }

    startGame() {
        const name = this.elements.playerName.value.trim() || "Jogador";
        if (!name.trim()) {
            alert("Por favor, digite seu nome!");
            return;
        }

        // Remove o ranking anterior se existir
        const rankingDiv = document.getElementById('ranking');
        if (rankingDiv) rankingDiv.remove();

        // Remove o botão de reiniciar se existir
        if (this.btnReiniciar) {
            this.btnReiniciar.remove();
            this.btnReiniciar = null;
        }

        // Reinicia o estado do jogo
        this.state = {
            score: 0,
            timeLeft: this.config.initialTime,
            isPlaying: true,
            playerName: name,
            targetColor: null,
            timerInterval: null
        };

        // Ativa os grids
        this.elements.grids.forEach(grid => {
            grid.style.pointerEvents = 'auto';
        });

        // Inicia a primeira rodada
        this.startNewRound();

        // Inicia o timer
        this.startTimer();
    }

    startNewRound() {
        // Sorteia nova cor alvo
        this.state.targetColor = this.getRandomColor();
        
        // Atualiza a exibição
        this.updateDisplay();
        
        // Preenche os grids com cores
        this.fillGridWithColors();
    }

    getRandomColor() {
        const randomIndex = Math.floor(Math.random() * this.config.colors.length);
        return {
            value: this.config.colors[randomIndex],
            name: this.config.traducoes[this.config.colors[randomIndex]] || this.config.colors[randomIndex]
        };
    }

    fillGridWithColors() {
        // Filtra cores diferentes da alvo
        let coresDisponiveis = this.config.colors.filter(c => c !== this.state.targetColor.value);
        
        // Embaralha
        coresDisponiveis = coresDisponiveis.sort(() => Math.random() - 0.5);
        
        // Pega 8 cores aleatórias (pode conter repetições)
        let coresGrid = [];
        for (let i = 0; i < 8; i++) {
            coresGrid.push(coresDisponiveis[Math.floor(Math.random() * coresDisponiveis.length)]);
        }
        
        // Garante que a corAlvo esteja presente
        coresGrid.push(this.state.targetColor.value);
        
        // Embaralha novamente
        coresGrid = coresGrid.sort(() => Math.random() - 0.5);

        // Aplica as cores aos grids
        this.elements.grids.forEach((grid, i) => {
            grid.style.backgroundColor = coresGrid[i];
            grid.dataset.cor = coresGrid[i];
            
            // Remove classes de estado anterior
            grid.classList.remove("certo", "errado");
            
            // Adiciona o event listener (substitui o antigo)
            grid.onclick = (e) => this.handleGridClick(e);
        });
    }

    handleGridClick(event) {
        if (!this.state.isPlaying) return;

        const elementoClicado = event.target;
        const corClicada = elementoClicado.dataset.cor;
        const isCorrect = corClicada === this.state.targetColor.value;

        if (isCorrect) {
            // Acertou
            this.state.score += this.config.scoreCorrect;
            elementoClicado.classList.add("certo");
        } else {
            // Errou
            this.state.score = Math.max(0, this.state.score + this.config.scoreWrong);
            this.state.timeLeft = Math.max(0.1, this.state.timeLeft - this.config.timePenalty);
            elementoClicado.classList.add("errado");
        }

        // Atualiza displays
        this.updateDisplay();

        // Remove classes de feedback após animação
        setTimeout(() => {
            elementoClicado.classList.remove("certo", "errado");
            
            if (isCorrect) {
                this.startNewRound();
            } else {
                this.checkGameOver();
            }
        }, 300);
    }

    startTimer() {
        clearInterval(this.state.timerInterval);
        
        this.state.timerInterval = setInterval(() => {
            this.state.timeLeft -= 0.1;
            this.updateDisplay();
            
            if (this.state.timeLeft <= 0) {
                this.endGame();
            }
        }, 100);
    }

    updateDisplay() {
        this.elements.displayTempo.textContent = `Tempo Restante: ${this.state.timeLeft.toFixed(1)}s`;
        this.elements.displayPontuacao.textContent = `Pontuação: ${this.state.score}`;
        
        this.elements.displayCorAlvo.textContent = `A cor escolhida agora é: ${this.state.targetColor.name}`;
        this.elements.displayCorAlvo.style.color = this.state.targetColor.value;

        if (['white', 'yellow', 'pink'].includes(this.state.targetColor.value)) {
            this.elements.displayCorAlvo.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
        } else {
            this.elements.displayCorAlvo.style.textShadow = 'none';
        }
    }

    checkGameOver() {
        if (this.state.timeLeft <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.state.isPlaying = false;
        clearInterval(this.state.timerInterval);

        // Mostra alerta com pontuação
        alert(`${this.state.playerName}, sua pontuação final: ${this.state.score}`);
        
        // Atualiza ranking
        this.updateRanking();
        
        // Desativa os grids
        this.elements.grids.forEach(grid => {
            grid.style.pointerEvents = 'none';
        });

        // Adiciona botão de reiniciar
        this.addRestartButton();
    }

    updateRanking() {
        let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        
        ranking.push({
            nome: this.state.playerName,
            pontos: this.state.score,
            data: new Date().toLocaleDateString()
        });

        // Ordena por pontuação (maior primeiro)
        ranking.sort((a, b) => b.pontos - a.pontos);
        
        // Mantém apenas os top 10
        ranking = ranking.slice(0, 10);
        
        // Salva no localStorage
        localStorage.setItem('ranking', JSON.stringify(ranking));
        
        // Exibe o ranking
        this.displayRanking(ranking);
    }

    displayRanking(ranking) {
        let html = '<h3>Top 10 Jogadores</h3><ol>';
        
        ranking.forEach((player, index) => {
            let medalha = '';
            if (index === 0) medalha = '🥇';
            else if (index === 1) medalha = '🥈';
            else if (index === 2) medalha = '🥉';
            
            html += `<li>${medalha} ${player.nome} - ${player.pontos} pontos (${player.data})</li>`;
        });
        
        html += '</ol>';
        
        const rankingDiv = document.createElement('div');
        rankingDiv.id = 'ranking';
        rankingDiv.innerHTML = html;
        document.querySelector('.container').appendChild(rankingDiv);
    }

    addRestartButton() {
        this.btnReiniciar = document.createElement('button');
        this.btnReiniciar.textContent = "Jogar Novamente";
        this.btnReiniciar.addEventListener('click', () => this.startGame());
        this.btnReiniciar.style.margin = '20px auto';
        this.btnReiniciar.style.display = 'block';
        document.querySelector('.container').appendChild(this.btnReiniciar);
    }
}

// Inicia o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new ColorGame();
});
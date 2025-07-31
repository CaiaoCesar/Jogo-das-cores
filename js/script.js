class ColorGame {
    constructor() {
        this.config = {
            initialTime: 30,
            timePenalty: 6,   
            scoreCorrect: 10,   
            scoreWrong: -5,     
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

        this.state = {
            score: 0,
            timeLeft: this.config.initialTime,
            isPlaying: false,
            playerName: '',
            targetColor: null,
            timerInterval: null
        };

        this.elements = {
            playerName: document.getElementById('playerName'),
            displayPontuacao: document.querySelector('.score h2'),
            displayTempo: document.querySelector('.timer h2'),
            displayCorAlvo: document.querySelector('.chosen-color h2'),
            grids: [...document.querySelectorAll("#grid1, #grid2, #grid3, #grid4, #grid5, #grid6, #grid7, #grid8, #grid9")]
        };

        document.querySelector('.btn-start button').addEventListener('click', () => this.startGame());
    }

    startGame() {
        const name = this.elements.playerName.value.trim() || "Jogador";
        if (!name.trim()) {
            alert("Por favor, digite seu nome!");
            return;
        }

        const rankingDiv = document.getElementById('ranking');
        if (rankingDiv) rankingDiv.remove();

        if (this.btnReiniciar) {
            this.btnReiniciar.remove();
            this.btnReiniciar = null;
        }

        this.state = {
            score: 0,
            timeLeft: this.config.initialTime,
            isPlaying: true,
            playerName: name,
            targetColor: null,
            timerInterval: null
        };

        this.elements.grids.forEach(grid => {
            grid.style.pointerEvents = 'auto';
        });

        this.startNewRound();

        this.startTimer();
    }

    startNewRound() {
        this.state.targetColor = this.getRandomColor();
        
        this.updateDisplay();
        
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
        let coresDisponiveis = this.config.colors.filter(c => c !== this.state.targetColor.value);
        
        // Embaralha
        coresDisponiveis = coresDisponiveis.sort(() => Math.random() - 0.5);
        
        // Pega 8 cores aleatórias (pode conter repetições)
        let coresGrid = [];
        for (let i = 0; i < 8; i++) {
            coresGrid.push(coresDisponiveis[Math.floor(Math.random() * coresDisponiveis.length)]);
        }
        
        coresGrid.push(this.state.targetColor.value);
        
        coresGrid = coresGrid.sort(() => Math.random() - 0.5);

        this.elements.grids.forEach((grid, i) => {
            grid.style.backgroundColor = coresGrid[i];
            grid.dataset.cor = coresGrid[i];
            
            grid.classList.remove("certo", "errado");
            
            grid.onclick = (e) => this.handleGridClick(e);
        });
    }

    handleGridClick(event) {
        if (!this.state.isPlaying) return;

        const elementoClicado = event.target;
        const corClicada = elementoClicado.dataset.cor;
        const isCorrect = corClicada === this.state.targetColor.value;

        if (isCorrect) {
            this.state.score += this.config.scoreCorrect;
            elementoClicado.classList.add("certo");
        } else {
            this.state.score = Math.max(0, this.state.score + this.config.scoreWrong);
            this.state.timeLeft = Math.max(0.1, this.state.timeLeft - this.config.timePenalty);
            elementoClicado.classList.add("errado");
        }

        this.updateDisplay();

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

        alert(`${this.state.playerName}, sua pontuação final: ${this.state.score}`);
        
        this.updateRanking();
        
        this.elements.grids.forEach(grid => {
            grid.style.pointerEvents = 'none';
        });

        this.addRestartButton();
    }

    updateRanking() {
        let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        
        ranking.push({
            nome: this.state.playerName,
            pontos: this.state.score,
            data: new Date().toLocaleDateString()
        });

        ranking.sort((a, b) => b.pontos - a.pontos);
        
        ranking = ranking.slice(0, 10);
        
        localStorage.setItem('ranking', JSON.stringify(ranking));
        
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

document.addEventListener('DOMContentLoaded', () => {
    new ColorGame();
});
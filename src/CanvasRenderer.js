import { State } from './State.js';
        
// Módulo responsável pela lógica de desenho e manipulação do canvas.
export const CanvasRenderer = {
    canvas: document.getElementById("myCanvas"),
    ctx: null,

    // 2.1 Configuração inicial
    init() {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.ctx = this.canvas.getContext("2d");
        
        // Configurações de estilo
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = State.lineWidth;
        this.ctx.strokeStyle = State.strokeColor;
    },

    // 2.2 Limpa o canvas e redesenha o histórico
    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Redesenha todos os caminhos do histórico
        State.paths.forEach(path => {
            this.ctx.lineWidth = path.lineWidth;
            this.ctx.strokeStyle = path.strokeStyle;
            
            // Lógica de redesenho da Curva de Bézier Quadrática
            let localPrevX = path.points[0].x;
            let localPrevY = path.points[0].y;
            let localPrevMidX = path.points[0].x;
            let localPrevMidY = path.points[0].y;

            for (let i = 1; i < path.points.length; i++) {
                const currentPoint = path.points[i];
                const currentX = currentPoint.x;
                const currentY = currentPoint.y;

                const midX = (localPrevX + currentX) / 2;
                const midY = (localPrevY + currentY) / 2;

                this.ctx.beginPath();
                this.ctx.moveTo(localPrevMidX, localPrevMidY);
                this.ctx.quadraticCurveTo(localPrevX, localPrevY, midX, midY);
                this.ctx.stroke();

                localPrevX = currentX;
                localPrevY = currentY;
                localPrevMidX = midX;
                localPrevMidY = midY;
            }
        });

        // Redefine as configurações para o traço ativo
        this.ctx.lineWidth = State.lineWidth;
        this.ctx.strokeStyle = State.strokeColor;
    },

    // 2.3 Desenha segmento de linha suave usando Curvas Quadráticas
    drawSmoothSegment(currentX, currentY) {
        // Armazena o ponto no caminho atual
        State.currentPath.push({ x: currentX, y: currentY });

        // Se State.prevX for null (início do desenho), desenha um ponto
        if (State.prevX === null) {
            State.prevX = currentX;
            State.prevY = currentY;
            State.prevMidX = currentX;
            State.prevMidY = currentY;
            this.ctx.beginPath();
            this.ctx.arc(currentX, currentY, State.lineWidth / 2, 0, 2 * Math.PI);
            this.ctx.fill();
            return;
        }

        // Calcula o ponto médio (endpoint da curva)
        const midX = (State.prevX + currentX) / 2;
        const midY = (State.prevY + currentY) / 2;

        this.ctx.beginPath();
        this.ctx.moveTo(State.prevMidX, State.prevMidY);
        
        // Desenha a curva: (prevX, prevY) é o ponto de controle
        this.ctx.quadraticCurveTo(State.prevX, State.prevY, midX, midY);
        
        this.ctx.stroke();

        // Atualiza as posições para o próximo segmento
        State.prevX = currentX;
        State.prevY = currentY;
        State.prevMidX = midX;
        State.prevMidY = midY;
    },

    // 2.4 Funções utilitárias (Salvar)
    saveDrawing() {
        let data = this.canvas.toDataURL("image/png");
        let a = document.createElement("a");
        a.href = data;
        a.download = "sketch.png";
        a.click();
    },

    // 2.5 Lidar com redimensionamento
    handleResize() {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = State.lineWidth; // Redefine o estilo
        this.redrawCanvas(); // Redesenha tudo
    }
};
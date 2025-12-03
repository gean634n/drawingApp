import { State } from './State.js';
        
/**
 * Módulo CanvasRenderer.
 * Responsável por desenhar no canvas, configurar estilos e gerenciar o contexto 2D.
 */
export const CanvasRenderer = {
    canvas: document.getElementById("myCanvas"),
    ctx: null,

    /**
     * Inicializa o contexto 2D do canvas, ajusta as dimensões e configura os estilos iniciais.
     */
    init() {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.ctx = this.canvas.getContext("2d");
        
        // Configurações de estilo
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = State.lineWidth;
        this.ctx.strokeStyle = State.strokeColor;

        // Adiciona listener de redimensionamento para manter o canvas em tela cheia
        window.addEventListener("resize", this.handleResize.bind(this));
    },

    /**
     * Função auxiliar para desenhar uma única Curva de Bézier Quadrática.
     * Centraliza a lógica de desenho para reuso em redrawCanvas e drawSmoothSegment.
     */
    _drawSegment(prevMidX, prevMidY, prevX, prevY, midX, midY) {
        this.ctx.beginPath();
        this.ctx.moveTo(prevMidX, prevMidY);
        // O ponto de controle é (prevX, prevY)
        this.ctx.quadraticCurveTo(prevX, prevY, midX, midY);
        this.ctx.stroke();
    },

    /**
     * Limpa o canvas e redesenha todos os traços armazenados em State.paths.
     * Essencial para o redimensionamento e futuras funcionalidades de histórico.
     */
    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        State.paths.forEach(path => {
            // Aplica os estilos salvos com o path, não os estilos ativos.
            this.ctx.lineWidth = path.lineWidth;
            this.ctx.strokeStyle = path.strokeStyle;
            
            // Variáveis locais para redesenho (simulam o State.prevX/Y/Mid para o path)
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

                // Chama Função Auxiliar
                this._drawSegment(localPrevMidX, localPrevMidY, localPrevX, localPrevY, midX, midY);
                
                // Atualiza as variáveis locais para o próximo segmento do loop
                localPrevX = currentX;
                localPrevY = currentY;
                localPrevMidX = midX;
                localPrevMidY = midY;
            }
        });

        // COMENTÁRIO ESSENCIAL: Redefine as configurações do contexto para o traço ATIVO
        this.ctx.lineWidth = State.lineWidth;
        this.ctx.strokeStyle = State.strokeColor;
    },

    /**
     * Desenha o segmento ativo do traço usando a técnica de Curvas de Bézier.
     * Atualiza as variáveis State.prevX/Y e State.currentPath.
     */    drawSmoothSegment(currentX, currentY) {
        State.currentPath.push({ x: currentX, y: currentY });

        if (State.prevX === null) {
            // Lógica para desenhar o primeiro ponto do traço
            State.prevX = currentX;
            State.prevY = currentY;
            State.prevMidX = currentX;
            State.prevMidY = currentY;
            this.ctx.beginPath();
            this.ctx.arc(currentX, currentY, State.lineWidth / 2, 0, 2 * Math.PI);
            this.ctx.fill();
            return;
        }

        const midX = (State.prevX + currentX) / 2;
        const midY = (State.prevY + currentY) / 2;

        // Chama Função Auxiliar
        this._drawSegment(State.prevMidX, State.prevMidY, State.prevX, State.prevY, midX, midY);

        // Atualiza o estado para o próximo evento de mouse/toque
        State.prevX = currentX;
        State.prevY = currentY;
        State.prevMidX = midX;
        State.prevMidY = midY;
    },

    /**
     * Salva o conteúdo do canvas como um arquivo PNG.
     */
    saveDrawing() {
        let data = this.canvas.toDataURL("image/png");
        let a = document.createElement("a");
        a.href = data;
        a.download = "sketch.png";
        a.click();
    },

    /**
     * Gerencia o redimensionamento da janela.
     * Ajusta o canvas e redesenha todo o conteúdo para evitar perda de dados.
     */
    handleResize() {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        // Redefine o estilo (pode ser perdido no redimensionamento)
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = State.lineWidth; // Redefine o estilo
        this.redrawCanvas(); // Redesenha tudo
    }
};
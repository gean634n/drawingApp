import { State } from './State.js';
import { CanvasRenderer } from './CanvasRenderer.js';

/**
 * Módulo UI (User Interface).
 * Gerencia seletores DOM, listeners de eventos de interface e interações de desenho.
 */
export const UI = {
    // Seletores DOM (propriedades do objeto literal)
    body: document.querySelector("body"),
    colorInput: document.getElementById('favcolor'),
    sizeInput: document.getElementById("ageInputId"),
    sizeOutput: document.getElementById("ageOutputId"),
    clearBtn: document.querySelector(".clear"),
    saveBtn: document.querySelector(".save"),
    colorButtons: Array.from(document.querySelectorAll(".color")),
    canvas: CanvasRenderer.canvas, // Acesso ao canvas para eventos de mouse/toque

    /**
     * Inicializa o módulo UI: preenche o canvas, define estados iniciais e configura listeners.
     */
    init() {
        this.canvas = CanvasRenderer.canvas;

        // Sincroniza a UI com o State inicial
        this.body.style.backgroundColor = State.backgroundColor;
        this.sizeOutput.innerHTML = State.lineWidth;

        // Configura listeners de interface (cores, tamanho, limpar, salvar)
        this.colorInput.addEventListener("input", this.handleColorInput.bind(this));
        this.sizeInput.addEventListener("input", this.handleResizeLine.bind(this));
        this.clearBtn.addEventListener("click", this.handleClear.bind(this));

        // Delega o saveDrawing ao CanvasRenderer
        this.saveBtn.addEventListener("click", CanvasRenderer.saveDrawing.bind(CanvasRenderer));

        this.colorButtons.forEach(button => {
            button.addEventListener("click", this.handleColorButtonClick.bind(this, button));
        });
        
        // Configura listeners de desenho (mouse e toque)
        this.setupDrawingListeners();

        // Listener de redimensionamento da janela
        // window.addEventListener("resize", CanvasRenderer.handleResize.bind(CanvasRenderer));
    },

    // --- Handlers de Configuração de Estilo ---
    handleColorInput() {
        State.backgroundColor = this.colorInput.value;
        this.body.style.backgroundColor = State.backgroundColor;
    },

    handleResizeLine() {
        // Interrompe o desenho ao mudar a espessura para evitar artefatos visuais
        State.isDrawing = false; 
        
        State.lineWidth = this.sizeInput.value;
        this.sizeOutput.innerHTML = State.lineWidth;
        CanvasRenderer.ctx.lineWidth = State.lineWidth;
        
        // Garante que o traço seja contínuo ao mudar a espessura
        CanvasRenderer.ctx.setLineDash([]);
    },

    handleColorButtonClick(button) {
        State.strokeColor = button.dataset.color;
        CanvasRenderer.ctx.strokeStyle = State.strokeColor;
    },

    handleClear() {
        State.paths = []; // Limpa todo o histórico de traços
        CanvasRenderer.ctx.clearRect(0, 0, CanvasRenderer.canvas.width, CanvasRenderer.canvas.height);
    },

    // --- Handlers de Desenho (Mouse e Toque) ---
    setupDrawingListeners() {
        // Mouse Events
        this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
        this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
        this.canvas.addEventListener("mouseleave", this.stopDrawing.bind(this));
        this.canvas.addEventListener("mousemove", this.drawMove.bind(this));

        // Touch Events
        this.canvas.addEventListener("touchstart", (e) => {
             e.preventDefault(); // Evita rolagem/zoom
             this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener("touchend", this.stopDrawing.bind(this));
        this.canvas.addEventListener("touchcancel", this.stopDrawing.bind(this));
        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault(); // Evita rolagem/zoom
            this.drawMove(e.touches[0]);
        });
    },

    startDrawing(event) {
        State.isDrawing = true;

        // Inicia um novo caminho
        State.currentPath = [
            { x: event.clientX, y: event.clientY } 
        ];

        // Captura o ponto inicial
        State.prevX = event.clientX;
        State.prevY = event.clientY;

        // O ponto médio inicial é o próprio ponto de clique
        State.prevMidX = State.prevX;
        State.prevMidY = State.prevY;
    },

    stopDrawing() {
        if (State.isDrawing) {
           // Ao parar, salva o traço completo no histórico (paths)
           State.paths.push({
                points: State.currentPath,
                lineWidth: State.lineWidth,
                strokeStyle: State.strokeColor 
            });
            State.currentPath = []; // Limpa o buffer do caminho atual
        }
        State.isDrawing = false;
        // Reseta as variáveis de curva para o próximo traço
        State.prevX = null; 
        State.prevY = null;
        State.prevMidX = null;
        State.prevMidY = null;
    },

    drawMove(event) {
        if (!State.isDrawing) return;
        
        // Delega a lógica de desenho ao CanvasRenderer
        CanvasRenderer.drawSmoothSegment(event.clientX, event.clientY);
    }
};
/* ==================== 1. SELETORES E CONFIGURAÇÃO INICIAL ==================== */
// Seleciona os elementos principais
const canvas = document.getElementById("myCanvas");
const body = document.querySelector("body");
const colorInput = document.getElementById('favcolor'); // Input para cor de fundo
const sizeInput = document.getElementById("ageInputId"); // Input para espessura da linha
const sizeOutput = document.getElementById("ageOutputId"); // Elemento para mostrar a espessura

// Configura o tamanho inicial do canvas
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Obtém o contexto 2D do canvas para desenhar
const ctx = canvas.getContext("2d");
ctx.lineJoin = "round";
ctx.lineCap = "round";


/* ==================== 2. VARIÁVEIS DE ESTADO DO DESENHO ==================== */
let lineWidth = 5;  // Espessura atual da linha
let isDrawing = false; // Flag para rastrear se o mouse está pressionado

// Variáveis para o histórico e o caminho atual
let paths = []; // Armazena todos os traços (para o histórico/Undo)
let currentPath = []; // Armazena os pontos do traço que está sendo desenhado

// Variáveis para a técnica de Curvas de Bézier Quadráticas
let prevX = null;
let prevY = null;
let prevMidX = null;
let prevMidY = null;

// Configuração inicial
ctx.lineWidth = lineWidth;
body.style.backgroundColor = "#ffffff";

/* ==================== 3. LÓGICA DO DESENHO ==================== */
// Desenha todos os caminhos armazenados no histórico
function redrawCanvas() {
    // 1. Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Redesenha todos os caminhos do histórico
    paths.forEach(path => {
        // Redefine as configurações para cada caminho (se tivéssemos largura/cor salvas)
        ctx.lineWidth = path.lineWidth;
        ctx.strokeStyle = path.strokeStyle;
        
        let localPrevX = path.points[0].x;
        let localPrevY = path.points[0].y;
        let localPrevMidX = path.points[0].x;
        let localPrevMidY = path.points[0].y;

        // Loop sobre os pontos e desenha o segmento suave
        for (let i = 1; i < path.points.length; i++) {
            const currentPoint = path.points[i];
            const currentX = currentPoint.x;
            const currentY = currentPoint.y;

            const midX = (localPrevX + currentX) / 2;
            const midY = (localPrevY + currentY) / 2;

            ctx.beginPath();
            ctx.moveTo(localPrevMidX, localPrevMidY);
            ctx.quadraticCurveTo(localPrevX, localPrevY, midX, midY);
            ctx.stroke();

            localPrevX = currentX;
            localPrevY = currentY;
            localPrevMidX = midX;
            localPrevMidY = midY;
        }
    });

    // Redefine as configurações para o traço ativo (após redesenhar o histórico)
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = ctx.strokeStyle; // Mantém a cor atual (a cor é alterada por 4.3)
}

// Desenha segmento de linha suave usando Curvas Quadráticase armazena o ponto
function drawSmoothSegment(currentX, currentY) {

    // Armazena o ponto no caminho atual
    currentPath.push({ x: currentX, y: currentY });

    // Calcula o ponto médio (endpoint da curva)
    const midX = (prevX + currentX) / 2;
    const midY = (prevY + currentY) / 2;

    ctx.beginPath();
    ctx.moveTo(prevMidX, prevMidY);
    
    // Desenha a curva: (prevX, prevY) é o ponto de controle
    ctx.quadraticCurveTo(prevX, prevY, midX, midY);
    
    ctx.stroke();

    // Atualiza as posições para o próximo segmento
    prevX = currentX;
    prevY = currentY;
    prevMidX = midX;
    prevMidY = midY;
}

/* ==================== 4. CONFIGURAÇÕES INTERATIVAS ==================== */
// --- 4.1 Cor de Fundo (Input type="color") ---
colorInput.addEventListener("input", () => {
    const backgroundColor = colorInput.value;
    body.style.backgroundColor = backgroundColor;
}, false);

// --- 4.2 Espessura da Linha (Input type="range") ---
function resizeLine () {
    // Interrompe o desenho brevemente para evitar bugs ao mudar o tamanho
    isDrawing = false; 
    
    lineWidth = sizeInput.value;
    sizeOutput.innerHTML = lineWidth;
    ctx.lineWidth = lineWidth;
    
    // Garante que o traço seja contínuo ao mudar a espessura
    ctx.setLineDash([]); 
}
sizeInput.oninput = () => resizeLine();

// --- 4.3 Cores Predefinidas (.color) ---
const colorButtons = Array.from(document.querySelectorAll(".color"));
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Define a cor da linha com o atributo data-color
        ctx.strokeStyle = button.dataset.color;
    });
});

// --- 4.4 Botão Limpar Canvas (.clear) ---
const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
    paths = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// --- 4.5 Botão Salvar Desenho (.save) ---
const saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
    // Converte e força o download da imagem
    let data = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = data;
    a.download = "sketch.png";
    a.click();
});

/* ==================== 5. EVENTOS DO MOUSE (INTERAÇÃO) ==================== */
// --- 5.1 Início do Desenho (mousedown) ---
canvas.addEventListener("mousedown", e => {
    isDrawing = true;

    // Inicia um novo currentPath
    currentPath = [
        // Salva o ponto inicial
        { x: e.clientX, y: e.clientY } 
    ];

    // Captura o ponto inicial
    prevX = e.clientX;
    prevY = e.clientY;

    // O ponto médio inicial é o próprio ponto de clique
    prevMidX = prevX;
    prevMidY = prevY;
});

// --- 5.2 Fim do Desenho (mouseup, mouseleave) ---
canvas.addEventListener("mouseup", () => {
    if (isDrawing) {
        // Salva o caminho completo no histórico (paths)
        paths.push({
            points: currentPath,
            lineWidth: lineWidth,
            strokeStyle: ctx.strokeStyle 
        });
        currentPath = []; // Limpa o buffer do caminho atual
    }
    isDrawing = false;
});
canvas.addEventListener("mouseleave", () => isDrawing = false);

// --- 5.3 Desenho em Movimento (mousemove) ---
canvas.addEventListener("mousemove", e => {
    if (!isDrawing) return;
    
    // Delega a lógica de desenho à função dedicada
    drawSmoothSegment(e.clientX, e.clientY);
});



/* ==================== 6. EVENTOS DE TOQUE (TOUCHSCREEN) ==================== */

// --- 6.1 Início do Toque (touchstart) ---
canvas.addEventListener("touchstart", e => {
    // Evita o comportamento padrão do navegador (como rolagem ou zoom)
    e.preventDefault(); 
    
    isDrawing = true;

    // Eventos de toque usam a propriedade touches[0] para obter o primeiro ponto
    const touch = e.touches[0];

    // Inicia um novo currentPath
    currentPath = [
        // Salva o ponto inicial
        { x: touch.clientX, y: touch.clientY }
    ];

    // Captura o ponto inicial do toque
    prevX = touch.clientX;
    prevY = touch.clientY;

    // O ponto médio inicial é o próprio ponto de toque
    prevMidX = prevX;
    prevMidY = prevY;
});

// --- 6.2 Fim do Toque (touchend, touchcancel) ---
// Para de desenhar quando o toque é levantado ou cancelado
canvas.addEventListener("touchend", () => {
    if (isDrawing) {
        // NOVO: Salva o caminho completo no histórico (paths)
        paths.push({
            points: currentPath,
            lineWidth: lineWidth,
            strokeStyle: ctx.strokeStyle 
        });
        currentPath = []; // Limpa o buffer do caminho atual
    }
    isDrawing = false;
});
canvas.addEventListener("touchcancel", () => isDrawing = false);

// --- 6.3 Movimento do Toque (touchmove) ---
canvas.addEventListener("touchmove", e => {
    if (!isDrawing) return;
    
    // Evita o comportamento padrão do navegador
    e.preventDefault();
    
    // Obtém o ponto de toque atual
    const touch = e.touches[0];
    
    // Delega a lógica de desenho à função dedicada
    drawSmoothSegment(touch.clientX, touch.clientY);
});


// Listener de redimensionamento da janela
window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    // Chama resizeLine para reconfigurar a espessura e o traço contínuo
    resizeLine(); 
});
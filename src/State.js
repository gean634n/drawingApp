export const State = {
    // Estado principal do desenho
    lineWidth: 5,        // Espessura atual da linha
    strokeColor: '#000', // Cor atual da linha (inicializada com preto)
    isDrawing: false,    // Flag para rastrear se o mouse está pressionado

    // Variáveis para o histórico e o caminho atual (persistência)
    paths: [],           // Armazena todos os traços (para o histórico/Undo)
    currentPath: [],     // Armazena os pontos do traço que está sendo desenhado
    
    // Variáveis para a técnica de Curvas de Bézier Quadráticas
    prevX: null,
    prevY: null,
    prevMidX: null,
    prevMidY: null,

    // Configuração inicial de cor de fundo (usada pelo módulo UI)
    backgroundColor: "#ffffff",
};
/**
 * Objeto de Estado central da aplicação.
 * Contém todas as variáveis de controle para o desenho e o histórico de caminhos.
 * Este módulo é importado por CanvasRenderer e UI.
 */
export const State = {
    // -------------------------------------------------------------------------
    // Configurações Atuais
    // -------------------------------------------------------------------------
    lineWidth: 5,        // Espessura atual da linha
    strokeColor: '#000', // Cor atual da linha (inicializada com preto)
    isDrawing: false,    // Flag booleana: true se o mouse/toque estiver pressionado

    // -------------------------------------------------------------------------
    // Histórico e Traço Ativo
    // -------------------------------------------------------------------------
    /**
     * Array de traços completos. Cada item é um objeto com {points, lineWidth, strokeStyle}.
     * Essencial para o redrawCanvas() e funcionalidade Undo/Redo.
     */
    paths: [],
    currentPath: [],     // Armazena os pontos do traço que está sendo desenhado (buffer temporário)
    
    // -------------------------------------------------------------------------
    // Variáveis para a Curva de Bézier Quadrática
    // -------------------------------------------------------------------------
    /** * COMENTÁRIO ESSENCIAL: Armazenam os pontos X e Y do segmento anterior,
     * necessários para calcular o ponto de controle da Curva de Bézier no próximo passo.
     */
    prevX: null,
    prevY: null,
    prevMidX: null,
    prevMidY: null,

    // -------------------------------------------------------------------------
    // Configuração de Estilo Global
    // -------------------------------------------------------------------------
    backgroundColor: "#ffffff",
};
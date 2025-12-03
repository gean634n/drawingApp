/**
 * Módulos Nativos (ES Modules) são importados.
 * A extensão '.js' é obrigatória no navegador.
 */
import { CanvasRenderer } from './CanvasRenderer.js';
import { UI } from './UI.js';

/**
 * Objeto principal da Aplicação (App).
 * Sua única responsabilidade é inicializar e coordenar os módulos.
 */
const App = {
    init() {
        // A ordem de inicialização é importante:
        // O Renderer (canvas) deve ser configurado antes da UI (eventos de desenho).)
        CanvasRenderer.init();
        UI.init();
    }
};

/**
 * Inicia a aplicação após o DOM ser completamente carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
import { CanvasRenderer } from './CanvasRenderer.js';
import { UI } from './UI.js';

// Objeto App para inicializar e coordenar os módulos
const App = {
    init() {
        // 1. Inicializa o renderizador (configura o canvas e listeners de resize)
        CanvasRenderer.init();
        // 2. Inicializa a UI (configura botões e listeners de mouse/toque)
        UI.init();
    }
};

// Inicia a aplicação após o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
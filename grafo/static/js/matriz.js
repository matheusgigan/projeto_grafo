// Script para garantir que a matriz comece do início ao carregar
document.addEventListener('DOMContentLoaded', function() {
    const matrizTable = document.querySelector('.matriz-table');
    if (matrizTable) {
        // Garantir que o scroll comece no topo-esquerda (A-A)
        matrizTable.scrollTop = 0;
        matrizTable.scrollLeft = 0;
    }
});
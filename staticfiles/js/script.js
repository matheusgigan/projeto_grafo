console.log('Scripts básicos do projeto grafo carregados.');

function mostrarMensagem(mensagem, tipo = 'info') {
    console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
}

const nodesDataArray = [];
for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    nodesDataArray.push({
        id: letter, 
        label: letter,
        // Você pode definir estilos padrão aqui
        font: { size: 18, color: '#FFFFFF' }
    });
}

// 2. Definição das Arestas (Com pesos)
const edgesDataArray = [
    // A -> B, peso 10. (O Vis.js usa 'label' para mostrar o peso)
    { id: 'AB', from: 'A', to: 'B', label: '10', value: 10 },
    { id: 'AC', from: 'A', to: 'C', label: '5', value: 5 },
    { id: 'BD', from: 'B', to: 'D', label: '20', value: 20 },
    { id: 'CD', from: 'C', to: 'D', label: '2', value: 2 }
];

// O Vis.js exige que você converta os arrays em objetos DataSet
const nodes = new vis.DataSet(nodesDataArray);
const edges = new vis.DataSet(edgesDataArray);

const data = { nodes: nodes, edges: edges };

// 3. Opções de Visualização (Layout, etc.)
const options = {
    // Layout baseado em forças (para posicionar os nós)
    physics: { enabled: true, solver: 'barnesHut' }, 
    // Opções de Interação (zoom, pan, etc.)
    interaction: { navigationButtons: true, keyboard: true },
    edges: {
        // Estilo padrão das setas (se for um grafo dirigido)
        arrows: { to: { enabled: true, scaleFactor: 0.5 } },
        // Cor e espessura padrão
        color: { color: '#CCCCCC' }
    }
};

const container = document.getElementById('myNetwork');
const network = new vis.Network(container, data, options);

let startNode = null;
let endNode = null;

// Lógica de Seleção de Vértices (Clique)
network.on("selectNode", function (params) {
    if (params.nodes.length === 0) return; // Garante que algo foi clicado

    const nodeId = params.nodes[0];
    
    // Limpa os destaques anteriores
    limparDestaque(); 

    if (startNode === null) {
        startNode = nodeId;
        // Destaque o nó inicial (muda o estilo apenas dele)
        nodes.update({ id: startNode, color: { background: 'green' } });
        console.log(`Início: ${startNode}`);
    } else if (endNode === null && nodeId !== startNode) {
        endNode = nodeId;
        // Destaque o nó final
        nodes.update({ id: endNode, color: { background: 'red' } });
        console.log(`Fim: ${endNode}`);
        
        // Chamada de Destaque
        encontrarCaminhoEDestacarVis();
    } else if (nodeId === startNode) {
        // Limpa tudo se clicar no nó inicial novamente
        limparSelecao();
    }
});


// ------------------------------------
// Função de Destaque do Caminho Mais Curto (Simulada)
// ------------------------------------
function encontrarCaminhoEDestacarVis() {
    if (!startNode || !endNode) return;

    // AQUI VOCÊ RODARIA SEU ALGORITMO DIJKSTRA
    // --------------------------------------
    // Simulação: A -> C -> D (Distância: 5 + 2 = 7)
    const caminhoSimulado = [ 'A', 'C', 'D' ]; 
    const arestasCaminho = [ 'AC', 'CD' ]; // IDs das arestas

    // --------------------------------------

    // Destaque dos NÓS do caminho
    const nodesToUpdate = caminhoSimulado.map(id => ({ 
        id: id, 
        color: { background: 'gold', border: 'orange' } 
    }));
    nodes.update(nodesToUpdate);

    // Destaque das ARESTAS do caminho
    const edgesToUpdate = arestasCaminho.map(id => ({ 
        id: id, 
        color: { color: 'gold', highlight: 'yellow' }, 
        width: 5 
    }));
    edges.update(edgesToUpdate);
    
    console.log("Caminho destacado com Vis.js!");
}

// ------------------------------------
// Funções de Limpeza
// ------------------------------------
function limparDestaque() {
    // Resetar cores de todos os nós para o padrão
    nodes.forEach(node => {
        nodes.update({ id: node.id, color: null });
    });
    // Resetar cores de todas as arestas para o padrão
    edges.forEach(edge => {
        edges.update({ id: edge.id, color: null, width: 3 });
    });
}

function limparSelecao() {
    limparDestaque();
    startNode = null;
    endNode = null;
    console.log('Seleção e destaque limpos.');
}

// Disponibilizar a função de limpeza globalmente para um botão HTML
window.limparSelecao = limparSelecao;
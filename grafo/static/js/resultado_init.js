let networkInstance = null;

// Script para visualização do grafo no resultado do Dijkstra
function inicializarGrafoResultado(graphData) {
    // Calcular configurações baseadas no número de vértices (declaração antecipada)
    const numVertices = Object.keys(graphData.vertices).length;
    const isLargeGraph = numVertices > 10;
    const isVeryLargeGraph = numVertices > 15;
    
    // Criar nós do grafo
    const nodesArray = [];
    Object.keys(graphData.vertices).forEach(vertexId => {
        let color = '#97C2FC'; // Cor padrão (azul claro)
        
        // Destacar nó de partida
        if (vertexId === graphData.pontoPartida) {
            color = '#4CAF50'; // Verde para partida
        }
        // Destacar nó de destino
        else if (vertexId === graphData.pontoDestino) {
            color = '#F44336'; // Vermelho para destino
        }
        // Destacar nós do caminho (exceto partida e destino)
        else if (graphData.caminho && graphData.caminho.includes(vertexId)) {
            color = '#FFD700'; // Dourado para caminho
        }

        // Calcular tamanho e fonte baseado no número de vértices
        const nodeSize = numVertices > 15 ? Math.max(20, 40 - numVertices) : 30;
        const fontSize = numVertices > 15 ? Math.max(12, 22 - Math.floor(numVertices / 2)) : 18;

        nodesArray.push({
            id: vertexId,
            label: vertexId,
            color: { 
                background: color,
                border: '#2B7CE9',
                highlight: {
                    background: color,
                    border: '#2B7CE9'
                }
            },
            font: { 
                size: fontSize, 
                color: '#000000',
                face: 'Arial',
                strokeWidth: 2,
                strokeColor: '#FFFFFF'
            },
            shape: 'circle',
            size: nodeSize,
            margin: 10
        });
    });

    // Criar arestas do grafo
    const edgesArray = [];
    let edgeId = 0;
    
    Object.keys(graphData.vertices).forEach(from => {
        Object.keys(graphData.vertices[from].arestas).forEach(to => {
            const peso = graphData.vertices[from].arestas[to];
            if (peso > 0) { // Só mostrar arestas com peso > 0
                let color = '#848484'; // Cor padrão (cinza)
                let width = 2; // Largura padrão
                
                // Destacar arestas do caminho
                if (graphData.caminho && graphData.caminho.length > 1) {
                    for (let i = 0; i < graphData.caminho.length - 1; i++) {
                        if (graphData.caminho[i] === from && graphData.caminho[i + 1] === to) {
                            color = '#FFD700'; // Dourado para caminho
                            width = 4; // Mais espesso
                            break;
                        }
                    }
                }

                // Configurações dinâmicas para arestas baseadas no número de vértices
                const edgeFontSize = numVertices > 15 ? Math.max(10, 16 - Math.floor(numVertices / 3)) : 14;
                const arrowScale = numVertices > 15 ? 0.6 : 0.8;

                edgesArray.push({
                    id: edgeId++,
                    from: from,
                    to: to,
                    label: peso.toString(),
                    color: { 
                        color: color,
                        highlight: color
                    },
                    width: width,
                    arrows: { 
                        to: { 
                            enabled: true, 
                            scaleFactor: arrowScale,
                            type: 'arrow'
                        } 
                    },
                    font: {
                        size: edgeFontSize,
                        color: '#000000',
                        background: 'rgba(255,255,255,0.9)',
                        strokeWidth: 2,
                        strokeColor: '#FFFFFF',
                        align: 'middle'
                    },
                    smooth: {
                        enabled: numVertices > 15,
                        type: 'curvedCW',
                        roundness: 0.2
                    }
                });
            }
        });
    });

    // Para grafos grandes (16+), definir posições iniciais em grade ou spiral para evitar formato circular
    if (numVertices >= 16) {
        const gridSize = Math.ceil(Math.sqrt(numVertices));
        const spacing = Math.max(200, numVertices * 8);
        
        nodesArray.forEach((node, index) => {
            // Posicionamento em grade expandida com variação aleatória
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            
            // Adicionar variação aleatória para quebrar padrões rígidos
            const randomX = (Math.random() - 0.5) * spacing * 0.3;
            const randomY = (Math.random() - 0.5) * spacing * 0.3;
            
            node.x = (col * spacing) + randomX - (gridSize * spacing / 2);
            node.y = (row * spacing) + randomY - (gridSize * spacing / 2);
            
            // Para grafos muito grandes, usar posicionamento em espiral
            if (numVertices > 25) {
                const angle = (index / numVertices) * Math.PI * 6; // 3 voltas completas
                const radius = spacing * (1 + index / numVertices * 2);
                node.x = Math.cos(angle) * radius + randomX;
                node.y = Math.sin(angle) * radius + randomY;
            }
        });
    }

    // Criar datasets do Vis.js
    const nodes = new vis.DataSet(nodesArray);
    const edges = new vis.DataSet(edgesArray);

    const data = { nodes: nodes, edges: edges };
    
    // Sistema de layout especial para grafos com 16+ vértices (evita formato circular)
    const usarLayoutHierarquico = numVertices >= 16;
    
    // Configurações ultra-expandidas para melhor visualização das arestas
    const dynamicConfig = {
        // Distância muito maior entre nós para separar arestas
        springLength: isVeryLargeGraph ? 
            Math.max(500, numVertices * 25) : // Para grafos muito grandes, distância bem maior
            isLargeGraph ? Math.max(250, numVertices * 12) : 150,
        
        nodeSize: isLargeGraph ? Math.max(20, 45 - numVertices) : 30,
        fontSize: isLargeGraph ? Math.max(11, 19 - Math.floor(numVertices / 3)) : 18,
        edgeFontSize: isLargeGraph ? Math.max(9, 15 - Math.floor(numVertices / 4)) : 14,
        
        // Força gravitacional muito menor para espalhar mais
        gravitationalConstant: isVeryLargeGraph ? 
            -35000 - (numVertices * 800) : // Força muito baixa para espalhar ao máximo
            isLargeGraph ? -18000 - (numVertices * 300) : -8000,
        
        // Configurações adicionais para máxima separação
        centralGravity: usarLayoutHierarquico ? 0.01 : (isVeryLargeGraph ? 0.05 : 0.1), // Quase zero para layout hierárquico
        springConstant: usarLayoutHierarquico ? 0.005 : (isVeryLargeGraph ? 0.01 : 0.02), // Molas muito fracas
        avoidOverlap: usarLayoutHierarquico ? 3.0 : (isVeryLargeGraph ? 2.0 : 1.2), // Máxima evitação de sobreposição
        
        // Distância de repulsão para layout não-circular
        nodeDistance: usarLayoutHierarquico ? Math.max(300, numVertices * 20) : undefined
    };

    // Opções de visualização otimizadas para grafos grandes
    const options = {
        physics: usarLayoutHierarquico ? {
            enabled: true,
            solver: 'repulsion', // Usa repulsão para evitar formato circular
            repulsion: {
                nodeDistance: dynamicConfig.nodeDistance,
                centralGravity: dynamicConfig.centralGravity,
                springLength: dynamicConfig.springLength,
                springConstant: dynamicConfig.springConstant,
                damping: 0.15
            },
            stabilization: {
                enabled: true,
                iterations: Math.max(400, numVertices * 25),
                updateInterval: 30,
                fit: true
            },
            maxVelocity: 15, // Velocidade baixa para controle
            minVelocity: 0.3,
            timestep: 0.2
        } : { 
            enabled: true, 
            solver: 'barnesHut',
            barnesHut: {
                gravitationalConstant: dynamicConfig.gravitationalConstant,
                centralGravity: dynamicConfig.centralGravity,
                springLength: dynamicConfig.springLength,
                springConstant: dynamicConfig.springConstant,
                damping: isVeryLargeGraph ? 0.2 : 0.15, // Mais damping para estabilizar
                avoidOverlap: dynamicConfig.avoidOverlap
            },
            stabilization: {
                iterations: isVeryLargeGraph ? 500 : isLargeGraph ? 300 : 150,
                updateInterval: 20,
                fit: true // Ajustar automaticamente
            },
            maxVelocity: isVeryLargeGraph ? 20 : 30, // Velocidade menor para mais controle
            minVelocity: 0.5, // Velocidade mínima menor para melhor estabilização
            adaptiveTimestep: true // Timestep adaptativo para melhor performance
        },
        layout: usarLayoutHierarquico ? {
            randomSeed: 42, // Seed fixo para reproduzibilidade
            improvedLayout: false, // Desabilita otimizações que podem criar padrões circulares
            clusterThreshold: 150, // Evita agrupamento automático
            hierarchical: false // Força layout não-hierárquico padrão
        } : {
            randomSeed: undefined,
            improvedLayout: true
        },
        interaction: { 
            navigationButtons: true, 
            keyboard: true,
            hover: true,
            tooltipDelay: 200,
            zoomView: true,
            dragView: true
        },
        edges: {
            smooth: { 
                type: isVeryLargeGraph ? 'dynamic' : isLargeGraph ? 'straightCross' : 'continuous',
                forceDirection: isVeryLargeGraph ? 'none' : 'horizontal',
                roundness: isVeryLargeGraph ? 0.3 : isLargeGraph ? 0 : 0.1
            },
            font: {
                size: dynamicConfig.edgeFontSize,
                color: '#000000',
                background: 'rgba(255,255,255,0.9)',
                strokeWidth: 2,
                strokeColor: '#FFFFFF',
                align: 'middle'
            },
            labelHighlightBold: false,
            selectionWidth: 3,
            // Configurações especiais para grafos muito grandes
            length: isVeryLargeGraph ? 200 : undefined, // Força comprimento mínimo das arestas
            physics: isVeryLargeGraph // Habilita física individual das arestas
        },
        nodes: {
            size: dynamicConfig.nodeSize,
            font: { 
                size: dynamicConfig.fontSize,
                face: 'Arial',
                strokeWidth: 2,
                strokeColor: '#FFFFFF'
            },
            borderWidth: 2,
            shadow: {
                enabled: !isLargeGraph, // Desabilitar sombras em grafos grandes para performance
                color: 'rgba(0,0,0,0.3)',
                size: 5,
                x: 2,
                y: 2
            },
            margin: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }
        },
        configure: {
            enabled: false
        }
    };

    // Mostrar notificação se layout especial foi aplicado
    if (usarLayoutHierarquico) {
        console.log(`🔧 Layout especial aplicado para ${numVertices} vértices - evitando formato circular`);
    }

    // Inicializar a rede
    const container = document.getElementById('myNetwork');
    if (container) {
        const network = new vis.Network(container, data, options);

        // Adicionar eventos
        network.on("stabilizationIterationsDone", function () {
            network.setOptions({ physics: false });
            
            // Apenas ajustar a visualização sem zoom automático
            network.fit({
                animation: {
                    duration: 1000,
                    easingFunction: 'easeInOutQuad'
                }
            });
        });

        // Log de sucesso
        console.log('Grafo do resultado do Dijkstra visualizado com sucesso!');
        console.log(`Grafo com ${numVertices} vértices otimizado para visualização`);
        console.log('Caminho encontrado:', graphData.caminho);
        console.log('Distância total:', graphData.distancia);
        
        return network;
    } else {
        console.error('Container #myNetwork não encontrado!');
        return null;
    }
}

// Funções de zoom compatíveis
window.zoomIn = function() {
    if (networkInstance) {
        const scale = networkInstance.getScale() * 1.2;
        networkInstance.moveTo({ scale: scale });
    }
};

window.zoomOut = function() {
    if (networkInstance) {
        const scale = networkInstance.getScale() * 0.8;
        networkInstance.moveTo({ scale: scale });
    }
};

window.fitGraph = function() {
    if (networkInstance) {
        networkInstance.fit();
    }
};

// Inicialização quando o documento carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO GRAFO AVANÇADO ===');
    
    // Verificar se os dados estão disponíveis
    if (typeof window.verticesData === 'undefined') {
        console.error('Dados dos vértices não encontrados');
        return;
    }

    // Verificar se Vis.js está carregado
    if (typeof vis === 'undefined') {
        console.error('Vis.js não foi carregado');
        return;
    }

    try {
        // Preparar dados no formato esperado pela função
        const graphData = {
            vertices: window.verticesData,
            caminho: window.caminhoData,
            pontoPartida: window.pontoPartida,
            pontoDestino: window.pontoDestino,
            distancia: window.distanciaTotal
        };
        
        console.log('Dados preparados:', graphData);
        
        // Usar a função avançada de criação do grafo
        const network = inicializarGrafoResultado(graphData);
        
        networkInstance = network; // Armazenar globalmente
        
        if (network) {
            console.log('Grafo avançado criado com sucesso!');
        }
        
    } catch (error) {
        console.error('Erro ao inicializar o grafo:', error);
        console.error('Stack trace:', error.stack);
        
        const container = document.getElementById('myNetwork');
        if (container) {
            container.innerHTML = `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    height: 100%; 
                    color: #ffffff;
                    font-size: 16px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                        <p>Erro ao carregar o grafo</p>
                        <p style="font-size: 12px;">${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
});

// Função auxiliar para validar se o Vis.js está carregado
function validarVisJs() {
    if (typeof vis === 'undefined') {
        console.error('Vis.js não foi carregado corretamente. Verifique se o CDN está acessível.');
        return false;
    }
    return true;
}
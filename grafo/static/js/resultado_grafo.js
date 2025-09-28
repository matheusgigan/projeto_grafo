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
        const numVertices = Object.keys(graphData.vertices).length;
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
                const numVertices = Object.keys(graphData.vertices).length;
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
        layout: {
            improvedLayout: true,
            clusterThreshold: 150,
            hierarchical: false
        },
        configure: {
            enabled: false
        }
    };

    // Mostrar notificação se layout especial foi aplicado
    if (usarLayoutHierarquico) {
        console.log(`🔧 Layout especial aplicado para ${numVertices} vértices - evitando formato circular`);
        
        // Atualizar dica de informação
        const infoBox = document.getElementById('grafo-info-box');
        if (infoBox) {
            const layoutInfo = document.createElement('div');
            layoutInfo.style.cssText = 'margin-top: 8px; padding: 6px 10px; background: #e3f2fd; border-left: 3px solid #2196f3; font-size: 12px; border-radius: 4px;';
            layoutInfo.innerHTML = `<strong>🔧 Layout Expandido:</strong> Aplicado automaticamente para ${numVertices} vértices (evita formato circular)`;
            infoBox.appendChild(layoutInfo);
        }
    }

    // Inicializar a rede
    const container = document.getElementById('myNetwork');
    if (container) {
        const network = new vis.Network(container, data, options);

        // Adicionar eventos
        network.on("stabilizationIterationsDone", function () {
            network.setOptions({ physics: false });
            
            // Ajustar zoom baseado no número de vértices
            const numVertices = Object.keys(graphData.vertices).length;
            if (numVertices > 15) {
                // Para grafos muito grandes, zoom bem pequeno para ver toda a expansão
                const scale = Math.max(0.15, 0.8 - (numVertices / 30));
                network.moveTo({
                    scale: scale,
                    animation: {
                        duration: 1500,
                        easingFunction: 'easeInOutQuad'
                    }
                });
                
                // Informar o usuário sobre a expansão
                console.log(`Grafo expandido para máxima separação das arestas (zoom: ${(scale * 100).toFixed(0)}%)`);
            } else if (numVertices > 10) {
                // Para grafos médios, zoom moderado
                const scale = Math.max(0.4, 1 - (numVertices / 50));
                network.moveTo({
                    scale: scale,
                    animation: {
                        duration: 1000,
                        easingFunction: 'easeInOutQuad'
                    }
                });
            }
        });

        // Adicionar controles de zoom personalizados para grafos grandes
        const numVertices = Object.keys(graphData.vertices).length;
        if (numVertices > 15) {
            network.on("afterDrawing", function (ctx) {
                // Adicionar instruções de uso para grafos grandes
                ctx.save();
                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.fillText('Use a roda do mouse para zoom, arraste para mover', 10, container.offsetHeight - 10);
                ctx.restore();
            });
        }

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

// Função auxiliar para destacar o caminho após a renderização
function destacarCaminho(network, caminho) {
    if (!network || !caminho || caminho.length < 2) return;
    
    // Aguardar um pouco para o grafo estabilizar
    setTimeout(() => {
        criarSobreposicaoCaminho(network, caminho);
    }, 1500);
    
    console.log(`Caminho destacado: ${caminho.join(' → ')}`);
}

// Função para criar sobreposição visual do caminho
function criarSobreposicaoCaminho(network, caminho) {
    if (!network || !caminho || caminho.length < 2) return;
    
    const container = document.getElementById('myNetwork');
    const overlay = document.getElementById('caminho-overlay');
    const pathContainer = document.getElementById('caminho-path');
    const labelsContainer = document.getElementById('peso-labels');
    
    if (!container || !overlay || !pathContainer || !labelsContainer) return;
    
    // Limpar sobreposições anteriores
    pathContainer.innerHTML = '';
    labelsContainer.innerHTML = '';
    
    // Obter posições dos nós no grafo
    const positions = network.getPositions();
    const scale = network.getScale();
    const viewPosition = network.getViewPosition();
    
    // Criar indicadores de nós do caminho
    caminho.forEach((nodeId, index) => {
        if (!positions[nodeId]) return;
        
        const nodePos = positions[nodeId];
        const screenPos = network.canvasToDOM({
            x: nodePos.x,
            y: nodePos.y
        });
        
        // Criar indicador do nó
        const nodeIndicator = document.createElement('div');
        nodeIndicator.className = 'node-indicator';
        nodeIndicator.style.left = screenPos.x + 'px';
        nodeIndicator.style.top = screenPos.y + 'px';
        nodeIndicator.style.animationDelay = (index * 0.2) + 's';
        pathContainer.appendChild(nodeIndicator);
    });
    
    // Criar linhas e labels entre nós consecutivos do caminho
    for (let i = 0; i < caminho.length - 1; i++) {
        const fromNode = caminho[i];
        const toNode = caminho[i + 1];
        
        if (!positions[fromNode] || !positions[toNode]) continue;
        
        const fromPos = network.canvasToDOM({
            x: positions[fromNode].x,
            y: positions[fromNode].y
        });
        const toPos = network.canvasToDOM({
            x: positions[toNode].x,
            y: positions[toNode].y
        });
        
        // Calcular ângulo e distância
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Criar linha do caminho
        const pathLine = document.createElement('div');
        pathLine.className = 'path-line';
        pathLine.style.left = fromPos.x + 'px';
        pathLine.style.top = fromPos.y + 'px';
        pathLine.style.width = distance + 'px';
        pathLine.style.transform = `rotate(${angle}deg)`;
        pathLine.style.animationDelay = (i * 0.3) + 's';
        pathContainer.appendChild(pathLine);
        
        // Obter peso da aresta
        const peso = window.verticesData && window.verticesData[fromNode] && 
                   window.verticesData[fromNode].arestas ? 
                   window.verticesData[fromNode].arestas[toNode] : '?';
        
        // Criar label do peso no meio da linha
        const midX = fromPos.x + (dx / 2);
        const midY = fromPos.y + (dy / 2);
        
        const pesoLabel = document.createElement('div');
        pesoLabel.className = 'peso-label';
        pesoLabel.textContent = peso;
        pesoLabel.style.left = midX + 'px';
        pesoLabel.style.top = midY + 'px';
        pesoLabel.style.animationDelay = (i * 0.3 + 0.5) + 's';
        labelsContainer.appendChild(pesoLabel);
    }
    
    // Atualizar posições quando o grafo for movido/zoom
    network.on('zoom', () => atualizarSobreposicao(network, caminho));
    network.on('dragEnd', () => atualizarSobreposicao(network, caminho));
}

// Função para atualizar posições da sobreposição
function atualizarSobreposicao(network, caminho) {
    if (!network || !caminho) return;
    
    // Recriar sobreposição com novas posições
    setTimeout(() => {
        criarSobreposicaoCaminho(network, caminho);
    }, 100);
}
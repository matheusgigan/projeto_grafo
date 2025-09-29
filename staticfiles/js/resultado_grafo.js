// Script responsivo para visualização do grafo no resultado do Dijkstra

function inicializarGrafoResultado(graphData) {
    // Detectar tamanho da tela e dispositivo
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const isDesktop = window.innerWidth > 1024;
    
    // Calcular configurações baseadas no número de vértices e tamanho da tela
    const numVertices = Object.keys(graphData.vertices).length;
    const isLargeGraph = numVertices > 10;
    const isVeryLargeGraph = numVertices > 15;
    
    // Configurações responsivas baseadas no dispositivo
    const deviceConfig = {
        mobile: {
            nodeSize: isVeryLargeGraph ? Math.max(15, 25 - numVertices * 0.5) : isLargeGraph ? 20 : 25,
            fontSize: isVeryLargeGraph ? Math.max(8, 14 - numVertices * 0.3) : isLargeGraph ? 12 : 14,
            edgeFontSize: isVeryLargeGraph ? Math.max(7, 11 - numVertices * 0.2) : isLargeGraph ? 9 : 11,
            springLength: isVeryLargeGraph ? Math.max(150, numVertices * 8) : isLargeGraph ? 120 : 100,
            containerHeight: Math.min(window.innerHeight * 0.6, 400)
        },
        tablet: {
            nodeSize: isVeryLargeGraph ? Math.max(18, 30 - numVertices * 0.4) : isLargeGraph ? 25 : 30,
            fontSize: isVeryLargeGraph ? Math.max(10, 16 - numVertices * 0.25) : isLargeGraph ? 14 : 16,
            edgeFontSize: isVeryLargeGraph ? Math.max(8, 12 - numVertices * 0.15) : isLargeGraph ? 10 : 12,
            springLength: isVeryLargeGraph ? Math.max(200, numVertices * 12) : isLargeGraph ? 150 : 120,
            containerHeight: Math.min(window.innerHeight * 0.7, 500)
        },
        desktop: {
            nodeSize: isVeryLargeGraph ? Math.max(20, 35 - numVertices * 0.3) : isLargeGraph ? 30 : 35,
            fontSize: isVeryLargeGraph ? Math.max(11, 18 - numVertices * 0.2) : isLargeGraph ? 16 : 18,
            edgeFontSize: isVeryLargeGraph ? Math.max(9, 14 - numVertices * 0.1) : isLargeGraph ? 12 : 14,
            springLength: isVeryLargeGraph ? Math.max(300, numVertices * 20) : isLargeGraph ? 200 : 150,
            containerHeight: Math.min(window.innerHeight * 0.8, 600)
        }
    };
    
    // Selecionar configuração apropriada
    const config = isMobile ? deviceConfig.mobile : isTablet ? deviceConfig.tablet : deviceConfig.desktop;
    
    // Ajustar altura do container responsivamente
    const container = document.getElementById('myNetwork');
    if (container) {
        container.style.height = config.containerHeight + 'px';
        container.style.width = '100%';
        container.style.maxWidth = '100%';
        container.style.overflow = 'hidden';
    }
    
    // Criar nós do grafo com configurações responsivas
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
                size: config.fontSize, 
                color: '#000000',
                face: 'Arial',
                strokeWidth: isMobile ? 1 : 2,
                strokeColor: '#FFFFFF'
            },
            shape: 'circle',
            size: config.nodeSize,
            margin: isMobile ? 5 : 10
        });
    });

    // Criar arestas do grafo com configurações responsivas
    const edgesArray = [];
    let edgeId = 0;
    
    Object.keys(graphData.vertices).forEach(from => {
        Object.keys(graphData.vertices[from].arestas).forEach(to => {
            const peso = graphData.vertices[from].arestas[to];
            if (peso > 0) { // Só mostrar arestas com peso > 0
                let color = '#848484'; // Cor padrão (cinza)
                let width = isMobile ? 1 : 2; // Largura padrão responsiva
                
                // Destacar arestas do caminho
                if (graphData.caminho && graphData.caminho.length > 1) {
                    for (let i = 0; i < graphData.caminho.length - 1; i++) {
                        if (graphData.caminho[i] === from && graphData.caminho[i + 1] === to) {
                            color = '#FFD700'; // Dourado para caminho
                            width = isMobile ? 2 : 4; // Mais espesso
                            break;
                        }
                    }
                }

                const arrowScale = isMobile ? 0.5 : isTablet ? 0.6 : 0.8;

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
                        size: config.edgeFontSize,
                        color: '#000000',
                        background: 'rgba(255,255,255,0.9)',
                        strokeWidth: isMobile ? 1 : 2,
                        strokeColor: '#FFFFFF',
                        align: 'middle'
                    },
                    smooth: {
                        enabled: numVertices > 10,
                        type: isMobile ? 'dynamic' : isTablet ? 'straightCross' : 'curvedCW',
                        roundness: isMobile ? 0.1 : 0.2
                    }
                });
            }
        });
    });

    // Posicionamento responsivo para grafos grandes
    if (numVertices >= 16) {
        const gridSize = Math.ceil(Math.sqrt(numVertices));
        const spacing = isMobile ? Math.max(100, numVertices * 4) : 
                       isTablet ? Math.max(150, numVertices * 6) : 
                       Math.max(200, numVertices * 8);
        
        nodesArray.forEach((node, index) => {
            if (isMobile && numVertices > 20) {
                // Para mobile com muitos vértices, usar layout em espiral compacta
                const angle = (index / numVertices) * Math.PI * 4;
                const radius = spacing * (0.5 + index / numVertices);
                node.x = Math.cos(angle) * radius;
                node.y = Math.sin(angle) * radius;
            } else {
                // Layout em grade com variação aleatória
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                
                const randomX = (Math.random() - 0.5) * spacing * 0.2;
                const randomY = (Math.random() - 0.5) * spacing * 0.2;
                
                node.x = (col * spacing) + randomX - (gridSize * spacing / 2);
                node.y = (row * spacing) + randomY - (gridSize * spacing / 2);
            }
        });
    }

    // Criar datasets do Vis.js
    const nodes = new vis.DataSet(nodesArray);
    const edges = new vis.DataSet(edgesArray);
    const data = { nodes: nodes, edges: edges };
    
    // Configurações de física responsivas
    const physicsConfig = {
        enabled: true,
        solver: numVertices >= 16 ? 'repulsion' : 'barnesHut',
        stabilization: {
            enabled: true,
            iterations: isMobile ? Math.min(200, numVertices * 8) : 
                       isTablet ? Math.min(300, numVertices * 12) : 
                       Math.min(500, numVertices * 20),
            updateInterval: isMobile ? 50 : 30,
            fit: true
        },
        maxVelocity: isMobile ? 10 : 20,
        minVelocity: 0.5,
        timestep: isMobile ? 0.3 : 0.2
    };

    // Configurar parâmetros específicos do solver
    if (numVertices >= 16) {
        physicsConfig.repulsion = {
            nodeDistance: config.springLength * 1.5,
            centralGravity: 0.01,
            springLength: config.springLength,
            springConstant: 0.005,
            damping: 0.15
        };
    } else {
        physicsConfig.barnesHut = {
            gravitationalConstant: isMobile ? -5000 : isTablet ? -8000 : -12000,
            centralGravity: 0.1,
            springLength: config.springLength,
            springConstant: 0.02,
            damping: 0.15,
            avoidOverlap: isMobile ? 0.8 : 1.2
        };
    }

    // Opções de visualização responsivas
    const options = {
        physics: physicsConfig,
        interaction: { 
            navigationButtons: !isMobile, // Ocultar botões de navegação no mobile
            keyboard: !isMobile,
            hover: true,
            tooltipDelay: isMobile ? 500 : 200,
            zoomView: true,
            dragView: true,
            multiselect: false,
            selectConnectedEdges: false
        },
        edges: {
            smooth: { 
                type: isMobile ? 'dynamic' : isTablet ? 'straightCross' : 'continuous',
                forceDirection: 'none',
                roundness: isMobile ? 0.1 : 0.2
            },
            font: {
                size: config.edgeFontSize,
                color: '#000000',
                background: 'rgba(255,255,255,0.9)',
                strokeWidth: isMobile ? 1 : 2,
                strokeColor: '#FFFFFF',
                align: 'middle'
            },
            labelHighlightBold: false,
            selectionWidth: isMobile ? 2 : 3
        },
        nodes: {
            size: config.nodeSize,
            font: { 
                size: config.fontSize,
                face: 'Arial',
                strokeWidth: isMobile ? 1 : 2,
                strokeColor: '#FFFFFF'
            },
            borderWidth: isMobile ? 1 : 2,
            shadow: {
                enabled: !isMobile && !isLargeGraph, // Desabilitar sombras no mobile e grafos grandes
                color: 'rgba(0,0,0,0.3)',
                size: 3,
                x: 1,
                y: 1
            },
            margin: {
                top: isMobile ? 5 : 10,
                right: isMobile ? 5 : 10,
                bottom: isMobile ? 5 : 10,
                left: isMobile ? 5 : 10
            }
        },
        layout: {
            improvedLayout: !isMobile, // Desabilitar layout melhorado no mobile para performance
            clusterThreshold: isMobile ? 50 : 150,
            hierarchical: false
        },
        configure: {
            enabled: false
        }
    };

    // Inicializar a rede
    const networkContainer = document.getElementById('myNetwork');
    if (networkContainer) {
        const network = new vis.Network(networkContainer, data, options);

        // Configurações pós-inicialização responsivas
        network.on("stabilizationIterationsDone", function () {
            network.setOptions({ physics: false });
            
            // Zoom responsivo baseado no dispositivo e número de vértices
            let scale;
            if (isMobile) {
                scale = numVertices > 20 ? 0.1 : numVertices > 15 ? 0.2 : numVertices > 10 ? 0.4 : 0.6;
            } else if (isTablet) {
                scale = numVertices > 20 ? 0.15 : numVertices > 15 ? 0.3 : numVertices > 10 ? 0.5 : 0.7;
            } else {
                scale = numVertices > 20 ? 0.2 : numVertices > 15 ? 0.4 : numVertices > 10 ? 0.6 : 0.8;
            }
            
            network.moveTo({
                scale: scale,
                animation: {
                    duration: isMobile ? 800 : 1200,
                    easingFunction: 'easeInOutQuad'
                }
            });
        });

        // Eventos responsivos
        if (isMobile) {
            // Para mobile, adicionar gestos touch melhorados
            let lastTouchEnd = 0;
            networkContainer.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                    // Duplo toque para centralizar
                    network.fit({
                        animation: {
                            duration: 500,
                            easingFunction: 'easeInOutQuad'
                        }
                    });
                }
                lastTouchEnd = now;
            }, false);
        }

        // Redimensionamento responsivo
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                
                // Reajustar altura do container
                if (newWidth <= 768) {
                    networkContainer.style.height = Math.min(newHeight * 0.6, 400) + 'px';
                } else if (newWidth <= 1024) {
                    networkContainer.style.height = Math.min(newHeight * 0.7, 500) + 'px';
                } else {
                    networkContainer.style.height = Math.min(newHeight * 0.8, 600) + 'px';
                }
                
                // Redimensionar rede
                network.setSize(networkContainer.clientWidth + 'px', networkContainer.style.height);
                network.redraw();
                
                // Reajustar zoom se necessário
                const currentScale = network.getScale();
                if (newWidth <= 768 && currentScale > 0.6) {
                    network.moveTo({ scale: 0.4 });
                }
            }, 250);
        });

        console.log(`Grafo responsivo inicializado: ${numVertices} vértices, ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}`);
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

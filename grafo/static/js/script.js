// Função para criar o grafo baseado na matriz de adjacência real
function criarGrafoComMatriz(vertices, matriz, origem, destino, caminho, distancia) {
    console.log('Criando grafo com dados reais:', {vertices, matriz, origem, destino, caminho, distancia});
    
    // 1. Criar nós baseados nos vértices reais
    const nodesDataArray = [];
    for (let i = 0; i < vertices.length; i++) {
        const vertice = vertices[i];
        let cor = '#4a90e2'; // Cor padrão azul
        
        // Destacar origem e destino
        if (vertice === origem) {
            cor = '#4caf50'; // Verde para origem
        } else if (vertice === destino) {
            cor = '#f44336'; // Vermelho para destino
        } else if (caminho && caminho.includes(vertice)) {
            cor = '#ff9800'; // Laranja para caminho
        }
        
        nodesDataArray.push({
            id: vertice,
            label: vertice,
            color: {
                background: cor,
                border: '#2c3e50',
                highlight: {
                    background: '#ffd700',
                    border: '#ff6b00'
                }
            },
            font: { 
                size: 20, 
                color: '#ffffff',
                face: 'Arial Black'
            },
            size: 25,
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.5)',
                size: 10,
                x: 3,
                y: 3
            }
        });
    }
    
    // 2. Criar arestas baseadas na matriz de adjacência
    const edgesDataArray = [];
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const peso = matriz[i][j];
            if (peso > 0 && i !== j) { // Só criar aresta se houver peso e não for diagonal
                const from = vertices[i];
                const to = vertices[j];
                const edgeId = `${from}-${to}`;
                
                // Verificar se a aresta está no caminho
                let corAresta = '#7f8c8d'; // Cor padrão cinza
                let largura = 2;
                
                if (caminho && caminho.length > 1) {
                    const fromIndex = caminho.indexOf(from);
                    const toIndex = caminho.indexOf(to);
                    if (fromIndex !== -1 && toIndex !== -1 && Math.abs(fromIndex - toIndex) === 1) {
                        corAresta = '#ffd700'; // Dourado para caminho
                        largura = 6;
                    }
                }
                
                edgesDataArray.push({
                    id: edgeId,
                    from: from,
                    to: to,
                    label: peso.toString(),
                    value: peso,
                    color: {
                        color: corAresta,
                        highlight: '#ff6b00'
                    },
                    width: largura,
                    font: {
                        size: 14,
                        color: '#ffffff',
                        background: 'rgba(0,0,0,0.7)',
                        strokeWidth: 2,
                        strokeColor: '#000000'
                    },
                    smooth: {
                        enabled: true,
                        type: 'continuous',
                        roundness: 0.2
                    },
                    shadow: {
                        enabled: true,
                        color: 'rgba(0,0,0,0.3)',
                        size: 5,
                        x: 2,
                        y: 2
                    }
                });
            }
        }
    }
    
    // 3. Criar DataSets do Vis.js
    const nodes = new vis.DataSet(nodesDataArray);
    const edges = new vis.DataSet(edgesDataArray);
    const data = { nodes: nodes, edges: edges };
    
    // 4. Configurações do grafo
    const options = {
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                gravitationalConstant: -50,
                centralGravity: 0.01,
                springLength: 200,
                springConstant: 0.08,
                damping: 0.4,
                avoidOverlap: 1
            },
            maxVelocity: 50,
            minVelocity: 0.75,
            timestep: 0.35,
            stabilization: {
                enabled: true,
                iterations: 150,
                updateInterval: 25
            }
        },
        interaction: {
            navigationButtons: false,
            keyboard: true,
            zoomView: true,
            dragView: true,
            hover: true,
            selectConnectedEdges: false,
            tooltipDelay: 300
        },
        layout: {
            improvedLayout: true,
            randomSeed: 42
        },
        edges: {
            arrows: {
                to: {
                    enabled: false
                }
            },
            chosen: {
                edge: function(values, id, selected, hovering) {
                    values.color = '#ff6b00';
                    values.width = values.width * 1.5;
                }
            }
        },
        nodes: {
            chosen: {
                node: function(values, id, selected, hovering) {
                    values.color = '#ffd700';
                    values.size = values.size * 1.2;
                }
            }
        }
    };
    
    // 5. Criar e renderizar o grafo
    const container = document.getElementById('myNetwork');
    if (container) {
        const network = new vis.Network(container, data, options);
        
        // Adicionar controles de zoom
        adicionarControlesZoom(network);
        
        // Centralizar o grafo após estabilização
        network.once('stabilizationIterationsDone', function() {
            network.fit({
                animation: {
                    duration: 1000,
                    easingFunction: 'easeInOutQuad'
                }
            });
        });
        
        console.log('Grafo criado com sucesso!');
        return network;
    } else {
        console.error('Container do grafo não encontrado!');
        return null;
    }
}

// Função para adicionar controles de zoom
function adicionarControlesZoom(network) {
    const container = document.getElementById('myNetwork');
    if (!container) return;
    
    // Criar controles se não existirem
    let zoomControls = container.querySelector('.zoom-controls');
    if (!zoomControls) {
        zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.innerHTML = `
            <button class="zoom-btn" onclick="zoomIn()">+</button>
            <button class="zoom-btn" onclick="zoomOut()">-</button>
            <button class="zoom-btn" onclick="resetZoom()">⌂</button>
        `;
        container.appendChild(zoomControls);
    }
    
    // Funções globais de zoom
    window.zoomIn = function() {
        const scale = network.getScale();
        network.moveTo({ scale: scale * 1.2 });
    };
    
    window.zoomOut = function() {
        const scale = network.getScale();
        network.moveTo({ scale: scale * 0.8 });
    };
    
    window.resetZoom = function() {
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });
    };
}

// Função legacy para compatibilidade
console.log('Scripts básicos do projeto grafo carregados.');

function mostrarMensagem(mensagem, tipo = 'info') {
    console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
}
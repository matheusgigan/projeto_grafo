let networkInstance = null;

// Função simples para criar o grafo
function criarGrafoSimples(vertices, matriz, origem, destino, caminho) {
    console.log('Criando grafo simples:', {vertices, origem, destino, caminho});
    
    // 1. Criar nós
    const nodesDataArray = [];
    for (let i = 0; i < vertices.length; i++) {
        const vertice = vertices[i];
        let cor = '#4a90e2'; // Azul padrão
        
        if (vertice === origem) {
            cor = '#4caf50'; // Verde para origem
        } else if (vertice === destino) {
            cor = '#f44336'; // Vermelho para destino
        } else if (caminho && caminho.includes(vertice)) {
            cor = '#ff9800'; // Laranja para vértices do caminho
        }
        
        nodesDataArray.push({
            id: vertice,
            label: vertice,
            color: {
                background: cor,
                border: '#ffffff'
            },
            font: { 
                size: 18, 
                color: '#ffffff',
                face: 'Arial'
            },
            size: 30
        });
    }
    
    // 2. Criar arestas
    const edgesDataArray = [];
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const peso = matriz[i][j];
            if (peso > 0 && i !== j) {
                const from = vertices[i];
                const to = vertices[j];
                
                // Verificar se faz parte do caminho mínimo
                let corAresta = '#7f8c8d';
                let largura = 2;
                
                if (caminho && caminho.length > 1) {
                    const fromIndex = caminho.indexOf(from);
                    const toIndex = caminho.indexOf(to);
                    if (fromIndex !== -1 && toIndex !== -1 && Math.abs(fromIndex - toIndex) === 1) {
                        corAresta = '#ffd700'; // Dourado para caminho mínimo
                        largura = 5;
                    }
                }
                
                edgesDataArray.push({
                    from: from,
                    to: to,
                    label: peso.toString(),
                    color: {
                        color: corAresta,
                        highlight: '#ff6b00'
                    },
                    width: largura,
                    arrows: {
                        to: {
                            enabled: true,
                            scaleFactor: 1,
                            type: 'arrow'
                        }
                    },
                    font: {
                        size: 14,
                        color: '#ffffff',
                        background: 'rgba(0,0,0,0.8)',
                        strokeWidth: 2,
                        strokeColor: '#000000'
                    },
                    smooth: {
                        enabled: true,
                        type: 'continuous',
                        roundness: 0.2
                    }
                });
            }
        }
    }
    
    // 3. Configurar o grafo
    const nodes = new vis.DataSet(nodesDataArray);
    const edges = new vis.DataSet(edgesDataArray);
    const data = { nodes: nodes, edges: edges };
    
    const options = {
        physics: {
            enabled: true,
            solver: 'barnesHut',
            barnesHut: {
                gravitationalConstant: -8000,
                centralGravity: 0.3,
                springLength: 200,
                springConstant: 0.04,
                damping: 0.09
            },
            stabilization: {iterations: 100}
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
            hover: true
        },
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 1
                }
            },
            smooth: {
                type: 'continuous',
                roundness: 0.2
            },
            font: {
                size: 14,
                strokeWidth: 2,
                strokeColor: '#000000'
            }
        },
        nodes: {
            font: {
                size: 18,
                strokeWidth: 2,
                strokeColor: '#000000'
            }
        }
    };
    
    // 4. Criar o grafo
    const container = document.getElementById('myNetwork');
    if (container) {
        const network = new vis.Network(container, data, options);
        
        // Ajustar visualização após carregar
        network.once('stabilizationIterationsDone', function() {
            network.fit();
        });
        
        return network;
    }
    return null;
}

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

document.addEventListener('DOMContentLoaded', function() {
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
        // Converter dados para o formato esperado
        const vertices = Object.keys(window.verticesData);
        const matriz = [];
        
        // Criar matriz de adjacência a partir dos dados
        for (let i = 0; i < vertices.length; i++) {
            matriz[i] = [];
            for (let j = 0; j < vertices.length; j++) {
                const verticeI = vertices[i];
                const verticeJ = vertices[j];
                if (window.verticesData[verticeI] && window.verticesData[verticeI][verticeJ] !== undefined) {
                    matriz[i][j] = window.verticesData[verticeI][verticeJ];
                } else {
                    matriz[i][j] = 0;
                }
            }
        }
        
        // Usar a função simples de criação do grafo
        const network = criarGrafoSimples(
            vertices,
            matriz,
            window.pontoPartida,
            window.pontoDestino,
            window.caminhoData
        );
        
        networkInstance = network; // Armazenar globalmente
        
        if (network) {
            console.log('Grafo criado com sucesso! Interativo e com menor caminho destacado.');
        }
        
    } catch (error) {
        console.error('Erro ao inicializar o grafo:', error);
        
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
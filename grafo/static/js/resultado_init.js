let networkInstance = null;

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
        networkInstance.fit({
            animation: {
                duration: 1000,
                easingFunction: 'easeInOutQuad'
            }
        });
    }
};

window.toggleOverlay = function() {
    const overlay = document.getElementById('caminho-overlay');
    if (overlay) {
        overlay.classList.toggle('hidden');
        
        const btn = document.querySelector('[onclick="toggleOverlay()"]');
        if (btn) {
            const isHidden = overlay.classList.contains('hidden');
            btn.title = isHidden ? 'Mostrar Sobreposição' : 'Ocultar Sobreposição';
            btn.style.opacity = isHidden ? '0.6' : '1';
        }
    }
};

let isUltraExpanded = true; // Começa expandido por padrão

// Função para alternar entre layout normal e ultra-expandido
window.toggleExpansion = function() {
    if (!networkInstance) return;
    
    const numVertices = Object.keys(window.verticesData || {}).length;
    const btn = document.querySelector('[onclick="toggleExpansion()"]');
    
    // Alternar estado
    isUltraExpanded = !isUltraExpanded;
    
    // Determinar se deve usar layout hierárquico (repulsão) para grafos grandes
    const usarLayoutHierarquico = numVertices >= 16;
    
    // Aplicar novas configurações de física
    const newOptions = usarLayoutHierarquico ? {
        physics: {
            solver: 'repulsion',
            repulsion: {
                nodeDistance: isUltraExpanded ? 
                    Math.max(500, numVertices * 30) : 
                    Math.max(300, numVertices * 20),
                centralGravity: isUltraExpanded ? 0.005 : 0.01,
                springLength: isUltraExpanded ? 
                    Math.max(600, numVertices * 35) : 
                    Math.max(400, numVertices * 25),
                springConstant: isUltraExpanded ? 0.002 : 0.005,
                damping: 0.15
            }
        }
    } : {
        physics: {
            barnesHut: {
                springLength: isUltraExpanded ? 
                    Math.max(400, numVertices * 20) : 
                    Math.max(150, numVertices * 8),
                gravitationalConstant: isUltraExpanded ? 
                    -25000 - (numVertices * 500) : 
                    -15000 - (numVertices * 200),
                centralGravity: isUltraExpanded ? 0.05 : 0.15,
                springConstant: isUltraExpanded ? 0.01 : 0.03,
                avoidOverlap: isUltraExpanded ? 2.0 : 1.2
            }
        }
    };
    
    // Reabilitar física temporariamente para aplicar mudanças
    networkInstance.setOptions({
        physics: { enabled: true, ...newOptions.physics }
    });
    
    // Aguardar estabilização e desabilitar física novamente
    setTimeout(() => {
        networkInstance.setOptions({ physics: { enabled: false } });
        
        // Ajustar zoom automaticamente
        const scale = isUltraExpanded ? 
            Math.max(0.15, 0.8 - (numVertices / 30)) : 
            Math.max(0.4, 1 - (numVertices / 40));
            
        networkInstance.moveTo({
            scale: scale,
            animation: {
                duration: 1000,
                easingFunction: 'easeInOutQuad'
            }
        });
        
    }, 2000);
    
    // Atualizar botão e indicador
    const indicator = document.getElementById('expansion-indicator');
    
    if (btn) {
        btn.title = isUltraExpanded ? 'Layout Normal' : 'Layout Ultra-Expandido';
        
        if (isUltraExpanded) {
            btn.classList.add('expansion-active');
            btn.textContent = '⚡';
        } else {
            btn.classList.remove('expansion-active');
            btn.textContent = '🔥';
        }
    }
    
    // Mostrar/ocultar indicador
    if (indicator) {
        indicator.style.display = isUltraExpanded ? 'block' : 'none';
        indicator.textContent = isUltraExpanded ? 
            '⚡ ULTRA-EXPANDIDO' : 
            '🔥 NORMAL';
    }
    
    // Log para o usuário
    console.log(isUltraExpanded ? 
        'Layout ultra-expandido ativado - máxima separação das arestas!' : 
        'Layout normal ativado - visualização compacta!'
    );
};

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se os dados estão disponíveis
    if (typeof window.verticesData === 'undefined') {
        console.error('Dados dos vértices não encontrados');
        return;
    }

    try {
        const graphData = {
            vertices: window.verticesData,
            caminho: window.caminhoData || [],
            pontoPartida: window.pontoPartida || '',
            pontoDestino: window.pontoDestino || '',
            distancia: window.distanciaTotal || 0
        };
        
        console.log('Inicializando grafo com dados:', graphData);
        
        const network = inicializarGrafoResultado(graphData);
        networkInstance = network; // Armazenar globalmente para controles de zoom
        
        if (network && graphData.caminho && graphData.caminho.length > 0) {
            destacarCaminho(network, graphData.caminho);
            console.log(`Grafo inicializado com sucesso! Caminho: ${graphData.caminho.join(' → ')}`);
            
            // Mostrar controle de sobreposição
            const overlayBtn = document.querySelector('[onclick="toggleOverlay()"]');
            if (overlayBtn) {
                overlayBtn.style.display = 'flex';
            }
        } else {
            console.log('Grafo inicializado, mas nenhum caminho encontrado.');
            
            // Ocultar overlay se não há caminho
            const overlay = document.getElementById('caminho-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
        
        // Configurar interface baseada no tamanho do grafo
        const numVertices = Object.keys(graphData.vertices).length;
        const container = document.getElementById('myNetwork');
        const infoBox = document.getElementById('grafo-info-box');
        const zoomControls = document.getElementById('zoom-controls');
        const expansionIndicator = document.getElementById('expansion-indicator');
        
        if (numVertices > 20) {
            // Grafos muito grandes - ultra-expandidos
            container.classList.add('very-large-graph');
            if (infoBox) {
                infoBox.classList.add('large-graph');
                infoBox.innerHTML = `<strong>Grafo Ultra-Expandido (${numVertices} vértices):</strong> 
                    Arestas separadas ao máximo para visualização individual. 
                    Use o botão ⚡ para alternar entre layouts expandido/normal.`;
            }
            if (expansionIndicator) {
                expansionIndicator.style.display = 'block';
            }
        } else if (numVertices > 15) {
            // Grafos grandes - expandidos
            container.classList.add('large-graph');
            if (infoBox) {
                infoBox.classList.add('large-graph');
                infoBox.innerHTML = `<strong>Grafo Expandido (${numVertices} vértices):</strong> 
                    Layout otimizado para separar todas as arestas. 
                    Use o botão ⚡ para alternar expansão.`;
            }
            if (expansionIndicator) {
                expansionIndicator.style.display = 'block';
            }
        } else if (numVertices > 10) {
            // Grafos médios
            container.classList.add('large-graph');
            if (infoBox) {
                infoBox.innerHTML = `<strong>Grafo Médio (${numVertices} vértices):</strong> 
                    Use os controles de zoom e o botão ⚡ para alternar layout.`;
            }
        } else {
            // Grafos pequenos
            if (infoBox) {
                infoBox.innerHTML = `<strong>Dica:</strong> Use a roda do mouse para zoom e os controles disponíveis.`;
            }
        }
        
        // Sempre mostrar controles quando há um grafo carregado
        if (zoomControls) {
            zoomControls.style.display = 'flex';
        }
        
        // Adicionar evento para redimensionar o grafo quando a janela for redimensionada
        window.addEventListener('resize', function() {
            if (network) {
                network.redraw();
            }
        });
        
    } catch (error) {
        console.error('Erro ao inicializar o grafo:', error);
        
        // Mostrar mensagem de erro amigável para o usuário
        const container = document.getElementById('myNetwork');
        if (container) {
            container.innerHTML = `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    height: 100%; 
                    background-color: #f8f9fa; 
                    border-radius: 8px;
                    color: #6c757d;
                    font-size: 16px;
                ">
                    <div style="text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
                        <p>Erro ao carregar a visualização do grafo.</p>
                        <p style="font-size: 14px;">Verifique o console para mais detalhes.</p>
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

// Função para exibir informações de debug (opcional)
function mostrarInfoDebug() {
    if (window.location.search.includes('debug=true')) {
        console.log('=== DEBUG INFO ===');
        console.log('Vértices:', window.verticesData);
        console.log('Caminho:', window.caminhoData);
        console.log('Ponto de partida:', window.pontoPartida);
        console.log('Ponto de destino:', window.pontoDestino);
        console.log('Distância total:', window.distanciaTotal);
        console.log('==================');
    }
}

// Executar debug se necessário
mostrarInfoDebug();

// Verificar se todas as funções estão disponíveis (executar após carregamento)
setTimeout(() => {
    console.log('=== VERIFICAÇÃO DE FUNÇÕES ===');
    console.log('zoomIn:', typeof window.zoomIn);
    console.log('zoomOut:', typeof window.zoomOut);
    console.log('fitGraph:', typeof window.fitGraph);
    console.log('toggleExpansion:', typeof window.toggleExpansion);
    console.log('toggleOverlay:', typeof window.toggleOverlay);
    console.log('=============================');
    
    // Verificar se os botões estão visíveis
    const controls = document.getElementById('zoom-controls');
    if (controls) {
        console.log('Controles visíveis:', controls.style.display !== 'none');
        console.log('Número de botões:', controls.querySelectorAll('button').length);
    }
}, 1000);
// Script para atualizar dinamicamente os campos de seleção
document.addEventListener('DOMContentLoaded', function() {
    const numeroVerticesField = document.getElementById('numero_vertices');
    const pontoPartidaField = document.getElementById('ponto_partida');
    const pontoDestinoField = document.getElementById('ponto_destino');
    
    if (numeroVerticesField && pontoPartidaField && pontoDestinoField) {
        // Função para atualizar as opções dos selects
        function atualizarOpcoes() {
            const numVertices = parseInt(numeroVerticesField.value);
            
            // Salvar valores selecionados anteriormente
            const partidaAnterior = pontoPartidaField.value;
            const destinoAnterior = pontoDestinoField.value;
            
            // Limpar opções existentes
            pontoPartidaField.innerHTML = '';
            pontoDestinoField.innerHTML = '';
            
            if (numVertices >= 2 && numVertices <= 26) {
                // Gerar opções baseadas no número de vértices
                const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                
                for (let i = 0; i < numVertices; i++) {
                    const letra = letras[i];
                    
                    // Criar option para ponto de partida
                    const optionPartida = document.createElement('option');
                    optionPartida.value = letra;
                    optionPartida.textContent = letra;
                    pontoPartidaField.appendChild(optionPartida);
                    
                    // Criar option para ponto de destino
                    const optionDestino = document.createElement('option');
                    optionDestino.value = letra;
                    optionDestino.textContent = letra;
                    pontoDestinoField.appendChild(optionDestino);
                }
                
                // Tentar manter valores anteriores se ainda válidos
                if (partidaAnterior && letras.substring(0, numVertices).includes(partidaAnterior)) {
                    pontoPartidaField.value = partidaAnterior;
                } else {
                    pontoPartidaField.value = letras[0]; // A
                }
                
                if (destinoAnterior && letras.substring(0, numVertices).includes(destinoAnterior)) {
                    pontoDestinoField.value = destinoAnterior;
                } else {
                    pontoDestinoField.value = numVertices > 1 ? letras[1] : letras[0]; // B ou A
                }
                
                console.log(`Opções atualizadas para ${numVertices} vértices (A-${letras[numVertices-1]})`);
            } else {
                // Valores padrão se número inválido
                const defaultOptions = ['A', 'B'];
                defaultOptions.forEach(letra => {
                    const optionPartida = document.createElement('option');
                    optionPartida.value = letra;
                    optionPartida.textContent = letra;
                    pontoPartidaField.appendChild(optionPartida);
                    
                    const optionDestino = document.createElement('option');
                    optionDestino.value = letra;
                    optionDestino.textContent = letra;
                    pontoDestinoField.appendChild(optionDestino);
                });
                
                pontoPartidaField.value = 'A';
                pontoDestinoField.value = 'B';
            }
        }
        
        // Atualizar opções quando o número de vértices mudar
        numeroVerticesField.addEventListener('input', atualizarOpcoes);
        numeroVerticesField.addEventListener('change', atualizarOpcoes);
        
        // Inicializar com valor padrão
        if (numeroVerticesField.value) {
            atualizarOpcoes();
        } else {
            // Definir um valor padrão
            numeroVerticesField.value = 4;
            atualizarOpcoes();
        }
        
        // Validação antes do envio do formulário
        const form = numeroVerticesField.closest('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                const numVertices = parseInt(numeroVerticesField.value);
                const partida = pontoPartidaField.value;
                const destino = pontoDestinoField.value;
                
                if (numVertices >= 2 && numVertices <= 26) {
                    const letrasValidas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, numVertices);
                    
                    if (!letrasValidas.includes(partida) || !letrasValidas.includes(destino)) {
                        e.preventDefault();
                        alert(`Por favor, escolha vértices válidos (A-${letrasValidas[letrasValidas.length-1]})`);
                        return false;
                    }
                    
                    if (partida === destino) {
                        e.preventDefault();
                        alert('Ponto de partida e destino devem ser diferentes!');
                        return false;
                    }
                }
                
                console.log(`Enviando: ${numVertices} vértices, ${partida} → ${destino}`);
            });
        }
    }
});
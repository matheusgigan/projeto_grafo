def dijikastra (mapa, ponto_partida):

    mapa[ponto_partida]['distancia'] = 0
    nao_visitados = list(mapa.keys()) 
    while nao_visitados:
        vertice_atual = min(nao_visitados, key=lambda x: mapa[x]['distancia']) 

        if mapa[vertice_atual]['distancia'] == float('inf'):
            break

        for vizinho, peso in mapa[vertice_atual]['arestas'].items(): 
            nova_distancia = mapa[vertice_atual]['distancia'] + peso

            if nova_distancia < mapa[vizinho]['distancia']: 
                mapa[vizinho]['distancia'] = nova_distancia
                mapa[vizinho]['caminho'] = vertice_atual

        mapa[vertice_atual]['visitado'] = True
        nao_visitados.remove(vertice_atual) 

    return mapa


def reconstruir_caminho(mapa_resultado, ponto_partida, ponto_destino):
    if mapa_resultado[ponto_destino]['distancia'] == float('inf'):
        return None, float('inf')

    caminho = []
    vertice_atual = ponto_destino
    
    while vertice_atual is not None:
        caminho.append(vertice_atual)
        vertice_atual = mapa_resultado[vertice_atual].get('caminho') 

    caminho_correto = caminho[::-1]
    
    if caminho_correto[0] == ponto_partida:
        distancia_total = mapa_resultado[ponto_destino]['distancia']
        return caminho_correto, distancia_total
    else:
        return None, float('inf') 

# Resumidamente,
# Você informa uma matriz, utilizando essas informações:
# vertices = {
#     'A': {'distancia': float('inf'), 'visitado': False, 'arestas': {'B': 5, 'C': 2}, 'caminho': None},
#     'B': {'distancia': float('inf'), 'visitado': False, 'arestas': {}, 'caminho': None},
#     'C': {'distancia': float('inf'), 'visitado': False, 'arestas': {'D': 3}, 'caminho': None},
#     'D': {'distancia': float('inf'), 'visitado': False, 'arestas': {'B': 8}, 'caminho': None}
# }

# Você seleciona o vertice de partida, e ele vai calcular a menor distância para todos os outros vertices.
# Primeirmente ele vai setar a distância do vertice de partida para 0, e todos os outros vertices para infinito.
# Vai marcar o vertice inicial como visitado.
# Vai pegar a aresta com a menor distância, e para cada um dos seus vizinhos, vai calcular a nova distância.
# Depois de visitar todos os vizinhos, ele vai marcar o vertice atual como visitado e remover da lista de não visitados.
# Vai repetir esse processo até que todos os vertices tenham sido visitados ou que o vertice com a menor distância seja infinito.
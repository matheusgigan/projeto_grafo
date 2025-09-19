import random
import string

def criar_grafo_aleatorio(numero_vertices):

    matriz = [[0 for _ in range(numero_vertices)] for _ in range(numero_vertices)]  # Criando a matriz
    minhas_vertices = {}  

    # Criando uma matriz e botando pesos aleatórios
    for i in range(numero_vertices):
        for j in range(numero_vertices):
            if i == j:
                matriz[i][j] = 0
            else:
                matriz[i][j] = random.randint(1, 10)

    # Criando os vértices com letras do alfabeto
    vertice_alfabeto = list(string.ascii_uppercase[:numero_vertices])

    # Botando as arestas no dicionário
    for i in range(numero_vertices):
        vertice = vertice_alfabeto[i]
        minhas_vertices[vertice] = {'arestas': {}, 'distancia': float('inf'), 'caminho': None, 'visitado': False}
        for j in range(numero_vertices):
            destino = vertice_alfabeto[j]
            peso = matriz[i][j]
            minhas_vertices[vertice]['arestas'][destino] = peso

    # print(matriz)

    return minhas_vertices



def dijkstra(minhas_vertices, ponto_partida):

    minhas_vertices[ponto_partida]['distancia'] = 0
    nao_visitados = list(minhas_vertices.keys()) 
    while nao_visitados:
        vertice_atual = min(nao_visitados, key=lambda x: minhas_vertices[x]['distancia']) 

        if minhas_vertices[vertice_atual]['distancia'] == float('inf'):
            break

        for vizinho, peso in minhas_vertices[vertice_atual]['arestas'].items(): 
            nova_distancia = minhas_vertices[vertice_atual]['distancia'] + peso

            if nova_distancia < minhas_vertices[vizinho]['distancia']: 
                minhas_vertices[vizinho]['distancia'] = nova_distancia
                minhas_vertices[vizinho]['caminho'] = vertice_atual

        minhas_vertices[vertice_atual]['visitado'] = True
        nao_visitados.remove(vertice_atual) 

    return minhas_vertices

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
    
# numero_vertices = int(input("Digite o número de vértices: "))
# minhas_vertices = criar_grafo_aleatorio(numero_vertices)
# ponto_partida = input(f"Digite o ponto de partida entre {list(minhas_vertices.keys())}: ")
# ponto_destino = input(f"Digite o ponto de destino entre {list(minhas_vertices.keys())}: ")
# resultado = dijkstra(minhas_vertices, ponto_partida)
# caminho, distancia = reconstruir_caminho(resultado, ponto_partida, ponto_destino)

# if caminho:
#     print(f"Caminho mais curto de {ponto_partida} para {ponto_destino}: {' -> '.join(caminho)}, Distância: {distancia}")
# else:
#     print(f"Não há caminho de {ponto_partida} para {ponto_destino}.")
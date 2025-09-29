from multiprocessing import context
import random
import string
from django.shortcuts import render

def criar_grafo_aleatorio(numero_vertices):

    matriz = [[0 for _ in range(numero_vertices)] for _ in range(numero_vertices)]  # Criando a matriz
    minhas_vertices = {}  

    # Criando uma matriz e botando pesos aleatórios
    for i in range(numero_vertices):
        for j in range(numero_vertices):
            if i == j:
                matriz[i][j] = 0
            else:
                peso = random.randint(1, 10)
                matriz[i][j] = peso
                matriz[j][i] = peso 

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
    return minhas_vertices

def dijikastra(minhas_vertices, ponto_partida):

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

def caminho_ate_o_destino(grafo, ponto_partida, ponto_destino):
   if grafo[ponto_destino]['distancia'] == float('inf'):
       return None, float('inf') 

   caminho = []
   ponto_atual = ponto_destino
   while ponto_atual != ponto_partida:
       caminho.append(ponto_atual)
       ponto_atual = grafo[ponto_atual].get('caminho')
   caminho.append(ponto_partida)
   caminho.reverse()

   return caminho, grafo[ponto_destino]['distancia']



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
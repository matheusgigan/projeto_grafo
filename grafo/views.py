from django.shortcuts import render
from grafo.dijikastra import criar_grafo_aleatorio, dijikastra, caminho_ate_o_destino
from grafo.forms import TestForm
import string
import json

def index(request):
    form = TestForm()
    return render(request, "grafo/index.html", {'form': form})

def tela_inicial(request):
    return render(request, 'grafo/tela_inicial.html')

def processar_grafo(request):
    if request.method == 'POST':
        # Verificar se é o formulário de resultado
        if any(key.startswith('celula_') for key in request.POST):
            return calcular_resultado(request)
        
        # Processar o formulário inicial
        form = TestForm(request.POST)
        if form.is_valid():
            numero_vertices = int(form.cleaned_data['numero_vertices'])
            ponto_partida = form.cleaned_data['ponto_partida']
            ponto_destino = form.cleaned_data['ponto_destino']
            
            # Criar grafo aleatório
            minhas_vertices = criar_grafo_aleatorio(numero_vertices)
            vertices_nomes = list(string.ascii_uppercase[:numero_vertices])
            
            # Criar matriz para exibição
            matriz = []
            for i in range(numero_vertices):
                linha = []
                for j in range(numero_vertices):
                    peso = minhas_vertices[vertices_nomes[i]]['arestas'][vertices_nomes[j]]
                    linha.append(peso)
                matriz.append(linha)
            
            # Criar lista para facilitar template no html
            matriz_com_nomes = []
            for i, linha in enumerate(matriz):
                matriz_com_nomes.append({
                    'nome_linha': vertices_nomes[i],
                    'linha': linha
                })
            
            context = {
                'numero_vertices': numero_vertices,
                'ponto_partida': ponto_partida,
                'ponto_destino': ponto_destino,
                'matriz': matriz,
                'vertices_nomes': vertices_nomes,
                'matriz_com_nomes': matriz_com_nomes
            }
            return render(request, 'grafo/matriz.html', context)
        else:
            return render(request, 'grafo/index.html', {'form': form})
    
    # GET - redirecionar para index
    from django.shortcuts import redirect
    return redirect('index')

def calcular_resultado(request):
    import json
    
    numero_vertices = int(request.POST.get('numero_vertices'))
    ponto_partida = request.POST.get('ponto_partida')
    ponto_destino = request.POST.get('ponto_destino')
    
    # Recriar grafo com matriz alterada
    vertices_nomes = list(string.ascii_uppercase[:numero_vertices])
    minhas_vertices = {}
    
    # Inicializar vértices
    for vertice in vertices_nomes:
        minhas_vertices[vertice] = {
            'arestas': {}, 
            'distancia': float('inf'), 
            'caminho': None, 
            'visitado': False
        }
    
    # Preencher arestas com valores da matriz
    for i, vertice_origem in enumerate(vertices_nomes):
        for j, vertice_destino in enumerate(vertices_nomes):
            campo_nome = f"celula_{i+1}_{j+1}"
            try:
                peso = int(request.POST.get(campo_nome, 0))
            except (ValueError, TypeError):
                peso = 0
            minhas_vertices[vertice_origem]['arestas'][vertice_destino] = peso
    
    # Calcular Dijkstra
    resultado_dijkstra = dijikastra(minhas_vertices, ponto_partida)
    caminho, distancia = caminho_ate_o_destino(resultado_dijkstra, ponto_partida, ponto_destino)
    
    # Preparar dados para o grafo visual
    vertices_data = {}
    edges_data = []
    
    # Converter dados dos vértices para JSON
    for vertice, dados in minhas_vertices.items():
        vertices_data[vertice] = {
            'arestas': dados['arestas'],
            'distancia': dados['distancia'] if dados['distancia'] != float('inf') else 999999,
            'visitado': dados['visitado']
        }
    
    context = {
        'caminho': caminho,
        'distancia': distancia,
        'ponto_partida': ponto_partida,
        'ponto_destino': ponto_destino,
        'vertices_data': json.dumps(vertices_data),
        'caminho_json': json.dumps(caminho) if caminho else json.dumps([]),
        'edges_data': json.dumps(edges_data),  # Não usado atualmente, mas mantido para compatibilidade
    }
    return render(request, 'grafo/resultado.html', context)
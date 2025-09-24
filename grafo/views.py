from django.shortcuts import render
from grafo.dijikastra import criar_grafo_aleatorio, dijikastra, caminho_ate_o_destino
from grafo.forms import TestForm
import string

def index(request):
    form = TestForm(request.POST or None)
    return render(request, "grafo/index.html", {'form': form})

def tela_inicial(request):
    return render(request, 'grafo/tela_inicial.html')

def matriz(request):
    return render(request, 'grafo/matriz.html')


# Pegando os dados informados no formulario e processando o grafo/Dijikastra
def processar_grafo(request):
    if request.method == 'POST':
        form = TestForm(request.POST)
        if form.is_valid():
            context = {}
            numero_vertices = int(form.cleaned_data['numero_vertices'])
            ponto_partida = form.cleaned_data['ponto_partida']
            ponto_destino = form.cleaned_data['ponto_destino']
        else:
            # Form inválido, retornar para index com erros
            return render(request, 'grafo/index.html', {'form': form})

        # Salvar na sessão para usar depois
        request.session['numero_vertices'] = numero_vertices
        request.session['ponto_partida'] = ponto_partida
        request.session['ponto_destino'] = ponto_destino
        
        context['numero_vertices'] = numero_vertices
        context['ponto_partida'] = ponto_partida
        context['ponto_destino'] = ponto_destino
        
        minhas_vertices = criar_grafo_aleatorio(numero_vertices)

        vertices_nomes = list(string.ascii_uppercase[:numero_vertices])
        matriz = []
        
        for i in range(numero_vertices):
            linha = []
            for j in range(numero_vertices):
                peso = minhas_vertices[vertices_nomes[i]]['arestas'][vertices_nomes[j]]
                linha.append(peso)
            matriz.append(linha)
        
        matriz_com_nomes = []
        for i, linha in enumerate(matriz):
            matriz_com_nomes.append({
                'nome_linha': vertices_nomes[i],
                'linha': linha
            })
        
        context['matriz'] = matriz
        context['vertices_nomes'] = vertices_nomes
        context['matriz_com_nomes'] = matriz_com_nomes
        
        return render(request, 'grafo/matriz.html', context)
    return render(request, 'grafo/index.html')

# Processa as alterações da matriz e calcula o resultado
def resultado(request):
    if request.method == 'POST':
        context = {}
        
        # Pega dados do POST anterior
        numero_vertices = request.session.get('numero_vertices')
        ponto_partida = request.session.get('ponto_partida') 
        ponto_destino = request.session.get('ponto_destino')
        
        vertices_nomes = list(string.ascii_uppercase[:numero_vertices])
        minhas_vertices = {}
        
        # Recria o grafo com os valores alterados
        for i, vertice_origem in enumerate(vertices_nomes):
            minhas_vertices[vertice_origem] = {
                'arestas': {}, 
                'distancia': float('inf'), 
                'caminho': None, 
                'visitado': False
            }
            
        for i, vertice_origem in enumerate(vertices_nomes):
            for j, vertice_destino in enumerate(vertices_nomes):
                campo_nome = f"celula_{i+1}_{j+1}"
                try:
                    peso = int(request.POST.get(campo_nome, 0))
                except (ValueError, TypeError):
                    peso = 0
                minhas_vertices[vertice_origem]['arestas'][vertice_destino] = peso
    
        resultado_dijkstra = dijikastra(minhas_vertices, ponto_partida)
        caminho, distancia = caminho_ate_o_destino(resultado_dijkstra, ponto_partida, ponto_destino)
        
        context['caminho'] = caminho
        context['distancia'] = distancia
        context['ponto_partida'] = ponto_partida
        context['ponto_destino'] = ponto_destino
        
        return render(request, 'grafo/resultado.html', context)
    
    return render(request, 'grafo/resultado.html')

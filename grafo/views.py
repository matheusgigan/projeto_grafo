from django.shortcuts import render
from grafo.teste import criar_grafo_aleatorio, dijkstra, reconstruir_caminho
from grafo.forms import TestForm

def index(request):
    form = TestForm(request.POST or None)
    return render(request, "grafo/index.html", {'form': form})

def tela_inicial(request):
    return render(request, 'grafo/tela_inicial.html')


# Renderizando o formulário e alocando os dados informados em variaveis
def forms(request):
    form = TestForm( request.POST or None)
    if form.is_valid():
        numero_vertices = form.cleaned_data.get('numero_vertices')
        ponto_partida = form.cleaned_data.get('ponto_partida')
        ponto_destino = form.cleaned_data.get('ponto_destino')
        print(f"Número de vértices: {numero_vertices}")
        print(f"Ponto de partida: {ponto_partida}")
        print(f"Ponto de destino: {ponto_destino}")
    return render(request, 'grafo/index.html', {'form': form})

# Pegando os dados informados no formulario e processando o grafo/Dijikastra
def processar_grafo(request):
    if request.method == 'POST':
        context = {}
        numero_vertices = int(request.POST.get('numero_vertices', ''))
        ponto_partida = request.POST.get('ponto_partida', '')
        ponto_destino = request.POST.get('ponto_destino', '')

        context['numero_vertices'] = numero_vertices
        context['ponto_partida'] = ponto_partida
        context['ponto_destino'] = ponto_destino
        
        minhas_vertices = criar_grafo_aleatorio(numero_vertices)
        resultado = dijkstra(minhas_vertices, ponto_partida)
        caminho, distancia = reconstruir_caminho(resultado, ponto_partida, ponto_destino)
        context['caminho'] = caminho
        context['distancia'] = distancia

        return render(request, 'grafo/resultado.html', context)
    return render(request, 'grafo/index.html')

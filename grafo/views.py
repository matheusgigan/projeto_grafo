from django.shortcuts import render
from grafo.dijikastra import dijikastra, reconstruir_caminho

def index(request):
    return render(request, "grafo/index.html")

def tela_inicial(request):
    return render(request, 'grafo/tela-inicial.html')

def processar_grafo(request):
    if request.method == 'POST':
        context = {}
        vertices_str = request.POST.get('vertices', '')
        arestas_str = request.POST.get('arestas', '')
        ponto_partida = request.POST.get('ponto_partida')
        ponto_destino = request.POST.get('ponto_destino')

        mapa = {}
        lista_vertices = [v.strip() for v in vertices_str.split(',')]
        for v in lista_vertices:
            mapa[v] = {'distancia': float('inf'), 'caminho': None, 'arestas': {}}

        for linha in arestas_str.strip().splitlines():
            try:
                origem, destino, peso_str = [parte.strip() for parte in linha.split(',')]
                peso = int(peso_str)
                if origem in mapa and destino in mapa:
                    mapa[origem]['arestas'][destino] = peso
            except (ValueError, IndexError):
                print(f"Aviso: Linha mal formatada ignorada: '{linha}'")
                continue
        
        mapa_com_distancias = dijikastra(mapa.copy(), ponto_partida)

        if mapa_com_distancias:
            caminho_final, distancia_total = reconstruir_caminho(mapa_com_distancias, ponto_partida, ponto_destino)
            context['caminho'] = caminho_final
            context['distancia'] = distancia_total
            print(f">>> Resultado: Caminho={caminho_final}, Distância={distancia_total}")
        else:
            context['erro'] = "Ocorreu um erro ao processar o grafo. Verifique os dados de entrada."
            print(f">>> Erro: A função dijkstra não retornou um resultado válido.")

        return render(request, 'grafo/resultado.html', context)

    return render(request, 'grafo/index.html')
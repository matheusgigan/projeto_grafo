from django.shortcuts import render

def index(request):
    tamanho_vertices = None
    nome_vertices =  None

    if request.method == "POST":
        if "numero_vertices" in request.POST:
            numero_vertices = int(request.POST.get("numero_vertices"))
            tamanho_vertices = range(numero_vertices)
            return render(request, "grafo/index.html", {"tamanho_vertices": tamanho_vertices})

        elif "nome_vertice" in request.POST:
            nome_vertices = request.POST.getlist("nome_vertice")
            tamanho_vertices = range(len(nome_vertices))
            context = {
                "tamanho_vertices": tamanho_vertices,
                "nome_vertices": nome_vertices
            }
            return render(request, "grafo/index.html", context)

    return render(request, "grafo/index.html")

def tela_inicial(request):
    return render(request, 'grafo/tela-inicial.html')
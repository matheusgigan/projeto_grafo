from django.urls import path, include
from grafo.views import index, tela_inicial

urlpatterns = [
    path('', tela_inicial, name='tela_inicial'),
    path('index/', index, name='index'),

]
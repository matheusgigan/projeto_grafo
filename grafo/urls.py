# Em grafo/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.tela_inicial, name='tela_inicial'),
    path('index/', views.index, name='index'),
    path('processar_grafo/', views.processar_grafo, name='processar_grafo'),
    path('matriz/', views.matriz, name='matriz'),
    path('resultado/', views.resultado, name='resultado'),
]
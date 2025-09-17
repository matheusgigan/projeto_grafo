# Em grafo/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # A URL principal ('/') tem o nome 'processar_grafo'
    path('', views.processar_grafo, name='processar_grafo'),
]
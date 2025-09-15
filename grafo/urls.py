from django.urls import path
from grafo.views import index

urlpatterns = [
    path('', index, name='index'),
]
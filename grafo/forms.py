from django import forms
class TestForm(forms.Form):
    numero_vertices = forms.CharField(label='Digite o numero de vértices', max_length=100, widget=forms.NumberInput(attrs={'placeholder': 'Ex: 1 -> 26', 'min': '2'}))
    ponto_partida = forms.CharField(label='Digite o ponto de partida', max_length=100,  widget=forms.TextInput(attrs={'placeholder': 'Ex: A ', 'pattern': '[A-Z]'}))
    ponto_destino = forms.CharField(label='Digite o ponto de destino', max_length=100,  widget=forms.TextInput(attrs={'placeholder': 'Ex: B', 'pattern': '[A-Z]'}))

# O codigo do Dijikastra e o de construir o grafo usam apenas esses 3 dados.



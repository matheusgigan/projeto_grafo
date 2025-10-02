from django import forms
import string

class TestForm(forms.Form):
    numero_vertices = forms.IntegerField(
        label='Número de vértices', 
        min_value=2, 
        max_value=26,
        widget=forms.NumberInput(attrs={
            'placeholder': 'Ex: 5 (máx 26 para ter A-Z)', 
            'min': '2', 
            'max': '26',
            'class': 'form-control',
            'id': 'numero_vertices'
        })
    )
    
    ponto_partida = forms.CharField(
        label='Ponto de partida',
        max_length=1,
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'ponto_partida'
        })
    )
    
    ponto_destino = forms.CharField(
        label='Ponto de destino',
        max_length=1,
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'ponto_destino'
        })
    )
    
    def clean_ponto_partida(self):
        """Normalizar ponto de partida para maiúsculo e validar"""
        ponto = self.cleaned_data.get('ponto_partida', '').upper()
        numero_vertices = self.cleaned_data.get('numero_vertices', 2)
        
        if numero_vertices and ponto:
            vertices_validos = string.ascii_uppercase[:numero_vertices]
            if ponto not in vertices_validos:
                raise forms.ValidationError(f'Escolha uma letra entre A e {vertices_validos[-1]}')
        
        return ponto
    
    def clean_ponto_destino(self):
        """Normalizar ponto de destino para maiúsculo e validar"""
        ponto = self.cleaned_data.get('ponto_destino', '').upper()
        numero_vertices = self.cleaned_data.get('numero_vertices', 2)
        
        if numero_vertices and ponto:
            vertices_validos = string.ascii_uppercase[:numero_vertices]
            if ponto not in vertices_validos:
                raise forms.ValidationError(f'Escolha uma letra entre A e {vertices_validos[-1]}')
        
        return ponto

# O codigo do Dijikastra e o de construir o grafo usam apenas esses 3 dados.



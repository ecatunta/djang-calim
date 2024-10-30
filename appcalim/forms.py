# forms.py
from django import forms
from .models import ParametroAtributo, Venta, Ingreso

class ParametroAtributoForm(forms.ModelForm):
    class Meta:
        model = ParametroAtributo        
        fields = ['subcategoria', 'patributo_tabla']
        widgets = {
            'subcategoria': forms.Select(attrs={
                'id': 'subcategoria_id',
                'class': 'form-control',
                'name': 'subcategoria',
            }),
            'patributo_tabla': forms.TextInput(attrs={
                'id': 'patributo_tabla_id',
                'class': 'form-control',
                'placeholder': 'Enter table name',
                'name': 'patributo_tabla',
            }),            
        }

class VentaForm(forms.ModelForm):
    class Meta:
        model = Venta
        #fields = ['venta_cantidad', 'venta_precioUnitario']
        fields = ['venta_cantidad', 'venta_precioUnitario', 'venta_precioSubTotal']

class IngresoForm(forms.ModelForm):
    class Meta:
        model = Ingreso
        # Reemplaza con los nombres de los campos de tu modelo
        # fields = ['ingreso_unidad', 'ingreso_costoUnitario', 'ingreso_costoTotal'] 
        fields = ['producto']

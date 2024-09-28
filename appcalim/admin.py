from django.contrib import admin
from .models import Categoria, Subcategoria, Producto, Higiene, ParametroAtributo

# Register your models here.
admin.site.register(Categoria) 
admin.site.register(Subcategoria)
admin.site.register(Producto)
admin.site.register(Higiene)
admin.site.register(ParametroAtributo)
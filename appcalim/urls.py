from django.urls import path 
from . import views

urlpatterns = [
    #path ('', views.Index, name='index'),
    path ('', views.Inicio, name='inicio'),
    path('categorias/', views.Categorias, name='categorias'), 
    path('subcategorias/<int:pk>/', views.SubCategorias, name='subcategorias'),  
    path('productos/<int:pk>/', views.Productos, name='productos'),  
    path('producto_detalle/<int:producto_id>/<int:subcategoria_id>/', views.Producto_detalle, name='producto_detalle'),   
    path('parametro_atributo/create/', views.Create_parametro_atributo, name='create_parametro_atributo'),    
    path('categorias_y_subcategorias/<int:subcategoria_id>/', views.Obtener_categorias, name='categorias_y_subcategorias'),
    path('obtener_tabla_campos/<str:table_name>/', views.obtenerBD_tabla_campos, name='obtener_tabla_campos'),    
    path('analiza_atributo/', views.Analiza_atributo_tablaParametro, name='merge_attr'),        
    path('nueva_venta/<int:ticket>/', views.Nueva_venta, name='nueva_venta'),
    path('buscar/', views.Buscar_producto, name='buscar_producto'),
    #path('venta/crear/', views.Crear_venta, name='crear_venta'),
    path('quitar-venta/<int:venta_id>/', views.Quitar_venta, name='quitar_venta'),
    path('guardar-venta/', views.Guardar_venta, name='guardar_venta'),
    path('actualizar-venta/', views.Actualizar_venta, name='actualizar_venta'),
    path('actualizar_precio_total/<int:ticket_id>/', views.Actualizar_precio_total_ticket, name='actualizar_precio_total_ticket'),
    path('actualizar-subTotal-total/', views.Actualizar_subTotal_total, name='actualizar-subTotal-total'),
    path('ingreso/', views.Nuevo_ingreso, name='nuevo_ingreso'),
    path('quitar_ingreso/<int:ingreso_id>/', views.Quitar_ingreso, name='quitar_ingreso'),
    #path('cierra_activa_ingreso/<int:ingreso_id>/', views.Incluir_inventario, name='inclue_inventario'),
    path('obtiene_precioU_vigente_nuevo/<int:ingreso_id>/', views.Obtiene_precioU_vigente_nuevo, name='obtiene_precioU'),
    path('actualizar_ingreso/<int:ingreso_id>/', views.Actualizar_ingreso, name='actualizar_ingreso'),
    path('inventario_ingreso/<int:ingreso_id>/', views.Inventario_ingreso, name='inventario_ingresoo'),    
    path('listado_producto/', views.Listar_producto, name='listado_producto'),    
    path('actualizar_nombre_producto/', views.Actualizar_nombre_producto, name='actualizar_nombre_producto'),    
    path('actualizar_ingreso2/<int:ingreso_id>/', views.Actualizar_ingreso2, name='actualizar_ingreso2'),    
    path('crea-items/<int:ingreso_id>/<int:unidades>/', views.Crear_items, name='crea_items_producto'),    
    path('genera-sigla-producto/', views.Actualiza_sigla_producto, name='genera_sigla'),    
    path('actualiza-fecha-vtos/<int:ingreso_id>/', views.Actualiza_fecha_vencimientos, name='actualiza_fecha_vtos'),    
    path('limpia-fecha-vtos/<int:ingreso_id>/', views.limpia_fecha_vencimientos, name='limpia_fecha_vtos'),    
    path('actualiza-fecha-vto/<int:item_id>/<str:fecha_vto>/', views.Actualiza_fecha_vencimiento, name='actualiza_fecha_vto'),    
    path('actualiza-categoriaFechaVto/<int:ingreso_id>/<int:cat_fechaVto>/', views.Actualiza_categoria_fechaVto, name='actualiza_categoria_Fechavto'),    

]
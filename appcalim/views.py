from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.apps import apps
from django.db import connection, models, transaction, DatabaseError
from django.utils import timezone
from django.db.models import ForeignKey, OneToOneField, ManyToManyField, Sum, Max
from .models import Categoria, Subcategoria, Producto, Higiene, ParametroAtributo, Venta, Ticket, Ingreso, Inventario, InventarioIngreso, InventarioVenta, Item
from .forms import ParametroAtributoForm, VentaForm, IngresoForm
from django.core.paginator import Paginator
from django.template.loader import render_to_string
from django.contrib import messages
from datetime import datetime
from django.utils.timezone import localtime
from django.utils.dateformat import DateFormat
from decimal import Decimal
from django.core.serializers import serialize
import json

# Create your views here.

def Index (request):
    return HttpResponse("¡Hola, mundo! Esta es la página de inicio de tu aplicación.")

def Inicio(request):       
    return render(request, 'inicio.html')

def Categorias(request):
    categorias = Categoria.objects.all()        
    return render(request, 'categoria.html', {'categorias': categorias})

def SubCategorias(request, pk):   
    subcategorias = Subcategoria.objects.filter(categoria=pk)  # Filtra las subcategorías por el campo correspondiente
    return render(request, 'subcategoria.html', {'subcategorias': subcategorias})

def Productos(request, pk):           
    print ('pk Productos: ' ,pk)
    subcategoria = Subcategoria.objects.get(pk=pk)  # Obtén la subcategoría específica    
    productos = Producto.objects.filter(subcategoria=pk)  # Filtra los productos por la subcategoría
    return render(request, 'producto.html', {'productos': productos, 'subcategoria': subcategoria})

def Producto_detalle(request, producto_id, subcategoria_id):    
    # Obtén el objeto Producto
    producto = get_object_or_404(Producto, producto_id=producto_id)    
    
    '''categoria_relacion = Categoria.objects.filter(subcategoria__id=subcategoria_id)     
    for categoria in categoria_relacion:
        categoria_nombre = categoria.categoria_nombre '''
    
    campos_y_valores_filtrados = []
    
    # Filtrar la subcategoría por su ID
    subcategoria = Subcategoria.objects.get(id=subcategoria_id)
    
    # Obtener el nombre de la categoría asociada
    categoria_nombre = subcategoria.categoria.categoria_nombre
    
    # Convertir a minuscula el nombre de la categoria 
    tabla_nombre = categoria_nombre.lower()
    
    # Llama al método para verificar si existe una tabla con el nombre de la categoria en minuscula
    json_response = obtenerBD_tabla_campos(request, tabla_nombre)
    
    # Convierte el JsonResponse en un diccionario de Python
    response_data = json.loads(json_response.content)
    
    # Manipula los datos de la respuesta
    tabla_existe = response_data.get('exists', False)
    campos_tabla = response_data.get('fields', [])
    nombre_modelo = response_data.get('model_name', None)    
    
    if (tabla_existe):        
        try:           
            # Referencia al modelo real utilizando el nombre del modelo
            Modelo = apps.get_model('appcalim', nombre_modelo)  
            # Usa el modelo para ejecutar la consulta           
            #print('**** producto_id:' ,producto_id) 
            query = Modelo.objects.get(producto__producto_id=producto_id)                  
            
            # Obtener el objeto Higiene relacionado con el producto_id
            #object_product = Modelo.objects.get(producto__producto_id=producto_id)
            objecto_derivado = Modelo.objects.get(producto__producto_id=producto_id)

            # Obtener los campos y valores del modelo Higiene
            #higiene_fields = objecto.__dict__
            objeto_fields = objecto_derivado.__dict__

            # Filtrar solo los campos relevantes (excluyendo atributos internos como _state)
            objeto_data = {key: value for key, value in objeto_fields.items() if not key.startswith('_')}

            # Obtener los campos y valores del modelo Producto relacionado
            producto_fields = objecto_derivado.producto.__dict__

            # Filtrar solo los campos relevantes (excluyendo atributos internos como _state)
            producto_data = {key: value for key, value in producto_fields.items() if not key.startswith('_')}

            # Combinar los diccionarios de Higiene y Producto si lo necesitas
            combined_data = {**producto_data, **objeto_data}

            # Imprimir o manipular los datos
            '''print("Campos de Higiene:")
            for field, value in objeto_data.items():
                print(f"{field}: {value}")

            print("\nCampos de Producto:")
            for field, value in producto_data.items():
                print(f"{field}: {value}")

            print("\nDatos Combinados:")
            for field, value in combined_data.items():
                print(f"{field}: {value}")'''            
            #print('**** combined_data: ', combined_data)

            combined_data_list = [combined_data]
            print('**** combined_data_list', combined_data_list, '\n')                               
            
            parametroAtributo_nivel1 = ParametroAtributo.objects.filter(subcategoria_id=subcategoria_id, patributo_nivel=1).order_by('patributo_orden')
            parametroAtributo_nivel2 = ParametroAtributo.objects.filter(subcategoria_id=subcategoria_id, patributo_nivel=2).order_by('patributo_orden')
            parametroAtributo_nivel3 = ParametroAtributo.objects.filter(subcategoria_id=subcategoria_id, patributo_nivel=3).order_by('patributo_orden')

            lista_respuesta_nivel1 = []
            lista_respuesta_nivel2 = []
            lista_respuesta_nivel3 = []

            lista_respuesta_nivel1 = procesa_lista(combined_data_list, parametroAtributo_nivel1)
            lista_respuesta_nivel2 = procesa_lista(combined_data_list, parametroAtributo_nivel2)
            lista_respuesta_nivel3 = procesa_lista(combined_data_list, parametroAtributo_nivel3)       

            #imprime_lista(lista_respuesta_nivel1)
            #imprime_lista(lista_respuesta_nivel2)
            #imprime_lista(lista_respuesta_nivel3)
            print ('lista_respuesta_nivel3: ', lista_respuesta_nivel3)

        except Modelo.DoesNotExist:
            # Si no existe, pasamos una variable al template indicando el error
            query = None
    else:
        tabla_existe = None
        query = None   
    
    # Contexto para pasar al template
    context = {
        'producto': producto,
        'higiene': query,
        'tabla_existe': tabla_existe, 
        'campos_y_valores_filtrados': campos_y_valores_filtrados,  # Añadir la lista al contexto
        'lista_respuesta_nivel3': lista_respuesta_nivel3
    }    

    return render(request, 'producto_detalle.html', context)

def procesa_lista(combined_Producto_ISA, querySet_ParametroAtributo):
    print ("Introduce a una 'lista de diccionarios' los valores de la consulta al Modelo ParametroAtributo") 
    # Lista para almacenar los diccionarios
    list_parametro_atributo = []
    # Iterar sobre el QuerySet y agregar cada registro a la lista de diccionarios
    for atributo in querySet_ParametroAtributo:
        atributo_dict = {
            'patributo_orden': atributo.patributo_orden,
            'patributo_nivel': atributo.patributo_nivel,
            'patributo_nombre': atributo.patributo_nombre,
            #'patributo_id': atributo.patributo_id,
            #'subcategoria_id': atributo.subcategoria_id,                    
            #'patributo_tabla': atributo.patributo_tabla,
            'patributo_label': atributo.patributo_label           
        }
        list_parametro_atributo.append(atributo_dict)    
    print('Ok.****atributo_data_list: ', list_parametro_atributo, '\n')   

    print("Agrega el valor del atributo (clave/valor) - list_parametro_atributo")    
    # Iterar sobre la lista atributo_data_list
    for atributo in list_parametro_atributo:
        # Obtener el valor de patributo_nombre
        patributo_nombre = atributo['patributo_nombre']                
        # Buscar el valor en la lista combined_data_list
        for item in combined_Producto_ISA:
            if patributo_nombre in item:
                # Agregar la clave y valor a atributo_data_list
                #atributo[patributo_nombre] = item[patributo_nombre]
                atributo['atributo_valor'] = item[patributo_nombre]

    return list_parametro_atributo

def imprime_lista(lista_dic):
    if lista_dic:
        encabezados = lista_dic[0].keys()
        print(" | ".join(encabezados))
        print("-" * 100)
        # Imprimir los valores de cada atributo como filas de la tabla
        for atributo in lista_dic:
            valores = [str(valor) for valor in atributo.values()]
            print("  |  ".join(valores))
    else:
        print("La lista atributo_data_list está vacía.")

def Create_parametro_atributo(request):
    # Obtener todos los registros de ParametroAtributo junto con los datos relacionados de Subcategoria
    parametroA = ParametroAtributo.objects.prefetch_related('subcategoria').all()
    
    if request.method == 'POST':
        # Procesar el formulario para campos no dinámicos
        form = ParametroAtributoForm(request.POST)
        if form.is_valid():
            # Obtener los datos del formulario
            subcategoria = form.cleaned_data['subcategoria']
            patributo_tabla = form.cleaned_data['patributo_tabla']

            # Antes de crear nuevos registros, eliminamos los existentes para la subcategoría seleccionada
            ParametroAtributo.objects.filter(subcategoria=subcategoria).delete()

            # Procesar los checkboxes y los campos adicionales
            checkboxes = request.POST.getlist('patributo_nombre')  # Obtener los valores de los checkboxes

            for campo in checkboxes:
                # Extraer los valores asociados a cada checkbox
                patributo_label = request.POST.get(f'patributo_label_{campo}')
                patributo_nivel = request.POST.get(f'patributo_nivel_{campo}')
                patributo_orden = request.POST.get(f'patributo_orden_{campo}')

                print ('label: ',patributo_label, 'nivel: ',patributo_nivel, 'orden: ',patributo_orden)                
                
                if patributo_nivel=='':
                    patributo_nivel = None

                if patributo_orden=='':
                    patributo_orden = None

                # Crear una instancia para cada checkbox con sus respectivos campos adicionales
                ParametroAtributo.objects.create(
                    subcategoria=subcategoria,
                    patributo_tabla=patributo_tabla,
                    patributo_nombre=campo,
                    patributo_label=patributo_label,
                    patributo_nivel=patributo_nivel,
                    patributo_orden=patributo_orden
                )

            # Redirige a la misma página después de guardar los datos
            return redirect('create_parametro_atributo')
    else:
        form = ParametroAtributoForm()

    return render(request, 'create_parametro_atributo.html', {'form': form, 'parametrosA': parametroA})

def Obtener_categorias(request, subcategoria_id):  
    # Filtra la subcategoría por su ID
    subcategoria = get_object_or_404(Subcategoria, pk=subcategoria_id)    
    # Obtiene la categoría relacionada con la subcategoría
    categoria = subcategoria.categoria    
    # Crear un diccionario con los datos que deseas devolver
    data = {
        'categoria_nombre': categoria.categoria_nombre,
        'subcategoria_nombre': subcategoria.subcategoria_nombre,
    }    
    # Devolver la respuesta JSON
    return JsonResponse(data)

def obtenerBD_tabla_campos(request, table_name):
    tablas = connection.introspection.table_names()
    # Verifica si la tabla con el nombre table_name existe en la base de datos.
    if table_name in tablas:
        # Obtener el modelo asociado al nombre de la tabla
        modelo_asociado = None
        for model in apps.get_models():
            if model._meta.db_table == table_name:
                modelo_asociado = model.__name__
                break
        
        # Obtener los nombres de los campos de la tabla
        with connection.cursor() as cursor:
            descripcion_tabla = connection.introspection.get_table_description(cursor, table_name)
            nombres_campos = [campo.name for campo in descripcion_tabla]            
        
        return JsonResponse({
            'exists': True,
            'fields': nombres_campos,
            'model_name': modelo_asociado  # Nombre del modelo asociado
        })
    else:
        return JsonResponse({
            'exists': False,
            'fields': [],
            'model_name': None
        })    

def Analiza_atributo_tablaParametro(request):    
    if request.method == 'POST':
        atributo_parametro = []
        # data contiene el cuerpo de la solicitud en formato JSON enviado via POST, contiene los campos de la tabla base 
        data = json.loads(request.body)  # Convierte la cadena JSON a un diccionario de Python              
        
        #print ('***data: ', data, '\n')
        # Acceder a la lista de 'fields'
        atributo_tabla = data.get('fields')  # Devuelve la lista de campos
        
        #print('*** AGREGA LOS CAMPOS DEL MODELO PRODUCTO A LA LISTA PRINCIPAL ***')
        #print ('Lista atributo_tabla antes: \n', atributo_tabla , '\n')
        #print('*** Obtener los campos del modelo Producto ***\n')      
        table_name = 'producto'  
        with connection.cursor() as cursor:
            descripcion_tabla = connection.introspection.get_table_description(cursor, table_name)
            nombres_campos_producto = [campo.name for campo in descripcion_tabla]     
        #print('*** nombre de los campos de producto: ',nombres_campos_producto, '\n')       
        
        # Iterar sobre nombres_campos_producto
        for campo in nombres_campos_producto:
            # Verificar si el campo no está ya en lista_atributo_tabla
            if campo not in atributo_tabla:
                # Agregar el campo a lista_atributo_tabla
                atributo_tabla.append(campo)

        # Imprimir la lista actualizada
        #print ('Lista atributo_tabla despues: \n', atributo_tabla)

        # Accede a subcategoria_id
        subcategoria_id = data.get('subcategoria_id')
        parametroAtributo = ParametroAtributo.objects.filter(subcategoria=subcategoria_id)                               
        
        # Añade a la lista atributo_parametro una tupla con los valores de cada registro
        for atributo in parametroAtributo:
            # Crear una tupla con los campos del modelo
            atributo_tupla = (
                atributo.patributo_nombre,
                atributo.patributo_tabla,
                atributo.patributo_label,
                atributo.patributo_nivel,
                atributo.patributo_orden
            )    
            # Añadir la tupla a la lista
            atributo_parametro.append(atributo_tupla)              
                
        # Lista de diccionario resultante
        lista_comparada = []
        # Itera sobre la lista atributo_tabla
        for atributo in atributo_tabla:
            # Busca el atributo en la lista de tuplas 
            encontrado = False 
            for tupla in atributo_parametro:
                if atributo == tupla[0]:
                    # Si se encuentra, añade un diccionario con 'checked' y los demas valores 
                    lista_comparada.append({
                        'atributo_nombre': atributo,
                        'atributo_estado':'checked',
                        'atributo_label': tupla[2],
                        'atributo_nivel': tupla[3],
                        'atributo_orden': tupla[4]
                    })
                    encontrado = True
                    break
            # Si no se encuentra, añade un diccionario con atributo_estado vacio
            if not encontrado:
                 lista_comparada.append({
                        'atributo_nombre': atributo,
                        'atributo_estado':'',
                        'atributo_label': '',
                        'atributo_nivel': None,
                        'atributo_orden': None
                    })
        print('**** lista comparada: ', lista_comparada)

        # Ordenar por 'atributo_nivel' y luego por 'atributo_orden', colocando los None al final
        lista_ordenada = sorted(lista_comparada, key=lambda x: (x['atributo_nivel'] if x['atributo_nivel'] is not None else float('inf'), 
                                                        x['atributo_orden'] if x['atributo_orden'] is not None else float('inf')))
        # Imprimir la lista ordenada
        for item in lista_ordenada:
            print(item)

        # Ahora puedes retornar esta lista en un contexto o como una respuesta JSON
        return JsonResponse(lista_ordenada, safe=False)  # Ejemplo para retornar como JSON
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

def Nueva_venta(request, ticket):
    print('Nueva_venta: ', ticket)    
    #ventas = Venta.objects.filter(venta_ticket=ticket, venta_estado__in=['P', 'V']).order_by('-venta_fecha')
    ventas = Venta.objects.filter(venta_ticket=ticket, venta_estado__in=['P', 'V']).select_related('ticket').order_by('-venta_fechaRegistro')
    ticket_precio_total = ventas.first().ticket.ticket_precioTotal if ventas.exists() else 0    

    if ticket != 0:
        ticket_obj = Ticket.objects.get(ticket_numero=ticket) 
        ticket_id = ticket_obj.ticket_id        
        
    #print('ticket_id: ', ticket_id)

    if request.method == 'GET':
        print('method: ', request.method)
        if ticket == 0:  # Si se recibe 0, es una nueva venta
            # Genera el nuevo ticket        
            ticket_numero = Obtener_ticket()            
            # Guarda el nuevo ticket en la sesión
            request.session['ticket'] = ticket_numero
            # Redirige a la misma vista con el nuevo ticket en la URL
            return redirect('nueva_venta', ticket=ticket_numero)
        else:
            # Si no es 0, se trata de una recarga, entonces usa el ticket de la sesión
            ticket_numero = request.session.get('ticket', 0)
    
    if request.method == 'POST':
        print('method: ', request.method)        
        ticket_numero = ticket
        #ventas = Venta.objects.filter(venta_ticket=ticket_numero, venta_estado='P').order_by('-venta_fecha')
        form = VentaForm(request.POST)
        try:
            if form.is_valid():
                producto_nombre = request.POST.get('producto')            
                try:
                    producto = Producto.objects.get(producto_nombre=producto_nombre)
                except Producto.DoesNotExist:
                    return render(request, 'venta.html', {'error': 'Producto no encontrado.', 'form': form })
                
                # Obtener la instancia del Ticket basado en el número de ticket
                try:
                    ticket_instancia = Ticket.objects.get(ticket_numero=ticket_numero)
                except Ticket.DoesNotExist:
                    return render(request, 'venta.html', {'error': 'Ticket no encontrado.', 'form': form })

                nueva_venta = form.save(commit=False)
                nueva_venta.producto = producto
                nueva_venta.ticket = ticket_instancia
                nueva_venta.venta_estado = 'P'
                nueva_venta.venta_fechaRegistro = timezone.now()
                nueva_venta.venta_ticket = ticket_numero
                
                nueva_venta.save()            
                
                response = Actualizar_precio_total_ticket(request, ticket_instancia.ticket_id)  

                # Verificar si la respuesta es JSON y contiene un error
                if isinstance(response, JsonResponse):
                    response_data = json.loads(response.content)
                    if response_data.get('status') == 'error':
                        print(f"Error: {response_data.get('message')}")
                    else:
                        print(f"Success: {response_data.get('message')}")     

                return redirect('nueva_venta', ticket=ticket_numero)            
                #return render(request, 'nueva_venta.html', {'form': form, 'ticket_numero': ticket_numero, 'ventas': ventas})            
            else:
                print('form.is_valid() -> not')
        except Exception as e:
            print('Error: ', e)

    # Renderizar la plantilla con el número de ticket
    #return render(request, 'nueva_venta.html', {'ticket_numero': ticket_numero,'ventas': ventas})
    return render(request, 'nueva_venta.html', {
        'ticket_numero': ticket_numero, 
        'ventas': ventas, 
        'ticket_precio_total': ticket_precio_total, 
        'ticket_id': ticket_id
        })

def Buscar_producto(request):
    consulta = request.GET.get('q', '')    
    if consulta:
        productos = Producto.objects.filter(producto_nombre__icontains=consulta)        
        results = list(productos.values('producto_id', 'producto_nombre', 'producto_precio_uni'))    
    else:
        results = []
    
    #print('Buscar_producto: ' ,results)
    return JsonResponse(results, safe=False)

def Obtener_ticket():
    # Obtener el máximo valor de ticket_numero, si no hay registros, iniciar en 1
    max_ticket_numero = Ticket.objects.aggregate(max_numero=models.Max('ticket_numero'))['max_numero']
    if max_ticket_numero is None:
        max_ticket_numero = 1  # Iniciar en 1 si no hay registros
    else:
        max_ticket_numero += 1  # Incrementar en 1 para el nuevo ticket
        
    # Asignar los valores para el nuevo ticket
    ticket_numero = max_ticket_numero
    ticket_fecha = timezone.now()  # Usar la fecha y hora del servidor de aplicaciones
    ticket_estado = 'ASIGNADO'

    # Crear una nueva instancia de Ticket
    nuevo_ticket = Ticket(
        ticket_numero = ticket_numero,
        ticket_fechaCreacion = ticket_fecha,
        ticket_estado = ticket_estado
    )

    # Guardar el nuevo ticket en la base de datos
    nuevo_ticket.save()
    return ticket_numero

def Quitar_venta(request, venta_id):
    print('Quitar_venta')
    if request.method == 'POST':
        try:
            venta = Venta.objects.get(venta_id=venta_id)
            venta.venta_estado = 'Q'
            venta.save()
            return JsonResponse({'success': True})
        except Venta.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Venta no encontrada'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

def Actualizar_venta(request):
    try:
        data = json.loads(request.body)
        venta_id = data.get('venta_id')
        nueva_cantidad = data.get('venta_cantidad')
        nuevo_total = data.get('venta_precioTotal')

        venta = Venta.objects.get(pk=venta_id)
        venta.venta_cantidad = nueva_cantidad
        venta.venta_precioTotal = nuevo_total
        venta.save()

        return JsonResponse({'status': 'success', 'message': 'Venta actualizada correctamente'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
    
def Actualizar_precio_total_ticket(request, ticket_id):
    try:
        # Obtener la instancia del Ticket basado en ticket_id
        ticket = get_object_or_404(Ticket, pk=ticket_id)

        # Filtrar las ventas relacionadas con el ticket y estado 'P' o 'V'
        ventas_filtradas = Venta.objects.filter(ticket=ticket, venta_estado__in=['P', 'V'])

        # Calcular la suma total del campo venta_precioTotal de las ventas filtradas
        precio_total = ventas_filtradas.aggregate(Sum('venta_precioSubTotal'))['venta_precioSubTotal__sum'] or 0

        # Redondear a dos decimales
        precio_total = round(precio_total, 2)

        # Actualizar el campo ticket_precioTotal del Ticket
        ticket.ticket_precioTotal = precio_total
        ticket.save()

        #return JsonResponse({'status': 'success', 'message': 'precio total actualizado correctamente'})
        return JsonResponse({'status': 'success', 'ticket_precioTotal': ticket.ticket_precioTotal, 'message': 'precio total actualizado correctamente'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

def Actualizar_subTotal_total(request):
    try:
        data = json.loads(request.body)
        id_venta = data.get('venta_id')
        cantidad = data.get('venta_cantidad')        
        id_ticket = data.get('ticket_id')
        producto_id = data.get('producto_id')        
        
        producto = Producto.objects.get(producto_id=producto_id)
        producto_precioUni = producto.producto_precio_uni               
        subTotal = (producto_precioUni * int(cantidad))       
        subTotal = round(subTotal, 2)
        
        Venta.objects.filter(venta_id=id_venta).update(venta_cantidad=cantidad, venta_precioSubTotal=subTotal)        
        
        # Filtrar las ventas relacionadas con el ticket y estado 'P' o 'V' y calcular la suma del sub total 
        precio_total = Venta.objects.filter(ticket_id=id_ticket, venta_estado__in=['P', 'V']).aggregate(Sum('venta_precioSubTotal'))['venta_precioSubTotal__sum'] or 0        
        precio_total = round(precio_total, 2)        
        
        Ticket.objects.filter(ticket_id=id_ticket).update(ticket_precioTotal=precio_total)
        
        venta_reg = Venta.objects.filter(venta_id=id_venta).select_related('ticket')       

        # Crear una lista de diccionarios con los campos deseados
        venta_list = []
        for venta in venta_reg:          
            venta_dict = {
                'venta_id': venta.venta_id,                           
                'venta_subTotal': venta.venta_precioSubTotal,               
                'ticket_precioTotal': venta.ticket.ticket_precioTotal,                                
            }           
            venta_list.append(venta_dict)        

        return JsonResponse({'status': 'success', 'message': 'Venta actualizada correctamente', 'venta': venta_list})        
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})    

def Nuevo_ingreso(request):               
    #ingresos = Ingreso.objects.filter(ingreso_estado__in=['P', 'V']).order_by('-ingreso_fecha')   
    ingresos = Ingreso.objects.filter(ingreso_estado__in=['P']).order_by('-ingreso_fecha')  
    print ("total:" ,ingresos.count())
    
    if request.method == 'GET':
        print('metodo (Nuevo_ingreso) -> método', request.method)
    if request.method == 'POST':  
        print('metodo (Nuevo_ingreso) -> método', request.method)      

        form = IngresoForm(request.POST)   

        if form.is_valid():
            print('form is valid')
            #producto_nombre = request.POST.get('producto')  
            producto_id = request.POST.get('producto')  
            #print(f'Producto enviado: {producto_nombre}')  # Depuración  
            
            # Obtener la instancia del producto
            try:
                #producto_instancia = Producto.objects.get(producto_nombre=producto_nombre)
                producto_instancia = Producto.objects.get(producto_id=producto_id)
                
                # Continuar guardando el formulario si el producto se encuentra
                #print ('antes form.save')
                nuevo_ingreso = form.save(commit=False)
                #print ('despues  form.save')
                nuevo_ingreso.ingreso_fecha = timezone.now()
                nuevo_ingreso.ingreso_estado = 'P'
                nuevo_ingreso.producto = producto_instancia
                nuevo_ingreso.ingreso_referencia = 'Pendiente'

                try:
                    nuevo_ingreso.save()
                    messages.success(request, 'El producto ha sido agregado correctamente.')
                    print('Ingreso guardado con éxito')
                    return redirect('nuevo_ingreso')  # Redirige después de guardar

                except Exception as e:
                    # Error al guardar el ingreso
                    print(f'Error al guardar el ingreso: {e}')
                    messages.error(request, f'Error al guardar el ingreso, por favor intente nuevamente. {e}')

                '''
                print ('antes save')
                nuevo_ingreso.save()
                print ('despues save')
                #mensaje = 'Ingreso guardado con éxito'
                messages.success(request, 'El producto ha sido agregado correctamente.')
                print('Ingreso guardado con éxito')
                return redirect('nuevo_ingreso')  
                '''       

            except Producto.DoesNotExist:
                print('Producto no encontrado')          
        else:            
            # Mostrar detalles de los errores del formulario
            print('form is not valid')
            print(form.errors)  # Imprimir los errores específicos del formulario
    
    for ingreso in ingresos:
        ingreso.ingreso_fecha_formateada = DateFormat(localtime(ingreso.ingreso_fecha)).format('Y/m/d H:i')

    print('ejecucion de render')
    return render(request, 'ingreso.html', {'ingresos': ingresos, 'total_ingreso': ingresos.count()})

def Quitar_ingreso(request, ingreso_id):   
    try:         
        Ingreso.objects.filter(ingreso_id=ingreso_id).update(ingreso_estado='Q', 
            ingreso_fechaEliminacion=timezone.now())

        return JsonResponse({'message': 'Ingreso eliminado correctamente.'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)    

def Nuevo_ingreso2(request, producto_id):
    if request.method == 'GET':
        try:
            # Obtener la instancia del producto
            producto_instancia = Producto.objects.get(producto_id=producto_id)

            # Crear un nuevo registro en la tabla ingreso
            nuevo_ingreso = Ingreso.objects.create(
                ingreso_fecha=timezone.now(),  # Fecha actual
                ingreso_estado='P',  # Estado por defecto
                producto=producto_instancia,
                ingreso_referencia='Pendiente',  # Referencia predeterminada
                ingreso_fechaCompra=timezone.now(), # Valor predeterminado explícito              
                ingreso_comprador='comprador01', # Valor predeterminado explícito              
                ingreso_categoriaFechaVto=0,  # Valor predeterminado explícito              
            )

            # Retornar la respuesta exitosa con el ID del ingreso
            return JsonResponse({
                'message': 'Ingreso registrado correctamente.',
                'ingreso_id': nuevo_ingreso.ingreso_id,
                'ingreso_fecha' : DateFormat(localtime(nuevo_ingreso.ingreso_fecha)).format('Y/m/d H:i'),                
                'ingreso_producto': nuevo_ingreso.producto.producto_nombre,
                'ingreso_categoriaFechaVto': nuevo_ingreso.ingreso_categoriaFechaVto,
                'success': True
            }, status=200)

        except Producto.DoesNotExist:
            return JsonResponse({'error': 'Producto no encontrado.'}, status=404)
        except DatabaseError as e:
            return JsonResponse({'error': 'Error al registrar ingreso.', 'detalle': str(e)}, status=500)
        except Exception as e:
            return JsonResponse({'error': 'Error desconocido.', 'detalle': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido.'}, status=405)

'''
def Incluir_inventario(request, ingreso_id):
    try:
        ingreso = Ingreso.objects.get(ingreso_id=ingreso_id) 
        producto_id = ingreso.producto_id
        print('producto_id -> ', producto_id)
        
        Ingreso.objects.filter(producto=producto_id, ingreso_estado='V').update(ingreso_estado='C', 
            ingreso_fechaCierre=timezone.now()) 
                
        Ingreso.objects.filter(ingreso_id=ingreso_id).update(ingreso_estado='V', 
            ingreso_fechaInventario=timezone.now())
        
        return JsonResponse({'message': 'Ingreso eliminado correctamente.'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)    
'''

def Guardar_venta(request):
    print('Guardar_venta')
    if request.method == 'POST':
        data = json.loads(request.body)
        ticket_numero = data.get('ticket')
        venta_estado = data.get('estado')
        try:
            with transaction.atomic():
                ventas = Venta.objects.filter(venta_ticket=ticket_numero, venta_estado='P').select_related('ticket')
                
                if not ventas.exists():
                    return JsonResponse({'error': 'No se encontraron ventas pendientes para este ticket'}, status=404)

                ventas_detalles = []
                for venta in ventas:
                    response = Registra_inventario('VENTA', None, venta.venta_id, venta.venta_cantidad)

                    # Depuración: imprimir el tipo de respuesta y código
                    print('response.status_code:', response.status_code)
                    print('response.content:', response.content)  # Imprime el contenido crudo de la respuesta
                    print('response.headers:', response.headers)  # Imprime los encabezados

                    if response.status_code != 201:
                        try:
                            # Intentar decodificar el contenido como JSON usando json.loads()
                            print('Intentando decodificar JSON...')
                            error_data = json.loads(response.content.decode('utf-8'))  # Decodificar la respuesta a JSON
                            error_msg = error_data.get('error', 'Desconocido')
                            print('error_msg:', error_msg)  # Depuración: imprimir el mensaje de error si se decodifica
                        except json.JSONDecodeError:
                            # Si no es un JSON válido, capturar el texto de la respuesta
                            print('No es un JSON válido, obteniendo texto...')
                            error_msg = response.text
                            print('error_msg:', error_msg)  # Depuración: imprimir el contenido textual de la respuesta

                        # Lanzar excepción con el mensaje de error
                        raise Exception('Error al registrar el inventario: ' + error_msg)                        

                    Venta.objects.filter(venta_id=venta.venta_id).update(
                        venta_estado=venta_estado,
                        venta_fecha=timezone.now()
                    )

                    venta_dict = {
                        'venta_id': venta.venta_id,
                        'producto_nombre': venta.producto.producto_nombre,
                        'venta_cantidad': venta.venta_cantidad,
                        'venta_precioUnitario': venta.venta_precioUnitario,
                        'venta_precioTotal': venta.venta_precioSubTotal,
                        'venta_fecha': timezone.now().strftime('%Y/%m/%d %H:%M:%S'),
                        'ticket_numero': venta.ticket.ticket_numero,
                        'ticket_precioTotal': venta.ticket.ticket_precioTotal,
                        'ticket_fechaCreacion': venta.ticket.ticket_fechaCreacion.strftime('%Y/%m/%d %H:%M:%S'),
                    }
                    ventas_detalles.append(venta_dict)

                return JsonResponse({
                    'success': True,
                    'ventas_detalles': ventas_detalles,
                    'venta_fecha': timezone.now().strftime('%d/%m/%Y %H:%M:%S'),
                    'ticket_numero': ticket_numero,
                    'precio_total': ventas[0].ticket.ticket_precioTotal
                }, status=200)

        except Exception as e:
            print('Exception:', str(e))  # Depuración: imprimir la excepción
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

def Inventario_ingreso(request, ingreso_id):
    if request.method == 'POST':
        try:
            # Iniciar una transacción para garantizar que todas las operaciones sean atómicas
            with transaction.atomic():
                #print('debug: ingreso_id-> ' ,ingreso_id)
                lista = []
                datos_dic = {}
                
                # Recuperar el ingreso o retornar un error 404 si no se encuentra
                ingreso = get_object_or_404(Ingreso, ingreso_id=ingreso_id)
                producto_id = ingreso.producto.producto_id
                
                ingreso_fecha = localtime(ingreso.ingreso_fecha)                
                fecha_formateada = ingreso_fecha.strftime("%Y/%m/%d %H:%M")

                #print('debug: producto_id-> ' ,producto_id)
                
                ingreso_ant = Ingreso.objects.filter(producto=producto_id, ingreso_estado='V').first()                                          
                if ingreso_ant is None:                    
                    datos_dic.update({'ingreso_costoU_ant': 0, 'ingreso_porcentajeG_ant': 0, 'ingreso_ganancia_ant': 0, 'ingreso_precioU_ant':0,
                                      #'ingreso_fecha':0
                                      })  
                else:
                    datos_dic.update({
                        'ingreso_costoU_ant': ingreso_ant.ingreso_costoUnitario,                           
                        'ingreso_porcentajeG_ant': ingreso_ant.ingreso_porcentajeGanancia,                           
                        'ingreso_ganancia_ant': ingreso_ant.ingreso_ganancia,                           
                        'ingreso_precioU_ant': ingreso_ant.ingreso_precioUnitario,   
                        #'ingreso_fecha' : fecha_formateada,                     
                    })     


                datos_dic['ingreso_fecha'] = fecha_formateada       

                # Actualizar a estado 'C' los ingresos del producto que están vigentes
                Ingreso.objects.filter(producto=producto_id, ingreso_estado='V').update(
                    ingreso_estado='C', 
                    ingreso_fechaCierre=timezone.now()
                )
                #print('debug: update a estado C-> Ok')

                # Recuperar los datos enviados via POST
                try:
                    data = json.loads(request.body)
                except json.JSONDecodeError:
                    return JsonResponse({'error': 'Datos inválidos'}, status=400)

                # Extraer y validar los campos
                costo_unitario = data.get('costoUnitario')
                porcentaje_ganancia = data.get('porGanancia')
                ganancia = data.get('ganancia')
                precio_nuevo = data.get('precioNuevo')
                unidad = data.get('unidad')
                costo_total = data.get('costoTotal')
                fecha_compra = data.get('fechaCompra')
                print('fecha de compra: ' ,data.get('fechaCompra'))

                # Validar que los campos obligatorios estén presentes y no sean nulos
                required_fields = [costo_unitario, porcentaje_ganancia, ganancia, precio_nuevo, unidad, costo_total]
                if None in required_fields:
                    return JsonResponse({'error': 'Faltan campos obligatorios en la solicitud'}, status=400)

                # Actualizar el ingreso con los nuevos valores
                ingreso.ingreso_estado = 'V'
                ingreso.ingreso_fechaInventario = timezone.now()
                ingreso.ingreso_costoUnitario = costo_unitario
                ingreso.ingreso_porcentajeGanancia = porcentaje_ganancia
                ingreso.ingreso_ganancia = ganancia
                ingreso.ingreso_precioUnitario = precio_nuevo
                ingreso.ingreso_unidad = unidad
                ingreso.ingreso_costoTotal = costo_total
                ingreso_comprador = 'Comprador-' + str(ingreso_id)
                ingreso.ingreso_comprador = ingreso_comprador
                ingreso.ingreso_fechaCompra = fecha_compra                                
                ingreso.save()
                #print('debug: update ingreso-> Ok')
                
                datos_dic.update({
                    'ingreso_costoU_upd': costo_unitario,                           
                    'ingreso_porcentajeG_upd': porcentaje_ganancia, 
                    'ingreso_ganancia_upd': ganancia,                 
                    'ingreso_precioU_upd': precio_nuevo,                         
                    'ingreso_unidad': unidad, 
                    'ingreso_costo_total': costo_total,
                    'ingreso_comprador': ingreso_comprador,
                    'ingreso_fecha_compra': fecha_compra.replace("-", "/")
                }) 

                # Actualizar el nuevo precio del producto 
                Producto.objects.filter(producto_id=producto_id).update(
                    producto_precio_uni=precio_nuevo,                  
                )
                #print('debug: update precio producto-> Ok')                

                item_nuevos = Item.objects.filter(ingreso=ingreso_id, item_estado='N').count()                 
                # Registrar los items en la tabla ingreso_producto
                items = data.get('items', [])
                
                # Verificar si 'items' está vacío
                if not items and item_nuevos == 0:
                    raise Exception('La lista de items está vacía')     
                
                
                
                # Recorrer la lista items
                for item in items:
                    #print('item-> ', item['item'], 'fecha->', item['fecha'], 'codigo->', item['codigo'])                    
                     # Manejar el valor vacío para la fecha
                    fecha_vencimiento = None

                    if item['fecha']:                        
                        # Convertir la fecha a un objeto datetime "naive" y establecer la hora a mediodía para evitar cambios de fecha
                        fecha_naive = datetime.strptime(item['fecha'], '%Y-%m-%d')
                        fecha_naive = fecha_naive.replace(hour=12, minute=0, second=0)  # Configurar hora a mediodía
                        fecha_vencimiento = timezone.make_aware(fecha_naive, timezone.get_current_timezone())
                    #print(fecha_naive, ' - ',fecha_vencimiento)          


                    try:        
                        updated_rows = Item.objects.filter(item_id=item['item']).update(item_fechaVencimiento=fecha_vencimiento, item_estado='A', item_descripcion='Alta')
                        if updated_rows == 0:
                            print ('error: no se encontro el item')     
                        else:
                            print ('item ',item['item'],' actualizado')
                    except DatabaseError as e:            
                        return JsonResponse({'error': 'Error al actualizar el item', 'detalle': str(e)}, status=500)                                   
                
                '''
                try:
                    # Verificar si 'items' está vacío
                    if not items:
                        raise Exception('La lista de items está vacía')                    
                    # Recorrer la lista items
                    for item in items:    
                        print('item-> ',item['item'], 'fecha-> ' ,item['fecha'], 'codigo-> ',item['codigo'])            
                        # Manejar el valor vacío para la fecha
                        fecha_vencimiento = item['fecha'] if item['fecha'] else None
                        nuevo_item = IngresoProducto(
                            ingreso_id = ingreso_id,
                            iproducto_codigo = item['item'],
                            iproducto_fechaVencimiento=fecha_vencimiento,
                            #iproducto_codigo = item['codigo'],
                            iproducto_estado = 'D',
                            iproducto_descripcion = 'Disponible'
                        )
                        nuevo_item.save()
                    print('debug: insert items -> Ok')                     
                except Exception as e:
                        return JsonResponse({'message': str(e), 'success': False})    
                '''
                # Llamar a la función Registra_inventario bajo la misma transacción
                response = Registra_inventario('INGRESO', ingreso_id, '', unidad)                
                #print('response: ',response.content)
                data = json.loads(response.content.decode('utf-8'))  # Decodificar la respuesta a JSON                
                #print('data: ',data)

                inventario_id_ok = data.get('inventario_id')
                ingreso_id_ok = data.get('ingreso_id') 
                print(inventario_id_ok,ingreso_id_ok)                
                
                inventario = Inventario.objects.filter(inv_id=inventario_id_ok).first()  
                
                inventario_fecha = localtime(inventario.inv_fecha)                
                inventario_fecha_format = inventario_fecha.strftime("%Y/%m/%d %H:%M")                                                        
                
                datos_dic.update({
                    'inv_modo': inventario.inv_modo,                           
                    'inv_fecha': inventario_fecha_format,                           
                    'inv_cantidad': inventario.inv_cantidad,     
                    'inv_cantidad_anterior': inventario.inv_cantidadAnterior, 
                    'inv_cantidad_actual': inventario.inv_cantidadActual, 
                    'inv_estado': inventario.inv_estado                 
                })              

                if response.status_code != 201:  # Si ocurre algún error, abortar la transacción
                    raise Exception('Error al registrar el inventario')
                
                #print('debug: insert inventario -> Ok')  
                lista.append(datos_dic)                
                return JsonResponse({'message': 'Ingreso registrado en el inventario correctamente.', 'success': True, 'ingreso_id': ingreso_id, 'lista': lista}, status=200)
        
        except Ingreso.DoesNotExist:
            return JsonResponse({'error': 'Ingreso no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def Registra_inventario(modo, ingreso_id, venta_id, cantidad):
    try:
        # Calcular la cantidad actual según el modo (INGRESO o VENTA)
        if modo == 'INGRESO':            
            # Recuperar el ingreso con el ingreso_id proporcionado
            ingreso = Ingreso.objects.filter(ingreso_id=ingreso_id).first()
            if ingreso is None:
                return JsonResponse({'error': 'Ingreso no encontrado'}, status=404)
            producto_id = ingreso.producto.producto_id
            
            # Buscar un inventario vigente (inv_estado = 'V')
            inventario = Inventario.objects.filter(producto=producto_id, inv_estado='V').first()
            
            # Determinar la cantidad anterior
            cantidad_anterior = inventario.inv_cantidadActual if inventario else 0
            
            cantidad_actual = cantidad_anterior + cantidad
            
            # Actualizar el estado 'Vigente' a 'Anterior' en el inventario actual (si existe)
            if inventario:
                inventario.inv_estado = 'A'
                inventario.save()
            
            # Crear un nuevo registro en la tabla Inventario
            nuevo_inventario = Inventario.objects.create(
                producto=ingreso.producto,
                inv_modo=modo,
                inv_fecha=timezone.now(),
                inv_cantidad=cantidad,
                inv_cantidadAnterior=cantidad_anterior,
                inv_cantidadActual=cantidad_actual,
                inv_estado='V'
            )            
     
            # Crear el registro en la tabla InventarioIngreso
            InventarioIngreso.objects.create(
                inv=nuevo_inventario,
                ingreso=ingreso
            )

            # Actualizar el stock del producto
            Producto.objects.filter(producto_id=producto_id).update(
                producto_stock=cantidad_actual
            )            
            
        elif modo == 'VENTA':
            # Recuperar la venta con la venta_id proporcionado
            venta = Venta.objects.filter(venta_id=venta_id).first()
            if venta is None:
                return JsonResponse({'error': 'Venta no encontrada'}, status=404)
            producto_id = venta.producto.producto_id

            # Buscar un inventario vigente (inv_estado = 'V')
            inventario = Inventario.objects.filter(producto=producto_id, inv_estado='V').first()
            
            # Verificar que haya inventario disponible
            if inventario is None:
                return JsonResponse({'error': 'No hay productos en el inventario'}, status=404)
            
            cantidad_anterior = inventario.inv_cantidadActual

            # Validar que la cantidad solicitada no sea mayor a la disponible
            if cantidad > cantidad_anterior:
                return JsonResponse({'error': 'No se puede vender más de lo que hay en inventario'}, status=400)

            cantidad_actual = cantidad_anterior - cantidad

            # Actualizar el estado 'Vigente' a 'Anterior' en el inventario actual (si existe)
            if inventario:
                inventario.inv_estado = 'A'
                inventario.save()
            
            # Crear un nuevo registro en la tabla Inventario
            nuevo_inventario = Inventario.objects.create(
                producto=venta.producto,
                inv_modo=modo,
                inv_fecha=timezone.now(),
                inv_cantidad=cantidad,
                inv_cantidadAnterior=cantidad_anterior,
                inv_cantidadActual=cantidad_actual,
                inv_estado='V'
            )
            
            # Crear el registro en la tabla InventarioVenta
            InventarioVenta.objects.create(
                inv=nuevo_inventario,
                venta=venta
            )
            
            # Actualizar el stock del producto
            Producto.objects.filter(producto_id=producto_id).update(
                producto_stock=cantidad_actual
            )
        
        else:
            return JsonResponse({'error': 'Modo inválido'}, status=400)

        # Respuesta diferenciada según el modo
        return JsonResponse({
            'message': 'Inventario registrado exitosamente',
            'inventario_id': nuevo_inventario.inv_id,
            'ingreso_id': ingreso_id if modo == 'INGRESO' else '',
            'venta_id': venta_id if modo == 'VENTA' else ''
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)     

def Obtiene_precioU_vigente_nuevo1(request, ingreso_id):    
    try:
        ingreso_lista = []       
        ingreso_nuevo = Ingreso.objects.filter(ingreso_id=ingreso_id).select_related('producto')
        
        for ingreso in ingreso_nuevo:
            producto_id = ingreso.producto_id  
            producto_nombre = ingreso.producto.producto_nombre  
            ingreso_dic = {
                'i_estado': ingreso.ingreso_estado,
                'i_costo_unitario': ingreso.ingreso_costoUnitario,
                'i_porcentaje_ganancia': ingreso.ingreso_porcentajeGanancia,
                'i_precio_unitario': ingreso.ingreso_precioUnitario
            }
            ingreso_lista.append(ingreso_dic)

        
        # Filtra por estado y id del producto
        ingreso_vigente = Ingreso.objects.filter(ingreso_estado__in=['V'], producto_id=producto_id)      

        for ingreso in ingreso_vigente:
            ingreso_dic = {
                'i_estado': ingreso.ingreso_estado,
                'i_costo_unitario': ingreso.ingreso_costoUnitario,
                'i_porcentaje_ganancia': ingreso.ingreso_porcentajeGanancia,
                'i_precio_unitario': ingreso.ingreso_precioUnitario
            }
            ingreso_lista.append(ingreso_dic)
        
        print(ingreso_lista)
        
        return JsonResponse({'status': 'success', 'ingreso': ingreso_lista, 'producto_nombre': producto_nombre})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def Obtiene_precioU_vigente_nuevo(request, ingreso_id):
    try:
        ingreso_nuevo = Ingreso.objects.filter(ingreso_id=ingreso_id, ingreso_estado='P').first() 
         # Convertir la fecha a la zona horaria local
        ingreso_fecha = localtime(ingreso_nuevo.ingreso_fecha)
        #fecha_formateada = ingreso_fecha.strftime("%Y/%m/%d %H:%M:%S")
        fecha_formateada = ingreso_fecha.strftime("%Y/%m/%d %H:%M")
        print('--------------- ingreso_fecha: ',ingreso_fecha, '-> ',ingreso_nuevo.ingreso_id, 'format -> ',fecha_formateada)
        
        producto_id = ingreso_nuevo.producto.producto_id
        ingreso_vigente = Ingreso.objects.filter(producto_id=producto_id, ingreso_estado='V').first() 
        
        items_nuevos = Item.objects.filter(ingreso=ingreso_id).exclude(item_estado='B').count()
        
        #ingreso_vigente = Ingreso.objects.filter(ingreso_id=ingreso_id, ingreso_estado='V').first()        
        #ingreso_nuevo = Ingreso.objects.filter(ingreso_id=ingreso_id, ingreso_estado='P').first()

        #if not ingreso_vigente or not ingreso_nuevo:
        if not ingreso_nuevo:    
            return JsonResponse({'error': 'No se encontraron datos para el ingreso.'}, status=400)

        producto_nombre = ingreso_vigente.producto.producto_nombre if ingreso_vigente else ingreso_nuevo.producto.producto_nombre
        ingreso_unidad = ingreso_nuevo.ingreso_unidad
        ingreso_costo_unidad = ingreso_nuevo.ingreso_costoTotal
        
        #print('unidad:', ingreso_unidad , 'costo total: ', ingreso_costo_unidad)

        ingreso_dic = {
            'vigente': {
                'i_estado': ingreso_vigente.ingreso_estado,
                'i_costo_unitario': ingreso_vigente.ingreso_costoUnitario,
                'i_porcentaje_ganancia': ingreso_vigente.ingreso_porcentajeGanancia,
                'i_ganancia': ingreso_vigente.ingreso_ganancia,
                'i_precio_unitario': ingreso_vigente.ingreso_precioUnitario,
            } if ingreso_vigente else {},
            'nuevo': {
                'i_estado': ingreso_nuevo.ingreso_estado,
                'i_costo_unitario': ingreso_nuevo.ingreso_costoUnitario,
                'i_porcentaje_ganancia': ingreso_nuevo.ingreso_porcentajeGanancia,
                'i_ganancia': ingreso_nuevo.ingreso_ganancia,
                'i_precio_unitario': ingreso_nuevo.ingreso_precioUnitario,
                'ingreso_fecha_test': ingreso_fecha,
                #'ingreso_fecha_compra': localtime(timezone.now()).strftime("%Y/%m/%d")
                'ingreso_fecha_compra': localtime(timezone.now()).strftime("%Y-%m-%d"),
                'item': items_nuevos
                
            } if ingreso_nuevo else {}
        }
            
        print(ingreso_dic)
        return JsonResponse({'status': 'success', 'ingreso': ingreso_dic, 'producto_nombre': producto_nombre, 'unidad': ingreso_unidad, 'costo_total': ingreso_costo_unidad})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def Actualizar_ingreso(request, ingreso_id):
    if request.method == 'POST':
        try:
            # Obtener datos enviados por Ajax
            datos = json.loads(request.body)
            unidad = datos.get('unidad')
            costo_unitario = datos.get('costoUnitario')
            costo_total = datos.get('costoTotal')
            
            # Actualizar el ingreso en la base de datos
            ingreso = Ingreso.objects.get(pk=ingreso_id)
            ingreso.ingreso_unidad = unidad
            ingreso.ingreso_costoUnitario = costo_unitario
            ingreso.ingreso_costoTotal = costo_total
            ingreso.save()

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)    


def Actualizar_ingreso2(request, ingreso_id):
    # Si el metodo es POST
    if request.method == 'POST':
        try:
            # Recuperar los datos enviados desde Ajax via POST
            data = json.loads(request.body)
            costo_unitario = data.get('costo_unitario')
            porcentaje_ganancia = data.get('rentabilidad')
            unidad = data.get('unidad_entrante')
            costo_total = data.get('costo_total')           

            if data.get('unidad_entrante') == '':
                unidad = None

            if data.get('costo_unitario') == '':
                costo_unitario = None

            if data.get('rentabilidad') == '':
                porcentaje_ganancia = None
            
           
            try:
                 # Convertir valores a los tipos adecuados
                costo_unitario = Decimal(costo_unitario)  # Convertir a Decimal
                unidad = int(unidad)  # Convertir a entero              
            except (ValueError, TypeError) as e:
                print(f"Error en la conversión de datos: {e}")
                            
            item_nuevos = Item.objects.filter(ingreso=ingreso_id, item_estado='N').count()
            print('cantidad items: ' ,item_nuevos)
            if (item_nuevos > 0):
                unidad = item_nuevos                                
                #costo_total = unidad * costo_unitario   # Calcular el costo total         
                
                if (unidad and costo_unitario):
                    costo_total = unidad * costo_unitario   # Calcular el costo total         
                else:
                    costo_total = costo_total
                
            print(f"costo total: {costo_total}")
            
            ingreso = Ingreso.objects.get(pk=ingreso_id)
            ingreso.ingreso_unidad = unidad
            ingreso.ingreso_costoUnitario = costo_unitario
            ingreso.ingreso_porcentajeGanancia = porcentaje_ganancia
            ingreso.ingreso_ganancia = data.get('utilidad')
            ingreso.ingreso_precioUnitario = data.get('precio_unitario')
            #ingreso.ingreso_costoTotal = data.get('costo_total')
            ingreso.ingreso_costoTotal = costo_total

            ingreso.save()
            return JsonResponse({'success': True})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)    


'''def Actualizar_producto(request):    
    #productos = Producto.objects.select_related('subcategoria').order_by('subcategoria__subcategoria_nombre')
    #productos = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('subcategoria__subcategoria_nombre')    
    #productos = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('producto_nombre')        
    productos = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')        
    return render(request, 'productos_upd.html', {'productos': productos})'''

'''def Listar_producto(request):
    # Obtener los valores únicos de 'producto_gondola' y ordenarlos
    gondolas = Producto.objects.values('producto_gondola').distinct().order_by('producto_gondola')

    productos_list = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')    
    
    # Configura el paginador, aquí mostramos 10 productos por página
    paginator = Paginator(productos_list, 10)  # 10 productos por página
    
    # Obtiene el número de página de la solicitud GET
    page_number = request.GET.get('page')
    
    # Obtiene los productos de la página actual
    productos = paginator.get_page(page_number)    

    # Pasar las gondolas al template
    return render(request, 'productos_upd.html', {'productos': productos, 'gondolas': gondolas})'''


'''def Listar_producto(request):
    # Obtener los valores únicos de 'producto_gondola' para el select
    gondolas = Producto.objects.values('producto_gondola').distinct().order_by('producto_gondola')
    
    # Obtener el parámetro 'gondola' desde la URL
    gondola_seleccionada = request.GET.get('gondola')
    
    if gondola_seleccionada:
        # Filtrar los productos por la góndola seleccionada
        productos_list = Producto.objects.filter(producto_gondola=gondola_seleccionada).select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')
    else:
        # Mostrar todos los productos si no se selecciona una góndola
        productos_list = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')

    # Configurar paginación
    paginator = Paginator(productos_list, 10)
    page_number = request.GET.get('page')
    productos = paginator.get_page(page_number)

    # Pasar las góndolas y el valor seleccionado al template
    return render(request, 'productos_upd.html', {
        'productos': productos,
        'gondolas': gondolas,
        'selected_gondola': gondola_seleccionada,
    })'''


'''def Listar_producto(request):    
    # Obtener los valores únicos de 'producto_gondola' y ordenarlos
    gondolas = Producto.objects.values('producto_gondola').distinct().order_by('producto_gondola')       
    gondola_seleccionada = None

    # Verificar si la solicitud es Ajax y si es POST
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == "POST":
        # Solo intenta cargar el cuerpo de la solicitud si está presente
        if request.body:
            try:
                data = json.loads(request.body)  # Cargar el cuerpo de la solicitud como JSON
                gondola_seleccionada = data.get('gondola')                
            except json.JSONDecodeError:
                print("Error decodificando el cuerpo de la solicitud")
    
     # Filtrar los productos según la góndola seleccionada
    if gondola_seleccionada:
        productos_list = Producto.objects.filter(producto_gondola=gondola_seleccionada).select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')
    else:        
        productos_list = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')
    
    print(len(productos_list))

    # Configurar el paginador (10 productos por página)
    paginator = Paginator(productos_list, 10)
    page_number = request.GET.get('page')
    productos = paginator.get_page(page_number)
    
    # Verificar si la solicitud es Ajax
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':        
        # Renderizar los productos a un template parcial (solo la tabla)        
        productos_html = render_to_string('productos_table.html', {'productos': productos})
        return JsonResponse({'productos_html': productos_html})
        
    # Si no es una solicitud Ajax, renderizar la página completa
    return render(request, 'productos_upd.html', {'productos': productos, 'gondolas': gondolas})'''

def Listar_producto(request):
    print("Listar_producto")
    # Obtener los valores únicos de 'producto_gondola' y ordenarlos
    gondolas = Producto.objects.values('producto_gondola').distinct().order_by('producto_gondola')       
    gondola_seleccionada = None

    # Verificar si la solicitud es Ajax y si es POST
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == "POST":
        # Solo intenta cargar el cuerpo de la solicitud si está presente
        if request.body:
            try:
                data = json.loads(request.body)  # Cargar el cuerpo de la solicitud como JSON
                gondola_seleccionada = data.get('gondola')                
            except json.JSONDecodeError:
                print("Error decodificando el cuerpo de la solicitud")
    
    # Filtrar los productos según la góndola seleccionada
    if gondola_seleccionada:
        productos_list = Producto.objects.filter(producto_gondola=gondola_seleccionada).select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')
    else:        
        productos_list = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')

       
    total_productos_list = len(productos_list)
    
    # Configurar el paginador (10 productos por página)
    paginator = Paginator(productos_list, 10)
    page_number = request.GET.get('page')
    productos = paginator.get_page(page_number)
    
    # Verificar si la solicitud es Ajax
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        # Renderizar los productos y los botones de paginación en templates parciales
        productos_html = render_to_string('productos_table.html', {'productos': productos })
        paginacion_html = render_to_string('paginacion2.html', {'productos': productos })
        return JsonResponse({
            'productos_html': productos_html,
            'paginacion_html': paginacion_html,
            'total': total_productos_list
        })

    # Si no es una solicitud Ajax, renderizar la página completa
    return render(request, 'productos_upd.html', {'productos': productos, 'gondolas': gondolas, 'total': total_productos_list})


'''
def Listar_producto(request):
    gondolas = Producto.objects.values('producto_gondola').distinct().order_by('producto_gondola')    
    gondola_seleccionada = None

    # Verificar si la solicitud es Ajax y si es POST
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == "POST":
        if request.body:
            try:
                data = json.loads(request.body)  # Cargar el cuerpo de la solicitud como JSON
                gondola_seleccionada = data.get('gondola')                
            except json.JSONDecodeError:
                print("Error decodificando el cuerpo de la solicitud")

    # Filtrar los productos según la góndola seleccionada
    if gondola_seleccionada:
        productos_list = Producto.objects.filter(producto_gondola=gondola_seleccionada).select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')
    else:        
        productos_list = Producto.objects.select_related('subcategoria', 'subcategoria__categoria').order_by('-producto_fechaActualizacion')

    # Configurar el paginador (10 productos por página)
    paginator = Paginator(productos_list, 10)
    page_number = request.GET.get('page') or 1
    productos = paginator.get_page(page_number)

    # Verificar si la solicitud es Ajax
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':        
        productos_html = render_to_string('productos_table.html', {'productos': productos})
        paginacion_html = render_to_string('paginacion.html', {'productos': productos})
        return JsonResponse({'productos_html': productos_html, 'paginacion_html': paginacion_html})
    
    # Si no es una solicitud Ajax, renderizar la página completa
    return render(request, 'productos_upd.html', {'productos': productos, 'gondolas': gondolas})

'''
    
'''
def Actualizar_producto_nombre(request):
    # Si el método es POST
    if request.method == 'POST':
        # Para recuperar los datos enviados via POST
        data = json.loads(request.body)
        # Recupera los valores
        producto_id = data.get('producto_id')
        producto_nombre = data.get('producto_nombre') 
        try:
            Producto.objects.filter(producto_id=producto_id).update(producto_nombre=producto_nombre, 
                                                                    producto_fechaActualizacion=timezone.now())                 
            return JsonResponse({'message': 'producto actualizado correctamente.', 'success': True}, status=200)
        except Exception as e:
            print('Exception:', str(e))  # Depuración: imprimir la excepción
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)
    '''

def Actualizar_nombre_producto(request):
    
    if request.method == 'POST':
        data = json.loads(request.body)
        producto_id = data.get('producto_id')
        producto_nombre = data.get('producto_nombre') 
        producto_nombre_tipo = data.get('producto_nombre_tipo') 
        producto_nombre_marca = data.get('producto_nombre_marca') 
        producto_nombre_desc = data.get('producto_nombre_desc') 
        producto_nombre_medida = data.get('producto_nombre_medida') 

        try:
            # Actualizar el nombre del producto
            Producto.objects.filter(producto_id=producto_id).update(
                producto_nombre=producto_nombre, 
                producto_nombreTipo=producto_nombre_tipo, 
                producto_nombreMarca=producto_nombre_marca,                
                producto_nombreDesc=producto_nombre_desc,
                producto_nombreMedida=producto_nombre_medida,                
                producto_fechaActualizacion=timezone.now()
            )
            
            # Recuperar el producto actualizado
            producto_actualizado = Producto.objects.get(producto_id=producto_id)
            
            # Renderizar el template de la fila con el producto actualizado
            fila_html = render_to_string('producto_fila.html', {'producto': producto_actualizado})
            
            return JsonResponse({
                'message': 'producto actualizado correctamente.', 
                'success': True,
                'fila_html': fila_html
            }, status=200)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

def Crear_items (request, ingreso_id, unidades):
    #ingreso_id = 128
    print ('Debug: codigo de ingreso ',ingreso_id)
    
    #items_existentes = Item.objects.filter(ingreso=ingreso_id).count()  
    items_existentes = Item.objects.filter(ingreso=ingreso_id).exclude(item_estado='B').count()

    print ('Debug: cantidad de items existentes ',items_existentes)    
    
    ingreso = Ingreso.objects.filter(ingreso_id=ingreso_id).first()     
    producto_id = ingreso.producto_id
    print ('Debug: codigo del producto ',producto_id)   

    producto = Producto.objects.filter(producto_id=producto_id).first()
    producto_sigla = producto.producto_sigla
    print ('Debug: sigla del producto ',producto_sigla)
    # no existen items
    if (items_existentes == 0):
        # crea nuevos items
        print ('Debug: items ',items_existentes)      
        print ('Debug: Creacion de ',unidades,' items en la base de datos')        
        if (unidades != 0):
            # Recorrer la cantidad de unidades            
            for item in range(unidades):        
                max_correlativo = Item.objects.filter(producto_id=producto_id).aggregate(max_correlativo=Max('item_correlativo'))['max_correlativo']                               
                if max_correlativo is None:
                    max_correlativo = 1
                else:
                    max_correlativo = max_correlativo + 1
                    #max_correlativo += 1 # incrementa en 1                    

                item_codigo_valor = producto_sigla + '-' + str(max_correlativo)
                nuevo_item = Item(
                    ingreso_id = ingreso_id,
                    producto_id = producto_id,                  
                    item_codigo = item_codigo_valor,
                    item_fechaVencimiento = None,
                    item_estado = 'N',
                    item_descripcion = 'Nuevo',
                    item_correlativo = max_correlativo,
                    item_fechaRegistro = timezone.now(),
                    item_fechaBaja = None
                    )
                nuevo_item.save()
                print('insert-> ',item)                
        else:
            print ('Debug: el valor de unidades es cero')    
    else:
        print ('Debug: no se crean items nuevos porque ya existen items existentes')
        if (unidades != items_existentes):
            print ('Debug: unidades entrantes es distinto a items existentes')
            if (unidades > items_existentes):
                print ('Debug: unidades entrantes es mayor a items existentes')
                unidades_faltantes = unidades - items_existentes                
                print ('Debug: Creacion de ',unidades_faltantes,' faltantes')
                for item in range(unidades_faltantes):                            
                    max_correlativo = Item.objects.filter(producto_id=producto_id).aggregate(max_correlativo=Max('item_correlativo'))['max_correlativo']                               
                    if max_correlativo is None:
                        max_correlativo = 1
                    else:
                        max_correlativo = max_correlativo + 1
                        #max_correlativo += 1 # incrementa en 1      
                    
                    item_codigo_valor = producto_sigla + '-' + str(max_correlativo)
                    nuevo_item = Item(
                        ingreso_id = ingreso_id,
                        producto_id = producto_id,
                        item_codigo = item_codigo_valor,
                        item_fechaVencimiento = None,
                        item_estado = 'N', 
                        item_descripcion = 'Nuevo',
                        item_correlativo = max_correlativo,
                        item_fechaRegistro = timezone.now(),
                        item_fechaBaja = None
                    )
                    nuevo_item.save()
                    print('insert-> ',item)

            else:
                print ('Debug: unidades entrantes es menor a items existentes')
                unidades_sobrantes = items_existentes - unidades
                #items_order_desc = Item.objects.filter(ingreso=ingreso_id).order_by('-item_id')
                items_existentes_order_desc = Item.objects.filter(ingreso=ingreso_id).exclude(item_estado='B').order_by('-item_id')
                for item in items_existentes_order_desc:
                    id = item.item_id
                    try: 
                        updated_rows = Item.objects.filter(item_id=id).update(item_estado='B', item_descripcion='Baja', item_fechaBaja=timezone.now())
                        if updated_rows == 0:
                            print ('error: no se encontro el item')
                        else:
                            print ('correcto: item actualizado')
                    except DatabaseError as e:            
                        return JsonResponse({'error': 'error al actualizar el item', 'detalle': str(e)}, status=500) 
                    
                    unidades_sobrantes = unidades_sobrantes - 1
                    #unidades_sobrantes -= 1  # Decrementa unidades sobrantes                    
                    if (unidades_sobrantes == 0):                        
                         break  # Termina el bucle for
        else:
            print ('Debug: unidades entrantes es igual a items existentes')
    
    item_out_list = []
    item_out_list2 = []
    
    items_out = Item.objects.filter(ingreso=ingreso_id).exclude(item_estado='B').order_by('item_id')
    for item in items_out:
        item_out_list.append(item.item_codigo)
        item_list = []
        item_list.append(item.item_id)
        item_list.append(item.item_codigo)
        
        fecha_formateada = None
        if item.item_fechaVencimiento is not None:
            fecha_formateada = item.item_fechaVencimiento.strftime("%Y-%m-%d")
        item_list.append(fecha_formateada)
        item_out_list2.append(item_list)

    return JsonResponse({
        'message': 'proceso realizado correctamente.', 
        'item_out_list': item_out_list,
        'item_out_list2': item_out_list2,
        'success': True        
    }, status=200)


def Actualiza_sigla_producto(request):    
    productos = Producto.objects.filter().order_by('producto_id')   
    print ('cantidad de productos: ',productos.count())    
    for producto in productos:
        producto_id = producto.producto_id        
        producto_nombre = producto.producto_nombre
        # print ('producto id: ',producto_id, '- producto nombre: ', producto_nombre)       

        if producto_nombre:
            palabras_producto = producto_nombre.split(' ')
            # Extrae la primera letra de cada palabra
            primeras_letras = [palabra[0] for palabra in palabras_producto if palabra]
            # print ('primeras_letras: ',primeras_letras)
            # print ('tamaño primeras_letras ', len(primeras_letras))           
            
            if len(primeras_letras) == 1:
                sigla = primeras_letras[0] + str(producto_id)                              
            else:
                sigla = primeras_letras[0] + primeras_letras[1] + str(producto_id)
        # print ('sigla: ',sigla)        
        try:        
            updated_rows = Producto.objects.filter(producto_id = producto_id).update(producto_sigla = sigla)
            if updated_rows == 0:
                print ('error: no se encontro el producto')     
            else:
                print ('producto id -> ',producto_id, ' actualizado')
        except DatabaseError as e:            
            return JsonResponse({'error': 'Error al actualizar el producto', 'detalle': str(e)}, status=500)             

    return JsonResponse({'message': 'proceso realizado correctamente.', 
        'success': True        
    }, status=200)


def Actualiza_fecha_vencimientos (request, ingreso_id):    
    if request.method == 'POST':
        print ('metodo ', request.method)
        data = json.loads(request.body)
        nueva_fecha = data.get('nueva_fecha_vencimiento')
        print ('nueva_fecha ' , nueva_fecha)
        
        try:
            updated_rows = Item.objects.filter(ingreso=ingreso_id, item_estado='N').update(item_fechaVencimiento=nueva_fecha)                     
            if updated_rows == 0:
                print ('error al actualizar')
        except DatabaseError as e:            
                return JsonResponse({'error': 'Error al actualizar', 'detalle': str(e)}, status=500) 
        #items = Item.objects.filter(ingreso=ingreso_id).exclude(item_estado='B')            
        
        items = Item.objects.filter(ingreso=ingreso_id, item_estado='N').values_list('item_fechaVencimiento', flat=True)
        items_serialized = [item.strftime("%Y-%m-%d") for item in items if item]


        '''
        # QuerySet
        items = Item.objects.filter(ingreso=ingreso_id).exclude(item_estado='B')        
        # Serializar los datos del QuerySet
        #items_serialized = list(items.values('item_id', 'item_fechaVencimiento', 'item_codigo', 'item_estado'))
        update_items = []
        for item in items:
            try:
                updated_row = Item.objects.filter(ingreso=ingreso_id).update(item_fechaVencimiento=nueva_fecha)                     
                if updated_row != 0:                    
                    print ('item ', item.item_id , ': actualizado')
                    # Obtener el campo `item_fechaVencimiento` para el registro de id igual item_id
                    fecha_vencimiento = Item.objects.filter(item_id=item.item_id).values_list('item_fechaVencimiento', flat=True).first()
                    fecha_vtos_format = fecha_vencimiento.strftime("%Y-%m-%d")
                    update_items.append(fecha_vtos_format)
                else:
                    print ('error: no se encontro el item')     
            except DatabaseError as e:            
                return JsonResponse({'error': 'Error al actualizar el item', 'detalle': str(e)}, status=500) 
        '''

        print ('update_items: ',updated_rows)
        return JsonResponse({
            'message': 'Proceso realizado correctamente.', 
            'success': True,
            'items' : items_serialized, 
            #'update_items' : update_items
            'update_items' : updated_rows
        }, status=200)
    
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def limpia_fecha_vencimientos (request, ingreso_id):
    # Si el método es GET
    if request.method == 'GET':
        # Filtrar los items por ingreso_id y estado nuevo 
        item_nuevos = Item.objects.filter(ingreso=ingreso_id, item_estado='N').count()
        try:   
            updated_rows = Item.objects.filter(ingreso=ingreso_id, item_estado='N').update(item_fechaVencimiento=None)       
            if updated_rows == 0:    
                print ('error: no se encontro algun item')  
        except DatabaseError as e:            
            return JsonResponse({'error': 'Error al actualizar el item', 'detalle': str(e)}, status=500) 
        
        if updated_rows == item_nuevos:
            return JsonResponse({
                'message': 'Actualizacion correcta de todos los items.', 
                'success': True,
                'item': item_nuevos,                            
                'item_update': updated_rows
            }, status=200)
        else:
            return JsonResponse({
                'message': 'Actualizacion incorrecta de todos los items.', 
                'success': False,
                'item': item_nuevos,                            
                'item_update': updated_rows
            }, status=200) 
    return JsonResponse({'error': 'Método no permitido.'}, status=405)


def Actualiza_fecha_vencimiento (request, item_id, fecha_vto):
    #fecha_vto = '&&!!"33'
    # el metodo es GET?
    if request.method == 'GET':
        try:
            updated_row = Item.objects.filter(item_id=item_id).update(item_fechaVencimiento=fecha_vto)        
            if updated_row == 0:
                print ('error: no se encontro el item')  
                return JsonResponse({
                    'error': 'No se encontró el item.',
                    'success': False
                }, status=404)
        except DatabaseError as e:            
            return JsonResponse({
                'error': 'Error al actualizar el item',
                'detalle': str(e)
                }, status=500) 
    
    return JsonResponse({'message': 'proceso realizado correctamente.', 
        'success': True        
    }, status=200)

def Actualiza_categoria_fechaVto (request, ingreso_id, cat_fechaVto):    
    if request.method == 'GET':
        try:
            updated_row = Ingreso.objects.filter(ingreso_id=ingreso_id).update(ingreso_categoriaFechaVto=cat_fechaVto)
            if updated_row == 0:
                print ('Actualización no realizada.')  
                return JsonResponse({
                    'error': 'No se encontró el registro',
                    'success': False
                }, status=404)
        except DatabaseError as e:            
            return JsonResponse({
                'error': 'Error al actualizar',
                'detalle': str(e)
                }, status=500) 
    
    return JsonResponse({'message': 'El campo ingreso_categoriaFechaVto de la tabla ingreso fue actualizado correctamente.', 
        'success': True        
    }, status=200)

def Nuevo_producto(request):
    # El metodo es GET
    if request.method == 'GET':
        print ('método es: ',request.method)
        categorias = Categoria.objects.all()        
        return render(request,'form_producto.html', {
                            'categorias': categorias })        

def Obtiene_subcategoria(request, categoria):    
    if request.method == 'GET':        
        #subcategorias = Subcategoria.objects.filter(categoria=categoria)  # Filtra las subcategorías por la categoria        
        subcategorias = Subcategoria.objects.filter(categoria=categoria).values('id', 'subcategoria_nombre')  # Incluye los campos necesarios       
        #print('subcategoria: ',subcategorias)
        return JsonResponse({
            'message': 'proceso realizado correctamente.', 
            'success': True,
            #'subcategorias':  serialize('json', subcategorias)  # Serializa el QuerySet a JSON
            'subcategorias':  list(subcategorias)  # Convierte el QuerySet a una lista
        }, status=200)
    
def Detalle_subcategoria(request, subcategoria):
    # si el método es GET
    if request.method == 'GET':
        subcategoria = Subcategoria.objects.filter(id=subcategoria).first()
        tipo = subcategoria.subcategoria_tipo
        marca = subcategoria.subcategoria_marca
        medida = subcategoria.subcategoria_medida
        
        return JsonResponse({'message': 'consulta exitosa.', 
            'success': True,
            'scategoria_tipo': tipo, 
            'scategoria_marca': marca, 
            'scategoria_medida': medida
        }, status=200)




        
        
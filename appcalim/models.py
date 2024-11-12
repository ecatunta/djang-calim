from django.db import models
from django.utils import timezone


# Create your models here.
class Categoria (models.Model):
    categoria_nombre = models.CharField(max_length=100)
    categoria_icon = models.CharField(max_length=50, null=True)    

    def __str__(self):
        return self.categoria_nombre
    class Meta:
        db_table = 'categoria'

class Subcategoria(models.Model):
    subcategoria_nombre = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE) 
    subcategoria_imagen = models.ImageField(upload_to='imagenes/subcategoria/')       

    def __str__(self):
        return self.subcategoria_nombre
    class Meta:
        db_table = 'subcategoria'

class Producto(models.Model):
    producto_id = models.BigAutoField(primary_key=True)
    subcategoria = models.ForeignKey(Subcategoria, on_delete=models.CASCADE)
    producto_gondola = models.BigIntegerField(null=True, blank=True)
    producto_nombre = models.CharField(max_length=200)
    producto_precio_uni = models.FloatField(null=True, blank=True)
    producto_stock = models.FloatField(null=True, blank=True)
    producto_fechaActualizacion = models.DateTimeField(null=True, blank=True)
    # Nuevos campos
    producto_nombreTipo = models.CharField(max_length=100, null=True, blank=True)
    producto_nombreMarca = models.CharField(max_length=100, null=True, blank=True)
    producto_nombreDesc = models.CharField(max_length=150, null=True, blank=True)
    producto_nombreMedida = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.producto_nombre
    class Meta:
        db_table = 'producto'


class Higiene(models.Model):
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, primary_key=True)
    higiene_marca = models.CharField(max_length=50, blank=True, null=True)
    higiene_talla = models.CharField(max_length=30, blank=True, null=True)
    higiene_peso_inicio = models.FloatField(blank=True, null=True)
    higiene_peso_fin = models.FloatField(blank=True, null=True)
    higiene_tiempo_proteccion = models.IntegerField(blank=True, null=True)
    higiene_jaba_paquete = models.IntegerField(blank=True, null=True)
    higiene_jaba_peso = models.FloatField(blank=True, null=True)
    higiene_jaba_precio = models.FloatField(blank=True, null=True)
    higiene_paquete_unidad = models.IntegerField(blank=True, null=True)
    higiene_paquete_medida = models.CharField(max_length=100, blank=True, null=True)
    higiene_paquete_peso = models.FloatField(blank=True, null=True)
    higiene_paquete_precio = models.FloatField(blank=True, null=True)
    higiene_color = models.CharField(max_length=50, blank=True, null=True)
    higiene_descripcion = models.CharField(max_length=250, blank=True, null=True)

    def __str__(self):
        return f"{self.producto.producto_nombre} - Higiene"    
    class Meta:
        db_table = 'higiene'  # Esto es opcional si deseas mantener el nombre de la tabla en minúsculas.


class ParametroAtributo(models.Model):    
    patributo_id = models.BigAutoField(primary_key=True)  # Cambiado a BigAutoField para ser autoincremental
    subcategoria = models.ForeignKey(Subcategoria, on_delete=models.CASCADE)  # Relación con Subcategoria
    patributo_nombre = models.CharField(max_length=200)  # Campo VARCHAR2(200)
    patributo_tabla = models.CharField(max_length=100)  # Campo VARCHAR2(100)
    patributo_label = models.CharField(max_length=200, null=True)  # Campo VARCHAR2(200)
    patributo_nivel = models.IntegerField(blank=True, null=True)
    patributo_orden = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.patributo_nombre
    class Meta:
        db_table = 'parametro_atributo'  # Nombre de la tabla en la base de datos


class Ticket(models.Model):
    ticket_id = models.BigAutoField(primary_key=True)
    ticket_numero = models.BigIntegerField()
    ticket_fechaCreacion = models.DateTimeField()
    ticket_estado = models.CharField(max_length=100)
    ticket_precioTotal = models.FloatField(null=True, blank=True)  
    ticket_fechaFinalizacion = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Ticket {self.ticket_numero} - {self.ticket_estado}"

    class Meta:
        db_table = 'ticket'  # Nombre de la tabla en la base de datos

class Venta(models.Model):
    venta_id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
      # Agregar la clave foránea a Ticket
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, default=1)  # Usa un valor por defecto
    venta_estado = models.CharField(max_length=1)
    venta_fechaRegistro = models.DateTimeField(null=True, blank=True)
    venta_precioUnitario = models.FloatField()
    venta_cantidad = models.BigIntegerField(null=True, blank=True)
    venta_precioSubTotal = models.FloatField()
    venta_ticket = models.BigIntegerField(null=True, blank=True)
    venta_fecha = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Venta {self.venta_id}"
    class Meta:
        db_table = 'venta'  # Nombre de la tabla en la base de datos


class Inventario(models.Model):
    inv_id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    inv_modo = models.CharField(max_length=100)
    inv_fecha = models.DateTimeField(null=True, blank=True)
    inv_cantidad = models.BigIntegerField()
    inv_cantidadAnterior = models.BigIntegerField()    
    inv_cantidadActual = models.BigIntegerField()  
    inv_estado = models.CharField(max_length=1)         

    def __str__(self):
        return f"Inventario {self.inv_id}"
    class Meta:
        db_table = 'inventario'  # Nombre de la tabla en la base de datos

    
class Ingreso(models.Model):
    ingreso_id = models.BigAutoField(primary_key=True)
    # Agregar la clave foránea a Producto
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    ingreso_unidad = models.BigIntegerField(null=True, blank=True)
    ingreso_costoUnitario = models.FloatField(null=True, blank=True)
    ingreso_costoTotal = models.FloatField(null=True, blank=True)
    ingreso_fecha = models.DateTimeField()
    ingreso_fechaInventario = models.DateTimeField(null=True, blank=True)
    ingreso_fechaEliminacion = models.DateTimeField(null=True, blank=True)    
    ingreso_fechaCierre = models.DateTimeField(null=True, blank=True)    
    ingreso_porcentajeGanancia = models.FloatField(null=True, blank=True)
    ingreso_ganancia = models.FloatField(null=True, blank=True)
    ingreso_precioUnitario = models.FloatField(null=True, blank=True)
    ingreso_estado = models.CharField(max_length=50)         
    ingreso_referencia = models.CharField(max_length=200, null=True, blank=True)  
    #ingreso_fechaCompra = models.DateTimeField()
    ingreso_fechaCompra = models.DateTimeField(default=timezone.now)
    ingreso_comprador = models.CharField(max_length=100, default='comprador01')

    def __str__(self):
        return f"Venta {self.ingreso_id}"
    class Meta:
        db_table = 'ingreso'  # Nombre de la tabla en la base de datos

class IngresoProducto(models.Model):
    iproducto_id = models.BigAutoField(primary_key=True)
    ingreso = models.ForeignKey(Ingreso, on_delete=models.CASCADE)
    iproducto_codigo = models.CharField(max_length=100, null=True, blank=True)
    iproducto_fechaVencimiento = models.DateTimeField(null=True, blank=True)
    iproducto_estado = models.CharField(max_length=1)
    iproducto_descripcion = models.CharField(max_length=100, null=True, blank=True)
    def __str__(self):
        return f'{self.iproducto_id} - {self.iproducto_codigo or "Sin código"}'

    class Meta:
        db_table = 'ingreso_producto'  # Nombre exacto de la tabla en la base de datos


class InventarioVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    inv = models.ForeignKey(Inventario, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('venta', 'inv')
        db_table = 'inventario_venta'  # Nombre de la tabla en la base de datos

    def __str__(self):
        return f"InventarioVenta: Venta {self.venta_id}, Inventario {self.inv_id}"


class InventarioIngreso(models.Model):
    inv = models.ForeignKey(Inventario, on_delete=models.CASCADE)
    ingreso = models.ForeignKey(Ingreso, on_delete=models.CASCADE)

    class Meta:
        db_table = 'inventario_ingreso'
        unique_together = ('inv', 'ingreso')

    def __str__(self):
        return f"Inventario {self.inv_id} - Ingreso {self.ingreso_id}"

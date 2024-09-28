document.addEventListener('DOMContentLoaded', function () {

    const botonGuardar = document.getElementById('guardar-venta-btn');
    const tabla = document.querySelector('table tbody');
    const ticketId = document.getElementById('ticket_id').value;
    //alert(ticket_numero);

    document.getElementById('id_producto').focus();
    document.getElementById('id_venta_cantidad').value = 1;

    /* autocomplete*/
    document.getElementById('id_producto').addEventListener('input', function () {
        const query = this.value;
        const suggestions = document.getElementById('suggestions');

        if (query.length < 3) {
            suggestions.style.display = 'none';
            return;
        }

        fetch(`/buscar/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('buscar...', data);
                suggestions.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(product => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = product.producto_nombre;
                        li.dataset.productId = product.producto_id;
                        li.addEventListener('click', function () {
                            document.getElementById('id_producto').value = this.textContent;
                            document.getElementById('id_producto_id').value = product.producto_id;
                            document.getElementById('id_venta_precioUnitario').value = product.producto_precio_uni;
                            document.getElementById('id_venta_cantidad').value = 1;
                            document.getElementById('id_venta_precioTotal').value = document.getElementById('id_venta_cantidad').value * product.producto_precio_uni;
                            document.getElementById('btn_adicionar').disabled = false;
                            suggestions.style.display = 'none';
                        });
                        suggestions.appendChild(li);
                    });
                    suggestions.style.display = 'block';
                } else {
                    suggestions.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    /*calcula precio total en el formulario de ventas*/
    document.getElementById('id_venta_cantidad').addEventListener('input', function () {
        const cantidad = parseFloat(this.value);
        const precioUnitarioElement = document.getElementById('id_venta_precioUnitario');
        const precioUnitario = parseFloat(precioUnitarioElement.value);
        const precioTotalElement = document.getElementById('id_venta_precioTotal');

        // Validar que cantidad no sea negativa, que sea un número y que precioUnitario tenga un valor
        if (isNaN(cantidad) || cantidad < 0) {
            //alert("Por favor, ingrese un número válido que no sea negativo.");
            console.log("Por favor, ingrese un número válido que no sea negativo.")
            this.value = ''; // Limpiar el campo si la entrada es inválida
            //precioTotalElement.value = ''; // Limpiar el precio total
            precioTotalElement.value = 0; // Limpiar el precio total
            return;
        }

        if (isNaN(precioUnitario) || precioUnitario <= 0) {
            //alert("Por favor, asegúrese de que el precio unitario esté establecido correctamente.");
            console.log("Por favor, asegúrese de que el precio unitario esté establecido correctamente.")
            this.value = ''; // Limpiar la cantidad si no hay un precio unitario válido
            precioTotalElement.value = ''; // Limpiar el precio total
            return;
        }

        // Calcular el precio total y mostrarlo en el campo correspondiente
        const precioTotal = cantidad * precioUnitario;
        precioTotalElement.value = precioTotal.toFixed(2); // Redondear a 2 decimales
    });


    const inputsCantidad = document.querySelectorAll('input[data-role="cantidad"]');

    inputsCantidad.forEach(input => {
        input.addEventListener('input', function (event) { 
            let cantidad = event.target.value.trim();
            let ventaId = input.getAttribute('data-venta-id');
            let ticketId = input.getAttribute(`data-ticket-id`);
            let productoId = input.getAttribute(`data-producto-id`);            
            let subTotal = document.getElementById(`subtotal-${ventaId}`);

            // Expresión regular para verificar si el valor es un número válido (positivo)
            const esNumeroValido = /^(\d+(\.\d+)?|\.\d+)$/.test(cantidad);

            // Si el valor no es un número válido o es negativo, muestra una alerta y limpia el input
            if (!esNumeroValido || parseFloat(cantidad) < 0) {
                // alert('Por favor ingresa un número válido, positivo y mayor o igual a 0');
                console.log('Por favor ingresa un número válido, positivo y mayor o igual a 0')
                event.target.value = ''; // Limpia el input
                subTotal.innerText = '0.00'; // Asigna 0.00 al sub total
            } else {                
                // Llamar a la función actualizar_subTotal_total y manejar la respuesta con .then()
                actualizar_subTotal_total(ventaId, cantidad, ticketId, productoId).then(data => {
                    console.log(data)
                    // Manipular la respuesta obtenida
                    if (data.status === 'success') {                        
                        let precioSubTotal
                        // Recorre los valores de la respuesta json 
                        data.venta.forEach(venta => {                                                        
                            document.getElementById('monto_total_label').textContent = venta.ticket_precioTotal;
                            precioSubTotal = venta.venta_subTotal                            
                            subTotal.textContent = precioSubTotal;                        
                        });          
                    } else {
                        console.error('Error al actualizar:', data.message);
                    }
                }).catch(error => {
                    console.error('Error al llamar a actualizar_subTotal_total:', error);
                });
            }
        });
    });


    document.getElementById('guardar-venta-btn').addEventListener('click', function () {
        // Obtener el número de ticket del atributo data-ticket
        const ticketNumero = this.getAttribute('data-ticket');

        // Enviar la solicitud fetch con el ticket
        fetch(`/guardar-venta/`, {
            method: 'POST',
            headers: {
                //'X-CSRFToken': '{{ csrf_token }}', // Asegúrate de que el token CSRF esté presente
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'estado': 'V',
                'ticket': ticketNumero
            })
        })
            /*.then(response => {
                if (response.ok) {               
                    location.reload();  // Refresca la página para mostrar los cambios
                } else {
                    alert('Error al guardar la venta');
                }
            });*/
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.success) {
                    document.getElementById('md_venta_fecha').textContent = data.venta_fecha;
                    document.getElementById('md_ticket_numero').textContent = data.ticket_numero;
                    document.getElementById('md_precio_total').textContent = 'Bs. ' + data.precio_total;
                    document.getElementById('md_total_neto').textContent = 'Bs. ' + data.precio_total;
                    // Mostrar la ventana modal
                    const ventasDetalles = data.ventas_detalles;

                    // Llenar la tabla dentro de la ventana modal
                    let tablaHtml = '';
                    ventasDetalles.forEach((venta) => {
                        tablaHtml += `
                    <tr>
                        <td>${venta.venta_cantidad}</td>
                        <td>${venta.producto_nombre}</td>
                        <td>${venta.venta_precioUnitario.toFixed(2)}</td>
                        <td>${venta.venta_precioTotal.toFixed(2)}</td>
                    </tr> `;
                    });

                    document.getElementById('ventas-detalles-tabla').innerHTML = tablaHtml;

                    // Mostrar la ventana modal
                    const modal = new bootstrap.Modal(document.getElementById('ventaExitosaModal'));
                    modal.show();
                } else {
                    //alert('Error al guardar la venta ' +data.error);
                    alert(data.error);
                }
            }).catch((error) => {
                console.error('Error:', response.error);
            });
    });


    function actualizarVentaAjax(ventaId, nuevaCantidad, nuevoTotal) {
        fetch('/actualizar-venta/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'X-CSRFToken': getCSRFToken() // Asegúrate de enviar el token CSRF para la seguridad
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                venta_id: ventaId,
                venta_cantidad: nuevaCantidad,
                venta_precioTotal: nuevoTotal
            })
        })
            .then(response => {
                if (response.ok) {
                    //location.reload(); 
                    return response.json();
                }
                throw new Error('Error en la solicitud Ajax');
            })
            .then(data => {
                console.log('Venta actualizada con éxito:', data);
                // Aquí puedes añadir lógica para refrescar la tabla, si es necesario
            })
            .catch(error => {
                console.error('Error al actualizar la venta:', error);
            });
    }


    function actualizar_subTotal_total(ventaId, cantidad, ticketId, productoId) {
        //console.log('venta_id: ' ,ventaId, '\n cantidad: ' ,cantidad, '\n ticket_id: ',ticketId, '\n producto_id: ',productoId);
        return fetch('/actualizar-subTotal-total/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                venta_id: ventaId,
                venta_cantidad: cantidad,  
                ticket_id: ticketId,
                producto_id: productoId
            })
        }).then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
        /*.then(data => {
            console.log('Venta actualizada con éxito:', data);            
        })*/
        .catch(error => {
            console.error('Error al actualizar la venta:', error);
        });
    }

    function verificarTabla() {
        const tieneDatos = tabla.querySelectorAll('tr').length > 0;
        botonGuardar.disabled = !tieneDatos;
    }
    verificarTabla();
});


/*function actualizarMontoTotal(ticket_id) {
    console.log('actualizarMontoTotal() -> ticket_id=', ticket_id)

    var url = `/actualizar_precio_total/${ticket_id}/`;
    console.log('Fetch URL:', url);

    fetch(url, {
        method: 'GET',  // Usar método GET
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            if (data.status === 'success') {
                document.getElementById('monto_total_label').textContent = `Monto Total ($) ${data.ticket_precioTotal}`;
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error en actualizarMontoTotal:', error);
        });
}

function quitarVenta(venta_id, ticket_id) {
    console.log('quitarVenta() -> venta_id=', venta_id, 'ticket_id: ', ticket_id)

    if (confirm('¿Estás seguro de que deseas quitar esta venta?')) {
        fetch(`/quitar-venta/${venta_id}/`, {
            method: 'POST',
            headers: {
                //'X-CSRFToken': '{{ csrf_token }}', // Asegúrate de incluir el token CSRF
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'estado': 'Q' })
        }).then(response => {
            if (response.ok) {               
                actualizarMontoTotal(ticket_id);
                //location.reload();  // Refresca la página para mostrar los cambios
                await actualizarMontoTotal(ticket_id);  // Espera a que la función se complete
                location.reload();  // Refresca la página para mostrar los cambios
            } else {
                alert('Error al quitar la venta');
            }
        });
    }
}*/


async function quitarVenta(venta_id, ticket_id) {
    console.log('quitarVenta() -> venta_id=', venta_id, 'ticket_id: ', ticket_id);

    if (confirm('¿Estás seguro de que deseas quitar esta venta?')) {
        try {
            const response = await fetch(`/quitar-venta/${venta_id}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'estado': 'Q' })
            });

            if (response.ok) {
                await actualizarMontoTotal(ticket_id);  // Espera a que la función se complete
                // Ya no necesitas location.reload() aquí si todo funciona bien
                location.reload()
            } else {
                alert('Error al quitar la venta');
            }
        } catch (error) {
            console.error('Error en quitarVenta:', error);
        }
    }
}

async function actualizarMontoTotal(ticket_id) {
    console.log('actualizarMontoTotal() - ticket_id=', ticket_id);
    const url = `/actualizar_precio_total/${ticket_id}/`;
    console.log('Fetch URL:', url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Data received:', data);

        if (data.status === 'success') {
            //document.getElementById('monto_total_label').textContent = `Monto Total ($) ${data.ticket_precioTotal}`;
            document.getElementById('monto_total_label').textContent = data.ticket_precioTotal;
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error en actualizarMontoTotal:', error);
    }
}




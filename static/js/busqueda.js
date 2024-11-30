document.addEventListener('DOMContentLoaded', function () {
    const btnAdicionar = document.getElementById("btn_adicionar");
    const costoUnitarioInput = document.getElementById('id_ingreso_costoU');
    const costoTotalInput = document.getElementById('id_ingreso_costoT');
    // Seleccionar todos los botones de quitar
    const quitarIngreso = document.querySelectorAll('.ingreso_quitar');
    // Seleccionar todos los botones de inventario ingreso
    const inventarioIngreso = document.querySelectorAll('.inventario_ingreso');
    const suggestions = document.getElementById('suggestions');
    const input_producto = document.getElementById('producto');
    const capaAdicionar = document.getElementById('capa-adicionar');
    // Mostrar mensaje de éxito con animación
    const mensajeExito = document.getElementById('mensaje-exito');
    const btn_actualizarUnidad = document.getElementById('actualizar-unidad');
    const btn_generaItem = document.getElementById('genera-item');
    const btn_aceptar_ingreso = document.getElementById('pu_aceptar');
    const input_pu_unidad = document.getElementById('pu_unidad');
    const input_costo_nuevo = document.getElementById('pu_costoU_nuevo');
    const input_costo_actual = document.getElementById('pu_costoU_actual');
    const input_p_ganancia_nuevo = document.getElementById('pu_pGanancia_nuevo');
    const input_p_ganancia_actual = document.getElementById('pu_pGanancia_actual');
    const input_fecha_vencimiento = document.getElementById('fecha-vencimiento');
    const select_fecha_vencimiento = document.getElementById('select-fecha-vencimiento');
    const selectFechaVencimiento = document.getElementById('select-fecha-vencimiento');
    const modal_p_ingreso = new bootstrap.Modal(document.getElementById('ingresoPrecioUModal'));
    const modal_s_item = new bootstrap.Modal(document.getElementById('itemModal'));
    const modal_ingreso = document.getElementById('ingresoPrecioUModal');
    const span_n_precio_unidad = document.getElementById('pu_precioU_nuevo');
    const span_a_precio_unidad = document.getElementById('pu_precioU_actual');
    const span_n_ganancia_unidad = document.getElementById('pu_ganancia_nuevo');
    const span_n_costo_unidad = document.getElementById('pu_costo_nuevo');
    const span_a_ganancia_unidad = document.getElementById('pu_ganancia_actual');
    const strong_producto_nombre = document.getElementById('pu_producto_nombre');
    const tabla_items_body = document.getElementById('item-table-body');
    const tabla_items_body_rows = tabla_items_body.getElementsByTagName('tr'); // Obtener todas las filas
    const span_costo_total = document.getElementById('pu_costo_total');
    const btn_salir_modal_ingreso = document.getElementById('btn-salir-modal-ingreso');
    let alturaNavegador = window.innerHeight;
    const capa_spinner_items = document.getElementById('loading-overlay-items');
    const thead_total_items = document.getElementById('thead-total-items');
    const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
    //const modal_item_cerrar = document.getElementById('modal-items-cerrar');
    const notificacion_items = document.getElementById('notificacion-items');
    const modal_item_aceptar = document.getElementById('modal-items-aceptar');
    const loadingSpinner = document.getElementById('loading-spinner');
    const loadingTablaItems = document.getElementById('loading-overlay-tabla-items');
    const fechaVencimientoInput = document.getElementById('fecha-vencimiento');
    const tablaItemsBody = document.getElementById('item-table-body');
    // Selecciona la tabla ingreso
    const tabla_ingreso = document.getElementById('ingreso_tabla');
    // Selecciona la primera fila de la tabla ingreso
    const filaIngreso = tabla_ingreso.querySelector('tbody tr:first-child');

    const tableIngresoBody = document.getElementById('table-ingreso-body');
    const tableIngresoBody_row = tableIngresoBody.getElementsByTagName('tr');
    const itemFechaVto = document.getElementById('item-fv');

    let g_ganancia_unidad = 0;
    let g_precio_unidad = 0;
    let g_unidad_entrante = 0;
    let g_ingreso_id;
    let contador_inputs = 0;
    let g_nombre_producto = '';
    let selectedRow_ingreso = null;

    input_producto.value = '';

    // Selecciona el elemento por su ID
    const header = document.getElementById("header");
    // Obtiene la posición "top" relativa al viewport
    const topPosition = header.getBoundingClientRect().top;


    capaAdicionar.classList.add('locked');


    btn_actualizarUnidad.disabled = true;
    //btn_generaItem.disabled = true;

    if (filaIngreso) {
        // Columnas de la fila
        const columnasFilaIngreso = filaIngreso.querySelectorAll('td');

        if (mensajeExito && mensajeExito.textContent.trim() !== '') {
            // Aquí puedes realizar alguna acción adicional si el mensaje tiene valor.
            mensajeExito.classList.remove('hide');
            mensajeExito.classList.add('show');

            // Añadir la clase de resaltado a cada columna
            columnasFilaIngreso.forEach(columna => {
                columna.classList.add('highlight-cell');
            });

            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                mensajeExito.classList.remove('show');
                mensajeExito.classList.add('hide');

                columnasFilaIngreso.forEach(columna => {
                    columna.classList.remove('highlight-cell');
                    //columna.classList.add('restore-cell');
                });

            }, 5000); // 5 segundos

        } else {
            console.log('El elemento "mensaje-exito" no tiene un valor o no existe.');
        }
    }

    //Barra de busqueda
    /*
    document.getElementById('producto').addEventListener('input', function () {
        const query = this.value;
        const suggestions = document.getElementById('suggestions');

        if (query.length < 3) {
            suggestions.style.display = 'none';
            return;
        }
        fetch(`/buscar/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('buscar: ', data);
                suggestions.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(product => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = product.producto_nombre;
                        li.dataset.productId = product.producto_id;
                        li.addEventListener('click', function () {
                            document.getElementById('producto').value = this.textContent;
                            document.getElementById('id_producto_id').value = product.producto_id;
                            document.getElementById('id_ingreso_unidad').value = 1;
                            document.getElementById('id_ingreso_costoU').value = 0;
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
    */

    /*
    // Barra de búsqueda
    document.getElementById('producto').addEventListener('input', function () {
        const query = this.value;
        const suggestions = document.getElementById('suggestions');

        if (query.length < 3) {
            suggestions.style.display = 'none';
            return;
        }

        fetch(`/buscar/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('buscar: ', data);
                suggestions.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(product => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item d-flex align-items-center';
                        li.dataset.productId = product.producto_id;

                        // Crear el ícono de búsqueda
                        const icon = document.createElement('i');
                        icon.className = 'bi bi-search me-2'; // Clase de Bootstrap Icons y margen a la derecha

                        // Crear el texto del producto
                        const text = document.createElement('span');
                        text.textContent = product.producto_nombre;

                        // Agregar el ícono y el texto al elemento 'li'
                        li.appendChild(icon);
                        li.appendChild(text);

                        // Añadir evento al hacer clic en el elemento
                        li.addEventListener('click', function () {
                            document.getElementById('producto').value = this.textContent;
                            document.getElementById('id_producto_id').value = product.producto_id;
                            document.getElementById('id_ingreso_unidad').value = 1;
                            document.getElementById('id_ingreso_costoU').value = 0;
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
    */

    /*
    // Barra de búsqueda
    document.getElementById('producto').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const suggestions = document.getElementById('suggestions');

        if (query.length < 3) {
            suggestions.style.display = 'none';
            return;
        }

        fetch(`/buscar/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('buscar: ', data);
                suggestions.innerHTML = '';

                if (data.length > 0) {
                    data.forEach(product => {
                        const li = document.createElement('li');
                        //li.className = 'list-group-item';
                        li.className = 'list-group-item d-flex align-items-center';

                        // Resaltar el texto coincidente con negrita
                        const regex = new RegExp(`(${query})`, 'gi'); // Expresión regular para buscar el patrón
                        const highlightedText = product.producto_nombre.replace(regex, '<strong>$1</strong>'); // Reemplaza el patrón con el texto en negrita

                        li.innerHTML = `<i class="bi bi-search"></i> ${highlightedText}`; // Incluye el ícono de búsqueda y el texto resaltado
                        li.dataset.productId = product.producto_id;

                        li.addEventListener('click', function () {
                            document.getElementById('producto').value = this.textContent;
                            document.getElementById('id_producto_id').value = product.producto_id;
                            document.getElementById('id_ingreso_unidad').value = 1;
                            document.getElementById('id_ingreso_costoU').value = 0;
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
    */

    /*
    // Barra de búsqueda
    document.getElementById('producto').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const suggestions = document.getElementById('suggestions');

        if (query.length < 3) {
            suggestions.style.display = 'none';
            return;
        }

        fetch(`/buscar/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('buscar: ', data);
                suggestions.innerHTML = '';

                if (data.length > 0) {
                    data.forEach(product => {
                        const li = document.createElement('li');
                        //li.className = 'list-group-item';
                        li.className = 'list-group-item d-flex align-items-center';

                        // Resaltar el texto coincidente con negrita
                        const regex = new RegExp(`(${query})`, 'gi'); // Expresión regular para buscar el patrón
                        const parts = product.producto_nombre.split(regex); // Divide el texto en partes coincidentes y no coincidentes

                        // Construir el contenido del elemento li
                        li.innerHTML = `<i class="bi bi-search"></i> `;
                        parts.forEach(part => {
                            if (regex.test(part)) {
                                li.innerHTML += `<strong>${part}</strong>`; // Parte coincidente en negrita
                            } else {
                                li.innerHTML += `${part}`; // Parte no coincidente tal como está
                            }
                        });

                        li.dataset.productId = product.producto_id;

                        li.addEventListener('click', function () {
                            document.getElementById('producto').value = this.textContent;
                            document.getElementById('id_producto_id').value = product.producto_id;
                            document.getElementById('id_ingreso_unidad').value = 1;
                            document.getElementById('id_ingreso_costoU').value = 0;
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
    */

    // Barra de búsqueda
    document.getElementById('producto').addEventListener('input', function () {
        capaAdicionar.classList.add('locked');
        costoTotalInput.value = '';
        btnAdicionar.disabled = true;

        const query = this.value.trim().toLowerCase();
        const suggestions = document.getElementById('suggestions');

        if (query.length < 3) {
            suggestions.style.display = 'none';
            return;
        }

        //suggestions.innerHTML = '<li class="list-group-item">Cargando...</li>';

        // Mostrar un spinner de carga utilizando Bootstrap
        suggestions.innerHTML = `
            <li class="list-group-item text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <span class="ms-2">Buscando...</span>
            </li>`;

        suggestions.style.display = 'block';

        fetch(`/buscar/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log('buscar: ', data);
                suggestions.innerHTML = '';

                if (data.length > 0) {
                    data.forEach(product => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';

                        // Resaltar el patrón en el nombre del producto
                        const productName = product.producto_nombre;

                        // Crear una expresión regular para resaltar el patrón sin perder los espacios
                        const highlightedName = productName.replace(new RegExp(`(${query})`, 'gi'), '<strong>$1</strong>');
                        console.log(highlightedName)

                        // Agregar el ícono y el nombre resaltado
                        //li.innerHTML = `<i class="bi bi-search"></i> ${highlightedName}`;
                        li.innerHTML = `<p style='margin-bottom:0;'><i class="bi bi-search"></i> ${highlightedName}</p>`;
                        li.dataset.productId = product.producto_id;
                        li.addEventListener('click', function () {
                            document.getElementById('producto').value = product.producto_nombre;
                            document.getElementById('id_producto_id').value = product.producto_id;
                            document.getElementById('id_ingreso_unidad').value = 1;
                            document.getElementById('id_ingreso_costoU').value = 0;
                            document.getElementById('btn_adicionar').disabled = false;
                            suggestions.style.display = 'none';
                            capaAdicionar.classList.remove('locked');
                            btnAdicionar.disabled = false;
                        });

                        suggestions.appendChild(li);
                    });
                    suggestions.style.display = 'block';
                } else {
                    //suggestions.style.display = 'none';
                    //suggestions.innerHTML = '<li class="list-group-item">No se encontraron resultados</li>';
                    // Mensaje cuando no se encuentran resultados
                    suggestions.innerHTML = `
                    <li class="list-group-item text-center text-danger">
                        <i class="bi bi-exclamation-circle"></i> No se encontraron resultados
                    </li>`;
                }
            })
            //.catch(error => console.error('Error fetching data:', error));
            .catch(error => {
                console.error('Error fetching data:', error);
                suggestions.innerHTML = `
                    <li class="list-group-item text-center text-danger">
                        <i class="bi bi-exclamation-triangle"></i> Error al buscar datos
                    </li>`;
            });

    });


    // Evento input sobre el elemento html con id=id_ingreso_unidad
    document.getElementById('id_ingreso_unidad').addEventListener('input', function () {
        const unidad = parseFloat(this.value);
        const costoUnitarioElement = document.getElementById('id_ingreso_costoU');
        const costoTotalElement = document.getElementById('id_ingreso_costoT');

        const costoUnitario = parseFloat(costoUnitarioElement.value);

        if (isNaN(unidad) || unidad < 0) {
            //if (unidad < 0) {            
            console.log("Por favor, ingrese un número válido que no sea negativo.")
            this.value = ''; // Limpiar el campo si la entrada es inválida
            //costoTotalElement.value = ''; // Limpiar el costo total
            costoTotalElement.value = 0; // Limpiar el costo total
            return;
        }

        // Calcular el costo total y mostrarlo en el campo correspondiente
        const costoTotal = unidad * costoUnitario;
        costoTotalElement.value = costoTotal.toFixed(1); // Redondear a 2 decimales*/       

    });

    // Evento input sobre el elemento html con id=id_ingreso_costoU
    document.getElementById('id_ingreso_costoU').addEventListener('input', function () {

        const costoUnitario = parseFloat(this.value);
        const costoTotalElement = document.getElementById('id_ingreso_costoT');
        const unidad = document.getElementById('id_ingreso_unidad').value;

        if (isNaN(costoUnitario) || costoUnitario < 0) {
            console.log("Por favor, ingrese un valor válido que no sea negativo.")
            this.value = ''; // Limpiar el campo si la entrada es inválida           
            //costoTotalElement.value = ''; // Limpiar el costo total
            costoTotalElement.value = 0; // Limpiar el costo total
            return;
        }

        const costoTotal = unidad * costoUnitario;
        costoTotalElement.value = costoTotal.toFixed(1); // Redondear a 2 decimales*/
    });

    // Validación antes de enviar el formulario
    btnAdicionar.addEventListener('click', function (event) {
        /*
        const costoUnitario = parseFloat(costoUnitarioInput.value);

        // Si el campo está vacío o el valor es 0, mostrar alerta y evitar el envío
        if (isNaN(costoUnitario) || costoUnitario <= 0) {
            event.preventDefault();  // Evitar que se envíe el formulario
            alert('Por favor, ingrese un valor válido mayor a 0 para el costo unitario.');
        }
        //capaAdicionar.classList.add('locked');
        */
    });

    // Agregar evento a cada botón
    quitarIngreso.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            // Confirmar antes de eliminar
            if (!confirm("¿Estás seguro de que deseas eliminar este ingreso?")) {
                return;
            }

            // Obtener el id del ingreso de la fila correspondiente
            const row = button.closest('tr');
            const ingresoId = row.getAttribute('data-ingreso-id');

            // Enviar la solicitud Ajax para actualizar 
            fetch(`/quitar_ingreso/${ingresoId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                console.log(response)
                if (response.ok) {
                    // Si se elimina correctamente, eliminar la fila de la tabla
                    //row.remove();
                    row.style.transition = 'opacity 0.5s';
                    row.style.opacity = '0'; // Fading out the row
                    setTimeout(() => row.remove(), 500); // Remove the row after the anim
                    //alert("Ingreso eliminado exitosamente.");
                } else {
                    alert("Error al eliminar el ingreso. Intenta nuevamente.");
                }
            }).catch(error => {
                console.error('Error:', error);
                alert("Ocurrió un error al intentar eliminar el ingreso.");
            });
        });
    });


    // Agregar el evento click a cada botón
    inventarioIngreso.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            selectedRow_ingreso = button.closest('tr');
            const row = button.closest('tr');
            const ingresoId = row.getAttribute('data-ingreso-id');
            //alert('ingreso_id: ' + ingresoId);

            g_ingreso_id = row.getAttribute('data-ingreso-id');
            selectFechaVencimiento.value = row.getAttribute('categoriafechavto');  // Actualiza el valor del select con el atricuto de la fila 
            loadingSpinner.style.display = 'block'; // Mostrar el spinner antes de la solicitud Ajax
            input_pu_unidad.classList.remove('is-invalid');
            input_fecha_vencimiento.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
            input_costo_nuevo.classList.remove('is-invalid');
            input_p_ganancia_nuevo.classList.remove('is-invalid');
            input_pu_unidad.disabled = false;
            input_costo_nuevo.disabled = false;
            input_p_ganancia_nuevo.disabled = false;
            btn_actualizarUnidad.disabled = true;


            //let unidad = 0;
            fetch(`/obtiene_precioU_vigente_nuevo/${ingresoId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('obtiene_precioU_vigente_nuevo: ', data)
                    if (data.status === 'success') {
                        const ingreso = data.ingreso;
                        const button = document.getElementById('pu_aceptar');

                        loadingSpinner.style.display = 'none'; // Ocultar el spinner cuando la solicitud Ajax es exitosa

                        console.log('tabla_items_body.length: ', tabla_items_body_rows.length);
                        console.log('data.unidad: ', data.unidad);
                        //alert('items: ' + ingreso.nuevo.item);

                        //if (!data.unidad) {
                        if (!ingreso.nuevo.item) {
                            btn_actualizarUnidad.disabled = true;
                            btn_generaItem.disabled = true;
                        }

                        //if (data.unidad) {
                        if (ingreso.nuevo.item > 0) {
                            btn_actualizarUnidad.disabled = false;
                            btn_generaItem.disabled = false;
                            input_pu_unidad.disabled = true;
                            document.getElementById('pu_unidad').value = ingreso.nuevo.item;
                        } else {
                            document.getElementById('pu_unidad').value = '';
                        }

                        g_nombre_producto = data.producto_nombre;
                        //document.getElementById('item-vc').textContent = ingreso.nuevo.item;
                        // Actualiza el valor del elemento id item-fv
                        itemFechaVto.textContent = ingreso.nuevo.item;
                        itemFechaVto.setAttribute('data-total-item', ingreso.nuevo.item);

                        document.getElementById('pu_producto_nombre').textContent = data.producto_nombre;
                        document.getElementById('producto_nombre_items').textContent = g_nombre_producto;

                        //document.getElementById('pu_unidad').value = data.unidad;

                        //g_unidad_entrante = data.unidad;
                        g_unidad_entrante = ingreso.nuevo.item;

                        document.getElementById('pu_costo_total').textContent = data.costo_total || '0.0';
                        document.getElementById('pu_costoU_actual').textContent = ingreso.vigente.i_costo_unitario || '0.0';
                        document.getElementById('pu_pGanancia_actual').textContent = ingreso.vigente.i_porcentaje_ganancia || '0.0';

                        //document.getElementById('pu_ganancia_actual').textContent = '$ ' + ingreso.vigente.i_ganancia || '0.0';

                        //document.getElementById('pu_ganancia_actual').textContent = '$ ' + ingreso.vigente.i_ganancia || '0.0';
                        document.getElementById('pu_ganancia_actual').textContent = ingreso.vigente.i_ganancia || '0.0';

                        //document.getElementById('pu_precioU_actual').textContent = '$ ' + ingreso.vigente.i_precio_unitario || '0.0';
                        document.getElementById('pu_precioU_actual').textContent = ingreso.vigente.i_precio_unitario || '0.0';

                        console.log('ingreso.nuevo.ingreso_fecha_compra: ', ingreso.nuevo.ingreso_fecha_compra);
                        document.getElementById('fecha-compra').value = ingreso.nuevo.ingreso_fecha_compra;
                        //document.getElementById('fecha-compra').value = "2024-11-12";
                        document.getElementById('pu_costoU_nuevo').value = ingreso.nuevo.i_costo_unitario || '';
                        document.getElementById('pu_costo_actual').textContent = ingreso.vigente.i_costo_unitario || '';
                        document.getElementById('pu_costo_nuevo').textContent = ingreso.nuevo.i_costo_unitario || '0.00';

                        //document.getElementById('pu_costoU_nuevo').value = ingreso.vigente.i_costo_unitario || '';

                        //span_n_ganancia_unidad.textContent = '$ ' + ingreso.nuevo.i_ganancia;
                        span_n_ganancia_unidad.textContent = ingreso.nuevo.i_ganancia;
                        //span_n_precio_unidad.textContent = '$ ' + ingreso.nuevo.i_precio_unitario;
                        span_n_precio_unidad.textContent = ingreso.nuevo.i_precio_unitario;

                        if (!ingreso.nuevo.i_ganancia) {
                            //span_n_ganancia_unidad.textContent = '$ 0.0';
                            span_n_ganancia_unidad.textContent = '0.0';
                        }

                        if (!ingreso.nuevo.i_precio_unitario) {
                            //span_n_precio_unidad.textContent = '$ 0.0';
                            span_n_precio_unidad.textContent = '0.0';
                        }

                        g_ganancia_unidad = ingreso.nuevo.i_ganancia;
                        g_precio_unidad = ingreso.nuevo.i_precio_unitario
                        //console.log('ganancia unidad: ', g_ganancia_unidad);

                        //console.log('porcentanje_ganancia: ', ingreso.nuevo.i_porcentaje_ganancia);
                        if (ingreso.nuevo.i_porcentaje_ganancia) {
                            console.log('True');
                            input_p_ganancia_nuevo.value = ingreso.nuevo.i_porcentaje_ganancia;
                        } else {
                            console.log('False');
                            if (ingreso.vigente.i_porcentaje_ganancia) {
                                input_p_ganancia_nuevo.value = ingreso.vigente.i_porcentaje_ganancia;
                            } else {
                                input_p_ganancia_nuevo.value = '';
                            }
                        }

                        // Agregar el atributo data-id con un valor específico
                        button.setAttribute('data-id', ingresoId);
                        modal_p_ingreso.show();
                    } else {
                        alert('error en la respuesta Ajax.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("error en la solicitud Ajax.");
                });
        });
    });


    // Evento input sobre el elemento html con id pu_costoU_nuevo
    document.getElementById('pu_costoU_nuevo').addEventListener('input', function () {
        contador_inputs++;
        input_costo_nuevo.classList.remove('is-invalid');
        const inputValue = this.value;
        const porcentaje_ganancia_nuevo = parseFloat(input_p_ganancia_nuevo.value);
        const unidad_entrante = input_pu_unidad.value;
        let costo_unitario_nuevo = parseFloat(inputValue);

        //span_n_costo_unidad.textContent = inputValue;

        costo_unitario_nuevo = parseFloat(validateSingleDecimalInput(this));
        span_n_costo_unidad.textContent = costo_unitario_nuevo;

        console.log('result: ', costo_unitario_nuevo);

        if (inputValue === '') {
            console.log("El campo está vacío");
            // Aquí puedes agregar la lógica que necesites cuando el campo quede vacío
            span_n_ganancia_unidad.textContent = '0.0';
            span_n_precio_unidad.textContent = '0.0';
            span_costo_total.textContent = '0.0';
        }

        console.log('Calcular precioU y ganancia ...');

        let [precio, ganancia] = calcular_precioU_ganancia(costo_unitario_nuevo, porcentaje_ganancia_nuevo);

        if (precio) {
            //span_n_precio_unidad.textContent = '$ ' + precio.toFixed(1);
            span_n_precio_unidad.textContent = precio.toFixed(1);
        } else {
            span_n_precio_unidad.textContent = '0.0';
        }

        if (ganancia) {
            //span_n_ganancia_unidad.textContent = '$ ' + ganancia.toFixed(1);
            span_n_ganancia_unidad.textContent = ganancia.toFixed(1);
        } else {
            span_n_ganancia_unidad.textContent = '0.0';
        }

        let costo_total = unidad_entrante * costo_unitario_nuevo

        //console.log('costo_total: ', costo_total);
        if (costo_total) {
            //span_costo_total.textContent = '$' + costo_total.toFixed(1);
            span_costo_total.textContent = costo_total.toFixed(1);
        } else {
            //span_costo_total.textContent = '$0.0';
            span_costo_total.textContent = '0.0';
        }

        g_ganancia_unidad = span_n_ganancia_unidad.textContent;
        g_precio_unidad = span_n_precio_unidad.textContent;
        g_ganancia_unidad = parseFloat(g_ganancia_unidad.replace("$", ""));
        g_precio_unidad = parseFloat(g_precio_unidad.replace("$", ""));

    });

    input_costo_nuevo.addEventListener('keydown', function (event) {
        if (event.key === ' ') {
            // Bloquear la tecla de espacio
            event.preventDefault();
            console.log("La tecla de espacio está bloqueada en este campo");
        }
        /*
        if (event.key === 'Backspace') {
            // Acciones adicionales para la tecla Backspace
            console.log("Se presionó Backspace");
            if (this.value.length === 1) {
                console.log("Se borrará el último carácter");
            }
        }
        */
    });

    // Evento input sobre el elemento html con id pu_pGanancia_nuevo
    document.getElementById('pu_pGanancia_nuevo').addEventListener('input', function () {

        contador_inputs++;
        input_p_ganancia_nuevo.classList.remove('is-invalid');
        const inputValue = this.value;
        let porcentaje_ganancia_nuevo = parseFloat(inputValue); // Convertir a número
        const costo_unitario_nuevo = parseFloat(input_costo_nuevo.value); // Convertir a número         

        porcentaje_ganancia_nuevo = parseFloat(validateSingleDecimalInput(this));

        // Lógica para cuando el campo queda vacío
        if (inputValue === '') {
            console.log("El campo está vacío");
            span_n_ganancia_unidad.textContent = '0.0';
            span_n_precio_unidad.textContent = '0.0';
        }

        console.log('valor actualizado...');

        let [precio, ganancia] = calcular_precioU_ganancia(costo_unitario_nuevo, porcentaje_ganancia_nuevo);
        if (precio) {
            //span_n_precio_unidad.textContent = '$ ' + precio.toFixed(1);
            span_n_precio_unidad.textContent = precio.toFixed(1);
        } else {
            span_n_precio_unidad.textContent = '0.0';
        }

        if (ganancia) {
            //span_n_ganancia_unidad.textContent = '$ ' + ganancia.toFixed(1);
            span_n_ganancia_unidad.textContent = ganancia.toFixed(1);
        } else {
            span_n_ganancia_unidad.textContent = '0.0';
        }

        g_ganancia_unidad = span_n_ganancia_unidad.textContent;
        g_precio_unidad = span_n_precio_unidad.textContent;
        g_ganancia_unidad = parseFloat(g_ganancia_unidad.replace("$", ""));
        g_precio_unidad = parseFloat(g_precio_unidad.replace("$", ""));

    });

    function validateSingleDecimalInput2(inputElement) {
        console.log('*********************  validateSingleDecimalInput');
        // Expresión regular que permite solo números y hasta un decimal
        //const decimalPattern = /^\d*\.?\d{0,1}$/;
        const decimalPattern = /^\d*\.?\d{0,2}$/;
        let inputValue = inputElement.value;

        // Validar el valor actual y filtrar cualquier carácter no numérico o letras
        if (!decimalPattern.test(inputValue)) {
            console.log('*** no cumple con la expresión regular ***');
            console.log('--- inputValue: ', inputValue);

            // Remover caracteres no permitidos y mantener solo el primer punto decimal y un dígito después de este
            inputValue = inputValue.replace(/[^0-9.]/g, '');  // Eliminar letras y caracteres especiales

            console.log('--- inputValue.replace: ', inputValue);

            // Remover caracteres no permitidos pero conservar hasta dos decimales
            //inputValue = inputValue.match(/^\d*\.?\d{0,2}/)[0];
            //console.log('--- inputValue.match: ', inputValue);


            /*
            // Limitar a un solo punto decimal en toda la entrada
            const firstDecimalIndex = inputValue.indexOf('.');            
            console.log('--- firstDecimalIndex: ', firstDecimalIndex);

            if (firstDecimalIndex !== -1) {
                console.log('--- firstDecimalIndex IF: ', firstDecimalIndex);
                // Eliminar cualquier punto adicional después del primero
                inputValue = inputValue.slice(0, firstDecimalIndex + 1) + inputValue.slice(firstDecimalIndex + 1).replace(/\./g, '');
            }
            */


            // Limitar a un solo punto decimal
            const firstDecimalIndex = inputValue.indexOf('.');
            if (firstDecimalIndex !== -1) {
                // Eliminar cualquier punto adicional después del primero
                inputValue =
                    inputValue.slice(0, firstDecimalIndex + 1) +
                    inputValue.slice(firstDecimalIndex + 1).replace(/\./g, '');
            }


            // Limitar a un solo dígito decimal
            const parts = inputValue.split('.');
            console.log('--- parts[0]: ', parts[0]);
            console.log('--- parts[1]: ', parts[1]);
            console.log('--- parts[1].length: ', parts[1].length);

            if (parts[1] && parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                inputValue = parts.join('.');
            }
            console.log('--- inputValue before parts: ', inputValue);


            inputElement.value = inputValue; // Actualizar el campo con el valor filtrado
        } else {
            console.log('*** cumple con la expresión regular ***');
        }
        return inputValue;
    }


    function validateSingleDecimalInput(inputElement) {
        console.log('********** validateSingleDecimalInput');
        console.log('---- inputElement.dataset.previousValue: ', inputElement.dataset.previousValue);
        // Expresión regular que permite solo números y hasta dos decimales
        const decimalPattern = /^\d*\.?\d{0,2}$/;
        let inputValue = inputElement.value;
        const previousValue = inputElement.dataset.previousValue || ''; // Guardar el valor anterior para referencia
        console.log('previousValue: ', previousValue);

        // Verificar si hay más de un punto decimal en el valor actual
        const decimalCount = (inputValue.match(/\./g) || []).length;
        console.log('decimalCount: ', decimalCount);

        // Si el valor no cumple con el patrón o hay más de un punto decimal
        if (!decimalPattern.test(inputValue) || decimalCount > 1) {
            console.log('*** Entrada inválida o segundo punto detectado ***');

            // Restaurar el valor al último valor válido (ignorar el segundo punto decimal)
            inputElement.value = previousValue;
        } else {
            console.log('*** Entrada válida ***');
            console.log('---- inputValue: ', inputValue);

            // Almacenar el valor actual como el último valor válido
            inputElement.dataset.previousValue = inputValue;
        }

        return inputElement.value;
    }


    input_p_ganancia_nuevo.addEventListener('keydown', function (event) {
        if (event.key === ' ') {
            // Bloquear la tecla de espacio
            event.preventDefault();
            console.log("La tecla de espacio está bloqueada en este campo");
        }
        if (event.key === 'Backspace') {
            // Acciones adicionales para la tecla Backspace
            console.log("Se presionó Backspace");
            if (this.value.length === 1) {
                console.log("Se borrará el último carácter");
            }
        }
    });

    console.log("Posición top del elemento header:", topPosition);
    //alert("Posición top del elemento header: " + topPosition)

    // Declarar el temporizador fuera del evento para que sea accesible en cada ejecución del evento 'input'
    let typingTimer;

    // Evento input sobre el elemento html con id pu_costoU_nuevo
    document.getElementById('pu_unidad').addEventListener('input', function () {
        contador_inputs++;
        g_unidad_entrante = this.value;
        //btn_aceptar_ingreso.disabled = true;

        btn_generaItem.classList.remove('btn-danger');
        btn_generaItem.classList.add('btn-primary');
        // Remover cualquier carácter no numérico
        this.value = this.value.replace(/[^0-9]/g, '');



        if (this.value != itemFechaVto.getAttribute('data-total-item')) { // si el valor ingresado en el input es diferente al atributo data-id del elemento span con id item-fv
            console.log('es diferente');
            itemFechaVto.textContent = 0; // es diferente el valor es 0, debe actualizar la tabla de items
        } else {
            if (this.value === itemFechaVto.getAttribute('data-total-item')) { // es igual, mantenemos el valor del item para no ser obligatorio la generación de items
                console.log('es igual');
                itemFechaVto.textContent = itemFechaVto.getAttribute('data-total-item')
            }
        }

        // Validar que el número sea mayor a 0
        if (parseInt(this.value, 10) <= 0) {
            this.value = ''; // Limpiar el campo si es 0 o menor
        }

        const unidad = parseFloat(this.value);
        const costoTotalElement = document.getElementById('pu_costo_total');
        const costoUnitario = document.getElementById('pu_costoU_nuevo').value;

        if (isNaN(unidad) || unidad <= 0 || unidad > 50) {
            this.value = ''; // Limpiar el campo si la entrada es inválida                                   
            costoTotalElement.textContent = '0.0';
            btn_actualizarUnidad.disabled = true;
            btn_generaItem.disabled = true;
            return;
        }

        let costo_total = unidad * costoUnitario
        costoTotalElement.textContent = costo_total.toFixed(1);
        input_pu_unidad.classList.remove('is-invalid');

        /*this.disabled = true;
        llena_tabla_items(unidad);
        btn_actualizarUnidad.disabled = false;
        btn_generaItem.disabled = false;
        */


        // Configurar temporizador de 5 segundos
        // let typingTimer;

        btn_generaItem.disabled = false;

        /*
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            if (g_unidad_entrante) {
                console.log('pu_unidad: ', g_unidad_entrante);
                // Desactivar el campo después de 5 segundos
                input_pu_unidad.disabled = true;
                // Ejecutar la función 

                //llena_tabla_items(unidad);

                // Habilitar el botón btn_generaItem después de ejecutar la función
                //btn_generaItem.disabled = false;
                btn_actualizarUnidad.disabled = false;
                btn_aceptar_ingreso.disabled = false;
            } else {
                //llena_tabla_items(0);
            }
        }, 3000);
        */

        //console.log("focus: Posición top del elemento header:", topPosition);
        //alert("focus: Posición top del elemento header: " + topPosition);
    });


    function calcular_precioU_ganancia(costo, p_ganancia) {
        let precio, ganancia;
        // Calcular el precio con ganancia
        precio = costo + (costo * p_ganancia / 100);
        // Calcular la ganancia
        ganancia = precio - costo;
        // Retornar ambos valores como una lista (array)
        return [precio, ganancia];
    }

    // Validar que los inputs sean números mayores a 0
    function validarNumero(input) {
        let valor = parseFloat(input.value.trim());
        if (isNaN(valor) || valor <= 0) {
            input.value = ''; // Limpiar el campo si no es válido
        }
    }

    // Aplicar validación a los inputs de unidad y costo unitario
    const inputsUnidad = document.querySelectorAll('input[data-role="unidad_number"]');
    const inputsCostoUnitario = document.querySelectorAll('input[data-role="costo_unitario_number"]');

    inputsUnidad.forEach(input => {
        input.addEventListener('input', function (event) {
            validarNumero(event.target); // Validar cada vez que se ingresa un valor
            actualizarCostoTotal(event.target); // Actualizar el costo total
        });
    });

    inputsCostoUnitario.forEach(input => {
        input.addEventListener('input', function (event) {
            validarNumero(event.target); // Validar cada vez que se ingresa un valor
            actualizarCostoTotal(event.target); // Actualizar el costo total
        });
    });

    // Función para actualizar el costo total
    function actualizarCostoTotal(input) {
        const fila = input.closest('tr'); // Encontrar la fila donde se modificó el valor
        const unidad = parseFloat(fila.querySelector('input[data-role="unidad_number"]').value);
        const costoUnitario = parseFloat(fila.querySelector('input[data-role="costo_unitario_number"]').value);

        if (!isNaN(unidad) && !isNaN(costoUnitario)) {
            const costoTotal = unidad * costoUnitario;

            // Enviar la solicitud AJAX al backend
            const ingresoId = fila.getAttribute('data-ingreso-id');
            fetch(`/actualizar_ingreso/${ingresoId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken // Token CSRF para seguridad
                },
                body: JSON.stringify({
                    unidad: unidad,
                    costoUnitario: costoUnitario,
                    costoTotal: costoTotal
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data)
                        //fila.querySelector('.text-end').innerText = costoTotal.toFixed(2); // Actualizar el costo total en la fila
                        fila.querySelector('.costo_total').innerText = costoTotal.toFixed(1); // Actualizar el costo total en la fila
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar el ingreso:', error);
                });
        }
    }

    // operacion para actualizar el ingreso 
    function actualizar_ingreso2(ingreso_id) {
        fetch(`/actualizar_ingreso2/${ingreso_id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Token CSRF por seguridad
            },
            body: JSON.stringify({
                unidad_entrante: input_pu_unidad.value,
                costo_unitario: input_costo_nuevo.value,
                rentabilidad: input_p_ganancia_nuevo.value,
                utilidad: g_ganancia_unidad,
                //utilidad: span_n_ganancia_unidad.textContent,
                precio_unitario: g_precio_unidad,
                //precio_unitario: span_n_precio_unidad.textContent,
                costo_total: span_costo_total.textContent
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data)
                }
            })
            .catch(error => {
                console.error('Error al actualizar el ingreso:', error);
            });
    }


    // Evento click sobre el elemento html con id pu_aceptar
    document.getElementById('pu_aceptar').addEventListener('click', function () {

        const ingresoId = this.getAttribute('data-id');
        const costoUnitario = parseFloat(document.getElementById('pu_costoU_nuevo').value); // Convertir a número
        const porGanancia = parseFloat(document.getElementById('pu_pGanancia_nuevo').value);
        //const ganancia = parseFloat(document.getElementById('pu_ganancia_nuevo').value);
        const ganancia = parseFloat(document.getElementById('pu_ganancia_nuevo').textContent);
        //const precioNuevo = parseFloat(document.getElementById('pu_precioU_nuevo').value);
        const precioNuevo = parseFloat(document.getElementById('pu_precioU_nuevo').textContent);
        const unidad = parseFloat(document.getElementById('pu_unidad').value);
        const costoTotal = parseFloat(document.getElementById('pu_costo_total').textContent);

        //const tablaItems = document.getElementById('tabla-items');
        //const filas = tablaItems.getElementsByTagName('tr');

        const tbody = document.getElementById('item-table-body'); // Seleccionar solo el tbody
        const filas = tbody.getElementsByTagName('tr'); // Obtener filas del tbody

        // Crear la superposición y el popup       
        const overlayDiv = document.createElement('div');
        const popupDiv = document.createElement('div');

        const tabla_items_body2 = document.getElementById('item-table-body');
        //const rowCount = tabla_items_body2.getElementsByTagName('tr').length;
        const row = tabla_items_body2.getElementsByTagName('tr');
        //alert(rowCount);
        var contador = 0;
        // Recorremos todas las filas del tbody
        for (let i = 0; i < row.length; i++) {
            const fechaCell = row[i].getElementsByTagName('td')[1]; // Obtener la segunda celda (índice 1)
            //alert('item');
            if (fechaCell) {
                const inputFecha = fechaCell.querySelector('.item-fecha-vencimiento'); // Obtener el input de fecha en la celda
                //alert(inputFecha.value);
                if (inputFecha.value != '') {
                    contador = contador + 1;
                    //inputFecha.value = nuevaFecha; // Actualizar el valor del input
                }
            }
        }

        if (row.length == contador) {
            mensaje = 'tienen fecha de vencimiento';

        } else {
            mensaje = 'no tienen fecha de vencimiento';
        }
        //return;        

        function validar_input_vacios(input, selectFechaV) {
            /*
            //alert(selectFechaV);
            if (selectFechaV == 0) {
                input.classList.remove('is-invalid');
                return true;
            }
            if (selectFechaV == 1) { // si la fechaV es unificado, no debe estar vacio
                if (input.value.trim() === '') {
                    input.classList.add('is-invalid'); // Agrega borde rojo si está vacío    
                } else {
                    input.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
                    return true;
                }
            } else {
                if (input.value.trim() === '') {
                    input.classList.add('is-invalid'); // Agrega borde rojo si está vacío
                    return false;
                } else {
                    input.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
                    return true;
                }
            }
            */

            if (input.value.trim() === '') {
                input.classList.add('is-invalid'); // Agrega borde rojo si está vacío
                return false;
            } else {
                input.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
                return true;
            }
        }

        function valida_items() {
            /*
            console.log('cantidad de filas: ', filas.length);
            if (filas.length == 0) {
                btn_generaItem.classList.remove('btn-primary');
                btn_generaItem.classList.add('btn-danger');
                return false;
            }
            return true;
            */

            //if (input_pu_unidad.value != itemFechaVto.getAttribute('data-total-item')) {
            if (input_pu_unidad.value != itemFechaVto.textContent) {
                btn_generaItem.classList.remove('btn-primary');
                btn_generaItem.classList.add('btn-danger');
                return false;
            }
            return true;
        }

        const i_unidad = validar_input_vacios(input_pu_unidad, null);
        const i_costoN = validar_input_vacios(input_costo_nuevo, null);
        const i_porcentajeG = validar_input_vacios(input_p_ganancia_nuevo, null);
        //const i_fechaV = validar_input_vacios(input_fecha_vencimiento, select_fecha_vencimiento.value);
        const i_items = valida_items();

        //if (!i_unidad || !i_fechaV || !i_costoN || !i_porcentajeG || !i_items) {
        if (!i_unidad || !i_costoN || !i_porcentajeG || !i_items) {
            // Mostrar mensaje de éxito con animación
            const mensajeError = document.getElementById('mensaje-error');
            mensajeError.classList.remove('hide');
            mensajeError.classList.add('show');

            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                mensajeError.classList.remove('show');
                mensajeError.classList.add('hide');
            }, 3000); // 3 segundos
            return;
        }

        overlayDiv.classList.add('custom-popup-overlay');
        popupDiv.classList.add('custom-popup');
        popupDiv.innerHTML = `
        
        <!-- Header del Popup --> 
        <div id="popup-header-i" class="custom-popup-header">
            <div class="custom-popup-header-bg p-2 d-flex align-items-center">
                <div class="custom-icon-container me-3">
                    <i class="bi bi-info-circle-fill"></i>
                </div>
                <!--<h5 class="custom-popup-title mb-0 flex-grow-1">Aviso de Inventario</h5>-->
                <h5 class="custom-popup-title mb-0 flex-grow-1">Aviso</h5>
            </div>
        </div>

        <!-- Cuerpo del Popup -->
        <div id="popup-body-i" class="custom-popup-body p-3">
            <p><b>${input_pu_unidad.value} unidades</b> del producto <b>“${strong_producto_nombre.textContent}”</b> se añadirán al inventario. El precio unitario será <b>Bs. ${span_n_precio_unidad.textContent}</b></p>
            <p>Los productos ${mensaje}.</p>
            <div class="custom-confirmation-message text-end mt-1">
                ¿Desea continuar?
            </div>
        </div> 

        <!-- Footer del Popup --> 
        <div id="popup-footer-i" class="custom-popup-footer text-end p-2">
            <button type="button" class="btn btn-outline-secondary me-2" id="popup-cancelar">Cancelar</button>
            <button type="button" class="btn btn-primary" id="popup-aceptar">Si, Acepto</button>
        </div>

        <div id="loading-overlay" class="custom-loading-overlay d-none">
            <div class="spinner-border custom-spinner mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <span>Cargando...</span>
        </div>
        `;

        // Agregar el popup al overlay y luego al cuerpo del modal
        overlayDiv.appendChild(popupDiv);
        // Agregar el mensaje de dialogo al modal principal  
        modal_ingreso.appendChild(overlayDiv);

        // Manejar el clic en el botón "Cancelar" dentro del popup
        document.getElementById('popup-cancelar').addEventListener('click', function () {
            overlayDiv.remove(); // Eliminar la alerta si el usuario cancela
        });

        // Manejar el clic en el botón "Aceptar" dentro del popup
        document.getElementById('popup-aceptar').addEventListener('click', function () {
            //alert('popup-aceptar2');
            mostrarSpinner();
            let datosTabla = [];
            console.log('filas: ', filas);
            console.log('filas length: ', filas.length);

            // Iterar sobre cada fila de la tabla
            for (let i = 0; i < filas.length; i++) { // Comenzar desde 1 para evitar la fila de encabezado
                const celdas = filas[i].getElementsByTagName('td');

                console.log('posicion ' + i + ': -> ', filas[i]);
                console.log('celdas: ', celdas);

                //const celdas = filas[i].getElementsByTagName('td');
                //console.log('celdas: ', celdas);
                const item_id = filas[i].getAttribute('data-item-id');

                let filaDatos = {
                    //item: celdas[0].textContent.trim(),
                    item: item_id,
                    fecha: celdas[1].querySelector('input').value,
                    //codigo: celdas[2].querySelector('input').value
                    codigo: celdas[2].textContent
                };

                datosTabla.push(filaDatos);
            }

            console.log('datosTabla: ', datosTabla);
            console.log('ingreso_id: ', ingresoId);
            //return;


            // Envia la solicitud AJAX al backend        
            fetch(`/inventario_ingreso/${ingresoId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken // Token CSRF para seguridad
                },
                body: JSON.stringify({
                    costoUnitario: costoUnitario,
                    porGanancia: porGanancia,
                    ganancia: g_ganancia_unidad,
                    //ganancia: ganancia,
                    //precioNuevo: precioNuevo,
                    precioNuevo: g_precio_unidad,
                    unidad: unidad,
                    costoTotal: costoTotal,
                    items: datosTabla,
                    fechaCompra: document.getElementById('fecha-compra').value
                })
            })
                .then(response => response.json())
                .then(data => {
                    ocultarSpinner();
                    console.log('data-> inventario_ingreso: ', data);
                    if (data.success) {
                        //const popupHeader = document.querySelector('.popup-header');
                        const popupHeader = document.getElementById('popup-header-i');
                        const popupBody = document.getElementById('popup-body-i');
                        const popupFooter = document.getElementById('popup-footer-i');
                        //const popupFooter = document.querySelector('.popup-footer');

                        popupHeader.innerHTML = `
                        <div class="bg-secondary text-white p-2 rounded-top333 d-flex align-items-center">
                            <div class="col-1 d-flex justify-content-center" style="font-size: 1.0rem;">
                                <i class="bi bi-box-seam me-1"></i>
                            </div>
                            <div class="col-10">
                                <h5 class="mb-0" style="font-size: 1.0rem;">Inventario</h5>
                            </div>
                        </div>              
                        `;

                        popupBody.innerHTML = ``;

                        // Iterar sobre los datos de `data.lista` y agregar filas con el formato solicitado
                        data.lista.map(obj => {
                            popupBody.innerHTML += `                                           
            <div class="row mb-1">
                <div class="col-12 text-center">
                    <div class="position-relative2 d-inline-block">

                        <!-- SVG animado como borde de círculo -->                 
                        <svg class="circle-border" width="80" height="80" viewBox="0 0 65 63">
                            <circle cx="32" cy="32" r="30" stroke="#66BB6A" stroke-width="2" fill="none" />
                        </svg>                       
                        
                        <!-- Ícono centrado sobre el SVG -->
                        <i class="bi bi-check-circle-fill icon-centered"></i>
                    </div>

                    <!-- Texto debajo del ícono y animación -->
                    <h5 class="mt-1">Ingreso registrado en el inventario correctamente</h5>
                </div>
            </div>
            
            <hr>

            <div class="row mb-1">
                <div class="col-12">
                    <ul class="list-unstyled">
                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Estado:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block text-success">Disponible en Inventario</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Producto:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">${strong_producto_nombre.textContent}</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Modo de Operación:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">INGRESO</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Comprador:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">${obj.ingreso_comprador}</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Fecha de Compra:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">${obj.ingreso_fecha_compra}</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Fecha de Ingreso:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">${obj.ingreso_fecha}</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Fecha en Inventario:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">${obj.inv_fecha}</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Unidades Entrantes:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">${obj.ingreso_unidad}</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Stock Disponible:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">${obj.inv_cantidad_actual}
                                        <span class="text-danger text-decoration-line-through ms-2">${obj.inv_cantidad_anterior}</span>
                                    </span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Costo unitario del proveedor:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">$${obj.ingreso_costoU_upd}
                                        <span class="text-danger text-decoration-line-through ms-2">$${obj.ingreso_costoU_ant}</span>
                                    </span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Costo Total: (${obj.ingreso_unidad} uni)</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">$${obj.ingreso_costo_total}</span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">                                    
                                    <strong class="text-muted">Margen de Ganancia:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">%${obj.ingreso_porcentajeG_upd}
                                        <span class="text-danger text-decoration-line-through ms-2">%${obj.ingreso_porcentajeG_ant}</span>
                                    </span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">                                    
                                    <strong class="text-muted">Ganancia por unidad:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">$${obj.ingreso_ganancia_upd}
                                        <span class="text-danger text-decoration-line-through ms-2">$${obj.ingreso_ganancia_ant}</span>
                                    </span>
                                </div>
                            </div>
                        </li>

                        <li class="mb-3">
                            <div class="row">
                                <div class="col-6 text-end">
                                    <strong class="text-muted">Precio unitario de venta:</strong>
                                </div>
                                <div class="col-6 col-result">
                                    <span class="d-block">$${obj.ingreso_precioU_upd}
                                        <span class="text-danger text-decoration-line-through ms-2">$${obj.ingreso_precioU_ant}</span>
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>                       
             `;
                        });



                        popupFooter.innerHTML = `
            <div class="text-center rounded-bottom">                              
                <button type="button" class="btn btn-default" id="compras-inicio" data-url="/">
                    <i class="bi bi-house-door me-2"></i>Inicio
                </button>
                <button type="button" class="btn btn-default" id="compras-pendientes" data-url="/ingreso/">                                        
                    <i class="bi bi-bag me-2"></i>Compras
                </button>                
            </div>
                        `;

                        // Añadir evento click 
                        document.getElementById('compras-inicio').addEventListener('click', function () {
                            // ir a la pagina de inicio

                            const inicioUrl = this.getAttribute('data-url'); // Obtener la URL de 'inicio'                            
                            window.location.href = inicioUrl; // Redirigir a la URL de inicio
                        });

                        // Añadir evento click 
                        document.getElementById('compras-pendientes').addEventListener('click', function () {
                            // ir a la pagina de compras pendientes
                            const comprasUrl = this.getAttribute('data-url'); // Obtener la URL de 'nuevo_ingreso'
                            window.location.href = comprasUrl; // Redirigir a la URL de compras pendientes
                        });

                    } else {
                        //alert(data.message);
                        alert(data.error);
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar el ingreso:', error);
                });

        });
    });

    // Función para mostrar el overlay del spinner
    function mostrarSpinner() {
        document.getElementById('loading-overlay').classList.remove('d-none');
    }

    // Función para ocultar el overlay del spinner
    function ocultarSpinner() {
        document.getElementById('loading-overlay').classList.add('d-none');
    }

    /*
    document.getElementById('producto').addEventListener('focus', function () {
        const searchBarContainer = document.getElementById('search-bar-container');
        const suggestions = document.getElementById('suggestions');
        const backArrow = document.getElementById('back-arrow');

        // Solo ejecutar este código si estamos en pantallas pequeñas
        if (window.innerWidth <= 768) {
            // Aplicar clase para fijar la barra de búsqueda y sugerencias en la parte superior
            searchBarContainer.classList.add('fixed-search-bar');
            suggestions.classList.add('fixed-suggestions');

            // Mostrar la flecha de regreso
            backArrow.style.display = 'inline-block';
        }
    });

    // Restaurar el diseño al hacer clic en la flecha de regreso
    document.getElementById('back-arrow').addEventListener('click', function () {
        const searchBarContainer = document.getElementById('search-bar-container');
        const suggestions = document.getElementById('suggestions');
        const backArrow = document.getElementById('back-arrow');

        // Remover las clases que fijan la barra y sugerencias en la parte superior
        searchBarContainer.classList.remove('fixed-search-bar');
        suggestions.classList.remove('fixed-suggestions');

        // Ocultar la flecha de regreso
        backArrow.style.display = 'none';
    });
    */

    /*
    document.getElementById('producto').addEventListener('focus', function () {
        const searchBarContainer = document.getElementById('search-bar-container');
        const suggestions = document.getElementById('suggestions');
        const backArrow = document.getElementById('back-arrow');

        // Solo ejecutar este código si estamos en pantallas pequeñas
        if (window.innerWidth <= 768) {
            // Aplicar clase para fijar la barra de búsqueda y sugerencias en la parte superior
            searchBarContainer.classList.add('fixed-search-bar');
            suggestions.classList.add('fixed-suggestions');
            // Mostrar la flecha de regreso
            backArrow.style.display = 'inline-block';
        }
    });

    // Restaurar el diseño al hacer clic en la flecha de regreso
    document.getElementById('back-arrow').addEventListener('click', function () {
        const searchBarContainer = document.getElementById('search-bar-container');
        const suggestions = document.getElementById('suggestions');
        const backArrow = document.getElementById('back-arrow');

        // Remover las clases que fijan la barra y sugerencias en la parte superior
        searchBarContainer.classList.remove('fixed-search-bar');
        suggestions.classList.remove('fixed-suggestions');

        // Ocultar la flecha de regreso
        backArrow.style.display = 'none';

        suggestions.style.display = 'none';
        input_producto.value = '';

    }); 
    */

    document.getElementById('producto').addEventListener('focus', function () {
        document.getElementById('suggestions').classList.add('show');
    });

    document.getElementById('producto').addEventListener('blur', function () {
        setTimeout(function () {
            document.getElementById('suggestions').classList.remove('show');
        }, 200); // Retraso para permitir el clic en las sugerencias
    });


    document.getElementById('producto').addEventListener('focus', function () {

        const searchBarContainerPadre = document.getElementById('search-bar-container-padre');
        const suggestions = document.getElementById('suggestions');
        const searchIcon = document.getElementById('search-icon');
        const backArrow = document.getElementById('back-arrow');
        const header = document.querySelector('header'); // Asegúrate de seleccionar el header correcto

        // Solo ejecutar este código si estamos en pantallas pequeñas
        if (window.innerWidth <= 768) {
            // Reducir la opacidad para suavizar el cambio antes de hacer la transición
            searchBarContainerPadre.style.transition = 'opacity 0.2s ease';
            searchBarContainerPadre.style.opacity = '0';

            setTimeout(() => {
                // Ocultar ícono de búsqueda y mostrar la flecha de regreso
                searchIcon.style.display = 'none';
                backArrow.style.display = 'flex';
                backArrow.style.opacity = '1';

                // Aplicar la clase que fija la barra de búsqueda en la parte superior
                searchBarContainerPadre.classList.add('fixed-search-bar');

                // Restaurar la opacidad para hacer visible nuevamente el contenedor de búsqueda
                searchBarContainerPadre.style.opacity = '1';

                suggestions.classList.add('fixed-suggestions');
                header.classList.add('header-hidden');
            }, 300); // Tiempo suficiente para reducir la opacidad antes de hacer el cambio



            /*
            // Ocultar ícono de búsqueda y mostrar la flecha de regreso
            searchIcon.style.display = 'none';
            backArrow.style.display = 'flex';

            // Aplicar la clase para animar el movimiento hacia arriba
            searchBarContainerPadre.classList.add('fixed-search-bar');
            suggestions.classList.add('fixed-suggestions');

            // Ocultar el header suavemente
            header.classList.add('header-hidden');
            */
        }

    });

    // Restaurar el diseño al hacer clic en la flecha de regreso
    document.getElementById('back-arrow').addEventListener('click', function () {
        /*
        //const searchBarContainer = document.getElementById('search-bar-container');
        const suggestions = document.getElementById('suggestions');
        const searchIcon = document.getElementById('search-icon');
        const backArrow = document.getElementById('back-arrow');
        const inputProducto = document.getElementById('producto');
        const searchBarContainerPadre = document.getElementById('search-bar-container-padre');

        // Restaurar ícono de búsqueda y ocultar la flecha de regreso
        //searchIcon.style.display = 'inline-block';
        searchIcon.style.display = 'flex';
        backArrow.style.display = 'none';

        // Remover las clases que fijan la barra y sugerencias en la parte superior
        //searchBarContainer.classList.remove('fixed-search-bar');
        searchBarContainerPadre.classList.remove('fixed-search-bar');
        suggestions.classList.remove('fixed-suggestions');

        // Ocultar sugerencias y limpiar el campo de búsqueda
        suggestions.style.display = 'none';
        inputProducto.value = '';
        */

        const suggestions = document.getElementById('suggestions');
        const searchIcon = document.getElementById('search-icon');
        const backArrow = document.getElementById('back-arrow');
        const inputProducto = document.getElementById('producto');
        const searchBarContainerPadre = document.getElementById('search-bar-container-padre');
        const header = document.querySelector('header'); // Asegúrate de seleccionar el header correcto

        // Restaurar ícono de búsqueda y ocultar la flecha de regreso
        backArrow.style.display = 'none';
        searchIcon.style.display = 'flex';

        // Remover la clase para animar el movimiento hacia abajo
        searchBarContainerPadre.classList.remove('fixed-search-bar');
        suggestions.classList.remove('fixed-suggestions');

        // Mostrar el header suavemente
        header.classList.remove('header-hidden');

        // Ocultar sugerencias y limpiar el campo de búsqueda
        suggestions.style.display = 'none';
        inputProducto.value = '';

        /*
        // Reducir la opacidad antes de revertir el estado
        searchBarContainerPadre.style.transition = 'opacity 0.2s ease';
        searchBarContainerPadre.style.opacity = '0';

        setTimeout(() => {
            // Restaurar ícono de búsqueda y ocultar la flecha de regreso
            backArrow.style.display = 'none';
            searchIcon.style.display = 'flex';
            searchIcon.style.opacity = '1';

            // Remover la clase que fija la barra y sugerencias en la parte superior
            searchBarContainerPadre.classList.remove('fixed-search-bar');
            suggestions.classList.remove('fixed-suggestions');

            // Restaurar la opacidad para hacer visible nuevamente el contenedor de búsqueda
            searchBarContainerPadre.style.opacity = '1';

            // Ocultar sugerencias y limpiar el campo de búsqueda
            suggestions.style.display = 'none';
            inputProducto.value = '';
        }, 200); // Tiempo suficiente para reducir la opacidad antes de hacer el cambio
        */

    });


    // Abrir modal secundario y mantener principal abierto
    document.getElementById('genera-item').addEventListener('click', function () {
        // restaurar la clase css 
        btn_generaItem.classList.remove('btn-danger');
        btn_generaItem.classList.add('btn-primary');
        capa_spinner_items.classList.remove('d-none');

        /*
        if (select_fecha_vencimiento.value == 1) {
            console.log('el select es fecha unificada');
            input_fecha_vencimiento.disabled = false;
        }
        */

        // Mostrar el modal secundario (itemModal)        
        itemModal.show();
        // Hacer que la ventana modal principal quede visible pero detrás de la secundaria
        document.querySelector('#ingresoPrecioUModal').classList.add('modal-visible-back');
        console.log('g_ingreso_id: ', g_ingreso_id);
        console.log('g_unidad_entrante: ', g_unidad_entrante);

        // Limpiar la tabla antes de agregar nuevas filas
        tabla_items_body.innerHTML = '';

        // Enviar la solicitud Ajax al backend        
        fetch(`/crea-items/${g_ingreso_id}/${g_unidad_entrante}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response: ', data)
                thead_total_items.textContent = data.item_out_list.length;
                itemFechaVto.textContent = data.item_out_list.length;
                itemFechaVto.setAttribute('data-total-item', data.item_out_list.length);

                console.log('item_out_list2_length: ', data.item_out_list2.length);
                console.log('item_out_list2[0]: ', data.item_out_list2[0]);
                console.log('item_out_list2: ', data.item_out_list2)

                if (data.success && data.item_out_list.length > 0) {
                    console.log('generar html dinamico');
                    //llena_tabla_items2(data.item_out_list);
                    input_pu_unidad.disabled = true;
                    btn_actualizarUnidad.disabled = false;
                    llena_tabla_items2(data.item_out_list2);
                    tbody_items(select_fecha_vencimiento);
                }
                capa_spinner_items.classList.add('d-none');
            }).catch(error => {
                console.error('Error en la solicitud ajax:', error);
                capa_spinner_items.classList.add('d-none');
            });
    });

    /*
    tabla_items_body_rows.forEach((fila, index) => {
        // Seleccionar el input de tipo date en la segunda columna
        const inputDate = fila.querySelector('td:nth-child(2) input[type="date"]');
        if (inputDate) {
            // Capturar el valor del input date
            const valorFecha = inputDate.value;
            console.log(`Fila ${index + 1}, Fecha: ${valorFecha}`);
        }
    });
    */

    // Escuchar eventos en el tbody (delegación de eventos)
    tabla_items_body.addEventListener('change', (event) => {
        // Verificar si el evento se originó en un input[type="date"]
        if (event.target && event.target.matches('input[type="date"]')) {
            // Obtener el valor del campo de entrada
            const valorFecha = event.target.value;

            // Opcional: Obtener información adicional de la fila actual
            const fila = event.target.closest('tr'); // Selecciona la fila donde está el input
            const itemId = fila.getAttribute('data-item-id'); // Ejemplo de obtener un atributo

            console.log(`Fecha seleccionada: ${valorFecha}, Item ID: ${itemId}`);

            // Enviar la solicitud Ajax al backend        
            fetch(`/actualiza-fecha-vto/${itemId}/${valorFecha}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response: ', data)
                    if (data.success) {

                    }
                }).catch(error => {
                    console.error('Error en la solicitud ajax:', error);
                });
        }
    });

    // Agrega el evento click al boton Aceptar 
    modal_item_aceptar.addEventListener('click', (event) => {
        // Evita el cierre automático
        event.preventDefault();
        // es fecha unificada ?
        if (select_fecha_vencimiento.value == 1) {
            // el input fecha de vto esta vacio ? 
            if (input_fecha_vencimiento.value.trim() === '') {
                console.log('input fecha vto esta vacio');
                var texto = 'Favor ingrese la fecha';
                notificacion_items.textContent = texto;
                input_fecha_vencimiento.classList.add('is-invalid');
                notificacion_items.classList.remove('hide');
                notificacion_items.classList.add('show');
                return;
            }
        }
        itemModal.hide();

        console.log('actualiza-categoriaFechaVto: ', g_ingreso_id);
        // Enviar la solicitud Ajax al backend        
        fetch(`/actualiza-categoriaFechaVto/${g_ingreso_id}/${+select_fecha_vencimiento.value}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response: ', data)
                if (data.success) {
                    selectedRow_ingreso.setAttribute('categoriafechavto', select_fecha_vencimiento.value);
                }

            }).catch(error => {
                console.error('Error en la solicitud ajax:', error);
            });

    });


    function llena_tabla_items2(items_list) {
        //const itemTableBody = document.getElementById('item-table-body');
        //tabla_items_body
        // Obtener el valor del select y el campo de fecha
        const selectFechaVencimiento = document.getElementById('select-fecha-vencimiento');
        const fechaVencimientoValue = document.getElementById('fecha-vencimiento').value;

        // Limpiar la tabla antes de agregar nuevas filas
        tabla_items_body.innerHTML = '';

        // Generar las filas de la tabla 
        for (let i = 0; i <= items_list.length - 1; i++) {
            console.log('lista_items: ', items_list[i])
            //lista_interna = items_list[i];
            item_list_internal = items_list[i];

            const row = document.createElement('tr');
            row.setAttribute('data-item-id', item_list_internal[0]);

            // Columna de item secuencial
            const itemCell = document.createElement('td');
            itemCell.textContent = i + 1;
            //itemCell.textContent = item_list_internal[0];            
            //itemCell.setAttribute('data-item-id', item_list_internal[0]);
            row.appendChild(itemCell);

            // Columna de fecha con un widget para seleccionar la fecha
            const dateCell = document.createElement('td');
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.className = 'form-control item-fecha-vencimiento';
            dateInput.setAttribute('data-fecha', '1');
            console.log('item_list_internal[2]: ', item_list_internal[2]);
            dateInput.value = item_list_internal[2];
            // si es fecha unificada, actualizar el valor del input date
            /*
            if (selectFechaVencimiento.value === '1') {
                dateInput.value = fechaVencimientoValue;
            }
            */

            dateCell.appendChild(dateInput);
            row.appendChild(dateCell);


            // Columna de codigo de item 
            const codigoItemCell = document.createElement('td');
            //codigoItemCell.textContent = items_list[i];
            codigoItemCell.textContent = item_list_internal[1];
            row.appendChild(codigoItemCell);

            // Agregar la fila a la tabla
            tabla_items_body.appendChild(row);
        }
    }


    // Evento para cuando se cierre el modal secundario
    document.getElementById('itemModal').addEventListener('hidden.bs.modal', function () {
        // Quitar la clase personalizada de la ventana modal principal
        document.querySelector('#ingresoPrecioUModal').classList.remove('modal-visible-back');
    });

    // Para garantizar que la ventana principal funcione correctamente si se cierra antes
    document.getElementById('ingresoPrecioUModal').addEventListener('hidden.bs.modal', function () {
        document.querySelector('#ingresoPrecioUModal').classList.remove('modal-visible-back');
    });

    function llena_tabla_items(puUnidad) {
        const itemTableBody = document.getElementById('item-table-body');

        // Obtener el valor del select y el campo de fecha
        const selectFechaVencimiento = document.getElementById('select-fecha-vencimiento');
        const fechaVencimientoValue = document.getElementById('fecha-vencimiento').value;

        // Limpiar la tabla antes de agregar nuevas filas
        itemTableBody.innerHTML = '';

        // Generar las filas de la tabla según el valor de 'pu_unidad'
        for (let i = 1; i <= puUnidad; i++) {
            const row = document.createElement('tr');

            // Columna de item secuencial
            const itemCell = document.createElement('td');
            itemCell.textContent = `ITEM ${i}`;
            row.appendChild(itemCell);

            // Columna de fecha con un widget para seleccionar la fecha
            const dateCell = document.createElement('td');
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.className = 'form-control item-fecha-vencimiento';
            dateInput.setAttribute('data-fecha', '1');

            // Asignar el valor de la fecha unificada si el select tiene el valor "1"
            if (selectFechaVencimiento.value === '1') {
                dateInput.value = fechaVencimientoValue;
            }

            dateCell.appendChild(dateInput);
            row.appendChild(dateCell);

            // Columna de descripción (campo de texto)
            const descriptionCell = document.createElement('td');
            const descriptionInput = document.createElement('input');
            descriptionInput.type = 'text';
            descriptionInput.className = 'form-control';
            descriptionCell.appendChild(descriptionInput);
            row.appendChild(descriptionCell);

            // Agregar la fila a la tabla
            itemTableBody.appendChild(row);
        }
    }

    // Seleccionamos el campo select y el campo de fecha


    /*
    const savedValue = localStorage.getItem('modalSelectedOption');
    console.log('localStorage: ', savedValue);
    if (savedValue) {
        selectFechaVencimiento.value = savedValue;
    }
    */


    // Añadimos un evento 'change' al campo select
    selectFechaVencimiento.addEventListener('change', function () {
        //const selectedValue = this.value;
        //localStorage.setItem('modalSelectedOption', this.value); // Guarda el valor
        const selectedOptionText = this.selectedOptions[0].text; // Obtenemos el texto de la opción seleccionada
        // Selecciona todos los inputs de tipo "date" dentro del tbody
        const dateInputs = tabla_items_body.querySelectorAll('td:nth-child(2) input[type="date"]');
        const rows = tablaItemsBody.getElementsByTagName('tr'); // Obtener todas las filas

        switch (this.value) {
            case '0': // Fecha No Requerida
                console.log('select fecha vto:', this.value, '-', selectedOptionText); // Imprime: select fecha vto: 0 - Fecha No Requerida
                notificacion_items.classList.remove('show');
                notificacion_items.classList.add('hide');
                input_fecha_vencimiento.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
                fechaVencimientoInput.disabled = true;  // Deshabilita el campo de fecha
                fechaVencimientoInput.value = ''; // Resetea el campo de fecha
                loadingTablaItems.classList.remove('d-none');

                // Enviar la solicitud Ajax al backend        
                fetch(`/limpia-fecha-vtos/${g_ingreso_id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log(data);
                            //limpia_columna_fecha_vencimiento(rows);
                            // Itera sobre los inputs y actívalos
                            dateInputs.forEach(input => {
                                input.disabled = true; // desactiva el input
                                input.value = '';
                            });
                        }
                        loadingTablaItems.classList.add('d-none');
                    }).catch(error => {
                        console.error('Error en la solicitud ajax:', error);
                        loadingTablaItems.classList.add('d-none');
                    });
                break;

            case '1': // Fecha Unificada
                console.log('select fecha vto:', this.value, '-', selectedOptionText); // Imprime: select fecha vto: 1 - Fecha Unificada
                fechaVencimientoInput.disabled = false; // Habilita el campo de fecha
                fechaVencimientoInput.focus(); // Enfocar el campo de fecha  
                // Itera sobre los inputs y desactívalos
                dateInputs.forEach(input => {
                    input.disabled = true; // Desactiva el input
                });
                break;

            case '2': // Fecha Distinta
                console.log('select fecha vto:', this.value, '-', selectedOptionText); // Imprime: select fecha vto: 2 - Fecha Distinta
                fechaVencimientoInput.value = ''; // Resetea el input fecha vto
                fechaVencimientoInput.disabled = true; // deshabilita el input fecha vto
                // Itera sobre los inputs y actívalos
                dateInputs.forEach(input => {
                    input.disabled = false; // activa el input
                });
                break;

            default:
                console.log('Operador no válido');
        }

        /*
        if (this.value === '1') { // Misma fecha en todos los Items (fecha unificada)           

        } else if (this.value === '0') { // Fecha no requerida
            //console.log('fecha no requerida');            
            // ocultamos la notificacion de items
            notificacion_items.classList.remove('show');
            notificacion_items.classList.add('hide');
            fechaVencimientoInput.disabled = true;  // Deshabilita el campo de fecha
            fechaVencimientoInput.value = ''; // Resetea el campo de fecha
            input_fecha_vencimiento.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
            // Recorremos las filas del tbody para restablecer la segunda columna (Fecha)
            const rows = tablaItemsBody.getElementsByTagName('tr'); // Obtener todas las filas
            
            for (let i = 0; i < rows.length; i++) {
                const fechaCell = rows[i].getElementsByTagName('td')[1]; // Obtener la segunda celda (índice 1)
                if (fechaCell) {
                    const inputFecha = fechaCell.querySelector('.item-fecha-vencimiento'); // Obtener el input dentro de la celda
                    if (inputFecha) {
                        inputFecha.value = ''; // Restablecer el valor del input de tipo date
                    }
                }
            }            
            //limpia_columna_fecha_vencimiento(rows);
            loadingTablaItems.classList.remove('d-none');
            // Enviar la solicitud Ajax al backend        
            fetch(`/limpia-fecha-vtos/${g_ingreso_id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data);
                        limpia_columna_fecha_vencimiento(rows);
                    }
                    loadingTablaItems.classList.add('d-none');
                }).catch(error => {
                    console.error('Error en la solicitud ajax:', error);
                    loadingTablaItems.classList.add('d-none');
                });
        }
        */
    });


    function tbody_items(selectFechaVto) {
        console.log('Operación en Javascript: selectFechaVto');

        const selectedOptionText = selectFechaVto.selectedOptions[0].text; // Obtenemos el texto de la opción seleccionada
        const dateInputs = tabla_items_body.querySelectorAll('td:nth-child(2) input[type="date"]');

        switch (selectFechaVto.value) {
            case '0': // fecha no requerida 
                console.log('select fecha vto:', selectFechaVto.value, '-', selectedOptionText); // Imprime: select fecha vto: 0 - Fecha No Requerida
                notificacion_items.classList.remove('show');
                notificacion_items.classList.add('hide');
                input_fecha_vencimiento.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
                fechaVencimientoInput.disabled = true;  // Deshabilita el campo de fecha
                fechaVencimientoInput.value = ''; // Resetea el campo de fecha

                dateInputs.forEach(input => {
                    input.disabled = true; // desactiva el input
                    input.value = '';
                });

                break;
            case '1': // fecha unificada 
                console.log('select fecha vto:', selectFechaVto.value, '-', selectedOptionText); // Imprime: select fecha vto: 0 - Fecha No Requerida
                fechaVencimientoInput.disabled = false; // Habilita el campo de fecha
                //fechaVencimientoInput.focus(); // Enfocar el campo de fecha  
                let sw1 = 0;
                // Itera sobre los inputs y desactívalos
                dateInputs.forEach(input => {
                    input.disabled = true; // Desactiva el input
                    if (input.value && sw1 == 0) {
                        fechaVencimientoInput.value = input.value;
                        sw1 = 1;
                    }
                });

                break;
            case '2': //fecha distinta
                console.log('select fecha vto:', selectFechaVto.value, '-', selectedOptionText); // Imprime: select fecha vto: 0 - Fecha No Requerida
                fechaVencimientoInput.value = ''; // Resetea el input fecha vto
                fechaVencimientoInput.disabled = true; // deshabilita el input fecha vto
                // Itera sobre los inputs y actívalos
                dateInputs.forEach(input => {
                    input.disabled = false; // activa el input
                });

                break;
            default:
                console.log('Operador no valido.');
        }
    }

    function limpia_columna_fecha_vencimiento(rows) {
        for (let i = 0; i < rows.length; i++) {
            const fechaCell = rows[i].getElementsByTagName('td')[1]; // Obtener la segunda celda (índice 1)
            if (fechaCell) {
                const inputFecha = fechaCell.querySelector('.item-fecha-vencimiento'); // Obtener el input dentro de la celda
                inputFecha.disabled = true;
                if (inputFecha) {
                    inputFecha.value = ''; // Restablecer el valor del input de tipo date
                }
            }
        }
    }

    // Añadimos un evento 'change' al campo de fecha para capturar el cambio de valor
    fechaVencimientoInput.addEventListener('change', function () {
        const nuevaFecha = this.value; // Obtener el valor del input de fecha       
        const rows = tablaItemsBody.getElementsByTagName('tr');

        input_fecha_vencimiento.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
        notificacion_items.classList.remove('show');
        notificacion_items.classList.add('hide');
        // Mostramos el spinner
        loadingTablaItems.classList.remove('d-none');
        // Enviar la solicitud Ajax al backend        
        fetch(`/actualiza-fecha-vtos/${g_ingreso_id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Token CSRF para seguridad
            },
            body: JSON.stringify({
                nueva_fecha_vencimiento: nuevaFecha
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log('Response: ', data)
                if (data.success) {
                    console.log('Estado de la solicitud ** actualiza-fecha-vtos **:', data.success);
                    //console.log('Items serialized: ',data.items);
                    console.log('Items serialized: ', data.items.length);
                    //console.log('Items serialized: ',data.items[0]);
                    // si los items actualizados coinciden con la cantidad de filas html <tr> existentes
                    if (rows.length && data.items.length) {
                        // recorremos todas las filas y las actualizamos con el resultado de la solicitud
                        for (let i = 0; i < rows.length; i++) {
                            console.log('Valor', i, ':', data.items[i]);
                            const inputFecha = rows[i].getElementsByTagName('td')[1].querySelector('.item-fecha-vencimiento');
                            inputFecha.value = data.items[i];
                        }
                    } else {
                        console.log('Las filas html <tr> no coinciden con los items actualizados');
                    }
                    loadingTablaItems.classList.add('d-none');
                }

            }).catch(error => {
                console.error('Error en la solicitud ajax:', error);
                // Recorremos todas las filas del tbody
                for (let i = 0; i < rows.length; i++) {
                    const fechaCell = rows[i].getElementsByTagName('td')[1]; // Obtener la segunda celda (índice 1)
                    if (fechaCell) {
                        const inputFecha = fechaCell.querySelector('.item-fecha-vencimiento'); // Obtener el input de fecha en la celda
                        if (inputFecha) {
                            inputFecha.value = nuevaFecha; // Actualizar el valor del input
                        }
                    }
                }
                loadingTablaItems.classList.add('d-none');
            });
    });


    document.getElementById('actualizar-unidad').addEventListener('click', function () {
        //alert(g_ingreso_id);
        const modalInv = document.getElementById('ingresoPrecioUModal');
        const puUnidadInput = document.getElementById('pu_unidad');
        const itemTableBody = document.getElementById('item-table-body');
        const rowCount = itemTableBody.getElementsByTagName('tr').length;

        // Verificar si la tabla tiene más de 1 fila
        // Hay items generados

        if (itemFechaVto.textContent > 0) {
            //if (rowCount > 0) {
            
            
            mensaje_alerta = `
            <p class="mb-3">
                <strong>Los ${input_pu_unidad.value} items creados previamente se eliminarán</strong>
            </p>                
            `;

            if (input_pu_unidad.value == 1) {
                mensaje_alerta = `                
                <p class="mb-3">                    
                    <strong>El item creado previamente será eliminado</strong>
                </p> 
                `;
            }
            

            // Crear la superposición y el popup
            const overlayDiv = document.createElement('div');
            overlayDiv.classList.add('custom-popup-overlay');
            overlayDiv.id = 'popupOverlay'; // Asigna un ID al elemento

            const popupDiv = document.createElement('div');
            popupDiv.classList.add('custom-popup');
            popupDiv.innerHTML = `
            <div id="popup-header-i" class="custom-popup-header">
                <div class="custom-popup-header-bg p-2 d-flex align-items-center">
                    <div class="custom-icon-container me-3">
                        <i class="bi bi-info-circle-fill"></i>
                    </div>
                    <h5 class="custom-popup-title mb-0 flex-grow-1">Aviso</h5>
                </div>
            </div>

            <div class="popup-body custom-popup-body">
                <div class="d-flex1 p-4 align-items-center">
                    <!--${mensaje_alerta}-->
                    <div class="custom-confirmation-message text-end mt-1">
                        <!--¿Deseas crear nuevos items?-->
                        ¿Deseas activar para actualizar los items?
                    </div>
                </div>
            </div>

            <div class="popup-footer p-3 bg-light text-end">
                <button type="button" class="btn btn-outline-secondary me-2" id="popup-cancelar">No</button>
                <button type="button" class="btn btn-primary" id="popup-aceptar">Si, Ahora</button>
            </div>
            `;

            // Agregar el popup al overlay y luego al cuerpo del modal
            overlayDiv.appendChild(popupDiv);
            modalInv.appendChild(overlayDiv);

            openPopup();

            // Manejar el clic en el botón "Cancelar" dentro del popup
            document.getElementById('popup-cancelar').addEventListener('click', function () {
                overlayDiv.remove(); // Eliminar la alerta si el usuario cancela
                puUnidadInput.disabled = true;
            });

            // Manejar el clic en el botón "Aceptar" dentro del popup
            document.getElementById('popup-aceptar').addEventListener('click', function () {
                //alert('popup-aceptar1');                
                puUnidadInput.disabled = false; // Habilitar el input "pu_unidad"                
                //puUnidadInput.value = '';                
                //itemTableBody.innerHTML = '';   // limpia las filas de la tabla                 
                btn_actualizarUnidad.disabled = true;
                btn_generaItem.disabled = false;
                puUnidadInput.focus();
                overlayDiv.remove();    // Eliminar la alerta
            });
        } else {
            puUnidadInput.disabled = false;
            puUnidadInput.focus();
        }
    });

    /*
    const puUnidadInput = document.getElementById('pu_unidad');    
    // Manejar el clic en el botón "genera-item"
    document.getElementById('genera-item').addEventListener('click', function () {
        puUnidadInput.disabled = true; // Desactivar el input "pu_unidad"
    });
    */

    // Para abrir el popup y ocultar el scroll del body
    function openPopup() {
        document.getElementById('popupOverlay').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Evitar desplazamiento del body
        //mostrarSpinner();
    }

    document.getElementById('abrir-popup').addEventListener('click', function () {
        openPopup();
    });

    document.getElementById('cerrar-popup').addEventListener('click', function () {
        document.getElementById('popupOverlay').style.display = 'none'; // Cierra el popup
        document.body.style.overflow = 'auto'; // Restaura el scroll del body
    });

    // openPopup();


    // Agrega un evento al botón de Salir
    btn_salir_modal_ingreso.addEventListener('click', (event) => {
        // Evita el cierre automático
        event.preventDefault();

        // Obtén todos los input de tipo "text" dentro del contenedor
        const inputsText = modal_ingreso.querySelectorAll('input[type="text"]');

        console.log('global ingreso id: ', g_ingreso_id);
        console.log('contador inputs: ', contador_inputs);

        // Itera sobre cada input y verifica su valor
        for (const input of inputsText) {
            console.log(`ID: ${input.id}, Valor: ${input.value}`);
            if (input.value != '' && contador_inputs > 0) {
                actualizar_ingreso2(g_ingreso_id);
                // resetear la variable global
                contador_inputs = 0;
                //return;  // Salir de la función si se encuentra un input con valor
                break;  // Salimos del bucle pero no de la función completa
            }
        }

        modal_p_ingreso.hide();
    });


    // Función para recargar suavemente la página
    function recargarSuavemente() {
        document.body.classList.add('fade-out');
        setTimeout(() => {
            location.reload();
        }, 100);  // Tiempo suficiente para que se vea el efecto de desvanecimiento
    }

});

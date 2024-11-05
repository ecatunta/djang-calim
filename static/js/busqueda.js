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

    const modal_p_ingreso = new bootstrap.Modal(document.getElementById('ingresoPrecioUModal'));
    const modal_s_item = new bootstrap.Modal(document.getElementById('itemModal'));

    const modal_ingreso = document.getElementById('ingresoPrecioUModal');
    const span_n_precio_unidad = document.getElementById('pu_precioU_nuevo');
    const span_a_precio_unidad = document.getElementById('pu_precioU_actual');
    const span_n_ganancia_unidad = document.getElementById('pu_ganancia_nuevo');
    const span_a_ganancia_unidad = document.getElementById('pu_ganancia_actual');
    const strong_producto_nombre = document.getElementById('pu_producto_nombre');
    const tabla_items_body = document.getElementById('item-table-body');
    const span_costo_total = document.getElementById('pu_costo_total');
    const btn_salir_modal_ingreso = document.getElementById('btn-salir-modal-ingreso');
    let g_ingreso_id;
    input_producto.value = '';

    // Selecciona el elemento por su ID
    const header = document.getElementById("header");
    // Obtiene la posición "top" relativa al viewport
    const topPosition = header.getBoundingClientRect().top;


    capaAdicionar.classList.add('locked');
    // Selecciona la tabla ingreso
    const tabla_ingreso = document.getElementById('ingreso_tabla');
    // Selecciona la primera fila de la tabla ingreso
    const filaIngreso = tabla_ingreso.querySelector('tbody tr:first-child');

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

    const loadingSpinner = document.getElementById('loading-spinner');
    //const modal = new bootstrap.Modal(document.getElementById('ingresoPrecioUModal'));

    // Agregar evento a cada botón
    inventarioIngreso.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const row = button.closest('tr');
            const ingresoId = row.getAttribute('data-ingreso-id');
            g_ingreso_id = row.getAttribute('data-ingreso-id');

            // Mostrar el spinner antes de la solicitud Ajax
            loadingSpinner.style.display = 'block';

            document.getElementById('fecha-vencimiento').value = '';
            document.getElementById('select-fecha-vencimiento').value = "0";
            //input_pu_unidad.disabled = true;
            input_fecha_vencimiento.disabled = true;

            //btn_actualizarUnidad.disabled = false;

            input_pu_unidad.classList.remove('is-invalid');
            input_fecha_vencimiento.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
            input_costo_nuevo.classList.remove('is-invalid');
            input_p_ganancia_nuevo.classList.remove('is-invalid');

            input_pu_unidad.disabled = false;
            input_costo_nuevo.disabled = false;
            input_p_ganancia_nuevo.disabled = false;

            btn_actualizarUnidad.disabled = true;
            //btn_generaItem.disabled = true;


            let unidad = 0;

            /*
            // Verifica si la pantalla es mediana o más grande
            if (window.matchMedia("(min-width: 768px)").matches) {
                // Pantalla mediana o más grande, obtener el valor del input
                const inputElement = row.querySelector('input[data-role="unidad_number"]');
                unidad = inputElement.value
                console.log('Valor del input (pantalla mediana o grande):', inputElement.value);
            } else {
                // Pantalla pequeña, obtener el valor del span
                const spanElement = row.querySelector('span');
                console.log('Valor del span (pantalla pequeña):', spanElement.textContent);
                unidad = spanElement.textContent
            }
                */


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
                        // Ocultar el spinner cuando la solicitud Ajax es exitosa
                        loadingSpinner.style.display = 'none';
                        /*
                        llena_tabla_items(unidad);
                        */

                        const ingreso = data.ingreso;
                        const button = document.getElementById('pu_aceptar');
                        // Actualiza el nombre del producto en el modal
                        document.getElementById('pu_producto_nombre').textContent = data.producto_nombre;
                        document.getElementById('pu_unidad').value = data.unidad;
                        document.getElementById('pu_costo_total').textContent = data.costo_total || '0.0';
                        document.getElementById('pu_costoU_actual').textContent = ingreso.vigente.i_costo_unitario || '0.0';
                        document.getElementById('pu_pGanancia_actual').textContent = ingreso.vigente.i_porcentaje_ganancia || '0.0';
                        document.getElementById('pu_ganancia_actual').textContent = ingreso.vigente.i_ganancia || '0.0';
                        document.getElementById('pu_precioU_actual').textContent = ingreso.vigente.i_precio_unitario || '0.0';
                        document.getElementById('pu_costoU_nuevo').value = ingreso.nuevo.i_costo_unitario || '';
                        //document.getElementById('pu_costoU_nuevo').value = ingreso.vigente.i_costo_unitario || '';

                        if (ingreso.vigente.i_porcentaje_ganancia) {
                            input_p_ganancia_nuevo.value = ingreso.vigente.i_porcentaje_ganancia;
                        } else {
                            input_p_ganancia_nuevo.value = ingreso.nuevo.i_porcentaje_ganancia;
                        }

                        let [precio, ganancia] = calcular_precioU_ganancia(ingreso.nuevo.i_costo_unitario, 5);
                        document.getElementById('pu_precioU_nuevo').textContent = precio.toFixed(1);
                        document.getElementById('pu_ganancia_nuevo').textContent = ganancia.toFixed(1);
                        
                        
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

        input_costo_nuevo.classList.remove('is-invalid');
        // Expresión regular para permitir solo un número con hasta un decimal
        //const decimalPattern = /^\d+(\.\d{0,1})?$/;
        const inputValue = this.value;
        let costo_unitario_nuevo = parseFloat(inputValue);
        const porcentaje_ganancia_nuevo = parseFloat(input_p_ganancia_nuevo.value);
        const unidad_entrante = input_pu_unidad.value;

        costo_unitario_nuevo = parseFloat(validateSingleDecimalInput(this));
        console.log('calculate:: ', costo_unitario_nuevo);

        if (inputValue === '') {
            console.log("El campo está vacío");
            // Aquí puedes agregar la lógica que necesites cuando el campo quede vacío
            span_n_ganancia_unidad.textContent = '0.0';
            span_n_precio_unidad.textContent = '0.0';
            span_costo_total.textContent = '0.0';
        }

        /*
        if (isNaN(costo_unitario_nuevo) || costo_unitario_nuevo < 0 || !decimalPattern.test(inputValue)) {
            // Si no coincide, revertir al último valor válido
            this.value = inputValue.slice(0, -1);
            return;
        }*/

        console.log('valor actualizado... ');

        let [precio, ganancia] = calcular_precioU_ganancia(costo_unitario_nuevo, porcentaje_ganancia_nuevo);

        if (precio) {
            span_n_precio_unidad.textContent = precio.toFixed(1);
        } else {
            span_n_precio_unidad.textContent = '0.0';
        }

        if (ganancia) {
            span_n_ganancia_unidad.textContent = ganancia.toFixed(1);
        } else {
            span_n_ganancia_unidad.textContent = '0.0';
        }

        let costo_total = unidad_entrante * costo_unitario_nuevo

        //console.log('costo_total: ', costo_total);
        if (costo_total) {
            span_costo_total.textContent = costo_total.toFixed(1);
        } else {
            span_costo_total.textContent = '0.0';
        }
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
            span_n_precio_unidad.textContent = precio.toFixed(1);
        } else {
            span_n_precio_unidad.textContent = '0.0';
        }

        if (ganancia) {
            span_n_ganancia_unidad.textContent = ganancia.toFixed(1);
        } else {
            span_n_ganancia_unidad.textContent = '0.0';
        }
    });

    function validateSingleDecimalInput(inputElement) {
        // Expresión regular que permite solo números y hasta un decimal
        const decimalPattern = /^\d*\.?\d{0,1}$/;
        let inputValue = inputElement.value;

        // Validar el valor actual y filtrar cualquier carácter no numérico o letras
        if (!decimalPattern.test(inputValue)) {
            // Remover caracteres no permitidos y mantener solo el primer punto decimal y un dígito después de este
            inputValue = inputValue.replace(/[^0-9.]/g, '');  // Eliminar letras y caracteres especiales

            // Limitar a un solo punto decimal en toda la entrada
            const firstDecimalIndex = inputValue.indexOf('.');
            if (firstDecimalIndex !== -1) {
                // Eliminar cualquier punto adicional después del primero
                inputValue = inputValue.slice(0, firstDecimalIndex + 1) + inputValue.slice(firstDecimalIndex + 1).replace(/\./g, '');
            }

            // Limitar a un solo dígito decimal
            const parts = inputValue.split('.');
            if (parts[1] && parts[1].length > 1) {
                parts[1] = parts[1].substring(0, 1);
                inputValue = parts.join('.');
            }

            inputElement.value = inputValue; // Actualizar el campo con el valor filtrado
        }
        return inputValue;
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
        btn_aceptar_ingreso.disabled = true;
        // Remover cualquier carácter no numérico
        this.value = this.value.replace(/[^0-9]/g, '');

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
        clearTimeout(typingTimer);


        typingTimer = setTimeout(function () {
            // Desactivar el campo después de 5 segundos
            input_pu_unidad.disabled = true;

            actualizar_ingreso2(g_ingreso_id);

            // Ejecutar la función llena_tabla_items
            llena_tabla_items(unidad);

            // Habilitar el botón btn_generaItem después de ejecutar la función
            btn_generaItem.disabled = false;
            btn_actualizarUnidad.disabled = false;
            btn_aceptar_ingreso.disabled = false;

        }, 5000);
        console.log("focus: Posición top del elemento header:", topPosition);
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
                utilidad: span_n_ganancia_unidad.textContent,
                precio_unitario: span_n_precio_unidad.textContent,
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
        //alert('pu_aceptar');
        const ingresoId = this.getAttribute('data-id');
        const costoUnitario = parseFloat(document.getElementById('pu_costoU_nuevo').value); // Convertir a número
        const porGanancia = parseFloat(document.getElementById('pu_pGanancia_nuevo').value);
        //const ganancia = parseFloat(document.getElementById('pu_ganancia_nuevo').value);
        const ganancia = parseFloat(document.getElementById('pu_ganancia_nuevo').textContent);
        //const precioNuevo = parseFloat(document.getElementById('pu_precioU_nuevo').value);
        const precioNuevo = parseFloat(document.getElementById('pu_precioU_nuevo').textContent);
        const unidad = parseFloat(document.getElementById('pu_unidad').value);
        const costoTotal = parseFloat(document.getElementById('pu_costo_total').textContent);
        const tablaItems = document.getElementById('tabla-items');
        const filas = tablaItems.getElementsByTagName('tr');
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
            //mensaje = 'incluyen fecha de vencimiento';
            mensaje = 'cuentan con fecha de vencimiento';

        } else {
            //mensaje = 'no incluyen fecha de vencimiento';
            mensaje = 'no cuentan con fecha de vencimiento';
        }
        //return;

        let datosTabla = [];

        function validar_input_vacios(input, selectFechaV) {
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
        }

        const i_unidad = validar_input_vacios(input_pu_unidad, null);
        const i_fechaV = validar_input_vacios(input_fecha_vencimiento, select_fecha_vencimiento.value);
        const i_costoN = validar_input_vacios(input_costo_nuevo, null);
        const i_porcentajeG = validar_input_vacios(input_p_ganancia_nuevo, null);

        if (!i_unidad || !i_fechaV || !i_costoN || !i_porcentajeG) {
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
        /*
        popupDiv.innerHTML = `
        <div class="popup-header">
            <h5><i class="bi bi-info-circle-fill text-info"></i> Aviso</h5>
        </div> 
        <div class="popup-body d-flex">
            <i class="bi bi-info-circle text-primary me-3" style="font-size: 3rem;"></i>                
            <div>
                Se agregarán al inventario <strong>${input_pu_unidad.value}</strong> unidades del producto <strong>"${strong_producto_nombre.textContent}"</strong>. 
                El nuevo precio por unidad será de <strong>Bs. ${span_n_precio_unidad.textContent}</strong>. 
                Nota: Los artículos <strong>${mensaje}</strong>. ¿Desea continuar?
            </div>
        </div>
        <div class="popup-footer text-end">
            <button type="button" class="btn btn-light me-2" id="popup-cancelar">
                Cancelar
            </button>
            <button type="button" class="btn btn-primary" id="popup-aceptar">
                Aceptar
            </button>
        </div>
        `;
        */

        popupDiv.innerHTML = `
        <!-- Header del Popup -->        
        <div class="popup-header">
            <div class="bg-info text-white p-2 rounded-top d-flex align-items-center">
                <div class="d-flex justify-content-center me-2" style="font-size: 2.2rem;">
                    <i class="bi bi-info-circle-fill"></i>
                </div>
                <h5 class="mb-0 text-center flex-grow-1">Aviso de Inventario</h5>
            </div>
        </div>

        <!-- Cuerpo del Popup -->        
        <div id="popup-body-i" class="popup-body p-3">
            <p class="mb-3">
                Se agregará un total de <strong>${input_pu_unidad.value} unidades</strong> al inventario del siguiente producto:
            </p>
            <p class="text-center">
                <strong>“${strong_producto_nombre.textContent}”</strong>
            </p>
            <p class="mt-4">
                El nuevo precio por unidad será de <strong>Bs. ${span_n_precio_unidad.textContent}</strong>.
            </p>
            <p class="text-warning mt-3">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> Atención: Los productos en esta selección <strong>${mensaje}</strong>.
            </p>
            <p class="mt-4 mb-0 text-center">
                ¿Confirma que desea continuar?
            </p>
        </div>

        <!-- Footer del Popup -->
        <div class="popup-footer text-end p-3">
            <button type="button" class="btn btn-outline-secondary me-2" id="popup-cancelar">Cancelar</button>
            <button type="button" class="btn btn-primary" id="popup-aceptar">Aceptar</button>
        </div>

        <div id="loading-overlay" class="loading-overlay d-none">
            <div class="spinner-border text-primary mb-3" role="status">
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
            mostrarSpinner();

            // Iterar sobre cada fila de la tabla
            for (let i = 1; i < filas.length; i++) { // Comenzar desde 1 para evitar la fila de encabezado
                const celdas = filas[i].getElementsByTagName('td');
                let filaDatos = {
                    item: celdas[0].textContent.trim(),
                    fecha: celdas[1].querySelector('input').value,
                    codigo: celdas[2].querySelector('input').value
                };
                datosTabla.push(filaDatos);
            }

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
                    ganancia: ganancia,
                    precioNuevo: precioNuevo,
                    unidad: unidad,
                    costoTotal: costoTotal,
                    items: datosTabla
                })
            })
                .then(response => response.json())
                .then(data => {
                    ocultarSpinner();
                    console.log('data: ', data);
                    if (data.success) {
                        const popupHeader = document.querySelector('.popup-header');
                        const popupBody = document.getElementById('popup-body-i');
                        const popupFooter = document.querySelector('.popup-footer');

                        popupHeader.innerHTML = `
                        <div class="bg-success text-white p-2 rounded-top d-flex align-items-center">
                            <div class="col-2 d-flex justify-content-center">
                                <i class="bi bi-check-circle-fill me-2" style="font-size: 2.0rem;"></i>
                            </div>
                            <div class="col-10">
                                <!--<h5 class="mb-0">Ingreso exitoso. ¡Gracias por actualizar el inventario!</h5>-->
                                <h5 class="mb-0">¡Registro realizado con éxito!</h5>                                
                            </div>
                        </div>                        
                        `;

                        popupBody.innerHTML = `
                        <div class="text-center mb-2">
                            <h6 class="fw-bold" style="color: #636363;">Producto: ${strong_producto_nombre.textContent}</h6>
                        </div>
                         `;

                        // Iterar sobre los datos de `data.lista` y agregar filas con el formato solicitado
                        data.lista.map(obj => {
                            popupBody.innerHTML += `                                           
                <div class="row mb-2">
                    <!--<div class="col-4 text-secondary"><strong>Estado</strong></div>
                    <div class="col-8">Disponible en Inventario</div>-->
                    <div class="col-12"><strong class="text-secondary">Estado:</strong> Disponible en Inventario</div>
                </div>
                <hr>
                
                <div class="row">
                
                <!-- Columna izquierda con los elementos de la lista alternados -->
                <div class="col-6">
                    <ul class="list-unstyled">

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Fecha de Registro</p>
                            <p>${obj.ingreso_fecha}</p>
                        </li>

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Unidades Entrantes</p>
                            <p>${obj.ingreso_unidad}</p>
                        </li>

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Costo por Unidad</p>
                            <div>
                                <span>$${obj.ingreso_costoU_upd}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">${obj.ingreso_costoU_ant}</span>
                            </div>
                        </li>

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Costo Total</p>
                            <p>$${obj.ingreso_costo_total}</p>
                        </li>

                        <!--
                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Rentabilidad </p>
                            <div>
                                <span>%${obj.ingreso_porcentajeG_upd}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">%${obj.ingreso_porcentajeG_ant}</span>
                            </div>
                        </li>

                        <li class="list-item mb-2 d-flex justify-content-between">
                            <p class="fw-bold mb-1">Utilidad</p>
                            <div>
                                <span>$${obj.ingreso_ganancia_upd}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">${obj.ingreso_ganancia_ant}</span>
                            </div>
                        </li>

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Precio Actual por Unidad</p>
                            <div>
                                <span>$${obj.ingreso_precioU_upd}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">${obj.ingreso_precioU_ant}</span>
                            </div>
                        </li>
                        -->

                    </ul>
                </div>

                <!-- Línea vertical entre columnas -->
                
                <!--<div class="col-1 d-flex justify-content-center">
                    <div class="vertical-line"></div>
                </div>-->

                <!-- Columna derecha con los elementos de la lista alternados -->
                <div class="col-6">
                    <ul class="list-unstyled">
                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Transacción</p>
                            <p>${obj.inv_modo}</p>
                        </li>
                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Fecha en Inventario</p>
                            <p>${obj.inv_fecha}</p>
                        </li>

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Stock Disponible</p>
                            <div>
                                <span>${obj.inv_cantidad_actual}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">${obj.inv_cantidad_anterior}</span>
                            </div>
                        </li>


                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Rentabilidad </p>
                            <div>
                                <span>%${obj.ingreso_porcentajeG_upd}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">%${obj.ingreso_porcentajeG_ant}</span>
                            </div>
                        </li>

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Utilidad</p>
                            <div>
                                <span>$${obj.ingreso_ganancia_upd}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">${obj.ingreso_ganancia_ant}</span>
                            </div>
                        </li>

                        <li class="list-item mb-2">
                            <p class="fw-bold mb-1">Precio Unitario</p>
                            <div>
                                <span>$${obj.ingreso_precioU_upd}</span>&nbsp;
                                <span class="text-danger" style="text-decoration: line-through;">${obj.ingreso_precioU_ant}</span>
                            </div>
                        </li>
                        

                    </ul>
                </div>
            </div>`;
                        });

                        /*                  
                        popupBody.innerHTML = `
                        <div>
                            <p>El ingreso se ha actualizado con éxito. Aquí están los detalles:</p>
                            <ul>
                                ${data.lista.map(obj => `
                                    <li>Costo Unitario Anterior: ${obj.ingreso_costoU_ant}</li>
                                    <li>Costo Unitario Actualizado: ${obj.ingreso_costoU_upd}</li>
                                    <li>Costo Total: ${obj.ingreso_costo_total}</li>
                                    <li>Ganancia Anterior: ${obj.ingreso_ganancia_ant}</li>
                                    <li>Ganancia Actualizada: ${obj.ingreso_ganancia_upd}</li>
                                    <li>Porcentaje Ganancia Anterior: ${obj.ingreso_porcentaje_ant}</li>
                                    <li>Porcentaje Ganancia Actualizado: ${obj.ingreso_porcentaje_upd}</li>
                                    <li>Precio Unitario Anterior: ${obj.ingreso_precioU_ant}</li>
                                    <li>Precio Unitario Actualizado: ${obj.ingreso_precioU_upd}</li>
                                    <li>Unidades: ${obj.ingreso_unidad}</li>
                                    <li>Cantidad Anterior en Inventario: ${obj.inv_cantidad_anterior}</li>
                                    <li>Cantidad Actual en Inventario: ${obj.inv_cantidad_actual}</li>
                                    <li>Estado de Inventario: ${obj.inv_estado}</li>
                                    <li>Fecha de Inventario: ${obj.inv_fecha}</li>
                                    <li>Modo de Inventario: ${obj.inv_modo}</li>
                                `).join('')}
                            </ul>
                        </div>
                    `;*/

                        popupFooter.innerHTML = `
                <div class="text-center rounded-bottom">
                    <button type="button" class="btn btn-primary" id="popup-salir">
                        <i class="bi bi-box-arrow-right me-2"></i> Salir
                    </button>
                </div>
                        `;

                        /*
                        ocultarSpinner();
    
                        if (data.success) {
                            // Recorre los valores de la respuesta json 
                            data.lista.forEach(obj => {
                                ingreso_costo_unitario_ant = obj.ingreso_costoU_ant;
                                ingreso_costo_unitario_upd = obj.ingreso_costoU_upd;
                                ingreso_costo_total = obj.ingreso_costo_total;
                                ingreso_ganancia_ant = obj.ingreso_ganancia_ant;
                                ingreso_ganancia_upd = obj.ingreso_ganancia_upd;
                                ingreso_porcentaje_ant = obj.ingreso_porcentajeG_ant;
                                ingreso_porcentaje_upd = obj.ingreso_porcentajeG_upd;
                                ingreso_precio_unitario_ant = obj.ingreso_precioU_ant;
                                ingreso_precio_unitario_upd = obj.ingreso_precioU_upd;
                                ingreso_unidad = obj.ingreso_unidad;
                                inv_cantidad = obj.inv_cantidad;
                                inv_cantidad_actual = obj.inv_cantidadActual;
                                inv_cantidad_anterior = obj.inv_cantidadAnterior;
                                inv_estado = obj.inv_estado;
                                inv_fecha = obj.inv_fecha;
                                inv_modo = obj.inv_modo;
                            });
    
                            document.querySelector('.popup-body').innerHTML = `<p>Actualización exitosa.</p>`;                        
                            const popupContent = document.getElementById('popup-content');               
                            popupContent.innerHTML = `<p>${strong_producto_nombre.textcontent}</p>
                            <ul>
                                <li>Estado ${inv_estado}</li>                                                            
                                <li>Total unidades en inventario ${inv_cantidad_actual} - ${inv_cantidad_anterior}</li>
                                <li>Unidades ${inv_cantidad}</li>                                                                                
                                <li>$ Costo unitario ${ingreso_costo_unitario_upd} - ${ingreso_costo_unitario_ant}</li>                             
                                <li>$ Costo Total ${ingreso_costo_total}</li>
                                <li>% Porcentaje de Ganancia ${ingreso_porcentaje_upd} - ${ingreso_porcentaje_ant}</li>
                                <li>$ Ganancia ${ingreso_ganancia_upd} - ${ingreso_ganancia_ant}</li>                                                       
                                <li>$ Precio unitario ${ingreso_precio_unitario_ant} - ${ingreso_precio_unitario_upd}</li>                                                        
                            </ul>
                            `;*/

                        // Añadir evento de cerrar al botón "Salir"
                        document.getElementById('popup-salir').addEventListener('click', function () {
                            //overlayDiv.remove();  // Cerrar el popup
                            //location.reload(true);
                            location.reload();
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

    document.getElementById('genera-item').addEventListener('click', function () {
        // Obtener el valor del campo 'pu_unidad'
        //const puUnidad = parseInt(document.getElementById('pu_unidad').value, 10);
        //llena_tabla_items(puUnidad);
        // Ocultar la ventana modal principal
        /*var ingresoPrecioUModal = document.getElementById('ingresoPrecioUModal');        
        var bootstrapModal = bootstrap.Modal.getInstance(ingresoPrecioUModal);
        bootstrapModal.hide();*/
        // Mostrar la nueva ventana modal
        //const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
        //itemModal.show();
        //modal_s_item.show();

        /*
        // Mostrar el modal secundario
        modal_s_item.show();
        // Modificar el z-index del modal secundario para que esté sobre el principal
        const modalElement = document.getElementById('itemModal');
        modalElement.style.zIndex = parseInt(window.getComputedStyle(document.querySelector('.modal')).zIndex) + 10;
        // Asegurar que el backdrop del modal secundario esté correctamente encima del backdrop del modal principal
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.style.zIndex = parseInt(window.getComputedStyle(document.querySelector('.modal')).zIndex) + 5;
        }
        */
    });

    /*
    // Al abrir el modal secundario
    document.getElementById('genera-item').addEventListener('click', function () {
        // Mostrar el modal secundario
        modal_s_item.show();

        // Ajustar el z-index del modal secundario para que esté sobre el principal
        const modalSecundario = document.getElementById('itemModal');
        const modalPrincipal = document.getElementById('ingresoPrecioUModal');
        modalSecundario.style.zIndex = parseInt(window.getComputedStyle(modalPrincipal).zIndex) + 10;

        // Ajustar el z-index del backdrop del modal secundario para que esté entre ambos modales
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.style.zIndex = parseInt(window.getComputedStyle(modalPrincipal).zIndex) + 5;
        }
    });

    // Manejar el cierre del modal secundario para eliminar el backdrop y restablecer el z-index
    document.getElementById('itemModal').addEventListener('hidden.bs.modal', function () {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove(); // Elimina el backdrop cuando se cierra el modal secundario
        }

        // Restablecer el z-index del modal principal
        const modalElement = document.getElementById('ingresoPrecioUModal');
        modalElement.style.zIndex = '';
    });*/


    // Abrir modal secundario y mantener principal abierto
    document.getElementById('genera-item').addEventListener('click', function () {
        // Mostrar el modal secundario (itemModal)
        var itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
        itemModal.show();

        // Hacer que la ventana modal principal quede visible pero detrás de la secundaria
        document.querySelector('#ingresoPrecioUModal').classList.add('modal-visible-back');
    });

    // Evento para cuando se cierre el modal secundario
    document.getElementById('itemModal').addEventListener('hidden.bs.modal', function () {
        // Quitar la clase personalizada de la ventana modal principal
        document.querySelector('#ingresoPrecioUModal').classList.remove('modal-visible-back');
    });

    // Para garantizar que la ventana principal funcione correctamente si se cierra antes
    document.getElementById('ingresoPrecioUModal').addEventListener('hidden.bs.modal', function () {
        document.querySelector('#ingresoPrecioUModal').classList.remove('modal-visible-back');
    });



    /*
    // Manejar el cierre del modal secundario para eliminar el backdrop y restablecer el z-index
    document.getElementById('itemModal').addEventListener('hidden.bs.modal', function () {
        const backdrop = document.querySelector('.modal-backdrop');

        if (backdrop) {
            //alert ('backdrop existe');
            backdrop.remove(); // Elimina el backdrop cuando se cierra el modal secundario
        }

        // Restablecer el z-index del modal principal
        const modalElement = document.getElementById('ingresoPrecioUModal');
        modalElement.style.zIndex = '';
    });
    */

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

    /*
    // Al cerrar la segunda ventana modal, volver a mostrar la ventana modal principal
    document.getElementById('itemModal').addEventListener('hidden.bs.modal', function () {
        //alert('cerrar ventana secundaria');
        //const ingresoModal = new bootstrap.Modal(document.getElementById('ingresoPrecioUModal'));
        //ingresoModal.show();

        //modal_p_ingreso.show();
    });
    */

    // Seleccionamos el campo select y el campo de fecha
    const selectFechaVencimiento = document.getElementById('select-fecha-vencimiento');
    const fechaVencimientoInput = document.getElementById('fecha-vencimiento');
    const tablaItemsBody = document.getElementById('item-table-body');

    // Añadimos un evento 'change' al campo select
    selectFechaVencimiento.addEventListener('change', function () {
        if (this.value === '1') { // Misma fecha en todos los Items            
            fechaVencimientoInput.disabled = false; // Habilita el campo de fecha
            fechaVencimientoInput.focus(); // Enfocar el campo de fecha              
        } else if (this.value === '0') { // No Aplica
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
        }
    });

    // Añadimos un evento 'change' al campo de fecha para capturar el cambio de valor
    fechaVencimientoInput.addEventListener('change', function () {
        input_fecha_vencimiento.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
        const nuevaFecha = this.value; // Obtener el valor del input de fecha

        // Recorremos todas las filas del tbody
        const rows = tablaItemsBody.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const fechaCell = rows[i].getElementsByTagName('td')[1]; // Obtener la segunda celda (índice 1)

            if (fechaCell) {
                const inputFecha = fechaCell.querySelector('.item-fecha-vencimiento'); // Obtener el input de fecha en la celda
                if (inputFecha) {
                    inputFecha.value = nuevaFecha; // Actualizar el valor del input
                }
            }
        }
    });

    /*
    document.getElementById('actualizar-unidad').addEventListener('click', function () {       
        const modalInv = document.getElementById('ingresoPrecioUModal');             
        const puUnidadInput = document.getElementById('pu_unidad');
        const itemTableBody = document.getElementById('item-table-body');
        const rowCount = itemTableBody.getElementsByTagName('tr').length;        

        // Verificar si la tabla tiene más de 1 fila
        if (rowCount > 0) {
            // Crear la superposición y el popup
            const overlayDiv = document.createElement('div');
            overlayDiv.classList.add('custom-popup-overlay');

            const popupDiv = document.createElement('div');
            popupDiv.classList.add('custom-popup');
            popupDiv.innerHTML = `
                            <p><strong>Hay ${rowCount} items creados.</strong><br>Si acepta, perderá los cambios pero creará nuevos items ¿desea continuar?</p>
                            <div class="popup-buttons">
                                <button type="button" class="btn btn-danger" id="popup-cancelar">Cancelar</button>
                                <button type="button" class="btn btn-success" id="popup-aceptar">Aceptar</button>
                            </div>
                        `;
            // Agregar el popup al overlay y luego al cuerpo del modal
            overlayDiv.appendChild(popupDiv);
            modalInv.appendChild(overlayDiv);

            // Manejar el clic en el botón "Cancelar" dentro del popup
            document.getElementById('popup-cancelar').addEventListener('click', function () {
                overlayDiv.remove(); // Eliminar la alerta si el usuario cancela
                puUnidadInput.disabled = true;
            });

            // Manejar el clic en el botón "Aceptar" dentro del popup
            document.getElementById('popup-aceptar').addEventListener('click', function () {
                puUnidadInput.disabled = false; // Habilitar el input "pu_unidad"
                overlayDiv.remove(); // Eliminar la alerta
                puUnidadInput.focus();
            });
        } else {
            // Si solo hay una fila, habilitar directamente el input "pu_unidad"
            puUnidadInput.disabled = false;
        }
    });
    */

    document.getElementById('actualizar-unidad').addEventListener('click', function () {
        //alert(g_ingreso_id);
        const modalInv = document.getElementById('ingresoPrecioUModal');
        const puUnidadInput = document.getElementById('pu_unidad');
        const itemTableBody = document.getElementById('item-table-body');
        const rowCount = itemTableBody.getElementsByTagName('tr').length;

        // Verificar si la tabla tiene más de 1 fila
        if (rowCount > 0) {
            // Crear la superposición y el popup
            const overlayDiv = document.createElement('div');
            overlayDiv.classList.add('custom-popup-overlay');

            const popupDiv = document.createElement('div');
            popupDiv.classList.add('custom-popup');
            popupDiv.innerHTML = `
                <div class="popup-header">
                    <h5><i class="bi bi-exclamation-triangle-fill text-warning"></i> Advertencia</h5>
                </div> 
                <div class="popup-body d-flex">
                    <i class="bi bi-exclamation-circle-fill text-danger me-3" style="font-size: 4rem;"></i>
                    <div>                                             
                        <!--Se detectaron <strong>${rowCount} items</strong> ya creados. Si continúa, se eliminarán los cambios previos y se crearán nuevos items. <strong>Confirme si desea proceder</strong>.-->
                        Hay <strong>${rowCount} items</strong> creados. Si continúa, perderá los cambios y se generarán nuevos items. <strong>¿Desea continuar?</strong>
                    </div>
                </div>
                <div class="popup-footer text-end">
                    <button type="button" class="btn btn-default me-2" id="popup-cancelar">
                        <!--<i class="bi bi-x-circle"></i>--> Cancelar
                    </button>
                    <button type="button" class="btn btn-success" id="popup-aceptar">
                        <!--<i class="bi bi-check-circle"></i>--> Aceptar
                    </button>
                </div>
            `;

            // Agregar el popup al overlay y luego al cuerpo del modal
            overlayDiv.appendChild(popupDiv);
            modalInv.appendChild(overlayDiv);

            // Manejar el clic en el botón "Cancelar" dentro del popup
            document.getElementById('popup-cancelar').addEventListener('click', function () {
                overlayDiv.remove(); // Eliminar la alerta si el usuario cancela
                puUnidadInput.disabled = true;
            });

            // Manejar el clic en el botón "Aceptar" dentro del popup
            document.getElementById('popup-aceptar').addEventListener('click', function () {
                puUnidadInput.disabled = false; // Habilitar el input "pu_unidad"
                overlayDiv.remove(); // Eliminar la alerta
                puUnidadInput.value = '';
                itemTableBody.innerHTML = '';
                puUnidadInput.focus();
                btn_actualizarUnidad.disabled = true;
                btn_generaItem.disabled = true;
            });
        } else {
            // Si solo hay una fila, habilitar directamente el input "pu_unidad"
            puUnidadInput.disabled = false;
        }
    });

    const puUnidadInput = document.getElementById('pu_unidad');
    // Manejar el clic en el botón "genera-item"
    document.getElementById('genera-item').addEventListener('click', function () {
        puUnidadInput.disabled = true; // Desactivar el input "pu_unidad"
    });

    // Para abrir el popup y ocultar el scroll del body
    function openPopup() {
        document.getElementById('popupOverlay3').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Evitar desplazamiento del body
        //mostrarSpinner();
    }

    document.getElementById('abrir-popup').addEventListener('click', function () {
        openPopup();
    });

    document.getElementById('cerrar-popup').addEventListener('click', function () {
        document.getElementById('popupOverlay3').style.display = 'none'; // Cierra el popup
        document.body.style.overflow = 'auto'; // Restaura el scroll del body
    });
    //openPopup();  


    // Agrega un evento al botón de Salir
    btn_salir_modal_ingreso.addEventListener('click', (event) => {
        // Evita el cierre automático
        event.preventDefault();


        // Quita el foco del campo input activo (si lo hay)
        //document.activeElement.blur();

        input_pu_unidad.disabled = true;
        input_costo_nuevo.disabled = true;
        input_p_ganancia_nuevo.disabled = true;

        input_pu_unidad.value = '';
        input_costo_nuevo.value = '';
        input_p_ganancia_nuevo.value = '';

        // Realiza cualquier acción antes de cerrar
        console.log('Realizando acciones antes de cerrar el modal');
        //alert("focus: Posición top del elemento header: " + topPosition);
        // Cierra el modal manualmente
        modal_p_ingreso.hide();

        /*
        // Desplaza el scroll hacia arriba con una transición suave
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Transición suave
        });
        */
    });

});

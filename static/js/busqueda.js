document.addEventListener('DOMContentLoaded', function () {
    //alert('busqueda.js');   
    const btnAdicionar = document.getElementById("btn_adicionar");
    const costoUnitarioInput = document.getElementById('id_ingreso_costoU');
    const costoTotalInput = document.getElementById('id_ingreso_costoT');
    // Seleccionar todos los botones de quitar
    const quitarIngreso = document.querySelectorAll('.ingreso_quitar');
    // Seleccionar todos los botones de inventario ingreso
    const inventarioIngreso = document.querySelectorAll('.inventario_ingreso');

    const suggestions = document.getElementById('suggestions');
    const input_producto = document.getElementById('producto');
    input_producto.value = '';

    const capaAdicionar = document.getElementById('capa-adicionar');
    capaAdicionar.classList.add('locked');

    // Mostrar mensaje de éxito con animación
    const mensajeExito = document.getElementById('mensaje-exito');

    // Selecciona la tabla ingreso
    const tabla_ingreso = document.getElementById('ingreso_tabla');

    // Selecciona la primera fila de la tabla ingreso
    const filaIngreso = tabla_ingreso.querySelector('tbody tr:first-child');

    // Columnas de la fila
    const columnasFilaIngreso = filaIngreso.querySelectorAll('td');
    const btn_actualizarUnidad = document.getElementById('actualizar-unidad');
    const btn_generaItem = document.getElementById('genera-item');
    const input_pu_unidad = document.getElementById('pu_unidad');
    const input_fecha_vencimiento = document.getElementById('fecha-vencimiento');
    const select_fecha_vencimiento = document.getElementById('select-fecha-vencimiento');

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
        const costoUnitario = parseFloat(costoUnitarioInput.value);

        // Si el campo está vacío o el valor es 0, mostrar alerta y evitar el envío
        if (isNaN(costoUnitario) || costoUnitario <= 0) {
            event.preventDefault();  // Evitar que se envíe el formulario
            alert('Por favor, ingrese un valor válido mayor a 0 para el costo unitario.');
        }
        //capaAdicionar.classList.add('locked');
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
    const modal = new bootstrap.Modal(document.getElementById('ingresoPrecioUModal'));

    // Agregar evento a cada botón
    inventarioIngreso.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const row = button.closest('tr');
            const ingresoId = row.getAttribute('data-ingreso-id');

            // Mostrar el spinner antes de la solicitud Ajax
            loadingSpinner.style.display = 'block';

            document.getElementById('fecha-vencimiento').value = '';
            document.getElementById('select-fecha-vencimiento').value = "0";

            let unidad = 0;
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


            fetch(`/obtiene_precioU_vigente_nuevo/${ingresoId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('data: ', data)
                    if (data.status === 'success') {
                        // Ocultar el spinner cuando la solicitud Ajax es exitosa
                        loadingSpinner.style.display = 'none';

                        llena_tabla_items(unidad);
                        const ingreso = data.ingreso;
                        const button = document.getElementById('pu_aceptar');
                        // Actualiza el nombre del producto en el modal
                        document.getElementById('pu_producto_nombre').textContent = data.producto_nombre;
                        document.getElementById('pu_unidad').value = data.unidad;
                        document.getElementById('pu_costo_total').textContent = data.costo_total;
                        document.getElementById('pu_costoU_actual').textContent = ingreso.vigente.i_costo_unitario || '';
                        document.getElementById('pu_pGanancia_actual').textContent = ingreso.vigente.i_porcentaje_ganancia || '';
                        document.getElementById('pu_ganancia_actual').textContent = ingreso.vigente.i_ganancia || '';
                        document.getElementById('pu_precioU_actual').textContent = ingreso.vigente.i_precio_unitario || '';
                        document.getElementById('pu_costoU_nuevo').value = ingreso.nuevo.i_costo_unitario || '';
                        document.getElementById('pu_pGanancia_nuevo').value = 5;
                        let [precio, ganancia] = calcular_precioU_ganancia(ingreso.nuevo.i_costo_unitario, 5);
                        document.getElementById('pu_precioU_nuevo').textContent = precio.toFixed(1);
                        document.getElementById('pu_ganancia_nuevo').textContent = ganancia.toFixed(1);
                        // Agregar el atributo data-id con un valor específico
                        button.setAttribute('data-id', ingresoId);

                        // mostrar la ventana modal 
                        modal.show();

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

    /*// Evento input sobre el elemento html con id=id_ingreso_costoU
    document.getElementById('pu_costoU_nuevo').addEventListener('input', function () {

        const costoUnitario = parseFloat(this.value);

        //const costoTotalElement = document.getElementById('id_ingreso_costoT');
        //const unidad = document.getElementById('id_ingreso_unidad').value;

        if (isNaN(costoUnitario) || costoUnitario < 0) {
            console.log("Por favor, ingrese un valor válido que no sea negativo.")
            this.value = ''; // Limpiar el campo si la entrada es inválida                       
            //costoTotalElement.value = 0; // Limpiar el costo total
            return;
        }

        //const costoTotal = unidad * costoUnitario;
        //costoTotalElement.value = costoTotal.toFixed(2); // Redondear a 2 decimales
    });*/


    // Evento input sobre el elemento html con id pu_costoU_nuevo
    document.getElementById('pu_costoU_nuevo').addEventListener('input', function () {

        const costoUnitario = parseFloat(this.value);
        const precioUnitarioElement = document.getElementById('pu_precioU_nuevo');
        const gananciaElement = document.getElementById('pu_ganancia_nuevo');
        const porcentajeGananciaElement = document.getElementById('pu_pGanancia_nuevo');
        const costoTotalElement = document.getElementById('pu_costo_total');
        const porcentajeGanancia = parseFloat(porcentajeGananciaElement.value);
        const unidad = parseFloat(document.getElementById('pu_unidad').value);

        if (isNaN(costoUnitario) || costoUnitario < 0) {
            this.value = ''; // Limpiar el campo si la entrada es inválida                       
            precioUnitarioElement.value = 0; // Limpiar el costo total
            return;
        }

        /*if (isNaN(porcentajeGanancia) || porcentajeGanancia < 0) {
            this.value = ''; // Limpiar el campo si la entrada es inválida                       
            precioUnitarioElement.value = 0; // Limpiar el costo total
            return;
        }*/

        let [precio, ganancia] = calcular_precioU_ganancia(costoUnitario, porcentajeGanancia);
        //precioUnitarioElement.value = precio.toFixed(2);
        precioUnitarioElement.textContent = precio.toFixed(1);
        //gananciaElement.value = ganancia.toFixed(2);
        gananciaElement.textContent = ganancia.toFixed(1);

        let costo_total = unidad * costoUnitario
        costoTotalElement.textContent = costo_total.toFixed(1);

    });


    // Evento input sobre el elemento html con id pu_pGanancia_nuevo
    document.getElementById('pu_pGanancia_nuevo').addEventListener('input', function () {

        const pGanancia = parseFloat(this.value);
        const precioUnitarioElement = document.getElementById('pu_precioU_nuevo');
        const costoUnitario = parseFloat(document.getElementById('pu_costoU_nuevo').value); // Convertir a número
        const gananciaElement = document.getElementById('pu_ganancia_nuevo');
        //let precio_unitario_nuevo

        if (isNaN(pGanancia) || pGanancia < 0) {
            console.log("Por favor, ingrese un valor válido que no sea negativo.");
            this.value = ''; // Limpiar el campo si la entrada es inválida                       
            precioUnitarioElement.value = 0; // Limpiar el costo total
            return;
        }

        // Asegurarse que ambas variables sean números para evitar concatenación
        // const precioUnitario = costoUnitario + (costoUnitario * pGanancia / 100);
        // precioUnitarioElement.value = precioUnitario.toFixed(2); // Mostrar con dos decimales

        //precio_unitario_nuevo = calcular_precioU_ganancia(costoUnitario, pGanancia)
        let [precio, ganancia] = calcular_precioU_ganancia(costoUnitario, pGanancia);
        //precioUnitarioElement.value = precio.toFixed(2); // Mostrar con dos decimales
        precioUnitarioElement.textContent = precio.toFixed(1); // Mostrar con dos decimales
        //gananciaElement.value = ganancia.toFixed(2);
        gananciaElement.textContent = ganancia.toFixed(1);

    });

    /*
    // Función de debounce
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // Evento input sobre el elemento html con id pu_unidad
    document.getElementById('pu_unidad').addEventListener('input', debounce(function () {
        const unidad = parseFloat(this.value);
        const costoTotalElement = document.getElementById('pu_costo_total');
        const costoUnitario = document.getElementById('pu_costoU_nuevo').value;

        // Validar el valor de unidad
        if (isNaN(unidad) || unidad < 0 || unidad > 50) {
            this.value = ''; // Limpiar el campo si la entrada es inválida                                   
            costoTotalElement.textContent = 0;
            return;
        }

        let costo_total = unidad * costoUnitario;
        costoTotalElement.textContent = costo_total.toFixed(1);

        // Llamar a llena_tabla_items después de debounce
        llena_tabla_items(unidad);

    }, 300)); // 300 milisegundos de retraso
    */



    // Evento input sobre el elemento html con id pu_costoU_nuevo
    document.getElementById('pu_unidad').addEventListener('input', function () {

        const unidad = parseFloat(this.value);
        const costoTotalElement = document.getElementById('pu_costo_total');
        const costoUnitario = document.getElementById('pu_costoU_nuevo').value;

        if (isNaN(unidad) || unidad <= 0 || unidad > 50) {
            this.value = ''; // Limpiar el campo si la entrada es inválida                                   
            costoTotalElement.textContent = 0;
            btn_actualizarUnidad.disabled = true;
            btn_generaItem.disabled = true;
            return;
        }
        let costo_total = unidad * costoUnitario
        costoTotalElement.textContent = costo_total.toFixed(1);
        btn_actualizarUnidad.disabled = false;
        btn_generaItem.disabled = false;
        input_pu_unidad.classList.remove('is-invalid');
        llena_tabla_items(unidad);

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
        let datosTabla = [];


        function validar_input_vacios(input, selectFechaV) {
            //alert(selectFechaV);
            if (selectFechaV == 0){
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

        if (!i_unidad || !i_fechaV) {
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

        /*if (input_pu_unidad.value.trim() === ''){
            alert ('El campo unidad esta vacio...');
            return false;
        }

        if (select_fecha_vencimiento.value == 1){
            alert ('Fecha unificada, valor 1');
            if (input_fecha_vencimiento.value.trim() === ''){
                alert ('La fecha de vencimiento es requerido y esta vacio...');
                return false;
            }
        }*/

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

        //console.log('ingresoId: ', ingresoId);

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
                console.log(data);
                if (data.success) {
                    location.reload()
                } else {
                    //alert(data.message);
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error al actualizar el ingreso:', error);
            });
    });

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
        /*
        //const searchBarContainer = document.getElementById('search-bar-container');
        const searchBarContainerPadre = document.getElementById('search-bar-container-padre');
        const suggestions = document.getElementById('suggestions');
        const searchIcon = document.getElementById('search-icon');
        const backArrow = document.getElementById('back-arrow');

        // Solo ejecutar este código si estamos en pantallas pequeñas
        if (window.innerWidth <= 768) {
            // Ocultar ícono de búsqueda y mostrar la flecha de regreso
            searchIcon.style.display = 'none';
            //backArrow.style.display = 'inline-block';
            backArrow.style.display = 'flex';

            // Aplicar clases para fijar la barra de búsqueda y sugerencias en la parte superior
            //searchBarContainer.classList.add('fixed-search-bar');
            searchBarContainerPadre.classList.add('fixed-search-bar');
            suggestions.classList.add('fixed-suggestions');
        }
        */

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
        const puUnidad = parseInt(document.getElementById('pu_unidad').value, 10);

        //llena_tabla_items(puUnidad);
        // Ocultar la ventana modal principal
        var ingresoPrecioUModal = document.getElementById('ingresoPrecioUModal');
        var bootstrapModal = bootstrap.Modal.getInstance(ingresoPrecioUModal);
        bootstrapModal.hide();

        // Mostrar la nueva ventana modal
        const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
        itemModal.show();
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

    // Al cerrar la segunda ventana modal, volver a mostrar la ventana modal principal
    document.getElementById('itemModal').addEventListener('hidden.bs.modal', function () {
        const ingresoModal = new bootstrap.Modal(document.getElementById('ingresoPrecioUModal'));
        ingresoModal.show();
    });

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

});





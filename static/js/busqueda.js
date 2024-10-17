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
        costoTotalElement.value = costoTotal.toFixed(2); // Redondear a 2 decimales*/       

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
        costoTotalElement.value = costoTotal.toFixed(2); // Redondear a 2 decimales*/

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


    // Agregar evento a cada botón
    inventarioIngreso.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            // Obtener el id del ingreso de la fila correspondiente
            const row = button.closest('tr');
            const ingresoId = row.getAttribute('data-ingreso-id');
            const modal = new bootstrap.Modal(document.getElementById('ingresoPrecioUModal'));


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
                        const ingreso = data.ingreso;
                        // Seleccionar el botón por su id
                        const button = document.getElementById('pu_aceptar');
                        //let precio_unitario_nuevo;
                        // Actualiza el nombre del producto en el modal
                        document.getElementById('pu_producto_nombre').textContent = data.producto_nombre;
                        document.getElementById('pu_unidad').value = data.unidad;
                        //document.getElementById('pu_unidad').textContent = data.unidad;
                        document.getElementById('pu_costo_total').textContent = data.costo_total;

                        // Actualiza la columna "Valor Actual" con el estado "V"
                        document.getElementById('pu_costoU_actual').value = ingreso.vigente.i_costo_unitario || '';
                        document.getElementById('pu_pGanancia_actual').value = ingreso.vigente.i_porcentaje_ganancia || '';
                        document.getElementById('pu_ganancia_actual').value = ingreso.vigente.i_ganancia || '';
                        document.getElementById('pu_precioU_actual').value = ingreso.vigente.i_precio_unitario || '';

                        // Actualiza la columna "Nuevo" con el estado "P"
                        document.getElementById('pu_costoU_nuevo').value = ingreso.nuevo.i_costo_unitario || '';
                        //document.getElementById('pu_pGanancia_nuevo').value = ingreso.nuevo.i_porcentaje_ganancia || '';
                        document.getElementById('pu_pGanancia_nuevo').value = 5;

                        //document.getElementById('pu_precioU_nuevo').value = ingreso.nuevo.i_precio_unitario || '';

                        //precio_unitario_nuevo = calcular_precioU_ganancia(ingreso.nuevo.i_costo_unitario, 5)

                        //document.getElementById('pu_precioU_nuevo').value = ingreso.nuevo.i_costo_unitario || '';
                        //console.log(precio_unitario_nuevo)

                        let [precio, ganancia] = calcular_precioU_ganancia(ingreso.nuevo.i_costo_unitario, 5);
                        //console.log(`Precio: ${precio}, Ganancia: ${ganancia}`);
                        document.getElementById('pu_precioU_nuevo').value = precio.toFixed(2);
                        document.getElementById('pu_ganancia_nuevo').value = ganancia.toFixed(2);
                        // Agregar el atributo data-id con un valor específico
                        button.setAttribute('data-id', ingresoId); // Reemplaza '123' con el valor que desees

                        modal.show();

                    } else {
                        alert('Error al obtener los datos del precio unitario.');
                    }
                })
                // .then(response => {console.log(response.json())})
                .catch(error => {
                    console.error('Error:', error);
                    alert("Ocurrió un error al intentar eliminar el ingreso.");
                });


            // Enviar la solicitud Ajax para actualizar el inventario

            /*
            fetch(`/cierra_activa_ingreso/${ingresoId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                console.log(response)
                if (response.ok) {                                                         
                    //alert("update ok");
                    row.style.transition = 'opacity 0.5s';
                    row.style.opacity = '0'; // Fading out the row
                    setTimeout(() => row.remove(), 500); // Remove the row after the anim                    
                } else {
                    alert("Error al eliminar el ingreso. Intenta nuevamente.");
                }
            }).catch(error => {
                console.error('Error:', error);
                alert("Ocurrió un error al intentar eliminar el ingreso.");
            });
            */

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
        precioUnitarioElement.value = precio.toFixed(2);
        gananciaElement.value = ganancia.toFixed(2);

        let costo_total = unidad * costoUnitario
        costoTotalElement.textContent = costo_total.toFixed(2);

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
        precioUnitarioElement.value = precio.toFixed(2); // Mostrar con dos decimales
        gananciaElement.value = ganancia.toFixed(2);

    });


    // Evento input sobre el elemento html con id pu_costoU_nuevo
    document.getElementById('pu_unidad').addEventListener('input', function () {

        const unidad = parseFloat(this.value);
        const costoTotalElement = document.getElementById('pu_costo_total');
        const costoUnitario = document.getElementById('pu_costoU_nuevo').value;

        /*const precioUnitarioElement = document.getElementById('pu_precioU_nuevo');
        const gananciaElement = document.getElementById('pu_ganancia_nuevo');
        const porcentajeGananciaElement = document.getElementById('pu_pGanancia_nuevo');
        const porcentajeGanancia = parseFloat(porcentajeGananciaElement.value);*/

        if (isNaN(unidad) || unidad < 0) {
            this.value = ''; // Limpiar el campo si la entrada es inválida                                   
            costoTotalElement.textContent = 0;
            return;
        }
        let costo_total = unidad * costoUnitario
        costoTotalElement.textContent = costo_total.toFixed(2);
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

        const ingresoId = this.getAttribute('data-id');
        const costoUnitario = parseFloat(document.getElementById('pu_costoU_nuevo').value); // Convertir a número
        const porGanancia = parseFloat(document.getElementById('pu_pGanancia_nuevo').value);
        const ganancia = parseFloat(document.getElementById('pu_ganancia_nuevo').value);
        const precioNuevo = parseFloat(document.getElementById('pu_precioU_nuevo').value);
        const unidad = parseFloat(document.getElementById('pu_unidad').value);
        const costoTotal = parseFloat(document.getElementById('pu_costo_total').textContent);
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
                costoTotal: costoTotal
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    location.reload()
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

});



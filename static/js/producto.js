document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los botones de actualizar producto
    //const actualiza_producto = document.querySelectorAll('.actualiza_producto');
    //const actualiza_producto = document.querySelectorAll('.actualiza_producto');


    // Obtener los inputs por su ID
    const inputTipo = document.getElementById('ap_tipo');
    const inputMarca = document.getElementById('ap_marca');
    const descripcionCorta = document.getElementById('ap_descripcion_corta');
    const inputMedida = document.getElementById('ap_medida');
    const vistaPrevia = document.getElementById('ap_producto_nombre_upd');

    // Función para agregar y eliminar la clase 'updated'
    function resaltarVistaPrevia() {
        vistaPrevia.classList.add('updated');
        setTimeout(() => {
            vistaPrevia.classList.remove('updated');
        }, 500); // El efecto de resaltado dura 500ms
    }

    // Función para actualizar la vista previa
    function actualizarVistaPrevia() {
        vistaPrevia.classList.remove('alert-vista-previa')
        const tipo = inputTipo.value.toUpperCase();
        const marca = inputMarca.value.toUpperCase();
        const descripcion = descripcionCorta.value.toUpperCase();
        const medida = inputMedida.value.toUpperCase();

        // Concatenar los valores en el orden definido        
        const cadenaVistaPrevia = `${tipo} ${marca} ${descripcion} ${medida}`.trim();

        // Si todos los campos están vacíos, mostrar el placeholder
        if (!tipo && !marca && !descripcion && !medida) {
            //vistaPrevia.innerHTML = '<span id="ap_producto_placeholder" style="color: #555; font-weight: normal;">Vista previa nombre del producto...</span>';
            //vistaPrevia.innerHTML = '<span id="ap_producto_placeholder" style="color: #555; font-weight: normal;">Vista previa ...</span>';
            vistaPrevia.textContent = 'Vista previa ...';
            vistaPrevia.classList.add('placeholder-nombre-producto');
        } else {
            // Actualizar el contenido del elemento de vista previa
            vistaPrevia.textContent = cadenaVistaPrevia;
            vistaPrevia.classList.remove('placeholder-nombre-producto');
        }

        // Resaltar la vista previa al actualizar
        resaltarVistaPrevia();

        // Forzar mayúsculas en los campos de entrada
        inputTipo.value = tipo;
        inputMarca.value = marca;
        descripcionCorta.value = descripcion;
        inputMedida.value = medida;

        this.classList.remove('is-invalid'); // Quita el borde rojo si se escribe algo
    }

    // Agregar event listeners para que la vista previa se actualice con cada cambio
    inputTipo.addEventListener('input', actualizarVistaPrevia);
    inputMarca.addEventListener('input', actualizarVistaPrevia);
    descripcionCorta.addEventListener('input', actualizarVistaPrevia);
    inputMedida.addEventListener('input', actualizarVistaPrevia);

    /*
    // Agregar el evento click a cada botón de actualizar producto
    actualiza_producto.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            inputTipo.value = '';
            inputMarca.value = '';
            descripcionCorta.value = '';
            inputMedida.value = '';
            // Resetear la vista previa con el placeholder            
            vistaPrevia.innerHTML = '<span id="ap_producto_placeholder" style="color: #555; font-weight: normal;">Vista previa ...</span>';

            // Obtener la fila que contiene el botón
            const row = button.closest('tr');
            // Obtener los atributos data-* de la celda donde están los datos del producto
            const producto_td = row.querySelector('td[data-producto]');
            const productoNombre = producto_td.getAttribute('data-producto');
            const subcategoriaNombre = producto_td.getAttribute('data-subcategoria');
            const categoriaNombre = producto_td.getAttribute('data-categoria');
            const productoId = producto_td.getAttribute('data-producto-id');
            const gondola = producto_td.getAttribute('data-gondola');

            // Actualizar los campos en la ventana modal
            document.getElementById('ap_producto_nombre').textContent = productoNombre;
            document.getElementById('ap_subcategoria').textContent = subcategoriaNombre;
            document.getElementById('ap_gondola').textContent = gondola;
            document.getElementById('ap_categoria').textContent = categoriaNombre;
            document.getElementById('ap_aceptar').setAttribute('data', productoId);

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('actualizaProductoModal'));
            modal.show();
        });
    });
    */

    // Función para agregar el evento clic a los botones de actualización
    function agregarEventoActualizaProducto() {        
        //const actualiza_producto = document.querySelectorAll('.actualiza_producto');
        const actualiza_producto = document.querySelectorAll('.actualiza_producto');

        // Agregar el evento clic a cada botón de actualizar producto
        actualiza_producto.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();

                inputTipo.value = '';
                inputMarca.value = '';
                descripcionCorta.value = '';
                inputMedida.value = '';
                // Resetear la vista previa con el placeholder           
                //vistaPrevia.innerHTML = '<span id="ap_producto_placeholder" style="color: #555; font-weight: normal;">Vista previa ...</span>';
                vistaPrevia.textContent = 'Vista previa ...';
                vistaPrevia.classList.add('placeholder-nombre-producto');
                vistaPrevia.classList.remove('alert-vista-previa')
                inputTipo.classList.remove('is-invalid'); // Quita borde rojo 
                inputMarca.classList.remove('is-invalid'); // Quita borde rojo 
                descripcionCorta.classList.remove('is-invalid'); // Quita borde rojo 
                inputMedida.classList.remove('is-invalid'); // Quita borde rojo 

                // Obtener la fila que contiene el botón
                const row = button.closest('tr');
                // Obtener los atributos data-* de la celda donde están los datos del producto
                const producto_td = row.querySelector('td[data-producto]');
                const productoNombre = producto_td.getAttribute('data-producto');
                const subcategoriaNombre = producto_td.getAttribute('data-subcategoria');
                const categoriaNombre = producto_td.getAttribute('data-categoria');
                const productoId = producto_td.getAttribute('data-producto-id');
                const gondola = producto_td.getAttribute('data-gondola');

                // Actualizar los campos en la ventana modal
                document.getElementById('ap_producto_nombre').textContent = productoNombre;
                document.getElementById('ap_subcategoria').textContent = subcategoriaNombre;
                document.getElementById('ap_gondola').textContent = gondola;
                document.getElementById('ap_categoria').textContent = categoriaNombre;
                document.getElementById('ap_aceptar').setAttribute('data', productoId);

                // Actualizar los 4 nuevos campos para el nombre del producto
                document.getElementById('ap_tipo').value = producto_td.getAttribute('data-nombre-tipo');
                document.getElementById('ap_marca').value = producto_td.getAttribute('data-nombre-marca');
                document.getElementById('ap_descripcion_corta').value = producto_td.getAttribute('data-nombre-desc');
                document.getElementById('ap_medida').value = producto_td.getAttribute('data-nombre-medida');

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById('actualizaProductoModal'));
                modal.show();
            });
        });
    }

    // Llamar la función para agregar los eventos cuando el DOM esté cargado
    agregarEventoActualizaProducto();

    /*
    document.getElementById('ap_aceptar').addEventListener('click', function () {
        // Función para validar un campo
        function validarCampo(input) {
            if (input.value.trim() === '') {
                input.classList.add('is-invalid'); // Agrega borde rojo si está vacío
                return false;
            } else {
                input.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
                return true;
            }
        }

        // Validar cada campo
        const tipoValido = validarCampo(inputTipo);
        const marcaValido = validarCampo(inputMarca);
        const descripcionValida = validarCampo(descripcionCorta);
        const medidaValida = validarCampo(inputMedida);

        // Si algún campo es inválido, detener el proceso
        if (!tipoValido || !marcaValido || !descripcionValida || !medidaValida) {
            console.log("Uno o más campos están vacíos.");
            return;
        }

        const producto_id = this.getAttribute('data');
        const productoNombreElement = document.getElementById('ap_producto_nombre_upd');
        const producto_nombre = productoNombreElement.textContent;

        // Enviar la solicitud post 
        fetch(`/actualizar_nombre_producto/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'producto_id': producto_id,
                'producto_nombre': producto_nombre
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    console.log('ok');
                    location.reload();  // Refresca la página para mostrar los cambios
                } else {
                    alert(data.error);
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
    });
    */

    // Función para resaltar las columnas de la fila actualizada
    function resaltarColumnasTemporalmente(filaProducto) {
        //alert(filaProducto)
        const columnas = filaProducto.querySelectorAll('td');

        // Añadir la clase de resaltado a cada columna
        columnas.forEach(columna => {
            columna.classList.add('highlight-cell');
        });

        // Después de 10 segundos, restaurar el fondo original
        setTimeout(() => {
            columnas.forEach(columna => {
                columna.classList.remove('highlight-cell');
                columna.classList.add('restore-cell');
            });

            // Remover la clase de restauración después de la transición
            setTimeout(() => {
                columnas.forEach(columna => {
                    columna.classList.remove('restore-cell');
                });
            }, 2000); // Duración de la transición de restauración (2 segundos)
        }, 10000); // Duración del resaltado (10 segundos)
    }


    document.getElementById('ap_aceptar').addEventListener('click', function () {

        const elemento_vista_previa = document.getElementById('ap_producto_nombre_upd');
        // const texto_vista_previa = elemento_vista_previa.textContent.trim(); // O puedes usar innerText
        // Selecciona el span dentro de ap_producto_nombre_upd
        // const spanElemento = document.getElementById('ap_producto_nombre_upd').querySelector('#ap_producto_placeholder');

        // Obtiene el texto del span
        const texto = elemento_vista_previa.textContent.trim(); // O puedes usar innerText
        //alert(texto)
        // Función para validar un campo
        function validarCampo(input) {
            //alert('validarCampo');
            if (input.value.trim() === '') {
                input.classList.add('is-invalid'); // Agrega borde rojo si está vacío
                return false;
            } else {
                input.classList.remove('is-invalid'); // Quita borde rojo si tiene contenido
                return true;
            }
        }

       /* function validarVistaPrevia(elem) {                        
            const texto = elem.textContent.trim(); 
            if (texto.includes('Vista previa')) {                
                //elem.style.border = "1px solid red";
                elem.classList.add('alert-vista-previa');
            }else{
                //elem.style.border = "0px solid red";
                elem.classList.remove('alert-vista-previa');
            }
        }*/

        // Validar cada campo
        const tipoValido = validarCampo(inputTipo);
        const marcaValido = validarCampo(inputMarca);
        const descripcionValida = validarCampo(descripcionCorta);
        const medidaValida = validarCampo(inputMedida);
        
        //const vistaPrevia__ = validarVistaPrevia(vistaPrevia)

        // Si algún campo es inválido, detener el proceso
        //if (!tipoValido || !marcaValido || !descripcionValida || !medidaValida || texto.includes('Vista previa')) {
        if (!tipoValido || !marcaValido || !descripcionValida || !medidaValida || texto.includes('Vista previa')) {
            console.log("Uno o más campos están vacíos.");
            // Mostrar mensaje de éxito con animación
            const mensajeError = document.getElementById('mensaje-error');
            mensajeError.classList.remove('hide');
            mensajeError.classList.add('show');

            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                mensajeError.classList.remove('show');
                mensajeError.classList.add('hide');
            }, 3000); // 5 segundos
            return;
        }

        const producto_id = this.getAttribute('data');
        const productoNombreElement = document.getElementById('ap_producto_nombre_upd');
        const producto_nombre = productoNombreElement.textContent;

        console.log(inputTipo.value + ' , ' + inputMarca.value + ' , ' + descripcionCorta.value + ' , ' + inputMedida.value);
        // Enviar la solicitud post 
        fetch(`/actualizar_nombre_producto/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'producto_id': producto_id,
                'producto_nombre': producto_nombre,
                'producto_nombre_tipo': inputTipo.value.trim(),
                'producto_nombre_marca': inputMarca.value.trim(),
                'producto_nombre_desc': descripcionCorta.value.trim(),
                'producto_nombre_medida': inputMedida.value.trim()
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('actualizaProductoModal'));
                    modal.hide();

                    // Encontrar la fila del producto a actualizar
                    const filaProducto = document.querySelector(`tr td[data-producto-id="${producto_id}"]`).closest('tr');

                    // Reemplazar el contenido de la fila con el HTML actualizado
                    filaProducto.outerHTML = data.fila_html;

                    // Reasignar el evento click para el nuevo botón de "Actualizar"
                    /*
                    const nuevoBoton = document.querySelector(`tr td[data-producto-id="${producto_id}"]`).closest('tr').querySelector('.actualiza_producto');
                    nuevoBoton.addEventListener('click', function (event) {
                        event.preventDefault();
                        const modal = new bootstrap.Modal(document.getElementById('actualizaProductoModal'));
                        modal.show();
                    });
                    */

                    // Seleccionamos la nueva fila actualizada
                    const nuevaFilaProducto = document.querySelector(`tr td[data-producto-id="${producto_id}"]`).closest('tr');

                    // Aplicar resaltado a las columnas de la fila
                    resaltarColumnasTemporalmente(nuevaFilaProducto);

                    // Vuelve a agregar los eventos a los nuevos botones después de actualizar el contenido
                    agregarEventoActualizaProducto();


                    /*
                    // Resaltar la fila actualizada
                    const nuevaFilaProducto = document.querySelector(`tr td[data-producto-id="${producto_id}"]`).closest('tr');
                    nuevaFilaProducto.classList.add('highlight-row', 'highlight-row-animate');

                    // Remover el resaltado después de 10 segundos
                    setTimeout(() => {
                        nuevaFilaProducto.classList.remove('highlight-row', 'highlight-row-animate');
                    }, 10000); // 10 segundos
                    */


                    // Mostrar mensaje de éxito con animación
                    const mensajeExito = document.getElementById('mensaje-exito');
                    mensajeExito.classList.remove('hide');
                    mensajeExito.classList.add('show');

                    // Ocultar el mensaje después de 5 segundos
                    setTimeout(() => {
                        mensajeExito.classList.remove('show');
                        mensajeExito.classList.add('hide');
                    }, 5000); // 5 segundos
                } else {
                    alert(data.error);
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
    });


    document.getElementById('gondola-select').addEventListener('change', function () {

        /*var gondola = this.value;
        var url = new URL(window.location.href);
        //alert (gondola, url);

        // Si hay un valor de góndola seleccionado, agregarlo como parámetro en la URL
        if (gondola) {
            url.searchParams.set('gondola', gondola);
        } else {
            url.searchParams.delete('gondola');  // Si no se selecciona ninguna góndola, eliminar el parámetro
        }

        // Recargar la página con el nuevo parámetro
        window.location.href = url.toString();*/

        var gondola = this.value;
        //fetch("{% url 'listado_producto' %}", {
        fetch(`/listado_producto/`, {
            method: "POST",
            headers: {
                'X-CSRFToken': csrftoken,
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"  // Este encabezado indica que es una solicitud Ajax
            },
            body: JSON.stringify({
                'gondola': gondola
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Actualizar los productos
                document.getElementById('productos-list').innerHTML = data.productos_html;

                // Actualizar la paginación
                document.getElementById('pagination-container').innerHTML = data.paginacion_html;

                document.getElementById('total').textContent = data.total;

                // Vuelve a agregar los eventos a los nuevos botones después de actualizar el contenido
                agregarEventoActualizaProducto();

            })
            .catch(error => console.log("Error:", error));
    });

    // Escucha para los clics en los botones de paginación
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();  // Evita la redirección estándar del enlace

            var page = e.target.getAttribute('data-page');  // Obtén el número de página
            var gondola = document.getElementById('gondola-select').value;  // Obtener la góndola seleccionada
            console.log(page, gondola);


            // Realiza la solicitud para cargar la página seleccionada con el filtro de góndola
            fetch(`/listado_producto/?page=${page}`, {
                method: "POST",
                headers: {
                    'X-CSRFToken': csrftoken,
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify({
                    'gondola': gondola
                })
            })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('productos-list').innerHTML = data.productos_html;
                    //document.querySelector('.pagination').innerHTML = data.paginacion_html;
                    document.getElementById('pagination-container').innerHTML = data.paginacion_html;

                    document.getElementById('total').textContent = data.total;

                    // Vuelve a agregar los eventos a los nuevos botones después de actualizar el contenido
                    agregarEventoActualizaProducto();
                })
                .catch(error => console.log("Error:", error));
        }
    });
});
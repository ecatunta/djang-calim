document.addEventListener('DOMContentLoaded', function () {

    //alert('hola mundo.');
    const selectCategoria = document.getElementById('select-categoria');
    const selectSubCategoria = document.getElementById('select-subcategoria');
    const desCorta = document.getElementById('desCorta');
    const marca = document.getElementById('marca');
    const medida = document.getElementById('medida');
    const producto = document.getElementById('nombre-producto');
    const registraProducto = document.getElementById('guarda_producto');

    const validacionCategoria = document.getElementById('validacion-categoria');
    const validacionSubCategoria = document.getElementById('validacion-subcategoria');
    const validacionDesCorta = document.getElementById('validacion-desCorta');
    const validacionMarca = document.getElementById('validacion-marca');
    const validacionMedida = document.getElementById('validacion-medida');

    // Añadimos un evento 'change' al campo select
    selectCategoria.addEventListener('change', function () {
        const selectedValue = this.value;
        console.log(selectedValue);

        // Enviar la solicitud Ajax al backend        
        fetch(`/obtiene-subcategoria/${selectedValue}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.subcategorias);

                    // Obtiene el elemento select para las subcategorías
                    const selectSubcategoria = document.getElementById('select-subcategoria');

                    // Limpia las opciones actuales
                    selectSubcategoria.innerHTML = '<option value="0">-- Elegir Opcion --</option>';

                    // Agrega nuevas opciones desde la respuesta
                    data.subcategorias.forEach(subcategoria => {
                        const option = document.createElement('option'); // Crea un elemento <option>
                        option.value = subcategoria.id;                     // Establece el valor del option
                        option.textContent = subcategoria.subcategoria_nombre;        // Establece el texto visible
                        selectSubcategoria.appendChild(option);          // Agrega la opción al <select>
                    });
                }

            }).catch(error => {
                console.error('Error en la solicitud ajax:', error);
            });
    });

    // Actualiza los placeholders
    selectSubCategoria.addEventListener('change', function () {
        const selectedValue = this.value;
        console.log(selectedValue);

        // Enviar la solicitud Ajax al backend                
        fetch(`/detalle-subcategoria/${selectedValue}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response: ', data);
                desCorta.placeholder = data.scategoria_tipo || "Tipo de producto";
                marca.placeholder = data.scategoria_marca || "Marca de producto";
                medida.placeholder = data.scategoria_medida || "Medida de producto";

            }).catch(error => {
                console.error('Error en la solicitud ajax:', error);
            });

    });

    // Evento input sobre el elemento html con id pu_costoU_nuevo
    desCorta.addEventListener('input', function () {
        desCorta.value = this.value.toUpperCase();
    });

    marca.addEventListener('input', function () {
        marca.value = this.value.toUpperCase();
    });

    medida.addEventListener('input', function () {
        medida.value = this.value.toUpperCase();
    });


    registraProducto.addEventListener('click', function () {
        let validacion = 0;
        producto.value == ''
        const nombre_producto = `${desCorta.value} ${marca.value} ${medida.value}`.trim();
        producto.value = nombre_producto;
        const validacionFormProducto = document.getElementById('validacion-form-producto');

        // Validación de categoría
        if (selectCategoria.value == "0") {
            selectCategoria.classList.add('is-invalid');
            validacion = validacion + 1;
        }

        // Validación de subcategoría
        if (selectSubCategoria.value == "0") {
            selectSubCategoria.classList.add('is-invalid');
            validacion = validacion + 1;
        }

        if (desCorta.value == "") {
            desCorta.classList.add('is-invalid');
            validacion = validacion + 1;
        }

        if (marca.value == "") {
            marca.classList.add('is-invalid');
            validacion = validacion + 1;
        }

        if (medida.value == "") {
            medida.classList.add('is-invalid');
            validacion = validacion + 1;
        }

        if (validacion != 0) {
            validacionFormProducto.classList.add('show');
            //setTimeout(() => validacionFormProducto.classList.remove('show'), 5000); // Ocultar después de 5s            

            setTimeout(() => {
                validacionFormProducto.classList.remove('show');
                selectCategoria.classList.remove('is-invalid');
                selectSubCategoria.classList.remove('is-invalid');
                desCorta.classList.remove('is-invalid');
                marca.classList.remove('is-invalid');
                medida.classList.remove('is-invalid');

            }, 5000); // 5 segundos
            //return;
        }

        // creación del popup (ventana modal)
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('custom-popup-overlay');

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
        
                <div id="popup-body-i" class="custom-popup-body p-3">           
        
                </div>     
                
                <div id="popup-footer-i" class="custom-popup-footer text-end p-2">
                    <button id="popup-cancelar" type="button" class="btn btn-outline-secondary me-2">Cancelar</button>
                    <!--<button type="button" class="btn btn-primary" id="popup-aceptar">Si, Acepto</button>-->
                </div>
           
                <div id="loading-overlay-i" class="custom-loading-overlay">
                    <div class="spinner-border custom-spinner mb-3" role="status">                
                    </div>
                    <span id="loading-overlay-i-text">Procesando ...</span>
                </div>        
                `;

        overlayDiv.appendChild(popupDiv); // Agregar el popup al overlay y luego al body  
        document.body.appendChild(overlayDiv);
        const popupBody = document.getElementById('popup-body-i');
        const loadingOverlay = document.getElementById('loading-overlay-i');

        // enviar la solicitud Ajax al backend        
        fetch(`/registrar-producto/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Token CSRF para seguridad
            },
            body: JSON.stringify({
                nombre_producto: nombre_producto,
                marca: marca.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data)
                    loadingOverlay.classList.add('d-none');
                    popupBody.innerHTML = `
                        <p class="text-center">${nombre_producto}</p>
                    `;
                    data.coincidencias.forEach(coincidencia => {
                        // Crear el contenedor de cada fila
                        const row = document.createElement('div');
                        row.classList.add('row', 'mb-2'); // Clases de Bootstrap para diseño de filas y márgenes

                        // Columna 1: Nombre del producto
                        const colNombre = document.createElement('div');
                        colNombre.classList.add('col-8'); // Ancho de la columna ajustado (8/12)
                        colNombre.textContent = coincidencia.nombre_producto; // Agregar el nombre del producto

                        // Columna 2: Botón de actualizar
                        const colBoton = document.createElement('div');
                        colBoton.classList.add('col-4', 'text-end'); // Ancho de la columna ajustado (4/12) y alineado a la derecha

                        const botonActualizar = document.createElement('button');
                        botonActualizar.classList.add('btn', 'btn-primary', 'btn-sm'); // Clases Bootstrap para estilo del botón
                        botonActualizar.textContent = 'Actualizar';
                        botonActualizar.addEventListener('click', function () {
                            // Lógica de actualización aquí
                            console.log(`Actualizar: ${coincidencia.nombre_producto}`);
                            alert(`Actualizar: ${coincidencia.nombre_producto}`);
                        });

                        colBoton.appendChild(botonActualizar); // Agregar botón a la columna

                        // Agregar columnas a la fila
                        row.appendChild(colNombre);
                        row.appendChild(colBoton);

                        // Agregar fila al cuerpo del popup
                        popupBody.appendChild(row);

                    });

                    // Manejar el clic en el botón "Cancelar" dentro del popup
                    document.getElementById('popup-cancelar').addEventListener('click', function () {
                        overlayDiv.remove(); // Eliminar la alerta si el usuario cancela
                    });

                }
            })
            .catch(error => {
                console.error('error en la solicitud:', error);
            });

    });
});
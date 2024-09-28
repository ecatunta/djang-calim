document.addEventListener("DOMContentLoaded", function () {

    // Seleccionar todas las tarjetas con la clase "card"
    const cards = document.querySelectorAll(".card");

    // Añadir el evento click a cada tarjeta
    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            // Obtener la URL desde el atributo data-url
            const url = card.getAttribute("data-url");
            //alert (url)
            // Redirigir a la URL almacenada en el data-url
            window.location.href = url;
        });
    });

    // Obtén el elemento del campo de selección subcategoria
    var subcategoriaSelect = document.getElementById('subcategoria_id');

    // Agrega un listener para el evento 'change'
    subcategoriaSelect.addEventListener('change', function () {

        // Obtén el valor seleccionado        
        var subcategoria_id = this.value;
        console.log('subcategoria_id: ' + subcategoria_id);

        // Llama a la funcion para obtener la categoria  y maneja la promesa
        obtenerCategoria(subcategoria_id).then(categoria => {
            console.log('categoria:', categoria);
            // patributo_tabla_id esta definido en el archivo forms.py
            var input_patributo_tabla = document.getElementById('patributo_tabla_id');
            // Asigna el valor al campo de texto
            input_patributo_tabla.value = categoria;
            // Llama a la funcion obtenerCampos para obtener los campos de la tabla
            obtenerBD_tabla_campos(categoria.toLowerCase()).then(campos => {
                console.log('obtenerBD_tabla_campos_campos:', campos);
                if (!campos.exists) {
                    let mensaje = `La tabla <b>${categoria}</b> no fue localizado, consulte al administrador de sistemas`;
                    // Obtén el elemento donde se mostrará el mensaje
                    let mensajeDiv = document.getElementById('mensaje-div');
                    // Establece el contenido del div con el mensaje y agrega las clases de Bootstrap
                    mensajeDiv.innerHTML = mensaje;
                    mensajeDiv.classList.remove('alert', 'alert-success');
                    mensajeDiv.classList.add('alert', 'alert-warning');
                } else {
                    let mensaje = `La tabla <b>${categoria}</b> fue localizado con éxito, puede asignar sus atributos como vea conveniente`;
                    // Obtén el elemento donde se mostrará el mensaje
                    let mensajeDiv = document.getElementById('mensaje-div');
                    // Establece el contenido del div con el mensaje y agrega las clases de Bootstrap
                    mensajeDiv.innerHTML = mensaje;
                    mensajeDiv.classList.remove('alert', 'alert-warning');
                    mensajeDiv.classList.add('alert', 'alert-success');
                }

                analiza_atributo_tablaParametro(campos, subcategoria_id).then(response => {
                    console.log('analiza_atributo_tablaParametro: ', response)
                    llenarCheckboxesConCampos(response);
                }).catch(error => {
                    console.error('error: ', error);
                });
                // llenarCheckboxesConCampos(campos.fields);

            }).catch(error => {
                console.error('error al verificar la existencia de la tabla o la obtencion de los campos:', error);
            });

        }).catch(error => {
            console.error('error al obtener la categoría:', error);
        });
    });


    function obtenerCategoria(subcategoriaId) {
        // Realiza la solicitud Ajax
        return fetch(`/categorias_y_subcategorias/${subcategoriaId}/`)
            .then(response => response.json())
            .then(data => {
                // Manejar los datos recibidos
                //console.log('Categoría:', data.categoria_nombre);
                //console.log('Subcategoría:', data.subcategoria_nombre);
                return data.categoria_nombre
            }).catch(error => {
                console.error('Error obtenerCategoria: ', error);
            });
    }

    function obtenerBD_tabla_campos(table_name) {
        return fetch(`/obtener_tabla_campos/${table_name}/`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    return data;
                } else {
                    return data;
                }
            }).catch(error => {
                console.error('error: ', error);
            });
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    function analiza_atributo_tablaParametro(data, subcategoria_id) {
        console.log('...csrftoken... ', csrftoken);
        data.subcategoria_id = subcategoria_id;
        return fetch(`/analiza_atributo/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Asegúrate de que el servidor sepa que estás enviando JSON
                'X-CSRFToken': csrftoken,  // Incluye el token CSRF aquí
            },
            body: JSON.stringify(data)  // Convierte el objeto `data` a una cadena JSON
        })
            .then(response => response.json())
            .then(data => {
                console.log('respuesta del servidor:', data);
                return data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Función para llenar con checkboxes los campos obtenidos
    function llenarCheckboxesConCampos(campos) {
        console.log('...llenarCheckboxesConCampos: ', campos);

        // Obtén el contenedor donde se agregarán los checkboxes
        var contenedor = document.getElementById('patributo_nombre_container');

        // Limpia el contenido actual del contenedor
        contenedor.innerHTML = '';

        // Crear la tabla
        var table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'table-responsive', 'table-sm');  // Clases de Bootstrap para estilo

        // Crear el encabezado de la tabla
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');

        // Encabezados de las columnas
        var headers = ['Atributo', 'Nombre', 'Nivel', 'Orden'];
        headers.forEach(text => {
            var th = document.createElement('th');
            th.scope = "col";
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crear el cuerpo de la tabla
        var tbody = document.createElement('tbody');

        // Recorre los campos y crea una fila en la tabla por cada uno
        campos.forEach(campo => {
            // Crea una fila para cada conjunto de elementos
            var row = document.createElement('tr');

            // Columna para el checkbox y el label
            var tdAtributo = document.createElement('td');
            var checkboxDiv = document.createElement('div');
            checkboxDiv.classList.add('form-check');  // Añade clases para estilo (Bootstrap)

            // Crear y configurar el checkbox
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'checkbox_' + campo.atributo_nombre; // Asigna un id único
            checkbox.name = 'patributo_nombre'; // Todos los checkboxes tienen el mismo nombre para que Django los reconozca
            checkbox.value = campo.atributo_nombre;
            checkbox.classList.add('form-check-input', 'me-2');

            // Marcar el checkbox si `atributo_estado` es 'checked'
            if (campo.atributo_estado === 'checked') {
                checkbox.checked = true;
            }

            // Crear la etiqueta asociada al checkbox
            var label = document.createElement('label');
            label.setAttribute('for', 'checkbox_' + campo.atributo_nombre);
            label.classList.add('form-check-label');
            label.textContent = campo.atributo_nombre;

            // Añadir el checkbox y el label al div, luego a la celda
            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            tdAtributo.appendChild(checkboxDiv);

            // Columna para el input `patributo_label`
            var tdLabel = document.createElement('td');
            var inputLabel = document.createElement('input');
            inputLabel.type = 'text';
            inputLabel.name = 'patributo_label_' + campo.atributo_nombre;
            inputLabel.value = campo.atributo_label || ''; // Usa el valor de campo.patributo_label o un string vacío
            inputLabel.classList.add('form-control', 'form-control-sm'); // Clases para estilo (Bootstrap)
            inputLabel.placeholder = 'Label';
            tdLabel.appendChild(inputLabel);

            // Columna para el input `patributo_nivel`
            var tdNivel = document.createElement('td');
            var inputNivel = document.createElement('input');
            inputNivel.type = 'number';
            inputNivel.name = 'patributo_nivel_' + campo.atributo_nombre;
            inputNivel.value = campo.atributo_nivel || ''; // Usa el valor de campo.patributo_nivel o un string vacío
            inputNivel.classList.add('form-control', 'form-control-sm'); // Clases para estilo (Bootstrap)
            inputNivel.placeholder = 'Nivel';
            tdNivel.appendChild(inputNivel);

            // Columna para el input `patributo_orden`
            var tdOrden = document.createElement('td');
            var inputOrden = document.createElement('input');
            inputOrden.type = 'number';
            inputOrden.name = 'patributo_orden_' + campo.atributo_nombre;
            inputOrden.value = campo.atributo_orden || ''; // Usa el valor de campo.patributo_orden o un string vacío
            inputOrden.classList.add('form-control', 'form-control-sm'); // Clases para estilo (Bootstrap)
            inputOrden.placeholder = 'Orden';
            tdOrden.appendChild(inputOrden);

            // Añadir las celdas a la fila
            row.appendChild(tdAtributo);
            row.appendChild(tdLabel);
            row.appendChild(tdNivel);
            row.appendChild(tdOrden);

            // Añadir la fila al cuerpo de la tabla
            tbody.appendChild(row);
        });

        // Añadir el cuerpo de la tabla a la tabla
        table.appendChild(tbody);

        // Añadir la tabla al contenedor
        contenedor.appendChild(table);
    }
});
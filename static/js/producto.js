document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los botones de actualizar producto
    const actualiza_producto = document.querySelectorAll('.actualiza_producto');

    // Obtener los inputs por su ID
    const inputTipo = document.getElementById('ap_tipo');
    const inputMarca = document.getElementById('ap_marca');
    const descripcionCorta = document.getElementById('ap_descripcion_corta');
    const inputMedida = document.getElementById('ap_medida');
    const vistaPrevia = document.getElementById('ap_producto_nombre_upd');

    // Función para actualizar la vista previa
    function actualizarVistaPrevia() {
        const tipo = inputTipo.value.toUpperCase();
        const marca = inputMarca.value.toUpperCase();
        const descripcion = descripcionCorta.value.toUpperCase();
        const medida = inputMedida.value.toUpperCase();

        // Concatenar los valores en el orden definido        
        const cadenaVistaPrevia = `${tipo} ${marca} ${descripcion} ${medida}`.trim();

        // Si todos los campos están vacíos, mostrar el placeholder
        if (!tipo && !marca && !descripcion && !medida) {
            vistaPrevia.innerHTML = '<span id="ap_producto_placeholder" style="color: #555; font-weight: normal;">Vista previa nombre del producto...</span>';
        } else {
            // Actualizar el contenido del elemento de vista previa
            vistaPrevia.textContent = cadenaVistaPrevia;
        }

        /*// Añadir clase para resaltar (opcional)
        vistaPrevia.classList.add('highlight');

        // Remover la clase de resaltado después de 1 segundo
        setTimeout(() => {
            vistaPrevia.classList.remove('highlight');
        }, 1000);*/

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

    // Agregar el evento click a cada botón de actualizar producto
    actualiza_producto.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            inputTipo.value = '';
            inputMarca.value = '';
            descripcionCorta.value = '';
            inputMedida.value = '';
            // Resetear la vista previa con el placeholder
            vistaPrevia.innerHTML = '<span id="ap_producto_placeholder" style="color: #555; font-weight: normal;">Vista previa nombre del producto...</span>';

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
});
document.addEventListener('DOMContentLoaded', function () {

    //alert('hola mundo.');
    const selectCategoria = document.getElementById('select-categoria');
    const selectSubCategoria = document.getElementById('select-subcategoria');
    const desCorta = document.getElementById('desCorta');
    const marca = document.getElementById('marca');
    const medida = document.getElementById('medida');
    const producto = document.getElementById('nombre-producto');
    const guardaProducto = document.getElementById('guarda_producto');

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

    guardaProducto.addEventListener('click', function () {
        producto.value == ''
        console.log('sin nombre para el producto');
        const nombre_producto = `${desCorta.value} ${marca.value} ${medida.value}`.trim();
        producto.value = nombre_producto;

        // Validación de categoría
        if (selectCategoria.value == "0") {
            validacionCategoria.classList.add('show');
            setTimeout(() => validacionCategoria.classList.remove('show'), 5000); // Ocultar después de 5s            
        }

        // Validación de subcategoría
        if (selectSubCategoria.value == "0") {
            validacionSubCategoria.classList.add('show');
            setTimeout(() => validacionSubCategoria.classList.remove('show'), 5000); // Ocultar después de 5s            
        }

        if (desCorta.value == "") {
            validacionDesCorta.classList.add('show');
            setTimeout(() => validacionDesCorta.classList.remove('show'), 5000); // Ocultar después de 5s            
        }

        if (marca.value == "") {
            validacionMarca.classList.add('show');
            setTimeout(() => validacionMarca.classList.remove('show'), 5000); // Ocultar después de 5s            
        }

        if (medida.value == "") {
            validacionMedida.classList.add('show');
            setTimeout(() => validacionMedida.classList.remove('show'), 5000); // Ocultar después de 5s            
        }

    });
});
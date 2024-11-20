document.addEventListener("DOMContentLoaded", function () {
    const btnGenerarItem = document.getElementById('generar-sigla');
    //alert ('inicio');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    function mobileNavToogle() {
        document.querySelector('body').classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
    }
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);


    //Toggle mobile nav dropdowns   
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
        navmenu.addEventListener('click', function (e) {
            e.preventDefault();
            this.parentNode.classList.toggle('active');
            this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
            e.stopImmediatePropagation();
        });
    });


    btnGenerarItem.addEventListener('click', function (event) {
        console.log('evento click al elemento html de ID generar-sigla');

        // Enviar la solicitud Ajax al backend        
        fetch(`/genera-sigla-producto/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                //.then(response => {
                console.log('Response: ', data)
                if (data.success) {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud ajax:', error);
            });
    });


});
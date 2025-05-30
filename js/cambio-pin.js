$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();

    checkInicioSesion();

    //actualizaTitulos();

    //** Constantes y variables globales de la página */

    $('#idPerfil').val(sessionStorage.getItem('ID_USUARIO'));
    $('#nomUsuPerfil').val(sessionStorage.getItem('NOM_USUARIO'));


    const $pinActual = $('#pinActual').val('');

    const $pinNuevo = $('#pinNuevo').val('');


    const $pinNuevoConf = $('#pinNuevoConf').val('');

    $('#btnCambiar').click((e) => {
        e.preventDefault();
        cambiaPin();

    });


    function cambiaPin() {

        let pinActual = $pinActual.val();
        let pinNuevo = $pinNuevo.val();
        let pinNuevoConf = $pinNuevoConf.val();

        if (pinNuevo.length < 4) {

            Swal.fire({ title: "El PIN nuevo debe tener de 4-8 digitos", icon: "error" });
            $pinNuevo.focus();
            return;
        }


        if (pinNuevo != pinNuevoConf) {

            Swal.fire({ title: "Error al validar el nuevo pin. Campos NO son iguales", icon: "error" });
            $pinNuevoConf.focus();
            return;
        }


        let req = new Object();
        req.w = "apiSicocir";
        req.r = "cambia_pin";
        req.id_usuario = sessionStorage.getItem('ID_USUARIO');
        req.pin_actual = pinActual;
        req.nuevo_pin = pinNuevo;

        fetch_postRequest(req, function (data) {
            //console.log(data);

            let element = data.resp;

            if (element.estadoRes == 'error') {

                $pinActual.focus();
                Swal.fire({ title: element.msg, icon: "error" });
                return;
            }


           


            $pinActual.val('');
            $pinNuevo.val('');
            $pinNuevoConf.val('');
            $pinActual.focus();

             //Swal.fire({ title: element.msg, icon: "success" });
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: element.msg,
                showConfirmButton: false,
                timer: 1500
            });


            //iGoTo('./inicio.html');

        });

    }


});
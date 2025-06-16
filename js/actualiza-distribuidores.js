$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_usuarios = [];
    var listaUsuarios = [];

    var nuevoUsu = true;
    var codUsuario = 0;

    const $txtCodUsu = $('#txtCodUsu')
        .val('')
        .focus(function () {
            $(this).select();
            limpiaCampos();
            inactivaCampos();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                e.preventDefault();

                if ($(this).val().length > 0) {

                    consultaUsuario();
                }
            }
        });

    const $txtIdUsu = $('#txtIdUsu')
        .val('')
        .focus(function () {
            $(this).select();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                e.preventDefault();

                if ($(this).val().length > 0) {

                    let x = $(this).val().replace(/ /g, '');
                    $(this).val(x.toLowerCase());

                    $txtNomUsu.focus();
                }
            }
        });

    const $txtNomUsu = $('#txtNomUsu')
        .val('')
        .focus(function () {
            $(this).select();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {
                $btnActUsuario.focus();
                e.preventDefault();
            }
        });

    const $cbEstadoUsu = $('#cbEstadoUsu')
        .change(function () {

            $btnActUsuario.focus();
        });


    const $cbFiltraDis = $('#cbFiltraDis')
        .change(function () {

            llenaTablaDistribuidores();

        });

    const $btnResPin = $('#btnResPin')
        .click(function (e) {

            Swal
                .fire({
                    title: "Esta seguro de resetear el PIN?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: "Sí, resetear",
                    cancelButtonText: "Cancelar",
                })
                .then(resultado => {
                    if (resultado.value) {

                        reseteaPin();

                    }
                });

            e.preventDefault();

        });



    const $btnNuevoUsu = $('#btnNuevoUsu')
        .click(function (e) {

            nuevoUsuario();

            e.preventDefault();

        });


    const $btnActUsuario = $('#btnActUsuario')
        .click(function (e) {

            actualizaUsuario().then(function () {
                llenaTablaDistribuidores();
            });
            e.preventDefault();

        });

    const $btnCancelar = $('#btnCancelar')
        .click(function (e) {

            limpiaCampos();
            inactivaCampos();

            e.preventDefault();

        });

    const $btnImprimir = $('#btnImprimir')
        .click(function (e) {

            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/Windows Phone/i)) {
                console.log("Estás usando un dispositivo móvil!!");
                Swal.fire({ title: "Proceso de impresion no esta disponible en dispositivos móviles", icon: "error" });
                return;
            }

            e.preventDefault();

            imprimeReporte();

        });




    var $tblUsuarios = $('#tblUsuarios').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_usuarios,
        columns: [
            {
                data: 'cod_usu',
                visible: false
            },

            {
                data: 'nom_usu'

            },
            {
                data: 'id_usu',
                className: 'text-center'

            },
            {
                data: 'est_usu',
                className: 'text-center'

            },

            {
                defaultContent: '<button class="editar btn btn-primary"><i class="bi bi-pen"></i></button>',
                className: 'text-center'

            }

        ],
        info: false,
        ordering: false,
        language: lenguaje_data_table
    });


    $tblUsuarios.on('click', 'button.editar', function () {

        let fila = $tblUsuarios.row($(this).parents('tr')).data();

        $txtCodUsu.val(fila.cod_usu);

        consultaUsuario();

    });


    function inactivaCampos() {

        $txtIdUsu.prop('disabled', true);
        $txtNomUsu.prop('disabled', true);
        $cbEstadoUsu.prop('disabled', true);
        $btnActUsuario.prop('disabled', true);
        $btnResPin.prop('disabled', true);

    }

    function activaCampos() {

        $txtIdUsu.prop('disabled', nuevoUsu == false);
        $txtNomUsu.prop('disabled', false);
        $cbEstadoUsu.prop('disabled', false);
        $btnActUsuario.prop('disabled', false);

    }

    function limpiaCampos() {

        $txtIdUsu.val('');
        $txtNomUsu.val('');
        $cbEstadoUsu.val('1');


    }


    function nuevoUsuario() {

        limpiaCampos();
        activaCampos();
        $txtCodUsu.val('');
        $txtIdUsu.val('');
        $txtIdUsu.prop('disabled', false);
        nuevoUsu = true;
        $txtIdUsu.focus();

    }


    async function llenaTablaDistribuidores() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_distribuidores';
        req.filtro = Number.parseInt($cbFiltraDis.val());

        lista_usuarios = new Array();

        $tblUsuarios.clear().draw();

        $('#spinnerDis').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinnerDis').hide();

                listaUsuarios = data.resp;

                for (let i = 0; i < listaUsuarios.length; i++) {

                    const element = listaUsuarios[i];

                    let itemTabla = new Object();
                    itemTabla.id_usu = element.id_usuario;
                    itemTabla.cod_usu = element.cod_usuario;
                    itemTabla.nom_usu = element.nom_usuario;

                    //itemTabla.tipo_usu = aTipoUsu[Number.parseInt(element.tipo_usuario) - 2];
                    itemTabla.est_usu = Number.parseInt(element.est_usuario) == 1 ? 'ACTIVO' : 'INACTIVO';
                    lista_usuarios.push(itemTabla);
                }

                $tblUsuarios.rows.add(lista_usuarios).draw();
            });
    }



    /*********************************************************************************************************************** */

    async function consultaUsuario() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'consulta_distribuidor';
        req.cod_usuario = Number.parseInt($txtCodUsu.val());

        $('#spinner').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                //console.log(data)

                let element = data.resp;

                if (element.estadoRes == 'error') {

                    $txtIdUsu.focus();
                    Swal.fire({ title: element.msg, icon: "error" });
                    return;

                }

                $txtIdUsu.val(element.datos.id_usuario);
                $txtNomUsu.val(element.datos.nom_usuario);

                $cbEstadoUsu.val(element.datos.est_usuario);

                nuevoUsu = false;

                activaCampos();
                $btnResPin.prop('disabled', false);

                $txtNomUsu.focus();

            });
    }

    async function actualizaUsuario() {

        if ($txtIdUsu.val().length < 4 && nuevoUsu) {
            $txtIdUsu.focus();
            Swal.fire({ title: "El ID debe tener como minimo 4 caracteres", icon: "warning" });
            return;
        }

        if ($txtNomUsu.val().length < 4) {
            $txtNomUsu.focus();
            Swal.fire({ title: "El nombre debe tener como minimo 4 caracteres", icon: "warning" });
            return;
        }

        let codUsuario = $txtCodUsu.val().length > 0 ? Number.parseInt($txtCodUsu.val()) : 0;

        if (nuevoUsu) {

            let x = $txtIdUsu.val().replace(/ /g, '');
            $txtIdUsu.val(x.toLowerCase());
        }


        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'actualiza_distribuidor';
        req.nuevo = nuevoUsu;
        req.cod_usu = Number.parseInt($txtCodUsu.val());
        req.id_usu = $txtIdUsu.val();
        req.nom_usu = $txtNomUsu.val();
        req.tipo_usu = 1;
        req.est_usu = Number.parseInt($cbEstadoUsu.val());

        $('#spinner').show();


        await fetch_postRequest(req,
            function (data) {

                console.log(data)

                $('#spinner').hide();


                let response = data.resp;
                if (response.status == 'error') {

                    Swal.fire({ title: response.msg, icon: "error" });
                    return;

                }

                $txtCodUsu.val('').focus();


                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });


            });
    }

    async function reseteaPin() {


        let req = new Object();
        req.w = "apiSicocir";
        req.r = "resetea_pin";

        req.cod_usu = codUsuario;


        $('#spinnerActUsu').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinnerActUsu').hide();

                let response = data.resp;


                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    }

    function imprimeReporte() {



        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/Windows Phone/i)) {

         Swal.fire({ title: "Proceso de impresión no esta disponible en dispositivos móviles", type: "error" });
            return;
        }



        if (listaUsuarios.length > 0) {
            console.log('Imprimiendo reporte');

            let datos = new Object();

            datos.lista = lista_usuarios;

            new Listado_Distribuidores(datos);

        }
    }



    llenaTablaDistribuidores();

    inactivaCampos();



});
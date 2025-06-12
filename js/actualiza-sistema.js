$(function () {


    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();

    checkInicioSesion();


    var lista_usuarios = []; // array para datatable usuarios
    var listaUsuarios = []; // array para guardar lista usuarios recibidos
    var lista_tipo_neg = []; // array para datatable tipo negocios
    var listaTipoNeg = []; // array para guardar lista de negocios recibidos
    var lista_items_mercha = []; // array para guardar items de datatable
    var listaItemsMercha = []; // array para guardar lista de items recibidos


    var nuevoUsu = true;
    var nuevoMercha = true;
    var nuevoTipoNeg = true;

    var codTipoNeg = 0;
    var codUsuario = 0;
    var codMercha = 0;






    const $txtIdUsu = $('#txtIdUsu')
        .val('')
        .focus(function () {
            $(this).select();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {
                let x = $(this).val().replace(/ /g, '');
                $(this).val(x.toLowerCase());
                $txtNomUsu.focus();

                e.preventDefault();
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

                $btnActUsu.focus();

                e.preventDefault();
            }
        });


    const $cbTipoUsu = $('#cbTipoUsu').val('2');


    const $cbEstadoUsu = $('#cbEstadoUsu');




    const $txtNomTipoNeg = $('#txtNomTipoNeg')
        .val('')
        .focus(function () {
            $(this).select();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {
                $btnActTipoNeg.focus();
                e.preventDefault();
            }
        });

    const $cbEstadoTipoNeg = $('#cbEstadoTipoNeg');

    const $txtNomItem = $('#txtNomMercha')
        .val('')
        .focus(function () {
            $(this).select();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {
                $btnActMercha.focus();
                e.preventDefault();
            }
        });

    const $cbEstadoItem = $('#cbEstadoMercha');

    const $btnAgregaUsu = $('#btnAgregaUsu').click(function (e) {


        nuevoUsu = true;
        codUsuario = 0;

        $btnResPin.prop('disabled', true);
        $cbEstadoUsu.val('1');
        $cbTipoUsu.val('2');
        $txtNomUsu.val('');
        $txtIdUsu.prop('disabled',false).val('').focus();

        e.preventDefault();

    });

    const $btnResPin = $('#btnResPin').click(function (e) {

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



    const $btnActUsu = $('#btnActUsu').click(function (e) {

        actualizaUsuario().then(function () {
            llenaTablaUsuarios();
        });
        e.preventDefault();

    });

    const $btnAgregaTipoNeg = $('#btnAgregaTipoNeg').click(function (e) {


        nuevoTipoNeg = true;
        codTipoNeg = 0;

        $cbEstadoTipoNeg.val('1');
        $txtNomTipoNeg.val('').focus();


        e.preventDefault();

    });


    const $btnActTipoNeg = $('#btnActTipoNeg').click(function (e) {

        //$btnActTipoNeg.prop('disabled', false);

        actualizaTipoNegocio().then(function () {
            llenaTablaTipoNeg();
        });
        e.preventDefault();

    });

    const $btnAgregaMercha = $('#btnAgregaMercha').click(function (e) {


        nuevoMercha = true;
        codMercha = 0;

        $cbEstadoItem.val('1');
        $txtNomItem.val('').focus();


        e.preventDefault();

    });

    const $btnActMercha = $('#btnActMercha').click(function (e) {

        actualizaMercha().then(function () {

            llenaTablaMercha();
        });
        e.preventDefault();

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
                data: 'tipo_usu'

            },

            {
                data: 'est_usu',
                className: 'text-center'

            },

            {
                defaultContent: '<button class="editar btn btn-primary"><i class="bi bi-pen"></i></button>'


            }

        ],
        info: false,
        ordering: false,
        language: lenguaje_data_table
    });

    $tblUsuarios.on('click', 'button.editar', function () {

        let fila = $tblUsuarios.row($(this).parents('tr')).index();

        $('#modActUsu').modal('show');

        codUsuario = listaUsuarios[fila].cod_usuario;
        nuevoUsu = false;

        $txtIdUsu.val(listaUsuarios[fila].id_usuario);
        $txtNomUsu.val(listaUsuarios[fila].nom_usuario);
        $cbTipoUsu.val(listaUsuarios[fila].tipo_usuario);
        $cbEstadoUsu.val(listaUsuarios[fila].est_usuario);

        $btnResPin.prop('disabled', false);
        $txtIdUsu.prop('disabled', true);
        $txtNomUsu.focus();

    });



    var $tblTipoNeg = $('#tblTipoNeg').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_tipo_neg,
        columns: [
            {
                data: 'cod_tipo_neg',
                visible: false

            },
            {
                data: 'nom_tipo_neg'

            },
            {
                data: 'est_tipo_neg',
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

    $tblTipoNeg.on('click', 'button.editar', function () {

        let fila = $tblTipoNeg.row($(this).parents('tr')).index();


        $('#modActTipoNeg').modal('show');

        nuevoTipoNeg = false;

        codTipoNeg = Number.parseInt(listaTipoNeg[fila].cod_tipo_neg);
        $txtNomTipoNeg.val(listaTipoNeg[fila].nom_tipo_neg);
        $cbEstadoTipoNeg.val(listaTipoNeg[fila].est_tipo_neg);
        $txtNomTipoNeg.focus();

    });


    var $tblItemsMercha = $('#tblItemsMercha').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_items_mercha,
        columns: [
            {
                data: 'cod_item',
                visible: false

            },
            {
                data: 'nom_item'

            },
            {
                data: 'est_item',
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

    $tblItemsMercha.on('click', 'button.editar', function () {

        let fila = $tblItemsMercha.row($(this).parents('tr')).index();

        $('#modActMercha').modal('show');

        nuevoMercha = false;

        codMercha = Number.parseInt(listaItemsMercha[fila].cod_item);
        $txtNomItem.val(listaItemsMercha[fila].nom_item);
        $cbEstadoItem.val(listaItemsMercha[fila].est_item);
        $txtNomItem.focus();


    });



    async function actualizaTipoNegocio() {


        if ($txtNomTipoNeg.val().length < 4) {
            $txtNomTipoNeg.focus();
            Swal.fire({ title: "La descripción del tipo de negocio debe ser de 4 caracteres mínimo", icon: "warning" });
            return;
        }


        let req = new Object();
        req.w = "apiSicocir";
        req.r = "actualiza_tipo_neg";
        req.nuevo = nuevoTipoNeg;
        req.cod_tipo_neg = codTipoNeg;
        req.nom_tipo_neg = $txtNomTipoNeg.val();
        req.est_tipo_neg = Number.parseInt($cbEstadoTipoNeg.val());

        $('#spinnerActTipoNeg').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinnerActTipoNeg').hide();

                let response = data.resp;

                $('#modActTipoNeg').modal('hide');

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    }




    async function llenaTablaTipoNeg() {

        let req = new Object();
        req.w = "apiSicocir";
        req.r = "lista_tipo_neg";
        req.activas = false;

        lista_tipo_neg = new Array();

        $tblTipoNeg.clear().draw();

        $('#spinnerTipoNeg').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinnerTipoNeg').hide();

                listaTipoNeg = data.resp;

                for (let i = 0; i < listaTipoNeg.length; i++) {

                    const element = listaTipoNeg[i];

                    let itemTabla = new Object();
                    itemTabla.cod_tipo_neg = element.cod_tipo_neg;
                    itemTabla.nom_tipo_neg = element.nom_tipo_neg;
                    itemTabla.est_tipo_neg = Number.parseInt(element.est_tipo_neg) == 1 ? 'ACTIVO' : 'INACTIVO';
                    lista_tipo_neg.push(itemTabla);
                }

                $tblTipoNeg.rows.add(lista_tipo_neg).draw();
            });


    }

    async function actualizaMercha() {


        if ($txtNomItem.val().length < 4) {
            $txtNomItem.focus();
            Swal.fire({ title: "La descripción del item debe ser de 4 caracteres mínimo", icon: "warning" });
            return;
        }


        let req = new Object();
        req.w = "apiSicocir";
        req.r = "actualiza_item";
        req.nuevo = nuevoMercha;
        req.cod_item = codMercha;
        req.nom_item = $txtNomItem.val();
        req.cat_item = 2;
        req.est_item = Number.parseInt($cbEstadoItem.val());


        $('#spinnerActMercha').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinnerActMercha').hide();

                let response = data.resp;

                $('#modActMercha').modal('hide');

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    }

    async function llenaTablaMercha() {

        let req = new Object();
        req.w = "apiSicocir";
        req.r = "lista_items";
        req.cat_item = 2;

        lista_items_mercha = new Array();

        $tblItemsMercha.clear().draw();

        $('#spinnerMercha').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinnerMercha').hide();

                listaItemsMercha = data.resp;

                for (let i = 0; i < listaItemsMercha.length; i++) {

                    const element = listaItemsMercha[i];

                    let itemTabla = new Object();
                    itemTabla.cod_item = element.cod_item;
                    itemTabla.nom_item = element.nom_item;
                    itemTabla.est_item = Number.parseInt(element.est_item) == 1 ? 'ACTIVO' : 'INACTIVO';
                    lista_items_mercha.push(itemTabla);
                }

                $tblItemsMercha.rows.add(lista_items_mercha).draw();
            });


    }


    async function actualizaUsuario() {


        if ($txtNomUsu.val().length < 4) {
            $txtNomUsu.focus();
            Swal.fire({ title: "Nombre usuario debe ser de 4 caracteres mínimo", icon: "warning" });
            return;
        }


        let x = $txtIdUsu.val().replace(/ /g, '');
        $txtIdUsu.val(x.toLowerCase());


        if ($txtIdUsu.val().length < 4) {
            $txtIdUsu.focus();
            Swal.fire({ title: "ID debe ser de 4 caracteres mínimo", icon: "warning" });
            return;
        }

        let req = new Object();
        req.w = "apiSicocir";
        req.r = "actualiza_usuario";
        req.nuevo = nuevoUsu;
        req.cod_usu = codUsuario;
        req.id_usu = $txtIdUsu.val();
        req.nom_usu = $txtNomUsu.val();
        req.nom_comercial = '';
        req.tipo_usu = Number.parseInt($cbTipoUsu.val());
        req.est_usu = Number.parseInt($cbEstadoUsu.val());


        $('#spinnerActUsu').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinnerActUsu').hide();

                let response = data.resp;

                if (response.estadoRes == 'error') {

                    $txtIdUsu.focus();
                    Swal.fire({ title: response.msg, icon: "error" });
                    return;

                }

                $('#modActUsu').modal('hide');

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

    async function llenaTablaUsuarios() {

        let aTipoUsu = ['Ejecutivo', 'Supervisor', 'Super ADM'];

        let req = new Object();
        req.w = "apiSicocir";
        req.r = "lista_usuarios";

        lista_usuarios = new Array();

        $tblUsuarios.clear().draw();

        $('#spinnerUsu').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinnerUsu').hide();

                listaUsuarios = data.resp;

                for (let i = 0; i < listaUsuarios.length; i++) {

                    const element = listaUsuarios[i];

                    let itemTabla = new Object();
                    itemTabla.cod_usu = element.cod_usuario;
                    itemTabla.nom_usu = element.nom_usuario;

                    itemTabla.tipo_usu = aTipoUsu[Number.parseInt(element.tipo_usuario) - 2];
                    itemTabla.est_usu = Number.parseInt(element.est_usuario) == 1 ? 'ACTIVO' : 'INACTIVO';
                    lista_usuarios.push(itemTabla);
                }

                $tblUsuarios.rows.add(lista_usuarios).draw();
            });


    }


    llenaTablaTipoNeg();

    llenaTablaMercha();

    llenaTablaUsuarios();




});
$(function () {

    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();


    /** Crea variables  */
    var listaClientes = new Array();
    var listaDistri = new Array();

    var $tblClientes;

    var mNuevo = true;
    var mLatitud = 0;
    var mLongitud = 0;

    const $txtCodCliente = $('#txtCodCliente');
    const $txtNomCliente = $('#txtNomCli');

    const $txtCodDistri = $('#txtCodDistri');
    const $txtNomDistri = $('#txtNomDistri');


    const $txtEmail = $('#txtEmail');
    const $txtNomContacto = $('#txtNomContacto');
    const $txtTelContacto = $('#txtTelContacto');
    const $txtFecApe = $('#txtFecApe').val(obtieneFechaActual());
    const $cbEstado = $('#cbEstado').val(1);
    const $cbTipoNeg = $('#cbTipoNeg').val(0);


    const $cbProvincias = $('#cbProvincias')
        .change(() => {

            llenaComboCantones();

        });

    const $cbCantones = $('#cbCantones')
        .change(() => {
            llenaComboDistritos();
        });
    const $cbDistritos = $('#cbDistritos');

    const $txtSennas = $('#txtSennas');

    const $btnBuscaCli = $('#btnBuscaCli');
    const $btnBuscaDis = $('#btnBuscaDis');
    const $btnNuevoCliente = $('#btnNuevo');
    const $btnActualizar = $('#btnActualizar');
    const $btnCancelar = $('#btnCancelar');

    const $btnCerrarModCli = $('#btnCerrarModCli');


    ini_componentes();

    limpiaCampos();
    inactivaCampos();
    llenaComboProvincias();
    //llenaComboTipoNegocios();



    function ini_componentes() {

        $tblClientes = $('#tblClientes').DataTable({

            destroy: true,
            data: listaClientes,
            columns: [
                {
                    data: 'cod_cliente'

                },
                {
                    data: 'nom_cliente'
                },

                {
                    defaultContent: '<button class="editar btn btn-light"><i class="bi bi-arrow-right-circle"></i></button>',
                    className: 'dt-right',
                    with: "10%"
                }

            ],
            info: false,
            ordering: false,
            language: lenguaje_data_table

        }); /// Fin de creacion de datatable

        $tblClientes.clear().draw();


        $('#tblClientes').on('click', 'button.editar', function () {

            let fila = $tblClientes.row($(this).parents('tr')).index();

            $('#txtNomComercial').focus();

            $('#modBuscaCli').modal('hide');

            $txtCodCliente.val(listaClientes[fila].cod_cliente);

            consultaCliente();

        });

        $tblDistri = $('#tblDistri').DataTable({

            destroy: true,
            data: listaDistri,
            columns: [
                {
                    data: 'cod_dis'

                },
                {
                    data: 'nom_dis'
                },

                {
                    defaultContent: '<button class="editar btn btn-light"><i class="bi bi-arrow-right-circle"></i></button>',
                    className: 'dt-right',
                    with: "10%"
                }

            ],
            info: false,
            ordering: false,
            language: lenguaje_data_table

        }); /// Fin de creacion de datatable

        $tblClientes.clear().draw();


        $('#tblDistri').on('click', 'button.editar', function () {

            let fila = $tblDistri.row($(this).parents('tr')).index();

            $('#txtNomComercial').focus();

            $('#modBuscaCli').modal('hide');

            $txtCodDistri.val(listaDistri[fila].cod_dis);

            //consultaCliente();

        });

        $txtCodDistri
            .focus(function () {
                $(this).select();
                limpiaCampos();
                inactivaCampos();


            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {
                    e.preventDefault();

                    if ($txtCodDistri.val().length > 0) {



                        //consultaDistribuidor();
                    }


                }
            });






        $txtCodCliente
            .focus(function () {
                $(this).select();


            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    if ($txtCodCliente.val().length > 0) {

                        consultaCliente();
                    } else {
                        nuevoCliente();
                    }

                    e.preventDefault();
                }
            });


        $txtNomCliente
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    $txtNomTributa.focus();
                    e.preventDefault();
                }
            });



        $txtEmail
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    $txtNomContacto.focus();
                    e.preventDefault();
                }
            });


        $txtNomContacto
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    $txtTelContacto.focus();
                    e.preventDefault();
                }
            });


        $txtTelContacto
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    e.preventDefault();
                }
            });


        $txtSennas
            .focus(function () {
                $(this).select();

            });

        $btnBuscaCli.click(function (e) {


            $('#modBuscaCli').modal('show');



            e.preventDefault();

        });

        $btnBuscaDis.click(function (e) {

            $('#modBuscaDis').modal('show');

            e.preventDefault();

        });





        $btnNuevoCliente.click(function (e) {

            e.preventDefault();
            nuevoCliente();
        });



        $btnActualizar.click(function (e) {

            actualizaCliente();

            e.preventDefault();
        });


        $btnCancelar.click(function (e) {

            limpiaCampos();
            inactivaCampos();
            $txtCodCliente.focus();

            e.preventDefault();
        });

        $btnCerrarModCli.click(function (e) {

            limpiaCampos();
            inactivaCampos();
            $txtCodCliente.focus();

            e.preventDefault();
        });



    }

    /***************************************************************
     *  Consulta cliente
     ***************************************************************/

    async function consultaCliente() {

        $('#spinner').show();


        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'consulta_cliente';
        req.cod_cliente = Number.parseInt($txtCodCliente.val());


        await fetch_postRequest(req,
            function (data) {

                //console.log(data)

                $('#spinner').hide();

                if (data.resp != null) {

                    $txtNomCliente.val(data.resp.nom_cliente);
                    $txtEmail.val(data.resp.email_cliente);
                    $txtNomContacto.val(data.resp.nom_contacto);
                    $txtTelContacto.val(data.resp.tel_negocio);

                    $txtFecApe.val(data.resp.fecapertura);
                    $cbEstado.val(data.resp.status_cli);



                    $txtSennas.val(data.resp.referencia);

                    let _idProvincia = data.resp.idProvincia;
                    let _idCanton = data.resp.idCanton;
                    let _idDistrito = data.resp.idDistrito;

                    mLatitud = data.resp.latitud;
                    mLongitud = data.resp.longitud;

                    $cbProvincias.val(_idProvincia);

                    llenaComboCantones().then(() => {
                        $cbCantones.val(_idCanton);
                        llenaComboDistritos().then(() => {
                            $cbDistritos.val(_idDistrito);
                        })

                    });

                    llenaComboPdvs($cbAgencias.val()).then(() => {
                        $cbPdvs.val(_codPdv);

                    });

                    activaCampos();
                    mNuevo = false;

                    $txtNomCliente.focus();



                } else {
                    //$('#spinner').hide();
                    Swal.fire({ title: "Cliente NO existe", icon: "error" });

                }

            });
    }


    async function actualizaCliente() {

        // Validacion de campos

        if ($txtNomCliente.val().length == 0) {
            $txtNomCliente.focus();
            Swal.fire({ title: "Nombre del cliente es requerido", icon: "warning" });
            return;
        }

        if ($txtEmail.val().length > 0 && !validarEmail($txtEmail.val())) {
            $txtEmail.focus();
            Swal.fire({ title: "Debe digitar un Email válido ", icon: "warning" });
            return;

        }

        if ($cbProvincias.val() == 0) {
            Swal.fire({ title: "Debe seleccionar una provincia", icon: "warning" });
            return;
        }
        if ($cbCantones.val() == 0) {
            Swal.fire({ title: "Debe seleccionar un cantón", icon: "warning" });
            return;
        }
        if ($cbDistritos.val() == 0) {
            Swal.fire({ title: "Debe seleccionar un distrito", icon: "warning" });
            return;
        }



        $('#spinner').show();

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'actualiza_cliente';
        req.nuevo = mNuevo;
        req.cod_cliente = Number.parseInt($txtCodCliente.val());
        req.nom_cliente = $txtNomCliente.val();
        req.email_cliente = $txtEmail.val();
        req.tel_negocio = $txtTelContacto.val();
        req.tel_contacto = $txtTelContacto.val();
        req.nom_contacto = $txtNomContacto.val();
        req.idProvincia = Number.parseInt($cbProvincias.val());
        req.provincia = $('select[id="cbProvincias"] option:selected').text();
        req.idCanton = Number.parseInt($cbCantones.val());
        req.canton = $('select[id="cbCantones"] option:selected').text();
        req.idDistrito = Number.parseInt($cbDistritos.val());
        req.distrito = $('select[id="cbDistritos"] option:selected').text();
        req.referencia = $txtSennas.val();

        req.estado_cli = Number.parseInt($cbEstado.val());
        req.latitud = mLatitud;
        req.longitud = mLongitud;


        await fetch_postRequest(req,
            function (data) {


                $('#spinner').hide();


                //console.log(data)

                if (mNuevo) {
                    $txtCodCliente.val(data.resp.cod_cliente);

                }

                //limpiaCampos();
                $txtCodCliente.focus();

                let msg = data.resp.msg;

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                })



            });
    }

    function nuevoCliente() {

        limpiaCampos();
        activaCampos();
        $txtCodCliente.val('');
        $txtNomCliente.focus();
    }


    function limpiaCampos() {


        $txtNomCliente.val('');
        $txtNomContacto.val('');
        $txtTelContacto.val('');
        $txtEmail.val('');
        $txtFecApe.val(obtieneFechaActual());
        $cbEstado.val(1);
        $txtSennas.val('');
        $cbTipoNeg.val('0');
        $cbProvincias.val('0');
        $cbCantones.val('0');
        $cbDistritos.val('0');
        $txtCodDistri.val('');
        $txtNomDistri.val('');

    }

    function inactivaCampos() {


        $txtNomCliente.prop('disabled', true);

        $txtNomContacto.prop('disabled', true);
        $txtTelContacto.prop('disabled', true);
        $txtEmail.prop('disabled', true);
        $txtFecApe.prop('disabled', true);
        $cbEstado.prop('disabled', true);
        $txtSennas.prop('disabled', true);
        $cbTipoNeg.prop('disabled', true);
        $cbProvincias.prop('disabled', true);
        $cbCantones.prop('disabled', true);
        $cbDistritos.prop('disabled', true);
        $btnActualizar.prop('disabled', true);
        $btnBuscaCli.prop('disabled', true);
        $txtCodCliente.prop('disabled', true);
    }

    function activaCampos() {

        $txtNomCliente.prop('disabled', false);

        $txtNomContacto.prop('disabled', false);
        $txtTelContacto.prop('disabled', false);
        $cbEstado.prop('disabled', sessionStorage.getItem('TIPO_USUARIO') < '2' ? true : false);
        $txtFecApe.prop('disabled', sessionStorage.getItem('TIPO_USUARIO') < '2' ? true : false);
        $txtEmail.prop('disabled', false);
        $txtSennas.prop('disabled', false);
        $cbTipoNeg.prop('disabled', false);
        $txtCodCliente.prop('disabled', false);
        $cbProvincias.prop('disabled', false);
        $cbCantones.prop('disabled', false);
        $cbDistritos.prop('disabled', false);
        $btnActualizar.prop('disabled', false);
        $btnBuscaCli.prop('disabled', false);

    }




    async function llenaComboProvincias() {

        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'llena_provincias';

        $('#cbProvincias').empty();
        $('#spinnerProv').show();


        await fetch_postRequest(req,
            function (data) {
                $('#spinnerProv').hide();

                if (data.resp != null) {
                    let provincias = data.resp.provincias;

                    for (item in provincias) {

                        let _codProv = provincias[item]['idProvincia'];
                        let _nomProv = provincias[item]['nomProvincia'];

                        $('#cbProvincias').append($("<option>", {
                            value: _codProv,
                            text: _nomProv
                        }));
                    }

                }

            });

    }



    async function llenaComboCantones() {

        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'llena_cantones';
        req.idProvincia = $cbProvincias.val();

        $('#cbCantones').empty();
        $('#spinnerCant').show();


        await fetch_postRequest(req,
            function (data) {
                $('#spinnerCant').hide();


                if (data.resp != null) {
                    let cantones = data.resp.cantones;

                    for (item in cantones) {

                        let _codCanton = cantones[item]['idCanton'];
                        let _nomCanton = cantones[item]['nomCanton'];

                        $('#cbCantones').append($("<option>", {
                            value: _codCanton,
                            text: _nomCanton
                        }));
                    }

                }

            });

    }

    async function llenaComboDistritos() {

        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'llena_distritos';
        req.idProvincia = $cbProvincias.val();
        req.idCanton = $cbCantones.val();

        $('#cbDistritos').empty();
        $('#spinnerDist').show();


        await fetch_postRequest(req,
            function (data) {
                $('#spinnerDist').hide();


                if (data.resp != null) {
                    let distritos = data.resp.distritos;

                    for (item in distritos) {

                        let _codDistrito = distritos[item]['idDistrito'];
                        let _nomDistrito = distritos[item]['nomDistrito'];

                        $('#cbDistritos').append($("<option>", {
                            value: _codDistrito,
                            text: _nomDistrito
                        }));
                    }

                }

            });

    }


    async function llenaComboTipoNegocios() {

        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'lista_categorias_pdv';


        $('#cbCatPdv').empty();


        await fetch_postRequest(req,
            function (data) {


                if (data.resp != null) {
                    let categorias = data.resp.categorias;

                    for (item in categorias) {

                        let _codCat = categorias[item]['cat_pdv'];
                        let _nomCat = categorias[item]['nom_cat_pdv'];

                        $('#cbCatPdv').append($("<option>", {
                            value: _codCat,
                            text: _nomCat
                        }));
                    }

                }

            });

    }

    async function llenaTablaClientes() {



        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'lista_clientes_pdv';

        listaClientes = new Array();

        $tblClientes.clear().draw();
        $('#spinnerModCli').show();



        await fetch_postRequest(req,
            function (data) {
                $('#spinnerModCli').hide();

                if (data.resp.clientes != null) {

                    let clientes = data.resp.clientes;

                    for (let i = 0; i < clientes.length; i++) {
                        let cliente = new Object();
                        cliente.cod_cliente = clientes[i].cod_cliente;
                        cliente.nom_cliente = clientes[i].nom_cliente;

                        listaClientes.push(cliente);
                    }


                    $tblClientes.rows.add(listaClientes).draw();

                }


            });
    }






});
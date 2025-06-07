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
    const $cbFiltro = $('#cbFiltro')
        .val(1)
        .change(function (e) {
            llenaTablaClientes();

        });

    const $txtLatitud = $('#txtLatitud');
    const $txtLongitud = $('#txtLongitud');

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

    const $btnUbicacion = $('#btnUbicacion');

    const $btnCerrarModCli = $('#btnCerrarModCli');


    function ini_componentes() {

        $tblClientes = $('#tblClientes').DataTable({

            destroy: true,
            data: listaClientes,
            columns: [
                {
                    data: 'cod_cliente',
                    visible: false

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

            let fila = $tblClientes.row($(this).parents('tr')).data();

            $('#modBuscaCli').modal('hide');

            $txtCodCliente.val(fila.cod_cliente);

            consultaCliente();

        });

        $tblDistri = $('#tblDistri').DataTable({

            destroy: true,
            data: listaDistri,
            columns: [
                {
                    data: 'cod_dis',
                    visible: false

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



        $tblDistri.on('click', 'button.editar', function () {

            let fila = $tblDistri.row($(this).parents('tr')).data();

            //$('#txtNomComercial').focus();

            $('#modBuscaDis').modal('hide');

            $txtCodDistri.val(fila.cod_dis);
            $txtNomDistri.val(fila.nom_dis);

            $txtCodCliente.prop('disabled', false);
            $btnBuscaCli.prop('disabled', false);
            $btnNuevoCliente.prop('disabled', false);

            $txtCodCliente.focus();

        });

        $txtCodDistri
            .focus(function () {
                $(this).select();
                limpiaCampos();
                inactivaCampos();

                $txtCodDistri.val('');
                $txtNomDistri.val('');

                $btnBuscaCli.prop('disabled', true);
                $btnNuevoCliente.prop('disabled', true);
                $txtCodCliente.prop('disabled', true);



            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {
                    e.preventDefault();

                    if ($txtCodDistri.val().length > 0) {

                        consultaDistribuidor();
                    }


                }
            });






        $txtCodCliente
            .focus(function () {
                $(this).select();
                limpiaCampos();
                inactivaCampos();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    e.preventDefault();

                    if ($txtCodCliente.val().length > 0) {

                        consultaCliente();
                    } else {
                        nuevoCliente();
                    }

                }
            });


        $txtNomCliente
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    let x = $(this).val();
                    $(this).val(x.toUpperCase());


                    $cbTipoNeg.focus();
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

        $txtLatitud
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    let x = Number.parseFloat($(this).val());
                    $(this).val(nf_dec6.format(x));

                    $txtLongitud.focus();


                    e.preventDefault();
                }
            });

        $txtLongitud
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    let x = Number.parseFloat($(this).val());
                    $(this).val(nf_dec6.format(x));

                    $btnActualizar.focus();
                    e.preventDefault();
                }
            });



        $txtSennas
            .focus(function () {
                $(this).select();

            });

        $btnBuscaCli.click(function (e) {

            llenaTablaClientes();

            e.preventDefault();

        });

        $btnBuscaDis.click(function (e) {

            //$('#modBuscaDis').modal('show');

            llenaTablaDistribuidores();

            e.preventDefault();

        });


        $btnUbicacion.click(function (e) {



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
        req.w = 'apiSicocir';
        req.r = 'consulta_cliente';
        req.cod_cliente = Number.parseInt($txtCodCliente.val());
        req.cod_distri = Number.parseInt($txtCodDistri.val());


        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                let element = data.resp;

                if (element.estadoRes == 'error') {

                    $txtCodCliente.focus();
                    Swal.fire({ title: element.msg, icon: "error" });
                    return;
                }


                $txtNomCliente.val(element.datos.nom_cliente);
                $txtEmail.val(element.datos.email);
                $txtNomContacto.val(element.datos.nom_contacto);
                $txtTelContacto.val(element.datos.tel_contacto);

                $cbTipoNeg.val(element.datos.tipo_negocio);

                let fecha = new Date(element.datos.fec_reg);
                let dia = fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate();
                let mes = (fecha.getMonth() + 1) > 9 ? fecha.getMonth() + 1 : '0' + (fecha.getMonth() + 1);
                let anio = fecha.getFullYear();
                var fecApertura = anio + "-" + mes + "-" + dia;

                $txtFecApe.val(fecApertura);
                $cbEstado.val(element.datos.estado_cli);
                $txtSennas.val(element.datos.otras_sennas);

                let _idProvincia = Number.parseInt(element.datos.idProvincia);
                let _idCanton = Number.parseInt(element.datos.idCanton);
                let _idDistrito = Number.parseInt(element.datos.idDistrito);

                mLatitud = Number.parseFloat(element.datos.latitud);
                mLongitud = Number.parseFloat(element.datos.longitud);

                $cbProvincias.val(_idProvincia);

                llenaComboCantones().then(() => {
                    $cbCantones.val(_idCanton);
                    llenaComboDistritos().then(() => {
                        $cbDistritos.val(_idDistrito);
                    })

                });

                mNuevo = false;

                activaCampos();

                $txtNomCliente.focus();





            });
    }


    /***************************************************************
     *  Consulta distribuidor
     ***************************************************************/

    async function consultaDistribuidor() {

        $('#spinner').show();


        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'consulta_distribuidor';
        req.cod_usuario = Number.parseInt($txtCodDistri.val());


        await fetch_postRequest(req,
            function (data) {

                //console.log(data)

                $('#spinner').hide();

                let element = data.resp;

                if (element.estadoRes == 'error') {
                    $txtCodDistri.focus();
                    Swal.fire({ title: element.msg, icon: "error" });
                    return;
                }

                $txtNomDistri.val(element.datos.nom_usuario);

                $txtCodCliente.prop('disabled', false);
                $btnBuscaCli.prop('disabled', false);
                $btnNuevoCliente.prop('disabled', false);

                $txtCodCliente.focus();

            });
    }


    async function actualizaCliente() {

        // Validacion de campos

        if ($txtNomCliente.val().length < 4) {
            $txtNomCliente.focus();
            Swal.fire({ title: "Nombre del cliente debe tener minimo 4 caracteres", icon: "warning" });
            return;
        }

        if ($txtEmail.val().length > 0 && !validarEmail($txtEmail.val())) {
            $txtEmail.focus();
            Swal.fire({ title: "Debe digitar un Email válido ", icon: "warning" });
            return;

        }

        if ($cbProvincias.val() == 0) {

            $cbProvincias.focus();
            Swal.fire({ title: "Debe seleccionar una provincia", icon: "warning" });
            return;
        }
        if ($cbCantones.val() == 0) {
            $cbCantones.focus();
            Swal.fire({ title: "Debe seleccionar un cantón", icon: "warning" });
            return;
        }
        if ($cbDistritos.val() == 0) {
            $cbDistritos.focus();
            Swal.fire({ title: "Debe seleccionar un distrito", icon: "warning" });
            return;
        }

        if ($cbTipoNeg.val() == 0) {
            $cbTipoNeg.focus();
            Swal.fire({ title: "Debe seleccionar un tipo de negocio", icon: "warning" });
            return;
        }

        let x = $txtNomCliente.val();
        $txtNomCliente.val(x.toUpperCase());

        $('#spinner').show();

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'actualiza_cliente';
        req.nuevo = mNuevo;
        req.cod_cliente = $txtCodCliente.val() > 0 ? Number.parseInt($txtCodCliente.val()) : 0;
        req.nom_cliente = $txtNomCliente.val();
        req.tipo_negocio = Number.parseInt($cbTipoNeg.val());
        req.email = $txtEmail.val();
        req.tel_contacto = $txtTelContacto.val();
        req.nom_contacto = $txtNomContacto.val();
        req.idProvincia = Number.parseInt($cbProvincias.val());
        req.provincia = $('select[id="cbProvincias"] option:selected').text();
        req.idCanton = Number.parseInt($cbCantones.val());
        req.canton = $('select[id="cbCantones"] option:selected').text();
        req.idDistrito = Number.parseInt($cbDistritos.val());
        req.distrito = $('select[id="cbDistritos"] option:selected').text();
        req.otras_sennas = $txtSennas.val();
        req.cod_distri = Number.parseInt($txtCodDistri.val());
        req.latitud = Number.parseFloat($txtLatitud.val());
        req.longitud = Number.parseFloat($txtLongitud.val());
        req.est_cliente = Number.parseInt($cbEstado.val());
        req.id_usu_reg = sessionStorage.getItem('ID_USUARIO');


        await fetch_postRequest(req,
            function (data) {


                $('#spinner').hide();

                if (mNuevo) {
                    $txtCodCliente.val(data.resp.cod_cliente);
                }

                $txtCodCliente.val('');
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
        $txtLatitud.val(nf_dec6.format(0));
        $txtLongitud.val(nf_dec6.format(0));

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
        //$btnBuscaCli.prop('disabled', true);
        //$btnNuevoCliente.prop('disabled', true);
        //$txtCodCliente.prop('disabled', true);
        $txtLatitud.prop('disabled', true);
        $txtLongitud.prop('disabled', true);
        $btnUbicacion.prop('disabled', true);

    }

    function activaCampos() {

        $txtNomCliente.prop('disabled', false);
        $txtNomContacto.prop('disabled', false);
        $txtTelContacto.prop('disabled', false);
        $cbEstado.prop('disabled', mNuevo);
        $txtFecApe.prop('disabled', mNuevo == false);
        $txtEmail.prop('disabled', false);
        $txtSennas.prop('disabled', false);
        $cbTipoNeg.prop('disabled', false);
        $txtCodCliente.prop('disabled', false);
        $cbProvincias.prop('disabled', false);
        $cbCantones.prop('disabled', false);
        $cbDistritos.prop('disabled', false);
        $btnActualizar.prop('disabled', false);
        $txtLatitud.prop('disabled', false);
        $txtLongitud.prop('disabled', false);
        $btnUbicacion.prop('disabled', false);

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
        req.w = 'apiSicocir';
        req.r = 'lista_tipo_neg';
        req.filtro = 1;


        //$('#cbCatPdv').empty();
        $cbTipoNeg.empty();

        $cbTipoNeg.append($("<option>", {
            value: '0',
            text: 'Seleccione una categoría'
        }));


        await fetch_postRequest(req,
            function (data) {

                let categorias = data.resp;

                for (item in categorias) {

                    let _codCat = categorias[item]['cod_tipo_neg'];
                    let _nomCat = categorias[item]['nom_tipo_neg'];

                    $cbTipoNeg.append($("<option>", {
                        value: _codCat,
                        text: _nomCat
                    }));
                }


            });

    }

    async function llenaTablaDistribuidores() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_distribuidores';
        req.filtro = 1;

        listaDistri = new Array();

        $tblDistri.clear().draw();

        $('#spinnerDis').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinnerDis').hide();

                let listaUsuarios = data.resp;

                for (let i = 0; i < listaUsuarios.length; i++) {

                    const element = listaUsuarios[i];

                    let itemTabla = new Object();

                    itemTabla.cod_dis = element.cod_usuario;
                    itemTabla.nom_dis = element.nom_usuario;

                    listaDistri.push(itemTabla);
                }

                $tblDistri.rows.add(listaDistri).draw();
            });
    }

    async function llenaTablaClientes() {



        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'llena_tabla_clientes';
        req.cod_distri = Number.parseInt($txtCodDistri.val());
        req.filtro = Number.parseInt($cbFiltro.val());

        listaClientes = new Array();

        $tblClientes.clear().draw();

        $('#spinnerModCli').show();



        await fetch_postRequest(req,
            function (data) {
                $('#spinnerModCli').hide();


                let clientes = data.resp;

                for (let i = 0; i < clientes.length; i++) {
                    let cliente = new Object();
                    cliente.cod_cliente = clientes[i].cod_cliente;
                    cliente.nom_cliente = clientes[i].nom_cliente;

                    listaClientes.push(cliente);
                }


                $tblClientes.rows.add(listaClientes).draw();




            });
    }


    ini_componentes();

    limpiaCampos();
    inactivaCampos();
    llenaComboProvincias();
    llenaComboTipoNegocios();

    if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $btnBuscaDis.prop('disabled', true);
        $txtCodDistri.prop('disabled', true);


        $btnBuscaCli.prop('disabled', false);
        $btnNuevoCliente.prop('disabled', false);
        $txtCodCliente.prop('disabled', false);

        $txtCodCliente.focus();
    } else {
        $txtCodDistri.val('');
        $txtNomDistri.val('');

        $btnBuscaCli.prop('disabled', true);
        $btnNuevoCliente.prop('disabled', true);
        $txtCodCliente.prop('disabled', true);


    }



});
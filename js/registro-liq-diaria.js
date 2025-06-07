$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_liq_pdvs = [];
    var listaTablaLiq = [];

    var lista_distribuidores = [];
    var listaClientes = [];


    const $txtCodDistri = $('#txtCodDistri')
        .focus(function () {
            $(this).select();
            limpiaCampos();
            inactivaCampos();

            $txtCodDistri.val('');
            $txtNomDistri.val('');

            //$btnBuscaCli.prop('disabled', true);
            //$txtCodCliente.prop('disabled', true);

        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {
                e.preventDefault();

                if ($txtCodDistri.val().length > 0) {

                    consultaDistribuidor();
                }
            }
        });

    const $txtNomDistri = $('#txtNomDistri')
        .val('');

    const $txtCodCliente = $('#txtCodPdv')
        .focus(function () {
            $(this).select();
            limpiaCampos();
            $txtFechaIni.prop('disabled', true);
            $txtFechaFin.prop('disabled', true);
            $btnConsultar.prop('disabled', true);

        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                e.preventDefault();

                if ($txtCodCliente.val().length > 0) {

                    consultaCliente();
                }

            }
        });


    const $txtNomCliente = $('#txtNomPdv');

    const $txtCanEnt = $('#txtCanEnt')
        .val('0');

    const $txtFechaIni = $('#txtFechaIni')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtFechaFin = $('#txtFechaFin')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtTotalEnt = $('#txtTotalEnt');
    const $txtTotalDev = $('#txtTotalDev');
    const $txtTotalVta = $('#txtTotalVta');

    const $txtFechaLiq = $('#txtFechaLiq');
    const $txtCanDev = $('#txtCanDev')
        .val('0')
        .focus(function () {
            $(this).select();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                if ($(this).val().length > 0) {

                    let x = Number.parseInt($(this).val().replace(/,/g, ''));
                    $(this).val(nf_entero.format(x));
                    $btnActLiqDia.focus();

                }


                e.preventDefault();
            }
        });

    const $btnConsultar = $('#btnConsultar')
        .click(function (e) {

            llenaTablaLiqDiaria();

            e.preventDefault();

        });




    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {
            llenaTablaDistribuidores();
            e.preventDefault();

        });

    const $btnBuscaCli = $('#btnBuscaPdv')
        .click(function (e) {
            e.preventDefault();
            llenaTablaClientes();
        });



    const $btnActLiqDia = $('#btnActLiqDia')
        .click(function (e) {


            e.preventDefault();
        });


    var $tblLiqPdvs = $('#tblLiqPdvs').DataTable({
        //destroy: true,
        responsive: true,
        data: listaTablaLiq,
        columns: [
            {
                data: 'fec_liq'

            },
            {
                data: 'can_ent',
                className: 'text-end',
                render: DataTable.render.number(',', '.'),
                searchable: false

            },
            {
                data: 'can_dev',
                className: 'text-end',
                render: DataTable.render.number(',', '.'),
                searchable: false

            },
            {
                data: 'can_vta',
                className: 'text-end',
                render: DataTable.render.number(',', '.'),
                searchable: false

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


    $tblLiqPdvs.on('click', 'button.editar', function () {

        let fila = $tblLiqPdvs.row($(this).parents('tr')).data();



    });


    var $tblDistri = $('#tblDistri').DataTable({

        responsive: true,
        data: lista_distribuidores,
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

        $txtCodDistri.val(fila.cod_dis);
        $txtNomDistri.val(fila.nom_dis);

        $('#modBuscaDis').modal('hide');

        $txtCodCliente.prop('disabled', false);
        $btnBuscaCli.prop('disabled', false);
        $txtCodCliente.focus();


    });


    var $tblClientes = $('#tblPdvs').DataTable({

        responsive: true,
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


    $tblClientes.on('click', 'button.editar', function () {

        let fila = $tblClientes.row($(this).parents('tr')).data();



        $('#modBuscaPdv').modal('hide');

        $txtCodCliente.val(fila.cod_cliente);
        $txtNomCliente.val(fila.nom_cliente);
        $txtFechaIni.prop('disabled', false);
        $txtFechaFin.prop('disabled', false);
        $btnConsultar.prop('disabled', false);
        $btnConsultar.focus();


    });



    function inactivaCampos() {


        $txtCodCliente.prop('disabled', true);
        $btnBuscaCli.prop('disabled', true);
        $btnConsultar.prop('disabled', true);
        $txtFechaFin.prop('disabled', true);
        $txtFechaIni.prop('disabled', true);



    }

    function activaCampos() {



    }

    function limpiaCampos() {

        $txtCodCliente.val('');
        $txtNomCliente.val('');
        $txtFechaIni.val(obtieneFechaActual());
        $txtFechaFin.val(obtieneFechaActual());
        $tblLiqPdvs.clear().draw();
        lista_liq_pdvs = [];
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

                $txtCodCliente.focus();

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
        req.filtro = 1;

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
                $txtFechaIni.prop('disabled', false);
                $txtFechaFin.prop('disabled', false);
                $btnConsultar.prop('disabled', false);
                $btnConsultar.focus();



            });
    }

    async function llenaTablaLiqDiaria() {

        let fechaIni = $txtFechaIni.val();
        let fechaFin = $txtFechaFin.val();


        if (fechaIni > fechaFin) {
            $txtFechaFin.focus();
            Swal.fire({ title: "Fecha Inicial NO puede ser mayor que la Fecha Final", icon: "warning" });
            return;
        }



        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_liq_diaria_pdv';
        req.cod_cliente = Number.parseInt($txtCodCliente.val());
        req.fecha_ini = $txtFechaIni.val();
        req.fecha_fin = $txtFechaFin.val();
        req.cod_item = 1;


        listaTablaLiq = new Array();
        $tblLiqPdvs.clear().draw();

        $('#spinnerModCli').show();

        await fetch_postRequest(req,
            function (data) {
                $('#spinnerModCli').hide();

                lista_liq_pdvs = data.resp;

                let totEnt = 0;
                let totDev = 0;
                let totVta = 0;

                for (let i = 0; i < lista_liq_pdvs.length; i++) {

                    let element = lista_liq_pdvs[i];
                    console.log(element)

                    let a_fecha = element.fec_entrega.split('-');
                    let canEnt = Number.parseInt(element.can_entrega);
                    let canDev = Number.parseInt(element.can_dev);
                    let canVta = canEnt - canDev;

                    totEnt += canEnt;
                    totDev += canDev;
                    totVta += canVta;

                    let fechaLiq = new Object();
                    fechaLiq.fec_ent = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                    fechaLiq.can_ent = canEnt;
                    fechaLiq.can_dev = canDev;
                    fechaLiq.can_vta = canVta;

                    lista_liq_pdvs.push(fechaLiq);
                }

                $tblLiqPdvs.rows.add(lista_liq_pdvs).draw();
                $txtTotalEnt.val(nf_entero.format(totEnt));
                $txtTotalDev.val(nf_entero.format(totDev));
                $txtTotalVta.val(nf_entero.format(totVta));

            });
    }






    inactivaCampos();


    if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $btnBuscaDis.prop('disabled', true);
        $txtCodDistri.prop('disabled', true);

        $txtFechaEnt.prop('disabled', false);
        $btnConsultar.prop('disabled', false);
        $btnConsultar.focus();

    }




});
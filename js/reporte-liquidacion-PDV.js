$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_liq_pdvs = [];


    var lista_distribuidores = [];


    const $txtCodDistri = $('#txtCodDistri')
        .focus(function () {
            $(this).select();
            limpiaCampos();
            inactivaCampos();

            $txtCodDistri.val('');
            $txtNomDistri.val('');


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



    const $btnConsultar = $('#btnConsultar')
        .click(function (e) {

            consultaLiquidacion();

            e.preventDefault();

        });

    const $btnimprimir = $('#btnImprimir')
        .click(function (e) {

            imprimeReporte();

            e.preventDefault();

        });



    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {
            llenaTablaDistribuidores();
            e.preventDefault();

        });




    var $tblLiquidacion = $('#tblLiquidacion').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_liq_pdvs,
        columns: [
            {
                data: 'nom_pdv'

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
                searchable: false,
                responsivePriority: 1

            }
        ],
        info: false,
        ordering: false,
        language: lenguaje_data_table
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

    });







    function limpiaCampos() {

        $txtFechaIni.val(obtieneFechaActual());
        $txtFechaFin.val(obtieneFechaActual());
        $txtTotalEnt.val('0');
        $txtTotalDev.val('0');
        $txtTotalVta.val('0');
        $tblLiquidacion.clear().draw();
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
        req.cod_ejecutivo = Number.parseInt(sessionStorage.getItem('COD_USUARIO'));
        req.tipo_usu = Number.parseInt(sessionStorage.getItem('TIPO_USUARIO'));



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
                $btnConsultar.focus();

            });
    }


    async function llenaTablaDistribuidores() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_distribuidores';
        req.filtro = 1;
        req.cod_ejecutivo = Number.parseInt(sessionStorage.getItem('COD_USUARIO'));
        req.tipo_usu = Number.parseInt(sessionStorage.getItem('TIPO_USUARIO'));


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




    async function consultaLiquidacion() {

        let fechaIni = $txtFechaIni.val();
        let fechaFin = $txtFechaFin.val();


        if (fechaIni > fechaFin) {
            $txtFechaFin.focus();
            Swal.fire({ title: "Fecha Inicial NO puede ser mayor que la Fecha Final", icon: "warning" });
            return;
        }



        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'resumen_liquidacion_pdv';
        req.cod_dis = Number.parseInt($txtCodDistri.val());
        req.fec_ini = $txtFechaIni.val();
        req.fec_fin = $txtFechaFin.val();
        req.cod_item = 1;


        lista_liq_pdvs = new Array();
        $tblLiquidacion.clear().draw();

        $('#spinnerTabla').show();

        await fetch_postRequest(req,
            function (data) {
                $('#spinnerTabla').hide();

                let lista = data.resp;

                let totEnt = 0;
                let totDev = 0;
                let totVta = 0;

                for (let i = 0; i < lista.length; i++) {

                    let element = lista[i];

                    let canEnt = Number.parseInt(element.can_entrega);
                    let canDev = Number.parseInt(element.can_dev);
                    let canVta = canEnt - canDev;

                    totEnt += canEnt;
                    totDev += canDev;
                    totVta += canVta;

                    let itemTabla = new Object();
                    itemTabla.nom_pdv = element.nom_cliente;
                    itemTabla.can_ent = canEnt;
                    itemTabla.can_dev = canDev;
                    itemTabla.can_vta = canVta;

                    lista_liq_pdvs.push(itemTabla);
                }

                $tblLiquidacion.rows.add(lista_liq_pdvs).draw();
                $txtTotalEnt.val(nf_entero.format(totEnt));
                $txtTotalDev.val(nf_entero.format(totDev));
                $txtTotalVta.val(nf_entero.format(totVta));

            });
    }

    function imprimeReporte() {

        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/Windows Phone/i)) {

            Swal.fire({ title: "Proceso de impresión no esta disponible en dispositivos móviles", type: "error" });

            return;
        }



        if (lista_liq_pdvs.length > 0) {
            console.log('Imprimiendo reporte');

            let datos = new Object();

            let a_fecIni = $txtFechaIni.val().split('-');
            let a_fecFin = $txtFechaFin.val().split('-');

            datos.fecIni = a_fecIni[2] + '/' + a_fecIni[1] + '/' + a_fecIni[0];
            datos.fecFin = a_fecFin[2] + '/' + a_fecFin[1] + '/' + a_fecFin[0];
            datos.totEnt = $txtTotalEnt.val();
            datos.totDev = $txtTotalDev.val();
            datos.totVta = $txtTotalVta.val();
            datos.nom_dis = $txtNomDistri.val();

            datos.listaMov = lista_liq_pdvs;

            new Liquidacion_PDV(datos);

        }
    }


    if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $btnBuscaDis.prop('disabled', true);
        $txtCodDistri.prop('disabled', true);

    }




});
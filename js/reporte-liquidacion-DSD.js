$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();


    var lista_liq_dis = [];

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

            resumenLiquidacionDSD();

            e.preventDefault();

        });

    const $btnImprimir = $('#btnImprimir')
        .click(function (e) {

            imprimeReporte()
            e.preventDefault();

        });





    var $tblLiquidacion = $('#tblLiquidacion').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_liq_dis,
        columns: [

            {
                data: 'nom_dis'

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







    async function resumenLiquidacionDSD() {

        let fechaIni = $txtFechaIni.val();
        let fechaFin = $txtFechaFin.val();


        if (fechaIni > fechaFin) {
            $txtFechaFin.focus();
            Swal.fire({ title: "Fecha Inicial NO puede ser mayor que la Fecha Final", icon: "warning" });
            return;
        }



        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'resumen_liquidacion_dsd';
        req.fec_ini = $txtFechaIni.val();
        req.fec_fin = $txtFechaFin.val();
        req.cod_item = 1;


        lista_liq_dis = new Array();
        $tblLiquidacion.clear().draw();

        $('#spinnerModCli').show();

        await fetch_postRequest(req,
            function (data) {
                $('#spinnerModCli').hide();

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


                    let itemTabla = new Object()
                    itemTabla.nom_dis = element.nom_usuario;
                    itemTabla.can_ent = canEnt;
                    itemTabla.can_dev = canDev;
                    itemTabla.can_vta = canVta;

                    lista_liq_dis.push(itemTabla);
                }

                $tblLiquidacion.rows.add(lista_liq_dis).draw();
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



        if (lista_liq_dis.length > 0) {
            console.log('Imprimiendo reporte');

            let datos = new Object();

            let a_fecIni = $txtFechaIni.val().split('-');
            let a_fecFin = $txtFechaFin.val().split('-');

            datos.fecIni = a_fecIni[2] + '/' + a_fecIni[1] + '/' + a_fecIni[0];
            datos.fecFin = a_fecFin[2] + '/' + a_fecFin[1] + '/' + a_fecFin[0];
            datos.totEnt = $txtTotalEnt.val();
            datos.totDev = $txtTotalDev.val();
            datos.totVta = $txtTotalVta.val();

            datos.listaMov = lista_liq_dis;

            new Liquidacion_DSD(datos);

        }
    }



});
$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_entregas = [];


    const $txtFechaIni = $('#txtFechaIni')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtFechaFin = $('#txtFechaFin')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtTotalEnt = $('#txtTotalEnt');




    const $btnConsultar = $('#btnConsultar')
        .click(function (e) {

            consultaEntregaDSD();

            e.preventDefault();

        });


    var $tblEntregas = $('#tblEntregas').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_entregas,
        columns: [
            {
                data: 'cod_dis',
                visible: false
            },
            {
                data: 'nom_dis'

            },
            {
                data: 'can_ent',
                className: 'text-end',
                render: DataTable.render.number(',', '.'),
                searchable: false

            }

        ],
        info: false,
        ordering: false,
        language: lenguaje_data_table
    });








    /******************************************************************************************************************** */

    async function consultaEntregaDSD() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'resumen_entregas_dsd';

        req.cod_item = 1;
        req.fec_ini = $txtFechaIni.val();
        req.fec_fin = $txtFechaFin.val();

        lista_entregas = new Array();
        $tblEntregas.clear().draw();

        $('#spinnerEnt').show();


        await fetch_postRequest(req,
            function (data) {

                //console.log(data)

                $('#spinnerEnt').hide();

                let totalEnt = 0;

                let entregas = data.resp;

                for (let i = 0; i < entregas.length; i++) {

                    const element = entregas[i];

                    let itemTabla = new Object();

                    itemTabla.cod_dis = element.cod_usuario;
                    itemTabla.nom_dis = element.nom_usuario;
                    itemTabla.can_ent = element.can_entrega

                    totalEnt += Number.parseInt(element.can_entrega);

                    lista_entregas.push(itemTabla);
                }

                $tblEntregas.rows.add(lista_entregas).draw();

                $txtTotalEnt.val(nf_entero.format(totalEnt));

            });
    }



});
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

    async function consultaEntregaDis() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_entrega_diaria_pdvs';
        req.cod_distri = Number.parseInt($txtCodDistri.val());
        req.cod_item = 1;
        req.fec_entrega = $txtFechaEnt.val();

        lista_entrega_pdvs = new Array();
        $tblEntregaPdvs.clear().draw();

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

                    itemTabla.cod_pdv = element.cod_cliente;
                    itemTabla.nom_pdv = element.nom_cliente;
                    itemTabla.can_ent = element.can_entrega

                    totalEnt += Number.parseInt(element.can_entrega);

                    lista_entrega_pdvs.push(itemTabla);
                }

                $tblEntregaPdvs.rows.add(lista_entrega_pdvs).draw();

                $txtTotalEnt.val(nf_entero.format(totalEnt));

            });
    }



});
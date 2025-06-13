$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_entregas = [];
    var lista_distribuidores = [];


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



    const $txtFechaIni = $('#txtFechaIni')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtFechaFin = $('#txtFechaFin')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtTotalEnt = $('#txtTotalEnt');

    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {

            llenaTablaDistribuidores();

        });




    const $btnConsultar = $('#btnConsultar')
        .click(function (e) {

            consultaEntregasPDV();

            e.preventDefault();

        });


    var $tblEntregas = $('#tblEntregas').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_entregas,
        columns: [
            {
                data: 'cod_pdv',
                visible: false
            },
            {
                data: 'nom_pdv'

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

    /******************************************************************************************
     * 
     */

    function inactivaCampos() {



    }


    function limpiaCampos() {



        $tblEntregas.clear().draw();
        lista_entregas = [];

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

                $btnConsultar.focus();

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





    /******************************************************************************************************************** */

    async function consultaEntregasPDV() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'resumen_entregas_pdv';
        req.cod_distri = Number.parseInt($txtCodDistri.val());
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

                    itemTabla.cod_pdv = element.cod_cliente;
                    itemTabla.nom_pdv = element.nom_cliente;
                    itemTabla.can_ent = element.can_entrega

                    totalEnt += Number.parseInt(element.can_entrega);

                    lista_entregas.push(itemTabla);
                }

                $tblEntregas.rows.add(lista_entregas).draw();

                $txtTotalEnt.val(nf_entero.format(totalEnt));

            });
    }





    if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $btnBuscaDis.prop('disabled', true);
        $txtCodDistri.prop('disabled', true);
        $btnConsultar.focus();

    }




});
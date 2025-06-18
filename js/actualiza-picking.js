$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_fechas_pick = [];
    var listaDistri = [];
    var listaPicking = [];

    const $txtCodDis = $('#txtCodDistri')

        .focus(function () {
            $(this).select();
            limpiaCampos();
            inactivaCampos();

            $txtCodDis.val('');
            $txtNomDis.val('');




        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {
                e.preventDefault();

                if ($txtCodDis.val().length > 0) {

                    consultaDistribuidor();
                }


            }
        });




    const $txtNomDis = $('#txtNomDistri')
        .val('');




    const $txtCanPick = $('#txtCanPick')
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
                    $btnActPicking.focus();
                }
                e.preventDefault();
            }
        });

    const $txtTotalPick = $('#txtTotalPick')
        .val('0');




    const $txtFechaIni = $('#txtFechaIni')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtFechaFin = $('#txtFechaFin')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtFechaPic = $('#txtFechaPick');


    const $btnConsultar = $('#btnConsultar')
        .click(function (e) {

            llenaTablaPicking();

            e.preventDefault();



        });







    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {


            llenaTablaDistribuidores();

            e.preventDefault();



        });


    const $btnActPicking = $('#btnActPick')
        .click(function (e) {


            actualizaPicking().then(() => {
                llenaTablaPicking();
            });

            e.preventDefault();

        });







    var $tblPicking = $('#tblPicking').DataTable({
        //destroy: true,
        responsive: true,
        data: listaPicking,
        columns: [
            {
                data: 'fec_pick',
                className: 'text-center',

            },
            {
                data: 'can_pick',
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


    $tblPicking.on('click', 'button.editar', function () {

        let fila = $tblPicking.row($(this).parents('tr')).index();

        $('#modActPick').modal('show');


        $txtFechaPic.val(lista_fechas_pick[fila].fec_pick);
        $txtCanPick.val(lista_fechas_pick[fila].can_pick).focus();

    });






    var $tblDistri = $('#tblDistri').DataTable({

        responsive: true,
        data: listaDistri,
        columns: [
            {
                data: 'cod_distri',
                visible: false

            },
            {
                data: 'nom_distri'
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

        $txtCodDis.val(fila.cod_distri);

        $('#modBuscaDis').modal('hide');

        consultaDistribuidor();


    });


    function inactivaCampos() {

        $txtFechaIni.prop('disabled', true);
        $txtFechaFin.prop('disabled', true);
        $btnConsultar.prop('disabled', true);

    }

    function activaCampos() {
        $txtFechaIni.prop('disabled', false);
        $txtFechaFin.prop('disabled', false);
        $btnConsultar.prop('disabled', false);


    }

    function limpiaCampos() {

        $txtFechaIni.val(obtieneFechaActual());
        $txtFechaFin.val(obtieneFechaActual());


        $tblPicking.clear().draw();
        lista_picking = [];

    }

    /********************************************************************************** */

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

                    itemTabla.cod_distri = element.cod_usuario;
                    itemTabla.nom_distri = element.nom_usuario;

                    listaDistri.push(itemTabla);
                }

                $tblDistri.rows.add(listaDistri).draw();
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
        req.cod_usuario = Number.parseInt($txtCodDis.val());
        req.cod_ejecutivo = Number.parseInt(sessionStorage.getItem('COD_USUARIO'));
        req.tipo_usu = Number.parseInt(sessionStorage.getItem('TIPO_USUARIO'));



        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                let element = data.resp;

                if (element.estadoRes == 'error') {
                    $txtCodDis.focus();
                    Swal.fire({ title: element.msg, icon: "error" });
                    return;
                }

                $txtNomDis.val(element.datos.nom_usuario);

                activaCampos();

                $btnConsultar.focus()
            });
    }






    /******************************************************************************************************************** */

    async function llenaTablaPicking() {

        let fechaIni = $txtFechaIni.val();
        let fechaFin = $txtFechaFin.val();


        if (fechaIni > fechaFin) {
            $txtFechaFin.focus();
            Swal.fire({ title: "Fecha Inicial NO puede ser mayor que la Fecha Final", icon: "warning" });
            return;
        }


        let dias = (new Date(fechaFin).getTime() - new Date(fechaIni).getTime()) / (1000 * 60 * 60 * 24) + 1;

        listaPicking = [];
        lista_fechas_pick = [];

        $tblPicking.clear().draw();

        // crear el array de fechas
        for (let i = 0; i < dias; i++) {

            let fecha = new Date(new Date(fechaIni).getTime() + (i + 1) * 1000 * 60 * 60 * 24);

            let dia = fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate();
            let mes = (fecha.getMonth() + 1) > 9 ? fecha.getMonth() + 1 : '0' + (fecha.getMonth() + 1);
            let anio = fecha.getFullYear();

            let fechaLista = anio + "-" + mes + "-" + dia;

            let itemArray = new Object();
            itemArray.fec_pick = fechaLista;
            itemArray.can_pick = 0;

            lista_fechas_pick.push(itemArray);
        }



        // consulta fechas en base de datos      
        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'consulta_fechas_picking';
        req.cod_distri = Number.parseInt($txtCodDis.val());
        req.fecha_ini = $txtFechaIni.val();
        req.fecha_fin = $txtFechaFin.val();
        req.cod_item = 1;

        $('#spinnerPic').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinnerPic').hide();

                let fechas = data.resp;

                for (let i = 0; i < fechas.length; i++) {

                    for (let j = 0; j < lista_fechas_pick.length; j++) {

                        if (lista_fechas_pick[j].fec_pick == fechas[i].fec_picking) {

                            lista_fechas_pick[j].can_pick = fechas[i].can_picking;
                        }

                    }
                }

                let totalPicking = 0;

                // actualiza campos tabla
                listaPicking = [];
                $tblPicking.clear().draw();

                for (let i = 0; i < lista_fechas_pick.length; i++) {

                    let itemLista = lista_fechas_pick[i];

                    let itemTabla = new Object();

                    let a_fecha = itemLista.fec_pick.split('-');
                    let fechaTabla = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];

                    itemTabla.fec_pick = fechaTabla;
                    itemTabla.can_pick = itemLista.can_pick;

                    totalPicking += Number.parseInt(itemLista.can_pick)

                    listaPicking.push(itemTabla);
                }

                $tblPicking.rows.add(listaPicking).draw();

                $txtTotalPick.val(nf_entero.format(totalPicking));



            });



    }


    async function actualizaPicking() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'actualiza_picking_diario';

        req.cod_usuario = Number.parseInt($txtCodDis.val());
        req.fec_picking = $txtFechaPic.val();
        req.can_picking = Number.parseInt($txtCanPick.val());
        req.id_usu_reg = sessionStorage.getItem('ID_USUARIO');

        $('#spinnerActPic').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinnerActPic').hide();

                let response = data.resp;

                $('#modActPick').modal('hide');

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });


            });
    }


    inactivaCampos();


});
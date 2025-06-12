$(function () {

    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();


    /** Crea variables  */

    var listaDistri = new Array();

    var lista_precios_gen = new Array();
    var lista_precios_ind = new Array();



    const $txtCodDistri = $('#txtCodDistri');
    const $txtNomDistri = $('#txtNomDistri');
    const $btnBuscaDis = $('#btnBuscaDis');

    const $txtPreGen = $('#txtPreGen').val('0.00');
    const $txtPreInd = $('#txtPreInd').val('0.00');



    const $btnActPreGen = $('#btnActPreGen');
    const $btnActPreInd = $('#btnActPreInd');

    const $txtFecIniGen = $('#txtFecIniGen')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtFecIniInd = $('#txtFecIniInd')
        .val(obtieneFechaActual())
        .change(function () {

        });



    function ini_componentes() {



        var $tblDistri = $('#tblDistri').DataTable({

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
        });



        var $tblPreGen = $('#tblPreGen').DataTable({
            //destroy: true,
            responsive: true,
            data: lista_precios_gen,
            columns: [


                {
                    data: 'fec_ini'

                },
                {
                    data: 'pre_item',
                    className: 'text-end',
                    render: DataTable.render.number(',', '.'),
                    searchable: false

                },
                {
                    defaultContent: '<button class="editar btn btn-primary"><i class="bi bi-pen"></i></button> <button class="eliminar btn btn-danger"><i class="bi bi-x"></i></button>',
                    className: 'text-center'

                }

            ],
            info: false,
            ordering: false,
            language: lenguaje_data_table
        });


        $tblPreGen.on('click', 'button.editar', function () {

            let fila = $tblPreGen.row($(this).parents('tr')).data();


        });

        $tblPreGen.on('click', 'button.eliminar', function () {

            let fila = $tblPreGen.row($(this).parents('tr')).data();


            Swal
                .fire({
                    title: "Desea Eliminar el precio registrado?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar",
                })
                .then(resultado => {
                    if (resultado.value) {

                    }
                });

        });


        var $tblPreInd = $('#tblPreInd').DataTable({
            //destroy: true,
            responsive: true,
            data: lista_precios_ind,
            columns: [


                {
                    data: 'fec_ini'

                },
                {
                    data: 'pre_item',
                    className: 'text-end',
                    render: DataTable.render.number(',', '.'),
                    searchable: false

                },
                {
                    defaultContent: '<button class="editar btn btn-primary"><i class="bi bi-pen"></i></button> <button class="eliminar btn btn-danger"><i class="bi bi-x"></i></button>',
                    className: 'text-center'

                }

            ],
            info: false,
            ordering: false,
            language: lenguaje_data_table
        });


        $tblPreInd.on('click', 'button.editar', function () {

            let fila = $tblPreInd.row($(this).parents('tr')).data();


        });

        $tblPreInd.on('click', 'button.eliminar', function () {

            let fila = $tblPreInd.row($(this).parents('tr')).data();


            Swal
                .fire({
                    title: "Desea Eliminar el precio registrado?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar",
                })
                .then(resultado => {
                    if (resultado.value) {

                    }
                });

        });



        $txtCodDistri
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

        $btnBuscaDis.click(function (e) {

            //$('#modBuscaDis').modal('show');

            llenaTablaDistribuidores();

            e.preventDefault();

        });


        $txtPreGen
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    let x = Number.parseFloat($(this).val());
                    $(this).val(nf_decimal.format(x));

                    $btnActPreGen.focus();
                    e.preventDefault();
                }
            });

        $txtPreInd
            .focus(function () {
                $(this).select();

            }).keydown(function (e) {
                let code = e.keyCode || e.which;
                if (code == 13 || code == 9) {

                    let x = Number.parseFloat($(this).val());
                    $(this).val(nf_decimal.format(x));

                    $btnActPreInd.focus();
                    e.preventDefault();
                }
            });



        $btnActPreGen.click(function (e) {


            e.preventDefault();
        });


        $btnActPreInd.click(function (e) {


            e.preventDefault();
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

    ini_componentes();

});
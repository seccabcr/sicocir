$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_entrega_pdvs = [];
    var lista_distribuidores = [];
    var listaClientes = [];

    var codCliente = 0;



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



    const $txtFechaEnt = $('#txtFecEnt')
        .val(obtieneFechaActual())
        .change(function () {

        });



    /*const $txtCodCliente = $('#txtCodPdv')
        .focus(function () {
            $(this).select();

            $txtNomCliente.val('');
            $txtCanEnt.prop('disabled', true);
            $btnActEntrega.prop('disabled', true);


        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                e.preventDefault();

                if ($txtCodCliente.val().length > 0) {

                    consultaCliente();
                }

            }
        });*/



    const $txtNomCliente = $('#txtNomPdv');

    const $txtCanEnt = $('#txtCanEnt')
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

                    $btnActEntrega.focus();

                }
                e.preventDefault();
            }
        });

    const $txtTotalEnt = $('#txtTotalEnt').val('0');




    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {

            llenaTablaDistribuidores();

        });

    /* const $btnBuscaCli = $('#btnBuscaPdv')
         .click(function (e) {
 
 
             llenaTablaClientes();
         });*/



    const $btnActEntrega = $('#btnActEnt')
        .click(function (e) {

            actualizaEntregaPdv().then(()=>{
                llenaTablaEntregaPdvs();
            });
            e.preventDefault();

        });

    /*const $btnCancelar = $('#btnCancelar')
        .click(function (e) {



            e.preventDefault();

        });*/

    const $btnConsultar = $('#btnConsultar')
        .click(function (e) {

            llenaTablaEntregaPdvs();

            e.preventDefault();



        });








    var $tblEntregaPdvs = $('#tblEntregaPdvs').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_entrega_pdvs,
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


    $tblEntregaPdvs.on('click', 'button.editar', function () {

        let fila = $tblEntregaPdvs.row($(this).parents('tr')).index();

        $('#modActEnt').modal('show');

        codCliente = Number.parseInt(lista_entrega_pdvs[fila].cod_pdv);

        $txtNomCliente.val(lista_entrega_pdvs[fila].nom_pdv);
        $txtCanEnt.val(lista_entrega_pdvs[fila].can_ent).focus();

    });

    /*$tblEntregaPdvs.on('click', 'button.eliminar', function () {

        let fila = $tblEntregaPdvs.row($(this).parents('tr')).data();

        //console.log(fila)

        Swal
            .fire({
                title: "Desea Eliminar la Entrega del PDV?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(resultado => {
                if (resultado.value) {



                }
            });

    });*/




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


        $txtFechaEnt.prop('disabled', false);
        $btnConsultar.prop('disabled', false);


    });

    /******************************************************************************************
     * 
     */

    function inactivaCampos() {


        $txtFechaEnt.prop('disabled', true);
        //$txtCanEnt.prop('disabled', true);
        $btnConsultar.prop('disabled', true);

    }


    function limpiaCampos() {


        $txtFechaEnt.val(obtieneFechaActual());

        $tblEntregaPdvs.clear().draw();
        lista_entrega_pdvs = [];

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

                $txtFechaEnt.prop('disabled', false);
                $btnConsultar.prop('disabled', false);

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

    async function llenaTablaEntregaPdvs() {

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

                    totalEnt+=Number.parseInt(element.can_entrega);

                    lista_entrega_pdvs.push(itemTabla);
                }

                $tblEntregaPdvs.rows.add(lista_entrega_pdvs).draw();

                $txtTotalEnt.val(nf_entero.format(totalEnt));

            });
    }


    /*********************************************************************************************************************** */

    async function consultaEntregaPdv() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'consulta_entrega_diaria';
        req.cod_cliente = Number.parseInt($txtCodCliente.val());
        req.cod_item = 1;
        req.fec_entrega = $txtFechaEnt.val();

        $('#spinner').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                //console.log(data)


            });
    }





    async function actualizaEntregaPdv() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'actualiza_entrega_diaria';

        req.cod_cliente = codCliente;
        req.cod_item = 1;
        req.fec_entrega = $txtFechaEnt.val();
        req.can_entrega = Number.parseInt($txtCanEnt.val());
        req.id_usu_reg = sessionStorage.getItem('ID_USUARIO');

        $('#spinner').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                $('#modActEnt').modal('hide');

                let response = data.resp;



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

      if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $btnBuscaDis.prop('disabled', true);
        $txtCodDistri.prop('disabled', true); 
        
        $txtFechaEnt.prop('disabled',false);
        $btnConsultar.prop('disabled',false);
        $btnConsultar.focus();

    } 




});
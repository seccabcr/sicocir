$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_items_pdv = [];
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
            $cbItemsMercha.prop('disabled', true);
            $txtCanItem.prop('disabled', true);
            $btnActItem.prop('disabled', true);


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


    const $cbItemsMercha = $('#cbItemsMercha')
        .change(() => {

            consultaItemPdv();

        });

    const $txtCanItem = $('#txtCanItem')
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

                    $txtCanItem.val(nf_entero.format(x));

                    $btnActItem.focus();

                }


                e.preventDefault();
            }
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


    const $btnActItem = $('#btnActItem')
        .click(function (e) {

            actualizaItemMercha().then(() => {
                llenaTablaItemsPdv();
            })


            e.preventDefault();

        });

    const $btnCancelar = $('#btnCancelar')
        .click(function (e) {

            limpiaCampos();
            inactivaCampos();

            e.preventDefault();

        });




    var $tblItemsPdv = $('#tblItemsPdv').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_items_pdv,
        columns: [

            {
                data: 'cod_item',
                visible: false

            },
            {
                data: 'nom_item'

            },
            {
                data: 'can_item',
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


    $tblItemsPdv.on('click', 'button.editar', function () {

        let fila = $tblItemsPdv.row($(this).parents('tr')).data();

        $cbItemsMercha.val(fila.cod_item);
        $txtCanItem.val(fila.can_item);
        $txtCanItem.focus();

    });

    $tblItemsPdv.on('click', 'button.eliminar', function () {

        let fila = $tblItemsPdv.row($(this).parents('tr')).data();

        $cbItemsMercha.val('0');
        $txtCanItem.val('0');
        $cbItemsMercha.focus();


        Swal
            .fire({
                title: "Desea Eliminar el Item del Punto de Ventas?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(resultado => {
                if (resultado.value) {

                    eliminaItemMercha(fila).then(() => {

                        llenaTablaItemsPdv();
                    });
                }
            });

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

        $txtCodCliente.val(fila.cod_cliente);
        $txtNomCliente.val(fila.nom_cliente);

        $('#modBuscaPdv').modal('hide');

        consultaCliente();


    });



    function inactivaCampos() {

        $txtCodCliente.prop('disabled', true);
        $btnBuscaCli.prop('disabled', true);

        $cbItemsMercha.prop('disabled', true);
        $txtCanItem.prop('disabled', true);
        $btnActItem.prop('disabled', true);

    }


    function limpiaCampos() {

        $cbItemsMercha.val('0');
        $txtCanItem.val('0');

        $tblItemsPdv.clear().draw();
        lista_items_pdvs = [];

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

    /***********************************************************************************************************
     * 
     *
    */
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

    /***********************************************************************************
     * 
     */
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

                llenaTablaItemsPdv();

                $txtNomCliente.val(element.datos.nom_cliente);

                $cbItemsMercha.prop('disabled', false);
                $txtCanItem.prop('disabled', false);
                $btnActItem.prop('disabled', false);

                $cbItemsMercha.focus();

            });
    }

    /************************************************************************************
     * 
     */

    async function llenaComboItemsMercha() {

        let req = new Object();
        req.w = "apiSicocir";
        req.r = "lista_items";
        req.cat_item = 2;

        $cbItemsMercha.empty();

        $cbItemsMercha.append($("<option>", {
            value: '0',
            text: 'Seleccione un item'
        }));


        await fetch_postRequest(req,
            function (data) {

                let items = data.resp;

                for (item in items) {

                    let _codItem = items[item]['cod_item'];
                    let _nomItem = items[item]['nom_item'];

                    $cbItemsMercha.append($("<option>", {
                        value: _codItem,
                        text: _nomItem
                    }));
                }
            });

    }

    /**********************************************************************************************
     * 
     */

    async function consultaItemPdv() {


        if ($cbItemsMercha.val() == '0') {

            $cbItemsMercha.focus();
            Swal.fire({ title: 'Debe seleccionar un item', icon: "error" });
            return;
        }


        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'consulta_item_mercha_pdv';
        req.cod_cliente = Number.parseFloat($txtCodCliente.val());
        req.cod_item = Number.parseInt($cbItemsMercha.val());


        $('#spinner').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                let can = 0;

                let response = data.resp;

                if (response != null) {
                    can = Number.parseInt(response.can_item);
                }

                $txtCanItem.val(nf_entero.format(can));
                $txtCanItem.focus();
            });
    }


    /***********************************************************************************
    * 
    */
    async function llenaTablaItemsPdv() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_items_mercha_pdv';
        req.cod_cliente = Number.parseInt($txtCodCliente.val());

        lista_items_pdv = new Array();

        $tblItemsPdv.clear().draw();

        $('#spinner').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();




                let items = data.resp;

                for (let i = 0; i < items.length; i++) {


                    let item = new Object();

                    item.cod_item = items[i].cod_item;
                    item.nom_item = items[i].nom_item;
                    item.can_item = Number.parseInt(items[i].can_item)

                    lista_items_pdv.push(item);
                }

                $tblItemsPdv.rows.add(lista_items_pdv).draw();

            });
    }





    /**********************************************************************************************
     * 
     */

    async function actualizaItemMercha() {



        if ($cbItemsMercha.val() == '0') {
            $cbItemsMercha.focus();
            Swal.fire({ title: 'Debe seleccionar un item', icon: "error" });
            return;
        }

        let can = Number.parseInt($txtCanItem.val());

        if (can <= 0) {
            $cbItemsMercha.focus();
            Swal.fire({ title: 'Debe digitar una cantidad válida', icon: "error" });
            return;
        }




        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'actualiza_item_mercha_pdv';
        req.cod_cliente = Number.parseInt($txtCodCliente.val());
        req.cod_item = Number.parseInt($cbItemsMercha.val());
        req.can_item = can;


        $('#spinner').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();


                let response = data.resp;

                $cbItemsMercha.val('0');
                $txtCanItem.val('0');
                $cbItemsMercha.focus();

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });


            });
    }





    async function eliminaItemMercha(fila) {

        $('#spinner').show();

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'elimina_item_mercha_pdv';

        req.cod_cliente = Number.parseInt($txtCodCliente.val());
        req.cod_item = Number.parseInt(fila.cod_item);


        await fetch_postRequest(req, function (data) {

            $('#spinner').hide();



            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: data.resp.msg,
                showConfirmButton: false,
                timer: 1500
            });
        });
    }





    inactivaCampos();
    llenaComboItemsMercha();





});
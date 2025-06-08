$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();


    var lista_distribuidores = [];
    var listaClientes = [];



    const $txtCodDistri = $('#txtCodDistri')
        .focus(function () {
            $(this).select();

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



    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {

            llenaTablaDistribuidores();

        });



    var $tblClientes = $('#tblClientes').DataTable({

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
                data: 'tipo_neg'
            },
            /*{
                data: 'fec_ape'
            },*/
            {
                data: 'est_cliente'
            }

        ],
        info: false,
        ordering: false,
        language: lenguaje_data_table

    }); /// Fin de creacion de datatable


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


        llenaTablaClientes();


    });

    /******************************************************************************************
     * 
     */




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

                llenaTablaClientes();

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

    async function llenaTablaClientes() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_clientes';
        req.cod_distri = Number.parseInt($txtCodDistri.val());

        listaClientes = new Array();
        $tblClientes.clear().draw();

        $('#spinner').show();


        await fetch_postRequest(req,
            function (data) {            

                $('#spinner').hide();


                let clientes = data.resp;

                for (let i = 0; i < clientes.length; i++) {

                    const element = clientes[i];

                    let itemTabla = new Object();

                    itemTabla.cod_cliente = element.cod_cliente;
                    itemTabla.nom_cliente = element.nom_cliente;
                    itemTabla.tipo_neg = element.nom_tipo_neg;
                    //itemTabla.fec_ape = element.fec_reg;
                    itemTabla.est_cliente = element.estado_cli == '1' ? 'ACTIVO' : 'INACTIVO';

                    listaClientes.push(itemTabla);
                }

                $tblClientes.rows.add(listaClientes).draw();



            });
    }





    if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $txtCodDistri.prop('disabled',true);
        $btnBuscaDis.prop('disabled',true);

        llenaTablaClientes();

    }




});
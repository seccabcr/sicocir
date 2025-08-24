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


    const $btnImprimir = $('#btnImprimir')
        .click(function (e) {

            imprimeReporte();

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
                data: 'tipo_neg',
                className: 'text-center'
            },
            {
                data: 'fec_ape',
                 className: 'text-center'
            },
            {
                data: 'est_cliente'
            },
            {
                defaultContent: '<button class="ubicar btn btn-warning"><i class="bi bi-geo-alt"></i></button>',
                className: 'text-center',
                with: "10%"
            }

        ],
        info: false,
        ordering: false,
        language: lenguaje_data_table

    }); /// Fin de creacion de datatable

    $tblClientes.on('click', 'button.ubicar', function () {

        let fila = $tblClientes.row($(this).parents('tr')).data();

        if (fila.latidud == 0 || fila.longitud == 0) {
            Swal.fire({ title: 'Coordenadas invalidas. No se puede mostrar la ubicación', icon: "error" });
            return;

        }

        let link = 'https://maps.google.com/?q=' + fila.latitud + ',' + fila.longitud;


        window.open(link, '_blank')


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
                className: 'text-center',
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

                llenaTablaClientes();

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
                    itemTabla.fec_ape = element.fec_reg;
                    itemTabla.latitud = Number.parseFloat(element.latitud);
                    itemTabla.longitud = Number.parseFloat(element.longitud);
                    itemTabla.est_cliente = element.estado_cli == '1' ? 'ACTIVO' : 'INACTIVO';

                    listaClientes.push(itemTabla);
                }

                $tblClientes.rows.add(listaClientes).draw();



            });
    }

    function imprimeReporte() {

        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/Windows Phone/i)) {

            Swal.fire({ title: "Proceso de impresión no esta disponible en dispositivos móviles", type: "error" });
            return;
        }



        if (listaClientes.length > 0) {
            console.log('Imprimiendo reporte');

            let datos = new Object();

            datos.lista = listaClientes;

            new Listado_Clientes(datos);

        }
    }







    if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $txtCodDistri.prop('disabled', true);
        $btnBuscaDis.prop('disabled', true);

        llenaTablaClientes();

    }




});
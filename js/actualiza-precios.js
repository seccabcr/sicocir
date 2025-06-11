$(function () {

    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();


    /** Crea variables  */
  
    var listaDistri = new Array();

   

   
   
    const $txtCodDistri = $('#txtCodDistri');
    const $txtNomDistri = $('#txtNomDistri');



   
    const $btnBuscaDis = $('#btnBuscaDis');
   
    const $btnActualizar = $('#btnActualizar');
   

   


    function ini_componentes() {

        $tblClientes = $('#tblClientes').DataTable({

            destroy: true,
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

        $tblClientes.clear().draw();


        $('#tblClientes').on('click', 'button.editar', function () {

            let fila = $tblClientes.row($(this).parents('tr')).data();

            $('#modBuscaCli').modal('hide');

            $txtCodCliente.val(fila.cod_cliente);

            consultaCliente();

        });

        $tblDistri = $('#tblDistri').DataTable({

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





        $btnActualizar.click(function (e) {

            actualizaCliente();

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
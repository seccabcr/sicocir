$(function () {


     checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();
    
   
   

    var lista_picking_pdvs = [];
    var lista_distribuidores = [];
    var lista_pdvs = [];
   
   

    var mNuevoPdv = true;
    var mCodUsuario = 0;
   

   

    const $txtCodDis = $('#txtCodDistri')
        .val('');



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
                    $btnActUsuario.focus();

                }


                e.preventDefault();
            }
        });


   




    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {

          
            //llenaTablaUsuarios();



        });

   
    const $btnActPicking = $('#btnActPicking')
        .click(function (e) {

            actualizaUsuario();
            e.preventDefault();

        });

    const $btnCancelar = $('#btnCancelar')
        .click(function (e) {

            limpiaCampos();
            inactivaCampos();

            e.preventDefault();

        });

   

   


    const $btnAgregaPickPdv = $('#btnAgregaPickPdv')
        .click(function (e) {



            e.preventDefault();        
          
            
        });



    var $tblPickingPdvs = $('#tblPickingPdvs').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_picking_pdvs,
        columns: [
            {
                data: 'cod_pdv',
                visible: false
            },
            {
                data: 'nom_pdv'

            },          
            {
                data: 'can_pick',
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


    $tblPickingPdvs.on('click', 'button.editar', function () {

        let fila = $tblPickingPdvs.row($(this).parents('tr')).data();

      

    });

    $tblPickingPdvs.on('click', 'button.eliminar', function () {

        let fila = $tblPickingPdvs.row($(this).parents('tr')).data();

        //console.log(fila)

        Swal
            .fire({
                title: "Desea Eliminar el Picking del Punto de Ventas?",
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




    var $tblDistri = $('#tblDistri').DataTable({

        responsive: true,
        data: lista_distribuidores,
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

        $txtCodDis.val(fila.cod_usuario);

        //$('#modBuscaDis').modal('hide');

        //consultaUsuario();


    });

    
    var $tblPdvs = $('#tblPdvs').DataTable({

        responsive: true,
        data: lista_pdvs,
        columns: [
            {
                data: 'cod_pdv',
                visible: false

            },
            {
                data: 'nom_pdv'
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


    $tblPdvs.on('click', 'button.editar', function () {

        let fila = $tblPdvs.row($(this).parents('tr')).data();

        

        $('#modBuscaPdv').modal('hide');

        //consultaUsuario();


    });



    function inactivaCampos() {

       
        $btnAgregaPickPdv.prop('disabled', true);

    }

    function activaCampos() {
      
        

    }

    function limpiaCampos() {

        $tblPickingPdvs.clear().draw();
        lista_picking_pdvs = [];

    }


    async function llenaTablaUsuarios() {

        let req = new Object();
        req.w = 'apiLotto';
        req.r = 'lista_usuarios';
        req.cod_suc = Number.parseInt($cbSucursales.val())
        req.todos = $todos.prop('checked');

        lista_usuarios = new Array();

        $tblUsuarios.clear().draw();

        $('#spinnerModUsu').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinnerModUsu').hide();

                if (data.resp != null) {

                    let usuarios = data.resp.usuarios;

                    for (let i = 0; i < usuarios.length; i++) {

                        const element = usuarios[i];

                        let usu = new Object();
                        usu.cod_usuario = element.cod_usuario;
                        usu.nom_usuario = element.nom_usuario;

                        lista_usuarios.push(usu);
                    }

                    $tblUsuarios.rows.add(lista_usuarios).draw();
                }
            });
    }

    /******************************************************************************************************************** */

    async function llenaTablaPickingPdv() {

        let req = new Object();
        req.w = 'api';
        req.r = 'lista_';
        req.cod_usuario = Number.parseInt($txtCodUsu.val())

        lista_sorteos_usu = new Array();
        $tblSorteosUsu.clear().draw();

        $('#spinner').show();


        await fetch_postRequest(req,
            function (data) {

                //console.log(data)

                $('#spinner').hide();

                let sorteos = data.resp.sorteosUsu;

                for (let i = 0; i < sorteos.length; i++) {

                    const element = sorteos[i];

                    let sorteo = new Object();
                    sorteo.cod_sorteo = element.cod_sorteo;
                    sorteo.nom_sorteo = element.nom_sorteo;
                    sorteo.cod_rango = element.cod_rango;
                    sorteo.nom_rango = element.nom_rango;
                    sorteo.fac_premio_usu = Number.parseInt(element.facPremioUsu);
                    sorteo.fac_premio_comb_usu = Number.parseInt(element.facPremioCombUsu);
                    sorteo.por_comision_suc = Number.parseFloat(element.porComSuc);
                    sorteo.por_comision_usu = Number.parseFloat(element.porComUsu);

                    lista_sorteos_usu.push(sorteo);
                }

                $tblSorteosUsu.rows.add(lista_sorteos_usu).draw();

            });
    }

    /*********************************************************************************************************************** */

    async function consultaPickingPdv() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'consulta_usuario';
        req.cod_usuario = Number.parseInt($txtCodUsu.val());

        $('#spinner').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                //console.log(data)

                let element = data.resp;

                $txtIdUsu.val(element.id_usuario);
                $txtNomUsu.val(element.nom_usuario);
                $cbTipoUsu.val(element.tipo_usuario);
                let mon = Number.parseInt(element.lim_venta.replace(/,/g, ''));
                $txtMonMax.val(nf_entero.format(mon));
                $cbProcesoOnLIne.val(element.proceso_online);
                $cbEstadoUsu.val(element.est_usuario);

                mNuevoUsu = false;

                let user = sessionStorage.getItem('TIPO_USUARIO');

                if (element.tipo_usuario <= user) {

                    llenaTablaSorteosUsuarios().then(() => {

                        //activaCampos();
                        $txtIdUsu.prop('disabled', true);
                        $txtNomUsu.prop('disabled', element.tipo_usuario >= user & user < '3')
                        $cbTipoUsu.prop('disabled', element.tipo_usuario >= user & user < '3');
                        $txtMonMax.prop('disabled', element.tipo_usuario >= user & user < '3');
                        $cbProcesoOnLIne.prop('disabled', element.tipo_usuario <= user & user < '3');
                        $cbEstadoUsu.prop('disabled', element.tipo_usuario >= user & user < '3');
                        $btnActUsuario.prop('disabled', element.tipo_usuario >= user & user < '3');

                        $cbProcesoOnLIne.prop('disabled', sessionStorage.getItem('TIPO_USUARIO') < '3' || mProcesoOnLine == 0);

                        $btnAgregaSor.prop('disabled', element.tipo_usuario > user & user < '3');

                        $txtNomUsu.focus();
                    });

                } else {

                    Swal.fire({ title: "NO autorizado a modificar los datos de este usuario", icon: "warning" });

                }

            });
    }


    


    async function actualizaPickingPdv() {

       

        let index = $cbSucursales.prop('selectedIndex') - 1;
        mMonMaxSuc = lista_sucursales[index].lim_venta;


        if ($txtIdUsu.val().length < 4 && mNuevoUsu) {
            $txtIdUsu.focus();
            Swal.fire({ title: "El ID debe tener como minimo 4 caracteres", icon: "warning" });
            return;
        }

        if ($txtNomUsu.val().length < 4) {
            $txtNomUsu.focus();
            Swal.fire({ title: "El nombre debe tener como minimo 4 caracteres", icon: "warning" });
            return;
        }

        if ($txtMonMax.val().length == 0) {
            $txtMonMax.focus();
            Swal.fire({ title: "El maximo disponible es requerido", icon: "warning" });
            return;
        }


        if ($cbTipoUsu.val() > sessionStorage.getItem('TIPO_USUARIO')) {
            $cbTipoUsu.focus();
            Swal.fire({ title: "NO autorizado a asignar este tipo de usuario", icon: "warning" });
            return;
        }

        let monMax = Number.parseInt($txtMonMax.val().replace(/,/g, ''));


        if (mMonMaxSuc > 0 && monMax > mMonMaxSuc) {
            $txtMonMax.focus();
            Swal.fire({ title: "El maximo disponible NO puede ser mayor al limite disponible de la sucursal", icon: "warning" });
            return;
        }


        let codUsuario = $txtCodUsu.val().length > 0 ? Number.parseInt($txtCodUsu.val()) : 0;

        if(nuevoUsuario){

            let x = $txtIdUsu.val().replace(/ /g, '');
            $txtIdUsu.val(x.toLowerCase());
        }


        let req = new Object();
        req.w = 'apiLotto';
        req.r = 'actualiza_usuario';
        req.nuevo = mNuevoUsu;
        req.cod_usuario = codUsuario;
        req.id_usuario = $txtIdUsu.val();
        req.nom_usuario = $txtNomUsu.val();
        req.tipo_usuario = Number.parseInt($cbTipoUsu.val());
        req.cod_suc = Number.parseInt($cbSucursales.val());
        req.lim_venta = monMax;
        req.proceso_online = Number.parseInt($cbProcesoOnLIne.val());
        req.est_usuario = Number.parseInt($cbEstadoUsu.val());

        $('#spinner').show();


        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();


                let response = data.resp;
                if (response.status == 'error') {

                    Swal.fire({ title: response.msg, icon: "error" });
                    return;

                }

                mNuevoUsu = false;
                $txtCodUsu.val(response.cod_usuario);

                $btnAgregaSor.prop('disabled', false);

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });


            });
    }


    


    async function eliminaPickingPdv(fila) {

        $('#spinner').show();

        let req = new Object();
        req.w = 'apiLotto';
        req.r = 'elimina_sorteo_usu';

        req.cod_usuario = Number.parseInt($txtCodUsu.val());
        req.cod_sorteo = Number.parseInt(fila.cod_sorteo);


        await fetch_postRequest(req, function (data) {

            $('#spinner').hide();

            //console.log(data)

            if (data.resp.status == 'error') {

                Swal.fire({ title: data.resp.msg, icon: 'error' });
                return;

            }

            llenaTablaSorteosUsuarios();

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





});
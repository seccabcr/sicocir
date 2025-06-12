$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();




    var lista_liq_pdvs = [];
 

    var lista_distribuidores = [];
   

    const $txtCodDistri = $('#txtCodDistri')
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
    const $txtTotalDev = $('#txtTotalDev');
    const $txtTotalVta = $('#txtTotalVta');

  

    const $btnConsultar = $('#btnConsultar')
        .click(function (e) {

       

            e.preventDefault();

        });



    const $btnBuscaDis = $('#btnBuscaDis')
        .click(function (e) {
            llenaTablaDistribuidores();
            e.preventDefault();

        });

  

   
    var $tblLiqPdvs = $('#tblLiqPdvs').DataTable({
        //destroy: true,
        responsive: true,
        data: lista_liq_pdvs,
        columns: [
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
                data: 'can_dev',
                className: 'text-end',
                render: DataTable.render.number(',', '.'),
                searchable: false

            },
            {
                data: 'can_vta',
                className: 'text-end',
                render: DataTable.render.number(',', '.'),
                searchable: false,
                responsivePriority: 1

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


  




    function limpiaCampos() {

        $txtFechaIni.val(obtieneFechaActual());
        $txtFechaFin.val(obtieneFechaActual());
        $txtTotalEnt.val('0');
        $txtTotalDev.val('0');
        $txtTotalVta.val('0');
        $tblLiqPdvs.clear().draw();
        lista_liq_pdvs = [];
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

   


    async function consultaLiquidacionPeriodo() {

        let fechaIni = $txtFechaIni.val();
        let fechaFin = $txtFechaFin.val();


        if (fechaIni > fechaFin) {
            $txtFechaFin.focus();
            Swal.fire({ title: "Fecha Inicial NO puede ser mayor que la Fecha Final", icon: "warning" });
            return;
        }



        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'lista_liq_diaria_pdv';
        req.cod_cliente = Number.parseInt($txtCodCliente.val());
        req.fecha_ini = $txtFechaIni.val();
        req.fecha_fin = $txtFechaFin.val();
        req.cod_item = 1;


        listaTablaLiq = new Array();
        $tblLiqPdvs.clear().draw();

        $('#spinnerModCli').show();

        await fetch_postRequest(req,
            function (data) {
                $('#spinnerModCli').hide();

                lista_liq_pdvs = data.resp;

                let totEnt = 0;
                let totDev = 0;
                let totVta = 0;

                for (let i = 0; i < lista_liq_pdvs.length; i++) {

                    let element = lista_liq_pdvs[i];

                    let a_fecha = element.fec_entrega.split('-');
                    let canEnt = Number.parseInt(element.can_entrega);
                    let canDev = Number.parseInt(element.can_dev);
                    let canVta = canEnt - canDev;

                    totEnt += canEnt;
                    totDev += canDev;
                    totVta += canVta;

                    let fechaLiq = new Object();
                    fechaLiq.fec_ent = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                    fechaLiq.can_ent = canEnt;
                    fechaLiq.can_dev = canDev;
                    fechaLiq.can_vta = canVta;

                    listaTablaLiq.push(fechaLiq);
                }

                $tblLiqPdvs.rows.add(listaTablaLiq).draw();
                $txtTotalEnt.val(nf_entero.format(totEnt));
                $txtTotalDev.val(nf_entero.format(totDev));
                $txtTotalVta.val(nf_entero.format(totVta));

            });
    }


  



    if (sessionStorage.getItem('TIPO_USUARIO') == '1') {

        $txtCodDistri.val(sessionStorage.getItem('COD_USUARIO'));
        $txtNomDistri.val(sessionStorage.getItem('NOM_USUARIO'));

        $btnBuscaDis.prop('disabled', true);
        $txtCodDistri.prop('disabled', true);
     
    }




});
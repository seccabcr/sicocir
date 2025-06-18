$(function () {


    checkInicioSesion();
    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();

    var listaDistri = [];

    var codDis = 0;

    const $txtNomDis = $('#txtNomDis');

    const $estCierre = $('#est_cierre');

    const $txtFechaIni = $('#txtFechaIni')
        .val(obtieneFechaActual())
        .change(function () {

        });

    const $txtFechaFin = $('#txtFechaFin')
        .val(obtieneFechaActual())
        .change(function () {

        });


    const $btnActCierre = $('#btnActCierre')
        .click(function (e) {

            actualizaCierre();

            e.preventDefault();

        });




    var $tblDistri = $('#tblDis').DataTable({

        responsive: true,
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
                defaultContent: '<button class="editar btn btn-primary"><i class="bi bi-pen"></i></button>',
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

        $('#modActCierre').modal('show');

        codDis = Number.parseInt(fila.cod_dis);
        $txtNomDis.val(fila.nom_dis);

        $estCierre.focus();


    });

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

    async function actualizaCierre() {

        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'actualiza_cierre';
        req.cod_dis = codDis;
        req.fec_ini = $txtFechaIni.val();
        req.fec_fin = $txtFechaFin.val();
        req.est_mov = $estCierre.prop('checked') ? 2 : 1;


        $('#spinnerActCierre').show();

        await fetch_postRequest(req,
            function (data) {

                $('#spinnerActCierre').hide();

                let response = data.resp;

                $('#modActCierre').modal('hide');

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.msg,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    }


    llenaTablaDistribuidores();





});
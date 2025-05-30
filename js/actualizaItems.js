$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    activaBotonMenu();
   

    var mNuevo = 1;
    var listaItems = new Array();
    var $tblItems;

    const $txtCodItem = $('#txtCodItem');
    const $txtNomItem = $('#txtNomItem');
    

    const $cbTipoItem = $('#cbTipoItem');
    
    const $cbEstado = $('#cbEstado');

    
    const $txtCodBarras = $('#txtCodBarras');

    

    const $btnNuevoItem = $('#btnNuevoItem')
        .click(function (e) {
            e.preventDefault();
            nuevoItem();
        });

    const $btnBuscaItem = $('#btnBuscaItem').click(function (e) {
        //listarArticulos();
        e.preventDefault();
    });
  

    const $btnActualizar = $('#btnActualizar')
        .click((e) => {
            actualizaItem();
            e.preventDefault();
        });
    const $btnCancelar = $('#btnCancelar')
        .click((e) => {
            e.preventDefault();
            limpiaCampos();
            inactivaCampos();
            $txtCodItem.val('');
            $txtCodItem.focus();

        });

    ini_componentes();

  

    limpiaCampos();
    inactivaCampos();


    function ini_componentes() {

        $tblItems = $('#tblItems').DataTable({
            destroy: true,
            data: listaItems,
            columns: [
                {
                    data: 'cod_item',
                    className: 'dt-center'
                }, {
                    data: 'nom_item'
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



        $('#tblItems').on('click', 'button.editar', function () {

            let fila = $tblItems.row($(this).parents('tr')).index();

            $('#modBuscaItems').modal('hide');

            $txtCodItem.val(listaItems[fila].cod_item);

            consultaItem();


        });


        $txtCodItem.focus(function () {
            $(this).select();
        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                if ($(this).val().length > 0) {

                    consultaItem();

                } else {
                    nuevoItem();
                }


                e.preventDefault();
            }
        });

        $txtNomItem.focus(function () {
            $(this).select();
        }).keydown(function (e) {

            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                $txt.focus();

                e.preventDefault();
            }

        });   

      

        $txtCodBarras.focus(function () {
            $(this).select();
        }).keydown(function (e) {

            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                $txtCodCabys.focus();

                e.preventDefault();
            }

        });

       
    }

    function nuevoItem() {
        limpiaCampos();
        activaCampos();
        $txtCodItem.val('')
        mNuevo = true;
        $txtNomItem.focus();

    }

    function limpiaCampos() {

        $txtNomItem.val('');
        $txtCodBarras.val('');
        $cbEstado.val(1);
        


    }

    function inactivaCampos() {

        $txtNomItem.prop('disabled', true);        
        $txtCodBarras.prop('disabled', true);
        $cbEstado.prop('disabled', true);
        $cbTipoItem.prop('disabled', true);        
        $btnActualizar.prop('disabled', true);

    }

    function activaCampos() {

        $txtNomItem.prop('disabled', false);        
        $txtCodBarras.prop('disabled', false);        
        $cbTipoItem.prop('disabled', false);
        $cbEstado.prop('disabled', false);

        $btnActualizar.prop('disabled', false);


    }



    async function consultaItem() {

        $('#spinner').show();

        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'consulta_articulo';
        req.codigo_art = Number.parseInt($txtCodItem.val());

        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                if (data.resp == null || data.resp.tipo_item == 0) {
                    Swal.fire({ title: "Articulo NO existe o es tipo Combo", icon: "error" });
                    return;
                }

                mNuevo = false;
                $txtNomLarItem.val(data.resp.nom_lar_art);
                $txtNomCorItem.val(data.resp.nom_cor_art);
                $cbCatItems.val(data.resp.codCategoria);
                $cbTipoItem.val(data.resp.tipo_item);
                $txtCodBarras.val(data.resp.cod_barra);
                $txtGramaje.val(data.resp.gramaje);
                $txtCodCabys.val(data.resp.codigoCabys);
                $cbEstado.val(data.resp.status_art);

                activaCampos();

                $txtNomLarItem.focus();

            });

    }



    async function listarArticulos() {

        //$('#spinner').show();

        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'lista_articulos';

        $tblItems.clear().draw();
        listaItems = new Array();

        await fetch_postRequest(req,
            function (data) {

                //$('#spinner').hide();

                let items = data.resp.items;
                for (let i = 0; i < items.length; i++) {

                    let item = new Object();
                    item.cod_item = items[i].codigo_art;
                    item.nom_item = items[i].nom_lar_art;

                    listaItems.push(item);
                }

                $tblItems.rows.add(listaItems).draw();

            });
    }



    async function actualizaItem() {

        //Validaciones de campos
        if ($txtNomItem.val().length == 0) {
            $txtNomItem.focus();
            Swal.fire({ title: "Campo de nombre largo es requerido", icon: "error" });
            return;
        }

      

        if ($cbTipoItem.val() == 0) {
            $cbTipoItem.focus();
            Swal.fire({ title: "Seleccione un tipo de item", icon: "error" });
            return;
        }

     

        $('#spinner').show();

        let req = new Object();
        req.w = 'apiSeccab';
        req.r = 'actualiza_articulo';
        req.nuevo = mNuevo;
        req.codigo_art = Number.parseInt($txtCodItem.val());
        req.nom_art = $txtNomItem.val();        
        req.tipo_item = Number.parseInt($cbTipoItem.val());
        req.cod_barras = $txtCodBarras.val();        
        req.estado = Number.parseInt($cbEstado.val());

        await fetch_postRequest(req,
            function (data) {

                $('#spinner').hide();

                let msg = data.resp.msg;

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                })

                if (mNuevo) {
                    $txtCodItem.val(data.resp.codigo_art);
                    mNuevo = false;
                }

                limpiaCampos();
                inactivaCampos();
                $txtCodItem.focus();

            });

    }





});
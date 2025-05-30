$(function () {


    const $idUsuario = $('#idUsuario').val('')
        .focus(function () {
            $(this).select();
        })
        .keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                if ($(this).val().length > 0) {

                    let x = $(this).val().replace(/ /g, '');
                    $(this).val(x.toLowerCase());

                    $('#pinUsuario').focus();
                }
                e.preventDefault();
            }
        });

    const $pinUsuario = $('#pinUsuario').val('').keydown(function (e) {
        let code = e.keyCode || e.which;
        if (code == 13) {

            $('#btnIngresar').focus();
            e.preventDefault();
        }
    });

    const $btnIngresar = $('#btnIngresar').click(function (e) {
        e.preventDefault();
        loginUsuario();
    });





    function loginUsuario() {


        if ($idUsuario.val().length == 0) {
            Swal.fire({ title: "Debe digitar un ID Usuario", icon: "error" });
            $idUsuario.focus();
            return;
        }

        let x = $idUsuario.val().replace(/ /g, '');
        $idUsuario.val(x.toLowerCase());

        let url = window.location.origin + '/sicocir-ge/'; // Url API
        console.log(url)
        sessionStorage.setItem("URL_API", url);


        let req = new Object();
        req.w = 'apiSicocir';
        req.r = 'login_usuario';
        req.id_usuario = $idUsuario.val();
        req.pin_pass = $pinUsuario.val();

        fetch_postRequest(req,
            function (data) {

                let element = data.resp;
                if (element.estadoRes == 'error') {
                    $idUsuario.focus();
                    Swal.fire({ title: element.msg, icon: "error" });
                    return;

                }

                console.log(data)

                let titUsuario = 'Indefinido';


                switch (element.datos.tipo_usuario) {
                    case '1':
                        titUsuario = 'Distribuidor';
                        break;
                    case '2':
                        titUsuario = 'Ejecutivo';
                        break;
                    case '3':
                        titUsuario = 'Supervisor';
                        break;
                   case '4':
                        titUsuario = 'Super ADM';
                        break;
                }


                sessionStorage.setItem("ID_USUARIO", req.id_usuario);
                sessionStorage.setItem("COD_USUARIO", element.datos.cod_usuario);
                sessionStorage.setItem("TIPO_USUARIO", element.datos.tipo_usuario);
                sessionStorage.setItem("TIT_USUARIO", titUsuario);
                sessionStorage.setItem("NOM_USUARIO", element.datos.nom_usuario);


               iGoTo('./inicio.html');

            }

        );
    }

});
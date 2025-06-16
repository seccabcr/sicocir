// Constantes Globales
const nf_entero = new Intl.NumberFormat('en'); // Formato entero

const nf_decimal = new Intl.NumberFormat('en', {
  style: "decimal",
  minimumFractionDigits: 2
});


const nf_dec1 = new Intl.NumberFormat('en', {
  style: "decimal",
  minimumFractionDigits: 1
});

const nf_dec6 = new Intl.NumberFormat('en', {
  style: "decimal",
  minimumFractionDigits: 6
});


const pattern_entero = /^-?\d*(\.\d+)?$/;
const pattern_numero = /^\d*\.\d+$/;

const lenguaje_data_table = {
  decimal: '.',
  emptyTable: 'No hay información',
  info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
  infoEmpty: 'Mostrando 0 to 0 of 0 registros',
  infoFiltered: '(Filtrado de _MAX_ total registros)',
  infoPostFix: '',
  thousands: ',',
  lengthMenu: 'Mostrar _MENU_ registros',
  loadingRecords: 'Cargando...',
  processing: 'Procesando...',
  search: 'Buscar:',
  zeroRecords: 'Sin resultados encontrados',
  paginate: {
    first: '<<',
    last: '>>',
    next: '>',
    previous: '<'
  }
}


function activaBotonMenu() {

  /**
* Sidebar toggle
*/
  $('.toggle-sidebar-btn').click(function (e) {

    document.querySelector('body').classList.toggle('toggle-sidebar');
  });


}


/*--
Funcion para agregar el header 
--*/
function addHeader() {

  $('#header').load('./templates/header.html');

}



/*--
Funcion para agregar el menú de ventas
--*/
function addMenu() {

  $('#sidebar-nav').load('./templates/sidebar.html');
}





// Obtiene el idUsuario en sessionStorage
function getDatosSessionUsu() {

  let usuario = [];
  usuario.idUsu = sessionStorage.getItem('ID_USUARIO');
  usuario.codUsu = sessionStorage.getItem('COD_USUARIO');
  usuario.nomUsu = sessionStorage.getItem('NOM_USUARIO');
  usuario.tipoUsu = sessionStorage.getItem('TIPO_USUARIO');
  usuario.codSuc = sessionStorage.getItem('COD_SUC');
  usuario.titUsu = sessionStorage.getItem('TIT_USUARIO');

  return usuario;
}

/*** Carga los datos del usuario en el Header de la pagina */

function cargaDatosUsuario() {

  let usuSession = getDatosSessionUsu();

  $('#nomUsuDrop span').text(usuSession.idUsu);
  $('#mnUsuario h6').text(usuSession.nomUsu);
  $('#mnUsuario span').text(usuSession.titUsu);
}

/** Funcion para verificar inicio de sesion del usuario */
function checkInicioSesion() {

  if (!sessionStorage.getItem("ID_USUARIO")) {

    window.location.href = './login.html';
  }
}

/** Funcion para obtener la fecha actual */
function obtieneFechaActual() {

  let fecha = new Date();
  let dia = fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate();
  let mes = (fecha.getMonth() + 1) > 9 ? fecha.getMonth() + 1 : '0' + (fecha.getMonth() + 1);
  let anio = fecha.getFullYear();


  var fechaInput = anio + "-" + mes + "-" + dia;

  return fechaInput;
}

function obtenerHoraActual() {
  let myDate = new Date();
  let hours = myDate.getHours();
  let minutes = myDate.getMinutes();
  let seconds = myDate.getSeconds();
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  let horaActual = hours + ":" + minutes + ":" + seconds;
  return horaActual;

}



/**********************************************/
/* Function para hacer request POST con Fetch */
/* Req request data, func success, func error */
/**********************************************/
async function fetch_postRequest(req, success) {

  const api_url = sessionStorage.getItem('URL_API') + 'api.php';

  //console.log(api_url)

  await fetch(api_url, {
    method: 'POST',
    body: JSON.stringify(req), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok)
        return response.text()
      else
        throw new Error(response.status);
    })
    .then(data => {
      //console.log(data);
      let r = JSON.parse(data);
      success(r);
    })
    .catch(error => {
      console.log(error);
      Swal.fire({ title: "Error de Conexión\n" + error, icon: "error" });
    });
}


async function fetch_request(req) {

  let api_url = sessionStorage.getItem('URL_API') + 'api.php';


  const request = await fetch(api_url,
    {
      method: 'POST',
      body: JSON.stringify(req),
      headers: {
        'Content-Type': 'application/json',
      }
    });

  const response = await request.json();

  return response;


}




// Funcion para redirigir a otra pagina
function iGoTo(goTo) {
  $("body").hide();
  window.location.href = goTo;
}

/** Funcion para cerrar sesion del Usuario */
function cerrarSession() {

  sessionStorage.removeItem('ID_USUARIO');
  sessionStorage.removeItem('COD_USUARIO');
  sessionStorage.removeItem('NOM_USUARIO');
  sessionStorage.removeItem('TIPO_USUARIO');
  sessionStorage.removeItem('COD_SUC');
  sessionStorage.removeItem('TIT_USUARIO');
  sessionStorage.removeItem('TIT_TKT');
  sessionStorage.removeItem('MSG_TKT');
  sessionStorage.removeItem('URL_API');
  sessionStorage.removeItem('NOM_IMP');
  sessionStorage.removeItem('ANCHO_TKT');

  //window.close()

  iGoTo('./login.html');

}






function accesoAdmGen(_pagina) {

  let tipoUsuario = sessionStorage.getItem('TIPO_USUARIO');

  if (tipoUsuario < 4) {
    Swal.fire({ title: "Usuario NO tiene acceso autorizado a esta opción", icon: "info" });
    return;
  }

  iGoTo(_pagina);

}

function accesoAdm3(_pagina) {

  let tipoUsuario = sessionStorage.getItem('TIPO_USUARIO');

  if (tipoUsuario < 3) {
    Swal.fire({ title: "Usuario NO tiene acceso autorizado a esta opción", icon: "info" });
    return;
  }

  iGoTo(_pagina);

}

function accesoAdm2(_pagina) {

  let tipoUsuario = sessionStorage.getItem('TIPO_USUARIO');

  if (tipoUsuario < 2) {
    Swal.fire({ title: "Usuario NO tiene acceso autorizado a esta opción", icon: "info" });
    return;
  }

  iGoTo(_pagina);

}


function validarEmail(email) {

  // Get our input reference.
  //var emailField = document.getElementById('user-email');

  // Define our regular expression.
  var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  // Using test we can check if the text match the pattern
  if (validEmail.test(email)) {
    //alert('Email is valid, continue with form submission');
    return true;
  } else {
    //alert('Email is invalid, skip form submission');
    return false;
  }
}





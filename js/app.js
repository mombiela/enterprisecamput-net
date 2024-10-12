import { FirebaseService } from './FirebaseService.js';

$(document).ready(function() {
  FirebaseService.onChangeAuth(updateInfoUser);;

  // Eventos
  $('#register').click(register);
  $('#login').click(login);
  $('#anonymous-login').click(loginAnonimo);
  $('#logout').click(logout);
  $("#eliminarUser").click(deleteUser);
  $('#guardar-datos').click(guardarDatos);
  $('#recover_pwd').click(recoverPwd);
  $('#verifyEmail').click(verifyEmail);
  $('#removePage').click(removePage);
  $('#addPage').click(addPage);
});

function mostrarMensaje(texto) 
{
	$('#mensaje').text(texto);
}

function updateInfoUser(user)
{
	if (user) 
	{
    	mostrarMensaje('Usuario autenticado.');
      	actualizarInformacionUsuario(user);
      	cargarDatosUsuario();
    } 
	else 
	{
      actualizarInformacionUsuario(null);
    }
}

function actualizarInformacionUsuario(user) 
{
	if (user) 
	{
	  $('#usuario-nombre').text(user.isAnonymous ? 'Usuario Anónimo' : (user.displayName || 'Sin nombre'));
	  $('#usuario-email').text(user.isAnonymous ? 'Sin email' : (user.email || 'Sin email'));
	  $('#usuario-verificado').text(user.emailVerified ? 'Email verificado' : 'Falta verificar');
	  $('#usuario-info').show();
	  $('#contenido').show();
	  $('#guardar-datos').show();
	  $('#auth-form').hide();
	  
	  if (user.emailVerified) $('#verifyEmail').hide();
	  else $('#verifyEmail').show();
	} 
	else 
	{
	  $('#usuario-nombre').text('');
	  $('#usuario-email').text('');
	  $('#usuario-info').hide();
	  $('#contenido').hide();
	  $('#guardar-datos').hide();
	  $('#auth-form').show();
	}
}

async function cargarDatosUsuario() 
{
	try
	{
		const docSnap = await FirebaseService.cargarDatos();	
        if (docSnap.exists()) 
		{
        	const data = docSnap.data();
          	$('#contenido').val(data.contenido);
          	mostrarMensaje('Datos cargados correctamente.');
        } 
		else 
		{
        	$('#contenido').val('');
        	mostrarMensaje('No se encontraron datos para este usuario.');
        }
	}
	catch (error)
	{
        console.error("Error al obtener los datos:", error);
        mostrarMensaje('Error al obtener los datos.');
	}
}

async function register() {
    const email = $('#email').val();
    const password = $('#password').val();
	const nombre = $('#nombre').val();

    if (email && password && nombre) 
	{
		try
		{
			const user = await FirebaseService.registrarUsuario(email, password, nombre);	
        	mostrarMensaje('Registro exitoso.');
        	actualizarInformacionUsuario(user);
		}
		catch (error)
		{
          console.error('Error en el registro:', error);
          mostrarMensaje('Error en el registro: ' + error.message);
		}
    } 
	else 
	{
    	mostrarMensaje('Por favor, ingresa correo electrónico, contraseña y nombre.');
    }
}

async function login() 
{
    const email = $('#email').val();
    const password = $('#password').val();

    if (email && password) 
	{
		try
		{
    		const userCredential = await FirebaseService.iniciarSesion(email, password);
        	mostrarMensaje('Inicio de sesión exitoso.');
        	actualizarInformacionUsuario(userCredential.user);
		}
		catch (error)
		{
          console.error('Error en el inicio de sesión:', error);
          mostrarMensaje('Error en el inicio de sesión: ' + error.message);
		}
    } 
	else 
	{
    	mostrarMensaje('Por favor, ingresa correo electrónico y contraseña.');
    }
}


async function loginAnonimo() 
{
	try
	{
    	await FirebaseService.iniciarSesionAnonimamente();
        mostrarMensaje('Has iniciado sesión como invitado.');
        actualizarInformacionUsuario(userCredential.user);
	}
	catch (error)
	{
        console.error('Error al iniciar sesión anónimamente:', error);
        mostrarMensaje('Error al iniciar sesión anónimamente: ' + JSON.stringify(error,null,3));
	}
}

async function logout() 
{
	try
	{
    	await FirebaseService.cerrarSesion();
        mostrarMensaje('Has cerrado sesión.');
        actualizarInformacionUsuario(null);
        $('#contenido').val('');
	}
	catch (error)
	{
        console.error('Error al cerrar sesión:', error);
        mostrarMensaje('Error al cerrar sesión.');
	}
}

async function deleteUser()
{
	try
	{
    	await FirebaseService.eliminarUsuario();
		//await FirebaseService.cerrarSesion();
        mostrarMensaje('Has eliminado usuario.');
        actualizarInformacionUsuario(null);
        $('#contenido').val('');
	}
	catch (error)
	{
        console.error('Error al Eliminar usuario:', error);
        mostrarMensaje('Error al eliminar usuario.');
	}
}

async function guardarDatos() 
{
	const contenido = $('#contenido').val();
  	try
	{
  		await FirebaseService.guardarDatos(contenido);
		mostrarMensaje('Datos guardados exitosamente.');
	}
	catch(error)
	{
    	console.error("Error al guardar los datos:", error);
      	mostrarMensaje('Error al guardar los datos.');
	}
}

async function recoverPwd()
{
  	try
	{
	    const email = $('#email').val();
	    
	    if (!email)
	    {
			 mostrarMensaje('Debe informar email');
			 return;	
		}
  		await FirebaseService.recuperarContrasena(email);
		mostrarMensaje('recuperar pwd ok');
	}
	catch(error)
	{
    	console.error("Error al guardar los datos:", error);
      	mostrarMensaje('Error al recuperar pwd.');
	}
}

async function verifyEmail()
{
  	try
	{
  		await FirebaseService.enviarVerificacionEmail();
		mostrarMensaje('Email verificación ok');
	}
	catch(error)
	{
    	console.error("Error al enviar email verificación:", error);
      	mostrarMensaje('Error al enviar email verificacion: ' + error);
	}
}

async function addPage()
{
	let mod = $("#module").val();
	let page = $("#page").val();
	
	if (!mod || !page)
	{
		mostrarMensaje("Debe informar modulo y página para añadir");
		return;
	}
}

async function removePage()
{
	let mod = $("#module").val();
	let page = $("#page").val();
	
	if (!mod || !page)
	{
		mostrarMensaje("Debe informar modulo y página para eliminar");
		return;
	}
}



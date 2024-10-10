// Importaciones de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// Configuración de Firebase de tu proyecto
const firebaseConfig = {
	apiKey: "AIzaSyAcGdiZxHzBq5rVn1boUa-0RAhyBpkuGN0",
	authDomain: "enterprise-campus-925a3.firebaseapp.com",
	projectId: "enterprise-campus-925a3",
	storageBucket: "enterprise-campus-925a3.appspot.com",
	messagingSenderId: "256906158886",
	appId: "1:256906158886:web:c2776937626b6dad9517e7",
	measurementId: "G-VVPMPJSR3P"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

$(document).ready(function() {

  // Función para mostrar mensajes al usuario
  function mostrarMensaje(texto) {
    $('#mensaje').text(texto);
  }

  // Función para actualizar la información del usuario en la página
  function actualizarInformacionUsuario(user) {
    if (user) {
      $('#usuario-nombre').text(user.displayName || 'Sin nombre');
      $('#usuario-email').text(user.email || 'Sin email');
      $('#usuario-info').show();
      $('#contenido').show();
      $('#guardar-datos').show();
      $('#auth-form').hide();
    } else {
      $('#usuario-nombre').text('');
      $('#usuario-email').text('');
      $('#usuario-info').hide();
      $('#contenido').hide();
      $('#guardar-datos').hide();
      $('#auth-form').show();
    }
  }

  // Manejar estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      mostrarMensaje(`Usuario autenticado.`);
      actualizarInformacionUsuario(user);
      // Si el usuario está autenticado, obtener y mostrar los datos
      cargarDatos(user);
    } else {
      mostrarMensaje('No hay ningún usuario autenticado.');
      actualizarInformacionUsuario(null);
      // Limpiar el textarea
      $('#contenido').val('');
    }
  });

  // Función para cargar datos del usuario
  async function cargarDatos(user) {
    const docRef = doc(db, 'usuarios', user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        $('#contenido').val(data.contenido);
        mostrarMensaje('Datos cargados correctamente.');
      } else {
        mostrarMensaje('No se encontraron datos para este usuario.');
        $('#contenido').val('');
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      mostrarMensaje('Error al obtener los datos.');
    }
  }

  // Registro de usuario
  $('#register').click(function() {
    const email = $('#email').val();
    const password = $('#password').val();

    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          mostrarMensaje('Registro exitoso. Por favor, completa tu perfil.');
          // Opcional: Solicitar el nombre del usuario
          const nombre = prompt('Ingresa tu nombre:');
          if (nombre) {
            updateProfile(user, { displayName: nombre })
              .then(() => {
                actualizarInformacionUsuario(user);
              })
              .catch((error) => {
                console.error('Error al actualizar el perfil:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error en el registro:', error);
          mostrarMensaje('Error en el registro: ' + error.message);
        });
    } else {
      mostrarMensaje('Por favor, ingresa correo electrónico y contraseña.');
    }
  });

  // Inicio de sesión
  $('#login').click(function() {
    const email = $('#email').val();
    const password = $('#password').val();

    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          mostrarMensaje('Inicio de sesión exitoso.');
          actualizarInformacionUsuario(user);
        })
        .catch((error) => {
          console.error('Error en el inicio de sesión:', error);
          mostrarMensaje('Error en el inicio de sesión: ' + error.message);
        });
    } else {
      mostrarMensaje('Por favor, ingresa correo electrónico y contraseña.');
    }
  });

  // Cerrar sesión
  $('#logout').click(function() {
    signOut(auth).then(() => {
      mostrarMensaje('Has cerrado sesión.');
      actualizarInformacionUsuario(null);
      $('#contenido').val('');
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
      mostrarMensaje('Error al cerrar sesión.');
    });
  });

  // Funcionalidad para guardar datos
  $('#guardar-datos').click(async function() {
    const user = auth.currentUser;
    if (user) {
      const contenido = $('#contenido').val();
      try {
        await setDoc(doc(db, 'usuarios', user.uid), {
          contenido: contenido
        });
        mostrarMensaje('Datos guardados exitosamente.');
      } catch (error) {
        console.error("Error al guardar los datos:", error);
        mostrarMensaje('Error al guardar los datos.');
      }
    } else {
      mostrarMensaje('Debes iniciar sesión para guardar datos.');
    }
  });

});

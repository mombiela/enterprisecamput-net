import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signOut, onAuthStateChanged, 
		 updateProfile, deleteUser, sendPasswordResetEmail, sendEmailVerification, updatePassword } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

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

// Inicializa los servicios que vas a usar
const auth = getAuth(app);
const db = getFirestore(app);

function onChangeAuth(callback) 
{
    onAuthStateChanged(auth, callback);
}

async function guardarDatos(contenido) 
{
    const user = auth.currentUser;
    if (user)	return setDoc(doc(db, 'usuarios', user.uid), { contenido: contenido });
    else 		throw new Error('No hay usuario autenticado.');
}

async function cargarDatos() 
{
    const user = auth.currentUser;
    if (user) 	return getDoc(doc(db, 'usuarios', user.uid));
    else 		throw new Error('No hay usuario autenticado.');
}

function cerrarSesion() 
{
    return signOut(auth);
}

function iniciarSesion(email, password) 
{
    return signInWithEmailAndPassword(auth, email, password);
}

function iniciarSesionAnonimamente() 
{
    return signInAnonymously(auth);
}

async function registrarUsuario(email, password, nombre) 
{
    try 
    {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (nombre) await updateProfile(user, { displayName: nombre });
        return user;
    } 
    catch (error) 
    {
        throw error;
    }
}

// Método para eliminar los datos del usuario en Firestore sin eliminar al usuario
async function eliminarDatos() 
{
    const user = auth.currentUser;
    if (user) 
    {
        try 
        {
            await deleteDoc(doc(db, 'usuarios', user.uid));
            return { message: 'Datos eliminados correctamente de Firestore.' };
        }
        catch (error) 
        {
            throw error;
        }
    } 
    else 
    {
        throw new Error('No hay usuario autenticado.');
    }
}

// Método para eliminar el usuario de Firebase Authentication y Firestore
async function eliminarUsuario() 
{
    const user = auth.currentUser;
    if (user) 
    {
        try 
        {
            // Elimina los datos del usuario de Firestore
            await deleteDoc(doc(db, 'usuarios', user.uid));
            
            // Elimina al usuario de Firebase Authentication
            await deleteUser(user);

            return { message: 'Usuario eliminado correctamente.' };
        }
        catch (error) 
        {
            throw error;
        }
    } 
    else 
    {
        throw new Error('No hay usuario autenticado.');
    }
}

async function actualizarPerfil(datosPerfil) {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateProfile(user, datosPerfil);
            return { message: 'Perfil actualizado correctamente.' };
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('No hay usuario autenticado.');
    }
}
//FirebaseService.actualizarPerfil({ displayName: 'Nuevo Nombre', photoURL: 'url_de_foto' });

async function recuperarContrasena(email, lang) {
    try {
		if (!lang) lang = "ca";
		auth.languageCode = lang;
		
        await sendPasswordResetEmail(auth, email);
        return { message: 'Correo de recuperación enviado.' };
    } catch (error) {
        throw error;
    }
}
//FirebaseService.recuperarContrasena('usuario@example.com');


async function enviarVerificacionEmail(lang) {
    const user = auth.currentUser;
    if (user) {
        try {
			if (!lang) lang = "ca";
			auth.languageCode = lang;
			
            await sendEmailVerification(user);
            return { message: 'Correo de verificación enviado.' };
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('No hay usuario autenticado.');
    }
}
//FirebaseService.enviarVerificacionEmail();

function esEmailVerificado() {
    const user = auth.currentUser;
    if (user) {
        return user.emailVerified;
    } else {
        throw new Error('No hay usuario autenticado.');
    }
}
//const emailVerificado = FirebaseService.esEmailVerificado();
//console.log('Email verificado:', emailVerificado);

function obtenerPerfilUsuario() {
    const user = auth.currentUser;
    if (user) {
        return {
            uid: user.uid,
            nombre: user.displayName,
            email: user.email,
            emailVerificado: user.emailVerified,
            fotoPerfil: user.photoURL
        };
    } else {
        throw new Error('No hay usuario autenticado.');
    }
}
//const perfil = FirebaseService.obtenerPerfilUsuario();
//console.log(perfil);

async function cerrarTodasLasSesiones(password) {
    const user = auth.currentUser;
    if (user) {
        try {
            await updatePassword(user, password);
            return { message: 'Sesiones cerradas correctamente.' };
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('No hay usuario autenticado.');
    }
}

// Exporta el servicio Firebase
export const FirebaseService = {};

FirebaseService.iniciarSesion = iniciarSesion;
FirebaseService.iniciarSesionAnonimamente = iniciarSesionAnonimamente;
FirebaseService.cerrarSesion = cerrarSesion;
FirebaseService.guardarDatos = guardarDatos;
FirebaseService.cargarDatos = cargarDatos;
FirebaseService.onChangeAuth = onChangeAuth;
FirebaseService.registrarUsuario = registrarUsuario;
FirebaseService.eliminarDatos = eliminarDatos;
FirebaseService.eliminarUsuario = eliminarUsuario;
FirebaseService.actualizarPerfil = actualizarPerfil;
FirebaseService.recuperarContrasena = recuperarContrasena;
FirebaseService.enviarVerificacionEmail = enviarVerificacionEmail;
FirebaseService.esEmailVerificado = esEmailVerificado;
FirebaseService.obtenerPerfilUsuario = obtenerPerfilUsuario;
FirebaseService.cerrarTodasLasSesiones = cerrarTodasLasSesiones;


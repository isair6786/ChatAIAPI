import { Alert } from "react-native";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithCredential,
    signOut,
    GoogleAuthProvider,
    OAuthProvider,
} from "firebase/auth";
import { CreateDataUser } from "../database";
import { createObjTokenProvider } from "../../Functions/Functions";
import { GuardarToken } from "../ApiProviders";


export async function LoginEmailPassword(user, password) {
    var UserLogin = "";
    UserLogin = await signInWithEmailAndPassword(FIREBASE_AUTH, user, password);
    return UserLogin;
}
export async function SignInEmailPassword(user, password) {
    var UserLogin = "";
    UserLogin = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        user,
        password
    );
    return UserLogin;
}
export async function LoginWithCredential(UserCredential, ProviderId, GoogleAccess = {}) {
    var UserLogin = "";
    var credential = "";
    var SignMethod = "";

    if (ProviderId === 'microsoft.com') {
        SignMethod = 'microsoft'
        var provider = new OAuthProvider('microsoft.com')
        credential = OAuthProvider.credentialFromResult(UserCredential)
    } else {
        SignMethod = 'google'
        credential = GoogleAuthProvider.credential(UserCredential.idToken, UserCredential.accessToken)
    }
    UserLogin = await signInWithCredential(
        FIREBASE_AUTH,
        credential
    );
    //console.log("credencial",GoogleAccess)
    /*const token = createObjTokenProvider(
        ProviderId == "google.com" ? GoogleAccess.token._tokenResponse : UserCredential,
        ProviderId)*/
    //CreateDataUser(FIREBASE_AUTH.currentUser, SignMethod)
    return UserLogin;
}
export function handleFirebaseError(error) {
    // Mostrar alertas basadas en el código de error de Firebase
    switch (error.code) {
        case "auth/invalid-credential":
            Alert.alert(
                "Error",
                "Las credenciales proporcionadas no son válidas. Por favor, verifica tu correo y contraseña."
            );
            break;
        case "auth/user-not-found":
            Alert.alert(
                "Error",
                "No se encontró un usuario con ese correo. Por favor, regístrate primero."
            );
            break;
        case "auth/wrong-password":
            Alert.alert(
                "Error",
                "La contraseña ingresada es incorrecta. Inténtalo de nuevo."
            );
            break;
        case "auth/too-many-requests":
            Alert.alert(
                "Error",
                "Demasiados intentos fallidos. Por favor, inténtalo más tarde."
            );
            break;
        case "auth/email-already-in-use":
            Alert.alert(
                "Error",
                "Este correo ya esta siendo usado , intente con uno diferente"
            );
            break;

        default:
            Alert.alert(
                "Error",
                "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."
            );
            break;
    }
}
export async function logOutUser() {
    try {
        await signOut(FIREBASE_AUTH);
        // Puedes hacer algo aquí después de cerrar sesión, si es necesario
    } catch (error) {
        console.error("Error al cerrar sesión: ", error);
    }
}

export async function AddAccountCalendar(UserCredential, content) {
    var isMicrosoft = UserCredential.provider_id == "google.com" ? false : true;
    var SignMethod = isMicrosoft ? "microsoft" : "google";
    const token = createObjTokenProvider(UserCredential,
        UserCredential.provider_id)
    const errorCrearCuenta = await CreateDataUser(token, SignMethod, true)
    //console.log(token)
    if (!errorCrearCuenta) {
        GuardarToken(token)
    }
}
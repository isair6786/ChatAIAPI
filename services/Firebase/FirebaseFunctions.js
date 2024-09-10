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
export async function LoginWithCredential(UserCredential, ProviderId) {
    var UserLogin = "";
    var credential = "";
    if (ProviderId === 'microsoft.com') {
        var provider = new OAuthProvider('microsoft.com')
        credential = OAuthProvider.credentialFromResult(UserCredential)
    } else {
        credential = GoogleAuthProvider.credential(UserCredential.idToken, UserCredential.accessToken)
    }
    UserLogin = await signInWithCredential(
        FIREBASE_AUTH,
        credential
    );
    console.log(UserLogin)
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
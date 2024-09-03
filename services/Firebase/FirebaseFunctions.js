import { Alert, Platform, TouchableOpacity, Image } from "react-native";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
//Para inicio de sesion con google
import * as Google from "expo-auth-session/providers/google";
import { ANDROID_GOOGLE_ID } from "@env";
import google from "../../assets/images/google.png";
import * as WebBrowser from "expo-web-browser";
//import { makeRedirectUri } from "expo-auth-session";


WebBrowser.maybeCompleteAuthSession();
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
    // Agrega más casos según los códigos de error de Firebase que quieras manejar
    default:
      Alert.alert(
        "Error",
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."
      );
      break;
  }
}
WebBrowser.maybeCompleteAuthSession(); 
export async function logOutUser() {
  try {
    await signOut(FIREBASE_AUTH);
    // Puedes hacer algo aquí después de cerrar sesión, si es necesario
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
  }
}

export function GoogleLoginButton() {
    const config = {
        androidClientId: '584122301418-j63fkarf1te13kqd5qdq5quac0aspdhd.apps.googleusercontent.com',
        scopes: ["profile", "email", "openid"],
    };
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(config,{ native: 'com.something.somethingelse://' })
  const handleLogin = async () => {
    try {
      console.log(config.androidClientId)
      await promptAsync();
      console.log("Respuest",response)
    } catch (error) {
      console.error('Error durante la autenticación', error);
    } 
  };
  return (
    <TouchableOpacity
      onPress={handleLogin}
      className="flex-row items-center justify-center p-3 rounded-2xl"
    >
      <Image source={google} style={{ width: 50, height: 50 }} />
    </TouchableOpacity>
  );
}

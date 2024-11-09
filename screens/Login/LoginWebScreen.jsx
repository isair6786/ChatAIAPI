import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginWithCredential } from '../../services/Firebase/FirebaseFunctions';
import { OAuthProvider}  from 'firebase/auth';
import { URI_LOGIN } from "@env"
export default function LoginWeb({ navigation }) {
 const OnHandleMessage=async (message)=>{
   if(message.nativeEvent.data){
        var content = JSON.parse(message.nativeEvent.data)
        await LoginWithCredential(content.mensaje,content.mensaje.providerId?content.mensaje.providerId:'microsoft.com',content)
    }
    
 }
  const INJECTED_JAVASCRIPT = `
  window.ValidToken = (mensaje = null, token = null) => {
  const data = {};

  // Solo agregamos propiedades al objeto si tienen un valor no nulo
  if (mensaje !== null) {
    data.mensaje = mensaje;
  }
  if (token !== null) {
    data.token = token;
  }

  // Enviamos solo si hay algo en el objeto 'data'
  if (Object.keys(data).length > 0) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }
};
`;
  return (
    <WebView
      style={styles.container}
      source={{ uri: URI_LOGIN }}
      javaScriptEnabled={true}
      //incognito={true}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      userAgent={Platform.OS === 'android' ? 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.127 Mobile Safari/537.36' : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'}
      onMessage={message => OnHandleMessage(message)}
      
     />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

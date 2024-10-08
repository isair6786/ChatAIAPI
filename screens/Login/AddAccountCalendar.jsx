import React, { useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AddAccountCalendar } from '../../services/Firebase/FirebaseFunctions';
import { OAuthProvider}  from 'firebase/auth';
import { URI_LOGIN } from "@env"

export default function AddAccountWeb({ navigation }) {

 const OnHandleMessage=async (message)=>{
   if(message.nativeEvent.data){
        var content = JSON.parse(message.nativeEvent.data)
        console.log(content.mensaje)
        await AddAccountCalendar(content.mensaje)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Chat' }],
      });  
    }
    
 }
  const INJECTED_JAVASCRIPT = `
  window.ValidToken = (mensaje) => {
    window.ReactNativeWebView.postMessage(JSON.stringify({ mensaje }));
  };
  window.IsAddAccount = true;
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

import { Text, TextInput, View,TouchableOpacity,ActivityIndicator,Image, Linking } from 'react-native'
import { useState,useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated,{ FadeInUp } from 'react-native-reanimated';
import {LoginEmailPassword,handleFirebaseError} from '../../services/Firebase/FirebaseFunctions';
import { ValidateEmail } from '../../Functions/FormFunctions';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../services/Firebase/FirebaseConfig';
import microsoft from '../../assets/images/microsoft.png'
import google from '../../assets/images/google.png'
import error from '../../assets/adaptive-icon2.png';



async function LoginFirebase(navigation,user,password) {

    try {
        await LoginEmailPassword(user,password);
        navigation.navigate('SuccessScreen'); 
        
    } catch (error) {
        handleFirebaseError(error);
    }
    //navigation.navigate('Chat')
}

export default function LoginScreen ({navigation}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      // Establecer el estado de autenticación
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
        //console.log(currentUser)
        if (currentUser) {
            // El usuario ha iniciado sesión, redirigir a la pantalla de chat
            navigation.reset({
                index: 0,
                routes: [{ name: 'Chat' }],
            });
        } else {
          // El usuario no ha iniciado sesión
          setUser(null);
        }

        setLoading(false); // Cambiar el estado de carga una vez que el estado de autenticación es conocido
      });
  
      // Limpiar el observador cuando el componente se desmonte
      return () => unsubscribe();
    }, []);
  
    //states
    const [form, setForm] = useState({
        email:{
            text:"",
            messageError:""
        },
        password:"",
        isError:true,
    });

    //handles
    const onHandleSetEmail = (input)=>{
        const error=ValidateEmail(input);
        //console.log(form)
        setForm((prevForm)=>({
            ...prevForm,
            email:{
                text:input,
                messageError:input!==""?error:""
            },
            isError:error!==""?true:false
        }));
    }
    const onHandleSetPassword = (input)=>{
        //console.log(form)
        setForm((prevForm)=>({
            ...prevForm,
            password:input
        }));
    }
    const IsValidForm = ()=>{
       // console.log(form.password!==''&&form.email.text!==''&&form.isError!==true)
       return (form.password!==''&&form.email.text!==''&&form.isError!==true);
    }
    const handlePress = async () => {
        navigation.navigate('LoginWeb'); 
    };
      
    
    if (loading) {
        // Mostrar un indicador de carga mientras verificamos el estado de autenticación
        return (
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Cargando...</Text>
          </View>
        );
    }

    return (
 
      <View className="bg-white h-full w-full  items-center">
        <StatusBar style='light'></StatusBar>
        <Animated.Image entering={FadeInUp.duration(1000)} className="h-[250] w-full absolute" source={require('../../assets/images/waves.png')} />
       {/* Formulario de login*/}

        <View className="h-full w-full flex justify-center">
            <View className='flex-row w-full justify-center pt-[180] pb-[10]'>
                {/*<Animated.Text entering={FadeInUp.delay(500).duration(1000)}  className='text-black font-bold tracking-wider text-5xl'>
                    <Image style={{ width: 80, height: 60 }} source={error} />
                </Animated.Text>*/}
                 <Animated.Image entering={FadeInUp.delay(500).duration(1000)}  className="h-[150] w-[150]" source={error} />
     
            </View>
            <View className='flex items-left mx-4 space-y-1 '>
                {/*Inputs*/}
                
                <Animated.View  entering={FadeInUp.delay(600).duration(1000)}  
                className={
                    form.email.messageError !== "" 
                        ? 'bg-black/5 p-3 rounded-2xl mt-3 w-full border-2 border-red-300' // Si hay un mensaje de error, borde rojo
                        : form.email.text !== "" 
                            ? 'bg-black/5 p-3 rounded-2xl mt-3 w-full border-2 border-green-300' // Si no hay mensaje de error y el texto no está vacío, borde verde
                            : 'bg-black/5 p-3 rounded-2xl mt-3 w-full' // Si no hay mensaje de error y el texto está vacío, borde sin color
                }
                
                >
                    <TextInput  
                    placeholder='schedzy@gmail.com' 
                    onChangeText={(input)=>onHandleSetEmail(input)}
                    />
                </Animated.View>
                <Animated.Text entering={FadeInUp.delay(700).duration(1000)} 
                 className='text-red-300 font-bold mb-1 inset-x-0'>
                        {form.email.messageError!==""?form.email.messageError:"" }
                </Animated.Text>
                <Animated.View  entering={FadeInUp.delay(700).duration(1000)} className='bg-black/5 p-3 rounded-2xl w-full mb-5'>
                    <TextInput 
                    placeholder='Contraseña' 
                    onChangeText={(input)=>
                        onHandleSetPassword(input)} 
                    secureTextEntry/>
                </Animated.View>
                {/*Boton*/}
                <Animated.View  entering={FadeInUp.delay(800).duration(1000)} className='w-full '>
                    <TouchableOpacity 

                     disabled={!IsValidForm()}
                     className={IsValidForm()?'w-full  bg-[#041b33] p-5 rounded-2xl mb-3':'w-full text-white bg-[#041b33]/[.06] p-5 rounded-2xl mb-3'}
                     onPress={() => 
                        LoginFirebase(navigation,form.email.text,form.password)
                            //navigation.navigate('Chat')
                        }>
                        <Text className={IsValidForm()?'text-white font-bold text-center ':'text-gray font-bold text-center '}>
                                            Ingresar
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View  entering={FadeInUp.delay(800).duration(1000)} className='flex-row justify-center'>
                    <Text className="font-bold"> No tienes cuenta? </Text>
                    <TouchableOpacity
                     
                     onPress={() => navigation.navigate('SignUp')}>
                        <Text className='text-[#08c0b0] font-bold text-center'>
                                            Registrate acá
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(1000).duration(1000)} className='p-5'>
                <View  className='items-center'>
                    <View className="flex-row items-center justify-center my-4">
                        <View className="flex-1 border-t border-gray-300" />
                        <Text className="mx-3 text-gray-500 font-semibold">O Ingresa con</Text>
                        <View className="flex-1 border-t border-gray-300" />
                    </View>
                    <View className='flex-row justify-center space-x-4'>
                        <TouchableOpacity
                        onPress={() => handlePress()}
                        className='flex-row items-center justify-center p-3 rounded-2xl'
                        >
                            <Image source={microsoft} style={{ width: 40, height: 40,marginRight:20}} />
                            <Image source={google} style={{ width: 50, height: 50 }} />
                        </TouchableOpacity>
                       
                    </View>
                </View>
            </Animated.View>
            </View>
        </View>
      
      </View>

    );
}



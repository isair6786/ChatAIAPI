import { Image, Text, TextInput, View,TouchableOpacity,Button } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import Animated,{ FadeIn,FadeInUp,FadeOut } from 'react-native-reanimated';

export default function SignUpScreen ({navigation}) {
    return (
 
      <View className="bg-white h-full w-full  items-center">
        <StatusBar style='light'></StatusBar>
        <Animated.Image entering={FadeInUp.duration(1000)} className="h-[120] w-full absolute" source={require('../../assets/images/waves.png')} />
        
       {/*Formulario de login*/}

        <View className="h-full w-full flex justify-center">
            <View className='flex-row w-full justify-center pb-[50]'>
                <Animated.Text entering={FadeInUp.delay(500).duration(1000)}  className='text-black font-bold tracking-wider text-5xl'>
                    Registrate
                </Animated.Text>
            </View>
            <View className='flex items-center mx-4 space-y-5 '>
                {/*Inputs*/}
                <Animated.View  entering={FadeInUp.delay(600).duration(1000)}  className='bg-black/5 p-3 rounded-2xl w-full'>
                    <TextInput  placeholder='jiriko_molina@gmail.com'/>
                </Animated.View>
                <Animated.View  entering={FadeInUp.delay(700).duration(1000)} className='bg-black/5 p-3 rounded-2xl w-full'>
                    <TextInput placeholder='Contraseña' secureTextEntry/>
                </Animated.View>
                <Animated.View  entering={FadeInUp.delay(800).duration(1000)} className='bg-black/5 p-3 rounded-2xl w-full'>
                    <TextInput placeholder='Repite la contraseña ' secureTextEntry/>
                </Animated.View>
                {/*Boton*/}
                <Animated.View  entering={FadeInUp.delay(900).duration(1000)} className='w-full'>
                    <TouchableOpacity 
                     className='w-full bg-violet-200 p-5 rounded-2xl mb-3'>
                        <Text className='text-violet-800 font-bold text-center'>
                                            Crear cuenta
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View  entering={FadeInUp.delay(800).duration(1000)} className='flex-row justify-center'>
                    <Text> Ya tienes cuenta? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}>
                        <Text className='text-black font-bold text-center'>
                                            Ingresa acá
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
      </View>

    );
}
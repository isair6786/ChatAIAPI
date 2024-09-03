import { Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { ValidateEmail, ValidatePassword } from '../../Functions/FormFunctions';
import { useState } from 'react';
import { SignInEmailPassword, handleFirebaseError } from '../../services/Firebase/FirebaseFunctions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import google from '../../assets/images/google.png'
import microsoft from '../../assets/images/microsoft.png'

export default function SignUpScreen({ navigation }) {
    const [form, setForm] = useState({
        email: {
            text: "",
            messageError: ""
        },
        password: {
            text: "",
            messageError: ""
        },
        validatepassword: {
            text: "",
        },
        isError: true,
    });

    // Handles
    const onHandleSetEmail = (input) => {
        const error = ValidateEmail(input);
        setForm((prevForm) => ({
            ...prevForm,
            email: {
                text: input,
                messageError: input !== "" ? error : ""
            },
        }));
    }
    const onHandleSetPassword = (input) => {
        const error = ValidatePassword(input)
        setForm((prevForm) => ({
            ...prevForm,
            password: {
                text: input,
                messageError: form.validatepassword !== input ? "Las contraseñas no coinciden" : error
            },
            isError: error
        }));
    }
    const onHandleValidatePassword = (input) => {
        const error = ValidatePassword(input)
        setForm((prevForm) => ({
            ...prevForm,
            password: {
                text: form.password.text,
                messageError: form.password.text !== input ? "Las contraseñas no coinciden" : error
            },
            validatepassword: input,
            isError: form.password.text !== input
        }));
    }
    const IsValidForm = () => {
        return (form.password.text !== '' && form.email.text !== '' && form.isError !== true);
    }
    const onHandleSignIn = async (user, password) => {
        try {
            await SignInEmailPassword(user, password);
            navigation.navigate('SuccessScreen');
        } catch (error) {
            handleFirebaseError(error);
        }
    }

    return (
        <View className="bg-white w-full items-center h-full">
            <StatusBar style='dark' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 w-full justify-center">
                        <View className='flex-row w-full justify-center pb-[50]'>
                            <Animated.Text entering={FadeInUp.delay(500).duration(1000)} className='text-black font-bold tracking-wider text-5xl'>
                                Regístrate
                            </Animated.Text>
                        </View>
                        <View className='flex items-left mx-4 space-y-1'>
                            {/* Inputs */}
                            <Animated.View entering={FadeInUp.delay(600).duration(1000)}
                                className={
                                    form.email.messageError !== ""
                                        ? 'bg-black/5 p-3 rounded-2xl mt-1 w-full border-2 border-red-300'
                                        : form.email.text !== ""
                                            ? 'bg-black/5 p-3 rounded-2xl mt-1 w-full border-2 border-green-300'
                                            : 'bg-black/5 p-3 rounded-2xl mt-1 w-full'
                                }
                            >
                                <TextInput
                                    placeholder='jiriko_molina@gmail.com'
                                    onChangeText={(input) => onHandleSetEmail(input)}
                                />
                            </Animated.View>
                            <Animated.Text entering={FadeInUp.delay(700).duration(1000)}
                                className='text-red-400 font-bold my-1'>
                                {form.email.messageError !== "" ? form.email.messageError : ""}
                            </Animated.Text>
                            <Animated.View entering={FadeInUp.delay(700).duration(1000)}
                                className={
                                    form.password.messageError !== ""
                                        ? 'bg-black/5 p-3 rounded-2xl w-full my-5 border-2 border-red-300'
                                        : form.password.text !== "" && !form.isError
                                            ? 'bg-black/5 p-3 rounded-2xl my-5 w-full border-2 border-green-300'
                                            : 'bg-black/5 p-3 rounded-2xl my-5 w-full'
                                }>
                                <TextInput
                                    placeholder='Contraseña'
                                    onChangeText={(input) =>
                                        onHandleSetPassword(input)}
                                    secureTextEntry />
                            </Animated.View>
                            <Animated.View entering={FadeInUp.delay(700).duration(1000)}
                                className={
                                    form.password.messageError !== ""
                                        ? 'bg-black/5 p-3 rounded-2xl w-full mt-5 border-2 border-red-300'
                                        : form.password.text !== "" && !form.isError
                                            ? 'bg-black/5 p-3 rounded-2xl mt-5 w-full border-2 border-green-300'
                                            : 'bg-black/5 p-3 rounded-2xl mt-5 w-full'
                                }
                            >
                                <TextInput
                                    placeholder='Repite la contraseña'
                                    onChangeText={(input) =>
                                        onHandleValidatePassword(input)}
                                    secureTextEntry />
                            </Animated.View>
                            <Animated.Text entering={FadeInUp.delay(700).duration(1000)}
                                className='text-red-400 font-bold mb-5'>
                                {form.password.messageError !== "" ? form.password.messageError : ""}
                            </Animated.Text>
                            {/* Botón */}
                            <Animated.View entering={FadeInUp.delay(900).duration(1000)} className='w-full'>
                                <TouchableOpacity
                                    disabled={!IsValidForm()}
                                    className={
                                        IsValidForm() ? 'w-full bg-violet-300 p-5 rounded-2xl mb-3'
                                            : 'w-full bg-violet-100 p-5 rounded-2xl mb-3'
                                    }
                                    onPress={() =>
                                        onHandleSignIn(form.email.text, form.password.text)
                                    }
                                >
                                    <Text
                                        className={IsValidForm() ? 'text-violet-900 font-bold text-center'
                                            : 'text-violet-300 font-bold text-center'
                                        }>
                                        Crear cuenta
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View entering={FadeInUp.delay(800).duration(1000)} className='flex-row justify-center'>
                                <Text>Ya tienes cuenta? </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Login')}>
                                    <Text className='text-violet-600 font-bold text-center'>
                                        Ingresa acá
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {/* Mensaje y botones de inicio de sesión con Google y Microsoft */}
            <Animated.View entering={FadeInUp.delay(1000).duration(1000)} className='p-5'>
                <View  className='items-center'>
                    <View className="flex-row items-center justify-center my-4">
                        <View className="flex-1 border-t border-gray-300" />
                        <Text className="mx-3 text-gray-500 font-semibold">O regístrate con</Text>
                        <View className="flex-1 border-t border-gray-300" />
                    </View>
                    <View className='flex-row justify-center space-x-4'>
                        <TouchableOpacity className='flex-row items-center justify-center p-3 rounded-2xl'>
                            <Image source={google} style={{ width: 50, height: 50 }} />
                            
                        </TouchableOpacity>
                        <TouchableOpacity className='flex-row items-center justify-center p-3 rounded-2xl'>
                            <Image source={microsoft} style={{ width: 40, height: 40 }} />
                            
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

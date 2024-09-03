import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Redirigir a la pestaña de chat después de 5 segundos
    const timer = setTimeout(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Chat' }],
        });
    }, 5000);

    // Limpiar el timer cuando el componente se desmonte
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="mb-4">
        <Image
          source={require('../../assets/images/success-icon.png')} // Reemplaza con la ruta de tu ícono
          className="w-16 h-16"
        />
      </View>
      <Text className="text-xl font-bold text-green-500">
        ¡Inicio de sesión exitoso!
      </Text>
      <Text className="text-lg text-gray-600">
        Estás siendo redirigido a la aplicación. Por favor, espera un momento.
      </Text>
      <ActivityIndicator size="large" color="#4caf50" className="mt-4" />
    </View>
  );
};

export default SuccessScreen;

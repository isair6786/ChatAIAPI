import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";

export function DefaultToggle({ color }) {
  const [isOn, setIsOn] = useState(false);

  return (
    <View className="flex-row items-center m-1.5">
      <Pressable
        onPress={() => setIsOn(!isOn)}
        className={`w-10 h-5 flex items-left rounded-full`}
        style={isOn ? { backgroundColor: color.light } : { backgroundColor: '#dadada' }}
      >
        <View
          className={`w-5 h-5 rounded-full shadow-md transform ${
            isOn ? "translate-x-5" : "translate-x-0"
          }`}
          style={isOn ? { backgroundColor: color.dark } : { backgroundColor: '#ffffff' }}
        />
      </Pressable>
      <Text className="ml-4 text-lg">{isOn ? "Encendido" : "Apagado"}</Text>
    </View>
  );
}

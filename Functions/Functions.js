import Colors from "../Constants/Colors";

export function NameSplit(name) {
    const nombre = name.split(' ')
    const nameDisplay = nombre.length > 2 ? nombre[0] + ' ' + nombre[2] : name
    return nameDisplay
}

export function getRandomLightColor() {
    // Obtener todas las claves de colores
    const colorKeys = Object.keys(Colors);

    // Filtrar solo las variantes "light"
    const lightColors = colorKeys.map(key => Colors[key].light);

    // Elegir un color "light" aleatorio
    const randomLightColor = lightColors[Math.floor(Math.random() * lightColors.length)];
    //console.log(randomLightColor)
    return randomLightColor;
}
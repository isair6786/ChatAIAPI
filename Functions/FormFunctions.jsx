export function ValidateEmail(text){
    var error=""
        //console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            error ='Formato de email es invalido';
        }
    return error
}
export function ValidatePassword(text) {
    let error = [];
    // Reglas de validación
    const requirements = {
        digit: /[0-9]/,
        lowercase: /[a-z]/,
        uppercase: /[A-Z]/,
        noSpaces: /^\S*$/,
        length: /^.{8,16}$/
    };

    // Verificar cada requisito y agregar mensaje de error si no se cumple
    if (!requirements.digit.test(text)) {
        error.push('debe contener al menos un dígito del 1 al 9.');
    }
    if (!requirements.lowercase.test(text)) {
        error.push('debe contener al menos una letra minúscula.');
    }
    if (!requirements.uppercase.test(text)) {
        error.push('debe contener al menos una letra mayúscula.');
    }
    if (!requirements.noSpaces.test(text)) {
        error.push('no debe contener espacios.');
    }
    if (!requirements.length.test(text)) {
        error.push('debe tener entre 8 y 16 caracteres.');
    }
    if (error.length > 0) {
        error = ['La contraseña'].concat(error);
    } 
    // Devolver todos los mensajes de error concatenados
    return error.join(' ');
}

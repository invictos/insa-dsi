export function error(text: string){
    return "❌ " + text;
}

export function infoError(text: string){
    console.error(error(text));
}

export function info(text: string){
    return "🟡 " + text
}

export function infoLog(text: string){
    console.log(info(text));
}
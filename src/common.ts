export function error(text: string) {
    return "❌ " + text;
}

export function infoError(text: string) {
    console.error(error(text));
}

export function info(text: string) {
    return "🟡 " + text
}

export function infoLog(text: string) {
    console.log(info(text));
}

export function array_shuffle<T>(array: Array<T>) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
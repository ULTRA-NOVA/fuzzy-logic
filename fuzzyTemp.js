export const getFreezingMf = (x, a, b, c, d) => {
    if (x <= c) return 1;
    if (c <= x && x <= d) return (-0.05*x)+2.5;
    if (d <= x) return 0;
}

export const getHotMf = (x, a, b, c, d) => {
    if (x <= a) return 0;
    if (a <= x && x <= b) return (0.05*x)-3.5;
    if (b <= x) return 1;
}

export const getCoolMf = (x, a, b, c) => {
    if (x <= a || x >= c) return 0;
    if (x >= a && x <= b) return (0.05*x)-1.5;
    if (x >= b && x <= c) return (-0.05*x)+3.5;
}

export const getWarmMf = (x, a, b, c) => {
    if (x <= a || x >= c) return 0;
    if (x >= a && x <= b) return (0.05*x)-2.5;
    if (x >= b && x <= c) return (-0.05*x)+4.5;
}

export const getMf = (x, freeze, cool, warm, hot) => {
    const Fs = []
    
    let freezingmf = parseFloat(getFreezingMf(x, freeze[0], freeze[1], freeze[2], freeze[3])).toFixed(2);
    let coolmf = parseFloat(getCoolMf(x, cool[0], cool[1], cool[2])).toFixed(2);
    let warmmf = parseFloat(getWarmMf(x, warm[0], warm[1], warm[2])).toFixed(2);
    let hotmf = parseFloat(getHotMf(x, hot[0], hot[1], hot[2], hot[3])).toFixed(2);

    const labels = [];

    if (freezingmf > 0) {
        Fs.push(freezingmf) 
        labels.push("Freezing");
    }
    if (coolmf > 0) {
        Fs.push(coolmf) 
        labels.push("Cool");
    }
    if (warmmf > 0) {
        Fs.push(warmmf) 
        labels.push("Warm");
    }
    if (hotmf > 0) {
        Fs.push(hotmf) 
        labels.push("Hot");
    }
    return [Fs, labels];
}
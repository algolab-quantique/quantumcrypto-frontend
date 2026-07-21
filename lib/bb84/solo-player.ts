const basesValues = ['+', 'x'];

export const simulateBobExchange = (photons: number[]) => {
    const bases = photons.map(_ => basesValues[Math.floor(Math.random() * 2)]);
    const measurements = [...photons].map(
        (photon, index) => {
            const basis = bases[index];
            let newMeasurement = (Math.random() < 0.5) ? '0' : '1';
            if (photon == 1 && basis == '+')
                newMeasurement = '0';
            else if (photon == 2 && basis == '+')
                newMeasurement = '1';
            else if (photon == 3 && basis == 'x')
                newMeasurement = '0';
            else if (photon == 4 && basis == 'x')
                newMeasurement = '1';
            return newMeasurement;
        });
    return [bases, measurements];
};

export const getValidBits = (initialBits: string[], bobBases: string[],
                             aliceBases: string[]) => {
    const bits: string[] = [];
    initialBits.forEach((bit, index) => {
        if (bobBases[index] === aliceBases[index]) {
            bits.push(bit);
        }
    });
    return bits;
};

export const generateAliceBits = (photonNumber: number) => {
    const range = ['0', '1'];
    const bits: string[] = [];
    for (let i = 0; i < photonNumber; i++) {
        bits.push(range[Math.floor(Math.random() * 2)]);
    }
    return bits;
};

export const generateAliceBases = (photonNumber: number) => {
    const range = ['+', 'x'];
    const bases: string[] = [];
    for (let i = 0; i < photonNumber; i++) {
        bases.push(range[Math.floor(Math.random() * 2)]);
    }
    return bases;
};

export const generateAlicePhotons = (bits: string[], bases: string[]) => {
    const photons: number[] = [];
    bits.forEach((bit, index) => {
        if (bit === '0') {
            if (bases[index] === '+') {
                photons.push(1);
            } else {
                photons.push(3);
            }
        } else {
            if (bases[index] === '+') {
                photons.push(2);
            } else {
                photons.push(4);
            }
        }
    });
    return photons;
};

export const mimicEveIntercept = (photons: number[]): number[] => {
    const bases = ['+', 'x'];
    const eveBases = photons.map(
        _ => bases[Math.floor(Math.random() * 2)]);
    const measurements = photons.map((photon, index) => {
        let measurement = (Math.random() < 0.5) ? '0' : '1';
        const basis = eveBases[index];
        if (photon == 1 && basis == '+')
            measurement = '0';
        else if (photon == 2 && basis == '+')
            measurement = '1';
        else if (photon == 3 && basis == 'x')
            measurement = '0';
        else if (photon == 4 && basis == 'x')
            measurement = '1';
        return measurement;
    });
    return measurements.map((measurement, index) => {
        const basis = eveBases[index];
        if (measurement === '0' && basis === '+') return 1;
        if (measurement === '0' && basis === 'x') return 3;
        if (measurement === '1' && basis === '+') return 2;
        else return 4;
    });
};
import { DateTime } from "luxon";

// export const fechaActual = DateTime.now().setZone('America/Lima').toISO();

export const ahora = () => { 
    return DateTime.now().setZone('America/Lima').toISO();
}

export const inicioDia = () => { 
    return DateTime
        .now()
        .setZone('America/Lima')
        .startOf('day')
        .toISO();
}

export const finDia = () => { 
    return DateTime
        .now()
        .setZone('America/Lima')
        .endOf('day')
        .toISO();
}

export const fechaInicioFinDia = () => { 
    return [
        inicioDia(),
        finDia()
    ];
}

export const fechaHaceUnaSemana = () => { 
    return DateTime
        .now()
        .setZone('America/Lima')
        .startOf('day')
        .minus({day: 7})
        .toISO()
}

export const fechasHaceDias = (dia:number) => { 
    const inicio = DateTime
        .now()
        .setZone('America/Lima')
        .startOf('day')
        .minus({day: dia})
        .toISO();
    const fin = DateTime
        .now()
        .setZone('America/Lima')
        .endOf('day')
        .minus({day: dia})
        .toISO();

    return [ inicio, fin ]
}




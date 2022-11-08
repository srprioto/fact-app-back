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
    const inicio:string = inicioDia();
    const fin:string = finDia();
    return [
        inicio,
        fin
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

export const fechaNoHora = (fecha:any) => {
    const newFecha:any = DateTime
        .fromISO(fecha)
        .setZone('UTC')
        .setLocale('es')
        .toFormat('dd/LL/yyyy');
    return newFecha
}




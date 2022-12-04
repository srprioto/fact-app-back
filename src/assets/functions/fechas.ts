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

export const inicioMes = () => { 
    return DateTime
        .now()
        .setZone('America/Lima')
        .startOf('month')
        .toISO();
}

export const finMes = () => { 
    return DateTime
        .now()
        .setZone('America/Lima')
        .endOf('month')
        .toISO();
}

export const fechaInicioFinMes = () => { 
    const inicio:string = inicioMes();
    const fin:string = finMes();
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
        .setZone('America/Lima')
        .setLocale('es')
        .toFormat('dd/LL/yyyy');
    return newFecha
}

export const fechaDesdeJson = (fecha:string) => {
    const resto:any = fecha;
    return DateTime
        .fromObject(resto)
        .setZone('America/Lima')
        .setLocale('es')
        .toISO();
}



export const inicioFinFechaJson = (fecha:any) => { 
    const inidioDia = DateTime
        .fromObject(fecha)
        .startOf('day')
        .toISO();

    const finDia = DateTime
        .fromObject(fecha)
        .endOf('day')
        .toISO();

    return [
        inidioDia,
        finDia
    ];
}



import * as moment from 'moment'; moment.locale('es');

export const fechaInicioFinDia = () => {
    const fechaActual = moment().format('L');
    const inidioDia = moment(fechaActual, "DDMMYYYY");
    const finDia = inidioDia.clone().add(1, "day").subtract(1, 'second');
    return [
        new Date(inidioDia.toString()),
        new Date(finDia.toString())
    ];
}

export interface AnularComprobante{
    id:number;
    notaBaja:string;
    serie:string;
    usuarioId:number;
    tipo_venta:string;
    correlativo:string;
    afectarCaja:boolean;
}

export const estados_comprobante = {
    Error_envio: "Error_envio",
    Rechazado: "Rechazado",
    Error_anulacion: "Error_anulacion",
    Anulacion_procesada: "Anulacion procesada",
}
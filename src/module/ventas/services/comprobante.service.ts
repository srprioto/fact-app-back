import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment'; moment.locale('es');
import { enviarCorreo } from 'src/assets/functions/enviarCorreo';
import { Comprobante } from '../entities/comprobante.entity';
import { ComprobanteDetallesService } from './comprobante-detalles.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
// import { VentasService } from './ventas.service';
import { VentasProviderService } from './ventas-provider.service';
import { AnularComprobante } from '../dtos/comprobante.dto';
import { Caja } from 'src/module/locales/entities/caja.entity';
import { CorrelativoService } from './correlativo.service';
import { tipoVenta } from '../dtos/ventas.dto';

@Injectable()
export class ComprobanteService {

    private emitirComprb:string = process.env.EMITIR_COMP;
    private anularComprb:string = process.env.ANULAR_COMP;
    private verificacion:any = {
        documento: "20602956211",
        usuario: "RONALD99",
        contrasena: "Ronald99"
    };
    private empresa:any = {
        ruc: "20602956211",
        nombreComercial: "INVERSIONES PERKINS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA",
        razonSocial: "INVERSIONES PERKINS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA",
        direccion: "CAL. TRINITARIAS N. 501 URB. CENTRO HISTORICO CUSCO CUSCO-CUSCO-CUSCO",
        email: "epc26irvin@gmail.com", // actualizar
        telefono: "888888", // actualizar
        ubigeo_empresa: "080101",
        departamento: "CUSCO",
        provincia: "CUSCO",
        distrito: "CUSCO",
        urbalizacion: "-"
    };

    constructor(
        @InjectRepository(Comprobante) private comprobanteRepo:Repository<Comprobante>,
        @InjectRepository(Caja) private cajaRepo:Repository<Caja>,
        // @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        private comprobanteDetallesService:ComprobanteDetallesService,
        private ventasProviderService:VentasProviderService,
        private correlativoService:CorrelativoService,
    ){ }


    async paginateFilter(
        filtro:string = "_", 
        idLocal:string = "_", 
        inicio:string, 
        fin:string, 
        options: IPaginationOptions
    ): Promise<Pagination<Comprobante>> {

        const where:any = {};

        if (filtro != "_") {
            where.estado_sunat = filtro;
        }
        if (idLocal != "_") {
            where.locales = idLocal;
        }

        if (inicio !== "_" || fin !== "_" ) {
            where.created_at = Between(inicio, fin);
        }

        return paginate<Comprobante>(this.comprobanteRepo, options, {
            relations: ["locales", "ventas", "correlativos"],
            order: { id: "DESC" },
            where
        });

        // if (filtro != "_" || idLocal != "_") { // si where no tiene nada, añadir condicion aqui
        //     return paginate<Comprobante>(this.comprobanteRepo, options, {
        //         relations: ["locales", "ventas", "correlativos"],
        //         order: { id: "DESC" },
        //         where
        //     });
        // } else {
        //     return paginate<Comprobante>(this.comprobanteRepo, options, {
        //         relations: ["locales", "ventas", "correlativos"],
        //         order: { id: "DESC" }
        //     });
            
        // }
    }


    async searchData(value:string, idLocal:string){

        const where:any = [
            { id: Like(`%${value}%`) },
            { serie: Like(`%${value}%`) }
        ]

        if (idLocal != "_") {
            where.locales = idLocal;
        }

        const data = await this.comprobanteRepo.find({
            relations: ["locales", "ventas", "correlativos"],
            order: { id: "DESC" },
            where: where
        });

        return data;
    }


    async getOne(id:number) {
        const data:any = await this.comprobanteRepo.findOne(id,{
            relations: ["clientes", "locales", "comprobanteDetalles", "ventas", "correlativos"]
        });

        const resSunat = JSON.parse(data.respuesta_sunat)
        data.respuesta_sunat = resSunat;

        return{
            success: "Registro encontrado",
            data
        }
    }

    
    async enviarComprobanteSunat(payload:any, idLocal:number) {

        const comprobante:any = {};
        const ventaDetalles:Array<any> = [];

        const correlativo:any = await this.correlativoService.acumCorrelativo(payload.locales.id, payload.tipo_venta);

        // general
        comprobante.tipo_venta = payload.tipo_venta;
        comprobante.correlativo = correlativo.correlativo;
        comprobante.serie = correlativo.serie; // revisar
        comprobante.created_at = payload.created_at;
        comprobante.tipoMoneda = "PEN";
        comprobante.tipoOperacion = "10"; // gravada 10 / exonerada 20
        if (payload.tipo_venta === tipoVenta.factura) comprobante.tipoComprobante = "01";
        if (payload.tipo_venta === tipoVenta.boleta) comprobante.tipoComprobante = "03";
       
        // venta
        comprobante.subtotal = Number(payload.subtotal.toFixed(5));
        comprobante.igvGeneral = Number(payload.igvGeneral.toFixed(5));
        comprobante.total = Number(payload.total.toFixed(5));

        // cliente
        if (!!payload.clientes.numero_documento) {
            comprobante.cliente = payload.clientes;
            // payload.clientes.razonSocial = !!(payload.clientes.razonSocial) ? payload.clientes.razonSocial : payload.clientes.nombre;
            if (payload.tipo_venta === tipoVenta.boleta) {
                comprobante.cliente.nombre = payload.clientes.nombre ? payload.clientes.nombre : payload.clientes.razonSocial
            }
            if (payload.clientes.tipoDocumento === "RUC") comprobante.tipoDocumento = "6";
            if (payload.clientes.tipoDocumento === "DNI") comprobante.tipoDocumento = "1";
            // if (!!payload.clientes) comprobante.tipoDocumento = "00";
        } else {
            comprobante.cliente = payload.clientes;
            comprobante.tipoDocumento = "00";
            comprobante.cliente.numero_documento = "88888888";
            comprobante.cliente.nombre = "Cliente";
            comprobante.cliente.direccion = "-";
            
        }

        // venta detalles
        payload.ventaDetalles.forEach((e:any) => {
            const updateVentaDet:any = {};
            updateVentaDet.codigo = e.productos.id;
            updateVentaDet.nombre = e.productos.nombre;
            updateVentaDet.cantidad_venta = e.cantidad_venta;
            updateVentaDet.igv = Number(e.igv.toFixed(5));
            updateVentaDet.unidad_sin_igv = Number(e.precio_gravada.toFixed(5));
            updateVentaDet.unidad_con_igv = Number(e.precio_venta.toFixed(5));
            ventaDetalles.push(updateVentaDet);
        })

        // comprobante.accion = "nuevo_" + payload.serie;
        // const respuesta:any = await this.crearComprobante(comprobante);

        // comprobante.id = respuesta.id; // correlativo
        comprobante.verificacion = this.verificacion;
        comprobante.empresa = this.empresa;
        comprobante.ventaDetalles = ventaDetalles;

        let response:any;

        try {
            response = await axios.post(this.emitirComprb, comprobante);
            response = response.data;
        } catch (error) {
            console.log(error);
        }

        await this.registrarComprobante(comprobante, idLocal, response, payload.id, correlativo.id);

        return response;
    }


    async registrarComprobante(comprobante:any, idLocal:number, response_sunat:any, idVenta:number, idCorrelativo:number){

        comprobante.ventas = Number(idVenta);
        comprobante.clientes = comprobante.cliente.id !== 0 ? comprobante.cliente.id : null;
        comprobante.locales = idLocal;
        comprobante.estado_sunat = response_sunat.estado ? response_sunat.estado : "No";
        comprobante.respuesta_sunat = JSON.stringify(response_sunat); // JSON.parse(item) a json
        comprobante.fecha_emision = comprobante.created_at;
        comprobante.correlativos = idCorrelativo;

        delete comprobante.created_at;

        const newComprobante:any = this.comprobanteRepo.create(comprobante);
        const respuesta = await this.comprobanteRepo.save(newComprobante);
        
        comprobante.ventaDetalles.forEach(async (e:any) => {
            await this.comprobanteDetallesService.registrarComprobanteDetalles(respuesta.id, e);
        })

        return {
            success: "registro correcto"
        }
    }


    async reenviarComprobante(payload){

        let response:any;
        const data:any = await this.comprobanteRepo.findOne(payload.idComprobante, {
            relations: ["clientes", "locales", "comprobanteDetalles"]
        });

        data.verificacion = this.verificacion;
        data.empresa = this.empresa;
        data.ventaDetalles = data.comprobanteDetalles;
        if (data.clientes) {
            data.cliente = data.clientes;    
        } else {
            data.cliente = {};
            data.tipoDocumento = "00";
            data.cliente.numero_documento = "88888888";
            data.cliente.nombre = "Cliente";
            data.cliente.direccion = "-";
        }

        delete data.clientes;
        delete data.comprobanteDetalles;

        try {
            response = await axios.post(this.emitirComprb, data);
            response = response.data;
        } catch (error) {
            console.log(error);
        }

        const comprobante:any = this.comprobanteRepo.create(data);

        comprobante.estado_sunat = response.estado;
        comprobante.respuesta_sunat = JSON.stringify(response);
        delete comprobante.locales;

        await this.comprobanteRepo.save(comprobante);

        return response;
        // return data;
    }
    

    async anularFactura(comprobante:any, payload:any){
        
        let response:any = {};

        comprobante.verificacion = this.verificacion;
        comprobante.empresa = this.empresa;
        comprobante.notaBaja = payload.notaBaja;
        comprobante.fecha_baja = new Date();

        try {
            response = await axios.post(this.anularComprb, comprobante);
            response = response.data;
        } catch (error) {
            console.log(error);
        }

        response.notaBaja = payload.notaBaja;
        response.fecha_baja = comprobante.fecha_baja;
        comprobante.estado_sunat = response.estado;
        comprobante.respuesta_sunat = JSON.stringify(response);

        const anulado = this.comprobanteRepo.create(comprobante);
        await this.comprobanteRepo.save(anulado);

        return response;
        
    }


    async anularBoleta(comprobanteId:number, payload:any){

        let response:any = {};
        const comprobante:any = await this.comprobanteRepo.findOne(comprobanteId, { relations: ["clientes"] });

        // comprobante.serie = comprobante.serie + "-" + comprobante.correlativo;
        comprobante.serie = comprobante.serie;
        comprobante.verificacion = this.verificacion;
        comprobante.empresa = this.empresa;
        comprobante.notaBaja = payload.notaBaja;
        comprobante.fecha_baja = new Date();
        
        if (comprobante.clientes) {
            comprobante.cliente = comprobante.clientes;   
            // console.log("cliente existe");
        } else {
            comprobante.cliente = {};
            comprobante.tipoDocumento = "00";
            comprobante.cliente.numero_documento = "88888888";
            comprobante.cliente.nombre = "Cliente";
            comprobante.cliente.direccion = "-";
            // console.log("cliente NO existe");
        }
        
        delete comprobante.clientes;
        
        try {
            response = await axios.post(this.anularComprb, comprobante);
            response = response.data;
        } catch (error) {
            console.log(error);
        }

        response.notaBaja = payload.notaBaja;
        response.fecha_baja = comprobante.fecha_baja;
        comprobante.estado_sunat = response.estado;
        comprobante.respuesta_sunat = JSON.stringify(response);

        const anulado = this.comprobanteRepo.create(comprobante);
        await this.comprobanteRepo.save(anulado);

        return response;

    }


    async comprobanteEnviarCorreo(payload:any, email:string){

        // const nombreUsuario:string = "";
        const resumenVenta = "Resumen de venta";
        const fechaActual = moment().format('D MMMM YYYY, h:mm:ss a');
        const template = `
            <div class="email-factura">

                <div class="box-email" style="
                    width:660;
                    margin: 0 auto;
                    box-sizing: border-box;
                    padding: 30px;
                ">

                    <div class="box-head-mail">
                        <div class="box-head-mail-title">
                            <h2>¡Hola!</h2>
                            <h4>
                                Gracias por adquirir productos en ADDID SPORT. A continuación encontrarás un breve resumen de tu compra reciente.
                            </h4>
                        </div>
                        <div class="box-head-mail-general" style="
                            display: grid;
                            grid-template-columns: 1fr 1fr 1fr;
                            text-align: center;
                            width: 100%;
                        ">
                            <span>
                                <h5>Codigo de venta</h5>
                                <p>${payload.id + "-" + payload.codigo_venta}</p>
                            </span>
                            <span>
                            </span>
                            <span>
                                <h5>Fecha</h5>
                                <p>${fechaActual}</p>
                            </span>
                        </div>
                    </div>
            
                    <div class="box-body-mail">
                        <table class="box-body-mail-table" style="
                            width:100%;
                            text-align: left;
                        ">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio G.</th>
                                    <th>IGV</th>
                                    <th>Precio U.</th>
                                    <th>Cant.</th>
                                    <th>Precio V.</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${
                                    payload.ventaDetalles.map((e:any) => { 
                                        return (
                                            `
                                            <tr>
                                                <td>${e.productos.nombre}</td>
                                                <td>${e.precio_gravada}</td>
                                                <td>${e.igv}</td>
                                                <td>${e.precio_venta}</td>
                                                <td>${e.cantidad_venta}</td>
                                                <td>${e.precio_parcial}</td>
                                            </tr>
                                            `
                                        )
                                    })
                                }
                                
                            </tbody>
                        </table>
                    </div>
            
                    <div class="box-footer-mail">
                        <div class="box-footer-mail-box" style="
                            display: grid;
                            grid-template-columns: 1fr 1fr 1fr;
                            width: 100%;
                        ">
                            <span>
                                <h5>Subtotal</h5>
                                <p>${payload.subtotal}</p>
                            </span>
                            <span>
                                <h5>Descuento general</h5>
                                <p>${payload.descuento_total}</p>
                            </span>
                            <span>
                                <h5>Total</h5>
                                <p>${payload.total}</p>
                            </span>
                        </div>
                    </div>
                </div>   
            </div>
        `;

        await enviarCorreo(
            email,
            template,
            resumenVenta
        );

        return{
            success: "Email enviado correctamente",
            // data: payload
        }
    }
    

}

// clientes
// cliente.razonSocial = payload.clientes.razonSocial;
// cliente.nombreComercial = payload.clientes.nombreComercial;
// cliente.telefono = payload.clientes.telefono;
// cliente.numero_documento = payload.clientes.numero_documento;
// cliente.email = payload.clientes.email;
// cliente.direccion = payload.clientes.direccion;
// cliente.departamento = payload.clientes.departamento;
// cliente.provincia = payload.clientes.provincia;
// cliente.distrito = payload.clientes.distrito;


// {
//     "estado":"",
//     "ticket":"1659312935432",
//     "descripcion":"La Comunicacion de baja RA-20220730-00111, ha sido aceptada",
//     "nota":"",
//     "codErr":"",
//     "msgErr":"",
//     "notaBaja":"hjghg"
// }


// const verificacion:any = {};
// const empresa:any = {};

// // verificacion (actualizar desde configuracion)
// verificacion.documento = "20000000001";
// verificacion.usuario = "MODDATOS";
// verificacion.contrasena = "moddatos";
// // la empresa (actualizar desde configuracion)
// empresa.ruc = "20602956211";
// empresa.nombreComercial = "INVERSIONES PERKINS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA";
// empresa.razonSocial = "INVERSIONES PERKINS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA";
// empresa.direccion = "CAL. TRINITARIAS N. 501 URB. CENTRO HISTORICO CUSCO CUSCO-CUSCO-CUSCO";
// empresa.email = "ruc@ruc.com"; // actualizar
// empresa.telefono = "888888"; // actualizar
// empresa.ubigeo_empresa = "080101";
// empresa.departamento = "CUSCO";
// empresa.provincia = "CUSCO";
// empresa.distrito = "CUSCO";
// empresa.urbalizacion = "-";


// async anularComprobante(payload:AnularComprobante){

// // await this.comprobanteService.anularComprobante({ 
// //     id: comprobante.id,
// //     notaBaja: payload.notaBaja,
// //     serie: comprobante.serie,
// //     usuarioId: payload.usuarioId,
// //     tipo_venta: venta.tipo_venta,
// //     correlativo: comprobante.correlativo,
// //     afectarCaja: payload.afectarCaja
// // });

//     const comprobante:any = await this.comprobanteRepo.findOne(payload.id,{ relations: ["clientes", "ventas", "ventas.locales"] });
//     const correlativo:any = await this.correlativoService.getOneForLocal(comprobante.ventas.locales.id, comprobante.ventas.tipo_venta);
//     payload.tipo_venta = correlativo.descripcion; // requiere añadir correlativo a payload
//     payload.correlativo = comprobante.correlativo;

//     const venta:any = comprobante.ventas;

//     const caja:any = await this.cajaRepo.findOne({
//         relations: ["locales"],
//         where: { 
//             locales: { id: venta.locales.id,tipo_local: "tienda"},
//             estado_caja: true
//         }
//     });

//     const montoCaja:number = Number(caja.monto_apertura) + Number(caja.monto_efectivo) + Number(caja.otros_montos);

//     if (montoCaja < Number(venta.total)) {
//         // si caja no tiene cantidad adecuada
//         return true;
//     } else {
//         // aqui añadimos la anulacion de venta
//         if (comprobante.ventas.tipo_venta === tipoVenta.factura) {
//             // anular factura
//             const response:any = await this.anularFactura(payload, correlativo.serie);
//             if (response.estado === "Aceptado"){
//                 // anular venta
//                 await this.ventasProviderService.anulacionVenta(comprobante.ventas.id, payload.notaBaja, payload.usuarioId, payload.afectarCaja);
//             }
//         } else if (comprobante.ventas.tipo_venta === tipoVenta.boleta) {
//             // anular boleta
//             const response:any = await this.anularBoleta(payload, comprobante);
//             if (response.estado === "Aceptado") {
//                 // anular venta
//                 await this.ventasProviderService.anulacionVenta(comprobante.ventas.id, payload.notaBaja, payload.usuarioId, payload.afectarCaja);    
//             }
//         }
//         return false;
//     }

// }


// async crearComprobante(comprobante){
//     const newComprobante:any = this.comprobanteRepo.create(comprobante);
//     newComprobante.fecha_emision = comprobante.created_at;
//     newComprobante.estado_sunat = "-";
//     newComprobante.respuesta_sunat = "-";
//     return await this.comprobanteRepo.save(newComprobante);
// }


// async anularFactura(payload:any, serie:string){ // *****

//     let response:any;
//     // let estadoSun:boolean;
//     let comprobante:any = {};

//     payload.serie = serie;
//     payload.verificacion = this.verificacion;
//     payload.empresa = this.empresa;

//     try {
//         response = await axios.post(this.anularComprb, payload);
//         response = response.data;
//     } catch (error) {
//         console.log(error);
//     }

//     response.notaBaja = payload.notaBaja;
//     comprobante.id = payload.id;
//     comprobante.estado_sunat = response.estado;
//     comprobante.respuesta_sunat = JSON.stringify(response);
    
//     // console.log(comprobante);
//     // console.log("********");
//     // console.log(payload);
    
//     // // actualizar comprobante
//     await this.comprobanteRepo.save(comprobante);

//     return response;

// }


// async anularBoleta(payload:any, data:any){

//     const comprobante:any = {};
//     // let estadoSun:boolean;
//     let response:any;

//     payload.fecha_emision = data.fecha_emision;
//     payload.tipoComprobante  = data.tipoComprobante;
//     payload.tipoDocumento  = data.tipoDocumento;
//     payload.tipoComprobante  = data.tipoComprobante;

//     payload.subtotal = data.subtotal;
//     payload.igvGeneral = data.igvGeneral;
//     payload.total = data.total;

//     payload.verificacion = this.verificacion;
//     payload.empresa = this.empresa;
//     payload.cliente = data.clientes;

//     try {
//         response = await axios.post(this.anularComprb, payload);
//         response = response.data;
//     } catch (error) {
//         console.log(error);
//     }

//     // if (response.descripcion.includes("ha sido aceptada")) {
//     //     estadoSun = true;
//     // } else {
//     //     estadoSun = false;
//     // }

//     response.notaBaja = payload.notaBaja;
//     comprobante.id = payload.id;
//     // comprobante.estado_sunat = response.estado === "Aceptado" /* ||  estadoSun */ ? "Anulado" : response.estado; // revisar, igual que factura
//     comprobante.respuesta_sunat = JSON.stringify(response);
//     // comprobante.notaBaja = payload.notaBaja;

//     // actualizar comprobante
//     await this.comprobanteRepo.save(comprobante);

//     return response;

// }

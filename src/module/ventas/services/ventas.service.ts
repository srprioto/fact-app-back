import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, Not } from 'typeorm';
import * as moment from 'moment'; moment.locale('es');
// import moment from 'moment';

import { Ventas } from '../entities/ventas.entity';
// import { Usuarios } from 'src/module/usuarios/entities/usuarios.entity';
import { Clientes } from '../entities/clientes.entity';
import { tipoVenta, UpdateVentasDto } from '../dtos/ventas.dto';
import { VentaDetallesService } from './venta-detalles.service';
import { ClientesService } from './clientes.service';

import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { sumaArrayObj } from 'src/assets/functions/sumaArrayObj';
import { Caja } from 'src/module/locales/entities/caja.entity';
import { zeroFill } from 'src/assets/functions/fillCero';
import { FormasPagoService } from './formas-pago.service';
import { ComprobanteService } from './comprobante.service';
import { CajaService } from 'src/module/locales/services/caja.service';
import { VentasProviderService } from './ventas-provider.service';
// import { CorrelativoService } from './correlativo.service';
import { CreditoDetallesService } from './credito-detalles.service';
// import { setTimezone } from 'src/assets/functions/timezone';
// import { getManager } from "typeorm";

var xl = require('excel4node');

@Injectable()
export class VentasService {

    constructor(
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        @InjectRepository(Caja) private cajaRepo:Repository<Caja>,
        // @InjectRepository(Usuarios) private usuariosRepo:Repository<Usuarios>,
        @InjectRepository(Clientes) private clientesRepo:Repository<Clientes>,
        // @Inject(forwardRef(() => CajaService))
        private comprobanteService:ComprobanteService,
        private ventaDetallesService:VentaDetallesService,
        private clientesService:ClientesService,
        private ventasProviderService:VentasProviderService,
        private creditoDetallesService:CreditoDetallesService,
        private formasPagoService:FormasPagoService,
        private cajaService:CajaService,
        // private correlativoService:CorrelativoService
    ){}


    // async changeTimezome(){
    //     const entityManager = getManager();
    //     await entityManager.query(`SET time_zone = '-05:00'`);
    // }

    // async paginate(options: IPaginationOptions): Promise<Pagination<Ventas>> {
    //     return paginate<Ventas>(this.ventasRepo, options, {
    //         relations: ["locales"],
    //         order: { id: "DESC" },
    //     });
    // }


    async paginateFilter(
        filtro:string = "_", 
        idLocal:string = "_", 
        inicio:string, 
        fin:string, 
        options: IPaginationOptions
    ): Promise<Pagination<Ventas>> {

        console.log(filtro === tipoVenta.credito);

        const where:any = {
            estado_venta: Not("cotizacion")
        };

        if (filtro !== "_") {
            where.estado_venta = filtro;
        }
        if (idLocal !== "_") {
            where.locales = idLocal;
        }
        if (inicio !== "_" || fin !== "_" ) {
            where.created_at = Between(inicio, fin);
        }
        if (filtro === tipoVenta.credito) {
            where.estado_venta = "listo";
            where.tipo_venta = filtro;
        }

        const ventas:any = await paginate<Ventas>(this.ventasRepo, options, {
            relations: ["locales", "comprobante", "creditoDetalles"],
            order: { id: "DESC" },
            where: where
        });

        // añadir cantidad pagada a ventas
        const cantidadPagada:any = ventas.items.map((e:any) => {
            let elemento:any = e;
            if (e.creditoDetalles) {
                elemento.totalPagado = sumaArrayObj(e.creditoDetalles, "cantidad_pagada");    
            }
            delete elemento.creditoDetalles;
            return elemento;
        });
        ventas.items = cantidadPagada;

        return ventas;

    }


    async searchData(value:string, idLocal:string){ // busqueda general

        const where:any = [
            {
                id: Like(`%${value}%`),   
                estado_venta: Not("cotizacion")
            },    
            {
                codigo_venta: Like(`%${value}%`),
                estado_venta: Not("cotizacion")
            },
            {
                clientes: { nombre: Like(`%${value}%`) },
                estado_venta: Not("cotizacion")
            },
            {
                clientes: { numero_documento: Like(`%${value}%`) },
                estado_venta: Not("cotizacion")
            },
        ]

        if (idLocal != "_") {
            where.locales = idLocal;
        }

        const data = await this.ventasRepo.find({
            relations: ["locales", "comprobante", "creditoDetalles", "clientes"],
            order: { id: "DESC" },
            where: where
        });

        console.log(data);        

        // añadir cantidad pagada a ventas
        const resto:any = data.map((e:any) => {
            let elemento:any = e;
            if (e.creditoDetalles) {
                elemento.totalPagado = sumaArrayObj(e.creditoDetalles, "cantidad_pagada");    
            }
            delete elemento.creditoDetalles;
            return elemento;
        });

        return resto;
    }


    async getOne(id:number){
        const data:any = await this.ventasRepo.findOne(id,{
            relations: [
                "clientes",
                "usuarios",
                "ventaDetalles",
                "ventaDetalles.productos",
                "locales",
                "locales.correlativos",
                "formasPago",
                "comprobante",
                "creditoDetalles"
            ]
        });

        if (!!data.clientes) {
            data.clientes.estadoCliente = "Registrado"
        }

        // añadir cantidad pagada a ventas
        if (data.creditoDetalles) {
            data.totalPagado = sumaArrayObj(data.creditoDetalles, "cantidad_pagada");    
        }

        // invertir orden de credito
        data.creditoDetalles = data.creditoDetalles.reverse();

        return{
            success: "Registro encontrado",
            data
        }
    }


    async getAll(){
        const data = await this.ventasRepo.find({ order: { id: "DESC" } });
        return{
            success: "Lista registros encontrados",
            data
        }
    }


    async ventasPedidos(id:number){ // recibir el id del local como parametro
        const data = await this.ventasRepo.find({
            relations: ["clientes"],
            order: { id: "DESC" },
            where: [
                { 
                    estado_venta: "enviado",
                    locales: {id: id}                    
                }
            ]
        });
        return{
            success: "Lista registros encontrados",
            data
        }
    }


    async searchDataLocal(value:string, idLocal:number){ // buscar venta para cobrar
        
        const data = await this.ventasRepo.find({
            where: [
                { 
                    codigo_venta: Like(`%${value}%`),
                    estado_venta: "enviado",
                    locales: idLocal
                }
            ]
        });
        return data
    }


    // gestion de productos
    async crearVenta(payload:any){ // crear una venta

        // setTimezone() // automatizar

        // buscar caja
        const caja:any = await this.cajaRepo.findOne({
            relations: ["locales"],
            where: {
                locales: {
                    id: payload.localId,
                    tipo_local: "tienda"
                }, 
                estado_caja: true
            }
        })

        if (caja) {

            // crear cliente
            // let newCliente:any;
            // if (payload.cliente.numero_documento) {
            //     const cliente:any = this.clientesRepo.create(payload.cliente);
            //     newCliente = await this.clientesRepo.save(cliente);
            // }

            let newCliente:any;
            if (payload.cliente.numero_documento) {
                const searchCliente = await this.clientesRepo.findOne({
                    where: {numero_documento: payload.cliente.numero_documento}
                })
                if (!!searchCliente) { // editar
                    await this.clientesService.put(searchCliente.id, payload.cliente);
                    newCliente = searchCliente;
                } else { // crear
                    const restoCliente:any = await this.clientesService.post(payload.cliente);
                    newCliente = restoCliente.data;
                }   
            }

            // crear codigo caja
            const nuevoCodigoCaja:number = (caja.codigo_venta_caja + 1);
            const codigoVenta:string = zeroFill(nuevoCodigoCaja, 5);

            caja.codigo_venta_caja = nuevoCodigoCaja;
            await this.cajaRepo.save(caja);

            // guardar venta
            const venta:any = await this.ventasRepo.create(payload);
            if (newCliente) {
                venta.clientes = newCliente.id;
            }
            venta.usuarios = payload.usuarioId;
            venta.locales = payload.localId;
            venta.codigo_venta = codigoVenta;
            
            const data:any = await this.ventasRepo.save(venta);

            // guardar detalles de venta
            payload.ventaDetalles.forEach(async (detalle:any) => {
                await this.ventaDetallesService.crearDetalleVentas(detalle, data.id);
            });

            return{
                success: "Registro creado",
                data
            }

        } else {
            return{
                success: "Caja cerrada"
            }
        }

    }


    async confirmarVenta(id:number, payload:UpdateVentasDto){

        if (payload.estado_venta === 'rechazado') { // rechazar venta
            return {
                success: "Venta rechazada",
                data: await this.rechazarVenta(id, payload)
            }
        } else if (id !== 0 || !id) { // editar y confirmar venta desde caja
            return {
                success: "Venta confirmada",
                data: await this.editarConfirmarVenta(id, payload)
            }
        } else { // crear y confirmar venta aqui, desde la creacion de pedido
            // IMPORTANTE: el id debe tener como 0 por defecto desde el frontend
            // this.crearVenta(payload);
        }

        return {
            payload,
            id
        }
    }

    async editarConfirmarVenta(id:number, payload:any){ // Confirma la venta

        const esCredito:boolean = (
            !!payload.creditoDetalles && 
            ( payload.tipo_venta === tipoVenta.credito || payload.tipo_venta === tipoVenta.adelanto )
        );

        const esComprobante:boolean = (
            ( payload.tipo_venta === tipoVenta.boleta || payload.tipo_venta === tipoVenta.factura) && 
            !!payload.comprobante
        );

        const formasPago:any = payload.formasPago;
        const cliente = payload.cliente;
        let idCliente:number = 0;
        let newCreditoDetalles:Array<any> = [];

        // 
        // if (!!cliente.id) { // el cliente existe
        //     idCliente = cliente.id;
        // //  && cliente.serie_documento
        // } else 

        // gestion cliente
        if (cliente.numero_documento){
            const searchCliente = await this.clientesRepo.findOne({
                where: {numero_documento: cliente.numero_documento}
            })
            if (!!searchCliente) { 
                // editar cliente
                await this.clientesService.put(searchCliente.id, cliente);
                idCliente = searchCliente.id;
            } else { 
                // crear cliente
                const newCliente:any = await this.clientesService.post(cliente);
                idCliente = newCliente.data.id;
            }   
        }

        // estado_venta y cliente
        const venta = await this.ventasRepo.findOne(id);
        if (idCliente !== 0) { // recupera id del cliente, en caso de que exista y cambie
            venta.clientes = idCliente;
        }

        // *** envio de comprobante sunat ***
        if (esComprobante && !esCredito) {
            payload.comprobante.clientes.id = idCliente;
            await this.comprobanteService.enviarComprobanteSunat(payload.comprobante, payload.localId);
        }

        // estado venta
        this.ventasRepo.merge(venta, payload);
        await this.ventasRepo.save(venta);
        
        payload.ventaDetalles.forEach(async (detalle:any) => {            
            await this.ventaDetallesService.editarDetalleVentas(detalle.id, payload.localId, detalle);
        });

        // formas de pagos
        if (formasPago.length > 0) {
            formasPago.forEach(async (e:any) => { 
                e.venta = venta.id
                await this.formasPagoService.create(e);
            })
        }

        // credito o adelanto
        if (esCredito) {
            await Promise.all(payload.creditoDetalles.map(async (e:any) => {
                e.ventas = venta.id
                const creditoDetall:any = await this.creditoDetallesService.crearCreditoAdelanto(e);
                newCreditoDetalles.push(creditoDetall);
            }));
        }

        // caja
        const caja:any = await this.cajaRepo.findOne({
            where: {
                locales: { id: payload.localId, tipo_local: "tienda" },
                estado_caja: true
            }
        })

        // añadir dinero a caja
        await this.cajaService.incrementoCaja(caja, formasPago, newCreditoDetalles, venta);

        // envio por correo electronico
        if (!!payload.envioComprobante) { 
            await this.comprobanteService.comprobanteEnviarCorreo(payload.comprobante, payload.envioComprobante);
        }

        // // fin caja
        return payload;
    }


    async cambiarTipoVenta(id:number, payload:any){ 

        let newTipoVenta = "";
        const venta:any = await this.ventasRepo.findOne(id);

        // convertir a VENTA RAPIDA
        venta.tipo_venta = payload.tipo_venta;
        const resto:any = await this.ventasRepo.save(venta);
        newTipoVenta = resto.tipo_venta;

        // convertir a BOLETA


        // convertir a FACTURA

        return {
            success: true,
            id: venta.id,
            tipo_venta: newTipoVenta
        };    
    }


    async anularVenta(idVenta:number, payload:any){

        const venta:any = await this.ventasRepo.findOne(idVenta, { relations: ["comprobante", "locales"] });
        const comprobante:any = venta.comprobante.length > 0 ? venta.comprobante[0] : {}
        const locales:any = venta.locales ? venta.locales : {};
        const caja:any = await this.cajaRepo.findOne({
            relations: ["locales"],
            where: { locales: { id: locales.id, tipo_local: "tienda" }, estado_caja: true }
        });
        const esCredito:boolean = (venta.tipo_venta === tipoVenta.credito || venta.tipo_venta === tipoVenta.adelanto);
        const montoCaja:number = Number(caja.monto_apertura) + Number(caja.monto_efectivo) + Number(caja.otros_montos);

        if (montoCaja < Number(venta.total)) {
            // si caja no tiene cantidad de dinero adecuada
            return true;
        } else {
            // aqui añadimos la anulacion de venta
            if (venta.tipo_venta === tipoVenta.venta_rapida || esCredito) {
                // anulacion de venta normal
                await this.ventasProviderService.anulacionVenta(idVenta, payload.notaBaja, payload.usuarioId, payload.afectarCaja);
            } else {
                // anulacion de comprobante
                if (venta.tipo_venta === tipoVenta.factura) {
                    // anular factura                    
                    const response:any = await this.comprobanteService.anularFactura(comprobante, payload);
                    if (response.estado === "Anulado" || response.estado === "Anulacion procesada"){
                        // anular venta
                        await this.ventasProviderService.anulacionVenta(idVenta, payload.notaBaja, payload.usuarioId, payload.afectarCaja);
                    }
                } else if (venta.tipo_venta === tipoVenta.boleta) {
                    // // anular boleta
                    const response:any = await this.comprobanteService.anularBoleta(comprobante.id, payload);
                    if (response.estado === "Anulado" || response.estado === "Anulacion procesada") {
                        // anular venta
                        await this.ventasProviderService.anulacionVenta(idVenta, payload.notaBaja, payload.usuarioId, payload.afectarCaja);    
                    }
                }               
            }
            return false;
        }
    }

    
    async rechazarVenta(id:number, payload:any){
        let updatePayload:any = {};
        updatePayload.estado_venta = payload.estado_venta;
        const elemento = await this.ventasRepo.findOne(id);
        this.ventasRepo.merge(elemento, updatePayload);
        const update = await this.ventasRepo.save(elemento);

        return update;

    }


    async habilitarVenta(id:number, payload:any){
        const venta = await this.ventasRepo.findOne(id);
        this.ventasRepo.merge(venta, payload);
        await this.ventasRepo.save(venta);
        return {
            data: "venta habilitada"
        }
    }


    async ventaEntreFechas(){ // establecer como parametros las fechas de inicio y fin recibidos desde el frontend
        const data:any = await this.ventasRepo.find({
            relations: ["clientes", "usuarios", "ventaDetalles", "ventaDetalles.productos", "locales"],
            order: { id: "DESC" }
        });

        return data;
    }


    async downloadReporteVentas(res:any){

        const wb = new xl.Workbook();
        const ws = wb.addWorksheet("reporte_ventas");

        const datos:any = await this.ventaEntreFechas()
        
        let exportar:Array<any> = [];

        datos.forEach((e:any) => {
            
            let dataUpdate:any = {};

            dataUpdate.id = e.id.toString();
            dataUpdate.total = e.total.toString();
            dataUpdate.subtotal = e.subtotal.toString();
            dataUpdate.observaciones = e.observaciones.toString();
            dataUpdate.descuento_total = e.descuento_total.toString();
            dataUpdate.codigo_venta = e.codigo_venta.toString();
            dataUpdate.estado_venta = e.estado_venta.toString();
            dataUpdate.fecha_creacion = e.created_at.toString();

            if (e.usuarios) {
                dataUpdate.nombre_vendedor = e.usuarios.nombre.toString();
                dataUpdate.documento_vendedor = e.usuarios.documento.toString();
            }
            
            if (e.locales) {
                dataUpdate.nombre_local = e.locales.nombre.toString();
                dataUpdate.direccion_local = e.locales.direccion.toString();
            }

            if (e.clientes) {
                dataUpdate.codigo_venta_reg = e.clientes.nombre.toString();
                dataUpdate.direccion_cliente_reg = e.clientes.direccion.toString();
                dataUpdate.telefono_cliente_reg = e.clientes.telefono.toString();
                dataUpdate.documento_cliente_reg = e.clientes.documento.toString();
                dataUpdate.email_cliente_reg = e.clientes.email.toString();
            }

            exportar.push(dataUpdate);
        });

        const titlesColumns = [ // nombres de las columnas
            "id",
            "total",
            "subtotal",
            "observaciones",
            "descuento_total",
            "codigo_venta",
            "estado_venta",
            "fecha_creacion",
            "nombre_vendedor",
            "documento_vendedor",
            "nombre_local",
            "direccion_local",
            "codigo_venta_reg",
            "direccion_cliente_reg",
            "telefono_cliente_reg",
            "documento_cliente_reg",
            "email_cliente_reg"
        ];

        let handlerColumnIndex = 1; // añadir nombres de las columnas
        titlesColumns.forEach(element => {
            ws.cell(1, handlerColumnIndex++).string(element)
        });

        let rowIndex = 2;
        exportar.forEach((record) => { 
            let columnIndex = 1;
            Object.keys(record).forEach((columnName) => { 
                ws.cell(rowIndex, columnIndex++).string(record[columnName])
            })
            rowIndex++;
        });

        return wb.write('reporteVentas.xlsx', res);

    }

    // estadisticas para los cards
    async estadisticasGenerales(){

        const fechaActual:Date = new Date(); // fecha actual
        const inicioDia:Date = new Date(fechaActual.toDateString()) // inicio del dia
        const haceSemana:any = new Date((moment().subtract(7, 'days')).toString());

        const productosDia:any = await this.ventasRepo.find({
            where: { updated_at: Between(inicioDia, fechaActual) }
        });

        const productosUnaSemana:any = await this.ventasRepo.find({
            where: { updated_at: Between(haceSemana, fechaActual) }
        });

        const totalPedidosDia:number = productosDia.length; // calcular total pedidos
        let totalVendidosDia:number = 0;

        let totalDineroDia:number = 0;
        let totalDineroSemana:number = 0;


        productosDia.forEach((e:any) => {
            if (e.estado_venta === 'listo') {
                totalVendidosDia = Number(totalVendidosDia) + 1; // calcular total productos vendidos
                totalDineroDia = Number(totalDineroDia) + Number(e.total);
            }
        });

        productosUnaSemana.forEach((e:any) => {
            if (e.estado_venta === 'listo') {
                totalDineroSemana = totalDineroSemana + Number(e.total);
            }
        });


        return{
            success: "Respusta",
            data: {
                totalPedidosDia,
                totalVendidosDia,
                totalDineroDia,
                totalDineroSemana
            }
        }
    }


    // total ingresos dias por tienda
    async ingresosDiariosLocal(idLocal:number){ // por fecha (deprec)
        const fechaActual:Date = new Date(); // frecha actual
        const inicioDia:Date = new Date(fechaActual.toDateString()) // inicio del dia 
        
        const productosDia:any = await this.ventasRepo.find({
            where: { 
                updated_at: Between(inicioDia, fechaActual),
                locales: idLocal
            }
        });

        let totalDineroDia:number = 0;

        productosDia.forEach((e:any) => {            
            if (e.estado_venta === 'listo') {
                totalDineroDia = totalDineroDia + e.total;
            }
        });

        return{
            success: "Ingresos del dia",
            data: {
                totalDineroDia
            }
        }

    }


    // total ingresos desde la apertura de caja, del dia, por tienda
    async ingresosDiariosAperturaCaja(idLocal:number, fechaCaja:string){ // por fecha (deprec)

        const iFechaCaja:Date = new Date(fechaCaja) // inicio del dia
        const fechaActual:Date = new Date(); // frecha actual
                
        const productosDia:any = await this.ventasRepo.find({
            where: { 
                updated_at: Between(iFechaCaja, fechaActual),
                locales: idLocal
            }
        });

        let totalDineroDia:number = 0;

        productosDia.forEach((e:any) => {
            if (e.estado_venta === 'listo') {
                totalDineroDia = totalDineroDia + e.total;
            }
        });

        return{
            success: "Ingresos del dia",
            data: {
                totalDineroDia
            }
        }

    }


    // ventas se la semana, todos los productos que se venden
    async ventasSemana(){

        // let ventasSemana:Array<any> = [];
        let totalVentasSemana:Array<any> = [];

        for (let index = 0; index < 7; index++) {            

            const dia = moment().subtract(index, 'days')

            const fechaActual = dia.format('L');

            const inidioDia = moment(fechaActual, "DDMMYYYY");
            const finDia = inidioDia.clone().add(1, "day").subtract(1, 'second');

            // created para contabilizar los pedidos
            // updated para contabilizar las ventas concluidas
            const ventasDia:any = await this.ventasRepo.find({ 
                where: { 
                    updated_at: Between(new Date(inidioDia.toString()), new Date(finDia.toString())),
                    estado_venta: "listo" // verifica que la venta sea correcta, y no rechazada
                }
            });

            // ventasSemana.push(ventasDia);
            totalVentasSemana.push({
                Cantidad: ventasDia.length,
                Dia: moment(dia).format("L")
            });

        }

        return {
            success: "Respusta",
            data: {
                totalVentasSemana,
                // ventasSemana,
                // diaVenta
            }
        }

    }


    async ingresosDia(idLocal:number, index?:number){

        const indice:number = index ? index : 0;

        const dia = moment().subtract(indice, 'days')

        const fechaActual = dia.format('L');

        const inidioDia = moment(fechaActual, "DDMMYYYY");
        const finDia = inidioDia.clone().add(1, "day").subtract(1, 'second');

        // created para contabilizar los pedidos
        // updated para contabilizar las ventas concluidas
        const ventasDia:any = await this.ventasRepo.find({ 
            where: { 
                updated_at: Between(new Date(inidioDia.toString()), new Date(finDia.toString())),
                estado_venta: "listo",
                locales: idLocal
            }
        });
        
        const totalVendidoHoy = sumaArrayObj(ventasDia, "total");

        return {
            Ingresos: totalVendidoHoy,
            Dia: moment(dia).format("L")
        }

    }

    
    async ingresosSemana(id:number){

        let totalVentasSemana:Array<any> = [];
        for (let index = 0; index < 7; index++) {            
            totalVentasSemana.push(await this.ingresosDia(id, index))
        }

        return {
            success: "Respusta",
            data: {
                totalVentasSemana
            }
        }
    }


    // otros
    async eliminarEnviadosRechazados(idLocal:number){

        const idsFails:Array<number> = [];

        const ventasFail:any = await this.ventasRepo.find({
            relations: ["locales"],
            where: [
                {
                    locales: idLocal,
                    estado_venta: "enviado"
                },
                {
                    locales: idLocal,
                    estado_venta: "rechazado"
                }
            ]
        })

        ventasFail.map((e:any) => { 
            idsFails.push(e.id)
        })

        if (!(idsFails.length === 0)) {
            await this.ventasRepo.delete(idsFails);
            return { success: "Registro eliminado" }
        }

        return { success: "No hay registros para eliminar" }

    }
    
}


// en paginacion

        // if (filtro != "_" || idLocal != "_") { // si where no tiene nada, añadir condicion aqui
        //     return paginate<Ventas>(this.ventasRepo, options, {
        //         relations: ["locales", "comprobante"],
        //         order: { id: "DESC" },
        //         where
        //     });
        // } else {
        //     return paginate<Ventas>(this.ventasRepo, options, {
        //         relations: ["locales", "comprobante"],
        //         order: { id: "DESC" },
        //         where: {
        //             estado_venta: "listo"
        //         }
        //     });
            
        // }



// async put(id:number, payload:any){

//     const elemento = await this.ventasRepo.findOne(id);

//     // if (payload.usuarioId) {
//     //     const usuario = await this.usuariosRepo.findOne(payload.usuarioId);
//     //     elemento.usuarios = usuario
//     // }

//     // if (payload.clienteId) {
//     //     const cliente = await this.clientesRepo.findOne(payload.clienteId);
//     //     elemento.clientes = cliente
//     // }

//     // await this.ventasRepo.merge(elemento, payload);
//     // const data:Ventas = await this.ventasRepo.save(elemento);

//     return{
//         success: "Registro actualizado",
//         elemento
//     }

// }


// async delete(id:number){
//     await this.ventasRepo.delete(id);
//     return{ success: "Registro eliminado" }
// }


// añadir valor a caja, pertenece confirmar venta

// if (formasPago.length > 0) {
//     formasPago.forEach(async (e:any) => { 
//         if (e.forma_pago === "efectivo") {
//             caja.monto_efectivo = Number(caja.monto_efectivo) + Number(e.precio_parcial);
//         } else {
//             caja.monto_otros_medios = Number(caja.monto_otros_medios) + Number(e.precio_parcial);
//         }
//     })
// } else {
//     if (venta.forma_pago === "efectivo") {
//         caja.monto_efectivo = Number(caja.monto_efectivo) + Number(venta.total)
//     } else {
//         caja.monto_otros_medios = Number(caja.monto_otros_medios) + Number(venta.total)
//     }
// }

// await this.cajaRepo.save(caja);











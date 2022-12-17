import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import axios from 'axios';

import { cliente, clienteDto, CreateClienteDto, UpdateClienteDto } from '../dtos/clientes.dto';
import { Clientes } from '../entities/clientes.entity';

import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ClientesService {

    constructor(
        @InjectRepository(Clientes) private clientesRepo:Repository<Clientes>
    ){ }

    async getAll(){
        const data = await this.clientesRepo.find();

        return{
            success: "Lista registros encontrados",
            data
        }

    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Clientes>> {
        return paginate<Clientes>(this.clientesRepo, options, {
            order: { id: "DESC" }
        });
    }

    async getOne(id:number){
        const data = await this.clientesRepo.findOne(id);

        return {
            success: "Registro encontrado",
            data
        }
    }

    
    async post(payload:CreateClienteDto){

        const cliente = await this.clientesRepo.findOne({
            where: { numero_documento: payload.numero_documento }
        });

        if (!cliente) { // no existe
            const elemento = await this.clientesRepo.create(payload);
            const data:any = await this.clientesRepo.save(elemento);
            return{
                success: "Registro creado",
                data
            }
        } else {
            return{
                success: "Error al registrar",
                registro: false,
                data: {
                    error: "El usuario ya existe"
                }
            }
        }
    }


    async nuevoClienteId(cliente:any){
        let idCliente:number;
        if (cliente.numero_documento){
            const searchCliente = await this.clientesRepo.findOne({
                where: {numero_documento: cliente.numero_documento}
            })
            if (!!searchCliente) { 
                // editar cliente
                await this.put(searchCliente.id, cliente);
                idCliente = searchCliente.id;
            } else { 
                // crear cliente
                const newCliente:any = await this.post(cliente);
                idCliente = newCliente.data.id;
            }   
        } else {
            idCliente = null;
        }
        return idCliente;
    }


    async verificarCliente(payload:any){
        
        const cliente = await this.clientesRepo.findOne({
            where: { 
                numero_documento: payload.numero_documento,
                tipoDocumento: payload.tipoDocumento
            }
        });

        return {
            activarBtn: !cliente,
            activarMsg: true
        }
    }


    async put(id:number, payload:UpdateClienteDto){
        const elemento = await this.clientesRepo.findOne(id);
        await this.clientesRepo.merge(elemento, payload);
        const data:UpdateClienteDto = await this.clientesRepo.save(elemento);

        return{
            success: "Registro actualizado",
            data
        }
    }

    
    async delete(id:number){
        await this.clientesRepo.delete(id);
        return{ success: "Registro eliminado" }
    }

    
    async searchData(value:string){

        const data = await this.clientesRepo.find({
            where: [
                { nombre: Like(`%${value}%`) },
                { razonSocial: Like(`%${value}%`) },
                { numero_documento: Like(`%${value}%`) }
            ]
        });

        return data;
    }


    async clientesExternos(payload:any){

        const { documento, tipoDocumento } = payload;
        let response:clienteDto = {...cliente};

        const clienteExistente:clienteDto = await this.clientesRepo.findOne({
            tipoDocumento: tipoDocumento,
            numero_documento: documento
        })

        if (!!clienteExistente) {
            
            response = clienteExistente;
            response.estadoCliente = "Registrado";

        } else {
            switch (tipoDocumento) {
                case "DNI":
                    const urlDNI:string = process.env.PEDIR_DNI + documento
                    let responseDNI:any;
                    try {
                        responseDNI = await axios.post(urlDNI);
                        responseDNI = responseDNI.data;
                    } catch (error) {
                        console.log(error);
                    }

                    if (!!responseDNI.error) {
                        response.estadoCliente = "Inexistente";
                    } else {
                        response.estadoCliente = "Nuevo";
                        response.numero_documento = documento;
                        response.tipoDocumento = "DNI";
                        response.nombre = responseDNI.apePatSoli + " " + responseDNI.apeMatSoli + " " + responseDNI.nombreSoli;
                    }

                    break;

                case "RUC":
                    const urlRUC:string = process.env.PEDIR_RUC;
                    let responseRUC:any;

                    try {
                        responseRUC = await axios.post(urlRUC, { action: "getnumero", numero: documento.toString() });
                        responseRUC = responseRUC.data;
                    } catch (error) {
                        console.log(error);
                    }

                    if (!!responseRUC.error) {
                        response.estadoCliente = "Inexistente";
                    } else {
                        response.estadoCliente = "Nuevo";
                        response.tipoDocumento = "RUC";
                        response.numero_documento = responseRUC.ruc;
                        response.razonSocial = responseRUC.rs;
                        response.nombreComercial = responseRUC.rs;
                        response.ubigeo = responseRUC.ubigeo;
                        response.direccion = responseRUC.direccion_string === "--" ? "" : responseRUC.direccion_string;
                        response.codigo_pais = "PE";
                        response.departamento = responseRUC.departamento.nombre;
                        response.provincia = responseRUC.provincia.nombre;
                        response.distrito = responseRUC.distrito.nombre;
                        response.estado = responseRUC.estado;
                        response.condom = responseRUC.condom; 
                    }

                    break;
                    
                default:
                    // console.log("Tipo de documento inexistente");
                    break;

            }
        }

        return response;

    }




}

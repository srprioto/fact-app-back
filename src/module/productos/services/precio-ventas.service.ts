// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { CreatePrecioVentasDto, UpdatePrecioVentasDto } from '../dtos/precio_ventas.dto';
// import { PrecioVentas } from '../entities/precio_ventas.entity';


// @Injectable()
// export class PrecioVentasService {

//     constructor(
//         @InjectRepository(PrecioVentas) private precioVentasRepo:Repository<PrecioVentas>
//     ){ }

//     async getAll(){
//         const data = await this.precioVentasRepo.find();

//         return{
//             success: "Lista registros encontrados",
//             data
//         }
//     }

//     async getOne(id:number){

//         const elemento = await this.precioVentasRepo.findOne(id);

//         return {
//             success: "Registro encontrado",
//             elemento
//         }

//     }

//     async post(payload:CreatePrecioVentasDto){

//         const data:CreatePrecioVentasDto = await this.precioVentasRepo.save(payload);

//         return{
//             success: "Registro creado",
//             data
//         }
//     }

//     async put(id:number, payload:UpdatePrecioVentasDto){
//         const elemento = await this.precioVentasRepo.findOne(id);
//         await this.precioVentasRepo.merge(elemento, payload);
//         const data:UpdatePrecioVentasDto = await this.precioVentasRepo.save(elemento);

//         return{
//             success: "Registro update",
//             data
//         }

//     }

//     async delete(id:number){
//         await this.precioVentasRepo.delete(id);
//         return { success: "Registro eliminado" }
//     }



// }

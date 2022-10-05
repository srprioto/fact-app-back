import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'
import { CreateProductosDto, UpdateProductosDto } from '../dtos/productos.dto';
import { Productos } from '../entities/productos.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { zeroFill } from '../../../assets/functions/fillCero';
import { LocalesStock } from 'src/module/locales/entities/locales_stock.entity';
import { Categorias } from '../entities/categorias.entity';
import { Locales } from 'src/module/locales/entities/locales.entity';


@Injectable()
export class ProductosService {

    constructor(
        @InjectRepository(Productos) private productosRepo:Repository<Productos>,
        @InjectRepository(LocalesStock) private localesStockRepo:Repository<LocalesStock>,
        @InjectRepository(Locales) private localesRepo:Repository<Locales>,
        @InjectRepository(Categorias) private categoriasRepo:Repository<Categorias>,
    ){}

    // async getAll(){
    //     const data = await this.productosRepo.find({
    //         // relations: ['localesStock'],
    //         // order: { id: "DESC" }
    //     });
    //     return {
    //         success: "Lista registros encontrados",
    //         data
    //     }
    // }

    async paginate(options: IPaginationOptions): Promise<Pagination<Productos>> {
        return paginate<Productos>(this.productosRepo, options, {
            // relations: [
            //     'localesStock', 
            //     'localesStock.locales'
            // ],
            order: { id: "DESC" },
            // where: { localesStock: { locales: {id: 1} } }
        });
    }

    async getOne(id:number){
        
        const data = await this.productosRepo.findOne(id, {
            relations: ['categorias', 'localesStock', 'localesStock.locales']
        });

        return {
            success: "Registro encontrado",
            data
        }
    }

    
    async post(payload:CreateProductosDto){
        let restoProducto:any;
        if (payload.switchCrear) {
            restoProducto = await this.crearProductoCompleto(payload);
        } else {
            restoProducto = await this.crearProductoSimple(payload);
        }        
        return {
            exito: "Registro creado",
            data: restoProducto
        }
    }


    async crearProductoSimple(payload:CreateProductosDto){
        // crear producto
        const producto:any = await this.productosRepo.create(payload);
        producto.categorias = payload.categoriasId;
        // if (payload.categoriasId) {
        //     producto.categorias = await this.categoriasRepo.findOne(payload.categoriasId)
        // }

        // actualizar y añadir el codigo
        const productoCreado:Productos = await this.productosRepo.save(producto);
        productoCreado.codigo = zeroFill(productoCreado.id, 14); // creacion del codigo
        
        const nuevoProducto = await this.productosRepo.save(productoCreado);

        return nuevoProducto;
    }


    async crearProductoCompleto(payload:CreateProductosDto){
        const producto:any = await this.productosRepo.create(payload);
        producto.categorias = payload.categoriasId;
        // if (payload.categoriasId) {
        //     producto.categorias = await this.categoriasRepo.findOne(payload.categoriasId)
        // }
        const productoCreado:Productos = await this.productosRepo.save(producto);

        // habilitar stock
        await this.añadirStockCrearProducto({
            cantidad: 0,
            productosId: productoCreado.id
        });

        return productoCreado;
    }


    async añadirStockCrearProducto(payload:any){ // crear stock para productos

        const locales:any = await this.localesRepo.find();

        await Promise.all(locales.map(async (e:any) => {
            const localStock:any = this.localesStockRepo.create(payload);
            localStock.productos = payload.productosId;
            localStock.locales = e.id;
            await this.localesStockRepo.save(localStock);
        }));

        return {
            success: "Registro creado"
        }
    }


    async put(id:number, payload:UpdateProductosDto){

        const producto = await this.productosRepo.findOne(id);
        // producto.categorias = payload.categoriasId;
        
        if (payload.categoriasId) {
            const categoria = await this.categoriasRepo.findOne(payload.categoriasId)
            producto.categorias = categoria
        }

        // if (payload.usuarioId) {
        //     const usuario = await this.usuarioRepo.findOne(payload.usuarioId)
        //     producto.usuarios = usuario
        // }

        // if (payload.precioVentaId) {
        //     const precioVenta = await this.precioVentasRepo.findOne(payload.precioVentaId)
        //     producto.precioVenta = precioVenta
        // }

        await this.productosRepo.merge(producto, payload);
        const data:Productos = await this.productosRepo.save(producto);
        
        return {
            exito: "Registro actualizado",
            data
        }
    }

    async delete(id:number){

        await this.productosRepo.delete(id);

        return {
            exito: "Registro eliminado"            
        }
    }

    async searchData(value:string){
        const data = await this.productosRepo.find({
            relations: ['localesStock'],
            where: [
                { codigo: Like(`%${value}%`) },
                { nombre: Like(`%${value}%`) },
                { marca: Like(`%${value}%`) },
                { talla: Like(`%${value}%`) }
            ]
        });
        return data;
    }

}

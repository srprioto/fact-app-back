import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne
} from "typeorm";

import { Productos } from "src/module/productos/entities/productos.entity";
import { LocalesStock } from "./locales_stock.entity";
import { Movimientos } from "./movimientos.entity";
import { Proveedores } from "./proveedores.entity";

@Entity()
export class MovimientoDetalles {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 255})
    descripcion:string;


    @Column({type: "int"})
    cantidad:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    precio_unidad:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    precio_parcial:number;


    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    
    @ManyToOne(() => Productos, productos => productos.movimientoDetalles)
    productos:number;
    
    @ManyToOne(() => LocalesStock, localesStock => localesStock.movimientoDetalles)
    localesStock:number;
    
    @ManyToOne(() => Movimientos, movimientos => movimientos.movimientoDetalles)
    movimientos:number;

    @ManyToOne(() => Proveedores, proveedores => proveedores.movimientoDetalles)
    proveedores:number;
       
}
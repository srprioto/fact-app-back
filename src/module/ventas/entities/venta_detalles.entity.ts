import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";

import { Ventas } from "./ventas.entity";
import { Productos } from "src/module/productos/entities/productos.entity";

export enum EstadoVentaDetalle {
    enviado = "enviado",
    rechazado = "rechazado",
    listo = "listo"
}

@Entity()
export class VentaDetalles {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "int"})
    cantidad_venta:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    descuento:number;

    @Column({type: "boolean"}) // retirar
    forzar_venta:boolean;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    precio_venta:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    precio_parcial:number;

    @Column({type: "int"})
    venta_negativa:number;

    // @Column({
    //     type: "enum",
    //     enum: EstadoVentaDetalle,
    //     default: EstadoVentaDetalle.enviado
    // })
    // // @Column({type: "varchar", length: 10})
    // estado_venta_detalle:EstadoVentaDetalle;

    
    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    
    @ManyToOne(() => Ventas, venta => venta.ventaDetalles, { onDelete: 'CASCADE' })
    ventas:number;

    @ManyToOne(() => Productos, producto => producto.ventaDetalles)
    productos:number;
    

}
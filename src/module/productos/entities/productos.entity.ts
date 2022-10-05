import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { VentaDetalles } from "src/module/ventas/entities/venta_detalles.entity";
import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
// import { PrecioVentas } from "./precio_ventas.entity";
import { Categorias } from "./categorias.entity";
import { LocalesStock } from "src/module/locales/entities/locales_stock.entity";
import { MovimientoDetalles } from "src/module/locales/entities/movimiento_detalles.entity";
import { TransaccionDetalles } from "src/module/locales/entities/transaccion_detalle.entity";

@Entity()
export class Productos {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 15, nullable: true})
    codigo:string;

    @Column({type: "varchar", length: 50})
    nombre:string;

    @Column({type: "varchar", length: 255, nullable: true})
    descripcion:string;

    // @Column({type: "int"})
    // cantidad:number;

    @Column({type: "varchar", length: 50, nullable: true})
    marca:string;

    @Column({type: "varchar", length: 50, nullable: true})
    color:string;

    @Column({type: "varchar", length: 50, nullable: true})
    talla:string;

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true})
    precio_compra:number;

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true})
    precio_venta_1:number;

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true})
    precio_venta_2:number;

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true})
    precio_venta_3:number;
     

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    
    // @ManyToOne(() => Usuarios, usuarios => usuarios.productos)
    // usuarios:Usuarios;

    @ManyToOne(() => Categorias, categorias => categorias.productos)
    categorias:Categorias;
    
    
    // bidireccional
    @OneToMany(() => VentaDetalles, ventaDetalles => ventaDetalles.productos)
    ventaDetalles:VentaDetalles[];

    @OneToMany(() => LocalesStock, localesStock => localesStock.productos)
    localesStock:LocalesStock[];

    @OneToMany(() => MovimientoDetalles, movimientoDetalles => movimientoDetalles.productos)
    movimientoDetalles:MovimientoDetalles[];

    @OneToMany(() => TransaccionDetalles, transaccionDetalles => transaccionDetalles.productos)
    transaccionDetalles:TransaccionDetalles[];



    // relacion principal

    // @ManyToOne(() => PrecioVentas, precioVenta => precioVenta.productos)
    // precioVenta:PrecioVentas;


}
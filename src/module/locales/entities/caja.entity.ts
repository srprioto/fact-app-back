import { 
    PrimaryGeneratedColumn,
    Entity, 
    Column, 
    OneToMany,
    ManyToOne,
    CreateDateColumn, 
    UpdateDateColumn,
} from "typeorm";

import { Locales } from "./locales.entity";
import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
import { CajaDetalles } from "./caja-detalles.entity";
import { Ventas } from "src/module/ventas/entities/ventas.entity";

// enum estado {
//     abierto = "abierto",
//     cerrado = "cerrado"
// }

@Entity()
export class Caja {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "boolean", default: true})
    estado_caja:boolean;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    monto_apertura:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    monto_efectivo:number;

    // @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    // monto_otros_medios:number;


    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    monto_tarjeta:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    monto_pago_electronico:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    monto_deposito:number;



    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    otros_montos:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    cantidad_diferencia:number;

    @Column({type: "varchar", length: 255, default: ""})
    nota_observacion:string;

    @Column({type: "int", default: 0})
    codigo_venta_caja:string;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;



    @ManyToOne(() => Locales, locales => locales.caja, { onDelete: 'CASCADE' })
    locales:number;

    @ManyToOne(() => Usuarios)
    usuarioAbre:number;

    @ManyToOne(() => Usuarios)
    usuarioCierra:number;


    // bidireccional
    @OneToMany(() => CajaDetalles, (cajaDetalles) => cajaDetalles.caja)
    cajaDetalles:CajaDetalles[];

    @OneToMany(() => Ventas, (ventas) => ventas.caja)
    ventas:Ventas[];

}

/*
@ManyToOne(() => Productos, productos => productos.localesStock, { onDelete: 'CASCADE' })
productos:Productos;


// bidireccional
@OneToMany(() => MovimientoDetalles, movimientoDetalles => movimientoDetalles.localesStock)
movimientoDetalles:MovimientoDetalles[];
*/



// @Column({
//     type: "enum",
//     enum: estado,
//     default: estado.abierto
// })
// tipo_local:estado;
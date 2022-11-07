import { 
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne
} from "typeorm";

import { Clientes } from "./clientes.entity";
import { VentaDetalles } from "./venta_detalles.entity";
import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
import { Locales } from "src/module/locales/entities/locales.entity";
import { FormasPago } from "./formas_pago.entity";
import { Comprobante } from "./comprobante.entity";
import { CreditoDetalles } from "./credito_detalles.entity";
import { Caja } from "src/module/locales/entities/caja.entity";
import { IngresosVentas } from "./ingresos-ventas.entity";

enum EstadoVenta {
    cotizacion = "cotizacion",
    listo = "listo",
    anulado = "anulado",
    enviado = "enviado",
    rechazado = "rechazado"
}

// enum formaPago {
//     efectivo = "efectivo",
//     tarjeta = "tarjeta",
//     yape = "yape",
//     dividido = "dividido"
// }

@Entity()
export class Ventas {

    @PrimaryGeneratedColumn()
    id:number;
    
    // @Column({type: "varchar", length: 10, nullable: true})
    // serie:string;

    @Column({type: "varchar", length: 12})
    tipo_venta:string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    total:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    subtotal:number;

    @Column({type: "varchar", length: 255})
    observaciones:string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    descuento_total:number;

    @Column({type: "varchar", length: 40})
    codigo_venta:string;
    
    @Column({
        type: "enum",
        enum: EstadoVenta,
        default: EstadoVenta.enviado
    })
    estado_venta:EstadoVenta;

    @Column({type: "varchar", length: 25})
    forma_pago:string;

    @Column({type: "boolean", default: true})
    estado_producto:boolean;


    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    // relaciones
    @ManyToOne(() => Clientes, (cliente) => cliente.ventas)
    clientes:number;

    @ManyToOne(() => Usuarios, (usuarios) => usuarios.ventas)
    usuarios:number;

    @ManyToOne(() => Locales, (locales) => locales.ventas)
    locales:number;

    @ManyToOne(() => Caja, (caja) => caja.ventas)
    caja:number;
    
    
    // bidireccional
    @OneToMany(() => VentaDetalles, ventaDetalles => ventaDetalles.ventas, { onDelete: 'CASCADE' })
    ventaDetalles:VentaDetalles[];

    @OneToMany(() => FormasPago, formasPago => formasPago.venta)
    formasPago:FormasPago[];
    
    @OneToMany(() => Comprobante, comprobante => comprobante.ventas, { onDelete: 'CASCADE' })
    comprobante:Comprobante[];

    @OneToMany(() => CreditoDetalles, creditoDetalles => creditoDetalles.ventas)
    creditoDetalles:CreditoDetalles[];

    @OneToOne(() => IngresosVentas, ingresosVentas => ingresosVentas.ventas)
    ingresosVentas:IngresosVentas[];

}
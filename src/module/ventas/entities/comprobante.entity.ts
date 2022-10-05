import { Locales } from "src/module/locales/entities/locales.entity";
import { 
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { Clientes } from "./clientes.entity";
import { ComprobanteDetalles } from "./comprobante_detalles.entity";
import { Correlativos } from "./correlativos.entity";
import { Ventas } from "./ventas.entity";

@Entity()
export class Comprobante {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 6})
    serie:string;
    
    @Column({type: "varchar", length: 12})
    tipo_venta:string;

    @Column({type: "int"})
    correlativo:number;

    @Column({type: "varchar", length: 32, default: ""})
    fecha_emision:string; // created_at original

    @Column({type: "varchar", length: 5})
    tipoMoneda:string;

    @Column({type: "varchar", length: 5})
    tipoOperacion:string;

    @Column({type: "varchar", length: 5})
    tipoComprobante:string;

    @Column({type: "varchar", length: 5})
    tipoDocumento:string;

    @Column({type: "varchar", length: 25, default: ""})
    estado_sunat:string;

    @Column({type: "text"})
    respuesta_sunat:string; // JSON.parse(item)


    @Column({type: "decimal", precision: 10, scale: 6, default: 0})
    // @Column({type: "varchar", length: 50})
    subtotal:number;

    @Column({type: "decimal", precision: 10, scale: 6, default: 0})
    // @Column({type: "varchar", length: 50})
    igvGeneral:number;

    @Column({type: "decimal", precision: 10, scale: 6, default: 0})
    // @Column({type: "varchar", length: 50})
    total:number;


    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Clientes)
    clientes:number;

    @ManyToOne(() => Ventas, ventas => ventas.comprobante)
    // @ManyToOne(() => Ventas)
    ventas:number;

    @ManyToOne(() => Locales)
    locales:number;


    @ManyToOne(() => Correlativos, (correlativos) => correlativos.comprobante)
    correlativos:number;

    // doble sentido
    @OneToMany(() => ComprobanteDetalles, comprobanteDetalles => comprobanteDetalles.comprobante, { onDelete: 'CASCADE' })
    comprobanteDetalles:ComprobanteDetalles[];



        
}


    // @Column({type: "varchar", length: 10, default: ""})
    // serie_documento:string;

    // @Column({type: "varchar", length: 255, default: ""})
    // nombre:string;

    // @Column({type: "varchar", length: 255, default: ""})
    // razonSocial:string;

    // @Column({type: "varchar", length: 255, default: ""})
    // nombreComercial:string;


    // @Column({type: "varchar", length: 20, default: ""})
    // telefono:string;

    // @Column({type: "varchar", length: 20, default: ""})
    // numero_documento:string;

    // @Column({type: "varchar", length: 30, default: ""})
    // email:string;


    // @Column({type: "varchar", length: 255, default: ""})
    // direccion:string;

    // @Column({type: "varchar", length: 30, default: ""})
    // departamento:string;

    // @Column({type: "varchar", length: 30, default: ""})
    // provincia:string;

    // @Column({type: "varchar", length: 30, default: ""})
    // distrito:string;

    // @Column({type: "varchar", length: 10, default: ""})
    // codigo_pais:string;

    // @Column({type: "int", default: 0})
    // ubigeo:number;


    // @Column({type: "varchar", length: 30, default: ""})
    // estado:string;
    
    // @Column({type: "varchar", length: 30, default: ""})
    // condom:string;


    
    // @CreateDateColumn()
    // created_at: Date;
 
    // @UpdateDateColumn()
    // updated_at: Date;



    // // bidireccional
    // @OneToMany(() => Ventas, (ventas) => ventas.clientes)
    // ventas:Ventas[];
import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { Ventas } from "./ventas.entity";

@Entity()
export class Clientes {

    @PrimaryGeneratedColumn()
    id:number;


    @Column({type: "varchar", length: 10})
    tipoDocumento:string;

    // @Column({type: "varchar", length: 10, default: ""})
    // serie_documento:string;

    @Column({type: "varchar", length: 255, default: ""})
    nombre:string;

    @Column({type: "varchar", length: 255, default: ""})
    razonSocial:string;

    @Column({type: "varchar", length: 255, default: ""})
    nombreComercial:string;


    @Column({type: "varchar", length: 20, default: ""})
    telefono:string;

    @Column({type: "varchar", length: 20, default: ""})
    numero_documento:string;

    @Column({type: "varchar", length: 30, default: ""})
    email:string;


    @Column({type: "varchar", length: 255, default: ""})
    direccion:string;

    @Column({type: "varchar", length: 30, default: ""})
    departamento:string;

    @Column({type: "varchar", length: 30, default: ""})
    provincia:string;

    @Column({type: "varchar", length: 30, default: ""})
    distrito:string;

    @Column({type: "varchar", length: 10, default: ""})
    codigo_pais:string;

    @Column({type: "int", default: 0})
    ubigeo:number;


    @Column({type: "varchar", length: 30, default: ""})
    estado:string;
    
    @Column({type: "varchar", length: 30, default: ""})
    condom:string;


    @Column({type: "varchar", length: 13, default: "Normal"})
    estado_cliente:string;

    
    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;



    // bidireccional
    @OneToMany(() => Ventas, (ventas) => ventas.clientes)
    ventas:Ventas[];
        
}
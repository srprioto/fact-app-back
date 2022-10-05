import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany
} from "typeorm";

// export enum TipoDocumento {
//     DNI = "ruc",
//     RUC = "dni"
// }

import { MovimientoDetalles } from "./movimiento_detalles.entity";

@Entity()
export class Proveedores {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 50})
    nombre:string;

    @Column({type: "varchar", length: 50})
    razon_social:string;

    @Column({type: "varchar", length: 70})
    direccion:string;

    @Column({type: "varchar", length: 20})
    telefono:string;

    @Column({type: "varchar", length: 20})
    tel_movil:string;

    @Column({type: "varchar", length: 40})
    nro_cuenta_bancaria:string;

    @Column({type: "varchar", length: 40})
    nombre_banco:string;

    @Column({type: "varchar", length: 40})
    nombre_titular:string;

    @Column({type: "varchar", length: 40})
    tipo_producto:string;

    // @Column({
    //     type: "enum",
    //     enum: TipoDocumento,
    //     default: TipoDocumento.DNI
    // })
    // tipo_documento:TipoDocumento

    @Column({type: "varchar", length: 20})
    tipo_documento:string;

    @Column({type: "varchar", length: 20, unique: true})
    documento:string;

    @Column({type: "varchar", length: 30, unique: true})
    email:string;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    // bidireccional
    @OneToMany(() => MovimientoDetalles, movimientoDetalles => movimientoDetalles.proveedores)
    movimientoDetalles:MovimientoDetalles[];
        
}
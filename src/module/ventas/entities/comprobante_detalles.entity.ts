import { 
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne
} from "typeorm";
import { Comprobante } from "./comprobante.entity";
import { Ventas } from "./ventas.entity";

@Entity()
export class ComprobanteDetalles {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 15})
    codigo:string;

    @Column({type: "varchar", length: 50})
    nombre:string;

    @Column({type: "varchar", length: 10})
    cantidad_venta:string;

    @Column({type: "decimal", precision: 10, scale: 6, default: 0})
    // @Column({type: "varchar", length: 50})
    igv:number;

    @Column({type: "decimal", precision: 10, scale: 6, default: 0})
    // @Column({type: "varchar", length: 50})
    unidad_sin_igv:number;

    @Column({type: "decimal", precision: 10, scale: 6, default: 0})
    // @Column({type: "varchar", length: 50})
    unidad_con_igv:number;


    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;
    

    @ManyToOne(() => Comprobante, (comprobante) => comprobante.comprobanteDetalles)
    comprobante:number;
        
}
import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    ManyToOne
} from "typeorm";
import { Locales } from "./locales.entity";

import { MovimientoDetalles } from "./movimiento_detalles.entity";

@Entity()
export class Movimientos {

    @PrimaryGeneratedColumn()
    id:number;
    
    // @Column({type: "varchar", length: 20})
    // tipo:string;
    
    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    subtotal:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    costo_transporte:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    costo_otros:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    total:number;

    @Column({type: "varchar", length: 255})
    observaciones:string;

    // @Column({type: "varchar", length: 50})
    // origen:string;

    // @Column({type: "varchar", length: 50})
    // destino:string;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    // aqui esta muchos
    @ManyToOne(() => Locales, locales => locales.movimientos)
    locales:Locales;



    // bidireccional
    @OneToMany(() => MovimientoDetalles, movimientoDetalles => movimientoDetalles.movimientos)
    movimientoDetalles:MovimientoDetalles[];


        
}
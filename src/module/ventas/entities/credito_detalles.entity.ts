import { 
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { Ventas } from "./ventas.entity";

@Entity()
export class CreditoDetalles {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    cantidad_pagada:number;

    @Column({type: "varchar", length: 255})
    nota:string;

    @Column({ type: 'date' })
    fecha_estimada:Date;
    

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    // relaciones
    @ManyToOne(() => Ventas, (ventas) => ventas.creditoDetalles)
    ventas:number;

}
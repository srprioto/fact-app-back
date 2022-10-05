import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Ventas } from './ventas.entity';

@Entity()
export class FormasPago {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 25})
    forma_pago:string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    precio_parcial:number;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne(() => Ventas, venta => venta.formasPago)
    venta:number;

}
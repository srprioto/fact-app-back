import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Ventas } from "./ventas.entity";

export class IngresosVentas {

    // @PrimaryGeneratedColumn()
    // id:number;

    // @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    // ingreso:number;

    // @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    // costo:number;

    // @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    // diferencia:number;


    // @ManyToOne(() => Ventas, (ventas) => ventas.ingresosVentas, { nullable: true })
    // @JoinColumn()
    // ventas:number;

}
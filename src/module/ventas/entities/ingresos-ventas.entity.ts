import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    // UpdateDateColumn,
    OneToOne,
    // ManyToOne,
    JoinColumn
} from "typeorm";
import { Ventas } from "./ventas.entity";

@Entity()
export class IngresosVentas {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 15})
    tipo_ingreso:string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    ingreso:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    costo:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    ganancia:number;

    @CreateDateColumn()
    created_at: Date;


    @OneToOne(() => Ventas, (ventas) => ventas.ingresosVentas, { nullable: true })
    @JoinColumn()
    ventas:number;

}
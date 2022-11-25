import { Locales } from "src/module/locales/entities/locales.entity";
import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
import { 
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";

@Entity()
export class IngresosEgresos {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    monto:number;

    @Column({type: "varchar", length: 200})
    descripcion:string;

    @Column({type: "varchar", length: 20})
    tipo:string; // ingreso o egreso


    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne(() => Usuarios)
    usuarios:number;
    
    @ManyToOne(() => Locales)
    locales:number;

}
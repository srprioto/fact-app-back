import { Locales } from "src/module/locales/entities/locales.entity";
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

@Entity()
export class Correlativos{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 30})
    descripcion:string;

    @Column({type: "varchar", length: 8})
    serie:string;

    @Column({type: "int"})
    correlativo:number;

    @Column({type: "varchar", length: 5})
    tipoComprobante:string;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;

    @ManyToOne(() => Locales, (locales) => locales.correlativos)
    locales:number;

    @OneToMany(() => Comprobante, comprobante => comprobante.correlativos)
    comprobante:Comprobante[];



}
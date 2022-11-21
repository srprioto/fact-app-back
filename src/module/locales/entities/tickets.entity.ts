import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
import { Locales } from "./locales.entity";
import { Ventas } from "src/module/ventas/entities/ventas.entity";

@Entity()
export class Tickets {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 90})
    titulo:string;

    @Column({type: "varchar", length: 255})
    descripcion:string;

    @Column({type: "varchar", length: 255, default: ""}) // informacion necesaria para movernos directamente al problema, separado por @s
    info_adicional:string;

    @Column({type: "varchar", length: 50, default: ""})
    tipo:string;

    @Column({type: "boolean", default: false}) //  visto, no visto / solucionado o no solucionado
    estado:boolean;

    @Column({type: "varchar", length: 100, nullable: true})
    relacion:string;


    @CreateDateColumn()
    created_at:Date;
 
    @UpdateDateColumn()
    updated_at:Date;


    @ManyToOne(() => Locales, { nullable: true })
    local:number;

    @ManyToOne(() => Usuarios, { nullable: true })
    usuario:number;

    // @ManyToOne(() => Ventas, { nullable: true })
    // comprobante:number;

}

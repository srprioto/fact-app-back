import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { Productos } from "./productos.entity";

@Entity()
export class Categorias {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 50})
    nombre:string;

    @Column({type: "varchar", length: 250})
    descripcion:string;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    // bidireccional
    @OneToMany(() => Productos, productos => productos.categorias)
    productos:Productos[];


    
        
}
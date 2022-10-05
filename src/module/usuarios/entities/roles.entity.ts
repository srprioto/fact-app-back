import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";

import { Usuarios } from "./usuarios.entity";

@Entity()
export class Roles {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar"})
    descripcion:string;

    @Column({type: "varchar", length: 50})
    rol:string;
    
    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    // bidireccional
    @OneToMany(() => Usuarios, usuarios => usuarios.roles)
    usuarios:Usuarios[];
        
}
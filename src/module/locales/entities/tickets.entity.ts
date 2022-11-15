// import { 
//     Entity, 
//     PrimaryGeneratedColumn,
//     Column, 
//     CreateDateColumn, 
//     UpdateDateColumn,
//     ManyToOne
// } from "typeorm";
// import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
// import { Locales } from "./locales.entity";

// @Entity()
// export class Proveedores {

//     @PrimaryGeneratedColumn()
//     id:number;

//     @Column({type: "varchar", length: 100})
//     titulo:string;

//     @Column({type: "varchar", length: 255})
//     descripcion:string;

//     @Column({type: "varchar", length: 255}) // informacion necesaria movernos directamente al problema, separado por @s
//     info_adicional:string;

//     @Column({type: "varchar", length: 50}) 
//     tipo:string;

//     @Column({type: "varchar", length: 20}) //  visto o no
//     estado:string;


//     @CreateDateColumn()
//     created_at:Date;
 
//     @UpdateDateColumn()
//     updated_at:Date;


//     @ManyToOne(() => Locales)
//     local:number;

//     @ManyToOne(() => Usuarios)
//     usuario:number;

// }

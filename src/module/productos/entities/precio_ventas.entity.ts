// import { 
//     PrimaryGeneratedColumn,
//     Column, 
//     Entity,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany
// } from "typeorm";
// import { Productos } from "./productos.entity";

// @Entity()
// export class PrecioVentas {

//     @PrimaryGeneratedColumn()
//     id:number;

//     @Column({type: "varchar", length: 50})
//     nombre:string;

//     @Column({type: "int"})
//     precio_venta:number;

//     @CreateDateColumn()
//     created_at: Date;
 
//     @UpdateDateColumn()
//     updated_at: Date;

    

    
// }

    // bidireccional
    // @OneToMany(() => Productos, productos => productos.precioVenta)
    // productos:Productos[];
import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne
} from "typeorm";

import { Ventas } from "src/module/ventas/entities/ventas.entity";
import { Roles } from "./roles.entity";
import { Productos } from "src/module/productos/entities/productos.entity";
import { Transacciones } from "src/module/locales/entities/transacciones.entity";
import { Caja } from "src/module/locales/entities/caja.entity";
import { Locales } from "src/module/locales/entities/locales.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Usuarios {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 100})
    nombre:string;

    @Column({type: "varchar", length: 20, unique: true})
    documento:string;

    @Column({type: "varchar", length: 100})
    direccion:string;

    @Column({type: "varchar", length: 19})
    telefono:string;

    @Column({type: "int", nullable: true})
    edad:number;
    
    // @Exclude()
    @Column({type: "varchar", length: 50, unique: true})
    email:string;

    @Exclude()
    @Column({type: "varchar", length: 150})
    password:string;
    
    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    
    @ManyToOne(() => Roles, roles => roles.usuarios)
    roles:number;

    @ManyToOne(() => Locales, locales => locales.usuarios)
    locales:number;
    

    // bidireccional
    @OneToMany(() => Ventas, ventas => ventas.usuarios)
    ventas:Ventas[];

    // @OneToMany(() => Productos, productos => productos.usuarios)
    // productos:Productos[];

    @OneToMany(() => Transacciones, transacciones => transacciones.usuarioEnvia)
    transaccionEnvia:Transacciones[];

    @OneToMany(() => Transacciones, transacciones => transacciones.usuarioEnvia)
    transaccionRecibe:Transacciones[];


    // @OneToMany(() => Caja, cajaAbre => cajaAbre.usuarioAbreCaja)
    // cajaAbre:Caja[];

    // @OneToMany(() => Caja, cajaCierra => cajaCierra.usuarioCierraCaja)
    // cajaCierra:Caja[];
    
        
}
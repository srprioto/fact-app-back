import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";

import { Locales } from "./locales.entity";
import { Productos } from "src/module/productos/entities/productos.entity";
import { MovimientoDetalles } from "./movimiento_detalles.entity";

@Entity()
export class LocalesStock {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "int"})
    cantidad:number;

    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    
    @ManyToOne(() => Locales, locales => locales.localesStock)
    locales:number;

    @ManyToOne(() => Productos, productos => productos.localesStock, { onDelete: 'CASCADE' })
    productos:number;


    // bidireccional
    @OneToMany(() => MovimientoDetalles, movimientoDetalles => movimientoDetalles.localesStock)
    movimientoDetalles:MovimientoDetalles[];
        
}
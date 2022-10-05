import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { Transacciones } from './transacciones.entity';
import { Productos } from 'src/module/productos/entities/productos.entity';


enum EstadoDetalle {
    enviado = "enviado",
    observado = "observado",
    listo = "listo",
    corregido = "corregido"
}

@Entity()
export class TransaccionDetalles {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    cantidad:number;

    // @Column({type: "varchar", length: 100, default: ""})
    // observacion:string;
    
    @Column({
        type: "enum",
        enum: EstadoDetalle,
        default: EstadoDetalle.enviado
    })
    estado_detalle:EstadoDetalle;



    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;
    
    
    // intentar cambiar a number

    @ManyToOne(() => Transacciones, (transacciones) => transacciones.transaccionDetalles, { onDelete: 'CASCADE' })
    transacciones:number;

    @ManyToOne(() => Productos, (productos) => productos.transaccionDetalles)
    productos:number;
    
}


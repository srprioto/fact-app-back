import { Usuarios } from 'src/module/usuarios/entities/usuarios.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

import { Locales } from './locales.entity';
import { TransaccionDetalles } from './transaccion_detalle.entity';


enum EstadoGeneral {
    enviado = "enviado",
    observado = "observado",
    listo = "listo",
    corregido = "corregido"
}

@Entity()
export class Transacciones {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 100, default: ""})
    descripcion:string;
    
    @Column({type: "varchar", length: 100, default: ""})
    observaciones:string;

    @Column({
        type: "enum",
        enum: EstadoGeneral,
        default: EstadoGeneral.enviado
    })
    estado_general:EstadoGeneral;



    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne(() => Locales, (localOrigen) => localOrigen.transaccionOrigen)
    localOrigen:number;

    @ManyToOne(() => Locales, (localDestino) => localDestino.transaccionDestino)
    localDestino:number;
    
    
    @ManyToOne(() => Usuarios, (usuariosEnvia) => usuariosEnvia.transaccionEnvia)
    usuarioEnvia:number;

    @ManyToOne(() => Usuarios, (usuariosEnvia) => usuariosEnvia.transaccionRecibe)
    usuarioRecibe:number;


    // bidireccional

    @OneToMany(() => TransaccionDetalles, transaccionDetalles => transaccionDetalles.transacciones)
    transaccionDetalles:TransaccionDetalles[];

}
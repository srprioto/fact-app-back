import { 
    PrimaryGeneratedColumn,
    Entity, 
    Column,
    ManyToOne,
    CreateDateColumn, 
    UpdateDateColumn,
} from "typeorm";

import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
import { Caja } from "./caja.entity";

// enum tipoMovimiento {
//     ingreso = "ingreso",
//     egreso = "egreso"
// }

@Entity()
export class CajaDetalles {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    monto_movimiento:number;

    @Column({type: "varchar", length: 30})
    tipo_movimiento:string;

    @Column({type: "varchar", length: 150})
    descripcion:string;

    @Column({type: "varchar", length: 25, default: "efectivo"})
    forma_pago:string;

    @CreateDateColumn() /* {type: 'timestamp'} */
    created_at: Date;
 
    @UpdateDateColumn() /* {type: 'timestamp'} */
    updated_at: Date;        


    //relacion aqui

    @ManyToOne(() => Caja, caja => caja.cajaDetalles)
    caja:number;

    @ManyToOne(() => Usuarios)
    usuario:number;


    

}
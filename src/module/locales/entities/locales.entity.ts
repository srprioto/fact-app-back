import { Usuarios } from "src/module/usuarios/entities/usuarios.entity";
import { Correlativos } from "src/module/ventas/entities/correlativos.entity";
import { Ventas } from "src/module/ventas/entities/ventas.entity";
import { 
    PrimaryGeneratedColumn,
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { Caja } from "./caja.entity";
import { LocalesStock } from "./locales_stock.entity";
import { Movimientos } from "./movimientos.entity";
import { Transacciones } from "./transacciones.entity";

enum TipoLocal {
    almacen = "almacen",
    tienda = "tienda"
}


@Entity()
export class Locales {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "varchar", length: 50})
    nombre:string;

    @Column({type: "varchar", length: 50})
    direccion:string;

    @Column({type: "varchar", length: 30})
    telefono:string;

    @Column({
        type: "enum",
        enum: TipoLocal,
        default: TipoLocal.tienda
    })
    tipo_local:TipoLocal;

    @Column({type: "int", default: 0})
    caja_actual:number;


    @CreateDateColumn()
    created_at: Date;
 
    @UpdateDateColumn()
    updated_at: Date;

    
    // bidireccional
    @OneToMany(() => LocalesStock, (localesStock) => localesStock.locales)
    localesStock:LocalesStock[];

    @OneToMany(() => Ventas, (ventas) => ventas.locales)
    ventas:Ventas[]; // revisar

    @OneToMany(() => Transacciones, (transacciones) => transacciones.localOrigen)
    transaccionOrigen:Transacciones[];
    
    @OneToMany(() => Transacciones, (transacciones) => transacciones.localDestino)
    transaccionDestino:Transacciones[];

    @OneToMany(() => Movimientos, (movimientos) => movimientos.locales)
    movimientos:Movimientos[];

    @OneToMany(() => Caja, (caja) => caja.locales)
    caja:Caja[];

    @OneToMany(() => Usuarios, (usuarios) => usuarios.locales, { nullable: true })
    usuarios:Usuarios[];

    @OneToMany(() => Correlativos, (correlativos) => correlativos.locales)
    correlativos:Correlativos[];
        

        
}
import {MigrationInterface, QueryRunner} from "typeorm";

export class init1690744871792 implements MigrationInterface {
    name = 'init1690744871792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`clientes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipoDocumento\` varchar(10) NOT NULL, \`nombre\` varchar(255) NOT NULL DEFAULT '', \`razonSocial\` varchar(255) NOT NULL DEFAULT '', \`nombreComercial\` varchar(255) NOT NULL DEFAULT '', \`telefono\` varchar(20) NOT NULL DEFAULT '', \`numero_documento\` varchar(20) NOT NULL DEFAULT '', \`email\` varchar(30) NOT NULL DEFAULT '', \`direccion\` varchar(255) NOT NULL DEFAULT '', \`departamento\` varchar(30) NOT NULL DEFAULT '', \`provincia\` varchar(30) NOT NULL DEFAULT '', \`distrito\` varchar(30) NOT NULL DEFAULT '', \`codigo_pais\` varchar(10) NOT NULL DEFAULT '', \`ubigeo\` int NOT NULL DEFAULT '0', \`estado\` varchar(30) NOT NULL DEFAULT '', \`condom\` varchar(30) NOT NULL DEFAULT '', \`estado_cliente\` varchar(13) NOT NULL DEFAULT 'Normal', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categorias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(50) NOT NULL, \`descripcion\` varchar(250) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comprobante_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(15) NOT NULL, \`nombre\` varchar(50) NOT NULL, \`cantidad_venta\` varchar(10) NOT NULL, \`igv\` decimal(10,6) NOT NULL DEFAULT '0.000000', \`unidad_sin_igv\` decimal(10,6) NOT NULL DEFAULT '0.000000', \`unidad_con_igv\` decimal(10,6) NOT NULL DEFAULT '0.000000', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`comprobanteId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comprobante\` (\`id\` int NOT NULL AUTO_INCREMENT, \`serie\` varchar(6) NOT NULL, \`tipo_venta\` varchar(12) NOT NULL, \`correlativo\` int NOT NULL, \`fecha_emision\` varchar(32) NOT NULL DEFAULT '', \`tipoMoneda\` varchar(5) NOT NULL, \`tipoOperacion\` varchar(5) NOT NULL, \`tipoComprobante\` varchar(5) NOT NULL, \`tipoDocumento\` varchar(5) NOT NULL, \`estado_sunat\` varchar(25) NOT NULL DEFAULT '', \`respuesta_sunat\` text NOT NULL, \`subtotal\` decimal(10,6) NOT NULL DEFAULT '0.000000', \`igvGeneral\` decimal(10,6) NOT NULL DEFAULT '0.000000', \`total\` decimal(10,6) NOT NULL DEFAULT '0.000000', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`clientesId\` int NULL, \`ventasId\` int NULL, \`localesId\` int NULL, \`correlativosId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`correlativos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(30) NOT NULL, \`serie\` varchar(8) NOT NULL, \`correlativo\` int NOT NULL, \`tipoComprobante\` varchar(5) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`caja\` (\`id\` int NOT NULL AUTO_INCREMENT, \`estado_caja\` tinyint NOT NULL DEFAULT 1, \`monto_apertura\` decimal(10,2) NOT NULL DEFAULT '0.00', \`monto_efectivo\` decimal(10,2) NOT NULL DEFAULT '0.00', \`monto_tarjeta\` decimal(10,2) NOT NULL DEFAULT '0.00', \`monto_pago_electronico\` decimal(10,2) NOT NULL DEFAULT '0.00', \`monto_deposito\` decimal(10,2) NOT NULL DEFAULT '0.00', \`otros_montos\` decimal(10,2) NOT NULL DEFAULT '0.00', \`cantidad_diferencia\` decimal(10,2) NOT NULL DEFAULT '0.00', \`nota_observacion\` varchar(255) NOT NULL DEFAULT '', \`codigo_venta_caja\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localesId\` int NULL, \`usuarioAbreId\` int NULL, \`usuarioCierraId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`proveedores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(50) NOT NULL, \`razon_social\` varchar(50) NOT NULL, \`direccion\` varchar(70) NOT NULL, \`telefono\` varchar(20) NOT NULL, \`tel_movil\` varchar(20) NOT NULL, \`nro_cuenta_bancaria\` varchar(40) NOT NULL, \`nombre_banco\` varchar(40) NOT NULL, \`nombre_titular\` varchar(40) NOT NULL, \`tipo_producto\` varchar(40) NOT NULL, \`tipo_documento\` varchar(20) NOT NULL, \`documento\` varchar(20) NOT NULL, \`email\` varchar(30) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e247f38137bdec0322e9448d68\` (\`documento\`), UNIQUE INDEX \`IDX_3a4c424917ccd705fa303d5274\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movimiento_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(255) NOT NULL, \`cantidad\` int NOT NULL, \`precio_unidad\` decimal(10,2) NOT NULL DEFAULT '0.00', \`precio_parcial\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productosId\` int NULL, \`localesStockId\` int NULL, \`movimientosId\` int NULL, \`proveedoresId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movimientos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`subtotal\` decimal(10,2) NOT NULL DEFAULT '0.00', \`costo_transporte\` decimal(10,2) NOT NULL DEFAULT '0.00', \`costo_otros\` decimal(10,2) NOT NULL DEFAULT '0.00', \`total\` decimal(10,2) NOT NULL DEFAULT '0.00', \`observaciones\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transaccion_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad\` int NOT NULL, \`estado_detalle\` enum ('enviado', 'observado', 'listo', 'corregido') NOT NULL DEFAULT 'enviado', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`transaccionesId\` int NULL, \`productosId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transacciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(100) NOT NULL DEFAULT '', \`observaciones\` varchar(100) NOT NULL DEFAULT '', \`estado_general\` enum ('enviado', 'observado', 'listo', 'corregido') NOT NULL DEFAULT 'enviado', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localOrigenId\` int NULL, \`localDestinoId\` int NULL, \`usuarioEnviaId\` int NULL, \`usuarioRecibeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`locales\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(50) NOT NULL, \`direccion\` varchar(50) NOT NULL, \`telefono\` varchar(30) NOT NULL, \`tipo_local\` enum ('almacen', 'tienda') NOT NULL DEFAULT 'tienda', \`caja_actual\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`locales_stock\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localesId\` int NULL, \`productosId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`productos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(15) NULL, \`nombre\` varchar(50) NOT NULL, \`descripcion\` varchar(255) NULL, \`marca\` varchar(50) NULL, \`color\` varchar(50) NULL, \`talla\` varchar(50) NULL, \`precio_compra\` decimal(5,2) NULL, \`precio_venta_1\` decimal(5,2) NULL, \`precio_venta_2\` decimal(5,2) NULL, \`precio_venta_3\` decimal(5,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`categoriasId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`venta_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad_venta\` int NOT NULL, \`descuento\` decimal(10,2) NOT NULL DEFAULT '0.00', \`forzar_venta\` tinyint NOT NULL, \`precio_venta\` decimal(10,2) NOT NULL DEFAULT '0.00', \`precio_parcial\` decimal(10,2) NOT NULL DEFAULT '0.00', \`venta_negativa\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ventasId\` int NULL, \`productosId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`formas_pago\` (\`id\` int NOT NULL AUTO_INCREMENT, \`forma_pago\` varchar(25) NOT NULL, \`precio_parcial\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ventaId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`credito_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad_pagada\` decimal(10,2) NOT NULL DEFAULT '0.00', \`nota\` varchar(255) NOT NULL, \`fecha_estimada\` timestamp NOT NULL, \`estado\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ventasId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ingresos_ventas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ingreso\` decimal(10,2) NOT NULL DEFAULT '0.00', \`costo\` decimal(10,2) NOT NULL DEFAULT '0.00', \`ganancia\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ventasId\` int NULL, UNIQUE INDEX \`REL_41179a04fa5b48f8b34718bbca\` (\`ventasId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ventas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo_venta\` varchar(12) NOT NULL, \`total\` decimal(10,2) NOT NULL DEFAULT '0.00', \`subtotal\` decimal(10,2) NOT NULL DEFAULT '0.00', \`observaciones\` varchar(255) NOT NULL, \`descuento_total\` decimal(10,2) NOT NULL DEFAULT '0.00', \`codigo_venta\` varchar(40) NOT NULL, \`estado_venta\` enum ('cotizacion', 'listo', 'anulado', 'enviado', 'rechazado') NOT NULL DEFAULT 'enviado', \`forma_pago\` varchar(25) NOT NULL, \`estado_producto\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`clientesId\` int NULL, \`usuariosId\` int NULL, \`localesId\` int NULL, \`cajaId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(255) NOT NULL, \`rol\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(100) NOT NULL, \`documento\` varchar(20) NOT NULL, \`direccion\` varchar(100) NOT NULL, \`telefono\` varchar(19) NOT NULL, \`edad\` int NULL, \`email\` varchar(50) NOT NULL, \`password\` varchar(150) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`rolesId\` int NULL, \`localesId\` int NULL, UNIQUE INDEX \`IDX_604e2077971f192d85cffb5c43\` (\`documento\`), UNIQUE INDEX \`IDX_446adfc18b35418aac32ae0b7b\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`caja_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monto_movimiento\` decimal(10,2) NOT NULL DEFAULT '0.00', \`tipo_movimiento\` varchar(30) NOT NULL, \`descripcion\` varchar(150) NOT NULL, \`forma_pago\` varchar(25) NOT NULL DEFAULT 'efectivo', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`cajaId\` int NULL, \`usuarioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(90) NOT NULL, \`descripcion\` varchar(255) NOT NULL, \`info_adicional\` varchar(255) NOT NULL DEFAULT '', \`tipo\` varchar(50) NOT NULL DEFAULT '', \`estado\` tinyint NOT NULL DEFAULT 0, \`relacion\` varchar(100) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localId\` int NULL, \`rolId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ingresos_egresos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monto\` decimal(10,2) NOT NULL DEFAULT '0.00', \`descripcion\` varchar(200) NOT NULL, \`tipo\` varchar(20) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`usuariosId\` int NULL, \`localesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comprobante_detalles\` ADD CONSTRAINT \`FK_a115fa229c111511fa248c52f95\` FOREIGN KEY (\`comprobanteId\`) REFERENCES \`comprobante\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD CONSTRAINT \`FK_fe8ef79694d401c8534b6f8d13b\` FOREIGN KEY (\`clientesId\`) REFERENCES \`clientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD CONSTRAINT \`FK_359ec9ddb97c552d84b65275961\` FOREIGN KEY (\`ventasId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD CONSTRAINT \`FK_b2f4bda52fc6c69fa7eabe6a7ce\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD CONSTRAINT \`FK_5ae7b0cbef9347ad69ccc2d45c3\` FOREIGN KEY (\`correlativosId\`) REFERENCES \`correlativos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`correlativos\` ADD CONSTRAINT \`FK_03f29f47c89d3102b1d017e1a94\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`caja\` ADD CONSTRAINT \`FK_5eead0234e7cdfbd7bada92eb16\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`caja\` ADD CONSTRAINT \`FK_22034d736505b9a46a09d072147\` FOREIGN KEY (\`usuarioAbreId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`caja\` ADD CONSTRAINT \`FK_8390f635b2531224239285ce039\` FOREIGN KEY (\`usuarioCierraId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` ADD CONSTRAINT \`FK_fd10815a61286d947d17cd8fa00\` FOREIGN KEY (\`productosId\`) REFERENCES \`productos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` ADD CONSTRAINT \`FK_f5a9589c5b21b42dc41e291bc70\` FOREIGN KEY (\`localesStockId\`) REFERENCES \`locales_stock\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` ADD CONSTRAINT \`FK_e6df5d30785b2a3903a5b947a86\` FOREIGN KEY (\`movimientosId\`) REFERENCES \`movimientos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` ADD CONSTRAINT \`FK_e4427ffa3df07fbb9c75615a49f\` FOREIGN KEY (\`proveedoresId\`) REFERENCES \`proveedores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movimientos\` ADD CONSTRAINT \`FK_c1de3f909eda57ffe0705bd7c08\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaccion_detalles\` ADD CONSTRAINT \`FK_e33a5108cbad5182902763e13f0\` FOREIGN KEY (\`transaccionesId\`) REFERENCES \`transacciones\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaccion_detalles\` ADD CONSTRAINT \`FK_ebbab8fdcc588d5ce6bdd8e14ca\` FOREIGN KEY (\`productosId\`) REFERENCES \`productos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transacciones\` ADD CONSTRAINT \`FK_dabe7cf910acbef502b83cced56\` FOREIGN KEY (\`localOrigenId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transacciones\` ADD CONSTRAINT \`FK_06f2e373bc8c8a254f451d79923\` FOREIGN KEY (\`localDestinoId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transacciones\` ADD CONSTRAINT \`FK_bb2d4f74ba5876f14e512078f85\` FOREIGN KEY (\`usuarioEnviaId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transacciones\` ADD CONSTRAINT \`FK_56d76f16c48b93a614dfcf3b9fd\` FOREIGN KEY (\`usuarioRecibeId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`locales_stock\` ADD CONSTRAINT \`FK_d4d283e5ecb898ed2107f1cb224\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`locales_stock\` ADD CONSTRAINT \`FK_fac91d07b50b8a694341f129859\` FOREIGN KEY (\`productosId\`) REFERENCES \`productos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_3150a2e74c18cfaddca910c9a8a\` FOREIGN KEY (\`categoriasId\`) REFERENCES \`categorias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` ADD CONSTRAINT \`FK_a29a86cedb65de7f32bd21ffb3b\` FOREIGN KEY (\`ventasId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` ADD CONSTRAINT \`FK_293ee0e62a64585b9199b7a642f\` FOREIGN KEY (\`productosId\`) REFERENCES \`productos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`formas_pago\` ADD CONSTRAINT \`FK_c91d7d3e90db32cc6894f0e853e\` FOREIGN KEY (\`ventaId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` ADD CONSTRAINT \`FK_500a2e96f6813c057e6809d60d1\` FOREIGN KEY (\`ventasId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` ADD CONSTRAINT \`FK_41179a04fa5b48f8b34718bbcab\` FOREIGN KEY (\`ventasId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD CONSTRAINT \`FK_c1757b34fb8e1af7ac5690f3604\` FOREIGN KEY (\`clientesId\`) REFERENCES \`clientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD CONSTRAINT \`FK_9982698a1a1b743beb654a4c397\` FOREIGN KEY (\`usuariosId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD CONSTRAINT \`FK_5798e96c3c48bf699aa1216a95b\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD CONSTRAINT \`FK_5e5e1d3e4dad9d6018934092077\` FOREIGN KEY (\`cajaId\`) REFERENCES \`caja\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_0f73c06a00d028e3e06654fef55\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_666688de04c086bf3319ac86cbd\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` ADD CONSTRAINT \`FK_b881595a760ec7deaa2b78eafb5\` FOREIGN KEY (\`cajaId\`) REFERENCES \`caja\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` ADD CONSTRAINT \`FK_b0e2508d798eba41ef60d718c91\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_410526b8f1e6b8bff298f3ec668\` FOREIGN KEY (\`localId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_a5eaca40280989810b5084c888a\` FOREIGN KEY (\`rolId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` ADD CONSTRAINT \`FK_85c63a6c8c3f8f6e6a292c6d549\` FOREIGN KEY (\`usuariosId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` ADD CONSTRAINT \`FK_02e7ba8ceb28ff3bed6b91f4a69\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` DROP FOREIGN KEY \`FK_02e7ba8ceb28ff3bed6b91f4a69\``);
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` DROP FOREIGN KEY \`FK_85c63a6c8c3f8f6e6a292c6d549\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_a5eaca40280989810b5084c888a\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_410526b8f1e6b8bff298f3ec668\``);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` DROP FOREIGN KEY \`FK_b0e2508d798eba41ef60d718c91\``);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` DROP FOREIGN KEY \`FK_b881595a760ec7deaa2b78eafb5\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_666688de04c086bf3319ac86cbd\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_0f73c06a00d028e3e06654fef55\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP FOREIGN KEY \`FK_5e5e1d3e4dad9d6018934092077\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP FOREIGN KEY \`FK_5798e96c3c48bf699aa1216a95b\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP FOREIGN KEY \`FK_9982698a1a1b743beb654a4c397\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP FOREIGN KEY \`FK_c1757b34fb8e1af7ac5690f3604\``);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` DROP FOREIGN KEY \`FK_41179a04fa5b48f8b34718bbcab\``);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` DROP FOREIGN KEY \`FK_500a2e96f6813c057e6809d60d1\``);
        await queryRunner.query(`ALTER TABLE \`formas_pago\` DROP FOREIGN KEY \`FK_c91d7d3e90db32cc6894f0e853e\``);
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` DROP FOREIGN KEY \`FK_293ee0e62a64585b9199b7a642f\``);
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` DROP FOREIGN KEY \`FK_a29a86cedb65de7f32bd21ffb3b\``);
        await queryRunner.query(`ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_3150a2e74c18cfaddca910c9a8a\``);
        await queryRunner.query(`ALTER TABLE \`locales_stock\` DROP FOREIGN KEY \`FK_fac91d07b50b8a694341f129859\``);
        await queryRunner.query(`ALTER TABLE \`locales_stock\` DROP FOREIGN KEY \`FK_d4d283e5ecb898ed2107f1cb224\``);
        await queryRunner.query(`ALTER TABLE \`transacciones\` DROP FOREIGN KEY \`FK_56d76f16c48b93a614dfcf3b9fd\``);
        await queryRunner.query(`ALTER TABLE \`transacciones\` DROP FOREIGN KEY \`FK_bb2d4f74ba5876f14e512078f85\``);
        await queryRunner.query(`ALTER TABLE \`transacciones\` DROP FOREIGN KEY \`FK_06f2e373bc8c8a254f451d79923\``);
        await queryRunner.query(`ALTER TABLE \`transacciones\` DROP FOREIGN KEY \`FK_dabe7cf910acbef502b83cced56\``);
        await queryRunner.query(`ALTER TABLE \`transaccion_detalles\` DROP FOREIGN KEY \`FK_ebbab8fdcc588d5ce6bdd8e14ca\``);
        await queryRunner.query(`ALTER TABLE \`transaccion_detalles\` DROP FOREIGN KEY \`FK_e33a5108cbad5182902763e13f0\``);
        await queryRunner.query(`ALTER TABLE \`movimientos\` DROP FOREIGN KEY \`FK_c1de3f909eda57ffe0705bd7c08\``);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` DROP FOREIGN KEY \`FK_e4427ffa3df07fbb9c75615a49f\``);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` DROP FOREIGN KEY \`FK_e6df5d30785b2a3903a5b947a86\``);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` DROP FOREIGN KEY \`FK_f5a9589c5b21b42dc41e291bc70\``);
        await queryRunner.query(`ALTER TABLE \`movimiento_detalles\` DROP FOREIGN KEY \`FK_fd10815a61286d947d17cd8fa00\``);
        await queryRunner.query(`ALTER TABLE \`caja\` DROP FOREIGN KEY \`FK_8390f635b2531224239285ce039\``);
        await queryRunner.query(`ALTER TABLE \`caja\` DROP FOREIGN KEY \`FK_22034d736505b9a46a09d072147\``);
        await queryRunner.query(`ALTER TABLE \`caja\` DROP FOREIGN KEY \`FK_5eead0234e7cdfbd7bada92eb16\``);
        await queryRunner.query(`ALTER TABLE \`correlativos\` DROP FOREIGN KEY \`FK_03f29f47c89d3102b1d017e1a94\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP FOREIGN KEY \`FK_5ae7b0cbef9347ad69ccc2d45c3\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP FOREIGN KEY \`FK_b2f4bda52fc6c69fa7eabe6a7ce\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP FOREIGN KEY \`FK_359ec9ddb97c552d84b65275961\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP FOREIGN KEY \`FK_fe8ef79694d401c8534b6f8d13b\``);
        await queryRunner.query(`ALTER TABLE \`comprobante_detalles\` DROP FOREIGN KEY \`FK_a115fa229c111511fa248c52f95\``);
        await queryRunner.query(`DROP TABLE \`ingresos_egresos\``);
        await queryRunner.query(`DROP TABLE \`tickets\``);
        await queryRunner.query(`DROP TABLE \`caja_detalles\``);
        await queryRunner.query(`DROP INDEX \`IDX_446adfc18b35418aac32ae0b7b\` ON \`usuarios\``);
        await queryRunner.query(`DROP INDEX \`IDX_604e2077971f192d85cffb5c43\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`ventas\``);
        await queryRunner.query(`DROP INDEX \`REL_41179a04fa5b48f8b34718bbca\` ON \`ingresos_ventas\``);
        await queryRunner.query(`DROP TABLE \`ingresos_ventas\``);
        await queryRunner.query(`DROP TABLE \`credito_detalles\``);
        await queryRunner.query(`DROP TABLE \`formas_pago\``);
        await queryRunner.query(`DROP TABLE \`venta_detalles\``);
        await queryRunner.query(`DROP TABLE \`productos\``);
        await queryRunner.query(`DROP TABLE \`locales_stock\``);
        await queryRunner.query(`DROP TABLE \`locales\``);
        await queryRunner.query(`DROP TABLE \`transacciones\``);
        await queryRunner.query(`DROP TABLE \`transaccion_detalles\``);
        await queryRunner.query(`DROP TABLE \`movimientos\``);
        await queryRunner.query(`DROP TABLE \`movimiento_detalles\``);
        await queryRunner.query(`DROP INDEX \`IDX_3a4c424917ccd705fa303d5274\` ON \`proveedores\``);
        await queryRunner.query(`DROP INDEX \`IDX_e247f38137bdec0322e9448d68\` ON \`proveedores\``);
        await queryRunner.query(`DROP TABLE \`proveedores\``);
        await queryRunner.query(`DROP TABLE \`caja\``);
        await queryRunner.query(`DROP TABLE \`correlativos\``);
        await queryRunner.query(`DROP TABLE \`comprobante\``);
        await queryRunner.query(`DROP TABLE \`comprobante_detalles\``);
        await queryRunner.query(`DROP TABLE \`categorias\``);
        await queryRunner.query(`DROP TABLE \`clientes\``);
    }

}
import {MigrationInterface, QueryRunner} from "typeorm";

export class init1667884712332 implements MigrationInterface {
    name = 'init1667884712332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ingresos_ventas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo_ingreso\` varchar(15) NOT NULL, \`ingreso\` decimal(10,2) NOT NULL DEFAULT '0.00', \`costo\` decimal(10,2) NOT NULL DEFAULT '0.00', \`ganancia\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ventasId\` int NULL, UNIQUE INDEX \`REL_41179a04fa5b48f8b34718bbca\` (\`ventasId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` DROP COLUMN \`estado_venta_detalle\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`cajaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` ADD \`tipo_movimiento\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` ADD \`forma_pago\` varchar(25) NOT NULL DEFAULT 'efectivo'`);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` CHANGE \`fecha_estimada\` \`fecha_estimada\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` ADD CONSTRAINT \`FK_41179a04fa5b48f8b34718bbcab\` FOREIGN KEY (\`ventasId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD CONSTRAINT \`FK_5e5e1d3e4dad9d6018934092077\` FOREIGN KEY (\`cajaId\`) REFERENCES \`caja\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP FOREIGN KEY \`FK_5e5e1d3e4dad9d6018934092077\``);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` DROP FOREIGN KEY \`FK_41179a04fa5b48f8b34718bbcab\``);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` CHANGE \`fecha_estimada\` \`fecha_estimada\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` DROP COLUMN \`forma_pago\``);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` DROP COLUMN \`tipo_movimiento\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`cajaId\``);
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` ADD \`estado_venta_detalle\` enum ('enviado', 'rechazado', 'listo') CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL DEFAULT 'enviado'`);
        await queryRunner.query(`DROP INDEX \`REL_41179a04fa5b48f8b34718bbca\` ON \`ingresos_ventas\``);
        await queryRunner.query(`DROP TABLE \`ingresos_ventas\``);
    }

}

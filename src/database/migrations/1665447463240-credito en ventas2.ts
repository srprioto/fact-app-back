import {MigrationInterface, QueryRunner} from "typeorm";

export class creditoEnVentas21665447463240 implements MigrationInterface {
    name = 'creditoEnVentas21665447463240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`credito_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad_pagada\` decimal(10,2) NOT NULL DEFAULT '0.00', \`nota\` varchar(255) NOT NULL, \`fecha_estimada\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ventasId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`estado_producto\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`totalPagado\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` ADD CONSTRAINT \`FK_500a2e96f6813c057e6809d60d1\` FOREIGN KEY (\`ventasId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` DROP FOREIGN KEY \`FK_500a2e96f6813c057e6809d60d1\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`totalPagado\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`estado_producto\``);
        await queryRunner.query(`DROP TABLE \`credito_detalles\``);
    }

}

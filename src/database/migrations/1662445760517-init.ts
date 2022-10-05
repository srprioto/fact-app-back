import {MigrationInterface, QueryRunner} from "typeorm";

export class init1662445760517 implements MigrationInterface {
    name = 'init1662445760517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e9355d00b489aef35a3dbb5ea7\` ON \`roles\``);
        await queryRunner.query(`CREATE TABLE \`correlativos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(30) NOT NULL, \`serie\` varchar(8) NOT NULL, \`correlativo\` int NOT NULL, \`tipoComprobante\` varchar(5) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD \`tipo_venta\` varchar(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD \`correlativo\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD \`correlativosId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`tipo_venta\` varchar(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`codigo\` \`codigo\` varchar(15) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`descripcion\` \`descripcion\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`marca\` \`marca\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`color\` \`color\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`talla\` \`talla\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_compra\` \`precio_compra\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_venta_1\` \`precio_venta_1\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_venta_2\` \`precio_venta_2\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_venta_3\` \`precio_venta_3\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`ventas\` CHANGE \`serie\` \`serie\` varchar(10) NULL`);
        await queryRunner.query(`ALTER TABLE \`comprobante\` ADD CONSTRAINT \`FK_5ae7b0cbef9347ad69ccc2d45c3\` FOREIGN KEY (\`correlativosId\`) REFERENCES \`correlativos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`correlativos\` ADD CONSTRAINT \`FK_03f29f47c89d3102b1d017e1a94\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`correlativos\` DROP FOREIGN KEY \`FK_03f29f47c89d3102b1d017e1a94\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP FOREIGN KEY \`FK_5ae7b0cbef9347ad69ccc2d45c3\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` CHANGE \`serie\` \`serie\` varchar(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_venta_3\` \`precio_venta_3\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_venta_2\` \`precio_venta_2\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_venta_1\` \`precio_venta_1\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`precio_compra\` \`precio_compra\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`talla\` \`talla\` varchar(50) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`color\` \`color\` varchar(50) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`marca\` \`marca\` varchar(50) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`descripcion\` \`descripcion\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`productos\` CHANGE \`codigo\` \`codigo\` varchar(15) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`tipo_venta\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP COLUMN \`correlativosId\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP COLUMN \`correlativo\``);
        await queryRunner.query(`ALTER TABLE \`comprobante\` DROP COLUMN \`tipo_venta\``);
        await queryRunner.query(`DROP TABLE \`correlativos\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e9355d00b489aef35a3dbb5ea7\` ON \`roles\` (\`rol\`)`);
    }

}

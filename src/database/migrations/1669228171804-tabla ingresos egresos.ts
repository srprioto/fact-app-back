import {MigrationInterface, QueryRunner} from "typeorm";

export class tablaIngresosEgresos1669228171804 implements MigrationInterface {
    name = 'tablaIngresosEgresos1669228171804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ingresos_egresos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monto\` decimal(10,2) NOT NULL DEFAULT '0.00', \`descripcion\` varchar(200) NOT NULL, \`tipo\` varchar(20) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`usuariosId\` int NULL, \`localesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` ADD CONSTRAINT \`FK_85c63a6c8c3f8f6e6a292c6d549\` FOREIGN KEY (\`usuariosId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` ADD CONSTRAINT \`FK_02e7ba8ceb28ff3bed6b91f4a69\` FOREIGN KEY (\`localesId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` DROP FOREIGN KEY \`FK_02e7ba8ceb28ff3bed6b91f4a69\``);
        await queryRunner.query(`ALTER TABLE \`ingresos_egresos\` DROP FOREIGN KEY \`FK_85c63a6c8c3f8f6e6a292c6d549\``);
        await queryRunner.query(`DROP TABLE \`ingresos_egresos\``);
    }

}

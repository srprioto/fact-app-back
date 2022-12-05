import {MigrationInterface, QueryRunner} from "typeorm";

export class init1670215964450 implements MigrationInterface {
    name = 'init1670215964450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(90) NOT NULL, \`descripcion\` varchar(255) NOT NULL, \`info_adicional\` varchar(255) NOT NULL DEFAULT '', \`tipo\` varchar(50) NOT NULL DEFAULT '', \`estado\` tinyint NOT NULL DEFAULT 0, \`relacion\` varchar(100) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localId\` int NULL, \`rolId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ingresos_egresos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`monto\` decimal(10,2) NOT NULL DEFAULT '0.00', \`descripcion\` varchar(200) NOT NULL, \`tipo\` varchar(20) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`usuariosId\` int NULL, \`localesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` DROP COLUMN \`tipo_ingreso\``);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` CHANGE \`fecha_estimada\` \`fecha_estimada\` timestamp NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` CHANGE \`fecha_estimada\` \`fecha_estimada\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` ADD \`tipo_ingreso\` varchar(15) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`DROP TABLE \`ingresos_egresos\``);
        await queryRunner.query(`DROP TABLE \`tickets\``);
    }

}

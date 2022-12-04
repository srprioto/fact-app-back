import {MigrationInterface, QueryRunner} from "typeorm";

export class desactivarTipoIngreso1669961595140 implements MigrationInterface {
    name = 'desactivarTipoIngreso1669961595140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` DROP COLUMN \`tipo_ingreso\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` ADD \`tipo_ingreso\` varchar(15) NOT NULL`);
    }

}

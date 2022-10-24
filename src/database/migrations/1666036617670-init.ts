import {MigrationInterface, QueryRunner} from "typeorm";

export class init1666036617670 implements MigrationInterface {
    name = 'init1666036617670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` DROP COLUMN \`fecha_estimada\``);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` ADD \`fecha_estimada\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` DROP COLUMN \`fecha_estimada\``);
        await queryRunner.query(`ALTER TABLE \`credito_detalles\` ADD \`fecha_estimada\` varchar(32) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`created_at\``);
    }

}

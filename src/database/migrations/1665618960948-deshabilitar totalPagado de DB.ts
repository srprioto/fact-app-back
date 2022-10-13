import {MigrationInterface, QueryRunner} from "typeorm";

export class deshabilitarTotalPagadoDeDB1665618960948 implements MigrationInterface {
    name = 'deshabilitarTotalPagadoDeDB1665618960948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`totalPagado\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`totalPagado\` decimal NOT NULL DEFAULT '0.00'`);
    }

}

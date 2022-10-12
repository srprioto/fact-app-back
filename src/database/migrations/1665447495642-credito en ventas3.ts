import {MigrationInterface, QueryRunner} from "typeorm";

export class creditoEnVentas31665447495642 implements MigrationInterface {
    name = 'creditoEnVentas31665447495642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`serie\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`serie\` varchar(10) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL`);
    }

}

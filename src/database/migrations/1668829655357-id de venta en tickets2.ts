import {MigrationInterface, QueryRunner} from "typeorm";

export class idDeVentaEnTickets21668829655357 implements MigrationInterface {
    name = 'idDeVentaEnTickets21668829655357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`titulo\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`titulo\` varchar(90) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`titulo\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`titulo\` varchar(100) NOT NULL`);
    }

}

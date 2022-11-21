import {MigrationInterface, QueryRunner} from "typeorm";

export class idDeVentaEnTickets1668829377833 implements MigrationInterface {
    name = 'idDeVentaEnTickets1668829377833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`ventaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_6418046b0c37ebc02a82c41ae76\` FOREIGN KEY (\`ventaId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_6418046b0c37ebc02a82c41ae76\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`ventaId\``);
    }

}

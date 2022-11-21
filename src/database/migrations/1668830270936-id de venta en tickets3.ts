import {MigrationInterface, QueryRunner} from "typeorm";

export class idDeVentaEnTickets31668830270936 implements MigrationInterface {
    name = 'idDeVentaEnTickets31668830270936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_6418046b0c37ebc02a82c41ae76\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`ventaId\` \`comprobanteId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_b0245dcfad66332d4be7e73c2c9\` FOREIGN KEY (\`comprobanteId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_b0245dcfad66332d4be7e73c2c9\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`comprobanteId\` \`ventaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_6418046b0c37ebc02a82c41ae76\` FOREIGN KEY (\`ventaId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

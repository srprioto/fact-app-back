import {MigrationInterface, QueryRunner} from "typeorm";

export class idDeVentaEnTickets41668830949808 implements MigrationInterface {
    name = 'idDeVentaEnTickets41668830949808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`estado\` \`estado\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`estado\` \`estado\` tinyint NOT NULL DEFAULT '1'`);
    }

}

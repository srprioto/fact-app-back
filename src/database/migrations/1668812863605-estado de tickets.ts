import {MigrationInterface, QueryRunner} from "typeorm";

export class estadoDeTickets1668812863605 implements MigrationInterface {
    name = 'estadoDeTickets1668812863605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`tipo\` \`tipo\` varchar(50) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`estado\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`estado\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`tipo\` \`tipo\` varchar(50) NOT NULL`);
    }

}

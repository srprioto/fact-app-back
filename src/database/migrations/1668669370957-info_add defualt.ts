import {MigrationInterface, QueryRunner} from "typeorm";

export class infoAddDefualt1668669370957 implements MigrationInterface {
    name = 'infoAddDefualt1668669370957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`info_adicional\` \`info_adicional\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`info_adicional\` \`info_adicional\` varchar(255) NOT NULL`);
    }

}

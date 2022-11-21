import {MigrationInterface, QueryRunner} from "typeorm";

export class relacionEnvezDeComprobante1668836193186 implements MigrationInterface {
    name = 'relacionEnvezDeComprobante1668836193186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_b0245dcfad66332d4be7e73c2c9\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`comprobanteId\` \`relacion\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`relacion\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`relacion\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`relacion\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`relacion\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`relacion\` \`comprobanteId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_b0245dcfad66332d4be7e73c2c9\` FOREIGN KEY (\`comprobanteId\`) REFERENCES \`ventas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

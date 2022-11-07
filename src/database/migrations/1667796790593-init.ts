import {MigrationInterface, QueryRunner} from "typeorm";

export class init1667796790593 implements MigrationInterface {
    name = 'init1667796790593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_41179a04fa5b48f8b34718bbca\` ON \`ingresos_ventas\``);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` ADD \`tipo_ingreso\` varchar(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` DROP COLUMN \`tipo_ingreso\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_41179a04fa5b48f8b34718bbca\` ON \`ingresos_ventas\` (\`ventasId\`)`);
    }

}

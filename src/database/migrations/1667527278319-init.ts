import {MigrationInterface, QueryRunner} from "typeorm";

export class init1667527278319 implements MigrationInterface {
    name = 'init1667527278319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD \`cajaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ventas\` ADD CONSTRAINT \`FK_5e5e1d3e4dad9d6018934092077\` FOREIGN KEY (\`cajaId\`) REFERENCES \`caja\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP FOREIGN KEY \`FK_5e5e1d3e4dad9d6018934092077\``);
        await queryRunner.query(`ALTER TABLE \`ventas\` DROP COLUMN \`cajaId\``);
    }

}

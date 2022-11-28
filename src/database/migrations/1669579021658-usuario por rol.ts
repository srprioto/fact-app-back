import {MigrationInterface, QueryRunner} from "typeorm";

export class usuarioPorRol1669579021658 implements MigrationInterface {
    name = 'usuarioPorRol1669579021658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_f7090ae3882022373a62f17001e\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`usuarioId\` \`rolId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_a5eaca40280989810b5084c888a\` FOREIGN KEY (\`rolId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_a5eaca40280989810b5084c888a\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` CHANGE \`rolId\` \`usuarioId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_f7090ae3882022373a62f17001e\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

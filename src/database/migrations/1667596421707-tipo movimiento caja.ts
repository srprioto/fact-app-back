import {MigrationInterface, QueryRunner} from "typeorm";

export class tipoMovimientoCaja1667596421707 implements MigrationInterface {
    name = 'tipoMovimientoCaja1667596421707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` ADD \`tipo_movimiento\` varchar(30) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` DROP COLUMN \`tipo_movimiento\``);
    }

}

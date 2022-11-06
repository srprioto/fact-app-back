import {MigrationInterface, QueryRunner} from "typeorm";

export class formasPagoEnCreditoDetalles1667686180850 implements MigrationInterface {
    name = 'formasPagoEnCreditoDetalles1667686180850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` ADD \`forma_pago\` varchar(25) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` DROP COLUMN \`forma_pago\``);
    }

}

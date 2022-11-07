import {MigrationInterface, QueryRunner} from "typeorm";

export class desactivarEstadoVentaDetalles1667783048800 implements MigrationInterface {
    name = 'desactivarEstadoVentaDetalles1667783048800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` DROP COLUMN \`estado_venta_detalle\``);
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` CHANGE \`forma_pago\` \`forma_pago\` varchar(25) NOT NULL DEFAULT 'efectivo'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`caja_detalles\` CHANGE \`forma_pago\` \`forma_pago\` varchar(25) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`venta_detalles\` ADD \`estado_venta_detalle\` enum ('enviado', 'rechazado', 'listo') CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL DEFAULT 'enviado'`);
    }

}

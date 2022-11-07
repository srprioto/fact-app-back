import {MigrationInterface, QueryRunner} from "typeorm";

export class ingresosVentasGanancia1667798163373 implements MigrationInterface {
    name = 'ingresosVentasGanancia1667798163373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` CHANGE \`diferencia\` \`ganancia\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` CHANGE \`ganancia\` \`ganancia\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` CHANGE \`ganancia\` \`ganancia\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`ingresos_ventas\` CHANGE \`ganancia\` \`diferencia\` decimal NOT NULL DEFAULT '0.00'`);
    }

}

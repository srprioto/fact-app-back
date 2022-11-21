import {MigrationInterface, QueryRunner} from "typeorm";

export class init1668666731134 implements MigrationInterface {
    name = 'init1668666731134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3a4c424917ccd705fa303d5274\` ON \`proveedores\``);
        await queryRunner.query(`DROP INDEX \`IDX_e247f38137bdec0322e9448d68\` ON \`proveedores\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`razon_social\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`direccion\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`telefono\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tel_movil\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nro_cuenta_bancaria\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nombre_banco\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nombre_titular\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tipo_producto\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tipo_documento\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`documento\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nombre\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`razon_social\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`direccion\` varchar(70) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`telefono\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tel_movil\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nro_cuenta_bancaria\` varchar(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nombre_banco\` varchar(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nombre_titular\` varchar(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tipo_producto\` varchar(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tipo_documento\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`documento\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD UNIQUE INDEX \`IDX_e247f38137bdec0322e9448d68\` (\`documento\`)`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`email\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD UNIQUE INDEX \`IDX_3a4c424917ccd705fa303d5274\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`titulo\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`descripcion\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`info_adicional\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tipo\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`estado\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`localId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`usuarioId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD CONSTRAINT \`FK_f38768af95cf526fc42df498014\` FOREIGN KEY (\`localId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD CONSTRAINT \`FK_71093900a106a0285ba5560644f\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP FOREIGN KEY \`FK_71093900a106a0285ba5560644f\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP FOREIGN KEY \`FK_f38768af95cf526fc42df498014\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`usuarioId\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`localId\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tipo\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`info_adicional\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`descripcion\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`titulo\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP INDEX \`IDX_3a4c424917ccd705fa303d5274\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP INDEX \`IDX_e247f38137bdec0322e9448d68\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`documento\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tipo_documento\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tipo_producto\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nombre_titular\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nombre_banco\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nro_cuenta_bancaria\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tel_movil\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`telefono\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`direccion\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`razon_social\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`email\` varchar(30) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`documento\` varchar(20) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tipo_documento\` varchar(20) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tipo_producto\` varchar(40) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nombre_titular\` varchar(40) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nombre_banco\` varchar(40) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nro_cuenta_bancaria\` varchar(40) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tel_movil\` varchar(20) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`telefono\` varchar(20) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`direccion\` varchar(70) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`razon_social\` varchar(50) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`nombre\` varchar(50) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e247f38137bdec0322e9448d68\` ON \`proveedores\` (\`documento\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_3a4c424917ccd705fa303d5274\` ON \`proveedores\` (\`email\`)`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class correccionTickets1668666958262 implements MigrationInterface {
    name = 'correccionTickets1668666958262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP FOREIGN KEY \`FK_71093900a106a0285ba5560644f\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP FOREIGN KEY \`FK_f38768af95cf526fc42df498014\``);
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(100) NOT NULL, \`descripcion\` varchar(255) NOT NULL, \`info_adicional\` varchar(255) NOT NULL, \`tipo\` varchar(50) NOT NULL, \`estado\` varchar(20) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`localId\` int NULL, \`usuarioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`descripcion\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`info_adicional\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`localId\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`tipo\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`titulo\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` DROP COLUMN \`usuarioId\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_410526b8f1e6b8bff298f3ec668\` FOREIGN KEY (\`localId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_f7090ae3882022373a62f17001e\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_f7090ae3882022373a62f17001e\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_410526b8f1e6b8bff298f3ec668\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`usuarioId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`titulo\` varchar(100) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`tipo\` varchar(50) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`localId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`info_adicional\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`estado\` varchar(20) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD \`descripcion\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL`);
        await queryRunner.query(`DROP TABLE \`tickets\``);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD CONSTRAINT \`FK_f38768af95cf526fc42df498014\` FOREIGN KEY (\`localId\`) REFERENCES \`locales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proveedores\` ADD CONSTRAINT \`FK_71093900a106a0285ba5560644f\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

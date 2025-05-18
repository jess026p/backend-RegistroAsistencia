import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLunchTimeColumns1716030000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE core.horarios
            ADD COLUMN hora_almuerzo_salida time,
            ADD COLUMN hora_almuerzo_regreso time;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE core.horarios
            DROP COLUMN hora_almuerzo_salida,
            DROP COLUMN hora_almuerzo_regreso;
        `);
    }
} 
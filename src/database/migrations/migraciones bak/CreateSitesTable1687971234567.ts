import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSitesTable1687971234567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE core.sites (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR NOT NULL,
                latitude float NOT NULL,
                longitude float NOT NULL,
                radius float NOT NULL,
                schedules jsonb,
                employee_id uuid NOT NULL,
                CONSTRAINT fk_employee FOREIGN KEY(employee_id) REFERENCES core.employees(id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE core.sites;`);
    }
}
import { MigrationInterface, QueryRunner } from "typeorm";

export class test1667066920762 implements MigrationInterface {
    name = 'test1667066920762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "survey" ("id" SERIAL NOT NULL, "budget" integer NOT NULL, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "survey"`);
    }

}

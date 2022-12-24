import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1670660449203 implements MigrationInterface {
    name = '$npmConfigName1670660449203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "contact" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "stripeId" character varying NOT NULL, "status" character varying NOT NULL, "start_date" integer NOT NULL, "ended_at" integer NOT NULL, "customer" character varying NOT NULL, "trial_start" integer NOT NULL, "trial_end" integer NOT NULL, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_afb047fa0ccaa6477e390fdd598" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_afb047fa0ccaa6477e390fdd598"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "title"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}

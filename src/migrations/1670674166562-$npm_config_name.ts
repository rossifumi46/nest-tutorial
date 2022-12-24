import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1670674166562 implements MigrationInterface {
    name = '$npmConfigName1670674166562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stripeCustomerId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "trialUsed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "subscriptionStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ended_at" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ended_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "subscriptionStatus"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "trialUsed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripeCustomerId"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1670692965870 implements MigrationInterface {
    name = '$npmConfigName1670692965870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "ended_at" TO "current_period_end"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "current_period_end" TO "ended_at"`);
    }

}

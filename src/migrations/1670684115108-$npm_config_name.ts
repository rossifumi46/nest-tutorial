import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1670684115108 implements MigrationInterface {
    name = '$npmConfigName1670684115108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "cancel_at_period_end" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cancel_at_period_end"`);
    }

}

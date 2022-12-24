import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1667073644093 implements MigrationInterface {
    name = '$npmConfigName1667073644093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "learning" ADD CONSTRAINT "UQ_6c2be652dba6bbd873668e3b2c7" UNIQUE ("inputId", "outputId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "learning" DROP CONSTRAINT "UQ_6c2be652dba6bbd873668e3b2c7"`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTable1657546475479 implements MigrationInterface {
    name = 'CreateTable1657546475479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Debate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`author\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`contents\` varchar(255) NOT NULL, \`video_url\` varchar(255) NOT NULL, \`participant\` varchar(255) NOT NULL, \`author_pros\` tinyint NOT NULL, \`created_date\` datetime NOT NULL, \`updated_date\` datetime NOT NULL, \`ended_date\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(30) NOT NULL, \`email\` varchar(60) NOT NULL, \`password\` varchar(30) NOT NULL, \`signupVerifyToken\` varchar(60) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Debate\``);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTable1657808062193 implements MigrationInterface {
    name = 'CreateTable1657808062193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(30) NOT NULL, \`email\` varchar(60) NOT NULL, \`password\` varchar(30) NOT NULL, \`signupVerifyToken\` varchar(60) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Factcheck\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pros\` tinyint NOT NULL, \`description\` varchar(255) NOT NULL, \`reference_url\` varchar(255) NOT NULL, \`targetUserId\` varchar(255) NULL, \`targetDebateId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Debate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`category\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`contents\` varchar(255) NOT NULL, \`video_url\` varchar(255) NULL, \`author_pros\` tinyint NOT NULL, \`created_date\` datetime NULL, \`updated_date\` datetime NULL, \`ended_date\` datetime NULL, \`authorId\` varchar(255) NULL, \`participantId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` ADD CONSTRAINT \`FK_7a945e95f86a2fb2d3f3f7da8fe\` FOREIGN KEY (\`targetUserId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` ADD CONSTRAINT \`FK_512629eb6e719b5d9bdc7b2fffe\` FOREIGN KEY (\`targetDebateId\`) REFERENCES \`Debate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Debate\` ADD CONSTRAINT \`FK_4306e54a04dcb4e4f6e61d70d97\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Debate\` ADD CONSTRAINT \`FK_695bf256f5ee8e6fc7d90f0983b\` FOREIGN KEY (\`participantId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Debate\` DROP FOREIGN KEY \`FK_695bf256f5ee8e6fc7d90f0983b\``);
        await queryRunner.query(`ALTER TABLE \`Debate\` DROP FOREIGN KEY \`FK_4306e54a04dcb4e4f6e61d70d97\``);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` DROP FOREIGN KEY \`FK_512629eb6e719b5d9bdc7b2fffe\``);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` DROP FOREIGN KEY \`FK_7a945e95f86a2fb2d3f3f7da8fe\``);
        await queryRunner.query(`DROP TABLE \`Debate\``);
        await queryRunner.query(`DROP TABLE \`Factcheck\``);
        await queryRunner.query(`DROP TABLE \`User\``);
    }

}
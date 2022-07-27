import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTable1657982473632 implements MigrationInterface {
    name = 'CreateTable1657982473632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Factcheck\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pros\` tinyint NOT NULL, \`description\` varchar(255) NOT NULL, \`reference_url\` varchar(255) NOT NULL, \`targetUserId\` varchar(255) NULL, \`targetDebateId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Heart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`targetUserId\` varchar(255) NULL, \`targetDebateId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Vote\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pros\` tinyint NOT NULL, \`targetUserId\` varchar(255) NULL, \`targetDebateId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Debate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`category\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`contents\` varchar(255) NOT NULL, \`video_url\` varchar(255) NULL, \`author_pros\` tinyint NOT NULL, \`created_date\` datetime NULL, \`updated_date\` datetime NULL, \`ended_date\` datetime NULL, \`authorId\` varchar(255) NULL, \`participantId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pros\` tinyint NOT NULL, \`contents\` varchar(255) NOT NULL, \`created_date\` datetime NOT NULL, \`updated_date\` datetime NOT NULL, \`targetUserId\` varchar(255) NULL, \`targetDebateId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(30) NOT NULL, \`email\` varchar(60) NOT NULL, \`password\` varchar(30) NOT NULL, \`signupVerifyToken\` varchar(60) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Alarm\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sender\` varchar(255) NOT NULL, \`contents\` varchar(255) NOT NULL, \`target_debate\` int NOT NULL, \`target_comment\` int NOT NULL, \`receiverId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` ADD CONSTRAINT \`FK_7a945e95f86a2fb2d3f3f7da8fe\` FOREIGN KEY (\`targetUserId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` ADD CONSTRAINT \`FK_512629eb6e719b5d9bdc7b2fffe\` FOREIGN KEY (\`targetDebateId\`) REFERENCES \`Debate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Heart\` ADD CONSTRAINT \`FK_2c1eaf43dbb38f4ae7d4f3083ac\` FOREIGN KEY (\`targetUserId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Heart\` ADD CONSTRAINT \`FK_80ab9b37242eff4421a93e00231\` FOREIGN KEY (\`targetDebateId\`) REFERENCES \`Debate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vote\` ADD CONSTRAINT \`FK_0d151826d49e684da0ecd10b3dc\` FOREIGN KEY (\`targetUserId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vote\` ADD CONSTRAINT \`FK_68d178aa62c5c8d19c5d1365a98\` FOREIGN KEY (\`targetDebateId\`) REFERENCES \`Debate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Debate\` ADD CONSTRAINT \`FK_4306e54a04dcb4e4f6e61d70d97\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Debate\` ADD CONSTRAINT \`FK_695bf256f5ee8e6fc7d90f0983b\` FOREIGN KEY (\`participantId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comment\` ADD CONSTRAINT \`FK_0fde04d917a7ce6217019ba58d5\` FOREIGN KEY (\`targetUserId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comment\` ADD CONSTRAINT \`FK_730cabeae53dd53f47cb7a704c2\` FOREIGN KEY (\`targetDebateId\`) REFERENCES \`Debate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Alarm\` ADD CONSTRAINT \`FK_2f5f9a67c850cb25f1632ce29d5\` FOREIGN KEY (\`receiverId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Alarm\` DROP FOREIGN KEY \`FK_2f5f9a67c850cb25f1632ce29d5\``);
        await queryRunner.query(`ALTER TABLE \`Comment\` DROP FOREIGN KEY \`FK_730cabeae53dd53f47cb7a704c2\``);
        await queryRunner.query(`ALTER TABLE \`Comment\` DROP FOREIGN KEY \`FK_0fde04d917a7ce6217019ba58d5\``);
        await queryRunner.query(`ALTER TABLE \`Debate\` DROP FOREIGN KEY \`FK_695bf256f5ee8e6fc7d90f0983b\``);
        await queryRunner.query(`ALTER TABLE \`Debate\` DROP FOREIGN KEY \`FK_4306e54a04dcb4e4f6e61d70d97\``);
        await queryRunner.query(`ALTER TABLE \`Vote\` DROP FOREIGN KEY \`FK_68d178aa62c5c8d19c5d1365a98\``);
        await queryRunner.query(`ALTER TABLE \`Vote\` DROP FOREIGN KEY \`FK_0d151826d49e684da0ecd10b3dc\``);
        await queryRunner.query(`ALTER TABLE \`Heart\` DROP FOREIGN KEY \`FK_80ab9b37242eff4421a93e00231\``);
        await queryRunner.query(`ALTER TABLE \`Heart\` DROP FOREIGN KEY \`FK_2c1eaf43dbb38f4ae7d4f3083ac\``);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` DROP FOREIGN KEY \`FK_512629eb6e719b5d9bdc7b2fffe\``);
        await queryRunner.query(`ALTER TABLE \`Factcheck\` DROP FOREIGN KEY \`FK_7a945e95f86a2fb2d3f3f7da8fe\``);
        await queryRunner.query(`DROP TABLE \`Alarm\``);
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Comment\``);
        await queryRunner.query(`DROP TABLE \`Debate\``);
        await queryRunner.query(`DROP TABLE \`Vote\``);
        await queryRunner.query(`DROP TABLE \`Heart\``);
        await queryRunner.query(`DROP TABLE \`Factcheck\``);
    }

}

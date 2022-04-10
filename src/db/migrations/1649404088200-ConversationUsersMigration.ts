import {MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ConversationUsersMigration1649404088200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "conversationUsers",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: "conversationId",
                        type: "uuid",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    }
                ],
            }),
            true,
        )
        await queryRunner.createForeignKey(
            "conversationUsers",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        )

        await queryRunner.createForeignKey(
            "conversationUsers",
            new TableForeignKey({
                columnNames: ["conversationId"],
                referencedColumnNames: ["id"],
                referencedTableName: "conversations",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

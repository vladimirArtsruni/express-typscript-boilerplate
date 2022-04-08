import {MigrationInterface, QueryRunner, TableForeignKey, Table } from "typeorm";

export class MessageMigration1649404335166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "messages",
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
                        name: "text",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "attachments",
                        type: "jsonb",
                        isNullable: true
                    },
                    {
                        name: "media",
                        type: "jsonb",
                        isNullable: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updateddAt",
                        type: "timestamp",
                        default: "now()",
                    }
                ],
            }),
            true,
        )
        await queryRunner.createForeignKey(
            "messages",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        )

        await queryRunner.createForeignKey(
            "messages",
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

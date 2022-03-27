import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { Types } from '../../entities/tokens/types';

export class TokenMigration1648389849809 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tokens",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "ip",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "token",
                        type: "varchar",
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: Object.values(Types),
                        enumName: 'tokenType',
                        default: `'${Types.REFRESH}'`
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    }
                ],
            }),
            true,
        )
        await queryRunner.createForeignKey(
            "tokens",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

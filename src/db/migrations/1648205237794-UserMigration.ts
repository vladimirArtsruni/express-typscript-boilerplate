import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { Roles } from '../../entities/users/types'
export class UserMigration1648205237794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "username",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "isVerified",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "avatar",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: Object.values(Roles),
                        enumName: 'userRole',
                        default: `'${Roles.USER}'`
                    },
                    {
                        name: "password",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "salt",
                        type: "varchar",
                        isNullable: true
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}

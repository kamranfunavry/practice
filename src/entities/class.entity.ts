import { AutoIncrement, Column, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Student } from "./student.entity";
@Table({
    timestamps: true
})
export class Class extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column
    id: number

    @Column
    name: string

    @Column
    description: string

    @HasMany(() => Student)
    students: Student[]
}

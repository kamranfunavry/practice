import { AutoIncrement, BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Student } from "./student.entity";
import { StudentsSubject } from "./students-has-subjects.entity";
@Table({
    timestamps: true
})
export class Subject extends Model {
    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column
    id: number

    @Column
    name: string

    @Column
    description: string

    @BelongsToMany(() => Student, () => StudentsSubject)
    students: Student[]
}

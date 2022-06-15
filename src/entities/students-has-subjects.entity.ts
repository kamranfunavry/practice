import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Student } from "./student.entity";
import { Subject } from "./subject.entity";
@Table({
    timestamps: true
})
export class StudentsSubject extends Model {
    @ForeignKey(() => Student)
    @Column
    studentId: number

    @ForeignKey(() => Subject)
    @Column
    subjectId: number
}
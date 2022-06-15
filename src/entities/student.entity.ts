import { AutoIncrement, BelongsToMany, Column, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { StudentsSubject } from "./students-has-subjects.entity";
import { Subject } from "./subject.entity";
@Table({
    timestamps: true
})
export class Student extends Model {

    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column
    id: number

    @Column
    name: string

    @Column
    description: string

    @Column
    cnic: string

    @BelongsToMany(() => Subject, () => StudentsSubject)
    subjects: Subject[]
}

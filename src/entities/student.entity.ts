import { AutoIncrement, BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Class } from "./class.entity";
import { StudentsSubject } from "./students-has-subjects.entity";
import { Subject } from "./subject.entity";
@Table({
    timestamps: true,
    scopes: {
        private: {
            attributes: ['id', 'name', 'description', 'cnic']
        },
        public: {
            attributes: ['name', 'description']
        }
    }
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

    @ForeignKey(() => Class)
    @Column
    classId: number
    @BelongsTo(() => Class)
    class: Class

    @BelongsToMany(() => Subject, () => StudentsSubject)
    subjects: Subject[]
}

import { AutoIncrement, BelongsToMany, Column, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
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

    @BelongsToMany(() => Subject, () => StudentsSubject)
    subjects: Subject[]
}

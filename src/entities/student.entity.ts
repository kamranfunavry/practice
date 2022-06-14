import { AutoIncrement, Column, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
@Table({
    timestamps : true
})
export class Student extends Model{

    @PrimaryKey
    @AutoIncrement
    @Unique
    @Column
    id:number

    @Column
    name:string

    @Column
    description:string

    @Column
    cnic:string
}

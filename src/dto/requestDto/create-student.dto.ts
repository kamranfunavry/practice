import { IsNotEmpty, IsString } from "class-validator";

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    cnic: string

}

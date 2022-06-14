import { IsArray, IsBoolean, IsJSON, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsNumber()
    cnic: number

}

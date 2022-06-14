import { IsArray, IsBoolean, IsJSON, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class getStudentsDto {
    @IsOptional()
    name: string

    @IsOptional()
    description: string

    @IsOptional()
    cnic: number

}

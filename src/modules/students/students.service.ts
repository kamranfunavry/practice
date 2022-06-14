import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GenericResponseDto } from 'src/dto/response/genericResponse.dto';
import { Student } from 'src/entities/student.entity';
import { CreateStudentDto } from '../../dto/requestDto/create-student.dto';
import { UpdateStudentDto } from '../../dto/requestDto/update-student.dto';

@Injectable()
export class StudentsService {
  async create(createStudentDto: CreateStudentDto) {
    const result = await Student.create({ ...createStudentDto })
    return new GenericResponseDto(
      HttpStatus.CREATED,
      'Created Successfully',
      result,
    );
  }

  async findAll() {
    const result = await Student.findAndCountAll({
    });
    return new GenericResponseDto(
      HttpStatus.OK,
      'Fetched Successfully',
      result,
    );
  }

  async findOne(id: number) {
    let result = await Student.findOne({
      where: { id: id },
    });
    if (!result) {
      throw new NotFoundException('NFT Not Found');
    }
    return new GenericResponseDto(
      HttpStatus.OK,
      'Fetched Successfully',
      result,
    );
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    let result = await Student.update(updateStudentDto, { where: { id } })
    let data = null;
    if (result) {
      data = await Student.findOne({ where: { id: id } })
    }
    if (!result) {
      throw new NotFoundException('NFT Not Found');
    }
    return new GenericResponseDto(
      HttpStatus.OK,
      'User updated successfully',
      data,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}

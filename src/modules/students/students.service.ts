import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GenericResponseDto } from 'src/dto/response/genericResponse.dto';
import { Student } from 'src/entities/student.entity';
import { StudentsSubject } from 'src/entities/students-has-subjects.entity';
import { Subject } from 'src/entities/subject.entity';
import { CreateStudentDto } from '../../dto/requestDto/create-student.dto';
import { UpdateStudentDto } from '../../dto/requestDto/update-student.dto';

@Injectable()
export class StudentsService {
  async create(createStudentDto: CreateStudentDto) {
    const result = await Student.create({ ...createStudentDto })
    createStudentDto.subjectId.forEach(async subjectId => {
      const data = {
        studentId: result.id,
        subjectId: subjectId
      }
      await StudentsSubject.create({ ...data })
    })
    return new GenericResponseDto(
      HttpStatus.CREATED,
      'Created Successfully',
      result,
    );
  }

  async findAll() {
    const result = await Student.findAndCountAll({
      include: [
        {
          model: Subject,
          required: true,
          as: 'subjects',
          through: { attributes: [] }
        }
      ]
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

  async remove(id: number) {
    let result = await Student.destroy({ where: { id } })
    if (!result) {
      throw new NotFoundException('NFT Not Found');
    }
    return new GenericResponseDto(
      HttpStatus.OK,
      'User deleted successfully',
      [],
    );
  }
}

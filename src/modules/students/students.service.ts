import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GenericResponseDto } from 'src/dto/response/genericResponse.dto';
import { Class } from 'src/entities/class.entity';
import { Student } from 'src/entities/student.entity';
import { StudentsSubject } from 'src/entities/students-has-subjects.entity';
import { Subject } from 'src/entities/subject.entity';
import { CreateStudentDto } from '../../dto/requestDto/create-student.dto';
import { UpdateStudentDto } from '../../dto/requestDto/update-student.dto';
var parseString = require('xml2js').parseString;
var aramex = require('aramex-api');
let clientInfo = new aramex.ClientInfo();
aramex.Aramex.setClientInfo(clientInfo);
aramex.Aramex.setConsignee(new aramex.Consignee());
aramex.Aramex.setShipper(new aramex.Shipper());
aramex.Aramex.setThirdParty(new aramex.ThirdParty());
aramex.Aramex.setDetails(1);
aramex.Aramex.setDimension();
aramex.Aramex.setWeight();

@Injectable()
export class StudentsService {
  constructor(private readonly httpService: HttpService) { }
  client = {
    UserName: process.env.ARAMEX_USERNAME,
    Password: process.env.ARAMEX_PASSWORD,
    Version: process.env.ARAMEX_VERSION,
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER,
    AccountPin: process.env.ARAMEX_ACCOUNT_PIN,
    AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY,
    AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRY_CODE
  }
  transaction = {
    Reference1: "",
    Reference2: "",
    Reference3: "",
    Reference4: "",
    Reference5: ""
  }
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
        },
        {
          model: Class,
          required: true,
          as: 'class',
        }
      ]
    });
    return new GenericResponseDto(
      HttpStatus.OK,
      'Fetched Successfully',
      result,
    );
  }

  async getCountries() {
    let data = {
      ClientInfo: this.client,
      Transaction: this.transaction
    };
    const url = `https://ws.dev.aramex.net/ShippingAPI.V2/Location/Service_1_0.svc/json/FetchCountries`
    let result = await this.httpService.post(url, data).toPromise();
    result = result.data.Countries;
    return new GenericResponseDto(
      HttpStatus.OK,
      'Fetched Successfully',
      result
    );
  }
  async getCities() {
    let data = {
      ClientInfo: this.client,
      CountryCode: "PK",
      Transaction: this.transaction
    };
    const url = `https://ws.dev.aramex.net/ShippingAPI.V2/Location/Service_1_0.svc/json/FetchCities`
    let result = await this.httpService.post(url, data).toPromise();
    result = result.data.Cities;
    return new GenericResponseDto(
      HttpStatus.OK,
      'Fetched Successfully',
      result
    );
  }

  async getAramex() {
    let result = await aramex.Aramex.calculateRates(1, 'kg', 1);
    // let result = await aramex.Aramex.getCountries();
    // let result = '<Country xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Code>PK</Code><Name>Pakistan</Name><IsoCode>PAK</IsoCode><StateRequired>true</StateRequired><PostCodeRequired>false</PostCodeRequired><PostCodeRegex xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays"/><InternationalCallingNumber>92</InternationalCallingNumber></Country>'
    // let abc = null;
    // parseString(result, function (err, xml) {
    //   abc = xml
    //   console.log(xml);
    // });
    // let result = await aramex.Aramex.createShipment([{ PackageType: 'Box', Quantity: 2, Weight: { Value: 0.5, Unit: 'Kg' }, Comments: 'Docs', Reference: '' }]);
    // let result = await aramex.Aramex.track(['3915342793', '3915342826']);
    return new GenericResponseDto(
      HttpStatus.OK,
      'Fetched Successfully',
      result
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

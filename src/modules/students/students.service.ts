import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GenericResponseDto } from 'src/dto/response/genericResponse.dto';
import { Class } from 'src/entities/class.entity';
import { Student } from 'src/entities/student.entity';
import { StudentsSubject } from 'src/entities/students-has-subjects.entity';
import { Subject } from 'src/entities/subject.entity';
import { CreateStudentDto } from '../../dto/requestDto/create-student.dto';
import { UpdateStudentDto } from '../../dto/requestDto/update-student.dto';
let soap = require('strong-soap').soap;
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
  aramexClient = {
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
  args = {};
  result = {};
  envelope = null;
  soapHeader = null;
  Shipment = { Details: {} };

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
      ClientInfo: this.aramexClient,
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
      ClientInfo: this.aramexClient,
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

  async calculateRates(
    NumberOfPieces,
    Unit,
    Value,
  ) {
    this.normalizeForCalculatingRates(NumberOfPieces, Unit, Value);
    await this.dispatch(
      'D:/PRACTICE-PROJECT/nest-practice/practice/src/modules/students/handlers/aramex-rates-calculator-wsdl.wsdl',
      'CalculateRate'
    );
    return this.result;
  }

  normalizeForCalculatingRates(
    NumberOfPieces,
    Unit,
    Value,
    transaction = null
  ) {
    this.args = {
      RateCalculatorRequest: {
        ClientInfo: this.aramexClient,
        Transaction: this.transaction,
        OriginAddress: {
          Line1: "Amman",
          Line2: "Amman",
          Line3: "",
          City: "Abha",
          StateOrProvinceCode: "",
          PostCode: "00962",
          CountryCode: "SA",
          Longitude: 46.68734752539064,
          Latitude: 24.686250126957663
        },
        DestinationAddress: {
          Line1: "Amman",
          Line2: "Amman",
          Line3: "",
          City: "ahad-masarha",
          StateOrProvinceCode: "",
          PostCode: "00962",
          CountryCode: "SA",
          Longitude: 0,
          Latitude: 0
        },
        ShipmentDetails: {
          NumberOfPieces: NumberOfPieces,
          ActualWeight: {
            Unit: Unit,
            Value: Value
          },
          Dimensions: null,
          ChargeableWeight: null,
          CustomsValueAmount: null,
          CashOnDeliveryAmount: null,
          InsuranceAmount: null,
          CashAdditionalAmount: null,
          CollectAmount: null,
          DescriptionOfGoods: null,
          GoodsOriginCountry: null,
          ProductGroup: "DOM",
          ProductType: "OND",
          PaymentType: "P",
          PaymentOptions: "",
          CashAdditionalAmountDescription: "",
          Services: "",
          Items: ""
        }
      }
    };
    if (transaction != null) {
      this.args['RateCalculatorRequest']['Transaction'] = transaction;
    }
  }

  async dispatch(wsdl, handler) {
    return new Promise((resolve, reject) => {
      soap.createClient(wsdl, async (err, client) => {
        try {
          console.log("Client: ", __dirname + wsdl)
          const { result, envelope, soapHeader } = await client[handler](
            this.args
          );
          console.log("Result: ", result)
          this.result = result;
          this.envelope = envelope;
          this.soapHeader = soapHeader;
          resolve(this.result);
        } catch (err) {
          console.log(err);
          reject('Error occured while connecting to Aramex!');
        }
      });
    });
  }

  async getAramex() {
    // let result = await aramex.Aramex.calculateRates(1, 'kg', 1);
    // let result = await aramex.Aramex.getCountries();
    // let result = '<Country xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Code>PK</Code><Name>Pakistan</Name><IsoCode>PAK</IsoCode><StateRequired>true</StateRequired><PostCodeRequired>false</PostCodeRequired><PostCodeRegex xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays"/><InternationalCallingNumber>92</InternationalCallingNumber></Country>'
    // let abc = null;
    // parseString(result, function (err, xml) {
    //   abc = xml
    //   console.log(xml);
    // });
    // let result = await aramex.Aramex.createShipment([{ PackageType: 'Box', Quantity: 2, Weight: { Value: 0.5, Unit: 'Kg' }, Comments: 'Docs', Reference: '' }]);
    // let result = await aramex.Aramex.track(['3915342793', '3915342826']);
    // return new GenericResponseDto(
    //   HttpStatus.OK,
    //   'Fetched Successfully',
    //   result
    // );
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

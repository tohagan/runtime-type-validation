import {
  Validator,
  tString,
  tNumber,
  constant,
  tObject,
  tArray,
  optional,
  oneOf,
  union
} from '../src/index';

describe('validate phone number objects', () => {
  enum PhoneUse {
    Mobile = 'Mobile',
    Home = 'Home',
    Work = 'Work'
  }

  interface PhoneNumber {
    id: number;
    use?: PhoneUse;
  }

  interface InternationalPhone extends PhoneNumber {
    international: true;
    rawNumber: string;
  }

  interface DomesticPhone extends PhoneNumber {
    international: false;
    areaCode: string;
    prefix: string;
    lineNumber: string;
  }

  type Phone = DomesticPhone | InternationalPhone;

  const phoneUseValidator: Validator<PhoneUse> = oneOf(
    constant(PhoneUse.Mobile),
    constant(PhoneUse.Home),
    constant(PhoneUse.Work)
  );

  const internationalPhoneValidator: Validator<InternationalPhone> = tObject({
    id: tNumber(),
    use: optional(phoneUseValidator),
    international: constant(true),
    rawNumber: tString()
  });

  const domesticPhoneValidator: Validator<DomesticPhone> = tObject({
    id: tNumber(),
    use: optional(phoneUseValidator),
    international: constant(false),
    areaCode: tString(),
    prefix: tString(),
    lineNumber: tString()
  });

  const phoneValidator: Validator<Phone> = union(domesticPhoneValidator, internationalPhoneValidator);

  const phonesValidator: Validator<Phone[]> = tArray(phoneValidator);

  it('can validate both international and domestic phones', () => {
    const data = [
      {
        id: 1,
        use: 'Work',
        international: false,
        areaCode: '123',
        prefix: '456',
        lineNumber: '7890'
      },
      {
        id: 2,
        use: 'Work',
        international: true,
        rawNumber: '111234567890'
      },
      {
        id: 3,
        international: false,
        areaCode: '000',
        prefix: '000',
        lineNumber: '5555'
      }
    ];

    expect(phonesValidator.check(data)).toEqual({ok: true, result: data});
  });

  it('fails when an object is neither an international or domestic phone', () => {
    const data = [
      {
        id: 1,
        use: 'Work',
        international: false,
        areaCode: '123',
        prefix: '456',
        lineNumber: '7890'
      },
      {
        id: 5
      }
    ];

    const error = phonesValidator.check(data);
    expect(error).toMatchObject({
      ok: false,
      error: {
        at: 'input[1]',
        message: [
          'expected a value matching one of the validators, got the errors ',
          `["at error: the key 'international' is required but was not present", `,
          `"at error: the key 'international' is required but was not present"]`
        ].join('')
      }
    });
  });
});

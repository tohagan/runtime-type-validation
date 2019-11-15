import {
  Validator,
  nullable,
  tNumber,
  range,
  chars, charsMin, charsMax, charsRange,
  matches, httpUrl
} from '../src/index';

describe('nullable', () => {
  const validator = nullable(tNumber());

  it('succeeds when given null', () => {
    expect(validator.check(null)).toEqual({ok: true, result: null});
  });

  it('succeeds when given a number', () => {
    expect(validator.check(3)).toEqual({ok: true, result: 3});
  });

  it('fails when given a string', () => {
    expect(validator.check('gulp')).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message: "expected a value matching one of the validators, got the errors [\"at error: expected a number, got a string\", \"at error: expected null, got \"gulp\"\"]"
      }
    });
  });

  it('fails when given a boolean', () => {
    expect(validator.check(true)).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message: "expected a value matching one of the validators, got the errors [\"at error: expected a number, got a boolean\", \"at error: expected null, got true\"]"
      }
    });
  });
});


describe('range', () => {
  const validator = range(5, 10);

  it('succeeds when given 5,6,9 or 10', () => {
    expect(validator.check(5)).toEqual({ok: true, result: 5});
    expect(validator.check(6)).toEqual({ok: true, result: 6});
    expect(validator.check(9)).toEqual({ok: true, result: 9});
    expect(validator.check(10)).toEqual({ok: true, result: 10});
  });

  it('fails when given 4 or 11', () => {
    expect(validator.check(4)).toMatchObject({ ok: false, error: { message: 'expected a number between 5 and 10' } });
    expect(validator.check(11)).toMatchObject({ ok: false, error: { message: 'expected a number between 5 and 10' } });
  });

  it('fails when given a string', () => {
    expect(validator.check('4')).toMatchObject({ ok: false, error: { message: "expected a number, got a string" } });
  });

  it('fails when given a boolean', () => {
    expect(validator.check(true)).toMatchObject({ ok: false, error: { message: "expected a number, got a boolean" } });
  });
});

describe('chars(5)', () => {
  const validator = chars(5);

  it('succeeds when given 5 chars', () => {
    expect(validator.check("12345")).toEqual({ok: true, result: "12345"});
  });

  it('fails when given 4 or 6 chars', () => {
    expect(validator.check("1234")).toMatchObject({ ok: false, error: { message: 'expected a string of length 5' } });
    expect(validator.check("123456")).toMatchObject({ ok: false, error: { message: 'expected a string of length 5' } });
  });

});

describe('charsMin(5)', () => {
  const validator = charsMin(5);

  it('succeeds when given 5 or 6 chars', () => {
    expect(validator.check("12345")).toEqual({ok: true, result: "12345"});
    expect(validator.check("123456")).toEqual({ok: true, result: "123456"});
  });

  it('fails when given 3 or 4 chars', () => {
    expect(validator.check("123")).toMatchObject({ ok: false, error: { message: 'expected a string of minimum length 5' } });
    expect(validator.check("1234")).toMatchObject({ ok: false, error: { message: 'expected a string of minimum length 5' } });
  });

});

describe('charsMax(5)', () => {
  const validator = charsMax(5);

  it('succeeds when given 4 or 5 chars', () => {
    expect(validator.check("1234")).toEqual({ok: true, result: "1234"});
    expect(validator.check("12345")).toEqual({ok: true, result: "12345"});
  });

  it('fails when given 6 or 7 chars', () => {
    expect(validator.check("123456")).toMatchObject({ ok: false, error: { message: 'expected a string of maximum length 5' } });
    expect(validator.check("1234567")).toMatchObject({ ok: false, error: { message: 'expected a string of maximum length 5' } });
  });

});

describe('charsRange(5, 10)', () => {
  const validator = charsRange(5, 10);

  it('succeeds when given 5 or 10 chars', () => {
    expect(validator.check("12345")).toEqual({ok: true, result: "12345"});
    expect(validator.check("123456789.")).toEqual({ok: true, result: "123456789."});
  });

  it('fails when given 4 or 11 chars', () => {
    expect(validator.check("1234")).toMatchObject({ ok: false, error: { message: 'expected a string of between 5 and 10 in length' } });
    expect(validator.check("123456789.1")).toMatchObject({ ok: false, error: { message: 'expected a string of between 5 and 10 in length' } });
  });

});

describe('matches(/abc$/)', () => {
  const validator = matches(/abc$/);

  it('succeeds when given strings ending in "abc"', () => {
    expect(validator.check("123abc")).toEqual({ok: true, result: "123abc"});
    expect(validator.check("abc")).toEqual({ok: true, result: "abc"});
  });

  it('fails when given strings not ending in abc', () => {
    expect(validator.check("abc123")).toMatchObject({
      ok: false,
      error: { message: "expected a string that matches /abc$/" }
    });
  });

});

describe('httpUrl', () => {
  const validator = httpUrl();

  it('succeeds when given a valid url', () => {
    expect(validator.check("http://xyz.com/abc")).toEqual({ok: true, result: "http://xyz.com/abc"});
    expect(validator.check("https://xyz.com/abc")).toEqual({ok: true, result: "https://xyz.com/abc"});
  });

  it('fails when given an invalid http URL', () => {
    expect(validator.check("http://../")).toMatchObject({
      ok: false,
      error: { message: "expected a valid http or https URL" }
    });
  });

});


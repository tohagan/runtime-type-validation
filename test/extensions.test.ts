import {
  Decoder,
  tNullable, tEnum,
  tString, tNumber,
  range,
  chars, charsMin, charsMax, charsRange,
  matches, httpUrl
} from '../src/index';

describe('tNullable', () => {
  const decoder = tNullable(tNumber());

  it('succeeds when given null', () => {
    expect(decoder.run(null)).toEqual({ok: true, result: null});
  });

  it('succeeds when given a number', () => {
    expect(decoder.run(3)).toEqual({ok: true, result: 3});
  });

  it('fails when given a string', () => {
    expect(decoder.run('gulp')).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message: "expected a value matching one of the decoders, got the errors [\"at error: expected a number, got a string\", \"at error: expected null, got \"gulp\"\"]"
      }
    });
  });

  it('fails when given a boolean', () => {
    expect(decoder.run(true)).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message: "expected a value matching one of the decoders, got the errors [\"at error: expected a number, got a boolean\", \"at error: expected null, got true\"]"
      }
    });
  });
});


describe('tEnum', () => {
  const decoder: Decoder<string> = tEnum("A", "B", "C");

  it('succeeds when given A, B or C', () => {
    expect(decoder.run("A")).toEqual({ok: true, result: "A"});
    expect(decoder.run("B")).toEqual({ok: true, result: "B"});
    expect(decoder.run("C")).toEqual({ok: true, result: "C"});
  });

  it('fails when given an invalid string', () => {
    expect(decoder.run('Z')).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message: 'expected a value matching one of the decoders, got the errors [\"at error: expected \"A\", got \"Z\"\", \"at error: expected \"B\", got \"Z\"\", \"at error: expected \"C\", got \"Z\"\"]'
      }
    });
  });

  it('fails when given a number', () => {
    expect(decoder.run(2)).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message: 'expected a value matching one of the decoders, got the errors [\"at error: expected \"A\", got 2\", \"at error: expected \"B\", got 2\", \"at error: expected \"C\", got 2\"]'
      }
    });
  });

  it('fails when given a boolean', () => {
    expect(decoder.run(true)).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message: 'expected a value matching one of the decoders, got the errors [\"at error: expected \"A\", got true\", \"at error: expected \"B\", got true\", \"at error: expected \"C\", got true\"]'
      }
    });
  });
});

describe('range', () => {
  const decoder = range(5, 10);

  it('succeeds when given 5,6,9 or 10', () => {
    expect(decoder.run(5)).toEqual({ok: true, result: 5});
    expect(decoder.run(6)).toEqual({ok: true, result: 6});
    expect(decoder.run(9)).toEqual({ok: true, result: 9});
    expect(decoder.run(10)).toEqual({ok: true, result: 10});
  });

  it('fails when given 4 or 11', () => {
    expect(decoder.run(4)).toMatchObject({ ok: false, error: { message: 'expected a number between 5 and 10' } });
    expect(decoder.run(11)).toMatchObject({ ok: false, error: { message: 'expected a number between 5 and 10' } });
  });

  it('fails when given a string', () => {
    expect(decoder.run('4')).toMatchObject({ ok: false, error: { message: "expected a number, got a string" } });
  });

  it('fails when given a boolean', () => {
    expect(decoder.run(true)).toMatchObject({ ok: false, error: { message: "expected a number, got a boolean" } });
  });
});

describe('chars(5)', () => {
  const decoder = chars(5);

  it('succeeds when given 5 chars', () => {
    expect(decoder.run("12345")).toEqual({ok: true, result: "12345"});
  });

  it('fails when given 4 or 6 chars', () => {
    expect(decoder.run("1234")).toMatchObject({ ok: false, error: { message: 'expected a string of length 5' } });
    expect(decoder.run("123456")).toMatchObject({ ok: false, error: { message: 'expected a string of length 5' } });
  });

});

describe('charsMin(5)', () => {
  const decoder = charsMin(5);

  it('succeeds when given 5 or 6 chars', () => {
    expect(decoder.run("12345")).toEqual({ok: true, result: "12345"});
    expect(decoder.run("123456")).toEqual({ok: true, result: "123456"});
  });

  it('fails when given 3 or 4 chars', () => {
    expect(decoder.run("123")).toMatchObject({ ok: false, error: { message: 'expected a string of minimum length 5' } });
    expect(decoder.run("1234")).toMatchObject({ ok: false, error: { message: 'expected a string of minimum length 5' } });
  });

});

describe('charsMax(5)', () => {
  const decoder = charsMax(5);

  it('succeeds when given 4 or 5 chars', () => {
    expect(decoder.run("1234")).toEqual({ok: true, result: "1234"});
    expect(decoder.run("12345")).toEqual({ok: true, result: "12345"});
  });

  it('fails when given 6 or 7 chars', () => {
    expect(decoder.run("123456")).toMatchObject({ ok: false, error: { message: 'expected a string of maximum length 5' } });
    expect(decoder.run("1234567")).toMatchObject({ ok: false, error: { message: 'expected a string of maximum length 5' } });
  });

});

describe('charsRange(5, 10)', () => {
  const decoder = charsRange(5, 10);

  it('succeeds when given 5 or 10 chars', () => {
    expect(decoder.run("12345")).toEqual({ok: true, result: "12345"});
    expect(decoder.run("123456789.")).toEqual({ok: true, result: "123456789."});
  });

  it('fails when given 4 or 11 chars', () => {
    expect(decoder.run("1234")).toMatchObject({ ok: false, error: { message: 'expected a string of between 5 and 10 in length' } });
    expect(decoder.run("123456789.1")).toMatchObject({ ok: false, error: { message: 'expected a string of between 5 and 10 in length' } });
  });

});

describe('matches(/abc$/)', () => {
  const decoder = matches(/abc$/);

  it('succeeds when given strings ending in "abc"', () => {
    expect(decoder.run("123abc")).toEqual({ok: true, result: "123abc"});
    expect(decoder.run("abc")).toEqual({ok: true, result: "abc"});
  });

  it('fails when given strings not ending in abc', () => {
    expect(decoder.run("abc123")).toMatchObject({
      ok: false,
      error: { message: "expected a string that match the pattern /abc$/" }
    });
  });

});

describe('httpUrl', () => {
  const decoder = httpUrl();

  it('succeeds when given a valid url', () => {
    expect(decoder.run("http://xyz.com/abc")).toEqual({ok: true, result: "http://xyz.com/abc"});
    expect(decoder.run("https://xyz.com/abc")).toEqual({ok: true, result: "https://xyz.com/abc"});
  });

  it('fails when given an invalid http URL', () => {
    expect(decoder.run("http://../")).toMatchObject({
      ok: false,
      error: { message: "expected a valid http or https URL" }
    });
  });

});


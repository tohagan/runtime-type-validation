import {Validator, tString, tNumber, tBoolean, tObject} from '../src/index';

describe('validate json as User interface', () => {
  interface User {
    firstname: string;
    lastname: string;
    age: number;
    active: boolean;
  }

  const userJson: any = {
    firstname: 'John',
    lastname: 'Doe',
    age: 99,
    active: false
  };

  const invalidUserJson: any = {
    firstname: 'John',
    lastName: 'Doe', // invalid camelCase
    age: 99,
    active: false
  };

  const userValidator: Validator<User> = tObject({
    firstname: tString(),
    lastname: tString(),
    age: tNumber(),
    active: tBoolean()
  });

  it('successfuly passes through the valid user object', () => {
    expect(userValidator.run(userJson)).toEqual({
      ok: true,
      result: userJson
    });
  });

  it('fails when a required key is missing', () => {
    const error = userValidator.run(invalidUserJson);
    expect(error).toMatchObject({
      ok: false,
      error: {at: 'input', message: "the key 'lastname' is required but was not present"}
    });
  });
});

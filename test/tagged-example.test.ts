import {
  Validator,
  tString,
  tNumber,
  tBoolean,
  constant,
  tArray,
  tDict,
  union,
  lazy
} from '../src/index';

describe('create tagged data objects', () => {
  type Tagged =
    | {tag: 'null'; value: null}
    | {tag: 'string'; value: string}
    | {tag: 'number'; value: number}
    | {tag: 'boolean'; value: boolean}
    | {tag: 'array'; value: Array<Tagged>}
    | {tag: 'object'; value: {[name: string]: Tagged}};

  const data: any = [{x: 1, y: 5}, {a: true, b: 'false'}, 1, true];

  const taggedValidator: Validator<Tagged> = union(
    constant(null).map<Tagged>(value => ({tag: 'null', value: value})),
    tString().map<Tagged>(value => ({tag: 'string', value: value})),
    tNumber().map<Tagged>(value => ({tag: 'number', value: value})),
    tBoolean().map<Tagged>(value => ({tag: 'boolean', value: value})),
    lazy(() => tArray(taggedValidator).map<Tagged>(value => ({tag: 'array', value: value}))),
    lazy(() => tDict(taggedValidator).map<Tagged>(value => ({tag: 'object', value: value})))
  );

  it('maps data to tagged data', () => {
    expect(taggedValidator.check(data)).toEqual({
      ok: true,
      result: {
        tag: 'array',
        value: [
          {
            tag: 'object',
            value: {
              x: {tag: 'number', value: 1},
              y: {tag: 'number', value: 5}
            }
          },
          {
            tag: 'object',
            value: {
              a: {
                tag: 'boolean',
                value: true
              },
              b: {
                tag: 'string',
                value: 'false'
              }
            }
          },
          {
            tag: 'number',
            value: 1
          },
          {
            tag: 'boolean',
            value: true
          }
        ]
      }
    });
  });
});

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
  type TaggedJson =
    | {tag: 'null'; value: null}
    | {tag: 'string'; value: string}
    | {tag: 'number'; value: number}
    | {tag: 'boolean'; value: boolean}
    | {tag: 'array'; value: Array<TaggedJson>}
    | {tag: 'object'; value: {[name: string]: TaggedJson}};

  const data: any = [{x: 1, y: 5}, {a: true, b: 'false'}, 1, true];

  const taggedJsonValidator: Validator<TaggedJson> = union(
    constant(null).map<TaggedJson>(value => ({tag: 'null', value: value})),
    tString().map<TaggedJson>(value => ({tag: 'string', value: value})),
    tNumber().map<TaggedJson>(value => ({tag: 'number', value: value})),
    tBoolean().map<TaggedJson>(value => ({tag: 'boolean', value: value})),
    lazy(() => tArray(taggedJsonValidator).map<TaggedJson>(value => ({tag: 'array', value: value}))),
    lazy(() => tDict(taggedJsonValidator).map<TaggedJson>(value => ({tag: 'object', value: value})))
  );

  it('maps data to tagged data', () => {
    expect(taggedJsonValidator.check(data)).toEqual({
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

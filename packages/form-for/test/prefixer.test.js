import { prefixer } from '../src/index';

describe('prefixer', () => {
  it('returns sole object', () => {
    expect(prefixer('test')).toEqual('test');
  });

  it('returns prefixed array index', () => {
    expect(prefixer('test', 0, 1)).toEqual('test[0][1]');
  });

  it('returns prefixed names', () => {
    expect(prefixer('data', 'name', 'first')).toEqual('data[name][first]');
  });

  it('ignores empty strings', () => {
    expect(prefixer('', 'name', 'first')).toEqual('name[first]');
  });
});

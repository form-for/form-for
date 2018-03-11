import { stringHelpers } from './index';

describe('stringHelpers', () => {
  describe('#replaceDashUnderscore', () => {
    it('replaces dash and underscore with glue', () => {
      expect(stringHelpers.replaceDashUnderscore('one-two_three', ', ')).toEqual('one, two, three');
    });
  });

  describe('#replaceCamels', () => {
    it('replaces camels with glue', () => {
      expect(stringHelpers.replaceCamels('oneTwoThree', ', ')).toEqual('one, two, three');
    });
  });

  describe('#capitalize', () => {
    it('transforms the first letter into uppercase', () => {
      expect(stringHelpers.capitalize('name')).toEqual('Name');
    });
  });

  describe('#simplifyFieldName', () => {
    it('gets only the last name', () => {
      expect(stringHelpers.simplifyFieldName('item[one][two]')).toEqual('two');
    });
  });

  describe('#humanize', () => {
    it('humanizes dash and underscores', () => {
      expect(stringHelpers.humanize('one-two_three')).toEqual('One two three');
    });

    it('humanizes camels', () => {
      expect(stringHelpers.humanize('oneTwoThree')).toEqual('One two three');
    });

    it('humanizes nested field names', () => {});
    expect(stringHelpers.humanize('item[one][two][my_three]')).toEqual('My three');
  });
});

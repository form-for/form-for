import { stringHelpers } from './index';

describe('stringHelpers', () => {
  describe('#simplifyNestedName', () => {
    it('gets only the last name', () => {
      expect(stringHelpers.simplifyNestedName('item[one][two]')).toEqual('two');
    });
  });

  describe('#humanize', () => {
    it('humanizes dash and underscores', () => {
      expect(stringHelpers.humanize('one-two_three')).toEqual('One two three');
    });

    it('humanizes camels', () => {
      expect(stringHelpers.humanize('oneTwoThree')).toEqual('One two three');
    });

    it('humanizes nested field names', () => {
      expect(stringHelpers.humanize('item[one][two][my_three]')).toEqual('My three');
    });

    it('humanizes name_id', () => {
      expect(stringHelpers.humanize('user_id')).toEqual('User');
    });
  });
});

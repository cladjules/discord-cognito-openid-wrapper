const openid = require('./openid');
const discord = require('./discord');
const crypto = require('./crypto');

jest.mock('./discord');
jest.mock('./crypto');

const MOCK_TOKEN = 'MOCK_TOKEN';
const MOCK_CODE = 'MOCK_CODE';

describe.skip('openid domain layer', () => {
  const discordMock = {
    getUserDetails: jest.fn(),
    getToken: jest.fn(),
    getAuthorizeUrl: jest.fn(),
  };

  beforeEach(() => {
    discord.mockImplementation(() => discordMock);
  });

  describe.skip('userinfo function', () => {
    describe.skip('with a good token', () => {
      describe.skip('with complete user details', () => {
        beforeEach(() => {
          discordMock.getUserDetails.mockImplementation(() =>
            Promise.resolve({
              sub: 'Some sub',
              name: 'some name',
              login: 'username',
              html_url: 'some profile',
              avatar_url: 'picture.jpg',
              blog: 'website',
              updated_at: '2008-01-14T04:33:35Z',
            })
          );
        });
        describe.skip('with a primary email', () => {
          beforeEach(() => {
            mockEmailsWithPrimary(true);
          });
          it('Returns the aggregated complete object', async () => {
            const response = await openid.getUserInfo(MOCK_TOKEN);
            expect(response).toEqual({
              email: 'email@example.com',
              email_verified: true,
              name: 'some name',
              picture: 'picture.jpg',
              preferred_username: 'username',
              profile: 'some profile',
              sub: 'undefined',
              updated_at: 1200285215,
              website: 'website',
            });
          });
        });
        describe.skip('without a primary email', () => {
          beforeEach(() => {
            mockEmailsWithPrimary(false);
          });
          it('fails', () =>
            expect(openid.getUserInfo('MOCK_TOKEN')).rejects.toThrow(
              new Error('User did not have a primary email address')
            ));
        });
      });
    });
    describe.skip('with a bad token', () => {
      beforeEach(() => {
        discordMock.getUserDetails.mockImplementation(() =>
          Promise.reject(new Error('Bad token'))
        );
      });
      it('fails', () =>
        expect(openid.getUserInfo('bad token')).rejects.toThrow(
          new Error('Bad token')
        ));
    });
  });
  describe.skip('token function', () => {
    describe.skip('with the correct code', () => {
      beforeEach(() => {
        discordMock.getToken.mockImplementation(() =>
          Promise.resolve({
            access_token: 'SOME_TOKEN',
            token_type: 'bearer',
            scope: 'scope1,scope2',
          })
        );
        crypto.makeIdToken.mockImplementation(() => 'ENCODED TOKEN');
      });

      it('returns a token', async () => {
        const token = await openid.getTokens(
          MOCK_CODE,
          'some state',
          'somehost.com'
        );
        expect(token).toEqual({
          access_token: 'SOME_TOKEN',
          id_token: 'ENCODED TOKEN',
          scope: 'openid scope1 scope2',
          token_type: 'bearer',
        });
      });
    });
    describe.skip('with a bad code', () => {
      beforeEach(() => {
        discordMock.getToken.mockImplementation(() =>
          Promise.reject(new Error('Bad code'))
        );
      });
      it('fails', () =>
        expect(openid.getUserInfo('bad token', 'two', 'three')).rejects.toThrow(
          new Error('Bad token')
        ));
    });
  });
  describe.skip('jwks', () => {
    it('Returns the right structure', () => {
      const mockKey = { key: 'mock' };
      crypto.getPublicKey.mockImplementation(() => mockKey);
      expect(openid.getJwks()).toEqual({ keys: [mockKey] });
    });
  });
  describe.skip('authorization', () => {
    beforeEach(() => {
      discordMock.getAuthorizeUrl.mockImplementation(
        (client_id, scope, state, response_type) =>
          `https://not-a-real-host.com/authorize?client_id=${client_id}&scope=${scope}&state=${state}&response_type=${response_type}`
      );
    });
    it('Redirects to the authorization URL', () => {
      expect(
        openid.getAuthorizeUrl('client_id', 'scope', 'state', 'response_type')
      ).toEqual(
        'https://not-a-real-host.com/authorize?client_id=client_id&scope=scope&state=state&response_type=response_type'
      );
    });
  });
  describe.skip('openid-configuration', () => {
    describe.skip('with a supplied hostname', () => {
      it('returns the correct response', () => {
        expect(openid.getConfigFor('not-a-real-host.com')).toEqual({
          authorization_endpoint: 'https://not-a-real-host.com/authorize',
          claims_supported: [
            'sub',
            'name',
            'preferred_username',
            'profile',
            'picture',
            'website',
            'email',
            'email_verified',
            'updated_at',
            'iss',
            'aud',
          ],
          display_values_supported: ['page', 'popup'],
          id_token_signing_alg_values_supported: ['RS256'],
          issuer: 'https://not-a-real-host.com',
          jwks_uri: 'https://not-a-real-host.com/.well-known/jwks.json',
          request_object_signing_alg_values_supported: ['none'],
          response_types_supported: [
            'code',
            'code id_token',
            'id_token',
            'token id_token',
          ],
          scopes_supported: ['openid', 'read:user', 'user:email'],
          subject_types_supported: ['public'],
          token_endpoint: 'https://not-a-real-host.com/token',
          token_endpoint_auth_methods_supported: [
            'client_secret_basic',
            'private_key_jwt',
          ],
          token_endpoint_auth_signing_alg_values_supported: ['RS256'],
          userinfo_endpoint: 'https://not-a-real-host.com/userinfo',
          userinfo_signing_alg_values_supported: ['none'],
        });
      });
    });
  });
});

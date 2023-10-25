const { pactWith } = require('jest-pact');
const path = require('path');
const discord = require('./discord');

jest.mock('./config', () => ({
  COGNITO_REDIRECT_URI: 'COGNITO_REDIRECT_URI',
  OAUTH_CLIENT_SECRET: 'OAUTH_CLIENT_SECRET',
  OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
  OAUTH_API_URL: 'OAUTH_API_URL',
}));

pactWith(
  {
    log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'discord-cognito-openid-wrapper',
    provider: 'Discord.com',
  },
  (provider) => {
    describe.skip('Discord Client Pact', () => {
      describe.skip('UserDetails endpoint', () => {
        const userDetailsRequest = {
          uponReceiving: 'a request for user details',
          withRequest: {
            method: 'GET',
            path: '/user',
            headers: {
              Accept: 'application/vnd.discord.v3+json',
              Authorization: `token THIS_IS_MY_TOKEN`,
            },
          },
        };
        describe.skip('When the access token is good', () => {
          const EXPECTED_BODY = { name: 'Tim Jones' };
          beforeEach(() => {
            const interaction = {
              ...userDetailsRequest,
              state: 'Where the access token is good',
              willRespondWith: {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: EXPECTED_BODY,
              },
            };
            return provider.addInteraction(interaction);
          });

          // add expectations
          it('returns a sucessful body', () =>
            discord(provider.mockService.baseUrl)
              .getUserDetails('THIS_IS_MY_TOKEN')
              .then((response) => {
                expect(response).toEqual(EXPECTED_BODY);
              }));
        });
        describe.skip('When the access token is bad', () => {
          const EXPECTED_ERROR = {
            error: 'This is an error',
            error_description: 'This is a description',
          };
          beforeEach(() => {
            const interaction = {
              ...userDetailsRequest,
              state: 'Where the access token is bad',
              willRespondWith: {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: EXPECTED_ERROR,
              },
            };
            return provider.addInteraction(interaction);
          });

          // add expectations
          it('rejects the promise', () =>
            expect(
              discord(provider.mockService.baseUrl).getUserDetails(
                'THIS_IS_MY_TOKEN'
              )
            ).rejects.toThrow(
              new Error('Request failed with status code 400')
            ));
        });
        describe.skip('When there is a server error response', () => {
          const EXPECTED_ERROR = {
            error: 'This is an error',
            error_description: 'This is a description',
          };
          beforeEach(() => {
            const interaction = {
              ...userDetailsRequest,
              state: 'Where there is a server error response',
              willRespondWith: {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: EXPECTED_ERROR,
              },
            };
            return provider.addInteraction(interaction);
          });

          // add expectations
          it('rejects the promise', () =>
            expect(
              discord(provider.mockService.baseUrl).getUserDetails(
                'THIS_IS_MY_TOKEN'
              )
            ).rejects.toThrow(
              new Error(
                'Discord API responded with a failure: This is an error, This is a description'
              )
            ));
        });
      });

      describe.skip('Authorization endpoint', () => {
        describe.skip('always', () => {
          it('returns a redirect url', () => {
            expect(
              discord(provider.mockService.baseUrl).getAuthorizeUrl(
                'client_id',
                'scope',
                'state',
                'response_type'
              )
            ).toEqual(
              `${provider.mockService.baseUrl}/login/oauth2/authorize?client_id=client_id&scope=scope&state=state&response_type=response_type`
            );
          });
        });
      });

      describe.skip('Auth Token endpoint', () => {
        const accessTokenRequest = {
          uponReceiving: 'a request for an access token',
          withRequest: {
            method: 'POST',
            path: '/login/oauth2/access_token',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: {
              // OAuth required fields
              grant_type: 'authorization_code',
              redirect_uri: 'COGNITO_REDIRECT_URI',
              client_id: 'OAUTH_CLIENT_ID',
              // Discord Specific
              response_type: 'code',
              client_secret: 'OAUTH_CLIENT_SECRET',
              code: 'SOME_CODE',
            },
          },
        };

        describe.skip('When the code is good', () => {
          const EXPECTED_BODY = {
            access_token: 'xxxx',
            refresh_token: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
            expires_in: 21600,
          };
          beforeEach(() => {
            const interaction = {
              ...accessTokenRequest,
              state: 'Where the code is good',
              willRespondWith: {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: EXPECTED_BODY,
              },
            };
            return provider.addInteraction(interaction);
          });

          // add expectations
          it('returns a sucessful body', () =>
            discord(provider.mockService.baseUrl)
              .getToken('SOME_CODE')
              .then((response) => {
                expect(response).toEqual(EXPECTED_BODY);
              }));
        });
        describe.skip('When the code is bad', () => {
          const EXPECTED_ERROR = {
            error: 'This is an error',
            error_description: 'This is a description',
          };
          beforeEach(() => {
            const interaction = {
              ...accessTokenRequest,
              state: 'Where the code is bad',
              willRespondWith: {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: EXPECTED_ERROR,
              },
            };
            return provider.addInteraction(interaction);
          });

          // add expectations
          it('rejects the promise', (done) => {
            discord(provider.mockService.baseUrl)
              .getToken('SOME_CODE')
              .catch(() => {
                done();
              });
          });
        });
        describe.skip('When there is a server error response', () => {
          const EXPECTED_ERROR = {
            error: 'This is an error',
            error_description: 'This is a description',
          };
          beforeEach(() => {
            const interaction = {
              ...accessTokenRequest,
              state: 'Where there is a server error response',
              willRespondWith: {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: EXPECTED_ERROR,
              },
            };
            return provider.addInteraction(interaction);
          });

          // add expectations
          it('rejects the promise', (done) => {
            discord(provider.mockService.baseUrl)
              .getToken('SOME_CODE')
              .catch(() => {
                done();
              });
          });
        });
      });
    });
  }
);

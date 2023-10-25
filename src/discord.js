const axios = require('axios');
const qs = require('querystring');

const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  COGNITO_REDIRECT_URI,
  PROVIDER_NAME,
  OAUTH_API_URL,
} = require('./config');
const logger = require('./connectors/logger');

const getApiEndpoints = (apiBaseUrl = OAUTH_API_URL) => {
  if (PROVIDER_NAME === 'discord') {
    return {
      userDetails: `${apiBaseUrl}/users/@me`,
      oauthToken: `${apiBaseUrl}/oauth2/token`,
      oauthAuthorize: `${apiBaseUrl}/oauth2/authorize`,
    };
  }
  if (PROVIDER_NAME === 'roblox') {
    return {
      userDetails: `${apiBaseUrl}/v1/userinfo`,
      oauthToken: `${apiBaseUrl}/v1/token`,
      oauthAuthorize: `${apiBaseUrl}/v1/authorize`,
    };
  }

  return {};
};

const check = (response) => {
  logger.debug('Checking response: %j', response, {});
  if (response.data) {
    if (response.data.error) {
      throw new Error(
        `Provider API responded with a failure: ${response.data.error}, ${response.data.error_description}`
      );
    } else if (response.status === 200) {
      return response.data;
    }
  }
  throw new Error(
    `Provider API responded with a failure: ${response.status} (${response.statusText})`
  );
};

const discordGet = (url, accessToken) =>
  axios({
    method: 'get',
    url,
    headers: {
      Accept: `application/vnd.${PROVIDER_NAME}.v3+json`,
      Authorization: `Bearer ${accessToken}`,
    },
  });

module.exports = (apiBaseUrl, loginBaseUrl) => {
  const urls = getApiEndpoints(apiBaseUrl, loginBaseUrl || apiBaseUrl);
  return {
    getAuthorizeUrl: (client_id, scope, state, response_type) => {
      const cleanScope = scope
        .split(' ')
        .filter((i) => i !== 'openid')
        .join(' ');
      return `${
        urls.oauthAuthorize
      }?client_id=${client_id}&scope=${encodeURIComponent(
        cleanScope
      )}&state=${state}&response_type=${response_type}`;
    },
    getUserDetails: (accessToken) =>
      discordGet(urls.userDetails, accessToken).then(check),
    getToken: (code) => {
      const data = {
        // OAuth required fields
        grant_type: 'authorization_code',
        redirect_uri: COGNITO_REDIRECT_URI,
        code,
      };

      logger.debug(
        'Getting token from %s with data: %j',
        urls.oauthToken,
        data,
        {}
      );

      const bufferAuth = Buffer.from(
        `${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`
      );
      const authorization = bufferAuth.toString('base64');

      return axios({
        method: 'post',
        url: urls.oauthToken,
        headers: {
          Authorization: `Basic ${authorization}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      }).then(check);
    },
  };
};

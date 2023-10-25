const config = require('./config');

const ensureString = (variableName) => {
  if (typeof config[variableName] !== 'string') {
    throw new Error(
      `Environment variable ${variableName} must be set and be a string`
    );
  }
};

const ensureNumber = (variableName) => {
  if (typeof config[variableName] !== 'number') {
    throw new Error(
      `Environment variable ${variableName} must be set and be a number`
    );
  }
};

const requiredStrings = [
  'OAUTH_CLIENT_ID',
  'OAUTH_CLIENT_SECRET',
  'PROVIDER_NAME',
  'COGNITO_REDIRECT_URI',
];

const requiredNumbers = ['PORT'];

module.exports = () => {
  requiredStrings.forEach(ensureString);
  requiredNumbers.forEach(ensureNumber);
};

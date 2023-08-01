module.exports = {
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI,
  DISCORD_API_URL: process.env.DISCORD_API_URL,
  DISCORD_LOGIN_URL: process.env.DISCORD_LOGIN_URL,
  PORT: parseInt(process.env.PORT, 10) || undefined,

  // Splunk logging variables
  SPLUNK_URL: process.env.SPLUNK_URL,
  SPLUNK_TOKEN: process.env.SPLUNK_TOKEN,
  SPLUNK_SOURCE: process.env.SPLUNK_SOURCE,
  SPLUNK_SOURCETYPE: process.env.SPLUNK_SOURCETYPE,
  SPLUNK_INDEX: process.env.SPLUNK_INDEX,
};

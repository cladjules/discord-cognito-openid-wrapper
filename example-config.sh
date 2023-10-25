#!/bin/bash -eu

# Variables always required
export OAUTH_CLIENT_ID=# <Discord OAuth App Client ID>
export OAUTH_CLIENT_SECRET=# <Discord OAuth App Client Secret>
export COGNITO_REDIRECT_URI=# https://<Your Cognito Domain>/oauth2/idpresponse
# Change these if used with Discord Enterprise (see below)
# export PROVIDER_NAME=discord|roblox // discord and roblox are supported right now
export PROVIDER_NAME=discord
export OAUTH_API_URL=https://discord.com/api

# export PROVIDER_NAME=roblox
# export OAUTH_API_URL=https://apis.roblox.com/oauth

# Variables required if Splunk logger is used
# SPLUNK_URL=# https://<Splunk HEC>/services/collector/event/1.0
# SPLUNK_TOKEN=# Splunk HTTP Event Collector token
# SPLUNK_SOURCE=# Source for all logged events
# SPLUNK_SOURCETYPE=# Sourcetype for all logged events
# SPLUNK_INDEX=# Index for all logged events

# Variables required if deploying with API Gateway / Lambda
export BUCKET_NAME=# An S3 bucket name to use as the deployment pipeline
export STACK_NAME=# The name of the stack to create on CloudFormation
export REGION=# AWS region to deploy the stack and bucket in
export STAGE_NAME=# Stage name to create and deploy to in API gateway

# Variables required if deploying a node http server
export PORT=# <Port to start the server on>

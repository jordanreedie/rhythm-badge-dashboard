#!/usr/bin/env bash

app_config_file="src/js/config/app.config.js"
config_template="app.config.template"

echo "Reading Config From .env"
source ./.env
echo "$API_URL"
echo "$API_TOKEN"

echo "Generating Config File"
cp $config_template $app_config_file
sed -i "" "s|API_URL|$API_URL|g" $app_config_file
sed -i "" "s|API_TOKEN|$API_TOKEN|g" $app_config_file

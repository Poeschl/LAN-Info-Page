#!/usr/bin/env sh
set -e

echo "Configuring environment vars..."
ENV_FILE=$(ls /app/server/chunks/_/env.mjs)

DATABASE_HOST="${DATABASE_HOST:-database}"
DATABASE_PORT="${DATABASE_PORT:-5432}"
DATABASE_USER="${DATABASE_USER:-postgres}"
DATABASE_PASSWORD="${DATABASE_PASSWORD:-postgres}"
DATABASE_NAME="${DATABASE_NAME:-postgres}"
LINKS_CONFIG_PATH="${LINKS_CONFIG_PATH:-./config/links.yaml}"
STATS_ONLINE_THRESHOLD_MINUTES="${STATS_ONLINE_THRESHOLD_MINUTES:-15}"
STATS_EXPIRE_HOURS="${STATS_EXPIRE_HOURS:-24}"
DOWNLOADS_PATH="${DOWNLOADS_PATH:-./config/downloads}"
LOG_LEVEL="${LOG_LEVEL:-info}"
OIDC_DISCOVERY_URL="${OIDC_DISCOVERY_URL:-}"
OIDC_CLIENT_ID="${OIDC_CLIENT_ID:-}"
OIDC_CLIENT_SECRET="${OIDC_CLIENT_SECRET:-}"

sed -i \
  -e "s|\"databaseHost\": \"[^\"]*\"|\"databaseHost\": \"$DATABASE_HOST\"|" \
  -e "s|\"databasePort\": [0-9]*|\"databasePort\": $DATABASE_PORT|" \
  -e "s|\"databaseUser\": \"[^\"]*\"|\"databaseUser\": \"$DATABASE_USER\"|" \
  -e "s|\"databasePassword\": \"[^\"]*\"|\"databasePassword\": \"$DATABASE_PASSWORD\"|" \
  -e "s|\"databaseName\": \"[^\"]*\"|\"databaseName\": \"$DATABASE_NAME\"|" \
  -e "s|\"linksConfigPath\": \"[^\"]*\"|\"linksConfigPath\": \"$LINKS_CONFIG_PATH\"|" \
  -e "s|\"downloadsPath\": \"[^\"]*\"|\"downloadsPath\": \"$DOWNLOADS_PATH\"|" \
  -e "s|\"statsOnlineThresholdMinutes\": [0-9]*|\"statsOnlineThresholdMinutes\": $STATS_ONLINE_THRESHOLD_MINUTES|" \
  -e "s|\"statsExpireHours\": [0-9]*|\"statsExpireHours\": $STATS_EXPIRE_HOURS|" \
  -e "s|\"logLevel\": \"[^\"]*\"|\"logLevel\": \"$LOG_LEVEL\"|" \
  -e "s|\"oidcOpenidAutoDiscoveryUrl\": \"[^\"]*\"|\"oidcOpenidAutoDiscoveryUrl\": \"$OIDC_DISCOVERY_URL\"|" \
  -e "s|\"oidcClientId\": \"[^\"]*\"|\"oidcClientId\": \"$OIDC_CLIENT_ID\"|" \
  -e "s|\"oidcClientSecret\": \"[^\"]*\"|\"oidcClientSecret\": \"$OIDC_CLIENT_SECRET\"|" \
  $ENV_FILE

# oidcAllowInsecureCookies is read via Nuxt's runtimeConfig, to avoid optimization errors from rollup
OIDC_ALLOW_INSECURE_COOKIES="${OIDC_ALLOW_INSECURE_COOKIES:-false}"
OIDC_ALLOW_INSECURE_COOKIES=$(echo "$OIDC_ALLOW_INSECURE_COOKIES" | tr '[:upper:]' '[:lower:]')
if [ "$OIDC_ALLOW_INSECURE_COOKIES" != "true" ]; then
  OIDC_ALLOW_INSECURE_COOKIES="false"
fi
export NUXT_OIDC_ALLOW_INSECURE_COOKIES="$OIDC_ALLOW_INSECURE_COOKIES"

SESSION_PASSWORD_FILE="/app/data/.session_password"

if [ -n "$SESSION_PASSWORD" ]; then
  echo "Using provided session password..."
  export NUXT_SESSION_PASSWORD="$SESSION_PASSWORD"
elif [ -f "$SESSION_PASSWORD_FILE" ]; then
  echo "Loading existing session password from file..."
  export NUXT_SESSION_PASSWORD=$(cat "$SESSION_PASSWORD_FILE")
else
  echo "Generating new session password..."
  mkdir -p "$(dirname "$SESSION_PASSWORD_FILE")"
  NUXT_SESSION_PASSWORD=$(cat /dev/urandom | tr -dc 'a-f0-9' | head -c 64)
  echo "$NUXT_SESSION_PASSWORD" > "$SESSION_PASSWORD_FILE"
  chmod 600 "$SESSION_PASSWORD_FILE"
  echo "Session password saved to $SESSION_PASSWORD_FILE"
  export NUXT_SESSION_PASSWORD
fi

echo "Starting server..."

exec "node" "/app/server/index.mjs"

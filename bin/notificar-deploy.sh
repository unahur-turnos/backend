#!/bin/bash

if [ $# -lt 1 ]; then
    echo -e "WARNING!!\nYou need to pass the WEBHOOK_URL environment variable as the second argument to this script.\nFor details & guide, visit: https://github.com/DiscordHooks/travis-ci-discord-webhook" && exit
fi

VERSION=$1
WEBHOOK_URL=$2
PROJECT_SLUG=$3
AVATAR_URL="https://freedesignfile.com/upload/2017/08/rocket-icon-vector.png"
URL="https://github.com/$PROJECT_SLUG/releases/tag/$VERSION"
TITLE="[$PROJECT_SLUG] ¡Versión $VERSION publicada!"

TIMESTAMP=$(date -u +%FT%TZ)
WEBHOOK_DATA='{
    "username": "",
    "avatar_url": "'"$AVATAR_URL"'",
    "embeds": [ {
            "color": 3066993,
            "title": "'"$TITLE"'",
            "url": "'"$URL"'",
            "description": "Ahora, a poner manos a la obra y verificar que no se haya roto nada.\n:smiling_imp::detective:",
            "timestamp": "'"$TIMESTAMP"'",
            "fields": [
                { "name": "Aplicación", "value": "[:computer: Probar ahora](http://turnos.unahur.edu.ar)", "inline": true },
                { "name": "Cambios", "value": "'"[:pencil: Ver en GitHub]($URL)"'", "inline": true }
            ]
    } ]
}'

echo -e "[Webhook]: Sending webhook to Discord...\\n";

(curl --fail --progress-bar -A "Deploy-Webhook" -H Content-Type:application/json -H X-Author:k3rn31p4nic#8383 -d "$WEBHOOK_DATA" "$WEBHOOK_URL" \
&& echo -e "\\n[Webhook]: Successfully sent the webhook.") || echo -e "\\n[Webhook]: Unable to send webhook."

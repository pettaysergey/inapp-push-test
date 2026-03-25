#!/bin/sh
set -e
#replace_vars () {
#  tmpfile=$(mktemp)
#  ENV_VARS=\'$(awk 'BEGIN{for(v in ENVIRON) print "$"v}')\'
#  for f in unp-admin-ui/*.js; do
#    envsubst "$ENV_VARS" < "$f" > "$tmpfile" && mv "$tmpfile" "$f"
#  done
#}
#
#replace_vars
# for filename in /opt/app-root/src/nsm-operator-ui/js/*.js*; do
# echo $(sed -e 's/!@#/${BASE_URL}/g' "$filename" | envsubst) > "$filename"
# done
exec "$@"

# https://github.com/docker-library/mongo/issues/414#issuecomment-653574486
# generates a random keyfile and appends the --keyFile arg to the mongo container cmd if necessary. A keyfile is needed for replica sets

if _mongod_hack_have_arg --replSet "$@" && ! _mongod_hack_have_arg --keyFile "$@"; then
  KEY_FILE="$HOME/.keyFile"
  _mongod_hack_ensure_arg_val --keyFile "$KEY_FILE" "$@"
  set -- "${mongodHackedArgs[@]}"

  KEY="$(echo -n "$MONGO_INITDB_ROOT_PASSWORD" | openssl dgst -sha256 -binary | openssl base64 -A)"
  cat > "$KEY_FILE" <<< "$KEY"
  chmod 0400 "$KEY_FILE"
  chown 999:999 "$KEY_FILE"
  echo "$BASH_SOURCE: added '--keyFile' '$KEY_FILE' (size $(wc -c "$KEY_FILE"))"
fi
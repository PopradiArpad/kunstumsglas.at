if [[ ! -w "$1" ]]; then
  echo Error: Name of an existing and writable file is needed!;
  exit 1;
fi


HEADER=$(cat <<'EOF'
/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


EOF
);

TEMP="$1.temp";
cat "$1">"$TEMP";
echo "$HEADER">"$1";
cat "$TEMP">>"$1";
rm "$TEMP";

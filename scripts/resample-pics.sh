#exit on first error
set -e;

QUALITY="83";
RESIZE="1600x1600";

if [[ -z "$1" ]]; then
  echo "Verwendung:";
  echo "resample-pics.sh ORDNERNAME";
  echo "Das Programm macht eine Kopie von jedes jpg Bild in ORDNERNAME-$RESIZE-$QUALITY"
  echo "verkleinert zu $RESIZE pixel";
  echo "und niedrigere Qualität von $QUALITY%";
  exit 1;
fi
DIR=$1;

NEW_DIR="$DIR-$RESIZE-$QUALITY";

mkdir -p $NEW_DIR;

for i in `find $DIR -name '*.JPG' -or -name '*.jpg'`; do
  NEW_FILE=${i//$DIR/$NEW_DIR};
  echo $i;
  echo $NEW_FILE;
  echo;
  convert $i -resize $RESIZE -strip -quality $QUALITY $NEW_FILE;
done

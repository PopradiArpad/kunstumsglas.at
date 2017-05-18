#exit on first error
set -e;

if [[ -z "$1" ]]; then
  echo The directory name must be set;
  exit 1;
fi
DIR=$1;

NEW_DIR="$DIR-resampled";

mkdir -p $NEW_DIR;

for i in `find $DIR -name '*.JPG' -or -name '*.jpg'`; do
  NEW_FILE=${i//$DIR/$NEW_DIR};
  echo $i;
  echo $NEW_FILE;
  echo;
  convert $i -strip -quality 85 $NEW_FILE;
done

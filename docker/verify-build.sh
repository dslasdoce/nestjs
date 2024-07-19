# build tsc to makesure code adheres to standard
tsc

TYPE_ERRORS="$(tsc)"

find . -path "./src/*.js" -delete
find . -path "./src/*.js.map" -delete
rm -rf ./dist

if [ -z $TYPE_ERRORS ]; then
  # remove build files

  echo "Build Verification Success"
else
  echo "Build Verification Failed"
  exit 1
fi

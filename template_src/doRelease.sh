#!/bin/bash


if [ "$1" == "run" ]; then
  echo "-------------------------------------------";
  echo "DOING ANDROID RELEASE RUN";
  echo "-------------------------------------------";
  cordova run android --release
else
  echo "-------------------------------------------";
  echo "DOING ANDROID RELEASE BUILD";
  echo "-------------------------------------------";
  cordova build android --release
fi



echo "-------------------------------------------";
echo "DONE WITH ANDROID RELEASE BUILD";
echo "-------------------------------------------";


exit 0;
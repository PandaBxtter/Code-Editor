#!/bin/bash
PROJECT_DIR="$1"

cp -r templates/capacitor-app/* "$PROJECT_DIR"
cp -r "$PROJECT_DIR"/* "$PROJECT_DIR/www/"

cd "$PROJECT_DIR"
npx cap sync android
cd android
./gradlew assembleRelease
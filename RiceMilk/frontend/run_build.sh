#!/usr/bin/env bash
rm -rf dist/
rm -rf ../static
rm -rf ../templates

npm run build

cp -r ./dist/templates ../

python ../manage.py collectstatic --noinput
python ../manage.py runserver

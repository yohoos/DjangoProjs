rm -rf dist/
rm -rf ../client/templates
rm -rf ../client/static
rm -rf ../static

npm run build

cp -r ./dist/templates ../client/
cp -r ./dist/static ../client/

python ../manage.py collectstatic --noinput

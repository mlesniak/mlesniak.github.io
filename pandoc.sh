#!/usr/bin/env sh

set -e
set -x

git checkout main
git add . && git commit -m"$(date)" && git push

git checkout gh-pages
git merge main -m"$(date)"
for md in $(find . -name \*md)
do
    echo "Parsing $md"
    pandoc --quiet $md --css pandoc.css -s -o $(echo $md|rev|cut -d. -f2|rev|cut -b2-).html
done
git add . && git commit -m"$(date)" 
git push
git checkout main
#!/usr/bin/env sh

set -e
set -x

for md in $(find . -name \*md)
do
    echo "Parsing $md"
    pandoc --quiet $md --css pandoc.css --template template.html -B header.html -s -o docs/$(echo $md|rev|cut -d. -f2|rev|cut -b2-).html
done
cp pandoc.css CNAME .nojekyll *.png *.ico docs

if [ -z "$1" ]
then
    git add . && git commit -m"$(date)" && git push
fi

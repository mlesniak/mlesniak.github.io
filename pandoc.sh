#!/usr/bin/env sh

set -e
set -x

for md in $(find . -name \*md)
do
    echo "Parsing $md"
    pandoc --quiet $md --css pandoc.css -B header.html -s -o docs/$(echo $md|rev|cut -d. -f2|rev|cut -b2-).html
done
cp pandoc.css CNAME .nojekyll docs
git add . && git commit -m"$(date)" && git push
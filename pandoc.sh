#!/usr/bin/env sh

for md in $(find . -name \*md)
do
    echo "Parsing $md"
    pandoc --quiet $md --css pandoc.css -s -o $(echo $md|rev|cut -d. -f2|rev|cut -b2-).html
done

echo "Pushing to GitHub"
(git add . && git commit -m"$(date)" && git push) >/dev/null 2>&1
(git checkout gh-pages && git merge main && git push && git checkout main) >/dev/null 2>&1
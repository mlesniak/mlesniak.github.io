#!/usr/bin/env sh

set -e

for md in $(find . -name \*md)
do
    echo "Parsing $md"
    pandoc --quiet $md --no-highlight --css pandoc.css --template template.html -o docs/$(echo $md|rev|cut -d. -f2|rev|cut -b2-).html
done
cp *.css *.js CNAME .nojekyll *.png *.ico docs

cd docs
# Extract unique prefixes from all HTML files
prefixes=$(grep -oE '<pre class="[a-zA-Z0-9_-]+"' *.html | sort | uniq | sed 's/<pre class="//;s/"//' | cut -d: -f2)

for prefix in $prefixes; do
    echo "<$prefix>"
    for file in *.html; do
        sed -i "" "s/<pre class=\"$prefix\"><code>/<pre><code class=\"language-$prefix\">/g" "$file" 
    done
done
cd ..


if [ -z "$1" ]
then
    git add . && git commit -m"Update" && git push
fi

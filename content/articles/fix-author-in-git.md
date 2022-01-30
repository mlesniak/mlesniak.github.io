---
title: "Fix Author in Git"
date: 2022-01-30T15:13:41+01:00
draft: false
---

# Change wrong author and email in git

In a situation where you want to change the author's name and/or email address, you can use the following [snippet which I've found on StackOverflow](https://stackoverflow.com/a/750182):


    #!/bin/sh

    git filter-branch --env-filter '
    OLD_EMAIL="mail@mlesniak.foo"
    CORRECT_NAME="Michael Lesniak"
    CORRECT_EMAIL="mail@mlesniak.com"
    if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
    then
        export GIT_COMMITTER_NAME="$CORRECT_NAME"
        export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    fi
    if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
    then
        export GIT_AUTHOR_NAME="$CORRECT_NAME"
        export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
    fi
    ' --tag-name-filter cat -- --branches --tags
    
Press `ENTER` to ignore the warning and continue with a `git push --force`. Note that this will rewrite all SHA values, so I advise to use it only on repositories you've control over, since all local clones need to repull to be consistent again.


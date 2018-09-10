---
title: 'Shortcut Links in zsh'
date: '2018-09-03'
draft: false
tags: 
    - shell
    - zsh
---

ZSH is my favourite shell, and while it comes with a lot of features out of the box and is even more powerful with [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) that does not mean that my daily workflow can not be improved even more. A situation I'm facing often is to switch between multiple directories. While the autojump plugin exists I have to admit that I dislike to type the necessary prefix. Hence, the shell function `link` was created:

~~~sh
function link() {
  if [ -z "$1" ]
  then
    target=$(basename `pwd|tr "[A-Z]" "[a-z]"`)
  else
    target=$1
  fi
  echo "alias $target='cd $(pwd)'" >>~/.zshrc
}
~~~

Append it in your `~/.zshrc` and use it as follows:

![animation](/images/link.gif)

If you do not provide a command line argument, the directory's name will be used. Otherwise the given argument is chosen for the alias. Do not forget to reload your shell configuration if you want to try this in your current session.

**Update 2018-09-10** Reddit user [wjv](https://www.reddit.com/user/wjv) stated that a better approach might be to use zsh's directory hash ([link](https://www.reddit.com/r/zsh/comments/9eklqu/shortcut_links_in_zsh/e5pq0vn/****)), i. e. 

    hash -d beautiful="~/very/long/name/for/something/Beautiful”

While this approach uses zsh internals, it does not work as well for me since I have to type the ~ character which is not easily reachable on my keyboard layout. 

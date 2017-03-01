#!/bin/bash

jekyll build && rsync -r _site/* mlesniak.com:www/mlesniak.com/
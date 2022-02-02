---
title: "JVM IO Performance"
date: 2022-01-30T15:05:13+01:00
draft: false
---

# Why is everything so slow?

## Motivation
- Why do I have to wait at all when applications start?
- Moore's law
- Raw numbers of my machine
- positive examples: fzf, ack, ...
- Probably due to all the layers upon layers...
- Perform some experiments how fast we can get a naive file scanning app in Java

## Basic code

## Measurements

Reference is unix shell

    ❯ pwd
    /Users/m/Dropbox
    ❯ time (find .|wc -l)
       48488
    ( find . | wc -l; )  0.03s user 0.20s system 101% cpu 0.230 total

## Potential Improvements

## Questions

- Is it worth it? Writing stuff in non VM based languages? What about things like WASM?

## Resources

- GitHub repository containing all examples

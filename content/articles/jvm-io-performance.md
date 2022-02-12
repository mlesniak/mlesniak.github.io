---
title: "Improving JVM IO Performance"
date: 2022-02-06T15:05:13+01:00
draft: true
---

# Why is everything so slow?

## Motivation

In general I'm a fan of balanced approaches, i.e one shouldn't spend precious engineering time on useless features or optimze code which is only executed in an edge case. On the other hand, I'm writing this on a decent MacBook Pro 13" (QuadCore 2.3 GHz, 32 GB RAM and a 1 TB SSD) and I still have to wait for things to happen? Thus, I sometimes wonder if our craft has lost the willingness to improve software (and it's perceived performance) and instead waits for (Moore's Law)[https://en.wikipedia.org/wiki/Moore%27s_law] to catch up (hint: it's not going to happen at the same pace, e.g. due to annyoing problems with fundamental laws in physics).

There are still a lot of positive examples of software which is running smooth and fast and (subjectively) performant, e.g. vim or fzf, which are coincidentally both console applications. Speaking of fzf: I accidentally opened it while being in my Dropbox folder with over 45k files and it showing a selection for all files (nearly) instantaneously. On my day job, I work mostly in JVM environments (with a bit of Go and Python) and I wondered if I'd be able to achieve the same performance metrics.

## The Task

The task is very simple: list all files and directories in a given subdirectory and count their number for a basic sanity check. This can trivially be achived with `find` and `wc` via

    ❯ pwd
    /Users/m/Dropbox
    ❯ time (find ~/Dropbox|wc -l)
    ( find ~/Dropbox | wc -l; )  0.03s user 0.23s system 102% cpu 0.262 total

## Baseline Reference Code

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

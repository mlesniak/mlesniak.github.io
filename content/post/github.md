---
title: 'A curated list of some GitHub projects'
date: '2018-09-01'
draft: false
tags: 
    - github
    - go
    - raytracing
    - lecture
    - webengineering
    - p5js
    - haskell
---

One of my philosophies is _release early, make a fool of yourself quickly, improve and iterate_. Hence I put many of my smaller and larger projects on [GitHub](https://github.com/mlesniak?tab=repositories). To be honest, most of them are left in an unfinished state: after I've solved the challenging problem, the project is mostly left for future reference. Some projects which are particularly interesting are listed below:

- [port-scanner](https://github.com/mlesniak/port-scanner) is a port-scanner written in Go and one of the first non-toy Go projects I've written. In particular, it has a decent documentation, travis integration and GitHub's code of conduct. I use it nearly daily since having a single static binary which can easily be copied into a running docker container for debugging and port examination is quite handy.

    ~~~shell
    # port-scanner -hostname mlesniak.com -parallel 20 -port 75-85 -timeout 1
    PORT      STATUS  SERVICE
    75/tcp    closed
    76/tcp    closed  deos
    77/tcp    closed
    78/tcp    closed  vettcp
    79/tcp    closed  finger
    80/tcp    open    www-http
    81/tcp    closed
    82/tcp    closed  xfer
    83/tcp    closed  mit-ml-dev
    84/tcp    closed  ctf
    85/tcp    closed  mit-ml-dev
    ~~~

- I really like to play around with visual algorithms. They provide instantaneous feedback which is often lost in today's software development. The JavaScript implementation of [processing](https://processing.org/), [p5.js](https://p5js.org/) serves as a great basis for these experiments which are partially extended from miscellaneous [demos](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw). You can find [starfields](https://github.com/mlesniak/starfield), [conway's game of life](https://github.com/mlesniak/conway), or a [matrix](https://github.com/mlesniak/matrix) titlescreen simulation.

- [Java raytracer](https://github.com/mlesniak/raytracer) is a simple raytracer written in Java, supporting a simple animation system, a realtime view, shadows and gouraud shading. This project can serve as the fundament for your own raytracer experiments.

- [Haskell OpenGL demo](https://github.com/mlesniak/game) was developed as part of my PhD studies and served as an example for my students that real world applications were possible with Haskell. It shows how to use Haskell with an OpenGL wrapper and integrate a simple 2D physics engine.

- From time to time I conduct lectures about web-engineering at the University of Kassel which can be taken as part of a Master's degree in computer science. The code to all examples can be found [here](https://github.com/micromata/webengineering-2015-ss) for summer semester 2015 and [here](https://github.com/micromata/webengineering-2017) for summer semester 2017.

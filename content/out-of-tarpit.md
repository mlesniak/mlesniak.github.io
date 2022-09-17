---
title: "Out of Tarpit"
date: 2022-09-17T11:17:51+02:00
draft: true
---

[Source](https://news.ycombinator.com/item?id=22876005)

The paper "Out of the tar pit" (https://github.com/papers-we-love/papers-we-love/blob/master...) discusses this in more details. Basically it argues that one needs to separate the complexity into essential complexity (complexity inherent to the problem) and accidental complexity (complexity due to the way the solution is designed). The idea is to reduce accidental complexity as much as possible while making the essential complexity more managegable.

The paper also discusses that you can separate a program into

1. state (data that changes over time)
2. behavior (computational logic)

In order to reduce the accidental complexity, you can use functional programming (which is purely behavior, devoid of complexity due to state mutation) for the behavior part. For the state part, you can use a relational database to manage it in a more systematic manner. They call it functional-relational approach to software design.

If you do game development, you likely heard of ECS (entity-component-system) and data oriented programming which in a way promotes this approach to software design.

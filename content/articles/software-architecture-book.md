---
title: "Software Architecture Book"
date: 2022-07-09T07:12:31+02:00
draft: false
---

# Overview

This page contains my notes, thoughts and remarks of the
book [Fundamentals of Software Architecture: An Engineering Approach. A Comprehensive Guide to Patterns, Characteristics, and Best Practices](https://www.amazon.de/Fundamentals-Software-Architecture-Comprehensive-Characteristics/dp/1492043451/ref=sr_1_1)
. I've taken these notes as part of [Scalable Capitals](https://scalable.capital) weekly reading group where we read
technical books and discuss chapters on a weekly basis.

## (1) Introduction

TODO

## (2) Architectural Thinking

Four main aspects of thinking like an architect:

1. Understand the difference between architecture and design
2. Have a wide breadth of technical knowledge and a certain level of technical depth
3. Understand, analyze and reconcile trade-offs
4. Understand the importance of business drivers

### Architecture Versus Design

Responsiblities of architect and development team

|Architect|Development Team|
|---------|----------------|
|Analyze business requirements| Create class diagrams for component|
|Select architectural patterns| Create user interface|
|Creating components|Develop and test|

This is challenging, if architecture is independent of design ("unidirectional design flow"). Instead, architect and development team **must be on the same virtual team** to facilitate bidirectional communication.

### Technical Breadth

Expectations
- Developers must have a significant amount of technical *depth*
- Architects must have a significant amount of technical *breadth*

Knowlegde pyramid
- (A) Stuff you know
- (B) Stuff you know you don't know
- (C) Stuff you don't know you don't know

In beginning of career, focus on (A). Be aware, that one must maintain knowledge of (A), otherwise it becomes obsolete.

Value of an architect: broad understanding of technology and when to use a particular set of technologies to solve a particular problem. Hence, as an architect,
- breadth is more important than depth
- sacrifice some technical depth in favour of technical breadth (to broaden one's portfolio)

Transitioning into an architect role means to accept a shift in perspective. Difficultiers arise:
- trying to maintain expertise in a wide variety of areas -> not possible
- stale expertise -> information gets outdated (see above, maintaining knowledge)

**Frozen Caveman Anti-Pattern.** An architect, who always reverts back to their irrational concern in every acrchitectural discussion based on a single bad experience in the past => Risk assessment should be realistic.


### Analyzing Trade-Offs

### Understanding Business Drivers

### Balancing architecture and coding

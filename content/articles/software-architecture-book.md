---
title: "Software Architecture Book"
date: 2022-07-09T07:12:31+02:00
draft: false
---

# Overview

This page contains my notes, thoughts and remarks of the book [Fundamentals of Software Architecture: An Engineering Approach. A Comprehensive Guide to Patterns, Characteristics, and Best Practices](https://www.amazon.de/Fundamentals-Software-Architecture-Comprehensive-Characteristics/dp/1492043451/ref=sr_1_1). I've taken these notes as part of [Scalable Capitals](https://scalable.capital) weekly reading group where we read technical books and discuss chapters on a weekly basis.

## (1) Introduction

There's no clear path to become a software architect. 

- Industry does not have a good definition
- Role embodies a lot of different skills
- Software architecture (and engineering in general) is a moving target -- definitions would need constant updates

### Definition of Software Architecture

Software architecture consists of 

- structure of the system
    - type of system (microservice, monolith with layers, ...)
- architectural characteristics
    - next the functional criteria
    - define success criteria of the system
    - "-ilities", e.g. availability, elasticity, performance, ...
- architecture decisions
    - rules for how the system should be constructed
    - _variance_: explicit exception from the rule(s)
- design principles
    - guidelines (not rules)

### Eight core expectations

- Make architecture decisions
    - guide instead of specify
- (Continoually) analyze the architecture
- Keep current with latest trends
- Ensure compliance with made decisions
- Diverse experience
- Business domain knowledge
- Interpersonal skills
- Able to handle politics

### Architecture and Engineering

- _Unknown unknowns_ lead to iterative architectures.
- Build architectures that survive implementation and change
- -> _evolutionary architecture_ uses fitness functions to protect architectural characteristics

## Laws of Software Architecture

- Everything in software architecture is a trade-off.
- Why is more important than how.
    - -> documenting decisions (ADRs)


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

Thinking like an architect is
- seeing trade-offs in every solution
- analyzing those trade-offs to find the best solution for a particular context (environment).

While anaylzing trade-offs, it's important to look at both the benefits but also negatives of a solution.

(Omitting extensive example of topics vs. queues for a bidding system)

### Understanding Business Drivers

An architect has to understand the business drivers and need to translate them into "-ilities" such as scalability and availablity.

Two important aspects
- business domain knowledge
- collaborative relationsships with business stakeholders

### Balancing architecture and coding

Ideally, every architect should still code (to maintain technical depth, understand developer concerns, ...). 

Danger: Becoming the bottleneck, hence don't take ownership of code of a critical path in a project. Instead, delegate critical functionality to full time development teams and work on some non-critical business functionality.

In addition or as an alternative, to remain hands-on at work, architect can

- do frequent PoCs with a focus on high-quality (production-grade) code
- tackle technica debt stories (also helping the development team)
- work on bug fixes
- leverage automation, i.e. create simple command line tools
- do frequent code reviews



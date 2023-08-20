---
title: Redis in 1024 lines of code 
data: 2023-08-20
---

This article describes my approach to write a Redis clone in C#, limiting myself to 1024 lines of code (as stated by the code analysis tool [cloc](https://github.com/AlDanial/cloc)).

## The goal

Allow the official redis CLI tool to connect to our server and perform as many operations as standard conform as possible. As an experiment, I will use 

## The beginning

Of course, I could start by looking at the protocol specification and start implementing the server based on the this, but this would be a bit boring. Instead, let's fire up a plain TCP server which listens on port 6379 (redis' standard port) and check what the client sends us:

After setting up a project with `dotnet new console -o src`, let's spawn up a simple TCP server which simply output what it has received

```c#
```

and start `redis-cli` using the default docker image:

```
```

The output of the TCP server shows what data has been received. Coming back to the specification, the client seemingly sends an array with two elements. Each element is a bulk string.
---
title: Redis in 1024 lines of code 
data: 2023-08-20
---

This article describes my approach to write a Redis clone in C#, limiting myself to 1024 lines of code (as stated by the code analysis tool [cloc](https://github.com/AlDanial/cloc)). A similar approach for various topics has been discussed in books such as 
[500 Lines or Less](https://amzn.eu/d/b4iJBIa).

## The goal

The aim is to allow the official Redis CLI tool to interface with our server and execute as many standard-compliant operations as possible. As a twist in this experiment, I will be using a test-driven approach as much as possible.

## The beginning

While I could have commenced by diving into the protocol specification and building the server accordingly, I felt that might be somewhat mundane. Instead, I opted to initiate a basic TCP server, set it to listen on port 6379 (the standard port for Redis), and observe the commands the client transmits.

After setting up a project with `dotnet new console -o src`, let's spawn up a simple TCP server which simply output what it has received

```c#
// Program.cs
using System.Net.Sockets;

TcpListener server = new(6379);
server.Start();
Console.WriteLine("Server started");
while (true)
{
    TcpClient client = server.AcceptTcpClient();
    Console.WriteLine("Client connected");
    var stream = client.GetStream();

    byte[] buffer = new byte[1024];
    int read = stream.Read(buffer);
    foreach (byte b in buffer.Take(read))
    {
        Console.Write((char)b);
    }
    Console.WriteLine();
    client.Close();
}
```

Subsequently, we'll start the redis-cli through the default Docker image:

```bash
docker run --rm -it redis redis-cli -h docker.for.mac.localhost
```

The printout from the TCP server reveals the incoming data:


```
Server started
Client connected
*2
$7
COMMAND
$4
DOCS
```

Revisiting the protocol specification, it becomes evident that the client dispatches an array containing two components. Each of these is a bulk string. Essentially, the client is requesting the server to furnish a list of supported commands along with their respective documentation.

## Parsing bulk strings

setting up a test project
test for bulk string
initial data structure -- will probably change
implementation -- leave out arrays for now

## Parsing arrays


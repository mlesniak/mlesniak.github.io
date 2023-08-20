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

<!-- setting up a test project -->
I intentionally want to completely separate the actual implementation for its corresponding tests. Therefore let's setup a test project using [xUnit](https://xunit.net/) via `dotnet new xunit -o test` in the parent directory of the source code.

<!-- test for bulk string -->
The first test to verify correct parsing of bulk strings looks like
```c#
[Fact]
public void ToRedisMessage_SimpleBulkString_ReturnsCorrectResult()
{
    var message = """
                  $5
                  HELLO
                  """.ToRedisMessage();
    
    var data = RedisData.Parse(message);

    Equal(RedisData.DataType.BulkString, data.Type);
    Equal("HELLO", data.BulkString);
}
```
As you can see by the test, a bulk string consists of a `$` and a number stating the number of bytes to follow which will build up the string. Implicitly stated, but hidden in the string representation is the delimiter between elements, i.e. `\r\n`.

<!-- initial data structure -- will probably change -->
To represent the received input, and generate corresponding output later on, let's start with a basic data structure which will probably be changed a lot once we gain more insights.

```c#
public class RedisData
{
    public enum DataType
    {
        Array,
        BulkString,
    }

    public DataType Type { get; set; }
    public string? BulkString { get; set; } = null;
    public List<RedisData>? ArrayValues { get; set; } = null;

    public static RedisData Parse(byte[] data)
    {
        var (result, _) = Parse(data, 0);
        return result;
    }

    // return (parsed data, beginning of next element)
    static (RedisData, int) Parse(byte[] data, int offset)
    {
        // TODO
    }
```

Currently, only (nested) arrays and bulk strings will be supported by our parsing routine `Parse()`. Internally, it calls its counterpart which allows to specify the starting point for parsing which is necessary for sequential structures such as arrays.

<!-- implementation -- leave out arrays for now -->

Ignoring parsing arrays for now -- overall, we focus on a somewhat test-driven approach and our tests focus on bulk strings for now -- we can parse bulk strings as follows:

```c#
    static (RedisData, int) Parse(byte[] data, int offset)
    {
        RedisData result = new();
        int end = 0;
        
        if (data[offset] == '*')
        {
            throw new NotImplementedException();
        }
        else if (data[offset] == '$')
        {
            result.Type = DataType.BulkString;
            var lengthEnd = Array.IndexOf(data, (byte)'\r');
            var length = Int32.Parse(Encoding.ASCII.GetString(data, offset + 1, lengthEnd - 1));
            int stringStart = offset + lengthEnd + 2;
            result.BulkString = Encoding.ASCII.GetString(data, stringStart, length);
            nextOffset = stringStart + length + 2;
        }
        else
        {
            throw new ArgumentException($"Invalid byte {data[offset]} to parse");
        }

        return (result, end);
    }
```

Note that the code will be refactored once our basic test cases are working.

## Parsing arrays

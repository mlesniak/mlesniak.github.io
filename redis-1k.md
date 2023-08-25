---
title: Redis in 1024 lines of code 
data: 2023-08-20
---

This article describes my approach to write a Redis clone in C#, limiting myself to 1024 lines of code (as stated by the code analysis tool [cloc](https://github.com/AlDanial/cloc)). A similar approach for various topics has been discussed in books such as 
[500 Lines or Less](https://amzn.eu/d/b4iJBIa).

## The goal

The aim is to allow the official Redis CLI tool to interface with our server and execute as many standard-compliant operations as possible. As a twist in this experiment, I will be using a test-driven approach as much as possible and will write the code in parallel to the blog post -- expect refactoring and questioning of design decisions in later stages of the post...

Note that this is also a development journal, i.e. I might present ideas, concepts or snippets which are outright wrong and will be corrected in later phases (or further down) in this page.

## The beginning

While I could have commenced by diving into the protocol specification and building the server accordingly, I felt that might be somewhat mundane. Instead, I opted to initiate a basic TCP server, set it to listen on port 6379 (the standard port for Redis), and observe the commands the client transmits.

After setting up a project with `dotnet new console -o src`, let's spawn up a simple TCP server which simply output what it has received

```cs
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


```bash
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
```cs
[Fact]
public void ToRedisMessage_SimpleBulkString_ReturnsCorrectResult()
{
    var message = """
                  $5
                  HELLO
                  """.ToRedisMessage();
    
    var data = RedisData.Parse(message);

    Equal(RedisData.RedisDataType.BulkString, data.Type);
    Equal("HELLO", data.BulkString);
}
```
As you can see by the test, a bulk string consists of a `$` and a number stating the number of bytes to follow which will build up the string. Implicitly stated, but hidden in the string representation is the delimiter between elements, i.e. `\r\n`.

<!-- initial data structure -- will probably change -->
To represent the received input, and generate corresponding output later on, let's start with a basic data structure which will probably be changed a lot once we gain more insights.

```cs
public class RedisData
{
    public enum RedisDataType
    {
        Array,
        BulkString,
    }

    public RedisDataType Type { get; set; }
    public string? BulkString { get; set; } = null;
    public List<RedisData>? ArrayValues { get; set; } = null;

    public static RedisData Parse(byte[] data)
    {
        (RedisData result, _) = Parse(data, 0);
        return result;
    }

    // return (parsed data, beginning of next element)
    static (RedisData, int) Parse(byte[] data, int offset)
    {
        // TODO
    }
```

Currently, only (nested) arrays and bulk strings will be supported by our parsing routine `Parse()`. Internally, it calls its counterpart which allows to specify the starting point for parsing which is necessary for sequential structures such as arrays.

Ignoring parsing arrays for now -- overall, we focus on a somewhat test-driven approach and our tests focus on bulk strings for now -- we can parse bulk strings as follows:

```cs
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
        result.Type = RedisDataType.BulkString;
        var lengthEnd = Array.IndexOf(data, (byte)'\r', offset);
        var length = Int32.Parse(Encoding.ASCII.GetString(data, offset + 1, lengthEnd - offset - 1));
        int stringStart = lengthEnd + 2;
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

Note that the internal implementation will be refactored once our basic test cases are working.

## Parsing arrays

We can use a similar approach to parse arrays, though arrayc are recursive data structures in the redis protocol and can contain both plain values, e.g. bulk strings, as nested arrays. Hence, let's define two different test cases: The first one mirrors the data we receive from the client and will allow to parse sent commands, the second checks that the implementation handles nested arrays correctly:

```cs
[Fact]
public void ToRedisMessage_SimpleArray_ReturnsCorrectResult()
{
    var message = """
                    *2
                    $5
                    HELLO
                    $3
                    FOO
                    """.ToRedisMessage();
    
    var data = RedisData.Parse(message);
    
    Equal(RedisData.RedisDataType.Array, data.Type);
    
    Equal(RedisData.RedisDataType.BulkString, data.ArrayValues![0].Type);
    Equal("HELLO", data.ArrayValues![0].BulkString);
    
    Equal(RedisData.RedisDataType.BulkString, data.ArrayValues![1].Type);
    Equal("FOO", data.ArrayValues![1].BulkString);
}

[Fact]
public void ToRedisMessage_NestedArray_ReturnsCorrectResult()
{
    var message = """
                    *2
                    *2
                    $3
                    BAR
                    $5
                    HELLO
                    $3
                    FOO
                    """.ToRedisMessage();
    
    var data = RedisData.Parse(message);
    
    Equal(RedisData.RedisDataType.Array, data.Type);
    
    Equal(RedisData.RedisDataType.Array, data.ArrayValues![0].Type);
    var array = data.ArrayValues![0];
    Equal("BAR", array.ArrayValues?[0].BulkString);
    Equal("HELLO", array.ArrayValues?[1].BulkString);
    
    Equal(RedisData.RedisDataType.BulkString, data.ArrayValues![1].Type);
    Equal("FOO", data.ArrayValues?[1].BulkString);
}
```

This can be implemented via the following snippet inside `Parse()`

```cs
    if (data[offset] == '*')
    {
        result.Type = RedisDataType.Array;
        result.ArrayValues = new();
        var numElementsIndexEnd = Array.IndexOf(data, (byte)'\r', offset);
        var numElements = Int32.Parse(Encoding.ASCII.GetString(data, offset + 1, numElementsIndexEnd - offset - 1));
        offset = numElementsIndexEnd + 2;
        for (var i = 0; i < numElements; i++)
        {
            (RedisData elem, int nextArrayOffset) = Parse(data, offset);
            result.ArrayValues.Add(elem);
            offset = nextArrayOffset;
        }
        nextOffset = offset;
    }
```

Since we now have a basic test setup, let's refactor the code a bit by moving away from this `if-else` cascade and introduce a switch statement and move the type-defining character to the enum.

### A short excursion into over-engineering

We want to implement a more general approach the if-else-cascade, though one can rightfully argue that this is not the worst code to maintain. Nonetheless, a `switch` statement would be possible as well. For that, we have to add a custom attribute which stores the corresponding encoding character for each data type:
```cs
[AttributeUsage(AttributeTargets.Field)]
sealed class ByteRepresentationAttribute : Attribute
{
    public byte Byte { get; }

    public ByteRepresentationAttribute(char b)
    {
        Byte = (byte)b;
    }
}
```

This allows to annotate the data type definition via
```cs
public enum RedisDataType
{
    [ByteRepresentation('*')]
    Array,
    [ByteRepresentation('$')]
    BulkString,
}
```
and retrieve the corresponding field from the type via an extension function
```cs
public static class DataTypeIdentifier
{
    public static byte Identifier(this RedisDataType type)
    {
        var fieldInfo = type.GetType().GetField(type.ToString())!;
        var attribute =
            ((ByteRepresentationAttribute)fieldInfo.GetCustomAttribute(typeof(ByteRepresentationAttribute))!);
        return attribute.Byte;
    }
}
```
This looks -- on the first look -- like a nice solution and we can refactor the if-conditions into a switch statement
```cs
switch (data[offset])
{
    case var b when b == RedisDataType.BulkString.Identifier():
        // ...
        break;
    case var b when b == RedisDataType.Array.Identifier():
        // ...
        break;
    default:
        throw new ArgumentException($"Invalid byte {data[offset]} to parse");
}
```
where the problem becomes (in my humble view) obvious: while the switch looks syntactically simpler, the necessary `var b when b == ...` construct does not look very nice and quite a bit convoluted. Note that we can not remove the section before the `when`, since the `Identifier()` call is dynamic and the case expression needs static values.

A slightly better approach, which allows for more extensibility in the future, is to use a dictionary in combination with a proper delegate definition. One can argue that we do not follow [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it#:~:text=%22You%20aren't%20gonna%20need,add%20functionality%20until%20deemed%20necessary.), but bear with me for a minute.

### ...and back into sane and understandable code

First, let's formulate a delegate to allow definition of general parser functions:

```cs
private delegate (RedisData, int) Parser(byte[] data, int offset);
```

We use a dictionary from bytes to parsers to define parsers for each type of object that we want to parse and initialize it accordingly by moving the case (or inner if statements in the previous example) into the respective function definition:

```cs
private static Dictionary<byte, Parser> parsers = new();

static RedisData()
{
    parsers.Add((byte)'$', (data, offset) =>
    {
        RedisData result = new() { Type = RedisDataType.BulkString };
        var lengthEnd = Array.IndexOf(data, (byte)'\r', offset);
        var length = Int32.Parse(Encoding.ASCII.GetString(data, offset + 1, lengthEnd - offset - 1));
        int stringStart = lengthEnd + 2;
        result.BulkString = Encoding.ASCII.GetString(data, stringStart, length);
        return (result, stringStart + length + 2);
    });
    parsers.Add((byte)'*', (data, offset) =>
    {
        RedisData result = new() { Type = RedisDataType.Array, ArrayValues = new() };
        var numElementsIndexEnd = Array.IndexOf(data, (byte)'\r', offset);
        var numElements =
            Int32.Parse(Encoding.ASCII.GetString(data, offset + 1, numElementsIndexEnd - offset - 1));
        offset = numElementsIndexEnd + 2;
        for (var i = 0; i < numElements; i++)
        {
            (RedisData elem, int nextArrayOffset) = Parse(data, offset);
            result.ArrayValues.Add(elem);
            offset = nextArrayOffset;
        }
        return (result, offset);
    });
}
```

which allows us to greatly simplify our `Parse` functions to

```cs
public static RedisData Parse(byte[] data) => Parse(data, 0).Item1;

static (RedisData, int) Parse(byte[] data, int offset) => parsers[data[offset]].Invoke(data, offset);
```

We can now move the whole parsing logic out of the data model definition and into a new file:
```cs
// RedisDataParser.cs
public static class RedisDataParser
{
    private delegate (RedisData, int) Parser(byte[] data, int offset);

    private static readonly Dictionary<byte, Parser> Parsers = new();

    static RedisDataParser()
    {
        Parsers.Add((byte)'$', ParseBulkString);
        Parsers.Add((byte)'*', ParseArray);
    }
    
    public static RedisData Parse(byte[] data) => Parse(data, 0).Item1;

    private static (RedisData, int) ParseArray(byte[] data, int offset)
    {
        RedisData result = new() { Type = RedisDataType.Array, ArrayValues = new() };
        var numElementsIndexEnd = Array.IndexOf(data, (byte)'\r', offset);
        var numElements =
            Int32.Parse(Encoding.ASCII.GetString(data, offset + 1, numElementsIndexEnd - offset - 1));
        offset = numElementsIndexEnd + 2;
        for (var i = 0; i < numElements; i++)
        {
            (RedisData elem, int nextArrayOffset) = Parse(data, offset);
            result.ArrayValues.Add(elem);
            offset = nextArrayOffset;
        }

        return (result, offset);
    }

    private static (RedisData, int) ParseBulkString(byte[] data, int offset)
    {
        RedisData result = new() { Type = RedisDataType.BulkString };
        var lengthEnd = Array.IndexOf(data, (byte)'\r', offset);
        var length = Int32.Parse(Encoding.ASCII.GetString(data, offset + 1, lengthEnd - offset - 1));
        int stringStart = lengthEnd + 2;
        result.BulkString = Encoding.ASCII.GetString(data, stringStart, length);
        return (result, stringStart + length + 2);
    }

    private static (RedisData, int) Parse(byte[] data, int offset) => Parsers[data[offset]].Invoke(data, offset);
}
```

We define the mapping between characters identifying a data type and the corresponding logic in a single place. In addition, following [SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle), the class `RedisData` is only responsible to represent a data structure but is not concerned with any parsing between different representation of this data type:
```cs
public class RedisData
{
    public RedisDataType Type { get; set; }
    public string? BulkString { get; set; }
    public List<RedisData>? ArrayValues { get; set; }
    
    public override string ToString()
    {
        return "TODO";
    }
}
```

Thanks to our test-driven approach we are still sure that all functionality which has corresponding tests is still correctly implemented.

We can now understand the command structure which is sent to use from `redis-cli` which enables us to implement a basic command parser as a preparation for actually supporting redis database operations. Lines of code-wise we are still very good

```bash
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
C#                               8             36             22            145
```

and have 879 lines of code available for the rest of our implementation.

## Understanding received commands

To understand received commands we need to convert the received byte stream into a `RedisData` object using the aforementioned `Parse` method:

```cs
    // in RedisServer ...
    private static void ReadNextCommand(NetworkStream stream)
    {
        byte[] buffer = new byte[16384];
        stream.Read(buffer);
        var command = RedisDataParser.Parse(buffer);
        Console.WriteLine($"Command:\r\n{command}");
    }
```

For the time being, let's just display the received and parsed command. To enable printing, we need to implement a string serialization. To make our lifes easier and since the internal serialization format is quite readable, let's target the default Redis serialization format as our default output format and use it for internall debugging via `ToString` as well. This approach also allow eases responding to the client later on:

```cs
    // in RedisData...
    public override string ToString() => Encoding.ASCII.GetString(ToRedisSerialization());

    public byte[] ToRedisSerialization()
    {
        var sb = new StringBuilder();

        switch (Type)
        {
            case RedisDataType.Array:
                sb.Append($"*{ArrayValues!.Count}");
                sb.Append("\r\n");
                ArrayValues.ForEach(v =>
                {
                    byte[] array = v.ToRedisSerialization();
                    sb.Append(Encoding.ASCII.GetString(array));
                });
                break;
            case RedisDataType.BulkString:
                sb.Append($"${BulkString!.Length}");
                sb.Append("\r\n");
                sb.Append(BulkString);
                sb.Append("\r\n");
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }

        return Encoding.ASCII.GetBytes(sb.ToString());
    }
```

and add corresponding tests

```cs
    [Fact]
    public void ToRedisSerialization_BulkString_ReturnsValidInput()
    {
        var data = RedisData.of("HELLO");

        var serialized = data.ToRedisSerialization();

        Equal(
            ToByteArray("""
                        $5
                        HELLO
                        """),
            serialized);
    }

    [Fact]
    public void ToRedisMessage_SimpleArray_ReturnsCorrectResult()
    {
        var data = RedisData.of(
            RedisData.of("HELLO"),
            RedisData.of("FOO")
        );

        var serialized = data.ToRedisSerialization();

        Equal(
            ToByteArray("""
                        *2
                        $5
                        HELLO
                        $3
                        FOO
                        """),
            serialized);
    }

    [Fact]
    public void ToRedisMessage_NestedArray_ReturnsCorrectResult()
    {
        var data = RedisData.of(
            RedisData.of(
                RedisData.of("BAR"),
                RedisData.of("HELLO")
            ),
            RedisData.of("FOO")
        );

        var serialized = data.ToRedisSerialization();

        Equal(
            ToByteArray("""
                        *2
                        *2
                        $3
                        BAR
                        $5
                        HELLO
                        $3
                        FOO
                        """),
            serialized);
    }
```

Note that we used the opportunity to also introduce factory functions to create `RedisData` objects easily via

```cs
    // RedisData
    public static RedisData of(string s) => new() { Type = RedisDataType.BulkString, BulkString = s };

    public static RedisData of(params RedisData[] arrayElements) =>
        new() { Type = RedisDataType.Array, ArrayValues = arrayElements.ToList() };
```

When we now start our server and then redis-cli the following output will be printed
```
Server started, listening for clients.
Client connected
Command:
*2
$7
COMMAND
$4
DOCS

Command:
*3
$3
set
$3
key
$5
value
```

for the client input
```
$ docker run --rm -it redis redis-cli -h docker.for.mac.localhost
> set key value
```

<!-- setup simple handler mechanism to understand parsing -->
<!-- then: actual commands, start with get and set -->
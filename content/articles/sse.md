+++
title = "You could have invented it yourself: Server-Sent Events"
description = ""
date = "2024-12-21"
+++

## Why do we need Server-Sent Events?

In modern web applications, real-time communication is more
important than ever. Features like live updates, collaborative
editing, notifications, and data streaming have become standard
expectations for users. Before we look at Server-Sent Events,
let's first look at a few alternatives.

### Alternatives to SSE

#### Polling
Polling is the simplest approach to achieve near-real-time
updates. The client repeatedly sends HTTP requests to the server
at regular intervals to check for changes. While easy to
implement, this method is inefficient. It generates unnecessary
network traffic and puts extra load on the server, especially
when updates are infrequent. The client may poll repeatedly even
when no updates are available, resulting in wasted resources.

#### Long Polling
Long polling improves upon basic polling by keeping the HTTP
connection open until the server has an update to send. Once
the server responds with data, the connection closes, and the
client immediately reopens it to wait for the next update. While
this reduces some of the inefficiencies of traditional polling,
it still has drawbacks. Opening and closing connections repeatedly
can strain resources, and implementing long polling often
introduces additional complexity.

#### WebSockets
WebSockets offer full-duplex communication, enabling the server
and client to send messages to each other in real time. While
this is powerful, WebSockets can be overkill for many use cases
that only require one-way communication from the server to the
client. They also add complexity in terms of setup, management,
and maintaining stateful connections, which can be challenging
in distributed or load-balanced environments.

### Why SSE?

SSE provide a
lightweight, efficient, and straightforward way for servers to
push updates to clients. They rely on a simple HTTP connection,
making them easy to implement and compatible with most
environments. Unlike WebSockets, SSE is inherently one-directional
(server to client), which is ideal for scenarios like live score
updates, stock price monitoring, or streaming logs.

With SSE, developers get a solution that's simple to use,
resource-friendly, and aligned with the natural statelessness of
HTTP. In many cases, it's the elegant middle ground between the
brute force of polling and the power of WebSockets.

## Backend with Spring Boot

The backend streams Server-Sent Events (SSE) using Spring Boot's
`SseEmitter` class. In general, this should be quite straightforward.
We expose an endpoint via `/events` with an optional count to restrict the number
of sent events. Once a client (which supports SSE) connects, we emit JSON-serialized
tick events with a unique id and event name.

In a classic REST-based API, one can add this as an extension to the query endpoints.
Besides `GET /users` and `GET /users/{id}` you would also have `GET /users/events` and
`GET /users/{id}/events`.

### Implementation

```java
record Tick(int tick) { }

@RestController
public class EventController {
    private static final Logger log = LoggerFactory.getLogger(EventController.class);
    private final ObjectMapper objectMapper;

    public EventController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @GetMapping("/events")
    public SseEmitter events(@RequestParam(name = "count", required = false) Integer count) {
        var max = count == null ? 10 : count;
        log.info("/events called with count {} and max {}", count, max);

        var emitter = new SseEmitter(60 * 1000L);
        var id = UUID.randomUUID().toString();
        Executors.newSingleThreadScheduledExecutor().execute(() -> {
            try {
                for (int i = 0; i < max; i++) {
                    var tick = new Tick(i);
                    emitter.send(SseEmitter.event()
                            .name("tick")
                            .id(id)
                            .data(objectMapper.writeValueAsString(tick)));
                    TimeUnit.MILLISECONDS.sleep(500);
                }
                // Without a payload, the event is not correctly processed
                // in the browser. This is actually expected behaviour,
                // see https://github.com/denoland/deno/issues/23135.
                emitter.send(SseEmitter.event().name("close").data(""));
                log.info("Closing connection");
                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}
```

The only annoying trap was figuring out why the `close` event
was never processed by the frontend (see below). If you omit
any data, the browser is free to ignore the event...


### Testing the endpoint with curl
When using curl, this looks like
```shell
$ curl http://localhost:9000/events?count=4
event:tick
id:ba711ed1-bb55-4696-9312-ca4c10725e5a
data:{"tick":0}

event:tick
id:ba711ed1-bb55-4696-9312-ca4c10725e5a
data:{"tick":1}

event:tick
id:ba711ed1-bb55-4696-9312-ca4c10725e5a
data:{"tick":2}

event:tick
id:ba711ed1-bb55-4696-9312-ca4c10725e5a
data:{"tick":3}

event:close
data:
```

## A simple user interface
By any means, I am not a frontend software engineer. Nonetheless, here's a basic, framework-less UI which
shows how to use SSE in a client.
<img src="https://mlesniak.com/articles/sse.png" />
The key implementation is this JavaScript snippet
```javascript
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const count = document.getElementById('count').value;
    document.getElementById('count').value = '';
    const eventDisplay = document.getElementById('events');
    eventDisplay.innerHTML = '';

    if (window.eventSource) window.eventSource.close();
    window.eventSource = new EventSource(`/events?count=${count}`);

    eventSource.addEventListener('tick', event => {
        const p = document.createElement('p');
        p.textContent = `Tick: ${JSON.parse(event.data).tick + 1}`;
        eventDisplay.appendChild(p);
    });

    eventSource.addEventListener('close', () => eventSource.close());
});
```

Once we've subscribed to the `submit` event of the form, we use the
Browser's [EventSource API](https://developer.mozilla.org/de/docs/Web/API/EventSource) to listen
to events sent by the server and react accordingly.

If we do not react to a `close` event by closing our listener, and the server closes its connection on their side,
the browser will simply reopen the connection after a few seconds and listen to new events again.

## The specification

Server-Sent Events (SSE) are defined as [part of the HTML5 specification](https://html.spec.whatwg.org/multipage/server-sent-events.html). 
They provide a standardized way for servers to
push updates to web clients over a persistent HTTP connection
using a lightweight, text-based protocol.

### Key Characteristics

1. **Protocol**:
    - SSE uses a standard HTTP connection (typically GET requests).
    - The `Content-Type` for SSE responses must be `text/event-stream`.
    - HTTP headers like `Cache-Control: no-cache` are commonly used
      to prevent caching of the event stream by intermediaries.
    - Connections are usually kept open indefinitely, relying on
      persistent HTTP/1.1 or HTTP/2 features.

2. **Event Format**:
    - Events are sent as plain text in the following structure:
      ```
      id: <unique-id>
      event: <event-name>
      data: <payload>
      ```
    - Each event ends with a blank line to indicate completion.
    - Binary data is not directly supported, i.e., must be encoded with Base64.

3. **Auto-Reconnection**:
    - If the connection is lost, the browser automatically attempts
      to reconnect after a short delay.
    - The `id` field allows clients to resume from the last event
      by sending a `Last-Event-ID` header in subsequent requests.

5. **Character Encoding**:
    - SSE requires UTF-8 encoding for all transmitted data.

### An exchange with curl
Coming back to our example with curl, we can verify the actual
HTTP headers sent in the response.

```shell
$ curl -v http://localhost:9000/events?count=4
* Host localhost:9000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:9000...
* Connected to localhost (::1) port 9000
> GET /events?count=4 HTTP/1.1
> Host: localhost:9000
> User-Agent: curl/8.9.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200
< Content-Type: text/event-stream
< Transfer-Encoding: chunked
< Date: Sat, 21 Dec 2024 17:32:27 GMT
<
event:tick
id:5d482700-187c-4928-8de5-cca0681f0aac
data:{"tick":0}
```

## A backend using just the JDK

Looks like Server-Sent Events are not magic at all. While Spring allows us to use
them via a comfortable API through the `SseEmitter` class, we can easily write our
own backend implementation -- the frontend part is left as an exercise for the reader.

For convinience, we also left out handling of the optional `count` parameter since 
it's not relevant for the protocol and the thread handling. It's easy to add but 
would hide the relevant part, the implementation of SSE itself.

```java
// ...boring package declaration and imports...

record TickEvent(int tick) {
   String toJson() {
      return "{\"tick\":" + tick + "}";
   }
}

record SseEvent(String id, String event, String data) {
   String toSseFormat() {
      // Not beautiful, but good enough.
      return "id: " + id + "\n" +
              "event: " + event + "\n" +
              "data: " + data + "\n\n";
   }
}

public class SseServer {
   public static void main(String[] args) throws Exception {
      // Create a basic HTTP server which is part of the JDK.
      HttpServer server = HttpServer.create(new InetSocketAddress(9000), 0);
      server.createContext("/events", new SseHandler());
      server.setExecutor(Executors.newCachedThreadPool());
      server.start();
   }

   static class SseHandler implements HttpHandler {
      private final ObjectMapper objectMapper = new ObjectMapper();

      @Override
      public void handle(HttpExchange exchange) {
         try {
            // Set default headers for SSE.
            exchange.getResponseHeaders().set("Content-Type", "text/event-stream");
            exchange.getResponseHeaders().set("Cache-Control", "no-cache");
            exchange.getResponseHeaders().set("Connection", "keep-alive");
            exchange.sendResponseHeaders(200, 0);

            try (OutputStream os = exchange.getResponseBody()) {
               var id = UUID.randomUUID().toString();
               for (int i = 0; i < 10; i++) {
                  TickEvent tickEvent = new TickEvent(i);
                  SseEvent sseEvent = new SseEvent(
                          id,
                          "tick",
                          tickEvent.toJson()
                  );

                  os.write(sseEvent.toSseFormat().getBytes());
                  os.flush();
                  Thread.sleep(500);
               }

               SseEvent closeEvent = new SseEvent("", "close", "");
               os.write(closeEvent.toSseFormat().getBytes());
               os.flush();
            }
         } catch (Exception e) {
            // 🙈 ... good enough for us.
            e.printStackTrace();
         }
      }
   }
}
```

## Source code

The whole source code can be found on [GitHub](https://github.com/mlesniak/server-side-events).

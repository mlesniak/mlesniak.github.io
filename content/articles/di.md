+++
title = "You could have invented it yourself: Dependency Injection"
description = ""
date = "2025-01-03"
+++

## Why do we need Dependency Injection?

Dependency Injection (DI) addresses a simple but critical problem: keeping your
code manageable. Without it, you’re stuck with tightly coupled components, like
a Car class that directly creates its own Engine.

Initially, this seems fine. But what happens when you need different engines,
gas, electric, or something new? Suddenly, your Car class has to handle creation
logic, breaking its focus and making changes a nightmare.

DI changes the approach. Instead of creating its own dependencies, the Car 
gets its
Engine from the outside. This keeps your code focused, flexible, and easy to
test. Swap an engine? Update a configuration? No problem.

You don’t need a fancy framework to do DI. But frameworks like Spring automate
the wiring, saving time. The payoff? Cleaner code, fewer headaches, and a
codebase that doesn’t fight you every time something changes.

From the outside, it might seem like magic. Here's how you can implement it yourself.

## The canonical Spring example

The simplest example consists of a (Spring) component `MessageConsumer` which
depends on another (Spring) component `MessageProvider`, which in turn does not
have any further dependencies. When starting the application, the `run`
method from the consumer is called since it implements `CommandLineRunner`:

```java
// Main.java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String... args) {
        SpringApplication.run(Main.class, args);
    }
}


// MessageConsumer.java
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MessageConsumer implements CommandLineRunner {
    private final MessageProvider messageProvider;

    public MessageConsumer(MessageProvider messageProvider) {
        this.messageProvider = messageProvider;
    }

    @Override
    public void run(String... args) {
        String message = messageProvider.getMessage();
        System.out.println(message);
    }
}


// MessageProvider.java
import org.springframework.stereotype.Component;

@Component
public class MessageProvider {
    public String getMessage() {
        return "Hello, world";
    }
}
```

In the following sections, we will implement our own dependency injection
framework. Our goal is to allow seamless switching of import statements to our implementation without any other changes.
The example should still function as expected.

## Our own implementation

Spring's DI framework offers extensive functionality, much of which is beyond the scope of this educational example.
Let’s begin by clarifying what we won’t implement, though much of it is 
straightforward:

- Lifecycle Management. No support for `@PostConstruct`, `@PreDestroy`, ...
- Scope Management. We only support singletons. Adding additional types such 
  as Request, Prototype, Session would be possible by adding a dedicated 
  `ApplicationContext` and appropriate methods. Since we do not support 
  `@Controller` in our small example, these do not make sense anyway.
- No Aspect-oriented programming (AOP). This might be a bit more tricky and 
  will probably be covered in a future post.
- No field or method injection. Technically, trivial to implement, but would 
  just blow up the code without providing additional insights.

... and, as always, we implement minimal error and edge case handling -- 
definitely not production-ready. ;-)

Having said all that, let's start with modifications to our `Main` class. 
Since the name `SpringApplication` is already reserved, and summer follows on
spring, let's call it ... `SummerApplication`:
```java
import com.mlesniak.boot.SummerApplication;

public class Main {
    public static void main(String... args) {
        SummerApplication.run(Main.class, args);
    }
}
```

The remaining files stay the same, though, as promised, we change the imports:
```java
// MessageProvider.java
import com.mlesniak.boot.Component;

@Component
public class MessageProvider {
    public String getMessage() {
        return "Hello, world";
    }
}

// MessageConsumer.java
import com.mlesniak.boot.CommandLineRunner;
import com.mlesniak.boot.Component;

@Component
public class MessageConsumer implements CommandLineRunner {
  private final MessageProvider messageProvider;

  public MessageConsumer(MessageProvider messageProvider) {
    this.messageProvider = messageProvider;
  }

  @Override
  public void run(String... args) {
    String message = messageProvider.getMessage();
    System.out.println(message);
  }
}
```

### Marking things...

Since we do not use Controllers but still want an entrypoint, let's define our
own marker interface:
```java
package com.mlesniak.boot;

/// Marker interface to determine where our application
/// starts since we do not have typical controllers
/// waiting for HTTP requests.
public interface CommandLineRunner {
    void run(String... args);
}
```

We also want to annotate service classes with our own Component annotation
```java
package com.mlesniak.boot;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

///
/// Marker interface to determine components of our application.
///
/// For every class marked as a component, we try to resolve all
/// dependencies in its constructor.
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Component {
}
```

### The interesting part

The actual magic is implemented in the following 140 lines of code. We walk 
through them step by step.

```java
package com.mlesniak.boot;

import com.mlesniak.Main;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

/// Core dependency injection resolution.
public class SummerApplication {
  // ... to be filled out in this section ...
}
```

Our sole public method is `run`, which serves to purposes:

1. Create all necessary singletons
2. Figure out the component implementing `CommandLineRunner` and start them.

Therefore, the code is straightforward:
```java
  /// Entry point into dependency injection.
  ///
  /// @param mainClass The main class of the application, ideally placed at the root package.
  /// @param args      Command line args.
  public static void run(Class<Main> mainClass, String[] args) {
      List<Class<?>> components = getComponents(mainClass);

      // For our example, we support only singletons.
      Map<Class<?>, Object> instances = new HashMap<>();
      components.forEach(component -> createSingleton(instances, new HashSet<>(), component));

      // Find entry point by looking for the class implementing CommandLineRunner. 
      var entryClasses = instances
              .keySet().stream()
              .filter(SummerApplication::hasCommandLineRunnerInterface)
              .toList();
      if (entryClasses.isEmpty()) {
          throw new IllegalStateException("No entry point defined via CommandLineRunner");
      }
      if (entryClasses.size() > 1) {
          throw new IllegalStateException("Ambiguous entry points defined via CommandLineRunner");
      }
      var entryClass = entryClasses.getFirst();

      ((CommandLineRunner) instances.get(entryClass)).run(args);
  }

  private static boolean hasCommandLineRunnerInterface(Class<?> clazz) {
    return Arrays.stream(clazz.getInterfaces())
            .anyMatch(i -> i == CommandLineRunner.class);
  }
```

A key function is `getComponents`. We need to collect all classes annotated 
with our custom component annotation on the classpath: 
```java
  /// Get a list of all components based on the passed package of the class.
  ///
  /// @param mainClass the root class to start scanning.
  private static List<Class<?>> getComponents(Class<Main> mainClass) {
      try {
          return findAllClassesInPackage(mainClass.getPackageName()).stream()
                  .filter(c -> c.getAnnotation(Component.class) != null)
                  .collect(Collectors.toList());
      } catch (IOException | URISyntaxException e) {
          throw new IllegalStateException("Error retrieving components, starting at " + mainClass.getSimpleName(), e);
      }
  }
```

This is slightly complicated since we can either run our application with an unpacked 
classpath, e.g. on the command line or via an IDE, or as a packed (fat) .
jar-file. 

Thanks to the abstraction provided by `java.nio`, this can be handled quite 
elegantly:
```java
  /// Retrieve a list of all classes in a package (or its children). This method supports both unpacked
  /// (target/classes) and packed (.jar) class containers.
  private static Set<Class<?>> findAllClassesInPackage(String packageName) throws IOException, URISyntaxException {
      String path = packageName.replace('.', '/');
      URI uri = SummerApplication.class.getResource("/" + path).toURI();

      if (uri.getScheme().equals("jar")) {
          // We have to create a "virtual" filesystem to access the class files stored in the
          // .jar file.
          try (FileSystem fileSystem = FileSystems.newFileSystem(uri, Collections.emptyMap())) {
              return findClassesInPath(fileSystem.getPath(path), packageName);
          }
      }

      // We're running the injection code from an unpacked archive and can directly access the .class files.
      return findClassesInPath(Paths.get(uri), packageName);
  }
```
Therefore, when looking for classes in `findClassesInPath`, we do not care 
if we walk through the archived files of the .jar or are actually looking on 
real files on our filesystem. Retrieving the actual class definitions 
consists now of just 
```java
  /// Iterate through all .class files in the given path for the given package.
  private static Set<Class<?>> findClassesInPath(Path path, String packageName) throws IOException {
      try (var walk = Files.walk(path, 1)) {
          return walk
                  .filter(p -> !Files.isDirectory(p))
                  .filter(p -> p.toString().endsWith(".class"))
                  .map(p -> getClass(p, packageName))
                  .filter(Objects::nonNull)
                  .collect(Collectors.toSet());
      }
  }

  /// Retrieve a class based on the path and package name.
  private static Class<?> getClass(Path classPath, String packageName) {
      try {
          String className = packageName + "." + classPath.getFileName().toString().replace(".class", "");
          return Class.forName(className);
      } catch (ClassNotFoundException e) {
          return null;
      }
  }
```
I know that we do not recursively descend into subdirectories -- good enough 
for the example ;-).

Once we have a list of class definitions, we can finally instantiate them 
and call component constructors with the instantiated classes. The dependency 
resolution and object instantiation happens in 
`createSingleton`. To simplify our implementation, we have a very basic 
dependency resolution. This function is called recursively for all constructor 
arguments to find singleton instances. If they are not yet available, we try 
to construct them while resolving their dependencies as well. To keep track 
of cycles, we keep track of already visited classes.

This could of course be done more clever for the price of blowing up the 
number of lines of  code, hence, good enough for this demonstration. 
```java
  /// Creates a new instance for the passed class using its constructor.
  ///
  /// We resolve all dependent constructor parameters.
  private static void createSingleton(Map<Class<?>, Object> singletons, Set<Class<?>> visited, Class<?> clazz) {
      // Cycle detection. We've been called to resolve a parameter dependency, but already tried to resolve the
      // dependencies for this class. When trying to resolve clazz' dependencies, we will run into an infinite cycle.
      if (!visited.add(clazz)) {
          var names = visited.stream().map(Class::getSimpleName).collect(Collectors.joining(", "));
          throw new IllegalStateException("Cycle detected. Visited classes=" + names);
      }
      var cs = clazz.getDeclaredConstructors();
      if (cs.length > 1) {
          throw new IllegalArgumentException("No unique constructor found for " + clazz.getSimpleName());
      }

      var constructor = cs[0];
      var expectedInjections = constructor.getParameterTypes();

      // For every dependent dependency, generate a new instance. Note that we implicitly handle the case for
      // parameter-less constructors here as well.
      Arrays.stream(expectedInjections).forEach(depClass -> {
          createSingleton(singletons, visited, depClass);
      });

      var params = Arrays.stream(expectedInjections).map(singletons::get).toArray();
      try {
          singletons.put(clazz, constructor.newInstance(params));
      } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {
          throw new IllegalStateException("Unable to create instance for " + clazz.getSimpleName(), e);
      }
  }
```

## Conclusion

... and well, that's actually all you need to implement. As stated above, 
it's far from complete or error-prone. The important thing, though, is: 
dependency injection is not some magical thing that happens behind the 
curtains of famous and advanced frameworks. Instead, it's something that **you 
could have invented yourself**.

## Source code

The whole source code can be found
on [GitHub](https://github.com/mlesniak/dependency-injection).

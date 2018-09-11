---
title: "Go Guitar // Record Sound"
date: 2018-09-11
draft: false
tags:
    - go
    - guitar
    - music
    - sound
---

As part of my ongoing project to write a Go program to recognize different guitar chords and get a better understanding of sound processing, a first milestone has been reached: recording a raw sound sample in Go. In this article I'll walk through the source code to record sounds using a wrapper for [PortAudio](http://www.portaudio.com/) and visualize the recorded sample in gnuplot. The whole source code for this blog post can be found in the corresponding [GitHub repository](https://github.com/mlesniak/go-guitar/tree/record-sound).

We start with some boilterplate initialization, in particular we import the Go port of the PortAudio library.

~~~golang
package main

import (
    "bytes"
    "fmt"
    "github.com/gordonklaus/portaudio"
    "os"
    "os/signal"
)
~~~

In a Go example (which source I unfortunately can't remember) I saw this pattern to handle  CTRL+C in a running program using channels: We create a signal handler which is notified if SIGHUP or SIGKILL is received and stores a value in the newly created channel:
~~~golang
func main() {
    sig := make(chan os.Signal, 1)
    signal.Notify(sig, os.Interrupt, os.Kill)
    fmt.Println("Starting recording, press CTRL+C to abort.")
~~~

Before we actually start processing sampling data, we have to initialize the library, prepare the data buffer and create the output file:
~~~golang
    // Initialize library.
    portaudio.Initialize()
    defer portaudio.Terminate()

    // Create buffer for sampling data and open the stream.
    in := make([]int32, 1024)
    stream, err := portaudio.OpenDefaultStream(1, 0, 8192, len(in), in)
    check(err)
    defer stream.Close()

    // Create file to store data.
    f, _ := os.Create("out.csv")
    defer f.Close()
~~~
For my readers not familiar with Go: Note the idiomatic use of `defer` which is a kind of `finally`-construct in languages like Java.

After these initializations we can finally process audio data. Given our buffer size of 1024 and a [sampling rate](https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate) of 8192 samples per second, our buffer will be filled 8192 / 1024 = 8 times per second:

~~~golang
    // Read sampleRate/len(in) samples per second.
    sampleN := 0
    check(stream.Start())
    for {
        check(stream.Read())

        // Create the CSV values for this sample and store them in file.
        buffer := new(bytes.Buffer)
        for i, v := range in {
            pos := sampleN*len(in) + i
            buffer.WriteString(fmt.Sprintf("%d,%d\n", pos, v))
        }
        f.WriteString(buffer.String())
        fmt.Println("#samples", sampleN)

        // Check if we should exit?
        select {
        case <-sig:
            return
        default:
        }

        sampleN += 1
    }
    check(stream.Stop())
~~~

The function `check` is a simple helper function to panic on any error, i.e. 
~~~golang
func check(err error) {
    if err != nil {
        panic(err)
    }
}
~~~

If we build and execute our code with
~~~shell
$ go get
$ go run main.go
Starting recording, press CTRL+C to abort.
#samples 0
#samples 1
#samples 2
#samples 3
#samples 4
#samples 5
#samples 6
#samples 7
#samples 8
#samples 9
#samples 10
#samples 11
#samples 12
#samples 13
#samples 14
#samples 15
#samples 16
#samples 17
#samples 18
#samples 19
#samples 20
#samples 21
#samples 22
#samples 23
^C
~~~
a CSV file `out.csv` will be generated. Each line contains a single sample of a 8192 chunk of recorded audio data, e.g. 
~~~shell
$  head -n 1000 out.csv|tail -n 10
990,-12791
991,-29494
992,-105842
993,-104340
994,28916
995,-119700
996,-62232
997,-75329
998,-25189
999,-176888
~~~

We can visualize the recording of me saying *Hello, Hello* with gnuplot by executing
~~~
$ gnuplot
set datafile separator ","
set grid
set yrange [-1e+9:1e+9]
plot 'out.csv'
~~~

![hello audio sampling](/images/hello-sample.png)

**Next steps:** To gain a deeper understanding of sound I'd like to understand the physical nature of sound waves better. Afterwards I'll tackle real-time visualization of recorded sound data in Go before I finally try the recognition of guitar chords. 

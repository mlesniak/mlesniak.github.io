---
title: "Go Guitar // Visualize Sound"
date: 2018-09-13
draft: false
tags:
    - go
    - guitar
    - music
    - sound
    - sdl
    - graphics
---

<!-- 
intro
code
gif -->

After understanding how to [record sound in Go](https://mlesniak.com/post/2018/09/11/go-guitar-/-record-sound/) I wanted to visualize the recorded data in realtime instead of having solely a static image. The graphics library [SDL](https://www.libsdl.org/) is available on all major platforms, well documented, and in particular has (at least) one [go binding](https://github.com/veandco/go-sdl2) with [good examples](https://github.com/veandco/go-sdl2-examples). The full code for this example can be found [here](https://github.com/mlesniak/go-guitar/blob/visualize-sound/main.go). In this article I'll focus on setting up and using SDL in Go and describe a pitfall I ran into.

Firstly, we are going to define constants for window width and height, but more important, constants for fitting all 1024 values of our sound sample into the window width as well as fitting the `int32` values into our window height:

~~~golang
// Global constants for visualization
const width = 800
const height = 800

// Factors to shrink the measured data with large integers into the window.
const widthFactor = width / float32(bufferSize)
const maxAmplitude = 500000000
const heightFactor = height / float32(maxAmplitude)
~~~

Afterwards, we create an SDL context solely for rendering, the window to display data and the renderer (surface) which is used to control the drawing operations:

~~~golang
    // ...

    // Initialize graphics part.
    check(sdl.Init(sdl.INIT_VIDEO))
    defer sdl.Quit()
    window, err := sdl.CreateWindow("Go guitar", 
        sdl.WINDOWPOS_UNDEFINED, sdl.WINDOWPOS_UNDEFINED,
        width, height, sdl.WINDOW_SHOWN)
    check(err)
    defer window.Destroy()
    renderer, err := sdl.CreateRenderer(window, -1, sdl.RENDERER_ACCELERATED)
    defer renderer.Destroy()
    
    // ...
~~~

We will use our continously running loop in which audio data is recorded to update the rendered data:

~~~golang
    // ...
    for {
        check(stream.Read())
        drawVoice(renderer, in)

        if checkForExit(sig) {
            return
        }
    }
    // ...
~~~

Of particular interest are the functions `drawVoice` and `checkForExit`.  The former is used to actually render the recorded values using 

~~~golang
func drawVoice(renderer *sdl.Renderer, in []int32) {
    // Clear screen.
    renderer.SetDrawColor(0, 0, 0, 255)
    renderer.Clear()
    
    // Draw a single point for each sample in the input.
    renderer.SetDrawColor(255, 0, 0, 255)
    for i := range in {
        x := int(float32(i) * widthFactor)
        y := int32(float32(in[x])*heightFactor + height/2)
        renderer.DrawPoint(int32(x), y)
    }
    
    // Refresh display output.
    renderer.Present()
}
~~~

While we are somehow wasteful since we draw multiple samples into one pixel due to rounding in the assingment of `x := ...`, this approach is rather fast and sufficient for a first step.

The function `checkexit` polls for events from SDL as well as listening for CTRL+C from the commandline. Note that if you simple omit the check for events in SDL, your window title and the corresponding controls are not shown -- this took me a long time to debug, since it's rather unintuitive.

Combining all functions leads to a visualization shown below, recording some singing and non-sense spoken into the microphone:

![voice-recording](/images/voice-recording.gif)

**Next steps:** Before I reach to the stars, i. e. think about guitar chords and what they mean physically I still want to understand the physical nature of sound better; while this is probably not necessary to recognize guitar chords, it's just fascinating.
# Cosmos Sketch
```
Background: linear gradient between all colors in COLORS
Big circles: gray or white, random alfa, fill
Circles small: random color, random alfa, stroke
Stars: random color, random alfa, fill, circle; random color, random alfa, stroke, line
Tube: {
    Circle: random color, random alfa, fill
    loop i {
        Circle: random color, random alfa, stroke, with position and radius with lerp of i
    }
}
Side Rectangle: random color, random alfa, fill ( // description
    // x or y
    if (randomTF()) {
        // x
        if (randomTF()) {
            // left
        } else {
            // right
        }
    } else {
        // y
        if (randomTF()) {
            // top
        } else {
            // bottom
        }
    }
    change the position of the rectangle to be somewhere on the line for that position
)
```


await 5ms before next element is added
streamCapture() it and make a mp4
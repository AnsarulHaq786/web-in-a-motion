const tl = gsap.timeline();

tl.to("#poll", {
    x: 900,
    y: 300,
    delay: 0.5,
    duration: 1
})

tl.to("#net", {
    x: 744,
    y: 316,
    duration: 1
})

tl.to("#ball", {
    x: 700,
    y: 600,
    delay: 0.5,
    duration: 1.5,
    rotate: 1600
})

tl.to("#ball", {
    x: 200,
    y: 500,
    duration: 1.5,
    rotate: 200
})

tl.to("#ball", {
    x: 600,
    y: 500,
    duration: 1.5,
    rotate: 100
})

tl.to("#ball", {
    x: 650,
    y: 340,
    duration: 1.5,
    rotate:200
})

tl.from("#goal", {
    opacity: 0,
    duration: 0.8,
    scale: 1.5
})
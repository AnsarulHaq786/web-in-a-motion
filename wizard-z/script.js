function page1Animation (){
    var tl=gsap.timeline();

    tl.from("nav h1, .nav-items h4, nav button", {
        y: -40,
        opacity: 0,
        delay: 0.3,
        duration: 0.3,
        stagger: 0.15,
    })

    tl.from(".content-1 h1", {
        x: -50,
        opacity: 0,
        delay: 0,
        duration: 0.2,
    })

    tl.from(".content-1 p", {
        x: -30,
        opacity: 0,
        delay: 0,
        duration: 0.2,
    })

    tl.from(".content-1 button", {
        opacity: 0,
        duration: 0.3,
        duration: 0.3
    })

    tl.from(".content-2 img", {
        x: 50,
        opacity: 0,
        delay: 0,
        duration: 0.3
    }, "-=0.5")

    tl.from(".section1bottom img", {
        y: 50,
        opacity: 0,
        delay: 0,
        duration: 0.3,
        stagger: 0.1
    })
}

page1Animation();

var tl2=gsap.timeline({
    scrollTrigger: {
        trigger: ".section2",
        scroller: "body",
        start: "top 70%",
        end: "top -20%",
        scrub: 1
    }
})

tl2.from(".services", {
    opacity: 0.2,
    x: 150
})

tl2.from(".box.box1", {
    x: -50,
    opacity: 0,
}, "animB1")

tl2.from(".box.box2", {
    x: 50,
    opacity: 0,
}, "animB1")

tl2.from(".box.box3", {
    x: -50,
    opacity: 0,
}, "animB2")

tl2.from(".box.box4", {
    x: 50,
    opacity: 0,
}, "animB2")

gsap.from("footer", {
    y: 100,
    opacity: 0,
    duration: 0.5,
    delay: 0.3,
    scrollTrigger: {
        trigger: "footer",
        start: "top 105%",
        toggleActions: "play none none reverse"
    }
});
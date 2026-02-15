// gsap.from("#page2 #box", {
//     scale: 0,
//     opacity: 0,
//     rotate: 720,
//     duration: 1,
//     scrollTrigger: {
//         trigger: "#page2 #box",
//         scroller: "body",
//         start: "top 60%",
//         end: "top 30%",
//         markers: "true",
//         scrub: 2,
//         pin: "true"
//     }
// })

gsap.to("#page2 h1", {
    transform: "translate(-190%)",
    scrollTrigger: {
        trigger: "#page2",
        scroller: "body",
        markers: "true",
        start: "top 0%",
        end: "top -100%",
        scrub: 1,
        pin: true,

    }
})
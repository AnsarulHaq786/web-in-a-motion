var path = `M 40 200 Q 735 200 1410 200`

var finalPath = `M 40 200 Q 735 200 1410 200`

var string = document.querySelector("#string")

string.addEventListener("mousemove", function(dets) {
    path =  `M 40 200 Q ${dets.x} ${dets.y} 1410 200`
    gsap.to("svg path", {
       attr: {d: path},
       duration: 0.2,
       ease: "power3.out"
    })
})

string.addEventListener("mouseleave", function(dets) {
    gsap.to("svg path", {
        attr: {d: finalPath},
        duration: 0.8,
        ease: "elastic.out(1,0.1)"
    }) 
})
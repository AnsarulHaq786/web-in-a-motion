var menu = document.querySelector("#nav i");
var cross = document.querySelector("#open i");
var tl = gsap.timeline();

tl.to("#open", {
    right: "0",
    duration: 0.3
})

tl.from("#open h4", {
    x: 150,
    duration: 0.3,
    stagger: 0.2,
    opacity: 0
})

tl.pause();

menu.addEventListener("click", function() {
        tl.play();
    }
);

cross.addEventListener("click", function() {
        tl.reverse();
    }
);
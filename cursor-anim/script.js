var main = document.querySelector("#main");
var cursor = document.querySelector("#cursor");
var imageDiv = document.querySelector("#image");
var overlay = document.querySelector("#overlay");

gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50
});

main.addEventListener("mousemove", function(dets){
    gsap.to(cursor, {
        x: dets.x,
        y: dets.y,
        duration: 0.3
    });
})

imageDiv.addEventListener("mouseenter", function(){
    gsap.to(cursor, {
        scale: 3,
        backgroundColor: "rgba(0, 255, 255, 0.5)",
        duration: 0.5
    })
    gsap.to(overlay, {
        backgroundColor: "#00000041",
        duration: 0.5
    })
})

imageDiv.addEventListener("mouseleave", function(){
    gsap.to(cursor, {
        scale: 1,
        duration: 0.5,
        backgroundColor: "rgba(0, 255, 255)"
    })
    gsap.to(overlay, {
        backgroundColor: "transparent",
    })
})
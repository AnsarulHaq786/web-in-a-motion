var h1 = document.querySelector("h1");
var h1Text = h1.textContent;

var splittedText = h1Text.split("");
var halfTextLength = Math.floor(splittedText.length/2);

var clutter = ""

splittedText.forEach(function(ele, idx) {
    if(idx<halfTextLength) clutter+=`<span class="a">${ele}</span>`;
    else clutter+=`<span class="b">${ele}</span>`;
})

h1.innerHTML=clutter;

gsap.from("h1 .a", {
    y: 70,
    opacity: 0,
    duration: 0.3,
    delay: 0.2,
    stagger: 0.075
})

gsap.from("h1 .b", {
    y: 70,
    opacity: 0,
    duration: 0.3,
    delay: 0.2,
    stagger: -0.075
})
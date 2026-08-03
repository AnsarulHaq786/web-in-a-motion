var string_6 = "M975.876, 1210.58 Q1800 1200 2786 1200";
var string_5 = "M976.049, 1235.414 Q1800 1224 2786 1214";
var string_4 = "M976.221, 1260.009 Q1800 1248 2786 1228";
var string_3 = "M976.395, 1284.953 Q1800 1262 2786 1242";
var string_2 = "M976.567, 1309.599 Q1800 1286 2786 1256";
var string_1 = "M976.742, 1334.551 Q1800 1306 2786 1270";

var final_string_6 = "M975.876, 1210.58 Q1800 1200 2786 1200";
var final_string_5 = "M976.049, 1235.414 Q1800 1224 2786 1214";
var final_string_4 = "M976.221, 1260.009 Q1800 1248 2786 1228";
var final_string_3 = "M976.395, 1284.953 Q1800 1262 2786 1242";
var final_string_2 = "M976.567, 1309.599 Q1800 1286 2786 1256";
var final_string_1 = "M976.742, 1334.551 Q1800 1306 2786 1270";

const E = document.getElementById("E1");
const a = document.getElementById("A2");
const D = document.getElementById("D3");
const g = document.getElementById("G4");
const b = document.getElementById("B5");
const ee = document.getElementById("E6");

// play a note and stop it after a duration
function playNote(audio, duration) {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(function (err) {
    console.log("Audio play failed:", err);
  });
  setTimeout(function () {
    audio.pause();
  }, duration || 600);
}

(function () {
  var container = document.querySelector("#guitar");
  if (!container) return;
  var svg = container.querySelector("svg");
  if (!svg) return;

  var stringPaths = Array.from(svg.querySelectorAll("path.string"));
  var baseDs = [string_6, string_5, string_4, string_3, string_2, string_1];
  var finalDs = [
    final_string_6,
    final_string_5,
    final_string_4,
    final_string_3,
    final_string_2,
    final_string_1,
  ];

  var parsed = baseDs.map(function (b) {
    var parts = b.split("Q");
    var m = parts[0] || "";
    var rest = (parts[1] || "").trim();
    var start = m.replace("M", "").trim().replace(",", " ");
    var nums = rest.split(/\s+/);
    return {
      start: start,
      controlX: nums[0],
      controlY: nums[1],
      endX: nums[2],
      endY: nums[3],
    };
  });

  function getSvgPoint(evt) {
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  var activeStrings = {}; // Track which strings are in active zone
  var playedStrings = {}; // Track which strings have played audio in this interaction

  container.addEventListener("mousemove", function (e) {
    var p = getSvgPoint(e);
    stringPaths.forEach(function (el, i) {
      var s = parsed[i];
      var stringY = parseFloat(s.start.split(/\s+/)[1]);
      var stringX = parseFloat(s.start.split(/\s+/)[0]);
      var responseZone = 50;

      if (Math.abs(p.y - stringY) < responseZone) {
        // String is in active zone
        if (!activeStrings[i]) {
          // String just entered active zone - play audio once
          activeStrings[i] = true;
          console.log(el.id);
          switch (el.id) {
            case "1":
              playNote(ee);
              break;
            case "2":
              playNote(b);
              break;
            case "3":
              playNote(g);
              break;
            case "4":
              playNote(D);
              break;
            case "5":
              playNote(a);
              break;
            case "6":
              playNote(E);
              break;
          }
        }

        var controlX, controlY;
        if (p.x > stringX && p.x < s.endX) {
          controlX = p.x.toFixed(2);
          controlY = p.y.toFixed(2);
        } else {
          controlX = stringX;
          controlY = stringY;
        }
        var d = "M " + s.start + " Q " + controlX + " " + controlY + " " + s.endX + " " + s.endY;

        gsap.to(el, {
          attr: { d: d },
          duration: 0.16,
          ease: "power3.out",
        });
      } else if (activeStrings[i]) {
        // String was active but now out of zone - restore it
        activeStrings[i] = false;
        playedStrings[i] = false;
        var delay = i * 0.06;
        gsap.to(el, {
          attr: { d: finalDs[i] },
          duration: 0.8,
          delay: delay,
          ease: "elastic.out(1,0.1)",
        });
      }
    });
  });

  container.addEventListener("mouseleave", function () {
    activeStrings = {};
    playedStrings = {};
    stringPaths.forEach(function (el, i) {
      var delay = i * 0.06;
      gsap.to(el, {
        attr: { d: finalDs[i] },
        duration: 0.8,
        delay: delay,
        ease: "elastic.out(1,0.1)",
      });
    });
  });
})();

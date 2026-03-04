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

const E = document.getElementById('E');
const a = document.getElementById('a');
const d = document.getElementById('d');
const g = document.getElementById('g');
const b = document.getElementById('b');
const ee = document.getElementById('ee');

;(function(){
	var container = document.querySelector('#guitar');
	if(!container) return;
	var svg = container.querySelector('svg');
	if(!svg) return;

	var stringPaths = Array.from(svg.querySelectorAll('path.string'));
	var baseDs = [string_6, string_5, string_4, string_3, string_2, string_1];
	var finalDs = [final_string_6, final_string_5, final_string_4, final_string_3, final_string_2, final_string_1];

	var parsed = baseDs.map(function(b){
		var parts = b.split('Q');
		var m = parts[0] || '';
		var rest = (parts[1] || '').trim();
		var start = m.replace('M','').trim().replace(',',' ');
		var nums = rest.split(/\s+/);
		return {
			start: start,
			controlX: nums[0],
			controlY: nums[1],
			endX: nums[2],
			endY: nums[3]
		};
	});

	function getSvgPoint(evt){
		var pt = svg.createSVGPoint();
		pt.x = evt.clientX;
		pt.y = evt.clientY;
		return pt.matrixTransform(svg.getScreenCTM().inverse());
	}

	var activeStrings = {}; // Track which strings are in active zone

	container.addEventListener('mousemove', function(e){
		var p = getSvgPoint(e);
		stringPaths.forEach(function(el, i){
			var s = parsed[i];
			var stringY = parseFloat(s.start.split(/\s+/)[1]);
			var stringX = parseFloat(s.start.split(/\s+/)[0]);
			var responseZone = 50;

			if(Math.abs(p.y - stringY) < responseZone) {
				// String is in active zone
				activeStrings[i] = true;
				if (p.x > stringX && p.x < s.endX) {
					var controlX = p.x.toFixed(2);
					var controlY = p.y.toFixed(2);
				}
				else {
					var controlY = stringY;
				}
				var d = 'M ' + s.start + ' Q ' + controlX + ' ' + controlY + ' ' + s.endX + ' ' + s.endY;
				console.log(el.id);
				switch (el.id) {
					case '1':
						ee.play();
						break;
					case '2':
						b.play();
						break;
					case '3':
						g.play();
						break;
					case '4':
						d.play();
						break;
					case '5':
						a.play();
						break;
					case '6':
						E.play();
						break;
				}
				
				gsap.to(el, {
					attr: { d: d },
					duration: 0.16,
					ease: 'power3.out'
				});
			} else if(activeStrings[i]) {
				// String was active but now out of zone - restore it
				activeStrings[i] = false;
				var delay = i * 0.06;
				gsap.to(el, {
					attr: { d: finalDs[i] },
					duration: 0.8,
					delay: delay,
					ease: 'elastic.out(1,0.1)'
				});
			}
		});
	});
    
	container.addEventListener('mouseleave', function () {
		stringPaths.forEach(function(el, i){
			var delay = i * 0.06;
			gsap.to(el, {
				attr: { d: finalDs[i] },
				duration: 0.8,
				delay: delay,
				ease: 'elastic.out(1,0.1)'
			});
		});
	});
})();

let BALL_START_X=(Math.random()*window.innerWidth+1)/3+window.innerWidth/4;
let BALL_START_Y=(Math.random()*window.innerHeight+1)/2+window.innerHeight/4;

let dragStartX, dragStartY;
const line=document.getElementById('sling-line');

gsap.set("#ball", { x: BALL_START_X, y: BALL_START_Y });

Draggable.create("#ball", {
    type: "x, y",
    inertia: true,
    dragResistance: 0.75,
    zIndexBoost: false,

    // bounds: {
        
    // },
    onDragStart: function() {
        dragStartX=this.x;
        dragStartY=this.y;
        gsap.to("#ball", { scale: 0.8, duration: 0.16 });
        
        console.log("drag started!");
    },
    onDrag: function() {
        const ballEl=document.getElementById('ball');
        const rect=ballEl.getBoundingClientRect();
        
        line.setAttribute("x1", BALL_START_X+24);
        line.setAttribute("y1", BALL_START_Y+24);
        line.setAttribute("x2", this.x+24);
        line.setAttribute("y2", this.y+24);
        
        
        console.log("drag dragging!");
    },
    onDragEnd: function() {
        const dx=this.x-BALL_START_X;
        const dy=this.y-BALL_START_Y;
        
        const dragDistance=Math.sqrt(dx*dx+dy*dy);
        const MAX_DRAG=300;
        
        let power=Math.min(dragDistance/MAX_DRAG, 1);
        const targetX=BALL_START_X-dx*3;
        const targetY=BALL_START_Y-dy*3;
 
        gsap.to("#ball", {
            x: targetX,
            y: targetY,
            duration: 0.6*(1-power*0.4),
            scale: 1,
            ease: "power2out",
            onComplete: () => {
                // if goal, reset position and count goal
                // to check goal, use get Rect of ball and poll
                // set this position for next trigger until goal
                BALL_START_X=targetX;
                BALL_START_Y=targetY;
                console.log("completed!!");
                
            }
            
        })
        console.log("drag endeed!");
        line.setAttribute("x1", 0);
        line.setAttribute("x2", 0);
        line.setAttribute("y1", 0);
        line.setAttribute("y2", 0);
    },
})
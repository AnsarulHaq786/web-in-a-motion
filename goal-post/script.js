const GOAL_GEOMETRY={
    viewBox:{w:296,h:360},
    bottomBlock:{x:60,y:300,w:225,h:10},
    poleRight:{x:264,y:90,w:12,h:200},
    crossbar:{x:50,y:50,w:226,h:22},
    goalEntry:{x:36,y:72,w:224,h:228}
}

const BALL_RADIUS=24
const MAX_DRAG=300
const LAUNCH_MULTIPLIER=2.2
const FRICTION=0.96
const RESTITUTION=0.72
const MIN_VELOCITY=0.35
const REST_FRAMES=18

let BALL_START_X=(Math.random()*window.innerWidth+1)/3+window.innerWidth/4
let BALL_START_Y=(Math.random()*window.innerHeight+1)/2+window.innerHeight/4

const scoreValue=document.getElementById('score-value')
const bottomBlockEl=document.getElementById('bottom-block')
const poleRightEl=document.getElementById('pole-right')
const crossbarEl=document.getElementById('crossbar')
const goalEntryEl=document.getElementById('goal-entry')
const goalHitboxesEl=document.getElementById('goal-hitboxes')
const goalFlashEl=document.getElementById('goal-flash')
const ballEl=document.getElementById('ball')
const line=document.getElementById('sling-line')

let score=0
let vx=0
let vy=0
let isFlying=false
let goalScoredThisShot=false
let restFrames=0
let prevBallCenterX=0
let crossedGoalMouth=false
let debugVisible=new URLSearchParams(location.search).has('debug')

function aabbCollision(rect1, rect2) {
    return !(
        rect1.right<rect2.left ||
        rect1.left>rect2.right ||
        rect1.bottom<rect2.top ||
        rect1.top>rect2.bottom
    )
}

function placeHitbox(el, box) {
    const vb=GOAL_GEOMETRY.viewBox
    el.style.left=(box.x/vb.w*100)+'%'
    el.style.top=(box.y/vb.h*100)+'%'
    el.style.width=(box.w/vb.w*100)+'%'
    el.style.height=(box.h/vb.h*100)+'%'
}

function syncHitboxes() {
    placeHitbox(bottomBlockEl, GOAL_GEOMETRY.bottomBlock)
    placeHitbox(poleRightEl, GOAL_GEOMETRY.poleRight)
    placeHitbox(crossbarEl, GOAL_GEOMETRY.crossbar)
    placeHitbox(goalEntryEl, GOAL_GEOMETRY.goalEntry)
}

function setDebugVisible(visible) {
    debugVisible=visible
    goalHitboxesEl.classList.toggle('debug-visible', visible)
}

function randomBallStart() {
    BALL_START_X=(Math.random()*window.innerWidth+1)/3+window.innerWidth/4
    BALL_START_Y=(Math.random()*window.innerHeight+1)/2+window.innerHeight/4
}

function clearSlingLine() {
    line.setAttribute('x1', 0)
    line.setAttribute('x2', 0)
    line.setAttribute('y1', 0)
    line.setAttribute('y2', 0)
}

function applyBallStretch() {
    gsap.set(ballEl, {scaleX:1, scaleY:1, rotation:0})
}

function resolveObstacleCollision(ballRect, obstacleRect) {
    if (!aabbCollision(ballRect, obstacleRect)) return false

    const overlapLeft=ballRect.right-obstacleRect.left
    const overlapRight=obstacleRect.right-ballRect.left
    const overlapTop=ballRect.bottom-obstacleRect.top
    const overlapBottom=obstacleRect.bottom-ballRect.top

    const minOverlap=Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)
    let x=gsap.getProperty(ballEl, 'x')
    let y=gsap.getProperty(ballEl, 'y')

    if (minOverlap===overlapLeft) {
        x-=overlapLeft
        vx=-Math.abs(vx)*RESTITUTION
    } else if (minOverlap===overlapRight) {
        x+=overlapRight
        vx=Math.abs(vx)*RESTITUTION
    } else if (minOverlap===overlapTop) {
        y-=overlapTop
        vy=-Math.abs(vy)*RESTITUTION
    } else {
        y+=overlapBottom
        vy=Math.abs(vy)*RESTITUTION
    }

    gsap.set(ballEl, {x, y})
    return true
}

function handleGoalPostCollisions(ballRect) {
    resolveObstacleCollision(ballRect, bottomBlockEl.getBoundingClientRect())
    ballRect=ballEl.getBoundingClientRect()
    resolveObstacleCollision(ballRect, poleRightEl.getBoundingClientRect())
    ballRect=ballEl.getBoundingClientRect()
    resolveObstacleCollision(ballRect, crossbarEl.getBoundingClientRect())
}

function handleWallBounces(ballRect) {
    let x=gsap.getProperty(ballEl, 'x')
    let y=gsap.getProperty(ballEl, 'y')
    let bounced=false

    if (ballRect.left<0) {
        x-=ballRect.left
        vx=-vx*RESTITUTION
        bounced=true
    } else if (ballRect.right>window.innerWidth) {
        x-=(ballRect.right-window.innerWidth)
        vx=-vx*RESTITUTION
        bounced=true
    }

    if (ballRect.top<0) {
        y-=ballRect.top
        vy=-vy*RESTITUTION
        bounced=true
    } else if (ballRect.bottom>window.innerHeight) {
        y-=(ballRect.bottom-window.innerHeight)
        vy=-vy*RESTITUTION
        bounced=true
    }

    if (bounced) gsap.set(ballEl, {x, y})
}

function isValidGoal(ballRect, entryRect) {
    if (goalScoredThisShot) return false
    if (vx<=0) return false
    if (!aabbCollision(ballRect, entryRect)) return false

    const ballCx=(ballRect.left+ballRect.right)/2
    const ballCy=(ballRect.top+ballRect.bottom)/2
    const crossedFront=prevBallCenterX<=entryRect.left+BALL_RADIUS && ballCx>entryRect.left+BALL_RADIUS
    const insideGoalArea=(
        ballCx>entryRect.left+BALL_RADIUS &&
        ballCx<entryRect.right-BALL_RADIUS*0.25 &&
        ballCy>entryRect.top+BALL_RADIUS*0.5 &&
        ballCy<entryRect.bottom-BALL_RADIUS*0.5
    )

    if (crossedFront) crossedGoalMouth=true

    return crossedGoalMouth && insideGoalArea
}

function updateGoalCounter() {
    scoreValue.textContent=score

    gsap.fromTo(scoreValue,
        {scale:1},
        {scale:1.65, duration:0.18, yoyo:true, repeat:1, ease:'back.out(3)'}
    )
}

function recordGoal() {
    goalScoredThisShot=true

    score++
    updateGoalCounter()

    gsap.fromTo(goalFlashEl,
        {opacity:0.75},
        {opacity:0, duration:0.55, ease:'power2.out'}
    )

}

function resetBall(randomize = true) {
    if (randomize) {
        randomBallStart()
    } else {
        BALL_START_X = gsap.getProperty(ballEl, 'x')
        BALL_START_Y = gsap.getProperty(ballEl, 'y')
    }

    gsap.set(ballEl, {
        x:BALL_START_X,
        y:BALL_START_Y,
        scale:1,
        scaleX:1,
        scaleY:1,
        rotation:0
    })

    vx=0
    vy=0
    isFlying=false
    goalScoredThisShot=false
    restFrames=0
    crossedGoalMouth=false
    prevBallCenterX=BALL_START_X+BALL_RADIUS
    clearSlingLine()
    draggable.enable()
    document.body.style.cursor='default'
}

function stopFlightAndReset() {
    const shouldRegenerate=goalScoredThisShot

    isFlying=false
    vx=0
    vy=0
    gsap.set(ballEl, {scale:1, scaleX:1, scaleY:1, rotation:0})
    gsap.delayedCall(0.1, () => resetBall(shouldRegenerate))
}

function launchBall(dx, dy) {
    const dragDistance=Math.sqrt(dx*dx+dy*dy)
    if (dragDistance<8) return

    const power=Math.min(dragDistance/MAX_DRAG, 1)
    const speed=(6+power*16)*LAUNCH_MULTIPLIER*(dragDistance/MAX_DRAG+0.35)

    vx=(-dx/dragDistance)*speed
    vy=(-dy/dragDistance)*speed

    isFlying=true
    goalScoredThisShot=false
    crossedGoalMouth=false
    restFrames=0
    prevBallCenterX=gsap.getProperty(ballEl, 'x')+BALL_RADIUS

    gsap.set(ballEl, {scale:1})
    draggable.disable()
    clearSlingLine()
    document.body.style.cursor='none'
}

function physicsUpdate() {
    if (!isFlying) return

    const dt=gsap.ticker.deltaRatio()

    vx*=Math.pow(FRICTION, dt)
    vy*=Math.pow(FRICTION, dt)

    let x=gsap.getProperty(ballEl, 'x')
    let y=gsap.getProperty(ballEl, 'y')

    x+=vx*dt
    y+=vy*dt
    gsap.set(ballEl, {x, y})

    let ballRect=ballEl.getBoundingClientRect()
    const entryRect=goalEntryEl.getBoundingClientRect()

    handleGoalPostCollisions(ballRect)

    ballRect=ballEl.getBoundingClientRect()

    if (isValidGoal(ballRect, entryRect)) recordGoal()

    handleWallBounces(ballRect)
    applyBallStretch()

    const ballCx=(ballRect.left+ballRect.right)/2
    prevBallCenterX=ballCx

    if (Math.abs(vx)<MIN_VELOCITY && Math.abs(vy)<MIN_VELOCITY) {
        restFrames++
        if (restFrames>=REST_FRAMES) stopFlightAndReset()
    } else {
        restFrames=0
    }
}

syncHitboxes()
setDebugVisible(debugVisible)
window.addEventListener('resize', syncHitboxes)

document.addEventListener('keydown', function(e) {
    if (e.key==='d' || e.key==='D') setDebugVisible(!debugVisible)
})

gsap.set(ballEl, {x:BALL_START_X, y:BALL_START_Y, zIndex:10})
prevBallCenterX=BALL_START_X+BALL_RADIUS

const draggable=Draggable.create('#ball', {
    type:'x,y',
    inertia:false,
    dragResistance:0.75,
    zIndexBoost:false,

    onDragStart:function() {
        if (isFlying) return false
        gsap.to(ballEl, {scale:0.8, duration:0.16})
    },

    onDrag:function() {
        line.setAttribute('x1', BALL_START_X+BALL_RADIUS)
        line.setAttribute('y1', BALL_START_Y+BALL_RADIUS)
        line.setAttribute('x2', this.x+BALL_RADIUS)
        line.setAttribute('y2', this.y+BALL_RADIUS)
    },

    onDragEnd:function() {
        const dx=this.x-BALL_START_X
        const dy=this.y-BALL_START_Y
        const dragDistance=Math.sqrt(dx*dx+dy*dy)

        gsap.to(ballEl, {scale:1, duration:0.12})

        if (dragDistance<8) {
            gsap.to(ballEl, {x:BALL_START_X, y:BALL_START_Y, duration:0.2, ease:'power2.out'})
            clearSlingLine()
            return
        }

        launchBall(dx, dy)
    }
})[0]

gsap.ticker.add(physicsUpdate)

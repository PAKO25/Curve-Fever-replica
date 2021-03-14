function setuppoints() {
    let playercount = players.length;
    if (playercount == 2) pointstowin = 10;
    if (playercount == 3) pointstowin = 20;
    if (playercount == 4) pointstowin = 30;
    if (playercount == 5) pointstowin = 40;
    if (playercount == 6) pointstowin = 50;
    document.getElementById("firstto").innerHTML = "First to: " + pointstowin;
    players.forEach(player => {
        let p = document.createElement("p");
        p.innerHTML = `${player.name}: ${player.score}`;
        p.id = player.name + "score";
        p.style = "font-size: 20px;"
        scoredisplay.appendChild(p);
    })
}

function filter(array) {
    let newarray = [];
    array.forEach(element => {
        if (element.activated) newarray.push(element);
    });
    return newarray;
}
function animate() {
    var style = canvas.style;
    var opacity = 0.1;
    style.opacity = opacity;
    document.getElementById("game").style.display = "block";
    document.getElementById("setup").style.display = "none";
    var skip = true;
    var interval = setInterval(() => {
        if (opacity < 0.9) {
            opacity += 0.005;
            style.opacity = opacity;
        } else if (opacity > 0.9 && opacity < 1.1 && skip) {
            opacity = 1;
            style.opacity = opacity;
            skip = false;
        } else {
            clearInterval(interval);
            players = filter(players);
            setuppoints();
            if (arcade) {
                bubbleinterval = setInterval(bubble, 2000);
            }
            start();
        }
    }, 10);
}
function start() {
    players.forEach(player => {
        player.holeinterval = setInterval(() => {
            if (!pause) {
                player.hole = true;
                setTimeout(() => {
                    player.hole = false;
                }, holesize);
            }
        }, 2500);
    })
    //prednariše malo črt
    let i = 0;
    forstart = true;
    while(forstart) {
        i++;
        if (i > 15) {
            forstart = false;
        } else {
            loop();
        }
    }

    ctx.fillStyle = "#FF0000";
    ctx.font = (canvas.height / 10) + 'px arial';

    var textString = "Press to start!",
        textWidth = ctx.measureText(textString).width;

    ctx.fillText(textString, (canvas.width / 2) - (textWidth / 2), (canvas.height / 2) - (canvas.height / 6));
    game = true;

    document.addEventListener('keydown', onkeydown);
    document.addEventListener('keyup', onkeyup);
}

function togglepause() {
    if (game) {
        if (pause) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            players.forEach(player => {
                player.draw();
            })
            pause = false;
            req = requestAnimationFrame(loop);
        } else {
            ctx.fillStyle = "#FF0000";
            ctx.font = (canvas.height / 10) + 'px arial';

            var textString = "Press to continue!",
                textWidth = ctx.measureText(textString).width;

            ctx.fillText(textString, (canvas.width / 2) - (textWidth / 2), (canvas.height / 2) - (canvas.height / 6));
            pause = true;
            cancelAnimationFrame(req);
        }
    }
}
function onkeydown(event) {
    let keycode = event.keyCode;
    players.forEach(player => {
        if (player.keyleft == keycode && !player.stopleft) {
            player.holdleft = true;
        }
        if (player.keyright == keycode && !player.stopright) {
            player.holdright = true;
        }
    })
}
function onkeyup(event) {
    let keycode = event.keyCode;
    players.forEach(player => {
        if (player.keyleft == keycode) {
            player.holdleft = false;
            player.stopleft = false;
        }
        if (player.keyright == keycode) {
            player.holdright = false;
            player.stopright = false;
        }
    })
}




function loop() {

    // preveri če so playeri živi + jih nariše...
    let alive = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    players.forEach(player => {
        if (!player.dead) {
            player.isdead();
            document.getElementById(player.name + "score").innerHTML = `${player.name}: ${player.score}`;
        }
        if (!player.dead) {
            player.move();
            alive++;
        } else {
            player.draw();
        }
    });

    // preveri če se more keri efekt sprožit
    players.forEach(player => {
        bubbles.forEach(efekt => {
            let dx = player.x - efekt.x;
            let dy = player.y - efekt.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < player.radius + efekt.radius) {
                console.log("STIK");
                efekt.fireeffect(player);
            }
        })
    })
    // zbriše mrtve efekte
    for (let i = 0; i < bubbles.length; i++) {
        if (bubbles[i].fired) {
            let filteredItems = bubbles.slice(0, i).concat(bubbles.slice(i + 1, bubbles.length))
            bubbles = filteredItems;
        }
    }
    // nariše efekte
    if (bubbles.length > 0) {
        bubbles.forEach(efekt => {
            efekt.draw();
        })
    }
    if (!forstart) {
        // sproži gameover ali napove naslednji loop
        if (alive < 2) {
            gameover();
        } else {
            req = requestAnimationFrame(loop);
        }
    }
}
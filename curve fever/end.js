function gameover() {
    bubbles = [];
    let isend = false;
    document.removeEventListener('keydown', onkeydown);
    document.removeEventListener('keyup', onkeyup);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game = false;
    pause = true;
    players.forEach(player => {
        player.positions = [];
        player.x = random(canvas.width, true);
        player.y = random(canvas.height, true);
        player.speed = 1.5;
        player.radius = 3;
        player.angle = random(360, false);
        player.holdleft = false;
        player.holdright = false;
        player.dead = false;
        player.efekt = [];
        clearInterval(player.holeinterval);
        if (player.score == pointstowin) {
            isend = true;
            winner = player;
        }
        document.getElementById(player.name + "score").innerHTML = `${player.name}: ${player.score}`;
        clearInterval(player.holeinterval);
    })
    if (isend) {
        end();
    } else {
        start();
    }
}

function end() {
    document.getElementById("game").style.display = "none";
    document.getElementById("end").style.display = "block";
    document.getElementById("winnerdisplay").innerHTML = "The winner is: "+winner.name;
}
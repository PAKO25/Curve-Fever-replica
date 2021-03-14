const pi = Math.PI;

function player(color, name) {
    this.score = 0;
    this.activated = false;
    this.dead = false;
    this.speed = 1.5;
    this.defaultspeed = this.speed;
    this.radius = 3;
    this.defaultradius = this.radius;
    this.angle = random(360, false);
    this.name = name;
    this.color = color;
    this.positions = [];
    this.x = random(canvas.width, true);
    this.y = random(canvas.height, true);
    this.virtualx;
    this.virtualy;
    this.keyleft;
    this.defaultkeyleft;
    this.keyright;
    this.defaultkeyright;
    this.holdleft = false;
    this.holdright = false;
    this.stopleft = false;
    this.stopright = false;
    this.holeinterval;
    this.hole = false;
    this.focus = false;
    this.blink = false;
    this.efekt = [];
    this.headcolor = "#FFFF00";
    this.angleplaceholder = 0;

    this.move = function () {
        // uporabi efekt za hitrost/slownes, debelost/vitkost in zamenjavo kontrolov
        // najprej resetiram vse vrednosti
        this.keyleft = this.defaultkeyleft;
        this.keyright = this.defaultkeyright;
        this.radius = this.defaultradius;
        this.speed = this.defaultspeed;
        this.headcolor = "#FFFF00";
        this.efekt.forEach(efekt => {
            let keri = efekt[1];

            if (keri == 2 || keri == 9) {
                //debeli
                this.radius += 2;

            } else if (keri == 4 || keri == 8) {
                //suhi
                this.radius -= 2;

            } else if (keri == 3 || keri == 10) {
                //hiter
                this.speed++;

            } else if (keri == 5 || keri == 12) {
                //počasen
                this.speed = this.speed / 2;

            } else if (keri == 13) {
                // zamenjaj kontrole
                this.keyleft = this.defaultkeyright;
                this.keyright = this.defaultkeyleft;
                this.headcolor = "#0101DF";

            } else {
                //nič se ne zgodi
            }
        })
        // preveri če je aktiviran efekt da lahko greš skozi druge - ne shrani tvoje pozicije - zato se kasneje ne nariše
        let isinvis = false;
        this.efekt.forEach(efekt => {
            if (efekt[1] == 6) isinvis = true;
        })
        //preveri če je aktiviran efekt da greš cik cak 
        let cikcak = false;
        this.efekt.forEach(efekt => {
            if (efekt[1] == 1 || efekt[1] == 11) cikcak = true;
        })

        // če je cikcak true, se spremeni način gibanja, če ni, se izvede originalni
        if (cikcak) {
            let angleplaceholder = this.angleplaceholder;
            if (angleplaceholder == 0) {
                if (this.angle > 315 || this.angle <= 45) angleplaceholder = 4;
                if (this.angle > 45 && this.angle <= 135) angleplaceholder = 1;
                if (this.angle > 135 && this.angle <= 225) angleplaceholder = 2;
                if (this.angle > 225 && this.angle <= 315) angleplaceholder = 3;
            }
            // cikcak obravnavanje držanja tipk
            if (this.holdleft) {
                if (angleplaceholder == 1) {
                    angleplaceholder = 4;
                } else if (angleplaceholder == 2) {
                    angleplaceholder = 1;
                } else if (angleplaceholder == 3) {
                    angleplaceholder = 2; 
                } else if (angleplaceholder == 4) {
                    angleplaceholder = 3;
                }
                this.holdleft = false;
                this.stopleft = true;
            }
            if (this.holdright) {
                if (angleplaceholder == 1) {
                    angleplaceholder = 2;
                } else if (angleplaceholder == 2) {
                    angleplaceholder = 3;
                } else if (angleplaceholder == 3) {
                    angleplaceholder = 4;
                } else if (angleplaceholder == 4) {
                    angleplaceholder = 1;
                }
                this.holdright = false;
                this.stopright = true;
            }
            this.angleplaceholder = angleplaceholder;

        } else {
            this.angleplaceholder = 0;
            // normalno obravnavanje držanja tipk
            if (this.holdleft) {
                if (this.angle <= 1) {
                    this.angle = 360;
                }
                this.angle -= 1.5;
            }
            if (this.holdright) {
                if (this.angle >= 359) {
                    this.angle = 1;
                }
                this.angle += 1.5;
            }
        }

        // preveri če je cikcak aktiven, v tem primeru pretvori pozicijo v kot
        if (this.angleplaceholder != 0) {
            if (this.angleplaceholder == 1) this.angle = 90;
            if (this.angleplaceholder == 2) this.angle = 180;
            if (this.angleplaceholder == 3) this.angle = 270;
            if (this.angleplaceholder == 4) this.angle = 2;
        }
        // normalna funkcija premika
        let newpos = calcnextpos(this.x, this.y, this.speed, this.angle);
        this.x = newpos[0];
        this.y = newpos[1];
        newpos = calcnextpos(this.x, this.y, this.speed * 2, this.angle);
        this.virtualx = newpos[0];
        this.virtualy = newpos[1];

        if (!isinvis) {
            if (!this.hole) {
                let forpush = [this.x, this.y, this.radius];
                this.positions.push(forpush);
            }
        }
        this.draw();
    }


    this.draw = function () {
        // normalna draw funcija
        this.positions.forEach(pos => {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(pos[0], pos[1], pos[2], 0, 2 * Math.PI);
            ctx.fill();
        })
        ctx.fillStyle = this.headcolor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }



    this.isdead = function () {
        // preveri če je aktiviran efekt da lahko greš skozi druge - ne nariše tvoje črte
        let isinvis = false;
        this.efekt.forEach(efekt => {
            if (efekt[1] == 6) isinvis = true;
        })
        // preveri če lahko greš skozi steno
        let skozisteno = false;
        this.blink = false
        canvas.blink = false;
        this.efekt.forEach(efekt => {
            if (efekt[1] == 7) {
                skozisteno = true;
                this.blink = true;
            }
            if (efekt[1] == 14) {
                skozisteno = true;
                canvas.blink = true;
            }
        })
        // če se zabije v steno in lahko gre skozi
        if (skozisteno) {
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        // normalna funckija za preverjanje smrti
        // če se zabije v steno
        if (!skozisteno) {
            if (this.x > canvas.width ||
                this.x < 0 ||
                this.y > canvas.height ||
                this.y < 0) {
                this.dead = true;
                playerdied(this.name);
            }
        }

        // preveri če se zabije v igralca
        let x1 = this.x;
        let y1 = this.y;
        if (!isinvis) {
            players.forEach(player2 => {
                if (this.name == player2.name) {
                    // Če se zabije v sebe
                    let positions2 = this.positions;
                    for (let i = positions2.length - 1; i > 0; i--) {
                        let wait = (this.radius + positions2[i][2]) / this.speed;
                        if (i < positions2.length - wait - 5) {
                            let x2 = positions2[i][0];
                            let y2 = positions2[i][1];
                            let dx = x1 - x2;
                            let dy = y1 - y2;
                            let distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < this.radius + positions2[i][2]) {
                                this.dead = true;
                                playerdied(this.name);
                                break;
                            }
                        }
                    }
                } else {
                    // Če se zabije v drugega
                    x1 = this.virtualx;
                    y1 = this.virtualy;
                    player2.positions.every(positions2 => {
                        let x2 = positions2[0];
                        let y2 = positions2[1];
                        let dx = x1 - x2;
                        let dy = y1 - y2;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < this.radius + positions2[2]) {
                            this.dead = true;
                            playerdied(this.name);
                            return false;
                        }
                        return true;
                    })
                }
            });
        }
    }
}




function random(x, check) {
    let rand = Math.floor((Math.random() * x) + 1);
    if (check) {
        if (rand > x - 100) rand = x - 100;
        if (rand < 100) rand = 100;
    }
    return rand;
}
function playerdied(name) {
    players.forEach(player => {
        if (player.name != name && !player.dead) {
            player.score++;
        }
    })
}
function calcnextpos(x, y, speed, angle) {
    let radians = angle * pi / 180.0;
    let dx = speed * Math.cos(radians);
    let dy = speed * Math.sin(radians);
    x += dx;
    y += dy;
    return [x, y];
}
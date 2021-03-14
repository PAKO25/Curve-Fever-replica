var bubbles = [];
var effectduration = 5000;
var slike = ["placeholder"];
var bubbleinterval;

function bubble() {
    if (!pause && game) {
        if (bubbles.length < 3) {
            bubbles.push(new newbubble());
        }
    }
}

function newbubble() {
    this.fired = false;
    this.x = random(canvas.width, true);
    this.y = random(canvas.height, true);
    this.width = 60;
    this.height = 60;
    this.radius = this.width/2;
    this.id = random(1000000, false);
    // določi efekt
    this.keri = random(17, false);
    // določi sliko
    this.photo = slike[this.keri][1];


    this.fireeffect = function (kdo) {
        this.fired = true;
        if (this.keri < 15) {
            // če lahko efekt dodelis igralcu

            players.forEach(player => {

                if (this.keri == 14) {

                    //skozi stene - za vse playere
                    if (!player.dead) {
                        player.efekt.push([this.id, this.keri]);
                        setTimeout(() => {
                            for (let i = 0; i < player.efekt.length; i++) {
                                if (player.efekt[i][0] == this.id) {
                                    let filteredItems = player.efekt.slice(0, i).concat(player.efekt.slice(i + 1, player.efekt.length))
                                    player.efekt = filteredItems;
                                }
                            }
                        }, effectduration);
                    }

                } else if (this.keri > 7) {

                    //rdeči efekti - za vse ostale playere
                    if (player.name != kdo.name) {
                        if (!kdo.dead) {
                            if (!player.dead) {
                                player.efekt.push([this.id, this.keri]);
                                setTimeout(() => {
                                    for (let i = 0; i < player.efekt.length; i++) {
                                        if (player.efekt[i][0] == this.id) {
                                            let filteredItems = player.efekt.slice(0, i).concat(player.efekt.slice(i + 1, player.efekt.length))
                                            player.efekt = filteredItems;
                                        }
                                    }
                                }, effectduration);
                            }
                        }
                    }

                } else {

                    //normalni efekti - za enega playera
                    if (player.name == kdo.name) {
                        if (!kdo.dead) {
                            kdo.efekt.push([this.id, this.keri]);
                            setTimeout(() => {
                                for (let i = 0; i < kdo.efekt.length; i++) {
                                    if (kdo.efekt[i][0] == this.id) {
                                        let filteredItems = kdo.efekt.slice(0, i).concat(kdo.efekt.slice(i + 1, kdo.efekt.length))
                                        kdo.efekt = filteredItems;
                                    }
                                }
                            }, effectduration);
                        }
                    }

                }
            });

        } else {
            // če efekta ne moreš dodelit igralcu
            if (this.keri == 15) {
                // random
                this.keri = random(17, false);
                this.fireeffect(kdo);

            } else if (this.keri == 16) {
                // zbriše trenutne in spawna 1 novega
                bubbles.forEach(bubble => {
                    bubble.fired = true;
                })
                bubble();

            } else {

                // počisti tablo
                players.forEach(player => {
                    player.positions = [[player.x, player.y, player.radius]];
                })
            }
        }
    }


    this.draw = function () {
        //narisi sliko z centrom x,y
        let drawx = this.x - (this.width/2);
        let drawy = this.y - (this.height/2);
        ctx.drawImage(this.photo, drawx, drawy, this.width, this.height);
    }
}
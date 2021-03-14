var players = [];
var data = [["Fred", "#FF0000"], ["Greenlee", "#04B404"],
["Pinkley", "#DF01D7"], ["Bluebell", "#2ECCFA"],
["Willem", "#FF8000"], ["Greydon", "#848484"]];
var canvas;
var ctx;
var wait = true;
var opozorilo;
var game = false;
var pause = true;
var req;
var pointstowin;
var winner;
var scoredisplay;
var holesize = 300;
var yellow = "#CBF748";
var arcade = false;
var forstart = false;

function setup() {
    scoredisplay = document.getElementById("scoredisplay");
    opozorilo = document.getElementById("opozorilo");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = (getwindowsize()[1]) / 1.1;
    canvas.width = canvas.height;
    if (canvas.height > 1000) canvas.height = 1000;
    if (canvas.width > 1000) canvas.width = 1000;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    canvas.blink = false;
    data.forEach(element => {
        players.push(new player(element[1], element[0]))
    })
    let i = 1;
    while (i < 18) {
        let slika = new Image(10, 10);
        slika.src = `slike/${i}.png`;
        slike.push([i, slika]);
        i++;
    }
}


function keydown(event, id) {
    let key = event.keyCode;
    let keydisplay = event.key;

    if (wait && !game) {
        if (key == "27" || key == "91" || key == "255"
            || key == "173" || key == "174" || key == "175"
            || key == "177" || key == "179" || key == "176") {
            key = null;
            keydisplay = "Illegal move!";
            wait = false;
            setTimeout(() => {
                document.getElementById(id).value = "";
                wait = true;
            }, 1000);
        } else {
            var newid = id.substring(0, id.length - 1);
            var which = id.charAt(id.length - 1)
            players.forEach(player => {
                if (newid == player.name) {
                    if (which == 1) {
                        player.keyleft = key;
                        player.defaultkeyleft = key;
                        document.getElementById(newid + "2").focus();
                        setTimeout(() => {
                            document.getElementById(newid + "2").value = "";
                        }, 10);
                    } else {
                        player.keyright = key;
                        player.defaultkeyright = key;
                    }
                    player.activated = true;
                }
            });
        }

        setTimeout(() => {
            document.getElementById(id).value = keydisplay;
        }, 10);
    }
}

function getwindowsize() {
    var viewportwidth;
    var viewportheight;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7)
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth,
            viewportheight = window.innerHeight
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth,
            viewportheight = document.documentElement.clientHeight
    }
    // older versions of IE
    else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
            viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }
    return [viewportwidth, viewportheight];
}

function check() {
    if (wait) {
        var ok = 0;

        players.forEach(player => {
            var text1 = document.getElementById(player.name + "1").value;
            var text2 = document.getElementById(player.name + "2").value;
            if (text1 != "" || text2 != "") {
                ok++
            } else {
                player.activated = false;
            }
        })
        if (ok > 1) {
            opozorilo.style.display = "none";
            animate();
        } else {
            opozorilo.style.display = "block";
        }
    }
}

function reset(id) {
    let text1 = document.getElementById(id + "1");
    let text2 = document.getElementById(id + "2");
    let focus;
    players.forEach(player => {
        if (player.name == id) focus = player.focus;
    })
    if (text1.value == "" && text2.value == "") {
        if (focus) {
            document.getElementById("takefocus").focus();
            players.forEach(player => {
                if (player.name == id) player.focus = false;
            })
        } else {
            text1.focus();
            players.forEach(player => {
                if (player.name == id) player.focus = true;
            })
        }
    } else {
        text1.value = "";
        text2.value = "";
        document.getElementById(id + "o").className = "optionoff";
        players.forEach(player => {
            if (player.name == id) {
                player.activated = false;
                player.focus = false;
            }
        })
    }
}
function focuson(id) {
    let shortid = id.substring(0, id.length - 1);
    id = shortid + "o";
    document.getElementById(id).className = "optionon";
}
function bluron(id) {
    let shortid = id.substring(0, id.length - 1);
    id = shortid + "o";
    let change = true;
    players.forEach(player => {
        if (player.name == shortid) {
            if (player.activated) change = false;
        }
    })
    if (change) document.getElementById(id).className = "optionoff";
}

function changegm(id) {
    let shortid = id.substring(0, id.length - 1);
    let which = id.charAt(id.length - 1);
    if (which == 1) {
        document.getElementById(shortid + "2").className = "optionoff";
        document.getElementById(shortid + "1").className = "optionon";
        arcade = false;
    }
    if (which == 2) {
        document.getElementById(shortid + "1").className = "optionoff";
        document.getElementById(shortid + "2").className = "optionon";
        arcade = true;
    }
}
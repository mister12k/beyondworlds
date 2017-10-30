var volume;
var volumebutton;
var confirmbutton;
var backbutton;
var statsbutton;
var confirm = 0;
var back = 0;
var stats = 0;
var confirmkeytext;
var statskeytext;
var backkeytext;

function toggleSound(upDown){
    if (game.sound.mute) {
        volumetext.setText("Yes");
    }
    else {
        volumetext.setText("No");
    }
    game.sound.mute = ! game.sound.mute;
}

function confirmChange() {
    confirm = 1;
    confirmbutton.visible = false;
    confirmkeytext.setText("Press the new key to bind...")
    document.body.addEventListener('keydown', function (e) {
        if (confirm == 1) {
            confirmKey = e.keyCode;
            confirmkeytext.setText(String.fromCharCode(e.keyCode))
            confirm = 0;
            confirmbutton.visible = true;
        }
    });
}

function backChange() {
    back = 1;
    backbutton.visible = false;
    backkeytext.setText("Press the new key to bind...")
    document.body.addEventListener('keydown', function (e) {
        if (back == 1) {
            backKey = e.keyCode;
            backkeytext.setText(String.fromCharCode(e.keyCode))
            back = 0;
            backbutton.visible = true;
        }
    });
}

function statsChange() {
    stats = 1;
    statsbutton.visible = false;
    statskeytext.setText("Press the new key to bind...")
    document.body.addEventListener('keydown', function (e) {
        if (stats == 1) {
            statsKey = e.keyCode;
            statskeytext.setText(String.fromCharCode(e.keyCode))
            stats = 0;
            statsbutton.visible = true;
        }
    });
}


var configState = {
    
    create: function() {
        game.add.text(220, 40, 'Settings',{ font: '120px RPGSystem', fill: '#ffffff' });
        game.add.text(50, 200, 'Volume: ',{ font: '40px RPGSystem', fill: '#ffffff' });
        volumebutton = game.add.button(280, 195, 'change', toggleSound, this);
        volumebutton.input.useHandCursor = true;
        volumetext = game.add.text(200, 200, 'Yes',{ font: '40px RPGSystem', fill: '#ffffff' });

        game.add.text(50, 260, 'Confirm key: ',{ font: '40px RPGSystem', fill: '#ffffff' });
        confirmbutton = game.add.button(300, 250, 'change', confirmChange, this);
        confirmbutton.input.useHandCursor = true;
        confirmkeytext = game.add.text(260, 260, String.fromCharCode(confirmKey),{ font: '40px RPGSystem', fill: '#ffffff' });

        game.add.text(50, 320, 'Back key: ',{ font: '40px RPGSystem', fill: '#ffffff' });
        backbutton = game.add.button(300, 310, 'change', backChange, this);
        backbutton.input.useHandCursor = true;
        backkeytext = game.add.text(260, 320, String.fromCharCode(backKey),{ font: '40px RPGSystem', fill: '#ffffff' });

        game.add.text(50, 380, 'Stats key: ',{ font: '40px RPGSystem', fill: '#ffffff' });
        statsbutton = game.add.button(300, 370, 'change', statsChange, this);
        statsbutton.input.useHandCursor = true;
        statskeytext = game.add.text(260, 380, String.fromCharCode(statsKey),{ font: '40px RPGSystem', fill: '#ffffff' });

        game.add.text(50, 480, 'Press ENTER to return to menu',{ font: '40px RPGSystem', fill: '#ffffff' });

        enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },
    
    update: function(){
        if (enter.isDown) {
            game.state.start('menu');
        }
    }
    
};
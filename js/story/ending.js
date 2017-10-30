var endingState = {
    create: function() {
        game.add.text(100, 150, 'Congratulations!',{ font: '60px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 220, 'After the epic battle, Emperor Goldark is',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 250, 'finally defeated. Our heroes have saved',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 280, 'their kingdoms, and the monsters will ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 310, 'never come back again now that their ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 340, 'leader is dead. Peace now reigns in Elrech ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 370, 'and Faratar, so Oda, Matsuda, Kiyoko and',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 400, 'Satomi can go back to their lives. But',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 430, 'who knows for how long...',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 500, 'Press ENTER to return to the menu',{ font: '60px RPGSystem', fill: '#ffffff' });
        enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        //Play music
        music_sound.stop()
        music_sound = game.add.sound('first_song');
        music_sound.loop = true;
        music_sound.play();
    },
    
    update: function(){
        if(enter.isDown) {
            game.state.start('menu');
        }
    }
    
};

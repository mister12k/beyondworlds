var introState2 = {
    
    create: function() {
        
        game.add.text(140, 220, 'After the combats with the monsters, our',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 250, 'heroes continue their journey. In the long',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 280, 'way they still have to walk, they find a ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 310, 'very valuable ally: Kiyoko, the monk. Kiyoko ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 340, 'wants peace to come to the kingdoms again, ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 370, 'so he leaves his duties as a monk and ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 400, 'joins our two heroes in their journey... ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(140, 500, 'Press ENTER to continue',{ font: '60px RPGSystem', fill: '#ffffff' });
        enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        //Play music
        music_sound.stop()
        music_sound = game.add.sound('second_song');
        music_sound.loop = true;
        music_sound.play();
    },
    
    update: function(){
        if(enter.isDown) {
            game.state.start('level2');
        }
    }
    
};

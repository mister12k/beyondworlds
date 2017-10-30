var introState = {
    
    create: function() {
        
        game.add.text(120, 220, 'The kingdoms of Elrech and Faratar lived in',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 250, 'peace for years, until now. Strange monsters',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 280, 'have appeared in the frontiers between the',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 310, 'two of them. Two heroes from Elrech, Oda and Matsuda ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 340, 'have the duty of finding the source of the',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 370, 'problem and bring peace to the kingdoms...',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 500, 'Press ENTER to continue',{ font: '60px RPGSystem', fill: '#ffffff' });
        enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        //Play music
        music_sound = game.add.sound('first_song');
        music_sound.loop = true;
        music_sound.play();
    },
    
    update: function(){
        if(enter.isDown) {
            game.state.start('level1');
        }
    }
    
};

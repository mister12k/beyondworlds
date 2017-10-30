var introState3 = {
    
    create: function() {
        game.add.text(120, 160, 'After fighting their way to the truth to',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 190, 'discover that Emperor Goldark, the ruler of Faratar',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 220, 'along with his army, were the ones behind the monsters.',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 250, 'With the help of their new friend, Satomi, the mage,',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 280, 'our heroes can get into Emperor Goldark\'\s castle',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 310, 'thanks to the use of teleportation magic. ',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 340, 'They will have to cross the castle and defeat the',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 370, 'Emperor in order to bring back peace again...',{ font: '30px RPGSystem', fill: '#ffffff' });
        game.add.text(120, 500, 'Press ENTER to continue',{ font: '60px RPGSystem', fill: '#ffffff' });
        enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        //Play music
        music_sound.stop()
        music_sound = game.add.sound('third_song');
        music_sound.loop = true;
        music_sound.play();
    },
    
    update: function(){
        if(enter.isDown) {
            game.state.start('level3');
        }
    }
    
};

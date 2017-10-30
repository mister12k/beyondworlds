var menuState = {
    
    create: function() {
        game.add.text(75, 200, 'Beyond Worlds',{ font: '120px RPGSystem', fill: '#ffffff' });
        game.add.text(150, 400, 'Press Z to Start Game',{ font: '60px RPGSystem', fill: '#ffffff' });
        game.add.text(170, 500, 'Press M for Settings',{ font: '60px RPGSystem', fill: '#ffffff' });
        z = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        m = game.input.keyboard.addKey(Phaser.Keyboard.M);
    },
    
    update: function(){
        if(z.isDown){
            game.state.start('intro');
        }

        if(m.isDown) {
            game.state.start('config');
        }
    }
    
};

var bootState = {
    preload: function () {
    },
    
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Start the load state and set default keys
        statsKey = Phaser.Keyboard.C;
        confirmKey = Phaser.Keyboard.Z;
        backKey = Phaser.Keyboard.X;
        game.state.start('load');
    }
};
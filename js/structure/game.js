// Initialise Phaser
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// Define our 'global' variable
game.global = {
    score: 0
};


// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('intro', introState);
game.state.add('intro2', introState2);
game.state.add('intro3', introState3);
game.state.add('ending', endingState);
game.state.add('menu', menuState);
game.state.add('config', configState);
game.state.add('level1', level1State);
game.state.add('level2', level2State);
game.state.add('level3', level3State);
// Start the 'boot' state
game.state.start('boot');
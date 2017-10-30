var loadState = {
    preload: function () {        
        //  Sprite load
        game.load.image('level1', 'assets/levels/level1.png');
        game.load.image('level2', 'assets/levels/level2.png');
        game.load.image('level3', 'assets/levels/level3.png');
        game.load.image('column', 'assets/others/column.png');
        game.load.image('line', 'assets/others/line.png');
        game.load.image('samurai_icon','assets/characters/samurai_icon.png');
        game.load.image('archer_icon','assets/characters/archer_icon.png');
        game.load.image('monk_icon','assets/characters/monk_icon.png');
        game.load.image('mage_icon','assets/characters/mage_icon.png');
        game.load.image('cursor','assets/icons/cursor.png');
        game.load.image('cursorTurn','assets/icons/cursor_rotated.png');
        game.load.image('cursorAttack','assets/icons/cursor_attack.png');
        game.load.image('cursorApply','assets/icons/cursor_apply.png');
        game.load.image('healthbar', 'assets/others/health_bar.png')
        game.load.image('manabar', 'assets/others/mana_bar.png')
        game.load.image('hbar_fill', 'assets/others/health_fill.png')
        game.load.image('mbar_fill', 'assets/others/mana_fill.png')
        game.load.image('exp_fill', 'assets/others/exp_fill.png')
        game.load.image('expbar', 'assets/others/exp_bar.png')
        game.load.image('change', 'assets/icons/change.png')
        
        //  Atlas load
        game.load.atlas('samurai', 'assets/characters/samurai.png', 'assets/characters/samurai.json');
        game.load.atlas('beastman', 'assets/characters/beastman.png', 'assets/characters/beastman.json');
        game.load.atlas('archer','assets/characters/archer.png', 'assets/characters/archer.json');
        game.load.atlas('monk', 'assets/characters/monk.png', 'assets/characters/monk.json');
        game.load.atlas('mage', 'assets/characters/mage.png', 'assets/characters/mage.json');
        game.load.atlas('soldier', 'assets/characters/soldier.png', 'assets/characters/soldier.json');
        game.load.atlas('ninja', 'assets/characters/ninja.png', 'assets/characters/ninja.json');
        game.load.atlas('harpy','assets/characters/harpy.png', 'assets/characters/harpy.json');
        game.load.atlas('emperor','assets/characters/emperor.png', 'assets/characters/emperor.json');


        //  Sound load
        game.load.audio('menu_sound', 'assets/sound/menu_selection.mp3');
        game.load.audio('sword_attack', 'assets/sound/sword_attack.mp3');
        game.load.audio('bow_attack', 'assets/sound/bow_fire.mp3');
        game.load.audio('slap_attack', 'assets/sound/slap_sound.mp3');
        game.load.audio('first_song', 'assets/sound/music/TownOfWishes.ogg');
        game.load.audio('combat_song', 'assets/sound/music/RoyaltyOfSin.ogg');
        game.load.audio('second_song', 'assets/sound/music/Valiance.ogg');
        game.load.audio('third_song', 'assets/sound/music/EvilApproaches.ogg');
        //game.load.audio('death', 'assets/sound/shout_sound.mp3')
    },
    
    create: function() {
        // Go to the menu state
        game.state.start('menu');
    }
};
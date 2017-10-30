//Variables
var samurai;
var archer;
var monk;
var mage;
var platforms;
var background;
var column;
var cursors;
var confirmKey;
var backKey;
var statsKey;
var gamePhase = 0; // 0 - movement, 1 - combat 
var combatId = 0; // Identifies which combat we are in 
var teamTurn = 0; // 0 - player, 1 - enemy
var doingAction = 0; // 0 - action not started, 1 - action started
var characterTurn = 0; 
var enemyTurn = 0;
var line1;
var enemy;
var menuStats;
var menuCombat;
var menuAttack;
var menuAbility;
var menuItem;
var menuApply;
var menuScout;
var enemies;
var combatPoints; // Invisible sprite group to start combats    
var items; // Group which contains the player items
var attackFlag;
var itemFlag = 0;
var numEnemies;
var players;
var selectedEnemy;
var selectedPlayer;
var miniPhase = 0;
var resetPoint = 0;
    
//Abilities
var attackBonus = 0;
var defenseBonus = 0;
var focusShot = 0;
var scoutEnemy = 0;
var cure = 0;
var shaolin = 0;
var fireball = 0;

var left // 0 - Characters going right, 1 - characters going left;
var actionMovement = 0; // 0 - Moving to attack, 1 - moving from attack
var combatWin = 0; // 0 - No one has still won, 1- player won, -1 player lost
var attackAnim = 0; // 0- Attack animation playing, 1 - attack animation ended
var dropFlag = 0;

var ground;


var minHP;

//Funciones

function AIattack(){
    
    if(doingAction == 0){
        //  Always attacks the character with the least HP.
        for(i = 0; i < players.total;i++){
            if(i == 0){
                min = players.getAt(i).hp;
                minHP = i;
            }else{
                if(min > players.getAt(i).hp){
                    min = players.getAt(i).hp;
                    minHP = i;
                }
            }
        }
        iniX = enemies.getAt(enemyTurn).body.x;
        game.add.tween(enemies.getAt(enemyTurn).body).to( { x: players.getAt(minHP).x + 100}, 500, Phaser.Easing.Linear.In, true);
        doingAction = 1;            
    }else{    
        if(enemies.getAt(enemyTurn).body.x > players.getAt(minHP).x + 100 && actionMovement == 0){
            enemies.getAt(enemyTurn).animations.play('walking_left');
        }else if(enemies.getAt(enemyTurn).body.x == iniX && actionMovement == 1){
            attackFlag = 0;
            attackAnim = 0;
            doingAction = 0;
            shaolin = 0;
            actionMovement = 0;
            players.callAll('animations.play', 'animations', 'standing_right');
            enemies.callAll('animations.play', 'animations', 'standing_left');
            if(enemyTurn != enemies.total - 1){
                enemyTurn = (enemyTurn + 1);
                attackFlag  = 1;
            }else{
                if(defenseBonus > 0){
                    defenseBonus = 0;
                }
                enemyTurn = 0;
                teamTurn = 0;
                menuCombat.getAt(5).visible = true;
            }
            if(players.getAt(minHP).hp <= 0){
                for(i = 0; i<players.total;i++){
                    if(i > minHP){
                        players.getAt(i).body.position.x += 75;
                    }
                }
                players.remove(players.getAt(minHP));
                
            }
            if(players.total == 0){
                combatWin = -1;
            }
        }else if(enemies.getAt(enemyTurn).body.x >   players.getAt(minHP).x + 100 && actionMovement == 1){
             enemies.getAt(enemyTurn).animations.play('walking_right');
        }else{
            if(attackAnim == 0){
                enemies.getAt(enemyTurn).animations.play('attacking_left', null,false);
                enemies.getAt(enemyTurn).attack_sound.play();
                attackAnim = 1;
            }else{
                if(enemies.getAt(enemyTurn).animations.getAnimation('attacking_left').isPlaying == false && actionMovement == 0){
                    if(players.getAt(minHP).name == "Kiyoko" && shaolin == 1){
                        players.getAt(minHP).hp -= (enemies.getAt(enemyTurn).atk * 2 - defenseBonus);
                    }else{
                        players.getAt(minHP).hp -= (enemies.getAt(enemyTurn).atk - defenseBonus);
                    }
                    if(players.getAt(minHP).hp >= 0){
                        players.getAt(minHP).hpFill.scale.setTo(0.2*players.getAt(minHP).hp/players.getAt(minHP).maxHp,0.8);
                        players.getAt(minHP).hpStat.setText( players.getAt(minHP).hp +'/'+ players.getAt(minHP).maxHp,true);
                    }else{
                        players.getAt(minHP).hpFill.scale.setTo(0,0.8);
                        players.getAt(minHP).hpStat.setText('0/'+ players.getAt(minHP).maxHp,true);
                    }
                    players.getAt(minHP).animations.play('dying_right', null,false);
                    //players.getAt(minHP).death_sound.play();
                    game.add.tween(enemies.getAt(enemyTurn).body).to( { x: iniX }, 500, Phaser.Easing.Linear.In, true);
                    actionMovement = 1;
                }
            }    
        }
    }
}

function combat(){
    music_sound.stop();
    music_sound = game.add.sound('combat_song');
    music_sound.loop = true;
    music_sound.play();
    for(j = 1; j < combats.get(combatId).length; j++){
        switch (combats.get(combatId)[j]){
            case "beastman":
                switch (combats.get(combatId)[0]){
                    case 1:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 80, 15, 5,null,['slap_attack'/*, 'death'*/],"Beastman");
                        break;
                    case 2:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 100, 15, 15,null,['slap_attack'/*, 'death'*/],"Beastman");
                        break;
                    case 3:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 120, 15, 25,null,['slap_attack'/*, 'death'*/],"Beastman");
                        break;
                }
            break;
            case "harpy":
                switch (combats.get(combatId)[0]){
                    case 1:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 190, combats.get(combatId)[j], 60, 20, 10,null,['slap_attack'/*, 'death'*/],"Harpy");
                        break;
                    case 2:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 190, combats.get(combatId)[j], 80, 20, 25,null,['slap_attack'/*, 'death'*/],"Harpy");
                        break;
                    case 3:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 190, combats.get(combatId)[j], 100, 20, 30,null,['slap_attack'/*, 'death'*/],"Harpy");
                        break;
                }
            break;
            case "soldier":
                switch (combats.get(combatId)[0]){
                    case 1:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 100, 10, 15,null,['sword_attack'/*, 'death'*/],"Soldier");
                        break;
                    case 2:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 120, 10, 20,null,['sword_attack'/*, 'death'*/],"Soldier");
                        break;
                    case 3:
                        console.log(combatPoints.total)
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 140, 10, 25,null,['sword_attack'/*, 'death'*/],"Soldier");
                        break;
                }
            break;
            case "ninja":
                switch (combats.get(combatId)[0]){
                    case 1:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 40, 10, 30,null,['sword_attack'/*, 'death'*/],"Ninja");
                        break;
                    case 2:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 60, 10, 35,null,['sword_attack'/*, 'death'*/],"Ninja");
                        break;
                    case 3:
                        enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 197, combats.get(combatId)[j], 80, 10, 40,null,['sword_attack'/*, 'death'*/],"Ninja");
                        break;
                }
            break;
            case "emperor":
                enemy =  new Character(game, combatPoints.getAt(combatId).position.x + 100*j, 100, combats.get(combatId)[j], 500, 100, 50,null,['sword_attack'/*, 'death'*/],"Emperor");
            break;
        }
        game.add.existing(enemy);
        enemies.addAt(enemy,j-1);
    }
    combatPoints.getAt(combatId).kill();
    combatId++;
    gamePhase = 1;
}
    
function attack(){
    if(doingAction == 0){
        iniX = players.getAt(characterTurn).body.x;
        game.add.tween(players.getAt(characterTurn).body).to( { x: enemies.getAt(selectedEnemy).x - 100}, 500, Phaser.Easing.Linear.In, true);
        doingAction = 1;
            
    }else{    
        if(players.getAt(characterTurn).body.x < enemies.getAt(selectedEnemy).x - 100 && actionMovement == 0){
            players.getAt(characterTurn).animations.play('walking_right');
        }else if(players.getAt(characterTurn).body.x == iniX && actionMovement == 1){
            attackFlag = 0;
            attackAnim = 0;
            doingAction = 0;
            actionMovement = 0;
            if(focusShot == 0 && shaolin == 0 && fireball == 0){
                menuCombat.getAt(0).position.x -= 225;
            }else{
                menuCombat.getAt(0).position.x -= 435;
                focusShot = 0;
            }
            menuCombat.getAt(0).position.y = 382;            
            menuAttack.removeAll(true);
            menuAttack.visible = false;
            menuAbility.visible = false;
            menuAbility.removeAll(true);
            if(characterTurn != players.total - 1){
                characterTurn = (characterTurn + 1);
                menuCombat.getAt(5).x -= 75;
            }else{
                if(attackBonus > 0){
                    attackBonus = 0;
                }
                menuCombat.getAt(5).x += 75*(players.total-1);
                menuCombat.getAt(5).visible = false;
                characterTurn = 0;
                teamTurn = 1;
                attackFlag = 1;
                players.callAll('animations.play', 'animations', 'standing_right');
                enemies.callAll('animations.play', 'animations', 'standing_left');
                samurai.body.velocity.x = 0
                archer.body.velocity.x = 0;
            }
            if(enemies.getAt(selectedEnemy).hp <= 0){
                for(i = 0;i < players.total; i++){
                    if(players.getAt(i).lvl < 3){
                        if((players.getAt(i).exp + (20/Math.pow(2,players.getAt(i).lvl - enemies.getAt(selectedEnemy).lvl))) >=  players.getAt(i).maxExp){
                            players.getAt(i).exp = (players.getAt(i).exp + (20/Math.pow(2,players.getAt(i).lvl - enemies.getAt(selectedEnemy).lvl))) % players.getAt(i).maxExp;
                            players.getAt(i).lvl += 1;
                            switch(players.getAt(i).name){
                                case "Oda":
                                    if(players.getAt(i).lvl == 2){
                                        players.getAt(i).maxHp = 100;
                                        players.getAt(i).maxMp = 10;
                                        players.getAt(i).atk = 20; 
                                    }else{
                                        players.getAt(i).maxHp = 65;
                                        players.getAt(i).maxMp = 35;
                                        players.getAt(i).atk = 50; 
                                    }
                                break;
                                case "Matsuda":
                                    if(players.getAt(i).lvl == 2){
                                        players.getAt(i).maxHp = 60;
                                        players.getAt(i).maxMp = 30;
                                        players.getAt(i).atk = 40; 
                                    }else{
                                        players.getAt(i).maxHp = 65;
                                        players.getAt(i).maxMp = 35;
                                        players.getAt(i).atk = 50; 
                                    }
                                break;
                                case "Kiyoko":
                                    players.getAt(i).maxHp = 90;
                                    players.getAt(i).maxMp = 40;
                                    players.getAt(i).atk = 40;
                                break;
                            }
                            players.getAt(i).hp = players.getAt(i).maxHp;
                            players.getAt(i).mp = players.getAt(i).maxMp;
                            players.getAt(i).hpStat.setText( players.getAt(i).hp +'/'+ players.getAt(i).maxHp,true);
                            players.getAt(i).mpStat.setText( players.getAt(i).mp +'/'+ players.getAt(i).maxMp,true);
                            players.getAt(i).lvlStat.setText( 'Lvl. '+ players.getAt(i).lvl,true);
                            players.getAt(i).hpFill.scale.setTo(0.2*players.getAt(i).hp/players.getAt(i).maxHp,0.8);
                            players.getAt(i).mpFill.scale.setTo(0.2*players.getAt(i).mp/players.getAt(i).maxMp,0.8);
                        }else{
                             players.getAt(i).exp += (20/Math.pow(2,players.getAt(i).lvl - enemies.getAt(selectedEnemy).lvl));
                        }
                        players.getAt(i).expStat.setText( players.getAt(i).exp +'/'+ players.getAt(i).maxExp,true);
                        players.getAt(i).expFill.scale.setTo(0.2*players.getAt(i).exp/players.getAt(i).maxExp,0.8);
                    }
                }
                enemies.getAt(selectedEnemy).destroy();
            }
            if(enemies.total == 0){
                music_sound.stop();
                console.log(game.state.current)
                if(game.state.current == 'level1'){
                    music_sound = game.add.sound('first_song');
                }else if(game.state.current == 'level2'){
                    music_sound = game.add.sound('second_song');
                }else if(game.state.current == 'level3'){
                    music_sound = game.add.sound('third_song');
                }
                music_sound.loop = true;
                music_sound.play();
                combatWin = 1;
                menuCombat.getAt(5).visible = true;
            }
        }else if(players.getAt(characterTurn).body.x < enemies.getAt(selectedEnemy).x - 100 && actionMovement == 1){
            players.getAt(characterTurn).animations.play('walking_left');
        }else{
            if(attackAnim == 0){
                players.getAt(characterTurn).animations.play('attacking_right', null,false);
                players.getAt(characterTurn).attack_sound.play()
                attackAnim = 1;
            }else{
                if(players.getAt(characterTurn).animations.getAnimation('attacking_right').isPlaying == false && actionMovement == 0){
                    if(players.getAt(characterTurn).name == "Matsuda" && focusShot == 1){
                        enemies.getAt(selectedEnemy).hp -= ((players.getAt(characterTurn).atk + attackBonus) * 2);
                    }else if(players.getAt(characterTurn).name == "Kiyoko" && shaolin == 1){
                        enemies.getAt(selectedEnemy).hp -= ((players.getAt(characterTurn).atk + attackBonus) * 3);
                    }else if(players.getAt(characterTurn).name == "Satomi" && fireball == 1){
                        enemies.getAt(selectedEnemy).hp -= 50;
                        fireball = 0;
                    }else{
                        enemies.getAt(selectedEnemy).hp -= (players.getAt(characterTurn).atk + attackBonus);
                    }
                    enemies.getAt(selectedEnemy).animations.play('dying_left', null,false);
                    //enemies.getAt(selectedEnemy).death_sound.play();
                    game.add.tween(players.getAt(characterTurn).body).to( { x: iniX }, 500, Phaser.Easing.Linear.In, true);
                    actionMovement = 1;
                }
            }    
        }
    }
}


Character = function (game, x, y, spriteKey, hp, mp, atk, icon, soundKey, name) {

    //  Attributes
    Phaser.Sprite.call(this, game, x, y, spriteKey);
    this.hp = hp;
    this.maxHp = hp;
    this.mp = mp;
    this.maxMp = mp;
    this.atk = atk;
    this.exp = 0;
    this.maxExp = 100;
    this.lvl = 1;
    this.name = name;
    //  UI Info
    if(icon != null){
        switch(x){
            case 75:
                this.lvlStat = game.add.text(610, 340, 'Lvl. '+ this.lvl,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.lvlStat);
                this.icon = game.add.sprite(660, 350, icon);
                menuStats.add(this.icon);
                this.hpTitle = game.add.text(630, 450, 'HP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpTitle);
                this.mpTitle = game.add.text(622, 500, 'MP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpTitle);
                this.expTitle = game.add.text(615, 550, 'EXP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expTitle);
                this.hpBar = game.add.sprite(670, 457, 'healthbar');
                this.hpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.hpBar);
                this.hpFill = game.add.sprite(670,457,'hbar_fill')
                this.hpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.hpFill);
                this.hpStat = game.add.text(742, 456, this.hp +'/'+ this.maxHp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpStat);
                this.mpBar = game.add.sprite(670, 507, 'manabar');
                this.mpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.mpBar);
                this.mpFill = game.add.sprite(670,507,'mbar_fill')
                this.mpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.mpFill);
                this.mpStat = game.add.text(742, 506, this.mp +'/'+ this.maxMp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpStat);
                this.expStat = game.add.text(742, 556, this.exp +'/'+ this.maxExp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expStat);
                this.expBar = game.add.sprite(670, 557, 'expbar');
                this.expBar.scale.setTo(0.2,0.8);
                menuStats.add(this.expBar);
                this.expFill = game.add.sprite(670,557,'exp_fill')
                this.expFill.scale.setTo(0,0.8);
                menuStats.add(this.expFill);
                this.abilities = ["Fireball","Meteor Shower"];
                break;
            case 150:
                this.lvlStat = game.add.text(410, 340, 'Lvl. '+ this.lvl,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.lvlStat);
                this.icon = game.add.sprite(460, 350, icon);
                menuStats.add(this.icon);
                 this.hpTitle = game.add.text(430, 450, 'HP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpTitle);
                this.mpTitle = game.add.text(422, 500, 'MP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpTitle);
                this.expTitle = game.add.text(415, 550, 'EXP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expTitle);
                this.hpBar = game.add.sprite(470, 457, 'healthbar');
                this.hpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.hpBar);
                this.hpFill = game.add.sprite(470,457,'hbar_fill')
                this.hpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.hpFill);
                this.hpStat = game.add.text(542, 456, this.hp +'/'+ this.maxHp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpStat);
                this.mpBar = game.add.sprite(470, 507, 'manabar');
                this.mpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.mpBar);
                this.mpFill = game.add.sprite(470,507,'mbar_fill')
                this.mpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.mpFill);
                this.mpStat = game.add.text(542, 506, this.mp +'/'+ this.maxMp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpStat);
                this.expStat = game.add.text(542, 556, this.exp +'/'+ this.maxExp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expStat);
                this.expBar = game.add.sprite(470, 557, 'expbar');
                this.expBar.scale.setTo(0.2,0.8);
                menuStats.add(this.expBar);
                this.expFill = game.add.sprite(470,557,'exp_fill')
                this.expFill.scale.setTo(0,0.8);
                menuStats.add(this.expFill);
                this.abilities = ["Cure Prayer","Shaolin Rage"];
                break;    
            case 225:
                this.lvlStat = game.add.text(210, 340, 'Lvl. '+ this.lvl,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.lvlStat);
                this.icon = game.add.sprite(260, 350, icon);
                menuStats.add(this.icon);
                this.hpTitle = game.add.text(230, 450, 'HP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpTitle);
                this.mpTitle = game.add.text(222, 500, 'MP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpTitle);
                this.expTitle = game.add.text(215, 550, 'EXP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expTitle);
                this.hpBar = game.add.sprite(270, 457, 'healthbar');
                this.hpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.hpBar);
                this.hpFill = game.add.sprite(270,457,'hbar_fill')
                this.hpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.hpFill);
                this.hpStat = game.add.text(342, 456, this.hp +'/'+ this.maxHp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpStat);
                this.mpBar = game.add.sprite(270, 507, 'manabar');
                this.mpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.mpBar);
                this.mpFill = game.add.sprite(270,507,'mbar_fill')
                this.mpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.mpFill);
                this.mpStat = game.add.text(342, 506, this.mp +'/'+ this.maxMp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpStat);
                this.expStat = game.add.text(342, 556, this.exp +'/'+ this.maxExp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expStat);
                this.expBar = game.add.sprite(270, 557, 'expbar');
                this.expBar.scale.setTo(0.2,0.8);
                menuStats.add(this.expBar);
                this.expFill = game.add.sprite(270,557,'exp_fill')
                this.expFill.scale.setTo(0,0.8);
                menuStats.add(this.expFill);
                this.abilities = ["Focus Shot","Scout"];
                break;
            case 300:
                this.lvlStat = game.add.text(10, 340, 'Lvl. '+ this.lvl,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.lvlStat);
                this.icon = game.add.sprite(60, 350, icon);
                menuStats.add(this.icon);
                this.hpTitle = game.add.text(30, 450, 'HP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpTitle);
                this.mpTitle = game.add.text(22, 500, 'MP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpTitle);
                this.expTitle = game.add.text(15, 550, 'EXP:',{ font: '30px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expTitle);
                this.hpBar = game.add.sprite(70, 457, 'healthbar');
                this.hpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.hpBar);
                this.hpFill = game.add.sprite(70,457,'hbar_fill')
                this.hpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.hpFill);
                this.hpStat = game.add.text(142, 456, this.hp +'/'+ this.maxHp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.hpStat);
                this.mpBar = game.add.sprite(70, 507, 'manabar');
                this.mpBar.scale.setTo(0.2,0.8);
                menuStats.add(this.mpBar);
                this.mpFill = game.add.sprite(70,507,'mbar_fill')
                this.mpFill.scale.setTo(0.2,0.8);
                menuStats.add(this.mpFill);
                this.mpStat = game.add.text(142, 506, this.mp +'/'+ this.maxMp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.mpStat);
                this.expStat = game.add.text(142, 556, this.exp +'/'+ this.maxExp,{ font: '19px RPGSystem', fill: '#ffffff' });
                menuStats.add(this.expStat);
                this.expBar = game.add.sprite(70, 557, 'expbar');
                this.expBar.scale.setTo(0.2,0.8);
                menuStats.add(this.expBar);
                this.expFill = game.add.sprite(70,557,'exp_fill')
                this.expFill.scale.setTo(0,0.8);
                menuStats.add(this.expFill);
                this.abilities = ["Inspiring Shout", "Rally Command"];
                break;
        }
    }
    
    this.scale.setTo(1.5,1.5);
    game.physics.arcade.enable(this);
    this.body.gravity.y = 300;
    this.body.collideWorldBounds = true;
    
    //  Animations
    this.animations.add('walking_left', Phaser.Animation.generateFrameNames('walk', 1, 6), 10, true);
    this.animations.add('walking_right', Phaser.Animation.generateFrameNames('walk', 1, 6, ' (copy)'), 10, true);
    this.animations.add('standing_left', Phaser.Animation.generateFrameNames('standing', 1, 3), 5, true);
    this.animations.add('standing_right', Phaser.Animation.generateFrameNames('standing', 1, 3, ' (copy)'), 5, true);
    this.animations.add('attacking_left', Phaser.Animation.generateFrameNames('attack', 1, 11), 10, true);
    this.animations.add('attacking_right', Phaser.Animation.generateFrameNames('attack', 1, 11, ' (copy)'), 10, true);
    this.animations.add('dying_left', Phaser.Animation.generateFrameNames('dying', 1, 6), 5, true);
    this.animations.add('dying_right', Phaser.Animation.generateFrameNames('dying', 1, 6, ' (copy)'), 5, true);
    
    // Methods
    this.moveLeft = function(){
        this.body.velocity.x = -180;
        this.animations.play('walking_left');
    }
    this.moveRight = function(){
        this.body.velocity.x = 180;
        this.animations.play('walking_right');
    }

    // Sounds
    if (soundKey != null) {
        this.attack_sound = game.add.audio(soundKey[0])
        //this.death_sound = game.add.audio(soundKey[1])
    }
};

Item = function(name,value){
    this.name = name;
    
    if(name.search('HP') >= 0){
        this.type = 'HP';
        this.description = 'Heals '+value+' HP';
    }else if(name.search('MP') >= 0){
        this.type = 'MP';
        this.description = 'Restores '+value+' MP';
    }
    
    this.value = value;
    
    this.amount = 1;
    
}

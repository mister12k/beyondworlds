var level1State = {
	create: function() {
			Character.prototype = Object.create(Phaser.Sprite.prototype);
			Character.prototype.constructor = Character;    

			Item.prototype.constructor = Item;
			    

		    //  We're going to be using physics, so enable the Arcade Physics system
		    //game.physics.startSystem(Phaser.Physics.ARCADE);

		    // Set the world bigger than default so we can move the background
		    game.world.setBounds(0, 0, 2347, 600);
		    
		    //  Background for our game
		    background = game.add.sprite(0, 0, 'level1');    
		    background.scale.setTo(1.5,1.5);

		    //  The platforms group contains the ground
		    platforms = game.add.group();

		    //  We will enable physics for any object that is created in this group
		    platforms.enableBody = true;

		    // Here we create the invisible ground.
		    ground = platforms.create(0, game.world.height - 314);

		    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		    ground.scale.setTo(game.world.width, 2);

		    //  This stops it from falling away when you are on it
		    ground.body.immovable = true;
		    
		    menuStats = game.add.group();

		    // The characters and their settings
		    players = game.add.group();
		    samurai = new Character(game, 300, 180, 'samurai', 80, 10, 15,'samurai_icon', ['sword_attack'/*, 'death'*/],'Oda');
		    game.add.existing(samurai);
		    archer = new Character(game, 225, 215, 'archer', 55, 25, 30,'archer_icon', ['bow_attack'/*, 'death'*/],'Matsuda');
		    game.add.existing(archer);
		    players.addAt(samurai,0);
		    players.addAt(archer,1);
		    
		    // Group to store enemies
		    enemies = game.add.group();
		    
		    // Array to store items (not a Phaser Group as elements in Groups need a Display property[Sprite,TextureAtlas,etc])
		    items = [];   
		    
		    // Create initial potion    
		    items[0] = new Item('HP Potion', 35);
		    
		    // Visual lines on the menu UI
		    game.add.sprite(200, 335, 'line').fixedToCamera = true; 
		    game.add.sprite(400, 335, 'line').fixedToCamera = true;  
		    game.add.sprite(600, 335, 'line').fixedToCamera = true; 
		    
		    menuStats.fixedToCamera = true;
		    
		    // UI for the combat phase menu
		    menuCombat = game.add.group();
		    
		    // Cursor menu positions = 382 - 432 - 482 - 532
		    // Main combat menu options
		    cursor = game.add.sprite(120, 382, 'cursor');
		    attackOption = game.add.text(30, 375, 'Attack',{ font: '30px RPGSystem', fill: '#ffffff' });
		    magicOption = game.add.text(30, 425, 'Magic',{ font: '30px RPGSystem', fill: '#ffffff' });
		    itemOption = game.add.text(30, 475, 'Items',{ font: '30px RPGSystem', fill: '#ffffff' });
		    passOption = game.add.text(30, 525, 'Pass',{ font: '30px RPGSystem', fill: '#ffffff' });
		    cursorTurn = game.add.sprite(players.getAt(0).x+30 , players.getAt(0).y, 'cursorTurn');
		    
		    // Combat menu settings
		    menuCombat.addAt(cursor,0);
		    menuCombat.addAt(attackOption,1);
		    menuCombat.addAt(magicOption,2);
		    menuCombat.addAt(itemOption,3);
		    menuCombat.addAt(passOption,4);
		    menuCombat.addAt(cursorTurn,5);
		    menuCombat.fixedToCamera = true;
		    menuCombat.visible= false;
		    
		    // Groups and settings to control every combat submenu
		    menuAttack = game.add.group();
		    menuAttack.visible = false;
		    menuAbility = game.add.group();
		    menuAbility.visible = false;    
		    menuItem = game.add.group();
		    menuItem.visible = false;
		    menuApply = game.add.group();
		    menuApply.visible = false;
		    menuScout = game.add.group();
		    menuScout.fixedToCamera = true;
		    menuScout.visible = false;
		    
		    
		    // Group of invisible points that start combats
		    combatPoints = game.add.group();
		    combatPoints.create(725,game.world.height - 400,null,null,true,0);
		    combatPoints.create(1225,game.world.height - 400,null,null,true,0);
		    combatPoints.create(1825,game.world.height - 400,null,null,true,0);
		    combatPoints.visible = true;
		    game.physics.arcade.enable(combatPoints);
		    combatPoints.enableBody = true;
            combats = new Map();
            combats.set(0,[1,"beastman"]);
            combats.set(1,[1,"beastman","beastman"]);
            combats.set(2,[1,"beastman","beastman","beastman"]);
		    // Addding menu scroll sound
		    menu_sound = game.add.sound('menu_sound')

		    // Cursor control keys
		    cursors = game.input.keyboard.createCursorKeys();
		    
		    // Callbacks for Down Key
		    cursors.down.onDown.add(
		        function(){ 
		            if(doingAction == 0 && menuStats.visible == false){
		                menu_sound.play()
		                if(gamePhase == 1 && menuCombat.getAt(0).position.y < 532 && menuCombat.getAt(0).position.x < 150){ 
		                    menuCombat.getAt(0).position.y += 50;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y < (382 + 50 * (enemies.total-1)) && menuCombat.getAt(0).position.x > 150 && menuAttack.visible == true){ 
		                    menuCombat.getAt(0).position.y += 50;
		                    menuAttack.getAt(enemies.total).position.x += 100;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y < (382 + 50 * (players.getAt(characterTurn).abilities.length-1)) && menuCombat.getAt(0).position.x > 150 && menuAbility.visible == true && menuAttack.visible == false && menuApply.visible == false){ 
		                    menuCombat.getAt(0).position.y += 50;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y < (382 + 50 * (items.length - 1)) && menuCombat.getAt(0).position.x > 150 && menuItem.visible == true){ 
		                    menuCombat.getAt(0).position.y += 50;
		                }
		                else if(gamePhase == 1 && menuCombat.getAt(0).position.y < (382 + 50 * (players.total - 1)) && menuCombat.getAt(0).position.x > 150 && menuApply.visible == true){ 
		                    menuApply.getAt(players.total).position.x -= 75;
		                    menuCombat.getAt(0).position.y += 50;
		                }
		            }
		        }
		    ,this );
		    
		    cursors.up.onDown.add(
		        function(){
		            if(doingAction == 0 && menuStats.visible == false){
		                menu_sound.play()
		                if(gamePhase == 1 && menuCombat.getAt(0).position.y > 382 && menuCombat.getAt(0).position.x < 150){                     
		                    menuCombat.getAt(0).position.y -= 50;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y > 382 && menuCombat.getAt(0).position.x > 150 && menuAttack.visible == true){
		                    menuCombat.getAt(0).position.y -= 50;
		                    menuAttack.getAt(enemies.total).position.x -= 100;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y > 382 && menuCombat.getAt(0).position.x > 150 && menuAbility.visible == true && menuApply.visible == false){
		                    menuCombat.getAt(0).position.y -= 50;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y > 382 && menuCombat.getAt(0).position.x > 150 && menuItem.visible == true && menuApply.visible == false){
		                    menuCombat.getAt(0).position.y -= 50;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y > 382 && menuCombat.getAt(0).position.x > 150 && menuApply.visible == true){
		                    menuApply.getAt(players.total).position.x += 75;
		                    menuCombat.getAt(0).position.y -= 50;
		                }
		            }
		        }
		    ,this );
		    
		    confirmKey = game.input.keyboard.addKey(confirmKey);
		    confirmKey.onDown.add
		        (function(){ 
		            if(doingAction == 0 && menuStats.visible == false){
		                if(gamePhase == 1 && menuCombat.getAt(0).position.y == 382 && menuCombat.getAt(0).position.x < 150){
		                    attackMenu(230);
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && scoutEnemy == 1 && menuScout.visible == true){
		                    menuScout.visible = false;
		                    menuScout.removeAll(true);
		                    menuAttack.visible = false;
		                    menuAttack.removeAll(true);
		                    menuAbility.visible = false;
		                    menuAbility.removeAll(true);
		                    menuCombat.getAt(0).position.x -= 435
		                    menuCombat.getAt(0).position.y = 382;
		                    if(characterTurn != players.total - 1){
		                        characterTurn = (characterTurn + 1);
		                        menuCombat.getAt(5).x -= 75;
		                    }else{
		                        characterTurn = 0;
		                        teamTurn = 1;
		                        attackFlag = 1;
		                        menuCombat.getAt(5).x += 75*(players.total-1);
		                        menuCombat.getAt(5).visible = false;
		                    }
		                    scoutEnemy = 0;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuAttack.visible == true){
		                    switch (menuCombat.getAt(0).position.y){
		                        case 382:    
		                            selectedEnemy = 0;
		                            break;
		                        case 432:
		                            selectedEnemy = 1;
		                            break;
		                        case 482:    
		                            selectedEnemy = 2;
		                            break;
		                        case 532:    
		                            selectedEnemy = 3;
		                            break;
		                    }
		                    // If not using the Scout ability, initiate attack normally
		                    if(scoutEnemy == 0){
		                        attackFlag = 1;
		                    }else{ // Else, show stats of selectedEnemy
		                        menuScout.visible = true;
		                        enemies.getAt(selectedEnemy).hpTitle = game.add.text(630, 450, 'HP:',{ font: '30px RPGSystem', fill: '#ffffff' });
		                        menuScout.add(enemies.getAt(selectedEnemy).hpTitle);
		                        enemies.getAt(selectedEnemy).mpTitle = game.add.text(622, 500, 'MP:',{ font: '30px RPGSystem', fill: '#ffffff' });
		                        menuScout.add(enemies.getAt(selectedEnemy).mpTitle);
		                        enemies.getAt(selectedEnemy).hpBar = game.add.sprite(670, 457, 'healthbar');
		                        enemies.getAt(selectedEnemy).hpBar.scale.setTo(0.2,0.8);
		                        menuScout.add(enemies.getAt(selectedEnemy).hpBar);
		                        enemies.getAt(selectedEnemy).hpFill = game.add.sprite(670,457,'hbar_fill')
		                        enemies.getAt(selectedEnemy).hpFill.scale.setTo(0.2*enemies.getAt(selectedEnemy).hp/enemies.getAt(selectedEnemy).maxHp,0.8);
		                        menuScout.add(enemies.getAt(selectedEnemy).hpFill);
		                        enemies.getAt(selectedEnemy).hpStat = game.add.text(742, 456, enemies.getAt(selectedEnemy).hp +'/'+ enemies.getAt(selectedEnemy).maxHp,{ font: '19px RPGSystem', fill: '#ffffff' });
		                        menuScout.add(enemies.getAt(selectedEnemy).hpStat);
		                        enemies.getAt(selectedEnemy).mpBar = game.add.sprite(670, 507, 'manabar');
		                        enemies.getAt(selectedEnemy).mpBar.scale.setTo(0.2,0.8);
		                        menuScout.add(enemies.getAt(selectedEnemy).mpBar);
		                        enemies.getAt(selectedEnemy).mpFill = game.add.sprite(670,507,'mbar_fill')
		                        enemies.getAt(selectedEnemy).mpFill.scale.setTo(0.2*enemies.getAt(selectedEnemy).mp/enemies.getAt(selectedEnemy).maxMp,0.8);
		                        menuScout.add(enemies.getAt(selectedEnemy).mpFill);
		                        enemies.getAt(selectedEnemy).mpStat = game.add.text(742, 506, enemies.getAt(selectedEnemy).mp +'/'+ enemies.getAt(selectedEnemy).maxMp,{ font: '19px RPGSystem', fill: '#ffffff' });
		                        menuScout.add(enemies.getAt(selectedEnemy).mpStat);  
		                        menuScout.add(game.add.text(630, 550, "Press Z to continue",{ font: '19px RPGSystem', fill: '#ffffff' }));
		                    }
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y == 432 && menuCombat.getAt(0).position.x < 150){
		                    abilityMenu();
		                    menuAbility.visible = true;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y == 482 && menuCombat.getAt(0).position.x < 150){
		                    if(items.length == 0){}
		                    else{
		                        itemMenu();
		                    }
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuAbility.visible == true && menuApply.visible == false){
		                    switch(players.getAt(characterTurn).name){
		                        case "Oda":
		                            switch(menuCombat.getAt(0).position.y){
		                                case 382:
		                                    if(players.getAt(characterTurn).mp >= 5){
		                                        attackBonus = 10;
		                                        menuAbility.visible = false;
		                                        menuAbility.removeAll(true);
		                                        players.getAt(characterTurn).mp -= 5;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
		                                        menuCombat.getAt(0).position.x -= 260
		                                        menuCombat.getAt(0).position.y = 382;
		                                        if(characterTurn != players.total - 1){
		                                            characterTurn = (characterTurn + 1);
		                                            menuCombat.getAt(5).x -= 75;
		                                        }else{
		                                            characterTurn = 0;
		                                            teamTurn = 1;
		                                            attackFlag = 1;
		                                            menuCombat.getAt(5).x += 75*(players.total-1);
		                                            menuCombat.getAt(5).visible = false;
		                                        }
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                                case 432:
		                                    if(players.getAt(characterTurn).mp >= 5){
		                                        defenseBonus = 10;
		                                        menuAbility.visible = false;
		                                        menuAbility.removeAll(true);
		                                        players.getAt(characterTurn).mp -= 5;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
		                                        menuCombat.getAt(0).position.x -= 260
		                                        menuCombat.getAt(0).position.y = 382;
		                                        if(characterTurn != players.total - 1){
		                                            characterTurn = (characterTurn + 1);
		                                            menuCombat.getAt(5).x -= 75;
		                                        }else{
		                                            characterTurn = 0;
		                                            teamTurn = 1;
		                                            attackFlag = 1;
		                                            menuCombat.getAt(5).x += 75*(players.total-1);
		                                            menuCombat.getAt(5).visible = false;
		                                        }
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                            }
		                            break;
		                        case "Matsuda":
		                            switch(menuCombat.getAt(0).position.y){
		                                case 382:
		                                    if(players.getAt(characterTurn).mp >= 12){
		                                        focusShot = 1;
		                                        attackMenu(430);
		                                         players.getAt(characterTurn).mp -= 12;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                                case 432:
		                                    if(players.getAt(characterTurn).mp >= 5){
		                                        scoutEnemy = 1;
		                                        attackMenu(430);
		                                         players.getAt(characterTurn).mp -= 5;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                            }
		                            break;
                                    case "Kiyoko":
		                            switch(menuCombat.getAt(0).position.y){
		                                case 382:
		                                    if(players.getAt(characterTurn).mp >= 10){
		                                        cure = 1;
                                                menuApply.visible = true;
		                                        applyMenu();
		                                         players.getAt(characterTurn).mp -= 10;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                                case 432:
		                                    if(players.getAt(characterTurn).mp >= 20){
		                                        shaolin = 1;
                                                attackMenu(430);
		                                         players.getAt(characterTurn).mp -= 20;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                            }
		                            break;
                                    case "Satomi":
                                    switch(menuCombat.getAt(0).position.y){
		                                case 382:
		                                    if(players.getAt(characterTurn).mp >= 10){
		                                        fireball = 1;
		                                        attackMenu(430);
		                                         players.getAt(characterTurn).mp -= 10;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                                case 432:
		                                    if(players.getAt(characterTurn).mp >= 30){
                                                players.getAt(characterTurn).animations.play('attacking_right');
		                                        players.getAt(characterTurn).mp -= 30;                                          players.getAt(characterTurn).mpFill.scale.setTo(0.2*players.getAt(characterTurn).mp/players.getAt(characterTurn).maxMp,0.8);
		                                        players.getAt(characterTurn).mpStat.setText( players.getAt(characterTurn).mp +'/'+ players.getAt(characterTurn).maxMp,true);
                                                for(j = 0;j<enemies.total;j++){
                                                    enemies.getAt(j).hp -= 50;
                                                    enemies.getAt(j).animations.play('dying_left');
                                                    if(enemies.getAt(j).hp <= 0){
                                                        for(i = 0;i < players.total; i++){
                                                            if(players.getAt(i).lvl < 3){
                                                                if((players.getAt(i).exp + (20/Math.pow(2,players.getAt(i).lvl - enemies.getAt(j).lvl))) >=  players.getAt(i).maxExp){
                                                                    players.getAt(i).exp = (players.getAt(i).exp + (20/Math.pow(2,players.getAt(i).lvl - enemies.getAt(j).lvl))) % players.getAt(i).maxExp;
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
                                                                }else{
                                                                     players.getAt(i).exp += (20/Math.pow(2,players.getAt(i).lvl - enemies.getAt(j).lvl));
                                                                }
                                                                players.getAt(i).expStat.setText( players.getAt(i).exp +'/'+ players.getAt(i).maxExp,true);
                                                                players.getAt(i).expFill.scale.setTo(0.2*players.getAt(i).exp/players.getAt(i).maxExp,0.8);
                                                            }
                                                        }
                                                        enemies.getAt(j).destroy();
                                                    }
                                                    if(enemies.total == 0){
                                                        combatWin = 1;
                                                        menuCombat.getAt(5).visible = true;
                                                    }
                                                }
                                                menuCombat.getAt(0).position.x -= 260
		                                        menuCombat.getAt(0).position.y = 382;
                                                menuAbility.removeAll(true);
		                                        menuAbility.visible = false;
		                                        if(characterTurn != players.total - 1){
		                                            characterTurn = (characterTurn + 1);
		                                            menuCombat.getAt(5).x -= 75;
		                                        }else{
		                                            characterTurn = 0;
		                                            teamTurn = 1;
		                                            attackFlag = 1;
		                                            menuCombat.getAt(5).x += 75*(players.total-1);
		                                            menuCombat.getAt(5).visible = false;
		                                        }
		                                    }else{
		                                        e = game.add.text(game.camera.x + 420, 375, 'Not enough mana',{ font: '25px RPGSystem', fill: '#ffffff' });
		                                        game.add.tween(e).to( { alpha: 0}, 2000, Phaser.Easing.Linear.In, true);
		                                    }
		                                    break;
		                            }
		                            break;
		                    }
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuItem.visible == true && menuApply.visible == false){
		                    // Case de los items
		                    switch (menuCombat.getAt(0).position.y){
		                        case 382:    
		                            selectedItem = 0;
		                            break;
		                        case 432:
		                            selectedItem = 1;
		                            break;
		                        case 482:    
		                            selectedItem = 2;
		                            break;
		                        case 532:    
		                            selectedItem = 3;
		                            break;
		                    }
		                    applyMenu();
		                    menuApply.visible = true;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuApply.visible == true){
		                    // Case de los items
		                    switch (menuCombat.getAt(0).position.y){
		                        case 382:    
		                            selectedPlayer = 0;
		                            break;
		                        case 432:
		                            selectedPlayer = 1;
		                            break;
		                        case 482:    
		                            selectedPlayer = 2;
		                            break;
		                        case 532:    
		                            selectedPlayer = 3;
		                            break;
		                    }
                            if(cure == 1){
                                if(players.getAt(selectedPlayer).hp + items[selectedItem].value >                               players.getAt(selectedPlayer).maxHp){
		                                    players.getAt(selectedPlayer).hp = players.getAt(selectedPlayer).maxHp;
		                                }else{
		                                    players.getAt(selectedPlayer).hp += 40;
		                                }
		                                players.getAt(selectedPlayer).hpFill.scale.setTo(0.2*players.getAt(selectedPlayer).hp/players.getAt(selectedPlayer).maxHp,0.8);
		                                players.getAt(selectedPlayer).hpStat.setText( players.getAt(selectedPlayer).hp +'/'+ players.getAt(selectedPlayer).maxHp,true);
                            }
		                    if(items[selectedItem].type == 'HP' && cure == 0){
		                                if(players.getAt(selectedPlayer).hp + items[selectedItem].value > players.getAt(selectedPlayer).maxHp){
		                                    players.getAt(selectedPlayer).hp = players.getAt(selectedPlayer).maxHp;
		                                }else{
		                                    players.getAt(selectedPlayer).hp += items[selectedItem].value;
		                                }
		                                players.getAt(selectedPlayer).hpFill.scale.setTo(0.2*players.getAt(selectedPlayer).hp/players.getAt(selectedPlayer).maxHp,0.8);
		                                players.getAt(selectedPlayer).hpStat.setText( players.getAt(selectedPlayer).hp +'/'+ players.getAt(selectedPlayer).maxHp,true);
		                            }else if(items[selectedItem].type == 'MP'){
		                                if(players.getAt(selectedPlayer).mp + items[selectedItem].value > players.getAt(selectedPlayer).maxMp){
		                                    players.getAt(selectedPlayer).mp = players.getAt(selectedPlayer).maxMp;
		                                }else{
		                                    players.getAt(selectedPlayer).mp += items[selectedItem].value;
		                                }
		                                players.getAt(selectedPlayer).mpFill.scale.setTo(0.2*players.getAt(selectedPlayer).mp/players.getAt(selectedPlayer).maxMp,0.8);
		                                players.getAt(selectedPlayer).mpStat.setText( players.getAt(selectedPlayer).mp +'/'+ players.getAt(selectedPlayer).maxMp,true);
		                    }
		                    items[selectedItem].amount -= 1;
		                    if(items[selectedItem].amount <= 0){
		                        items.splice(selectedItem,1);
		                    }
		                    if(items.length == 0){
		                        menuCombat.getAt(3).setStyle({ font: '30px RPGSystem', fill: '#6E6E6E' });
		                    }
                            cure = 0;
		                    menuApply.removeAll(true);
		                    menuApply.visible = false;
		                    menuItem.removeAll(true);
		                    menuItem.visible = false; 
		                    menuCombat.getAt(0).position.x -= 450
		                    menuCombat.getAt(0).position.y = 382;
		                    if(characterTurn != players.total - 1){
		                        characterTurn = (characterTurn + 1);
                                menuCombat.getAt(5).x -= 75;    
		                    }else{
		                        characterTurn = 0;
		                        teamTurn = 1;
		                        attackFlag = 1;
		                        menuCombat.getAt(5).x += 75*(players.total-1);
		                        menuCombat.getAt(5).visible = false;
		                    }
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.y == 532 && menuCombat.getAt(0).position.x < 150){
		                    if(characterTurn != players.total - 1){
		                        characterTurn = (characterTurn + 1);
		                        menuCombat.getAt(0).position.y = 382;
		                        menuCombat.getAt(5).x -= 75;
		                    }else{
		                        characterTurn = 0;
		                        teamTurn = 1;
		                        attackFlag = 1;
		                        menuCombat.getAt(0).position.y = 382;
		                        menuCombat.getAt(5).x += 75*(players.total-1);
		                        menuCombat.getAt(5).visible = false;
		                    }
		                }
		            }
		        }
		        ,this);    
		    
		    backKey = game.input.keyboard.addKey(backKey);
		    backKey.onDown.add
		        (function(){ 
		            if(doingAction == 0 && menuStats.visible == false){
		                if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuApply.visible == true){
		                    menuCombat.getAt(0).position.x -= 205
		                    menuCombat.getAt(0).position.y = 382;
		                    menuApply.removeAll(true);
		                    menuApply.visible = false;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuAbility.visible == true && menuAttack.visible == false){
		                    menuCombat.getAt(0).position.x -= 260
		                    menuCombat.getAt(0).position.y = 382;
		                    menuAbility.removeAll(true);
		                    menuAbility.visible = false;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuAbility.visible == true && menuAttack.visible == true){
		                    menuCombat.getAt(0).position.x -= 175
		                    menuCombat.getAt(0).position.y = 382;
		                    menuAttack.removeAll(true);
		                    menuAttack.visible = false;
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150 && menuItem.visible == true){
		                    menuCombat.getAt(0).position.x -= 245
		                    menuCombat.getAt(0).position.y = 382;
		                    menuItem.removeAll(true);
		                    menuItem.visible = false;   
		                }else if(gamePhase == 1 && menuCombat.getAt(0).position.x > 150){
		                    menuCombat.getAt(0).position.x -= 225
		                    menuCombat.getAt(0).position.y = 382;
		                    menuAttack.removeAll(true);
		                    menuAttack.visible = false;
		                    menuApply.removeAll(true);
		                    menuApply.visible = false;
		                    menuAbility.visible = false;
		                    menuAbility.removeAll(true);
		                    menuItem.removeAll(true);
		                    menuItem.visible = false;   
		                }
		            }
		        }
		        ,this);
		    statsKey = game.input.keyboard.addKey(statsKey);
			    
			function attackMenu(textX){
			    for(i = 375,j = 0; j < enemies.total; j++, i+=50){
			        e = game.add.text(game.camera.x + textX, i, enemies.getAt(j).name,{ font: '30px RPGSystem', fill: '#ffffff' });
			        menuAttack.addAt(e,j);
			    }
			    menuAttack.create(enemies.getAt(0).x + 30,enemies.getAt(0).y - 10,'cursorAttack',false,true,4);
			    if(textX == 230){
			        menuCombat.getAt(0).x += 225;
			    }else{
			        menuCombat.getAt(0).x += 175;
			    }
			    menuCombat.getAt(0).y = 382;
			}
			 
			function abilityMenu(){
			    for(i = 375,j = 0; j < players.getAt(characterTurn).abilities.length; j++, i+=50){
			        e = game.add.text(game.camera.x + 208, i, players.getAt(characterTurn).abilities[j],{ font: '30px RPGSystem', fill: '#ffffff' });
			        menuAbility.addAt(e,j);
			    }
			    menuCombat.getAt(0).x += 260;
			    menuCombat.getAt(0).y = 382;
			}
			    
			function itemMenu(){
			    for(i = 375,j = 0; j < items.length; j++, i+=50){
			        if(items[j].amount == 1){
			            e = game.add.text(game.camera.x + 220, i, items[j].name,{ font: '30px RPGSystem', fill: '#ffffff' });
			        }else{
			            e = game.add.text(game.camera.x + 220, i, items[j].name+' x'+items[j].amount,{ font: '30px RPGSystem', fill: '#ffffff' });
			        }
			        menuItem.addAt(e,j);
			    }
			    menuCombat.getAt(0).x += 245;
			    menuCombat.getAt(0).y = 382;
			}

			function applyMenu(){
			    for(i = 375,j = 0; j < players.total; j++, i+=50){
			        e = game.add.text(game.camera.x + 430, i, players.getAt(j).name,{ font: '30px RPGSystem', fill: '#ffffff' });
			        menuApply.addAt(e,j);
			    }
			    menuApply.create(players.getAt(0).x + 25,players.getAt(0).y - 30,'cursorApply',false,true,4);
			    menuCombat.getAt(0).x += 205;
			    menuCombat.getAt(0).y = 382;
			}
        
	},

	update: function() {
		    //  Collide the player with the platforms and between themselves
		    game.physics.arcade.collide(players, platforms);
		    game.physics.arcade.collide(enemies, platforms);
		    game.physics.arcade.collide(players, players,null,function(){return !gamePhase;});
		    game.physics.arcade.overlap(players, combatPoints, combat,function(){return !gamePhase;},this);
		    
		    
		    if(statsKey.isDown){
		        menuCombat.visible = false;
		        menuAttack.visible = false;
		        menuAbility.visible = false;
		        menuItem.visible = false;
		        menuApply.visible = false;
		        menuStats.visible = true;
		    }
		    
		    if(gamePhase == 0){
		        //  Reset the players velocity so it doesn't move indefenitely
		        samurai.body.velocity.x = 0;
		        archer.body.velocity.x = 0;
		        if(samurai.position.x >= 2200 || archer.position.x >= 2200){
		            /* Demo Legacy code*/
                    //game.world.removeAll();
		            //game.add.text(game.camera.x+75, game.camera.y + 225, 'Demo finished.',{ font: '120px RPGSystem', fill: '#ffffff' });
		            //game.lockRender = true;
                    resetPoint = 1;
                    game.state.start('intro2');
		        }
		        //  Move to the left
		        if (cursors.left.isDown){
		            samurai.moveLeft();
		            archer.moveLeft();        
		            
		            if(archer.position.x < 1772 && samurai.position.x > 300){ //  GameWidth - CanvasWidth + LastCharacterPosition
		                game.camera.x -= 3;
		            }
		            left = 1;
		        }else if (cursors.right.isDown){ //  Move to the right 
		            samurai.moveRight();
		            archer.moveRight(); 
		            
		            if(samurai.position.x > 300 && archer.position.x < 1772){
		                game.camera.x += 3;
		            }
		            left = 0;
		        }else{ //  Stand still
		            if(left == 1){
		                samurai.animations.play('standing_left');
		                archer.animations.play('standing_left');
		            }else{
		                samurai.animations.play('standing_right');
		                archer.animations.play('standing_right');
		            }
		        }

		    }else if(gamePhase == 1){//Combat mode
		        if(statsKey.isUp){
		            menuStats.visible = false;
		            menuCombat.visible = true;
		            
		            if(menuAttack.total > 0){
		                menuAttack.visible = true;
		            }
		            if (menuItem.total > 0){
		                menuItem.visible = true;
		            }
		            
		            if(menuAbility.total > 0){
		                menuAbility.visible = true;
		            }
                    if(menuApply.total > 0){
		                menuApply.visible = true;
		            }
		        }
		        if(combatWin == 1){
		            gamePhase = 0;
		            menuCombat.visible = false;
		            menuStats.visible = true;
		            combatWin = 0;
		            characterTurn = 0;
		            teamTurn = 0;
		            attackFlag = 0;
		            //Generate random drop of HP Potions
		            if(Math.random() < 0.1){
		                for(i = 0; i<items.length;i++){
		                    if(items[i].name == 'HP Potion'){
		                        items[i].amount += 1;
		                        dropFlag = 1;
		                    }
		                }
		                if(dropFlag == 0){
		                    items[i] = new Item('HP Potion', 35);
		                }
		            }
		            dropFlag = 0;
		            //Generate random drop of MP Potions
		            if(Math.random() < 0.1){
		                    for(i = 0; i<items.length;i++){
		                        if(items[i].name == 'MP Potion'){
		                            items[i].amount += 1;
		                            dropFlag = 1;
		                        }
		                    }
		                    if(dropFlag == 0){
		                        items[i] = new Item('MP Potion', 35);
		                    }
		            }
		            dropFlag= 0;
		            if(items.length > 0){
		                menuCombat.getAt(3).setStyle({ font: '30px RPGSystem', fill: '#ffffff' });
		            }
		        }else if(combatWin == -1){
		            game.world.removeAll();
		            game.add.text(game.camera.x, game.camera.y + 150, 'You lose.',{ font: '240px RPGSystem', fill: '#8A0707' });
		            game.lockRender = true;
		        }else if(teamTurn == 0){
		            if(attackFlag == 1){
		                attack();
		            }else{
		                samurai.animations.play('standing_right');
		                archer.animations.play('standing_right');
		                enemies.callAll('animations.play', 'animations', 'standing_left');
		                samurai.body.velocity.x = 0
		                archer.body.velocity.x = 0;
		            }
		        }else{
		            if(attackFlag == 1){
		                AIattack();
		            }else{
		                samurai.animations.play('standing_right');
		                archer.animations.play('standing_right');
		                enemies.callAll('animations.play', 'animations', 'standing_left');
		                samurai.body.velocity.x = 0
		                archer.body.velocity.x = 0;
		            }            
		        }
		    }
	},
    
    shutdown: function() {
        resetPoint = 1;
        this.world.remove(players);
        this.world.remove(platforms);
        this.world.remove(menuStats);
        this.world.remove(menuCombat);
        this.world.remove(menuAbility);
        this.world.remove(menuApply);
        this.world.remove(menuAttack);
        this.world.remove(menuScout);
        this.world.remove(menuItem);
        this.world.remove(combatPoints);
        this.world.remove(enemies);
        combatPoints.callAll("kill");
    
    }
}
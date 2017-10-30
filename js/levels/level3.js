var level3State = {
    /*load: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },*/
    
    create: function() {        
        game.world.setBounds(0, 0, 1956, 600);
        background = game.add.sprite(0, 0, 'level3');    
		background.scale.setTo(1.5,1.5);
        column = game.add.sprite(675, 27, 'column');    
		column.scale.setTo(1.5,1.5);
        // Visual lines on the menu UI
		game.add.sprite(200, 335, 'line').fixedToCamera = true; 
		game.add.sprite(400, 335, 'line').fixedToCamera = true;  
        game.add.sprite(600, 335, 'line').fixedToCamera = true;
        game.add.existing(players);
        game.add.existing(platforms);
        game.add.existing(menuStats);
        game.add.existing(menuAbility);
        game.add.existing(menuApply);
        game.add.existing(menuAttack);
        game.add.existing(menuCombat);
        game.add.existing(menuItem);
        game.add.existing(menuScout);
        game.add.existing(combatPoints);
        game.add.existing(enemies);
        mage = new Character(game, 75, 210, 'mage', 55, 90, 15,'mage_icon', ['bow_attack'/*, 'death'*/],'Satomi');
        mage.lvl = 3;
        mage.lvlStat.setText('Lvl. '+ mage.lvl,true);
        game.add.existing(mage);
        players.addAt(mage,3);
        combatPoints.create(400,game.world.height - 400,null,null,true,0);
        combatPoints.create(1125,game.world.height - 400,null,null,true,0);
        combatPoints.create(1450,game.world.height - 400,null,null,true,0);
        combats.set(6,[3,"soldier","ninja"]);
        combats.set(7,[3,"ninja","soldier","ninja"]);
        combats.set(8,[3,"emperor"]);
    },
    
    update: function(){
            game.world.bringToTop(column);
        if(resetPoint == 1){
                for(i = 0; i<players.total;i++){
                    players.getAt(i).body.position.x = 300 - (75*i);
                }
                if(cursors.left.isDown || cursors.right.isDown){
                    resetPoint = 0;
                }
        }
        
        
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
                monk.body.velocity.x = 0;
                mage.body.velocity.x = 0;
                
		        if(players.getAt(0).position.x > 1830){
		            game.state.start('ending');
		            game.lockRender = true;
		        }
                
                
		        //  Move to the left
		        if (cursors.left.isDown){
		            players.callAll('moveLeft');  
		            
		            if(mage.position.x < 1245 && samurai.position.x > 300){ //  GameWidth - CanvasWidth + LastCharacterPosition
		                game.camera.x -= 3;
		            }
		            left = 1;
		        }else if (cursors.right.isDown){ //  Move to the right 
		            players.callAll('moveRight');
		            
		            if(samurai.position.x > 300 && mage.position.x < 1245){
		                game.camera.x += 3;
		            }
		            left = 0;
		        }else{ //  Stand still
		            if(left == 1){
                        players.callAll('animations.play', 'animations', 'standing_left');
		            }else{
		               players.callAll('animations.play', 'animations', 'standing_right');
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
		                players.callAll('animations.play', 'animations', 'standing_right');
		                enemies.callAll('animations.play', 'animations', 'standing_left');
		                samurai.body.velocity.x = 0
		                archer.body.velocity.x = 0;
                        monk.body.velocity.x = 0;
                        mage.body.velocity.x = 0;
		            }
		        }else{
		            if(attackFlag == 1){
		                AIattack();
		            }else{
		                samurai.animations.play('standing_right');
		                archer.animations.play('standing_right');
		                enemies.callAll('animations.play', 'animations', 'standing_left');
		                samurai.body.velocity.x = 0;
		                archer.body.velocity.x = 0;
                        monk.body.velocity.x = 0;
                        mage.body.velocity.x = 0;
		            }            
		        }
		    }
    },
    
    shutdown: function() {
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
    
};

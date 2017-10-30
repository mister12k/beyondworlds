var level2State = {
    
    create: function() {
        background = game.add.sprite(0, 0, 'level2');    
		background.scale.setTo(1.5,1.5);
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
        monk = new Character(game, 150, 210, 'monk', 80, 25, 30,'monk_icon', ['bow_attack'/*, 'death'*/],'Kiyoko');
        monk.lvl = 2;
        monk.lvlStat.setText('Lvl. '+ monk.lvl,true);
        game.add.existing(monk);
        players.addAt(monk,2);
        combatPoints.create(717,game.world.height - 400,null,null,true,0);
        combatPoints.create(1588,game.world.height - 400,null,null,true,0);
        combatPoints.create(1870,game.world.height - 400,null,null,true,0);
        combats.set(3,[2,"beastman","harpy"]);
        combats.set(4,[2,"beastman","beastman","harpy"]);
        combats.set(5,[2,"harpy","harpy","soldier"]);
        
    },
    
    update: function(){
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
		    game.physics.arcade.overlap(samurai, combatPoints, combat,function(){return game.world.alpha == 1 && !gamePhase;},this);
		    
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
		        if(samurai.position.x >= 2250 || archer.position.x >= 2250 || monk.position.x >= 2250){
		            /* Demo Legacy code*/
                    //game.world.removeAll();
		            //game.add.text(game.camera.x+75, game.camera.y + 225, 'Demo finished.',{ font: '120px RPGSystem', fill: '#ffffff' });
		            //game.lockRender = true;
                    resetPoint = 1;
                    game.state.start('intro3');
		        }
                
                
                if(game.world.alpha == 0 && miniPhase == 0){
                    samurai.body.position.x += 404;
                    archer.body.position.x += 404;
                    monk.body.position.x += 404;
                    game.camera.x += 805;
                    aux = platforms.create(1230 , 0); aux.scale.setTo(1,game.world.height);
                    aux.body.collideWorldbounds = false;
                    aux.body.immovable = true;
                    aux.body.allowGravity= false;
                    aux.body.allowRotation= false;
                    miniPhase = 1;
                    game.add.tween(game.world).to({ alpha:1 }, 400).start();
                }
                if(samurai.position.x >= 1145 && samurai.position.x <= 1254|| archer.position.x >= 1145 && archer.position.x <= 1254 || monk.position.x >= 1145 && monk.position.x <= 1254){
                    if(game.world.alpha == 1){
                        game.add.tween(game.world).to({ alpha:0 }, 400).start();
                    }
                    samurai.body.velocity.x = 0;
                    archer.body.velocity.x = 0;
                    monk.body.velocity.x = 0;
                }
                
                
		        //  Move to the left
		        if (cursors.left.isDown && game.world.alpha == 1){
		            players.callAll('moveLeft');  
		            
		            if(monk.position.x < 604 && samurai.position.x > 300){ //  GameWidth - CanvasWidth + LastCharacterPosition
		                game.camera.x -= 3;
		            }
                    if(miniPhase == 1 && game.camera.x > 1255 && samurai.position.x > 1580 && monk.position.x < 1693){
                        game.camera.x -= 3;
                    }
		            left = 1;
		        }else if (cursors.right.isDown && game.world.alpha == 1){ //  Move to the right 
		            players.callAll('moveRight');
		            
		            if(samurai.position.x > 300 && game.camera.x < 450){
		                game.camera.x += 3;
		            }
                    if(miniPhase == 1 && samurai.position.x > 1580 ){
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

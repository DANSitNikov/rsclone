import * as Phaser from 'phaser';
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};
var enemy;
var enemyOnScene = false;

export class Scene0 extends Phaser.Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private objects: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super(sceneConfig);
	}
	//Add enemy to scene
	public addEnemy() {
		if (this.player.x > 500) {
				if (!enemyOnScene) {
					this.enemyFadeIn();
					enemy.setCollideWorldBounds(true);
				}
				setTimeout(this.enemyStop, 900);
		}	
	}

	//Enemy fade-in
	public enemyFadeIn() {
		enemy.setVelocityX(-300);
	}
	public enemyStop() {
		enemy.setVelocityX(0);
		enemyOnScene = true;
	}

	//Check player and enemy coordinates
	public checkPlayerDied() {
		const approxPlayerX = Math.round(this.player.x / 50);
		const approxEnemyX = Math.round(enemy.x / 50);
		console.log(approxPlayerX + ' = ' + approxEnemyX);
		if (approxEnemyX === approxPlayerX) {
			this.playerDie();
		}
	}

	//Kill the character!
	public playerDie() {
		this.player.anims.play('die', true);
		console.log('died!');
		this.game.input.keyboard.enabled = false;
		this.player.setVelocityX(0);
	}

  public preload ()
  {
    this.load.image('bg', 'assets/world/bg.png');
    this.load.atlas('playerWalk', 'assets/character/walk/playerWalk.png', 'assets/character/walk/playerWalk.json');
    this.load.atlas('playerIdle', 'assets/character/idle/playerIdle.png', 'assets/character/idle/playerIdle.json');
		this.load.atlas('playerJump', 'assets/character/jump/playerJump.png', 'assets/character/jump/playerJump.json');
		this.load.spritesheet('playerDie', 'assets/character/die/playerDie.png', { frameWidth: 198, frameHeight: 198 });
		this.load.spritesheet('enemyWalk', 'assets/enemies/enemy.png', { frameWidth: 500, frameHeight: 500 });
		this.load.image('enemy', 'assets/enemies/walk1.png');
    this.load.image('tree', 'assets/world/tree.png');
    this.load.image('house', 'assets/world/house.png');
    this.load.image('ground', 'assets/world/ground.png');
  }

  public create() {
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bg');

    this.player = this.physics.add.sprite(400, 300, 'playerIdle');

    this.player.setBounce(0.02);
    this.player.setCollideWorldBounds(false);

    this.objects = this.physics.add.staticGroup();

    //this.objects.create(window.innerWidth / 2 + 200, window.innerHeight / 2 + 150, 'house').refreshBody();

    this.objects.create(window.innerWidth / 2, window.innerHeight / 2 + 410 , 'ground')

		this.physics.add.collider(this.player, this.objects);
		
		enemy = this.physics.add.sprite(2000, 500, 'enemyWalk');
		this.physics.add.collider(enemy, this.objects);


    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('playerWalk', {
        start: 2, end: 8,
        prefix: '', suffix: '.png'
      }),
      frameRate: 11,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('playerIdle', {
        start: 1, end: 8,
        prefix: '', suffix: '.png'
      }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('playerJump', {
        start: 1, end: 3,
        prefix: '', suffix: '.png'
      }),
      frameRate: 6,
      repeat: -1
		});

		this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('playerDie', {
        start: 0, end: 8,
      }),
      frameRate: 6,
      repeat: -1
		});
		
		this.anims.create({
			key: 'enemyWalk',
			frames: this.anims.generateFrameNumbers('enemyWalk', {
				start: 0, end: 1 }),
			frameRate: 3,
			repeat: -1
		});

  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const speed = 400;


    if (cursors.left.isDown) {
			this.player.body.setVelocityX(-speed);
      if(this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = true;

    } else if (cursors.right.isDown) {
			this.addEnemy();
      this.player.body.setVelocityX(speed);
      if(this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = false;
			this.checkPlayerDied();
    } else {
      if(this.player.body.touching.down) {
        this.player.anims.play('idle', true);
      }
      this.player.body.setVelocityX(0);

    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.setVelocityY(-speed * 3);
      this.player.anims.play('jump', true);
		}
		
		//Enemy animation
			enemy.anims.play('enemyWalk', true);
	}
}

import * as Phaser from 'phaser';
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'game',
};

export default class Scene0 extends Phaser.Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private objects: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super(sceneConfig);
	}
	//Add enemy to scene
	public addEnemy(): void {
		if (this.player.x > 500) {
			console.log(enemy.x + ' ' + enemy.y);
			console.log(this.player.x + ' ' + this.player.y);
					this.enemy.y = 500;
				setTimeout(this.enemyStop, 900);
		}	
	}

	//Enemy fade-in
	public enemyFadeIn(): void {
		this.enemy.setVelocityX(-300);
	}
	public enemyStop(): void {
		this.enemy.setVelocityX(0);
		this.enemy.setCollideWorldBounds(true);
		this.enemyOnScene = true;
	}

	//Check player and enemy coordinates
	public checkPlayerDied(): void {
		const approxPlayerX = Math.round(this.player.x / 50);
		const approxEnemyX = Math.round(enemy.x / 50);
		if (approxEnemyX === approxPlayerX) {
			this.playerDie();
		}
	}

	// //Kill the character!
	public playerDie(): void {
		this.player.anims.play('die', true);
		console.log('died!');
		this.game.input.keyboard.enabled = false;
		this.player.setVelocityX(0);
	}

  public preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(670, 515, 320, 50);
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
      },
    });
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
      },
    });
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
      },
    });
    assetText.setOrigin(0.5, 0.3);
    loadingText.setOrigin(0.5, 0.5);
    percentText.setOrigin(0.5, -0.5);
    this.load.on('progress', function(value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(680, 525, 300 * value, 30);
      percentText.setText(`${parseInt((value * 100).toString())}%`);
    });
    this.load.on('fileprogress', function(file) {
      assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function() {
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image('bg', 'assets/world/bg.png');
    this.load.atlas(
      'playerWalk',
      'assets/character/walk/playerWalk.png',
      'assets/character/walk/playerWalk.json',
    );
    this.load.atlas(
      'playerIdle',
      'assets/character/idle/playerIdle.png',
      'assets/character/idle/playerIdle.json',
    );
    this.load.atlas(
      'playerJump',
      'assets/character/jump/playerJump.png',
      'assets/character/jump/playerJump.json',
    );
    this.load.image('tree', 'assets/world/tree.png');
    this.load.image('house', 'assets/world/house.png');
		this.load.image('ground', 'assets/world/ground.png');
		this.load.spritesheet(
			'playerDie',
			'assets/character/die/playerDie.png',
			{ frameWidth: 198, frameHeight: 198 }
		);
		this.load.spritesheet(
			'enemyWalk', 
			'assets/enemies/enemy.png', 
			{ frameWidth: 500, frameHeight: 500 }
		);
  }

  public create() {
    const centerX = 840;
    const centerY = 525;
    this.add.image(centerX, centerY, 'bg');

    this.player = this.physics.add.sprite(400, 300, 'playerIdle');

    this.player.setBounce(0.02);
    this.player.setCollideWorldBounds(true);

    this.objects = this.physics.add.staticGroup();

    this.objects.create(centerX + 100, centerY + 150, 'house').refreshBody();

    this.objects.create(centerX, centerY + 410, 'ground');

		this.physics.add.collider(this.player, this.objects);
		
		this.enemy = this.physics.add.sprite(800, 500, 'enemyWalk');
		this.enemy.setCollideWorldBounds(true);
		

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('playerWalk', {
        start: 2,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('playerIdle', {
        start: 1,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('playerJump', {
        start: 1,
        end: 3,
        prefix: '',
        suffix: '.png',
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
      if (this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      if (this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = false;
    } else {
      if (this.player.body.touching.down) {
        this.player.anims.play('idle', true);
      }
      this.player.body.setVelocityX(0);
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.setVelocityY(-speed * 3);
      this.player.anims.play('jump', true);
		}
		
		//Enemy animation
			this.enemy.anims.play('enemyWalk', true);
	}
}

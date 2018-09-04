//Main level, just an extension of the Phaser 3 tutorial
//with additional functions for changing scenes
class LevelOne extends Phaser.Scene {
  constructor() {
    super({
      key: 'LevelOne'
    });
  }
  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    //  A simple background for our game

    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{
        key: 'dude',
        frame: 4
      }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70
      }
    });

    stars.children.iterate(function(child) {

      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.info = 2;


    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    nextLevelText = this.add.text(300, 200, 'Next Level', {
      fontSize: '32px',
      fill: '#000',
    });
    nextLevelText.setAlpha(0);
    nextLevelText.setInteractive();
    nextLevelText.on('pointerover', function() {nextLevelText.setStyle({fontSize: '32px',fill: '#f00'})});
    nextLevelText.on('pointerover', function() {nextLevelText.setStyle({fontSize: '32px',fill: '#000'})});
    nextLevelText.on('pointerdown',goToNextScene,this);

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
  }

  update() {
    //need this to exit out of update() loop when switching levels
    if(levelStopped){
      return;
    }
    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);

      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }
}

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var scoreText;
var nextLevelText;
var levelStopped = false;

function collectStar(player, star) {
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText('Score: ' + score);

  //When the player collects two stars, display the Next Level test
  if (stars.countActive(true) === 10) {
    //  A new batch of stars to collect
    // stars.children.iterate(function(child) {
    //
    //   child.enableBody(true, child.x, 0, true, true);
    //
    // });
    nextLevel(player);
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

  }
}

function hitBomb(player, bomb) {
  var restartText = this.add.text(300, 100, 'Restart level', {
    fontSize: '32px',
    fill: '#000',
  });
  restartText.setInteractive();
  restartText.on('pointerdown',() => {this.scene.restart();score = 0;});

  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

}

function nextLevel(player) {
  nextLevelText.setAlpha(1);
  player.setTint(0xff0000);
}

function goToNextScene() {
  console.log("next scene please");
  levelStopped = true;
  game.scene.stop('LevelOne');
  game.scene.start('LevelTwo');
}

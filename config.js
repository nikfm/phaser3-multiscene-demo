//A standard config file with multiple scenes
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: true
    }
  },
  scene: [StartScreen, LevelOne , LevelTwo]
};

var game = new Phaser.Game(config);

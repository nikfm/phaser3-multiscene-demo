class StartScreen extends Phaser.Scene {
  constructor() {
    super({
      key: 'StartScreen'
    });
  }
  preload() {
    console.log("Start screen");

  }
  create() {
    var testText = this.add.text(100,100,'Click to start the game.',{
      fontSize: '32px',
      fill: '#FFF'
    });
    testText.setInteractive()
    testText.on('pointerdown',startGameplay)

  }
  update() {

  }
}
function startGameplay() {
    game.scene.stop('StartScreen');
    game.scene.start('LevelOne');
}

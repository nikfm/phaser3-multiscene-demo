class LevelTwo extends Phaser.Scene {
  constructor() {
    super({
      key: 'LevelTwo'
    });
  }
  preload() {
    console.log("in level 2");

  }
  create() {
    var testText = this.add.text(100,100,'This is Level 2',{
      fontSize: '32px',
      fill: '#FFF'
    });

  }
  update() {

  }
}

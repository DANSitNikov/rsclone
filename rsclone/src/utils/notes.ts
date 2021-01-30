function createNote(noteX: number, noteY: number,
  dialogueSpriteX: number,
  dialogueSpriteY: number,
  textX: number, textY: number, text: string): void {
  this.note = this.add.sprite(noteX, noteY, 'note').setScale(0.8);
  this.dialogue = this.add.sprite(dialogueSpriteX, dialogueSpriteY, 'dialogueNote').setDepth(999);
  this.dialogue.visible = false;
  this.text = this.add
    .text(textX, textY, text, {
      font: '22px monospace',
    })
    .setDepth(1000);
  this.text.visible = false;
	this.clickable = true;
	console.log(typeof this);
	console.log(typeof text);
}

function showNote(action) {
  if (
    Phaser.Geom.Intersects.RectangleToRectangle(
      this.note.getBounds(),
      this.player.player.getBounds(),
    )
  ) {
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.note.getBounds(),
        this.player.player.getBounds(),
      )
    ) {
      this.note.setTexture('noteActive');
      if (action && this.clickable) {
        this.sound.play(`note${1 + +this.dialogue.visible}`);
        this.dialogue.visible = !this.dialogue.visible;
        this.text.visible = !this.text.visible;
        this.clickable = false;
        setTimeout(() => {
          this.clickable = true;
        }, 200);
      }
    } else {
      this.note.setTexture('note');
      this.dialogue.visible = false;
      this.text.visible = false;
    }
  }
}

export { createNote, showNote };

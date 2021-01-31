function createNote(noteX: number, noteY: number,
  textX: number, textY: number, text: string): void {
  this.notes.push(this.add.sprite(noteX, noteY, 'note').setScale(0.8));

  this.texts.push(this.add
    .text(textX, textY, text, {
      font: '22px monospace',
    })
    .setDepth(1000).setVisible(false));

  this.clickable = true;
}

function showNote(action: boolean): void {
  const intersects = Phaser.Geom.Intersects.RectangleToRectangle;

  this.notes.forEach((note, index) => {
    if (intersects(note.getBounds(), this.player.player.getBounds())) {
      note.setTexture('noteActive');
      if (action && this.clickable) {
        this.sound.play(`note${1 + +this.dialogue.visible}`);
        this.texts[index].visible = !this.texts[index].visible;
        this.dialogue.setVisible(!this.dialogue.visible);
        this.clickable = false;
        setTimeout(() => {
          this.clickable = true;
        }, 200);
      }
    } else {
      note.setTexture('note');
      this.dialogue.setVisible(false);
      this.texts[index].visible = false;
    }
  });
  if (this.texts.find((text) => text.visible)) this.dialogue.visible = true;
}

export { createNote, showNote };

function createNote(context,
  noteX, noteY,
  dialogueSpriteX,
  dialogueSpriteY,
  textX, textY, text) {
  context.note = context.add.sprite(noteX, noteY, 'note').setScale(0.8);
  context.dialogue = context.add.sprite(dialogueSpriteX, dialogueSpriteY, 'dialogueNote').setDepth(999);
  context.dialogue.visible = false;
  context.text = context.add
    .text(textX, textY, text, {
      font: '22px monospace',
    })
    .setDepth(1000);
  context.text.visible = false;
  context.clickable = true;
}

function showNote(context, action) {
  if (
    Phaser.Geom.Intersects.RectangleToRectangle(
      context.note.getBounds(),
      context.player.player.getBounds(),
    )
  ) {
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        context.note.getBounds(),
        context.player.player.getBounds(),
      )
    ) {
      context.note.setTexture('noteActive');
      if (action && context.clickable) {
        context.sound.play(`note${1 + +context.dialogue.visible}`);
        context.dialogue.visible = !context.dialogue.visible;
        context.text.visible = !context.text.visible;
        context.clickable = false;
        setTimeout(() => {
          context.clickable = true;
        }, 200);
      }
    } else {
      context.note.setTexture('note');
      context.dialogue.visible = false;
      context.text.visible = false;
    }
  }
}

export { createNote, showNote };

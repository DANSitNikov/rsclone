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

export { createNote };

import { disableBtnActive, setBtnActive } from './utilitites';

export default function createBtnHandlers(): void {
  this.list.forEach((item, index) => {
    if ('label' in item) {
      if (item.handler) {
        item.label.on('pointerup', item.handler, this);
      }
      item.label.on(
        'pointerover',
        () => {
          disableBtnActive(this.list[this.tabIndex].label);
          this.tabIndex = index;
          setBtnActive(item.label);
        },
        this,
      );
      item.label.on('pointerout', () => disableBtnActive(item.label), this);

      if (item.handler) {
        item.btn.on('pointerup', item.handler, this);
      }
      item.btn.on(
        'pointerover',
        () => {
          disableBtnActive(this.list[this.tabIndex].label);
          this.tabIndex = index;
          setBtnActive(item.label);
        },
        this,
      );
      item.btn.on('pointerout', () => disableBtnActive(item.label), this);
    } else if ('btn' in item) {
      if (item.handler) {
        item.btn.on('pointerup', item.handler, this);
      }
      item.btn.on(
        'pointerover',
        () => {
          disableBtnActive(this.list[this.tabIndex].btn);
          this.tabIndex = index;
          setBtnActive(item.btn);
        },
        this,
      );
      item.btn.on('pointerout', () => disableBtnActive(item.btn), this);
    }
  });
}

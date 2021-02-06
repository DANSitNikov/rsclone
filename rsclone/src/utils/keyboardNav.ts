import { keyboardControl, setBtnActive } from './utilitites';

function sliderArrowNav(e) {
  const currentValue = this.volume.getValue();
  if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
  if (this.tabIndex !== this.list.map((item) => item.label).indexOf(this.soundLabel)) return;
  const n = e.key === 'ArrowLeft' ? -0.1 : 0.1;
  this.volume.setValue(Math.round((currentValue + n) * 10) / 10);
}

export default function keuboardNavigation(escBtn?: boolean, slider?: boolean): void {
  if (escBtn) {
    this.input.keyboard.on(
      'keydown-ESC',
      () => {
        if (!this.pause) {
          if (this.scene.key === 'PauseMenu' || this.scene.key === 'GameControl') {
            this.scene.stop();
            this.scene.resume(this.lastScene);
          } else {
            this.scene.start('Menu');
          }
        } else {
          this.scene.start('PauseMenu', { key: this.lastScene, player: this.player });
        }
      },
      this,
    );
  }

  this.input.keyboard.on(
    'keydown-ENTER',
    () => {
      if (typeof this.list[this.tabIndex].handler === 'function') {
        this.list[this.tabIndex].handler();
      }
    },
    this,
  );

  this.input.keyboard.on(
    'keydown',
    (e: KeyboardEvent) => {
      this.tabIndex = keyboardControl(
        e,
        this.tabIndex,
        this.list.map((item) => item.label || item.btn),
      );
      if (slider) {
        sliderArrowNav.call(this, e);
      }
    },
    this,
  );
  setBtnActive(this.list[this.tabIndex].label || this.list[this.tabIndex].btn);
}

import en from './languages/en';
import ru from './languages/ru';
import chTr from './languages/chTr';

export type List = {
  label?;
  name?: string;
  handler?: () => void;
  btn?: Phaser.GameObjects.Text;
  style?;
}[];

export const setLang = (lang: string): Record<string, string> => {
  let language = {};
  switch (lang) {
    case 'ru':
      language = ru;
      break;
    case 'ch_tr':
      language = chTr;
      break;
    default:
      language = en;
  }

  return language;
};

export const switchLang = (lang: string): Record<string, string> => {
  const listOfLangs = ['en', 'ru', 'ch_tr'];
  const currentLangIndex = listOfLangs.indexOf(lang);
  const nextLangIndex = currentLangIndex !== -1 ? currentLangIndex + 1 : 1;
  const nextLang = listOfLangs[nextLangIndex % listOfLangs.length];

  localStorage.setItem('lang', nextLang);

  return setLang(nextLang);
};

export function setBtnActive(btn: Phaser.GameObjects.Text): void {
  if ('setTint' in btn) {
    btn.setTint(0xffa300);
  }
}

export function disableBtnActive(btn: Phaser.GameObjects.Text): void {
  if ('setTint' in btn) {
    btn.clearTint();
  }
}

export const changeCurretIndex = (listLength: number, index: number, direction: number): number => (
  index + direction > -1 ? (index + direction) % listLength : listLength - 1
);

export function keyboardControl(
  e: KeyboardEvent,
  tab: number,
  btnList: Phaser.GameObjects.Text[],
): number {
  let tabIndex = tab;
  const btnListLength = btnList.length;
  disableBtnActive(btnList[tabIndex]);
  if (e.key === 'ArrowDown') {
    tabIndex = changeCurretIndex(btnListLength, tabIndex, 1);
  } else if (e.key === 'ArrowUp') {
    tabIndex = changeCurretIndex(btnListLength, tabIndex, -1);
  }
  setBtnActive(btnList[tabIndex]);
  return tabIndex;
}

export function createList(): void {
  this.list.forEach((item, index) => {
    this.list[index].btn = this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 80 + index * 80,
        item.name,
        this.btn,
      )
      .setOrigin(0.5)
      .setInteractive();
  });
}

export function createBtnHandlers(): void {
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

function sliderArrowNav(e) {
  const currentValue = this.volume.getValue();
  if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
  if (this.tabIndex !== this.list.map((item) => item.label).indexOf(this.soundLabel)) return;
  const n = e.key === 'ArrowLeft' ? -0.1 : 0.1;
  this.volume.setValue(Math.round((currentValue + n) * 10) / 10);
}

export function keuboardNavigation(escBtn?: boolean, slider?: boolean): void {
  if (escBtn) {
    this.input.keyboard.on(
      'keydown-ESC',
      () => {
        if (!this.pause) {
          this.scene.start('Menu');
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

export function backToMenu(): void {
  if (!this.pause) {
    this.scene.start('Menu');
  } else {
    this.scene.start('PauseMenu', { key: this.lastScene, player: this.player });
  }
}

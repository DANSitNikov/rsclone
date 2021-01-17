import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive, setStatistic } from './utilitites';

export default class Statistic extends Phaser.Scene {
    lang: Record<string, string>;

    backButton: Phaser.GameObjects.Text;

    emptyStatistic: string;

    openLink: (link: string) => void;

    creditsList: Phaser.GameObjects.Text[];

    credits: (string | (string | boolean)[])[];

    statistic: (Record<string, string>)[];

    constructor() {
        super({ key: 'Statistic', active: false });

        this.openLink = (link: string): void => {
            const s = window.open(link, '_blank');

            if (s && s.focus) {
                s.focus();
            } else if (!s) {
                window.location.href = link;
            }
        };
    }

    create(): void {
        this.lang = this.registry.get('lang');
        const style = { font: '40px monospace' };
        this.add
            .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, this.lang.statistic, style)
            .setOrigin(0.5);

        this.backButton = this.add
            .text(this.game.renderer.width / 2, this.game.renderer.height - 100, this.lang.backToMenu, style)
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' });

        this.emptyStatistic = 'There is no statistic yet...';
        if (JSON.parse(localStorage.getItem('statistic')).length === 0) {
            this.add.text(this.game.renderer.width / 2, 400, this.emptyStatistic, style)
                .setOrigin(0.5)
                .setInteractive();
        } else {
           const title = ['Top', 'Time', 'Deaths'];
           title.forEach((el, i) => this.add.text(this.game.renderer.width / 2 + i * 160 - 200, 200, el, style));
            JSON.parse(localStorage.getItem('statistic')).forEach((el, i) => {
                el.forEach((param, j) => {
                    this.add.text(this.game.renderer.width / 2 + j * 160 - 200, 300 + i * 100, param, style);
                });
            });
        }

        this.backButton.on('pointerup', this.backToMenu, this);
        this.backButton.on('pointerover', () => setBtnActive(this.backButton), this);
        this.backButton.on('pointerout', () => disableBtnActive(this.backButton), this);
        this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
    }

    backToMenu(): void {
      this.scene.start('Menu');
    }
}

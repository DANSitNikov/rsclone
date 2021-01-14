import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive } from './utilitites';

export default class Statistic extends Phaser.Scene {
    lang: Record<string, string>;

    backButton: Phaser.GameObjects.Text;

    alisa: Phaser.GameObjects.Text;

    saidazizkhon: Phaser.GameObjects.Text;

    daniil: Phaser.GameObjects.Text;

    gregory: Phaser.GameObjects.Text;

    openLink: (link: string) => void;

    creditsList: Phaser.GameObjects.Text[];

    credits: (string | (string | boolean)[])[];

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
        this.add
            .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, this.lang.statistic, {
                font: '42px monospace',
            })
            .setOrigin(0.5);

        this.backButton = this.add
            .text(this.game.renderer.width / 2, this.game.renderer.height - 100, this.lang.backToMenu, {
                font: '32px monospace',
            })
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' });

        this.backButton.on('pointerup', this.backToMenu, this);
        this.backButton.on('pointerover', () => setBtnActive(this.backButton), this);
        this.backButton.on('pointerout', () => disableBtnActive(this.backButton), this);
        this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
    }

    backToMenu(): void {
      this.scene.start('Menu');
    }
}

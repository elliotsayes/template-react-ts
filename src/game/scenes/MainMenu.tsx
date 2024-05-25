import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import ReactDOM from 'react-dom/client';
import { TestButtons } from '../../components/TestButton';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        const buttonSize = {
            w: 200,
            h: 80,
        }
        const memElement = document.createElement("div");
        ReactDOM.createRoot(memElement).render(
            <TestButtons
                elementSize={buttonSize} 
                onClickStatic={() => this._goto('TmjStatic')}
                onClickDynamic={() => this._goto(
                    'TmjDynamic',
                    {
                        tilesheetUrl: 'https://qmjvgoukowg2tcbfbtal5veb4cuaivoypz4rropk22jibalnkzjq.arweave.net/gxNTOop1jamIJQzAvtSB4KgEVdh-eRi56taSgIFtVlM',
                        tilemapUrl: 'https://knsoiwt37jsosdfxyhod23ogiwjngitnjmka53ltv3zpnxoouqtq.arweave.net/U2TkWnv6ZOkMt8HcPW3GRZLTIm1LFA7tc67y9t3OpCc',
                    },
                )}
            />
        );

        this.add.dom(
            512 - buttonSize.w / 2,
            500,
            memElement,
        )

        EventBus.emit('current-scene-ready', this);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _goto(scene: string, params?: any) {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start(scene, params);
    }
    
    changeScene ()
    {
        this._goto('TmjStatic');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}

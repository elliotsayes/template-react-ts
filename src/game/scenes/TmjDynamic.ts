import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

type TmjDynamicConfig = {
    tilesheetUrl: string;
    tilemapUrl: string;
}

export class TmjDynamic extends Scene
{
    tilesheetUrl: string;
    tilemapUrl: string;

    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    tilemap: Phaser.Tilemaps.Tilemap;
    tmjDynamicText : Phaser.GameObjects.Text;
    tmjDynamicAssetsText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('TmjDynamic');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init(config: TmjDynamicConfig)
    {
        this.tilesheetUrl = config.tilesheetUrl;
        this.tilemapUrl = config.tilemapUrl;
    }

    preload ()
    {
        this.load.image(`Primary-${this.tilesheetUrl}`, this.tilesheetUrl);
        this.load.tilemapTiledJSON(`Tilemap-${this.tilemapUrl}`, this.tilemapUrl)
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        // this.background = this.add.image(512, 384, 'Primary');
        
        this.tilemap = this.make.tilemap({
            key: `Tilemap-${this.tilemapUrl}`,
        })
        const tileset = this.tilemap.addTilesetImage(
            'Primary', // tileset name
            `Primary-${this.tilesheetUrl}`, // key of the tileset image
        )!

        // const layer0 = this.tilemap.createLayer("Background0", tileset, 0, 0)
        // const layer1 = this.tilemap.createLayer("Background1", tileset, 0, 0)
        // console.log(this.tilemap, layer0, layer1)

        this.tilemap.layers.filter((layer) => layer.name.startsWith('BG_')).forEach((layer) => {
            this.tilemap.createLayer(layer.name, tileset, 0, 0)
        })

        this.tilemap.layers.filter((layer) => layer.name.startsWith('FG_')).forEach((layer) => {
            this.tilemap.createLayer(layer.name, tileset, 0, 0)
        })

        const cameraOffset = {
            x: this.tilemap.widthInPixels/2, 
            y: this.tilemap.heightInPixels/2,
        }

        this.camera.centerOn(cameraOffset.x, cameraOffset.y)

        this.tmjDynamicText = this.add.text(cameraOffset.x, cameraOffset.y - 384, 'TmjDynamic', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 0).setDepth(100);

        this.tmjDynamicAssetsText = this.add.text(
            cameraOffset.x, cameraOffset.y - 384 + 64,
            `tilesheetUrl: ${this.tilesheetUrl}\ntilemapUrl: ${this.tilemapUrl}`, 
        {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 0).setDepth(100);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
} 

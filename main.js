import {Application, Graphics, Assets, Sprite} from "pixi.js";

(async() => {
    const app = new Application();
    await app.init({
        resizeTo: window,
        backgroundAlpha: 0.5
    });
    app.canvas.style.position = 'absolute'
    document.body.appendChild(app.canvas)

    const rectangle = new Graphics()
        .rect(200, 200, 200, 180)
        .fill({
            color: 0xffea00,
            alpha: 0.5
        })
        .stroke({
            width: 8,
            color: 0x00ff00
        });
    app.stage.addChild(rectangle);
    
    const texture = await Assets.load('spritesheet-data/spritesheet-images/backside.png');
    const sprite = new Sprite(texture);
    texture.source.scaleMode = 'nearest';
    sprite.scale.set(10);
    app.stage.addChild(sprite);
})();
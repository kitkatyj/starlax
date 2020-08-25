/*! starlax.js - Copyright 2020 Kat YJ */

interface Config {
    targetCanvas? : string;
    qtyMultiplier? : number;
    shape? : string;
    image? : string | HTMLImageElement;
    fadeIn? : boolean;
    fadeInDuration? : number;
    twinkle? : boolean;
    twinkleDuration? : number;
    backgroundColor? : string;
    color? : string | string[];
    size? : number;
    sizeRandom? : number;
    zPos? : number;
    zPosRandom? : number;
    zPosOpacity? : boolean;
    invertScroll? : boolean;
}

class Starlax {
    readonly ticksPerSecond : number = 60;

    resizeTimer : any;
    timer : number = 0;
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    starfield = [];

    starImg : HTMLImageElement;

    config : Config = {};

    constructor(config?:Config){

        var _s = this;
        var target = document.querySelector(config?.targetCanvas);

        this.config = {
            qtyMultiplier :     config?.qtyMultiplier || 1,
            shape :             config?.shape || 'circle',
            image :             config.image,
            fadeIn :            (config?.fadeIn == undefined) ? true : config?.fadeIn,
            fadeInDuration :    config?.fadeInDuration || 1,
            twinkle :           (config?.twinkle == undefined) ? true : config?.twinkle,
            twinkleDuration :   config?.twinkleDuration || 2,
            backgroundColor :   config?.backgroundColor,
            color :             config?.color || '#000',
            size :              config?.size || 5,
            sizeRandom :        (0 <= config?.sizeRandom && config?.sizeRandom <= 1) ? config?.sizeRandom : 0.5,
            zPos :              (0 <= config?.sizeRandom) ? config?.zPos : 6,
            zPosRandom :        (0 <= config?.zPosRandom && config?.zPosRandom <= 1) ? config?.zPosRandom : 0.8,
            zPosOpacity :       (config?.zPosOpacity == undefined) ? true : config?.zPosOpacity,
            invertScroll :      (config?.invertScroll == undefined) ? false : config?.invertScroll
        }

        if(target){
            // tries to find a specified canvas element
            if(target instanceof HTMLCanvasElement){
                this.canvas = document.querySelector(config.targetCanvas);
                this.setStarfield();
            } else {
                throw new TypeError("Selected element '"+config.targetCanvas+"' is not a canvas.");
            }
        } else {
            // creates a default in the body element that will stretch to the full height and width of the window
            this.canvas = document.createElement('canvas');
            document.getElementsByTagName('body')[0].appendChild(this.canvas);

            this.canvas.style.position = "fixed";
            this.canvas.style.top = "0";
            this.canvas.style.left = "0";
            this.canvas.style.zIndex = "-1";

            this.sizeReset();

            addEventListener("resize",function(){
                clearTimeout(_s.resizeTimer);
                _s.resizeTimer = setTimeout(function(){_s.sizeReset();},250);
            });
        }

        this.ctx = this.canvas.getContext('2d');

        //console.log(this.config);

        this.draw();
    }

    private sizeReset(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.setStarfield();
    }

    private setStarfield(){
        this.starfield = [];
        var qty = this.config.qtyMultiplier * Math.floor(this.canvas.width/75 * this.canvas.height/75);

        if(typeof this.config.image == "string"){
            this.starImg = new Image();
            this.starImg.src = this.config.image;
        } else if (this.config.image instanceof HTMLImageElement) {
            this.starImg = this.config.image;
        }

        for(let i = 0; i < qty; i++){
            this.starfield.push({
                "twinkleOffset":Math.random() * 2 * Math.PI,
                "posX":Math.round(Math.random() * this.canvas.width),
                "posY":Math.round(Math.random() * this.canvas.height),
                "size":Math.floor(this.config.size - this.config.size * this.config.sizeRandom + Math.random() * this.config.size * this.config.sizeRandom),
                "zIndex":(this.config.zPos - this.config.zPos * this.config.zPosRandom + Math.random() * this.config.zPos * this.config.zPosRandom) + 1,
                "color":(Array.isArray(this.config.color)) ? this.config.color[ Math.floor(Math.random() * this.config.color.length) ] : this.config.color
            });
        }
        // console.log(this.starfield);
    }

    private draw(){
        var _s = this;
        var _c = this.ctx;

        _c.clearRect(0,0,this.canvas.width,this.canvas.height);

        if(this.config.backgroundColor){
            _c.fillStyle = this.config.backgroundColor;
            _c.fillRect(0,0,this.canvas.width,this.canvas.height);
        }

        this.starfield.forEach(function(star){
            _c.beginPath();

            var fadeOpacity = 1;
            var twinkleOpacity = 1;
            var zPosOpacity = 1;

            if(_s.config.fadeIn && _s.timer < (_s.ticksPerSecond * _s.config.fadeInDuration)) fadeOpacity = _s.timer / (_s.ticksPerSecond * _s.config.fadeInDuration);
            if(_s.config.twinkle) twinkleOpacity = 0.5 + 0.5 * Math.sin((_s.timer / _s.ticksPerSecond / _s.config.twinkleDuration) * 2*Math.PI + star.twinkleOffset);
            if(_s.config.zPosOpacity) zPosOpacity = ((12 - star.zIndex)/12)*0.6;

            _c.globalAlpha = fadeOpacity * twinkleOpacity * zPosOpacity;

            var scrollPos = _s.mod((_s.config.invertScroll) ? (star.posY + window.pageYOffset/star.zIndex) : (star.posY - window.pageYOffset/star.zIndex),_s.canvas.height);

            if(_s.starImg){
                _c.drawImage(
                    _s.starImg, 
                    star.posX - star.size/2,
                    scrollPos - star.size/2,
                    star.size,star.size
                );
            } else {
                switch(_s.config.shape){
                    case "square":
                        _c.rect(
                            star.posX,
                            scrollPos,
                            star.size*2,star.size*2
                        );
                        break;
                    default:
                        _c.arc(
                            star.posX,
                            scrollPos,
                            star.size,
                            0,2*Math.PI
                        );
                }

                _c.fillStyle = star.color;
                _c.fill();
            }

            _c.globalAlpha = 1;
        });
    
        this.timer++;

        requestAnimationFrame(function(){ _s.draw(); });
    }

    private mod(n, m) {
        return ((n % m) + m) % m;
    }
}
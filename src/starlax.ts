/*! starlax.js - Copyright 2020 Kat YJ */

interface Config {
    targetCanvas? : string;
    backgroundColor? : string;
    color? : string;
    size? : number;
    sizeRandom? : number;
    zPos? : number;
    zPosRandom? : number;
}

class Starlax {
    resizeTimer : any;
    timer : number = 0;
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    starfield = [];

    config : Config = {};

    constructor(config?:Config){

        var _s = this;
        var target = document.querySelector(config?.targetCanvas);

        this.config = {
            backgroundColor : config?.backgroundColor || '#000033',
            color : config?.color || '#ffffff',
            size : config?.size || 5,
            sizeRandom : (0 <= config?.sizeRandom && config?.sizeRandom <= 1) ? config?.sizeRandom : 0.5,
            zPos : (0 <= config?.sizeRandom) ? config?.zPos : 6,
            zPosRandom : (0 <= config?.zPosRandom && config?.zPosRandom <= 1) ? config?.zPosRandom : 0.8
        }

        console.log(this.config);

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

        this.draw();
    }

    private sizeReset(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.setStarfield();
    }

    private setStarfield(){
        this.starfield = [];
        var qty = Math.floor(this.canvas.width/75 * this.canvas.height/75);

        for(let i = 0; i < qty; i++){
    
            this.starfield.push({
                "twinkleOffset":Math.random() * 2 * Math.PI,
                "posX":Math.round(Math.random() * this.canvas.width),
                "posY":Math.round(Math.random() * this.canvas.height),
                "size":Math.floor(this.config.size - this.config.size * this.config.sizeRandom + Math.random() * this.config.size * this.config.sizeRandom),
                "zIndex":(this.config.zPos - this.config.zPos * this.config.zPosRandom + Math.random() * this.config.zPos * this.config.zPosRandom) + 1
                // "zIndex":2+Math.floor(10*Math.random())
            });
        }
        // console.log(this.starfield);
    }

    private draw(){
        var _s = this;
        var _c = this.ctx;

        _c.clearRect(0,0,this.canvas.width,this.canvas.height);
        _c.fillStyle = this.config.backgroundColor;
        _c.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.starfield.forEach(function(star){
            _c.beginPath();
            _c.arc(
                star.posX,
                _s.mod((star.posY - window.pageYOffset/star.zIndex),_s.canvas.height),
                star.size,
                0,2*Math.PI
            );
            _c.globalAlpha = (0.5 + 0.5 * Math.sin((_s.timer + star.twinkleOffset*20)/20)) * ((12 - star.zIndex)/12)*0.6;
            _c.fillStyle = _s.config.color;
            _c.fill();

            _s.ctx.globalAlpha = 1;
        });
    
        this.timer++;

        requestAnimationFrame(function(){ _s.draw(); });
    }

    private mod(n, m) {
        return ((n % m) + m) % m;
    }
}
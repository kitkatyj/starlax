/*! starlax.js - Copyright 2020 Kat YJ */
var Starlax = (function () {
    function Starlax(config) {
        var _a, _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _t, _u, _v, _w;
        this.ticksPerSecond = 60;
        this.timer = 0;
        this.starfield = [];
        this.config = {};
        var _s = this;
        var target = document.querySelector((_a = config) === null || _a === void 0 ? void 0 : _a.targetCanvas);
        this.config = {
            shape: ((_b = config) === null || _b === void 0 ? void 0 : _b.shape) || 'circle',
            fadeIn: (((_d = config) === null || _d === void 0 ? void 0 : _d.fadeIn) == undefined) ? true : (_e = config) === null || _e === void 0 ? void 0 : _e.fadeIn,
            fadeInDuration: ((_f = config) === null || _f === void 0 ? void 0 : _f.fadeInDuration) || 1,
            twinkle: (((_g = config) === null || _g === void 0 ? void 0 : _g.twinkle) == undefined) ? true : (_h = config) === null || _h === void 0 ? void 0 : _h.twinkle,
            twinkleDuration: ((_j = config) === null || _j === void 0 ? void 0 : _j.twinkleDuration) || 1,
            backgroundColor: (_k = config) === null || _k === void 0 ? void 0 : _k.backgroundColor,
            color: ((_l = config) === null || _l === void 0 ? void 0 : _l.color) || '#000',
            size: ((_m = config) === null || _m === void 0 ? void 0 : _m.size) || 5,
            sizeRandom: (0 <= ((_o = config) === null || _o === void 0 ? void 0 : _o.sizeRandom) && ((_p = config) === null || _p === void 0 ? void 0 : _p.sizeRandom) <= 1) ? (_q = config) === null || _q === void 0 ? void 0 : _q.sizeRandom : 0.5,
            zPos: (0 <= ((_r = config) === null || _r === void 0 ? void 0 : _r.sizeRandom)) ? (_t = config) === null || _t === void 0 ? void 0 : _t.zPos : 6,
            zPosRandom: (0 <= ((_u = config) === null || _u === void 0 ? void 0 : _u.zPosRandom) && ((_v = config) === null || _v === void 0 ? void 0 : _v.zPosRandom) <= 1) ? (_w = config) === null || _w === void 0 ? void 0 : _w.zPosRandom : 0.8
        };
        if (target) {
            if (target instanceof HTMLCanvasElement) {
                this.canvas = document.querySelector(config.targetCanvas);
                this.setStarfield();
            }
            else {
                throw new TypeError("Selected element '" + config.targetCanvas + "' is not a canvas.");
            }
        }
        else {
            this.canvas = document.createElement('canvas');
            document.getElementsByTagName('body')[0].appendChild(this.canvas);
            this.canvas.style.position = "fixed";
            this.canvas.style.top = "0";
            this.canvas.style.left = "0";
            this.canvas.style.zIndex = "-1";
            this.sizeReset();
            addEventListener("resize", function () {
                clearTimeout(_s.resizeTimer);
                _s.resizeTimer = setTimeout(function () { _s.sizeReset(); }, 250);
            });
        }
        this.ctx = this.canvas.getContext('2d');
        this.draw();
    }
    Starlax.prototype.sizeReset = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setStarfield();
    };
    Starlax.prototype.setStarfield = function () {
        this.starfield = [];
        var qty = Math.floor(this.canvas.width / 75 * this.canvas.height / 75);
        for (var i = 0; i < qty; i++) {
            this.starfield.push({
                "twinkleOffset": Math.random() * 2 * Math.PI,
                "posX": Math.round(Math.random() * this.canvas.width),
                "posY": Math.round(Math.random() * this.canvas.height),
                "size": Math.floor(this.config.size - this.config.size * this.config.sizeRandom + Math.random() * this.config.size * this.config.sizeRandom),
                "zIndex": (this.config.zPos - this.config.zPos * this.config.zPosRandom + Math.random() * this.config.zPos * this.config.zPosRandom) + 1
            });
        }
    };
    Starlax.prototype.draw = function () {
        var _s = this;
        var _c = this.ctx;
        _c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.config.backgroundColor) {
            _c.fillStyle = this.config.backgroundColor;
            _c.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.starfield.forEach(function (star) {
            _c.beginPath();
            switch (_s.config.shape) {
                case "square":
                    _c.rect(star.posX, _s.mod((star.posY - window.pageYOffset / star.zIndex), _s.canvas.height), star.size * 2, star.size * 2);
                    break;
                default:
                    _c.arc(star.posX, _s.mod((star.posY - window.pageYOffset / star.zIndex), _s.canvas.height), star.size, 0, 2 * Math.PI);
            }
            var fadeOpacity = 1;
            var twinkleOpacity = 1;
            if (_s.config.fadeIn && _s.timer < (_s.ticksPerSecond * _s.config.fadeInDuration))
                fadeOpacity = _s.timer / (_s.ticksPerSecond * _s.config.fadeInDuration);
            if (_s.config.twinkle)
                twinkleOpacity = 0.5 + 0.5 * Math.sin((_s.timer / _s.ticksPerSecond / _s.config.twinkleDuration) * 2 * Math.PI + star.twinkleOffset);
            _c.globalAlpha = fadeOpacity * twinkleOpacity * ((12 - star.zIndex) / 12) * 0.6;
            _c.fillStyle = _s.config.color;
            _c.fill();
            _c.globalAlpha = 1;
        });
        this.timer++;
        requestAnimationFrame(function () { _s.draw(); });
    };
    Starlax.prototype.mod = function (n, m) {
        return ((n % m) + m) % m;
    };
    return Starlax;
}());

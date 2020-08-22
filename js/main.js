var starlax,starlax2,starlax3;

function init(){

    starlax = new Starlax({
        color:'#fff'
    });

    starlax2 = new Starlax({
        targetCanvas: '#inline-demo1', // target a canvas element
        color:'black', // color of the stars
        size:20, // size of stars
        sizeRandom:0, // variety of random values based on size - value from 0 to 1
        zPos:5, // z
        zPosRandom:0,
        shape:'square'
    });

    starlax3 = new Starlax({
        qtyMultiplier:3,
        backgroundColor: '#401705',
        targetCanvas: '#inline-demo2',
        color:['#D3F8E2','#E4C1F9','#F694C1','#EDE7B1','#A9DEF9'],
        twinkle:false,
        zPosOpacity:false
    });

    document.querySelectorAll("#inline-demo canvas").forEach(function(canv){
        canv.height = 256;
        canv.width = 256;
    });

}

window.onload = init;
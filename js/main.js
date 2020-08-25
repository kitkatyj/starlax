var starlax,starlax2,starlax3;

function init(){

    starlax = new Starlax({
        color:'#fff'
    });

    starlax2 = new Starlax({
        backgroundColor:'#FFB5B6',
        image:'res/heart-sharp.svg',
        targetCanvas: '#inline-demo1',
        color:'black',
        size:40,
        sizeRandom:0,
        zPos:1,
        zPosRandom:0
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
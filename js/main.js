var starlax,starlax2,starlax3;

function init(){

    starlax = new Starlax(); // default appearance

    starlax2 = new Starlax({
        targetCanvas: '#inline-demo', // target a canvas element
        backgroundColor: 'white', // accepts any CSS value
        color:'black', // color of the stars
        size:20, // size of stars
        sizeRandom:0, // variety of random values based on size - value from 0 to 1
        zPos:5, // z
        zPosRandom:0
    });

    starlax3 = new Starlax({
        targetCanvas: '#inline-demo2',
        backgroundColor: 'black',
        color:'white'
    });

}

window.onload = init;
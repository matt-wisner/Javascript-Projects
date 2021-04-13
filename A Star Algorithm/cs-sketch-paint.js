// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference

// Make global g_grid JS 'object': a key-value 'dictionary'.
var g_grid; // JS Global var, w grid size info; cvts grid cells to pixels
var g_frame_cnt; // Setup a P5 display-frame counter, to do anim
var g_frame_mod; // Update ever 'mod' frames.
var g_stop; // Go by default.
var g_p5_cnv;   // To hold a P5 canvas.
var g_button; // btn
var g_button2; // btn
var g_color;
var g_sctrl;
var g_tiles;
var pathArr = [{}];
var openArr = [{}];
var foundArr = [{}];
openArr[0] = {xVal: 1, yVal: 0, manhatDist: 42.8}
var pathCounter = 0;
var astarDone = 0;
var moveCounter = 0;

var g_l4job = { id:1 }; // Put Lisp stuff f JS-to-access in ob; id to force ob.

function do_btn( )
{ // grab code from csu\assets\js\js+p5+editbox

    // Creates an <input></input> element in the DOM for text input.
    // Use g_input.size() to set the display length of the box.
    // g_input = createInput( ); // Create input textbox.
    // g_input.position(  20, 30 );
    // g_button = createButton( "Submit" );
    // g_button.id( "btn" ); //Add for P5 btn onclick
    // g_button.position( 160, 30 );
    //text( "Enter your name.", 20, 20 );

    g_button2 = createButton( "Save Image" );
    g_button2.position( 20, 60 );
    g_button2.mousePressed( save_image ); // the callback
}

function save_image( ) // btn
{
    save('myCanvas-' + g_frame_cnt +  '.jpg');
}

  //Also g_img_cell = loadImage( '10x10-sqr-RBY.png' );
let g_img_stuff;
  
function get_images( )
{ 
    g_img_stuff = new Image( );
    g_img_stuff.src = "sprite-cells-28x28-a.png";
}

function setup( ) // P5 Setup Fcn
{
    console.log( "p5 Beg P5 setup =====");
    console.log( "p5 @: log says hello from P5 setup()." );
    g_grid = { cell_size:28, wid:36, hgt:28 };
    g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
    g_frame_mod = 10; // Update ever 'mod' frames.
    g_stop = 1; // Go by default.
    g_sctrl = 0;
    g_l4job = { id:1 };

    let sz = g_grid.cell_size;
    let width = sz * g_grid.wid;
    let height = sz * g_grid.hgt;
    g_p5_cnv = createCanvas( width, height );  // Make a P5 canvas.
    console.log( "p5 @: createCanvas()." );
    draw_grid( sz, 50, 'white', 'yellow' );
    do_btn( ); //
    console.log( "p5 Load the image." );
    get_images( );
    console.log( "p5 End P5 setup =====" );
}

var g_bot = { dir:3, x:20, y:20, color:100 }; // Dir is 0..7 clock, w 0 up.




// ==================================================
// =================== New Maze Drawing Code ========
// ==================================================
function get_sprite_by_id( rsprite_id ) // get sprite sheet x,y offsets obj.
{ // ID is a 0-based index; sprites are assumed to be grid cell size.
    // Sprite sheet is 2-elts 1-row, wall=0 and floor=1.
    let id = rsprite_id % 2;
    let sprite_ob = { id: id, img: g_img_stuff };
    sprite_ob.sheet_pix_x = id * g_grid.cell_size;
    sprite_ob.sheet_pix_y = 0;
    return sprite_ob;
}

function grid_to_pix( rx, ry ) // Cvt grid cell x,y to canvas x,y wrapped.
{
    let pix_ob = { x: (rx % g_grid.wid) * g_grid.cell_size,
                   y: (ry % g_grid.hgt) * g_grid.cell_size };
    return pix_ob;
}

function draw_sprite_in_cell( rsprite_id, rx, ry ) // wraps in x,y ifn.
{
    let sprite_ob = get_sprite_by_id( rsprite_id );
    let pix_ob = grid_to_pix( rx, ry );
    let ctx = g_p5_cnv.canvas.getContext( '2d' ); // get html toolbox to draw.
    ctx.drawImage( sprite_ob.img,
                   sprite_ob.sheet_pix_x, sprite_ob.sheet_pix_y,
                     g_grid.cell_size, g_grid.cell_size,
                   pix_ob.x, pix_ob.y,
                     g_grid.cell_size, g_grid.cell_size );
}


function write_manhatten_dist_on_cell(rx, ry){
    //RX and RY is the top left location where each brick is
    let ctx = g_p5_cnv.canvas.getContext( '2d' ); // get html toolbox to draw.
    ctx.font = "12px Arial";
    var tempHattenDist = Math.sqrt(Math.pow(35-rx, 2)+Math.pow(26-ry, 2));
    ctx.fillText(tempHattenDist.toFixed(1), rx*28, ry*28 + 12);
    pathArr[pathCounter] = {xVal: rx, yVal: ry, manhatDist: tempHattenDist};
    pathCounter++;
}
// ==================================================
// =================== END New Maze Drawing Code ========
// ==================================================

function draw_update()  // Update our display.
{
    //console.log( "p5 Call g_l4job.draw_fn" );
    g_l4job.draw_fn( );
    console.log("Hello");
}

function csjs_get_pixel_color_sum( rx, ry )
{
    let acolors = get( rx, ry ); // Get pixel color [RGBA] array.
    let sum = acolors[ 0 ] + acolors[ 1 ] + acolors[ 2 ]; // Sum RGB.
    //dbg console.log( "color_sum = " + sum );
    return sum;
}

function move_bot_to_mouse( )
{
    let x = mouseX;
    let y = mouseY;
    //console.log( "p5 move_bot: x,y = " + x + "," + y );
    let cz = g_grid.cell_size;
    let gridx = floor( x / cz );
    let gridy = floor( y / cz );
    //console.log( "p5 move_bot: gridx,y,cz = " + gridx + "," + gridy + ", " +cz );
    g_bot.x = gridx + g_grid.wid; // Ensure it's positive.
    g_bot.x %= g_grid.wid; // Wrap to fit box.
    g_bot.y = gridy + g_grid.hgt;
    g_bot.y %= g_grid.hgt;
}

function aStartSearch(){
    
    
    
    let ctx = g_p5_cnv.canvas.getContext( '2d' ); // get html toolbox to draw.
    
    //Find squares touching spaces that have been visited
    for(var i = 0; i < openArr.length; i++){
        for(var j = 0; j < pathArr.length; j++){
            if(openArr[i].xVal == pathArr[j].xVal + 1 && openArr[i].yVal == pathArr[j].yVal 
               || openArr[i].xVal == pathArr[j].xVal && openArr[i].yVal == pathArr[j].yVal + 1 
               || openArr[i].xVal == pathArr[j].xVal - 1 && openArr[i].yVal == pathArr[j].yVal 
               || openArr[i].xVal == pathArr[j].xVal && openArr[i].yVal == pathArr[j].yVal - 1){
                foundArr.push(pathArr[j]);  //if the square is next to an path that has been reached add it has been discovered
                pathArr.splice(j,1);        //now remove it from the pathArr because it has been discovered
            }
        }
    }
    
    
    // find the smallest available manhatten Distance
    var minMove = 1000;
    var minIndex = 0;
    
    for(var k = 0; k < foundArr.length; k++){
        if(minMove > foundArr[k].manhatDist){
            minMove = foundArr[k].manhatDist;
            console.log(minMove);
            minIndex = k;
        }
    }
    
    
    // Visit the square with the lowest manhatt distance that has been reached
    openArr.push(foundArr[minIndex]);  //add to visited
    ctx.fillStyle = 'blue';
    ctx.fillRect(foundArr[minIndex].xVal*28 + 7, foundArr[minIndex].yVal*28 + 14, 15, 15);
    if(foundArr[minIndex].manhatDist == 0){
        astarDone = 1;   
    }
    foundArr.splice(minIndex, 1); // Remove the visited square from the squares to check
   
    moveCounter++;
    console.log('num moves = ' + moveCounter);
    
}



function draw()  // P5 Frame Re-draw Fcn, Called for Every Frame.
{
    
    ++g_frame_cnt;
    if (!g_stop
        && mouseIsPressed
        && (0 == g_frame_cnt % g_frame_mod))
    {
        //console.log( "p5 draw" );
        move_bot_to_mouse( );
        draw_update( );
        
    }
     
    if ((0 == g_frame_cnt % g_frame_mod && astarDone == 0)){
        aStartSearch();
    }
         
}

function keyPressed( )
{
    if ('a' == key) g_sctrl = 0;
    if ('b' == key) g_sctrl = 1;
    if ('s' == key) g_stop = ! g_stop;
    if ('p' == key) {
        console.log( "p5 list_fn" );
        g_l4job.list_fn( );
    }
    if ('z' == key) {
        console.log( "p5 Call g_l4job.zzdefg_fn" );
        g_l4job.zzdefg_fn( );
    }

    console.log( "p5 keyPressed: "
                 // + ${key} + " " + ${keyCode} 
                 + key + " " + keyCode 
                 +  " g_sctrl = " + g_sctrl );

    console.log( "p5 keyPressed: post g_stop = " + g_stop );
    console.log( "p5 mouseIsPressed = " + mouseIsPressed );
    if (g_stop) { noLoop(); } else {loop();}
}

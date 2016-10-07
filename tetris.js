//  h === board.length
//  w === board[i].length (i: 0...(h-1))

// piece: {x, y, r, type, color}
// 		types: index in the masks array
// 		rotation: 0, 90, 180, 270
//		color: "#hhhhhh", false


// **** Game Mechanics **** 


function create_board (size) {
   var board = []
	for (var y = 0; y < size.height; y++) {		
		board[y] = []
		for (var x = 0; x < size.width; x++) {
			board[y][x] = false
		}
	}
	return board
}

var masks = [
	['xx',
	 'xx'],

	['xxxx'],
    
    ['x  ',
	 'xxx'],
	
	['xx ',
	 ' xx'],

	[' x ',
	 'xxx']
]

function rotate_mask(mask, r) {
	// TODO: rotate mask and return it
	return mask
}

function paint (board, p, color) {
	if (color === undefined) {
		color = p.color
	}
	var mask = masks[p.type]
	mask = rotate_mask(mask, p.r)
	
	for (var my = 0; my < mask.length; my++) {
		for (var mx = 0; mx < mask[my].length; mx++) {
			if (mask[my][mx] == 'x') {
				var x = p.x + mx
				var y = p.y + my
				board[y][x] = color 
			}
		}
	}
}

function mask_size (type) {
	var mask = masks[type]
	var w = mask[0].length
	var h = mask.length
	return {'width': w, 'height': h }
}

function inside_board (board, p, x, y, r) {
	var size = mask_size(p.type)
	var w = size.width
	var h = size.height
	var bw = board[0].length
	var bh = board.length 
	return x >= 0 && y >= 0 && x <= bw - w && y <= bh - h
}

var erase = function (board, p) {
	paint(board, p, false)
}

var update = function (board, p, x, y, r) {
	if(!inside_board(board, p, x, y, r))
		return
	erase(board, p)
	p.x = x 
	p.y = y
	p.r = r
	paint(board, p)
}

//returns true if the piece is on deck, false if it isn't
var on_deck =  function (p) {}

var can_move = function (p, x, y, r) {}

var erase_full_lines = function () {}

// **** Game Logic ****

var board
var p 
var state

function restart_game (size) {
	state = 'running'
	board = create_board(size)
	var type = Math.floor(Math.random() * masks.length)
		console.log(type)
		console.log(type, mask_size(type))
	var x = Math.floor((size.width - mask_size(type).width)/2)
	p = {'x': x, 'y': 0, 'r': 0, 'type': type, 'color': '#ff0000' }
	paint(board, p)
}


// how : 'left', 'right', 'down', 'rotate'
function move (how) {
	if (how == 'left') {
		update(board, p, p.x-1, p.y, p.r)
	}
	else if (how == 'right') {
		update(board, p, p.x+1, p.y, p.r)		
	}
	else if (how == 'down') {
		update(board, p, p.x, p.y+1, p.r)		
	}
	else if (how == 'rotate') {
		update(board, p, p.x, p.y, p.r+90)		
	}
}


// returns square color, or false for no color
function get_square (x, y) {
	return board[y][x]
}


// returns 'running' or 'over'
function get_state () {
	return state
}


// **** Game Interface ****
var size = {'width': 25, 'height': 40}

function draw_board(size) {
	var s = ''
	for (var y = 0; y < size.height; y++) {
		s = s + '<div class=row>'
		for (var x = 0; x < size.width; x++) {
			var color = get_square(x, y)
			if (color == false)
				color = '#000000'
			s = s + '<div class=cell style="background-color: ' + color + '"></div>'
		}
	 	s = s + '</div>'
	}
	$('#board').html(s)

}


function main () {
	restart_game(size)
	draw_board(size)
	$(document).keydown(function(e) {
		var show_move = function (how) {
			move(how)
			draw_board(size)
		}
        if (e.keyCode == 37)  // left arrow
       		show_move('left') 
        else if (e.keyCode == 39) // right arrow
        	show_move('right')
        else if (e.keyCode == 40) // down arrow 
        	show_move('down')
        else if (e.keyCode == 32) // space key
 			show_move('rotate')
    })
}

$(main)


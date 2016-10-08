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

function rotated_mask(mask, r) {
	r = r % 360
	if (!r) 
		return mask
	if (r == 90) {
		var m = []			
		for (var mx = 0; mx < mask[0].length; mx++) {
			var s = ''
			for (var my = mask.length - 1; my >= 0; my--) {
				s = s + mask[my][mx]
			}
			m.push(s)	
		}
		return m		
	}
	else if (r == 180) {
		return rotated_mask(rotated_mask(mask, 90), 90)
	}
	else if (r == 270) {
		return rotated_mask(rotated_mask(rotated_mask(mask, 90), 90), 90)
	}	
	assert(false)
}

function get_mask(p, r) {
	if (r === undefined)
		r = p.r
	var mask = masks[p.type]
	return rotated_mask(mask, r)
}

function paint (board, p, color) {
	if (color === undefined) {
		color = p.color
	}
	var mask = get_mask(p)	
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

function piece_size (p, r) {
	var mask = get_mask(p, r)
	var w = mask[0].length
	var h = mask.length
	return {'width': w, 'height': h }
}

function inside_board (board, p, x, y, r) {
	var size = piece_size(p, r)
	var w = size.width
	var h = size.height
	var bw = board[0].length
	var bh = board.length 
	return x >= 0 && y >= 0 && x <= bw - w && y <= bh - h
}

function update (board, p, x, y, r) {
	if(!inside_board(board, p, x, y, r))
		return
	paint(board, p, false) // erase the piece on current position
	p.x = x 
	p.y = y
	p.r = r
	paint(board, p)
}

//returns true if the piece is on deck, false if it isn't


function on_deck (board, p) {

}

var can_move = function (p, x, y, r) {}

var erase_full_lines = function () {}

// **** Game Logic ****

var board
var p 
var state

function init_piece (size){
	var type = Math.floor(Math.random() * masks.length)
	p = {'x': 0, 'y': 0, 'r': 0, 'type': type, 'color': '#ff0000' }	
	p.x = Math.floor((size.width - piece_size(p).width)/2)
	paint(board, p)
}

function restart_game (size) {
	state = 'running'
	board = create_board(size)
	init_piece(size)
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
        else if (e.keyCode == 38) // space key
 			show_move('rotate')
    })
}

$(main)


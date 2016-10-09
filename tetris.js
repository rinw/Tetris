//  h === board.length
//  w === board[i].length (i: 0...(h-1))

// piece: {x, y, r, type, color}
// 		types: index in the masks array
// 		rotation: 0, 90, 180, 270
//		color: "#hhhhhh", false

// **** Game State **** 

var board_size = {'width': 25, 'height': 40}
var board
var p 
var state

// **** Game Mechanics **** 

function create_board () {
	board = []
	for (var y = 0; y < board_size.height; y++) {		
		board[y] = []
		for (var x = 0; x < board_size.width; x++) {
			board[y][x] = false
		}
	}
}

function create_piece(type, x, y, r, color) {
	p = {'x': x, 'y': y, 'r': r, 'type': type, 'color': color }
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

function rotated_mask (mask, r) {
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

function piece_mask (r) {
	if (r === undefined)
		r = p.r
	var mask = masks[p.type]
	return rotated_mask(mask, r)
}

function piece_size (r) {
	var mask = piece_mask(r)
	var w = mask[0].length
	var h = mask.length
	return {'width': w, 'height': h }
}

var change_square_color // forward declaration

function paint_piece (color) {
	if (color === undefined) 
		color = p.color
	var mask = piece_mask()
	var size = piece_size()
	for (var my = 0; my < size.height; my++) {
		for (var mx = 0; mx < size.width; mx++) {
			if (mask[my][mx] == 'x') {
				var x = p.x + mx
				var y = p.y + my
				board[y][x] = color 
				change_square_color(x, y, color)
			}
		}
	}
}

function piece_inside_board (x, y, r) {
	var size = piece_size(r)
	var w = size.width
	var h = size.height
	var bw = board[0].length
	var bh = board.length 
	return x >= 0 && y >= 0 && x <= bw - w && y <= bh - h
}

function can_move (x, y, r) {
	if(!piece_inside_board(x, y, r))
		return false
	// TODO: check if any of the piece's squares overlaps with board squares
	return true
}

function update_piece (x, y, r) {
	if(!can_move(x, y, r))
		return
	paint_piece(false) // erase the piece on current position
	p.x = x 
	p.y = y
	p.r = r
	paint_piece()
}

// how : 'left', 'right', 'down', 'rotate'
function move_piece (how) {
	if (how == 'left') {
		update_piece(p.x-1, p.y, p.r)
	}
	else if (how == 'right') {
		update_piece(p.x+1, p.y, p.r)		
	}
	else if (how == 'down') {
		update_piece(p.x, p.y+1, p.r)		
	}
	else if (how == 'rotate') {
		update_piece(p.x, p.y, p.r+90)		
	}
}

// returns true if the piece is on deck, false if it isn't
function on_deck () {
	var mask = piece_mask()
	var size = piece_size()	
}

function erase_full_lines () {}

var colors = ['#ff0000', '#0000ff', '#00ff00', '#ffff00']

function init_piece() {
	var type = Math.floor(Math.random() * masks.length)
	var color = colors[Math.floor(Math.random() * colors.length)]
	create_piece(type, 0, 0, 0, color)
	// center the piece horizontally to the board
	p.x = Math.floor((board_size.width - piece_size().width)/2) 
}

function restart_game () {
	create_board()
	init_piece()
	paint_piece()
	state = 'running'
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

function draw_board() {
	var s = ''
	for (var y = 0; y < board_size.height; y++) {
		s = s + '<div class=row>'
		for (var x = 0; x < board_size.width; x++) {
			var color = get_square(x, y)
			if (color == false)
				color = '#000000'
			s = s + '<div class=cell style="background-color: ' + color + '"></div>'
		}
	 	s = s + '</div>'
	}
	$('#board').html(s)

}

function move_piece_and_draw_board (how) {
	move_piece(how)
	draw_board()
}

function handle_keydown (e) {
    if (e.keyCode == 37)  // left arrow
   		move_piece_and_draw_board('left') 
    else if (e.keyCode == 39) // right arrow
    	move_piece_and_draw_board('right')
    else if (e.keyCode == 40) // down arrow 
    	move_piece_and_draw_board('down')
    else if (e.keyCode == 38) // space key
		move_piece_and_draw_board('rotate')
}

change_square_color = function (x, y, color) { // declared above
	// TODO
}

function main () {
	restart_game()
	draw_board()
	$(document).keydown(handle_keydown)
	setInterval(function() { 
		move_piece_and_draw_board('down') 
	}, 1000)
}

$(main)


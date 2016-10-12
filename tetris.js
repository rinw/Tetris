
// piece: {x, y, r, type, color}
//		x, y: indices in the board array
// 		r: rotation: 0, 90, 180, 270
// 		type: index in the masks array
//		color: '#hhhhhh', false

// **** Game State **** 

var board_size = {'width': 15, 'height': 30}
var board    // array of arrays holding cell colors
var p        // current piece (see above)
var state    // 'running' | 'over'

// **** Game Mechanics **** 

// create the board arrays of cells and initialize each cell with false
function create_board () {
	board = []
	for (var y = 0; y < board_size.height; y++) {		
		board[y] = []
		for (var x = 0; x < board_size.width; x++) {
			board[y][x] = false
		}
	}
}

// create the current piece according to given parameters
function create_piece(type, x, y, r, color) {
	p = {'x': x, 'y': y, 'r': r, 'type': type, 'color': color }
}

// return the mask of the current piece at a given rotation 
// (or at current rotation if no rotation is given)
function piece_mask (r) {
	if (r === undefined)
		r = p.r
	return masks[p.type][r / 90]
}

// return the width and height of the current piece at a given rotation 
// (or at current rotation if no rotation is given)
function piece_size (r) {
	var mask = piece_mask(r)
	var w = mask[0].length
	var h = mask.length
	return {'width': w, 'height': h}
}

var change_square_color // forward declaration

// fill the board squares corresponding to the current piece's mask 
// at the piece's position with a color
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

// check if the current piece at (x, y, r) would be inside the board or not
function piece_inside_board (x, y, r) {
	var size = piece_size(r)
	var w = size.width
	var h = size.height
	var bw = board[0].length
	var bh = board.length 
	return x >= 0 && y >= 0 && x <= bw - w && y <= bh - h
}

// given a square on the board, check if the current piece is filled
// at that square.
function square_belongs_to_p(x, y) {
	var size = piece_size()
	var mask = piece_mask()
	var mx = x - p.x
	var my = y - p.y
	return 	mx >= 0 && mx < size.width && 
			my >= 0 && my < size.height && 
			mask[my][mx] == 'x'

}

// check if the current piece can move at (x, y, z), meaning if none of its
// squares at (x, y, z) intersect a square on the board, excluding the 
// squares of the piece at its current position and rotation.
function can_move (x, y, r) {
	if(!piece_inside_board(x, y, r))
		return false
	var size = piece_size(r)
	var mask = piece_mask(r)
	for (var my = 0; my < size.height; my++) {
		for (var mx = 0; mx < size.width; mx++) {
			if(mask[my][mx] == 'x') {
				var x1 = x + mx
				var y1 = y + my
				if(!square_belongs_to_p(x1, y1) && board[y1][x1] !== false) {
					return false
				}
			}
		}
	}
	return true
}

// erase a piece at its current position, update its (x, y, r) and paint
// it again at its new position and rotation.
function update_piece (x, y, r) {
	if(!can_move(x, y, r))
		return
	paint_piece(false) // erase the piece on current position
	p.x = x 
	p.y = y
	p.r = r
	paint_piece()
}

// move or rotate a piece
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
		update_piece(p.x, p.y, (p.r + 90) % 360)		
	}
}

// returns true if the piece is on deck, false if it isn't
function on_deck () {
	var mask = piece_mask()
	var size = piece_size()	
 	if (p.y + size.height == board_size.height)
 		return true
	for (var my = 0; my < size.height; my++) {
		for (var mx = 0; mx < size.width; mx++) {
			if (mask[my][mx] == 'x') {
				// either we're on the last row of the mask or the square below (mx, my) is a ' '
				if (my == size.height - 1 || mask[my + 1][mx] != 'x') {
					var x = p.x + mx 
					var y = p.y + my
					if (board[y + 1][x] !== false) 
						return true
				}
			}
		}
	}
}

function is_line_full (y) {
	var line = board[y]
	for (var x = 0; x < board_size.width; x++)
		if (line[x] === false)
			return false
	return true
}

function erase_line (y) {
	board.pop(y)
	var line = []
	for (var x = 0; x < board_size.width; x++) 
		line[x] = false
	board.unshift(line)
}

function erase_full_lines () {
	for (var y = 0; y < board_size.height; y++) 
		if (is_line_full(y))
			erase_line(y)
}

var colors = ['#ff0000', '#0000ff', '#00ff00', '#ffff00']

// recreate the current piece on top-center of the board with a random
// type and color.
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

// returns the color of a square on the board, or false for no color
function get_square (x, y) {
	return board[y][x]
}

// returns 'running' or 'over'
function game_state () {
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
			s = s + '<div id=cell_'+x+'_'+y+' class=cell style="background-color: ' + color + '"></div>'
		}
	 	s = s + '</div>'
	}
	$('#board').html(s)

}

change_square_color = function (x, y, color) { // declared above
	if (color == false)
		color = '#000000'
	$('#cell_'+x+'_'+y).css({'background-color': color})
}

function game_over() {
	state = 'over'
	// TODO: display the restart button and the "GAME OVER" label
}

function go (how) {
	if (state == 'over') 
		return
	move_piece(how)
	if (on_deck()) {
		erase_full_lines()
		draw_board()
		init_piece()
		// move piece outside the board so we can call can_move() on it
		// because otherwise can_move() will always work
		p.y = -100 
		if (can_move(p.x, 0, p.r)) {
			p.y = 0
			paint_piece()
		} else 
			game_over()
	}
}

function handle_keydown (e) {
    if (e.keyCode == 37)  // left arrow
   		go('left') 
    else if (e.keyCode == 39) // right arrow
    	go('right')
    else if (e.keyCode == 40) // down arrow 
    	go('down')
    else if (e.keyCode == 38) // space key
		go('rotate')
}

function main () {
	restart_game()
	draw_board()
	$(document).keydown(handle_keydown)
	setInterval(function() { 
		go('down') 
	}, 1000)
}

$(main)


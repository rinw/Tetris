// piece: {x, y, r, type, color}
//		x, y: indices in the board array
// 		r: rotation: 0, 90, 180, 270
// 		type: index in the masks array
//		color: index in current palette (index 0 means no color)

// **** Game State ****

var board_size = {'width': 15, 'height': 30}
var scores = [0, 40, 140, 300, 1200]

var board    // array of arrays holding cell colors
var p        // current piece (see above)
var state    // 'running' | 'over'
var next_p
var score
var hiscore = localStorage.getItem('hiscore') || 0
var palette = 'bright ideas'

// **** Game Mechanics **** 

// create a board line of cells and initialize each cell with 0
function create_board_line () {
	var a = []
	for (var x = 0; x < board_size.width; x++)
		a[x] = 0
	return a
}

function create_board () {
	board = []
	for (var y = 0; y < board_size.height; y++)
		board[y] = create_board_line()
}


// create the current piece according to given parameters
function create_piece(type, x, y, r, color) {
	p = {'x': x, 'y': y, 'r': r, 'type': type, 'color': color }
}

// return the mask of the current piece at a given rotation 
// (or at current rotation if no rotation is given)
function piece_mask (p, r) {
	if (r === undefined)
		r = p.r
	return masks[p.type][r / 90]
}

// return the width and height of a piece mask 
function mask_size (mask) {
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
	var mask = piece_mask(p)
	var size = mask_size(mask)
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
	var mask = piece_mask(p, r)
	var size = mask_size(mask)
	var w = size.width
	var h = size.height
	var bw = board_size.width
	var bh = board_size.height 
	return x >= 0 && y >= 0 && x <= bw - w && y <= bh - h
}

// given a square on the board, check if the current piece is filled
// at that square.
function square_belongs_to_p(x, y) {
	var mask = piece_mask(p)
	var size = mask_size(mask)
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
	var mask = piece_mask(p, r)
	var size = mask_size(mask)
	for (var my = 0; my < size.height; my++) {
		for (var mx = 0; mx < size.width; mx++) {
			if(mask[my][mx] == 'x') {
				var x1 = x + mx
				var y1 = y + my
				if(!square_belongs_to_p(x1, y1) && board[y1][x1]) {
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
		return false
	paint_piece(0) // erase the piece on current position
	p.x = x 
	p.y = y
	p.r = r
	paint_piece()
	return true
}

// move or rotate a piece
// how : 'left', 'right', 'down', 'rotate'
function move_piece (how) {
	if (how == 'left') {
		return update_piece(p.x-1, p.y, p.r)
	}
	else if (how == 'right') {
		return update_piece(p.x+1, p.y, p.r)		
	}
	else if (how == 'down') {
		return update_piece(p.x, p.y+1, p.r)		
	}
	else if (how == 'rotate') {
		return update_piece(p.x, p.y, (p.r + 90) % 360)		
	}
}

function is_line_full (y) {
	var line = board[y]
	for (var x = 0; x < board_size.width; x++)
		if (!line[x])
			return false
	return true
}

function erase_line (y) {
	board.splice(y, 1)
	var line = []
	for (var x = 0; x < board_size.width; x++) 
		line[x] = 0
	board.unshift(line)
}


function erase_full_lines () {
	var	count = 0
	for (var y = 0; y < board_size.height; y++) 
		if (is_line_full(y)) {
			erase_line(y)
			count++
		}
	return count
}

function random_piece() {
	var type = Math.floor(Math.random() * masks.length)
	var r = Math.floor(Math.random() * 4) * 90
	var color = 1 + Math.floor(Math.random() * 8)
	return {'r': r, 'type': type, 'color': color}
}

// recreate the current piece on top-center of the board with a random
// type and color.
function init_piece() {
	if (!next_p)
		next_p = random_piece()
	var type = next_p.type
	var r = next_p.r
	var color = next_p.color
	next_p = random_piece()
	create_piece(type, 0, 0, r, color)
	// center the piece horizontally to the board
	var mask = piece_mask(p)
	p.x = Math.floor((board_size.width - mask_size(mask).width)/2) 
}

function restart_game () {
	create_board()
	init_piece()
	paint_piece()
	state = 'running'
	score = 0
}

// **** Game Interface ****

var palettes = {
	'plastic':
		['#000000', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff0000', '#0000ff', '#00ff00', '#ffff00'],
	'living room':
		['#000000', '#757573', '#B64F39', '#3B2928', '#171519', '#774A45', '#757573', '#B64F39', '#3B2928'],
	'you are beautiful':
		['#000000', '#351330', '#424254', '#64908A', '#E8CAA4', '#CC2A41', '#351330', '#424254', '#64908A'],
	'bright ideas':
		['#000000', '#FFEF00', '#008DFF', '#73D7D7', '#F9FF8A', '#545454', '#FFEF00', '#008DFF', '#73D7D7']
}

function select_color(color_index) {
	var colors = palettes[palette]
	return colors[color_index]
}

function draw_a_board(b, prefix, board_id) {
	var s = ''
	for (var y = 0; y < b.length; y++) {
		s = s + '<div class=row>'
		for (var x = 0; x < b[0].length; x++) {
			var color = select_color(b[y][x])
			s = s + '<div id=' + prefix + '_' + x + '_' + y +
				' class=cell style="background-color: ' + color +
				'"></div>'
		}
	 	s = s + '</div>'
	}
	$(board_id).html(s)

}

function draw_board() {
	draw_a_board(board, 'cell', '#board')
}

function draw_next_p () {
	var mask = piece_mask(next_p)
	var size = mask_size(mask)
	var b = []
	for (var my = 0; my < size.height; my++) {
		b[my] = []
		for (var mx = 0; mx < size.width; mx++) {
			if (mask[my][mx] == 'x')
				b[my][mx] = next_p.color
			else
				b[my][mx] = 0
		}
	}
	draw_a_board(b, 'next', '#next_p')
}

change_square_color = function (x, y, color_index) { // declared above
	var color = select_color(color_index)
	$('#cell_' + x + '_' + y).css({'background-color': color})
}

function game_over () {
	state = 'over'
	// TODO: display the restart button and the "GAME OVER" label
}

function draw_score () {
	$('#score').html(score)
	$('#hiscore').html(hiscore)
}

function go (how) {
	if (state == 'over') 
		return
	var moved = move_piece(how)
	if (how == 'down' && !moved) {
		var count = erase_full_lines()
		score += scores[count]
		hiscore = Math.max(hiscore, score)
		localStorage.setItem('hiscore', hiscore)
		draw_score()
		draw_board()
		init_piece()
		draw_next_p()
		// move piece outside the board so we can call can_move() on it
		// because otherwise can_move() will always work
		p.y = 10 
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
	draw_next_p()
	draw_score()
	$(document).keydown(handle_keydown)
	setInterval(function() { 
		go('down') 
	}, 1000)
}

$(main)


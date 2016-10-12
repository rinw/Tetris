
// array of masks (or stencils) for each piece type
// each mask line must have the same length (fill with spaces as needed)
var masks = [
	[
		['xx',
		 'xx'],
		
		['xx',
		 'xx'],
		
		['xx',
		 'xx'],
		
		['xx',
		 'xx']
	], 

	[
		['xxxx'],
    
		['x',
		 'x',
		 'x',
		 'x'],

		['xxxx'],
    
		['x',
		 'x',
		 'x',
		 'x']
	],

	[
	    ['x  ',
		 'xxx'],

	    ['xx',
		 'x ',
		 'x '],
	
	    ['xxx',
		 '  x'],

	    [' x',
		 ' x',
		 'xx']
	],

	[
	    ['  x',
		 'xxx'],

	    ['x ',
		 'x ',
		 'xx'],
	
	    ['xxx',
		 'x  '],

	    ['xx',
		 ' x',
		 ' x']
	],

	[
		['xx ',
		 ' xx'],

		[' x',
		 'xx',
		 'x '],

		['xx ',
		 ' xx'],

		[' x',
		 'xx',
		 'x ']
	], 

	[
		[' xx',
		 'xx '],

		['x ',
		 'xx',
		 ' x'],

		[' xx',
		 'xx'],

		['x ',
		 'xx',
		 ' x']
	], 

	[
		[' x ',
		 'xxx'],

		['x ',
		 'xx',
		 'x '],

		['xxx',
		 ' x '],

		[' x',
		 'xx',
		 ' x']
	]
]

// return a mask rotated by a certain rotation angle
/*
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
*/


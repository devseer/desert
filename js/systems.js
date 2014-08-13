/* @Control */
engine.addSystem({
	_components: ['control', 'position', 'render']
	,_keys: []

	,init: function() {
		for (var i = 256; i--;) this._keys[i] = false;

		var that = this;
		document.onkeydown = function(e) { that._keys[e.keyCode] = true; }
		document.onkeyup = function(e) { that._keys[e.keyCode] = false; }
	}

	,update: function(entities) {
		var that = this;

		this._entityList(entities, function(e) {
			e.view.position.x = e.position.x;
			e.view.position.y = e.position.y;

			if (e.control.enabled) {
				var changed = false;

				if (that._keys[e.control.up]) { changed = true; e.position.y--; e.render.offset.y = e.render.size.height; }
				if (that._keys[e.control.down]) { changed = true; e.position.y++; e.render.offset.y = 0; }
				if (that._keys[e.control.left]) { changed = true; e.position.x--; }
				if (that._keys[e.control.right]) { changed = true; e.position.x++; }
				
				if (changed) {
					that._disableInput(e);
					e.render.animated = true;
				}
				else e.render.animated = false;
			}
		});
	}

	,_disableInput: function(entity) {
		entity.control.enabled = false;
		setTimeout(function() { entity.control.enabled = true; }, entity.control.delay);
	}
});

/* @World */
engine.addSystem({
	_components: ['map', 'tileset', 'view']

	,init: function(entities) {
		this._entityList(entities, function (e) {
			for (var i = 0; i < e.map.size.height; i++) {
				e.map.data.push([]);

				for (var j = 0; j < e.map.size.width; j++) {
					var r = Math.floor(Math.random() * 100);
					var t = 0;

					for (var k = 0; k < e.map.tiles.length; k++) {
						if (r < e.map.tiles[k] && e.map.tiles[k] < e.map.tiles[t])
							t = k;
					}

					e.map.data[i][j] = t;
				}
			}
		});
	}

	,update: function(entities) {
		var that = this;

		engine.context.fillStyle = '#444;';
		engine.context.fillRect(0, 0, 240, 240);

		this._entityList(entities, function(e) {
			for (var i = 0; i < e.view.size.height; i++) {
				for (var j = 0; j < e.view.size.width; j++) {
					var y = i + e.view.position.y;
					var x = j + e.view.position.x;

					if (that._checkBounds(x, y, e.map.size)) {
						engine.context.drawImage(e.tileset.image,
							e.map.data[y][x] * e.tileset.size.width, 0,
							e.tileset.size.width, e.tileset.size.height,
							j * e.tileset.size.width, i * e.tileset.size.height,
							e.tileset.size.width, e.tileset.size.height
						);
					}
				}
			}
		});
	}

	,_checkBounds: function(x, y, size) {
		return x > 0 && y > 0 && x < size.width && y < size.height;
	}
});


/* @Animation */
engine.addSystem({
	_components: ['animation', 'render']

	,init: function() {}

	,update: function(entities) {
		this._entityList(entities, function(e) {
			if (e.render.animated && !e.animation.lock) {
				e.animation.frame = (e.animation.frame + 1) % e.animation.limit;
				e.render.offset.x = e.animation.frame * e.render.size.width;
				e.animation.lock = true;
				setTimeout(function() { e.animation.lock = false; }, e.animation.delay);
			}
		});
	}
});

/* @Background */
engine.addSystem({
	_components: ['background', 'render']

	,init: function() {
	}

	,update: function(entities) {
		var that = this;

		this._entityList(entities, function(e) {
			var bgSize = {
				width: ((e.render.repeat.x + 1) * e.render.size.width) -
					e.background.size.width + e.background.padding * 2
				,height: ((e.render.repeat.y + 1) * e.render.size.height) -
					e.background.size.height + e.background.padding * 2
			};

			that._drawRow(0, 0, that, e, bgSize);
			var i = e.background.size.height;

			while (i < bgSize.height) {
				that._drawRow(1, i, that, e, bgSize);
				i += e.background.size.height;
			}

			that._drawRow(2, i, that, e, bgSize);
		});
	}

	,_drawRow: function(style, row, that, e, bgSize) {
		var i;
		var st = style * 3;

		that._drawTile(e, st, 0, row);
		var i = e.background.size.width;

		while (i < bgSize.width) {
			that._drawTile(e, st+1, i, row);
			i += e.background.size.width;
		}

		that._drawTile(e, st+2, i, row);
	}

	,_drawTile: function(e, type, i, j) {
		engine.context.drawImage(e.background.image,
			type * e.background.size.width, 0,
			e.background.size.width, e.background.size.height,
			e.render.drawOffset.x - e.background.padding + i,
			e.render.drawOffset.y - e.background.padding + j,
			e.background.size.width, e.background.size.height
		);
	}
});

/* @Text */
engine.addSystem({
	_components: ['text', 'render']

	,init: function() {}

	,update: function(entities) {
		this._entityList(entities, function(e) {
			engine.context.fillStyle = e.text.color;
			engine.context.font = e.text.font;
			engine.context.fillText(e.text.message,
				e.render.drawOffset.x + e.text.padding,
				e.render.drawOffset.y + e.text.padding
			);
		});
	}
});

/* @Render */
engine.addSystem({
	_components: ['render']

	,init: function() {}

	,update: function(entities) {
		this._entityList(entities, function(e) {
			for (var i = 0; i < e.render.repeat.y + 1; i++) {
				for (var j = 0; j < e.render.repeat.x + 1; j++) {
					engine.context.drawImage(e.render.image,
						e.render.offset.x, e.render.offset.y,
						e.render.size.width, e.render.size.height,
						e.render.drawOffset.x + j * e.render.size.width,
						e.render.drawOffset.y + i * e.render.size.height,
						e.render.size.width, e.render.size.height
					);
				}
			}
		});
	}
});

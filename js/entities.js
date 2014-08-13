engine.assemblages = {
	init: function() {
		for (var i in this) {
			if (i !== 'init') {
				engine.entities.push(this[i](new Entity()));
			}
		}
	}

	,player: function(e) {
		e.add(engine.components.position);
		e.add(engine.components.render);
		e.render.image.src = 'img/player0.png';
		e.render.drawOffset = { x: 112, y: 112 };
		e.render.offset = { x: 0, y: 0 };
		e.render.repeat = { x: 0, y: 0 };
		e.render.animated = false;
		e.position.x = 64;
		e.position.y = 64;

		e.add(engine.components.control);
		e.add(engine.components.animation);
		e.add(engine.components.stat);
		e.add(engine.components.view);

		return e;
	}

	,world: function(e) {
		e.add(engine.components.map);
		e.add(engine.components.tileset);
		e.add(engine.components.view);
		e.tileset.image.src = 'img/desert.png';
		e.map.tiles = [80, 10, 0, 7];

		return e;
	}

	,status: function(e) {
		e.add(engine.components.render);
		e.render.image = new Image();
		e.render.image.src = 'img/icon.png';
		e.render.size = { width: 8, height: 8 };
		e.render.drawOffset = { x: 16, y: 16 };
		e.render.offset = { x: 0, y: 0 };
		e.render.repeat.x = 4;

		e.add(engine.components.background);
		e.background.image = new Image();
		e.background.image.src = 'img/bg.png';

		return e;
	}

	,dialogue: function(e) {
		e.add(engine.components.render);
		e.render.image = new Image();
		e.render.size = { width: 35, height: 32 };
		e.render.drawOffset = { x: 32, y: 192 };

		e.add(engine.components.text);
		e.text.message = "You found a strange rock.";

		e.add(engine.components.background);
		e.background.image = new Image();
		e.background.size = { width: 4, height: 4 };
		e.background.image.src = 'img/bg.png';

		return e;
	}
};

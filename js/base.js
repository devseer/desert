var Entity = function() {
	return this;
};

Entity.prototype.add = function(component) {
	var c = new Component();

	for (var i in component)
		c[i] = component[i];

	this[c.name] = c;
};

var Component = function(name, obj) {
	this.name = name;

	for (var i in obj)
		this[i] = obj[i];

	return this;
};

var System = function(obj) {
	this._components = [];
	this._cache = [];
	this.init = function() {};
	this.update = function() {};

	for (var i in obj)
		this[i] = obj[i];

	return this;
};

System.prototype.buildCache = function(entities) {
	for (var i = 0; i < entities.length; i++) {
		var str = true;

		for (var j in this._components) {
			if (!entities[i][this._components[j]]) {
				str = false;
				break;
			}
		}

		if (str) this._cache.push(i);
	}
};

System.prototype._entityList = function(entities, f) {
	for (var i = 0; i < this._cache.length; i++)
		f(entities[this._cache[i]]);
};

var Engine = function() {
	this.entities = [];
	this.systems = [];
	this.components = {};
	this.assemblages = {};
	this.context = {};

	this.addSystem = function(system) {
		this.systems.push(new System(system));
	};

	this.main = function(en) {
		for (var i in en.systems)
			en.systems[i].update(en.entities);

		requestAnimationFrame(function() { en.main(en) });
	};

	this.init = function() {
		var canvas = document.getElementById('game');
		canvas.width = 240;
		canvas.height = 240;
		this.context = canvas.getContext('2d');

		this.assemblages.init();

		for (var i in this.systems) {
			this.systems[i].buildCache(this.entities);
			this.systems[i].init(this.entities);
		}

		var en = this;
		requestAnimationFrame(function() { en.main(en) });
	};

	return this;
};

var engine = new Engine();

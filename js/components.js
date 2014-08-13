engine.components.position = new Component('position', {
	x: 0
	,y: 0
});

engine.components.render = new Component('render', {
	image: new Image()
	,size: { height: 16, width: 16 }
	,pos: { x: 0, y: 0 }
	,offset: { x: 0, y: 0 }
	,drawOffset: { x: 0, y: 0 }
	,repeat: { x: 0, y: 0 }
	,animated: false
});

engine.components.control = new Component('control', {
	enabled: true
	,delay: 200
	,up: 38
	,down: 40
	,left: 37
	,right: 39
});

engine.components.animation = new Component('animation', {
	lock: false
	,frame: 0
	,limit: 7
	,delay: 120
});

engine.components.map = new Component('map', {
	data:[]
	,size: { height: 128, width: 128}
	,tiles: []
});

engine.components.tileset = new Component('tileset', {
	image: new Image()
	,size: { height: 16, width: 16 }
});

engine.components.view = new Component('view', {
	size: { height: 15, width: 15 }
	,position: { x: 0, y: 0 }
});

engine.components.background = new Component('background', {
	image: {}
	,size: { height: 4, width: 4 }
	,padding: 4
});

engine.components.stat = new Component('stat', {
});

engine.components.text = new Component('text', {
	message: ''
	,color: '#ddd'
	,font: '7pt visitor'
	,padding: 16
});


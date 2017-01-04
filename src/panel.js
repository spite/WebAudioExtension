function f() {

	window.__Injected = true;

	//function log() { console.log( arguments ); }
	//function error() { console.error( arguments ); }
	//function log() {}
	//function error() {}

	function log( msg ) { logMsg( 'LOG: ' + msg )}
	function error( msg ) { logMsg( 'ERROR: ' + msg )}

	function logMsg() { 

		var args = [];
		for( var j = 0; j < arguments.length; j++ ) {
			args.push( arguments[ j ] );
		}
		window.postMessage( { source: 'WebAudioEditor', method: 'log', arguments: args }, '*');

	}

	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	/*function _h( f, c ) {
		return function() {
			var res = f.apply( this, arguments );
			res = c.apply( this, [ res, arguments ] ) || res;
			return res;
		}
	}

	function _h2( f, c ) {
		return function() {
			return c.apply( this, arguments );
		}
	}*/

	/*var references = {};

	function keepReference( f ) {

		references[ f ] = WebGLRenderingContext.prototype[ f ];

	}*/

	function _h( f, c ) {
		return function() {
			var res = f.apply( this, arguments );
			c.apply( res || this, arguments );
			return res;
		}
	}

	var AudioContext = AudioContext || webkitAudioContext || mozAudioContext;

	var contexts = {},
		nodes = []

	function getConstructorName( obj ) {
		if( obj.constructor.name ) {
			return obj.constructor.name;
		}
		var matches = obj.constructor.toString().match(/function (\w*)/);
		if( matches && matches.length ) {
			return matches[ 1 ];
		}
	}

	AudioNode.prototype.connect = _h( AudioNode.prototype.connect, function() { 
		if( getConstructorName( arguments[ 0 ] ) === 'AudioDestinationNode' && arguments[ 0 ].cyId === undefined ){
			addNode( arguments[ 0 ] );
		}
		log( this.cyId, arguments[ 0 ].cyId );

		window.postMessage( { source: 'WebAudioEditor', method: 'addEdge', from: this.cyId, to: arguments[ 0 ].cyId }, '*');

		log( 'Connect ' + getConstructorName( this ) + ' to ' + getConstructorName( arguments[ 0 ] ) );
	} );

	AudioNode.prototype.disconnect = _h( AudioNode.prototype.disconnect, function() { 
		log( 'Disconnect ' + getConstructorName( this ) );
	} );

	AudioBufferSourceNode.prototype.start = _h( AudioBufferSourceNode.prototype.start, function() { 
		log( 'AudioBufferSourceNode start' );
	} );

	var nodeNum = 0;

	function addNode( node ){
		var type = getConstructorName( node );
		log( 'Adding node ' + type + ' to graph' );
		nodes.push( node )
		node.cyId = nodeNum;
		nodeNum++;

		window.postMessage( { source: 'WebAudioEditor', method: 'addNode', id: node.cyId, label: type.replace( 'Node', '' ) }, '*');
		
	}

	function removeNode( node ){
		var type = getConstructorName( node );
		log( 'Removing node ' + type + ' from graph' );
		/*nodes.push( node )
		node.cyId = nodeNum;
		nodeNum++;*/

		window.postMessage( { source: 'WebAudioEditor', method: 'removeNode', id: node.cyId }, '*');
		
	}

	AudioContext.prototype.createBufferSource = _h( AudioContext.prototype.createBufferSource, function() {
		log( 'Create BufferSourceNode' );
		this.addEventListener( 'ended', function() { 
			log( 'ended' );
			removeNode( this );

		} ) ;
		addNode( this );
	} );

	AudioContext.prototype.createMediaElementSource = _h( AudioContext.prototype.createMediaElementSource, function() {
		log( 'Create MediaElementAudioSourceNode' );
		addNode( this );
	} );

	AudioContext.prototype.createMediaStreamDestination = _h( AudioContext.prototype.createMediaStreamDestination, function() {
		log( 'Create MediaStreamAudioDestinationNode' );
		addNode( this );
	} );

	AudioContext.prototype.createMediaStreamSource = _h( AudioContext.prototype.createMediaStreamSource, function() {
		log( 'Create MediaStreamAudioSourceNode' );
		addNode( this );
	} );

	AudioContext.prototype.createBuffer = _h( AudioContext.prototype.createBuffer, function() {
		log( 'Create BufferNode' );
		addNode( this );
	} );

	AudioContext.prototype.createGain = _h( AudioContext.prototype.createGain, function() {
		log( 'Create GainNode' );
		addNode( this );
	} );

	AudioContext.prototype.createPanner = _h( AudioContext.prototype.createPanner, function() {
		log( 'Create PannerNode' );
		addNode( this );
	} );

	AudioContext.prototype.createDynamicsCompressor = _h( AudioContext.prototype.createDynamicsCompressor, function() {
		log( 'Create DynamicsCompressorNode' );
		addNode( this );
	} );

	AudioContext.prototype.createDelay = _h( AudioContext.prototype.createDelay, function() {
		log( 'Create DelayNode' );
		addNode( this );
	} );

	AudioContext.prototype.createConvolver = _h( AudioContext.prototype.createConvolver, function() {
		log( 'Create ConvolverNode' );
		addNode( this );
	} );

	AudioContext.prototype.createChannelSplitter = _h( AudioContext.prototype.createChannelSplitter, function() {
		log( 'Create channelSplitter' );
		addNode( this );
	} );

	AudioContext.prototype.createChannelMerger = _h( AudioContext.prototype.createChannelMerger, function() {
		log( 'Create ChannelMerger' );
		addNode( this );
	} );

	AudioContext.prototype.createAnalyser = _h( AudioContext.prototype.createAnalyser, function() {
		log( 'Create AnalyserNode' );
		addNode( this );
	} );

	AudioContext.prototype.createBiquadFilter = _h( AudioContext.prototype.createBiquadFilter, function() {
		log( 'Create BiquadFilter' );
		addNode( this );
	} );

	AudioContext.prototype.createOscillator = _h( AudioContext.prototype.createOscillator, function() {
		log( 'Create Oscillator' );
		addNode( this );
	} );

	AudioContext.prototype.createPeriodicWave = _h( AudioContext.prototype.createPeriodicWave, function() {
		log( 'Create PeriodicWave' );
		addNode( this );
	} );

	AudioContext.prototype.createScriptProcessor = _h( AudioContext.prototype.createScriptProcessor, function() {
		log( 'Create ScriptProcessor' );
		addNode( this );
	} );

	AudioContext.prototype.createStereoPanner = _h( AudioContext.prototype.createStereoPanner, function() {
		log( 'Create StereoPanner' );
		addNode( this );
	} );

	AudioContext.prototype.createWaveShaper = _h( AudioContext.prototype.createWaveShaper, function() {
		log( 'Create WaveShaper' );
		addNode( this );
	} );

	AudioContext.prototype.decodeAudioData = _h( AudioContext.prototype.decodeAudioData, function() {
		log( 'decodeAudioData', arguments[ 0 ].byteLength );
	} );

	AudioContext.prototype.constructor = _h( AudioContext.prototype.constructor, function() {
		log( 'Constructor' );
	} );

	window.addEventListener( 'load', function() {
		window.postMessage( { source: 'WebAudioEditor', method: 'init' }, '*');
	} );

}

var links = document.querySelectorAll( 'a[rel=external]' );
for( var j = 0; j < links.length; j++ ) {
	var a = links[ j ];
	a.addEventListener( 'click', function( e ) {
		window.open( this.href, '_blank' );
		e.preventDefault();
	}, false );
}

var button = document.getElementById( 'reload' ),
	container = document.getElementById( 'container' ),
	info = document.getElementById( 'info' ),
	waiting = document.getElementById( 'waiting' ),
	log = document.getElementById( 'log' );

function logMsg() {

	var args = [];
	for( var j = 0; j < arguments.length; j++ ) {
		args.push( arguments[ j ] );
	}
	var p = document.createElement( 'p' );
	p.textContent = args.join( ' ' );
	log.appendChild( p );

}

logMsg( '- starting' );

var backgroundPageConnection = chrome.runtime.connect({
	name: 'panel'
});

backgroundPageConnection.postMessage({
	name: 'init',
	tabId: chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener( function( msg ) {

	switch( msg.method ) {
		case 'init':
			logMsg( 'init' );
			info.style.display = 'none';
			waiting.style.display = 'none';
			container.style.display = 'block';
			break;
		case 'addEdge':
			logMsg( JSON.stringify( msg ) );
			g.setEdge( msg.from, msg.to, { lineInterpolate: 'basis', arrowhead: 'normal' } );
			draw();
			break;
		case 'addNode':
			logMsg( JSON.stringify( msg ) );
			var options = { label: msg.label, rx: 5, ry: 5 };
			if( msg.label === 'AudioDestination' ) {
				options.style = 'fill: #addd92';
				options.labelStyle = 'fill: #254b10';
			}
			var n = g.setNode( msg.id, options );
			n.node.addEventListener( 'click', function( e ) {
				logMsg( 'click' );
			} );
			draw();
			break;
		case 'log':
			logMsg( msg.arguments );
			break;
	}

} );

button.addEventListener( 'click', function( e ) {
	chrome.devtools.inspectedWindow.reload( {
		ignoreCache: true, 
    	injectedScript: '(' + f.toString() + ')()'
	} );
} );

var g = new dagreD3.graphlib.Graph().setGraph({ rankdir: 'LR', nodesep: 20 });
var render = new dagreD3.render();
var svg = d3.select('svg'),
    svgGroup = svg.append('g');

var zoom = d3.behavior.zoom().on("zoom", function() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")" +
                                "scale(" + d3.event.scale + ")");
  });
svg.call(zoom);

var d = new dat.GUI();
var params = {};

var parameterRanges = {
	gain: { min: 0, max: 2 },
	detune: { min: 0, max: 1000 },
	frequency: { min: 0, max: 10000 },
	Q: { min: 0, max: 20 },
	playbackRate: { min: 0, max: 4 },
	delayTime: { min: 0, max: 1 }
};

function composePanel( node ) {

	d.destroy();
	d = new dat.GUI();

	for( var j in node ) {
		if( node[ j ] instanceof AudioParam ) {
			params[ j ] = node[ j ].value;
			(function( param ) {
				var c = d.add(params, param, parameterRanges[ param ].min, parameterRanges[ param ].max );
				c.onChange(function(value) {
					node[ param ].setValueAtTime( value, context.currentTime )
				});

				c.onFinishChange(function(value) {
					node[ param ].setValueAtTime( value, context.currentTime )
				})
			})(j);

		}
		if( node instanceof BiquadFilterNode && j == 'type' ){
			params[ 'type' ] = node.type;
			var param = j;
			var c = d.add(params, param, ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass' ] );
			c.onChange(function(value) {
				node[ param ] = value;
			});

			c.onFinishChange(function(value) {
				node[ param ] = value;
			})
		}

	}
}

window.addEventListener( 'resize', draw );

function draw(){

	svgGroup.each(function(d) { 
		if( !this.eventAttached ) {
			this.addEventListener( 'click', function() { 
				logMsg( 'CLICK' + JSON.stringify( this ));//composePanel( d );
			} );
			this.eventAttached = true;
		}
	});

	render(svgGroup, g);

}

function redraw() {

	draw();
	setTimeout( redraw, 100 );

}

//redraw();
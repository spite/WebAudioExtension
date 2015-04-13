var g = new dagreD3.Digraph();
var d3renderer = new dagreD3.Renderer();

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

var oldDrawNodes = d3renderer.drawNodes();
d3renderer.drawNodes(function(g, svg) {
	var svgNodes = oldDrawNodes(g, svg);

	// Set the title on each of the nodes and use tipsy to display the tooltip on hover
	svgNodes.each(function(d) { 
		var n = g.node( d );
		if( !this.eventAttached ) {
			this.addEventListener( 'click', function() { 
				composePanel( n.node );
			} );
			this.eventAttached = true;
		}
	});

  return svgNodes;
});

function draw(){

	var layout = dagreD3.layout()
                    .nodeSep(20)
                    .rankDir("LR");
	d3renderer.layout(layout).run(g, d3.select("svg g"));

}

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
	console.log( this.cyId, arguments[ 0 ].cyId );

	g.addEdge( null, this.cyId, arguments[ 0 ].cyId, { label: '' } );
	draw();

	console.log( 'Connect ' + getConstructorName( this ) + ' to ' + getConstructorName( arguments[ 0 ] ) );
} );

AudioNode.prototype.disconnect = _h( AudioNode.prototype.disconnect, function() { 
	console.log( 'Disconnect ' + getConstructorName( this ) );
} );

AudioBufferSourceNode.prototype.start = _h( AudioBufferSourceNode.prototype.start, function() { 
	console.log( 'AudioBufferSourceNode start' );
} );

var nodeNum = 0;

function addNode( node ){
	var type = getConstructorName( node );
	console.log( 'Adding node ' + type + ' to graph' );
	nodes.push( node )
	node.cyId = nodeNum;
	nodeNum++;

	g.addNode( node.cyId, { label: type, node: node } );
	draw();
	
}

AudioContext.prototype.createBufferSource = _h( AudioContext.prototype.createBufferSource, function() {
	console.log( 'Create BufferSourceNode' );
	this.addEventListener( 'ended', function() { console.log( 'AudioBufferSourceNode ended' ) } ) ;
	addNode( this );
} );

AudioContext.prototype.createGain = _h( AudioContext.prototype.createGain, function() {
	console.log( 'Create GainNode' );
	addNode( this );
} );

AudioContext.prototype.createPanner = _h( AudioContext.prototype.createPanner, function() {
	console.log( 'Create PannerNode' );
	addNode( this );
} );

AudioContext.prototype.createDynamicsCompressor = _h( AudioContext.prototype.createDynamicsCompressor, function() {
	console.log( 'Create DynamicsCompressorNode' );
	addNode( this );
} );

AudioContext.prototype.createDelay = _h( AudioContext.prototype.createDelay, function() {
	console.log( 'Create DelayNode' );
	addNode( this );
} );

AudioContext.prototype.createConvolver = _h( AudioContext.prototype.createConvolver, function() {
	console.log( 'Create ConvolverNode' );
	addNode( this );
} );

AudioContext.prototype.createAnalyser = _h( AudioContext.prototype.createAnalyser, function() {
	console.log( 'Create AnalyserNode' );
	addNode( this );
} );

AudioContext.prototype.createBiquadFilter = _h( AudioContext.prototype.createBiquadFilter, function() {
	console.log( 'Create BiquadFilter' );
	addNode( this );
} );

AudioContext.prototype.createOscillator = _h( AudioContext.prototype.createOscillator, function() {
	console.log( 'Create Oscillator' );
	addNode( this );
} );

AudioContext.prototype.decodeAudioData = _h( AudioContext.prototype.decodeAudioData, function() {
	console.log( 'decodeAudioData', arguments[ 0 ].byteLength );
} );

AudioContext.prototype.constructor = _h( AudioContext.prototype.constructor, function() {
	console.log( 'Constructor' );
} );
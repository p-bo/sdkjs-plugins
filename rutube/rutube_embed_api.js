var RutubeCore = function( id, readyFn ) {

	var context = null;
	if (typeof id === 'string') {
		if (id.indexOf('#') === 0) {
			id = id.slice(1);
		}
		context = RutubeCore.getContextById( id );
		if ( context['player'] != null ) {
			return context['player'];
		} 
	} else {
		id = id.id;
	}

	context = RutubeCore.getContextById( id );
	context['player'] = new RutubeCore.player( id, context['ready'], readyFn );
	return context['player'];

}

RutubeCore.guid = 0;
RutubeCore.players = {};
RutubeCore.bind = function(context, fn, uid) {
  if (!fn.guid) {
  	fn.guid = RutubeCore.guid++;
  }
  var ret = function() {
    return fn.apply(context, arguments);
  };
  ret.guid = (uid) ? uid + '_' + fn.guid : fn.guid;
  return ret;
};
RutubeCore.getContextById = function( contextId ) {
	var context = RutubeCore.players[ contextId ];
	if( context == undefined || context == null ) {
		context = 	{	
						player: null,
						ready: false
					};
		RutubeCore.players[ contextId ] = context;
	}
	return context;
}
RutubeCore.dispatcher = function( event ) {

	var playerEventMgs = 'player:';

	if( !event || !event.data )
		return;

	var eventData = JSON.parse( event.data );
	var type = eventData['type'];
	var data = eventData['data'];
	
	if( type == undefined ) // it is not our messages!
		return;

	// allow only messages from player
	if( type.indexOf( playerEventMgs ) != 0 )
		return;

	type = type.substring( playerEventMgs.length );

	// get playerId from data
	var playerId = data['playerId'];

	var context = RutubeCore.getContextById( playerId );

	context['ready'] = true;
	var player = context['player'];
	if( player ) {
		player.dispatch( type, data );
	}

}
RutubeCore.player = function( tagId, alreadyReady, readyFn ) {
	this._tagId = tagId,
	this._ready = readyFn,
	this._toggleReady = alreadyReady,
	this._callbacks = {};

	if( this._toggleReady && this._ready != undefined && ( typeof this._ready == 'function' ) )
		this._ready( returnObject );

	return this;
}
RutubeCore.player.prototype.isReady = function() {return this._toggleReady;};
RutubeCore.player.prototype.send = function( message ) {
	if( this._tagId )
		document.getElementById( this._tagId ).contentWindow.postMessage( JSON.stringify( message ), '*' );
};
RutubeCore.player.prototype.dispatch = function( type, data ) {

	if( type == 'ready' )
		this._toggleReady = true;

	if( this._ready != undefined && ( typeof this._ready == 'function' ) )
		this._ready( this );

	if( this._callbacks[ type ] != undefined && ( typeof this._callbacks[ type ] == 'function' ) )
		this._callbacks[ type ]( data );

};
RutubeCore.player.prototype.setUserData = function( userData ) {

	if( !userData ) {
		var msg = {data:userData, type:"player:setUserData"};
		this.send( msg );
	}

};
RutubeCore.player.prototype.play = function() {
	var msg = {data:{}, type:"player:play"}
	this.send( msg );
};
RutubeCore.player.prototype.pause = function() {
	var msg = {data:{}, type:"player:pause"}
	this.send( msg );
};
RutubeCore.player.prototype.change = function( data ) {
	var msg = {data:null, type:"player:changeVideo"}
	if (typeof data === 'string') {
		msg.data = { id: data };
	} else {
		msg.data = { params: data }
	}
	this.send( msg );
};
RutubeCore.player.prototype.setColor = function( color ) {
	var msg = {data:{color: color}, type:"player:setSkinColor"}
	this.send( msg );
};
RutubeCore.player.prototype.seek = function( time ) {
	var msg = {data:{time: time}, type:"player:setCurrentTime"}
	this.send( msg );
};
RutubeCore.player.prototype.relativeSeek = function( time ) {
	var msg = {data:{time : time}, type:"player:relativelySeek"}
	this.send( msg );
};
RutubeCore.player.prototype.registerCallback = function( event, callback ) {
	this._callbacks[ event ] = callback;
};
//RutubeCore.player.prototype. = ;

(function() {
	if ( window.addEventListener ) {
	    window.addEventListener( "message", RutubeCore.dispatcher, false );
	} else if (window.attachEvent) {
	    window.attachEvent( "onmessage", RutubeCore.dispatcher );
	}
}());
/**
 * Created by peter on 16-05-15.
 */
app.service( 'Mutations', [ '$http','$cookies', function( $http, $cookies ){
	var mutations = [];
	this.useJsonServer = 1;

	this.all = function( cb ){
		if( this.useJsonServer ) {
			$http.get('http://localhost:3000/mutations').success( cb ).error(function (msg) {
				console.log( "json server offline. set useJsonServer flag to false" );
			});
		}
		else { // use cookies
			this.getCookie( cb );
		}
	}

	this.writeCookie = function(){
		$cookies[ 'myHBoekjeMutaties' ] = JSON.stringify( mutations );
	}
	this.getCookie = function( cb ){
		var cookieJson = $cookies['myHBoekjeMutaties'];
		if( cookieJson != "undefined" && cookieJson != null && cookieJson!="" ) {
			mutations = JSON.parse(cookieJson);
			cb(mutations);
		}
		else {
			mutations = [];
			this.writeCookie();
			cb( mutations );
		}
	}
	this.add = function( data, cb ) {
		if( this.useJsonServer ){
			$http.post('http://localhost:3000/mutations/', data).success( cb );
		}
		else {
			mutations.push( data );
			this.writeCookie();
			cb();
		}
	}
	this.put = function( id, data, cb ) {
		if (this.useJsonServer) {
			$http.put('http://localhost:3000/mutations/' + id, data).success( cb );
		}
		else {
			for (var i = 0; i < mutations.length; i++) {
				if( mutations[i].id==id ){
					mutations[i] = data;
					this.writeCookie();
					cb();
					return;
				}
			}
		}
	}

	/*this.get = function( id ){
		if( this.useJsonServer ){
			$http.put('http://localhost:3000/mutations/' + id ).success( cb );
		}
		else {
			for( var i=0; i<mutations.length; i++ ){

			}
		}
	}*/

	this.delete = function( id, cb ){
		if( this.useJsonServer ){
			$http.delete( 'http://localhost:3000/mutations/'+id).success( cb );
		}
		else {
			for( var i=0; i<mutations.length; i++ ){
				if( mutations[i].id==id ){
					mutations.splice( i, 1 );
					this.writeCookie();
					cb();
					return;
				}
			}
		}
	}


}] );

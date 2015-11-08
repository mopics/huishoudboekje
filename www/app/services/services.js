/**
 * Created by peter on 16-05-15.
 */
app.service( 'Mutations', [ '$http','$cookies', function( $http, $cookies ){
	var mutations = [];
	var bankAmount = [];
	var dbUrl = 'http://localhost:3113/';
	this.useJsonServer = 0;

	this.getBankamount = function( cb ){
		if( this.useJsonServer ){
			$http.get( dbUrl+'bank/' ).success( cb ).error(function (msg) {
				console.log( "json server offline." );
			});
		}
		else {
			this.getAmountCookie( function(){
				cb( {amount:bankAmount} );
			} );
		}
	}
	this.getMutations = function( cb ){
		if( this.useJsonServer ){
			$http.get( dbUrl+'mutations/' ).success( cb ).error(function (msg) {
				console.log( "json server offline." );

			});
		}
		else {
			this.getMutationsCookie( function(){
				cb( mutations );
			} );
		}
	}

	this.amount = function( amount, cb ){
		if( this.useJsonServer ) {
			$http.post(dbUrl + 'bank/', { amount: amount }).success(cb);
		}
		else {
			bankAmount = amount;
			this.writeAmountCookie();
			cb();
		}
	}
	this.add = function( data, cb ) {
		if( this.useJsonServer ) {
			$http.post(dbUrl + 'mutations/', data).success(cb);
		}
		else {
			mutations.push( data );
			this.writeMutationsCookie();
			cb();
		}
	}
	this.put = function( id, data, cb ) {
		if( this.useJsonServer ) {
			$http.put(dbUrl + 'mutations/' + id, data).success(cb);
		}
		else {
			var m = this.getMutationIdxByUid( id );
			if( m ) {
				mutations[m.idx] = m.mutation;
				this.writeMutationsCookie();
				cb();
			}
		}
	}

	/*this.get = function( id ){
		$http.put( dbUrl+'mutations/' + id ).success( cb );
	}*/

	this.delete = function( id, cb ) {
		if( this.useJsonServer ) {
			$http.delete(dbUrl + 'mutations/' + id).success(cb);
		}
		else {
			var m = this.getMutationIdxByUid( id );
			if( m ){
				mutations.splice(m.idx, 1 );
				this.writeMutationsCookie();
				cb();
			}
		}
	}

	this.getMutationIdxByUid = function( uid ){
		for( var i=0; i<mutations.length; i++ ){
			if( uid==mutations[i].id ){
				return { idx:i, mutation:mutations[i] };
			}
		}
		console.log( "Mutation id:"+uid+" not found in mutation list" );
	}

	/**
	 * Cookie methods
	 */
	this.writeMutationsCookie = function(){
		$cookies[ 'myHBoekjeMutaties' ] = JSON.stringify( mutations );
	}
	this.writeAmountCookie = function(){
		$cookies[ 'myHBoekjeBankAmount'] = bankAmount;
	}
	this.getMutationsCookie = function( cb ){
		var cookieJson = $cookies['myHBoekjeMutaties'];
		if( cookieJson != "undefined" && cookieJson != null && cookieJson!="" ) {
			mutations = JSON.parse(cookieJson);
			cb(mutations);
		}
		else {
			mutations = [
				{
					"id": 0,
					"name": "huur",
					"amount": -400,
					"monthday": 3,
					"monthly": 1,
					"due": true,
					"dueToday": false
				},
				{
					"id": 4,
					"name": "verzekeringen",
					"amount": -160.14,
					"monthday": 4,
					"monthly": 1,
					"due": true,
					"dueToday": false
				},
				{
					"id": 7,
					"name": "elektriciteit",
					"amount": -74,
					"monthday": 5,
					"monthly": 1,
					"due": true,
					"dueToday": false
				},
				{
					"id": 9,
					"name": "greenpeace",
					"amount": -2.27,
					"monthday": 24,
					"monthly": 1,
					"due": 0
				},
				{
					"id": 11,
					"name": "Telefoon & Internet",
					"amount": -65,
					"monthday": 26,
					"monthly": 1,
					"due": 0
				},
				{
					"id": 18,
					"name": "Loon",
					"amount": 2999,
					"monthday": 2,
					"monthly": 1,
					"due": false,
					"mainincome": true,
					"dueToday": false
				},
				{
					"id": 19,
					"name": "Water",
					"amount": -13,
					"monthday": 10,
					"monthly": 1,
					"due": false,
					"dueToday": false
				}
			];
			this.writeMutationsCookie();
			cb( mutations );
		}
	}
	this.getAmountCookie = function( cb ){
		var cookieJson = $cookies['myHBoekjeBankAmount'];
		if( cookieJson != "undefined" && cookieJson != null && cookieJson!="" ) {
			bankAmount = JSON.parse(cookieJson);
		}
		else {
			bankAmount = 210;
		}
		cb();
	}


}] );

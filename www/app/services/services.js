/**
 * Created by peter on 16-05-15.
 */
app.service( 'Mutations', [ '$http','$cookies', function( $http, $cookies ){
	var mutations = [];
	var dbUrl = 'http://localhost:3113/';

	this.getBankamount = function( cb ){
		$http.get( dbUrl+'bank/' ).success( cb ).error(function (msg) {
			console.log( "json server offline." );
		});
	}
	this.getMutations = function( cb ){
		$http.get( dbUrl+'mutations/' ).success( cb ).error(function (msg) {
			console.log( "json server offline." );
		});
	}

	this.amount = function( amount, cb ){
		$http.post( dbUrl+'bank/', { amount:amount }).success( cb );
	}
	this.add = function( data, cb ) {
		$http.post( dbUrl+'mutations/', data).success( cb );
	}
	this.put = function( id, data, cb ) {
		$http.put( dbUrl+'mutations/' + id, data).success( cb );
	}

	/*this.get = function( id ){
		$http.put( dbUrl+'mutations/' + id ).success( cb );
	}*/

	this.delete = function( id, cb ) {
		$http.delete( dbUrl+'mutations/'+id).success( cb );
	}


}] );

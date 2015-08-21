/**
 * Created by peter on 16-05-15.
 */

var mutaties = [];
var jsonServerError = 0;
var uniqueId = 0;

app.controller( "MutatiesController", function( Mutations, $scope, $http, $location ) {

	//==============================================MODEL INIT=======================================================//
	$scope.day = new Date().getUTCDate();
	$scope.mainIncomeDay = 0;
	$scope.toSpend = 0;
	$scope.toSpendPerDay = 0;
	$scope.bankAmount = 0;
	$scope.calculationDone = false;

	// callback mutaties loaded:
	function mutatiesLoaded( data ) {
		mutaties = data;
		// find main income day
		for( var i in mutaties ) {
			var item = mutaties[i];
			if( item.mainincome ){ $scope.mainIncomeDay = item.monthday; break; }
		}
		$scope.daysTillNextMainIncome = 31-$scope.day+$scope.mainIncomeDay;
		// set due flags and uniqueId:
		for( var i in mutaties ) {
			var item = mutaties[i];
			item.due = item.monthday < $scope.mainIncomeDay || item.monthday > $scope.day;
			item.dueToday = $scope.day == item.monthday && item.due;
			if( item.id > uniqueId )
				uniqueId = item.id;
		}
		// sort on date
		mutaties.sort(function(a, b){
			return a.monthday- b.monthday;
		});
		$scope.vasteMutaties = mutaties;
	}
	function bankAmountLoaded( data ){
		$scope.bankAmount = data.amount;
	}
	// get mutations from service:
	Mutations.getMutations( mutatiesLoaded );
	Mutations.getBankamount( bankAmountLoaded );
	// get bank amount from service

	//==============================================METHODS ========================================================//
	// todo make a service out of this function, just for the fun of it.
	function round( nr ) {
		return Math.round( 100*nr )/100;
	}

	$scope.calculateAllowedExpenses = function() {

		//update db.amount
		Mutations.amount( $scope.bankAmount, function(){} );


		if( !$scope.vasteMutaties ) return;

		toSpend = parseInt( $scope.bankAmount );
		var day = $scope.day;

		console.log( "day:"+day);
		console.log( "bankAmount:"+$scope.bankAmount);
		for( var i=0; i<$scope.vasteMutaties.length; i++ ) {

			var m = $scope.vasteMutaties[i];

			if( m.due) {

				toSpend += m.amount;

			}
		}

		$scope.toSpend = round( toSpend );
		$scope.toSpendPerDay = round( toSpend/$scope.daysTillNextMainIncome );
		$scope.calculationDone = true;
	}

	$scope.mutationClicked = function( id ) {
		$location.path( 'view/'+id );
	}

	//============================================== WATCH ========================================================//
	$scope.$watch( 'bankAmount', $scope.calculateAllowedExpenses );
});

app.controller( "MutatieController", function( Mutations, $scope, $http, $routeParams, $location ) {

	//=============================================MODEL INIT========================================================//
	$scope.addNewMode = false;
	// callback mutaties loaded:
	function mutatiesLoaded( data ) {

		mutaties = data;

		initMutation();
	}

	if( mutaties.length == 0 && !jsonServerError ) {
		// if mutations not set ( due 2 page refresh f.e. ) get them again
		Mutations.all( mutatiesLoaded );
	}
	else {
		initMutation();
	}

	//===============================================METHODS ========================================================//
	function initMutation() {
		if( $routeParams.id ) {
			for (var i = 0; i < mutaties.length; i++) {
				if (mutaties[i].id == $routeParams.id) {
					$scope.mutatie = mutaties[i];
					break;
				}
			}
		} else {
			// we are in add new mutatie - mode
			$scope.addNewMode = true;
			var id = 0;
			if( mutaties.length>0 ){
				uniqueId += 1;
				id = uniqueId;
			}
			$scope.mutatie =
			{
				"id": id,
				"name": "",
				"amount": 0,
				"monthday": 1,
				"monthly": 1,
				"due": false
			};

		}
	}
	$scope.cancel = function( ) {
		$location.path( '/' );
	}
	$scope.save = function( ) {
		// if this mutaties mainincome was checked set others to false: there can be only one!
		if( $scope.mutatie.mainincome ) {
			for (var i = 0; i < mutaties.length; i++) {
				if( mutaties[i].id==$scope.mutatie.id ){ continue; }
				if (mutaties[i].mainincome) {
					mutaties[i].mainincome = false;
					Mutations.put( mutaties[i].id, mutaties[i] );
				}
			}
		}

		if( $scope.addNewMode ){
			Mutations.add( $scope.mutatie, function(){
				$location.path('/');
			} )
		}
		else {
			Mutations.put( $scope.mutatie.id, $scope.mutatie, function(){
				$location.path('/');
			});
		}
	}
	$scope.delete = function(){
		Mutations.delete( $scope.mutatie.id, function(){
			$location.path('/');
		} );
	}

});
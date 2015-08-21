/**
 * Created by peter on 16-05-15.
 */

// create main app reference ( the spider in the web )
var app = angular.module( "huishoudboekApp", ['ngCookies', 'ngRoute'] );

// setup route-config
function routeConfig( $routeProvider ) {
	$routeProvider.
		when('/', {
			controller:'MutatiesController',
			templateUrl: 'partials/list.html'
		}).
		when('/view/:id',{
			controller:'MutatieController',
			templateUrl: 'partials/detail.html'
		}).
		when('/new/',{
			controller:'MutatieController',
			templateUrl: 'partials/detail.html'
		}).
		otherwise( {
			redirectTo:'/'
		});
}
app.config( routeConfig );

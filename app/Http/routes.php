<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::post('user', function() {
	if (Auth::check()) {
		return response()->json(Auth::user()); 
	} else {
		return response()->json((object)[]);
	}
});

Route::get('/scenario/{scenario}', function() {
	sleep(1); // a temporary delay for the loader screen
	return [
		'title' => 'My First Map Pack',
		'description' => 'This is my description',
		'images' => [
			'#' => '',
			'.' => '',
			'@' => '',
			'+' => '',
			'$' => '',
			'*' => ''
		],
		'levels' => [
			[
				'title' => 'Level 1',
				'map' => '7#|#.@-#-#|#$*-$-#|#3-$-#|#-..--#|#--*--#|7#'
			],
			[
				'title' => 'Level 2',
				'map' => '3#|#.3#|#*$-#|#--@#|5#'
			]			
		]
	];
});

Route::auth();

Route::get('/home', 'HomeController@index');

Route::get('/', function () {
    return view('lander');
});

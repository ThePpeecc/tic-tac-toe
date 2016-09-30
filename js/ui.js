/**
 * This file holds the ui logic for the tic tac toe game.
 * It controls all of the ui elements of the page and the game.
 * It uses the gameLogic.js module to calculate results,
 * the ai configeration and play.
 *
 * @summary   The module runs takes care of the ui of this application
 *
 * @link      URL
 * @since     27.09.2016
 * @requires jquery-3.1.0.js | gameLogic.js
**/

//Holds the ui module
var ui = function( ){
  "use strict";

  //We hide the finish html code at the start
  $('#finish').hide();

  //Button event that happens when user presses the start game button
  $('#start .button').click(function(event) {//click event
    $('#start').fadeOut('slow', function() {//fade out the start screen

      //Instantiate gameLogic here
      gameLogic.currentPlayer = 'o';
    });
  });

  //Event handelser for when mouse enters a tile
  var playerEnterHover = function( event ) {
    var tile = $(event.currentTarget);
    if (!tile.hasClass('o') && !tile.hasClass('x')) {
      var currentPlayerSvg = $('<img>').attr('src', 'img/' + gameLogic.currentPlayer + '.svg').css('width', '100%');
      tile.append(currentPlayerSvg);
    }
  };


  //Event handelser for when mouse leaves a tile
  var playerLeaveHover = function( event ) {
    var tile = $(event.currentTarget);
    if (!tile.hasClass('o') && !tile.hasClass('x')) {
      tile.empty();
    }
  };


  function playerFocus( newPlayer, tile ) {
    $('#' + newPlayer).addClass('active');
    gameLogic.move(tile.attr('value'), newPlayer, function(winnerFound) {
      //Handler when move is done
      if(winnerFound) {
        $('#finish .message').text('Winner').after($('<img>').attr('src', 'img/' + gameLogic.currentPlayer + '.svg'));
        $('#finish').css('background-color', 'orange').show('slow', function() {

        });
      }
    });
  }


  //Event handelser for when user press's a tile
  var playerPress = function( event ) {

      var tile = $(event.currentTarget);
      $('.active').removeClass('active');
      tile.addClass(gameLogic.currentPlayer);
    switch (gameLogic.currentPlayer) {
      case 'o':
        playerFocus('x', tile);
      break;
      case 'x':
        playerFocus('o', tile);
      break;
    }

  };

  $('.box').mouseenter(playerEnterHover).mouseleave(playerLeaveHover).click(playerPress);


}();

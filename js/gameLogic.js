/*jshint esnext: true */
/**
 * This file holds the game logic for the tic tac toe game.
 * It operates independet of a ui module, and therefore needs a
 * ui module to display the results of the logic.
 *
 * @summary   The module runs the game logic, this includes ai and two player mode
 *
 * @link      URL
 * @since     27.09.2016
 * @requires jquery-3.1.0.js
**/

var gameLogic = function( exportLogic ) {
  "use strict";

  exportLogic = {
    bord: [ "", "", "", "", "", "", "", "", "" ],
    ai: false,
    nunmberOfMoves: 0,
    currentPlayer: "",

  };

  //Tjeks who has won
  var didWin = function() {

    var winCombinations = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],

      [1, 4, 7],

      [2, 5, 8],
      [2, 4, 6],

      [3, 4, 5],

      [6, 7, 8]
    ];

    var theBord = exportLogic.bord;

    for (var combination of winCombinations) {
      if (theBord[combination[0]] === theBord[combination[1]] &&
          theBord[combination[0]] === theBord[combination[2]] &&
          theBord[combination[0]] !== "") {
            return true;
      }
    }
    return false;
  };

  //The move function will
  exportLogic.move = function( atLoaction, newPlayer, completionOfMove) {
    this.nunmberOfMoves++;
    this.bord[atLoaction] = this.currentPlayer; //We mark the location of the move
    this.currentPlayer = newPlayer; //We change player
    completionOfMove(didWin()); //We return the function with a bool, that is true if it was the winning move
  };

  //Ai move or something
  exportLogic.doMove = function() {

  };

  return exportLogic;
}();

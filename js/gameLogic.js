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


/**
 * Game Logic function, that creates the gameLogic object
 * @return {[object]} [We return the gameLogic object]
 */
var gameLogic = function() {
    "use strict";

    /**
     * the variables and functions we export out of this module
     * @type {Object}
     */
    var exportLogic = {
        bord: [],
        ai: false,
        nunmberOfMoves: 0,
        currentPlayer: "",
        drawCall: function() {}
    };

    /**
     * Function that tjeks if anyone has won
     * @return {[bool]} [We return true if someone won, and false if not]
     */
    var didWin = function() {

        /**
         * Here we hold all the win combinations
         * Possibly not nessesary to manualy write all the possible way's one can win
         * but I am too lazy to find a smarter way when there only is 8 possible way's
         * one can win
         * @type {Array}
         */
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

        var theBord = exportLogic.bord; //Make a copy of the bord, because DRY

        for (var combination of winCombinations) { //We run throug all combinations
            if (theBord[combination[0]] === theBord[combination[1]] &&
                theBord[combination[0]] === theBord[combination[2]] &&
                theBord[combination[0]] !== "") { //If one of the combinations all have the same value, we return ture
                return true;
            }
        }
        return false; //else we return false
    };

    /**
     * The move function will take care of the logic when moving ie.
     * adding a used space to the bord arry
     * counting number of turns
     * tjekking if anyone has won, or if it is a draw
     * @param  {[Int]} atLoaction             [The location there has been added an x or o]
     * @param  {[String]} newPlayer           [The nex player's turn that made the move]
     * @param  {[function]} completionOfMove  [The function that handels the ui]
     * @return {[nil]}                        [We dont return anything]
     */
    exportLogic.move = function(atLoaction, newPlayer, completionOfMove) {
        this.nunmberOfMoves++;
        this.bord[atLoaction] = this.currentPlayer; //We mark the location of the move
        /*
          We return the completionOfMove function with a bool, that is true
          if it was the winning move and else is false
        */
        completionOfMove(didWin());
        this.currentPlayer = newPlayer; //We change the player

        if (this.nunmberOfMoves === 8 && !didWin()) { //We tjek if it is a draw
            this.drawCall();
        }
    };

    /**
     * Function that takes care of starting a new game by resetting variables and functions
     * @param  {[String]} startPlayer    [Player that starts, ie. o or x]
     * @param  {[bool]} aiPlayer         [if we want to use an ai player]
     * @param  {[funciton]} drawFunction [callback function incase we detect a draw, the we call this funcition]
     * @return {[nil]}                   [we dont return anything]
     */
    exportLogic.newGame = function(startPlayer, aiPlayer, drawFunction) {

        if (aiPlayer) {
            //We add an ai player
        }
        //We reset the games variables and functions
        this.drawCall = drawFunction;
        this.currentPlayer = startPlayer;
        this.bord = ["", "", "", "", "", "", "", "", ""];
        this.nunmberOfMoves = 0;
    };

    //Ai move or something
    exportLogic.doMove = function() {

    };

    //We return with the buildt module
    return exportLogic;
}();

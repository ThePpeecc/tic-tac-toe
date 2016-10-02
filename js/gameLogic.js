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
        nunmberOfMoves: 0,
        turnOfMoves: [],
        currentPlayer: "",
        drawCall: function() {},
        ai: false,
        aiTurn: false,
        aiUiFunction: function() {},
        aiData: {},
        aiPlayerAvatar: "x",
        playerAvatar: "o"
    };


    /**
     * Function that tjeks if anyone has won
     * @return {[bool]} [We return true if someone won, and false if not]
     */
    var didWin = function(bord) {

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

        var theBord = bord; //Make a copy of the bord, because DRY

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
     * This function generates the ai data, that the ai uses to choses to plan it moves with
     * @param  {[Object]} lastDataObject [This function is recursive, and therefore uses it's paraents dataObject for refrence]
     * @return {[Object]}                [We return the dataObject, wich is the same type as the lastDataObject]
     */
    function generateAi(lastDataObject) {

        if (lastDataObject.numberOfCalculatedMoves === 9) { //If it is a draw,
            return lastDataObject; //We just return
        }

        var dataObject = lastDataObject;
        dataObject.aiChildren.length = 0; //We remove all aiChildren from the parents dataObject

        //To save some brainpower we only start calculating if we won after we have made 5 moves
        if (dataObject.numberOfCalculatedMoves >= 5 && didWin(dataObject.aiBord)) {

            if (dataObject.aiTurn) { //If it is the ai's turn then it must be the player whom have won
                dataObject.numberOfWins--; //We subtract a number of wins since we lost
            } else {
                dataObject.numberOfWins++; //The ai made the good move, so we add a win
            }
            return dataObject; //We return since there is no reason to continue after someone has won
        }

        //We run through the bord
        for (var i = 0; i < 9; i++) {
            if (dataObject.aiBord[i] === "") { //If we have an empty spot

                var modifidedObject = {
                    aiBord: [],
                    aiChildren: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
                    numberOfWins: 0,
                    moveID: i,
                    numberOfCalculatedMoves: dataObject.numberOfCalculatedMoves,
                    aiTurn: false
                };

                modifidedObject.aiBord = modifidedObject.aiBord.concat(dataObject.aiBord); //We add the old bord
                modifidedObject.numberOfCalculatedMoves++;

                if (dataObject.aiTurn) { //If it is the ai's turn
                    modifidedObject.aiBord[i] = exportLogic.aiPlayerAvatar; //we add the ai avatar
                } else {
                    modifidedObject.aiTurn = true; //the next turn is then the ai's turn
                    modifidedObject.aiBord[i] = exportLogic.playerAvatar; //we add the player's avatar
                }
                var newChildAi = generateAi(modifidedObject); //We generate a new child ai
                dataObject.aiChildren[i] = newChildAi;
                dataObject.numberOfWins += newChildAi.numberOfWins; //We add the childs numberOfWins
            }
        }
        return dataObject; //We return the dataObject / ai data
    }



    /**
     * The move function will take care of the logic when moving ie.
     * adding a used space to the bord array
     * counting number of turns
     * tjekking if anyone has won, or if it is a draw
     * @param  {[Int]} atLoaction             [The location there has been added an x or o]
     * @param  {[String]} newPlayer           [The nex player's turn that made the move]
     * @param  {[function]} completionOfMove  [The function that handels the ui]
     * @return {[nil]}                        [We dont return anything]
     */
    exportLogic.move = function(atLoaction, newPlayer, completionOfMove) {
        this.nunmberOfMoves++;
        this.turnOfMoves.push(atLoaction);
        this.aiTurn = !this.aiTurn;
        this.bord[atLoaction] = this.currentPlayer; //We mark the location of the move
        /*
          We return the completionOfMove function with a bool, that is true
          if it was the winning move and else is false
        */
        completionOfMove(didWin(this.bord));
        this.currentPlayer = newPlayer; //We change the player

        if (this.nunmberOfMoves === 8 && !didWin(this.bord)) { //We tjek if it is a draw
            this.drawCall();
        }

        if (this.ai && this.aiTurn && !didWin(this.bord)) { //If we have ai on, and it is it's turn
            this.aiUiFunction(this.doAiMove()); //We do an ai move
        }
    };

    /**
     * Function that takes care of starting a new game by resetting variables and functions
     * @param  {[String]} startPlayer    [Player that starts, ie. o or x]
     * @param  {[bool]} aiPlayer         [if we want to use an ai player]
     * @param  {[funciton]} drawFunction [callback function incase we detect a draw, the we call this funcition]
     * @return {[nil]}                   [we dont return anything]
     */
    exportLogic.newGame = function(startPlayer, aiPlayer, drawFunction, aiFunc) {

        //We reset the games variables and functions
        this.aiUiFunction = aiFunc;
        this.turnOfMoves.length = 0;
        this.drawCall = drawFunction;
        this.ai = aiPlayer;
        this.aiTurn = false;
        this.currentPlayer = startPlayer;
        this.bord = ["", "", "", "", "", "", "", "", ""];
        this.nunmberOfMoves = 0;
    };

    /**
     * Ai's turn move funciton
     * @return {[int]} [we return the id of the loactions the ai want to move to]
     */
    exportLogic.doAiMove = function() {
        var aiMove = this.aiData; //We make a copy of aiData
        for (var turn of this.turnOfMoves) { //We find the newest turn that we have made it too
            aiMove = aiMove.aiChildren[turn];
        }

        var bestWinRate = -10000000000;
        var moveIdentifier = 0;

        for (var move of aiMove.aiChildren) { //we run through for every move that we can make
            if (move !== undefined) {
                if (move.numberOfWins > bestWinRate) { //If it is a better move
                    bestWinRate = move.numberOfWins;
                    moveIdentifier = move.moveID; //we take the move id
                } else if (move.numberOfWins == bestWinRate) { //If there is the same chance of winning this way
                    if (Math.floor(Math.random() * 2) + 1 > 1) { //We roll a die and mabye take it
                        moveIdentifier = move.moveID;
                    }
                }
            }
        }
        return moveIdentifier; //We return the id we think is the best won
    };


    /**
     * This is the start data, that we use to generate the ai's data profile
     * @type {Object}
     */
    var startDataObject = {
        aiBord: ["", "", "", "", "", "", "", "", ""],
        aiChildren: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        numberOfWins: 0,
        numberOfCalculatedMoves: 0,
        moveID: 0,
        aiTurn: false
    };

    //We generate the aiData
    exportLogic.aiData = generateAi(startDataObject);



    //We return with the buildt module
    return exportLogic;
}();

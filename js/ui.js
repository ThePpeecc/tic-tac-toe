/*jshint esnext: true */
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

/**
 * Holds the ui module
 * @return {[nil]} [this is just a function that applys all the interactivity to the game and page]
 */
var ui = function() {
    "use strict";

    /**
     * This functions takes care of switching the focus between the two players / ai
     * @param  {[String]} newPlayer            [the next player we shall focus on]
     * @param  {[jQuery DOM object]} tile      [this holds the tile that the player pressed, in this case it is a li object]
     * @return {[nil]}                         [we don't return anything]
     */
    function playerFocus(newPlayer, tile) {
        $('.active').removeClass('active'); //We remove the active class from the current player
        tile.addClass(gameLogic.currentPlayer); //We add the class of the currentPlayer, so the css syles will be added to the tile
        $('#' + newPlayer).addClass('active');
        gameLogic.move(tile.attr('value'), newPlayer, function(winnerFound) {
            //Handler when move is done
            if (winnerFound) {
                $('#finish .message').text($('#' + gameLogic.currentPlayer + ' .playerName')[0].innerHTML + ' Wins!'); //Display the winning player
                $('#finish').addClass('screen-win-' + gameLogic.currentPlayer).show('slow', function() { //Show the win screen

                });
            }
        });
    }

    /**
     * This function takes care of the ui for the ai
     * @param  {[int]} moveID [When the ai moves, it send the id of the location to the move function, this id is between 0-8]
     * @return {[nil]}        [we don't return anything]
     */
    var aiMoveFunction = function(moveID) {
        var tile = $('.box').eq(moveID);
        if (!tile.hasClass('o') && !tile.hasClass('x')) { //in case we havent selected the tile
            var currentPlayerSvg = $('<img>').attr('src', 'img/' + gameLogic.currentPlayer + '.svg').css('width', '100%'); //Add an svg to the tile
            tile.append(currentPlayerSvg);
        }
        playerFocus('o', tile);
    };

    /**
     * Function that resest and clears the bord
     * @return {[nil]} [we don't return anything]
     */
    function clearBord() {
        //We remove the classe's from all the li objects, and then emptys them afterwards
        $('.box').removeClass('x').removeClass('o').empty();
    }

    /**
     * Sets up a new game
     * @return {[nil]} [we don't return anything]
     */
    function setupGame() {
        gameLogic.newGame('o', $('#playAi')[0].checked, draw, aiMoveFunction); //Setup the gameLogic
    }

    /**
     * This function displays the draw screen if the game ends in a draw
     * @return {[nil]} [we don't return anything]
     */
    var draw = function() {
        $('#finish .message').text("It's a Tie!"); //Change the message text
        $('#finish').addClass('screen-win-tie').show('slow', function() { //Show the screen

        });
    };

    /**
     * Function that starts of a game
     * @param  {[jQuery event]} event [Event from a mouse click]
     * @return {[nil]}       [we don't return anything]
     */
    var startGame = function(event) {
        $('#playerNameOne').text($('#playerOneInput')[0].value); //We get the names the players input, and display them
        $('#playerNameTwo').text($('#playerTwoInput')[0].value);

        $('#start').fadeOut('slow', function() { //fade out the start screen
            //We instantiate the gameLogic
            setupGame();
        });
    };

    /**
     * Event handelser for when mouse enters a tile
     * @param  {[jQuery event]} event [Event from a mouse hovering over an li object]
     * @return {[nil]}                [we don't return anything]
     */
    var playerEnterHover = function(event) {
        var tile = $(event.currentTarget);
        if (!tile.hasClass('o') && !tile.hasClass('x')) { //in case we havent selected the tile
            var currentPlayerSvg = $('<img>').attr('src', 'img/' + gameLogic.currentPlayer + '.svg').css('width', '100%'); //Add an svg to the tile
            tile.append(currentPlayerSvg);
        }
    };

    /**
     * Event handelser for when mouse leaves a tile
     * @param  {[jQuery event]} event [Event from a mouse no longer hovering over an li object]
     * @return {[nil]}                [we don't return anything]
     */
    var playerLeaveHover = function(event) {
        var tile = $(event.currentTarget);
        if (!tile.hasClass('o') && !tile.hasClass('x')) {
            tile.empty(); //and empty it if it is not selected
        }
    };

    /**
     * Event handelser for when user press's a tile
     * @param  {[jQuery event]} event [Event from a mouse click on any of the .box li objects]
     * @return {[nil]}                [we don't return anything]
     */
    var playerPress = function(event) {
        var tile = $(event.currentTarget);
        if (!tile.hasClass('o') && !tile.hasClass('x')) { //We tjek if the tile allready is selceted
            switch (gameLogic.currentPlayer) { //We focus on the next player
                case 'o':
                    playerFocus('x', tile);
                    break;
                case 'x':
                    playerFocus('o', tile);
                    break;
            }
        }
    };

    /**
     * Event function that restarts the game
     * @return {[nil]} [we don't return anything]
     */
    var playAgain = function(event) {
        clearBord();
        setupGame();
        $('#finish').removeClass('screen-win-x').removeClass('screen-win-o').removeClass('screen-win-tie').hide('slow', function() {
            //We remove all the different classes and hide the win screen again
        });
    };

    //We hide the finish html code at the start
    $('#finish').hide();

    //We add all the events
    $('#start .button').click(startGame);
    $('.box').mouseenter(playerEnterHover).mouseleave(playerLeaveHover).click(playerPress);
    $('#finish .button').click(playAgain);

}();

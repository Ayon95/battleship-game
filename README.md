# Battleship

A JavaScript implementation of the popular Battleship game.

This project helped me practice DOM manipulation, state management, and problem-solving skills. Some of the difficult challenges that I faced were coming up with a way to randomly generate ship locations, and developing an algorithm to check whether the locations are valid or not.

## How The Game Works

- The game board is a 7x7 grid
- Three ships will be randomly generated at the beginning of the game
- A ship will occupy three consecutive cells either in the horizontal or vertical direction
- If the player clicks on a cell that is occupied by a ship, then a hit will be registered on that ship
- If the player clicks on an empty cell, then it will be a miss, and a point will be deducted
- A ship will be destroyed once all three of its cells are hit
- The player will get 15 shots to destroy all the ships

Link to the app: https://ayon95.github.io/js-battleship/

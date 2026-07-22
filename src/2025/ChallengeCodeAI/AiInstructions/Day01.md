# Day 01 — AI Instructions

Please create a file for Day 1 of 2025 for AI code challenge. Do not refer to any other file in the repo for reference outside of those existing int he BaseCode folder, which are to be used as simple templates. The code will be taking in an input of a string array of lines that all begin with either a R or an L, followed by a number. We will be tracking a changing value as we go that starts at 50. When we see an R, the value will increase by the subsequent number, looping from 99 to 0 should it go above 99. When we see an L, the value will decrease by the subsequent number, looping from 0 to 99 when it goes below 0. Whenever we end on the 0, we want to increment a value by 1. That incrementing value is what we want returned/logged to the user in the end, as it will be the code to unlock the door in this puzzle.

## Part 2

Modify the Day 1 Code such that now in addition to tracking each time we end on a 0, we also track the number of times we pass over 0, so if we added 220 when we were at 90, we would pass 0 three times, as an example.

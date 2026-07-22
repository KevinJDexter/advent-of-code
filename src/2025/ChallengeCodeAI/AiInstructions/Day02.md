# Day 02 — AI Instructions

Create a typescript file akin to what you did for Day01 that will take an input that consists of one line of text, a series of number ranges separated with commas (e.g. 12-44,56-79). We want to end with the sum of all numeric values within the given ranges (given values included) that are of even length and have the first half of their value equal to the second half. As an example, we would care about the values 123123 and 22, but not the values 242586, 121212, or 1231234. The numbers we find that fulfill this criteria are "Invalid Ids", and we need the sum of them as our logged value.

## Part 2

We now need to add to our Day02 code logic to locate all numbers in the given range that are made up of any form of repeating digits. Example: 123123123 repeats the number 123 three times, so it counts. 1212121212 repeats the number 12 five times, so it counts. 111 repeats the number 1 three times, so it counts. 12312312 is not made of strictly repeating numbers, so it does not count.

We will want the sum of all these repeating values, and it will result in the true sum of all invalid IDs. I still want to be able to see the previous results that we had.

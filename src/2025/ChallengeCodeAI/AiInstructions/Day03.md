# Day 03 - Joltage Values

## Problem Description
Given a list of numeric strings called "banks" (e.g., "14251"), find the largest 2-digit number that can be formed from each bank, where:
- Digits must be taken in order (not necessarily consecutive)
- Digits cannot change their relative order
- Calculate the "joltage value" (the largest 2-digit number) for each bank
- Return the sum of all joltage values

## Examples
- 823669 → 89 (8 and 9, or best combo is digits at positions 0 and 5)
- 2323 → 33 (3 and 3, digits at positions 1 and 3)
- 5639276 → 97 (9 and 7, digits at positions 3 and 5)

## Algorithm

### Part 1: 2-Digit Joltage Values
1. For each bank string, iterate through all pairs of positions (i, j) where i < j
2. Extract digits at those positions to form a 2-digit number
3. Track the maximum 2-digit number found
4. Sum all maximum values across all banks

### Part 2: 12-Digit Values
1. For banks with length >= 12, find the largest 12-digit number using a greedy approach
2. For each of the 12 positions:
   - Search through available positions ensuring enough digits remain
   - Pick the largest digit in that range
   - Move to the position after the selected digit
3. Sum all 12-digit values across all valid banks

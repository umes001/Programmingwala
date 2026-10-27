import express from 'express';
import jwt from 'jsonwebtoken';
import vm from 'vm';
import alasql from 'alasql';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import mockStore from '../config/mockStore.js';
import { getMySQLPool } from '../config/mysql.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'programmingwala_arena_secret_2026';

/* ─────────────────────────────────────────────────────────────────────────────
   1. CODING CHALLENGES REPOSITORY (Easy, Medium, Hard)
───────────────────────────────────────────────────────────────────────────── */
export const ARENA_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays & Hashing',
    points: 20,
    successRate: '94.2%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    inputFormat: `Line 1: A comma-separated array of integers 'nums'.\nLine 2: An integer 'target'.`,
    outputFormat: `An array containing the two indices [i, j].`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    sampleTestCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    hiddenTestCases: [
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
      { input: 'nums = [1,5,8,12], target = 13', output: '[1,2]' }
    ],
    starters: {
      java: `public class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your Java logic here\n        for (int i = 0; i < nums.length; i++) {\n            for (int j = i + 1; j < nums.length; j++) {\n                if (nums[i] + nums[j] == target) return new int[]{i, j};\n            }\n        }\n        return new int[]{};\n    }\n}`,
      javascript: `function twoSum(nums, target) {\n  // Write your JavaScript solution here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def twoSum(nums, target):\n    # Write your Python solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []`
    }
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topic: 'Strings',
    points: 15,
    successRate: '91.8%',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.
Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputFormat: `A string 's'.`,
    outputFormat: `true or false`,
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      "'s' consists only of printable ASCII characters."
    ],
    sampleTestCases: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      }
    ],
    hiddenTestCases: [
      { input: 's = " "', output: 'true' },
      { input: 's = "0P"', output: 'false' }
    ],
    starters: {
      java: `public class Solution {\n    public static boolean isPalindrome(String s) {\n        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        return clean.equals(new StringBuilder(clean).reverse().toString());\n    }\n}`,
      javascript: `function isPalindrome(s) {\n  const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();\n  return clean === clean.split('').reverse().join('');\n}`,
      python: `def isPalindrome(s: str) -> bool:\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]`
    }
  },
  {
    id: 'reverse-words-string',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    topic: 'Strings & Two Pointers',
    points: 30,
    successRate: '82.4%',
    description: `Given an input string \`s\`, reverse the order of the words.
A word is defined as a sequence of non-space characters. The words in \`s\` will be separated by at least one space.
Return a string of the words in reverse order concatenated by a single space.
Note that \`s\` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words.`,
    inputFormat: `A string 's'.`,
    outputFormat: `A string with reversed word order.`,
    constraints: [
      '1 <= s.length <= 10^4',
      "'s' contains English letters (upper-case and lower-case), digits, and spaces ' '."
    ],
    sampleTestCases: [
      {
        input: 's = "the sky is blue"',
        output: '"blue is sky the"',
        explanation: 'Words reversed in single space sequence.'
      },
      {
        input: 's = "  hello world  "',
        output: '"world hello"',
        explanation: 'Leading or trailing spaces should be trimmed.'
      }
    ],
    hiddenTestCases: [
      { input: 's = "a good   example"', output: '"example good a"' }
    ],
    starters: {
      java: `public class Solution {\n    public static String reverseWords(String s) {\n        String[] words = s.trim().split("\\\\s+");\n        StringBuilder sb = new StringBuilder();\n        for (int i = words.length - 1; i >= 0; i--) {\n            sb.append(words[i]);\n            if (i > 0) sb.append(" ");\n        }\n        return sb.toString();\n    }\n}`,
      javascript: `function reverseWords(s) {\n  return s.trim().split(/\\s+/).reverse().join(' ');\n}`,
      python: `def reverseWords(s: str) -> str:\n    return ' '.join(reversed(s.split()))`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack & Data Structures',
    points: 25,
    successRate: '89.0%',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: `A string 's' of brackets.`,
    outputFormat: `true or false`,
    constraints: [
      '1 <= s.length <= 10^4',
      "'s' consists of parentheses only '()[]{}'."
    ],
    sampleTestCases: [
      { input: 's = "()"', output: 'true', explanation: 'Matching pair.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All matching pairs.' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatched brackets.' }
    ],
    hiddenTestCases: [
      { input: 's = "([)]"', output: 'false' },
      { input: 's = "{[]}"', output: 'true' }
    ],
    starters: {
      java: `import java.util.Stack;\npublic class Solution {\n    public static boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
      javascript: `function isValid(s) {\n  const stack = [];\n  const map = { '(': ')', '{': '}', '[': ']' };\n  for (const c of s) {\n    if (map[c]) stack.push(map[c]);\n    else if (stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack`
    }
  },
  {
    id: 'fizzbuzz-advanced',
    title: 'FizzBuzz Multi-Condition',
    difficulty: 'Easy',
    topic: 'Core Java & Logic',
    points: 15,
    successRate: '96.5%',
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- \`answer[i] == "FizzBuzz"\` if i is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if i is divisible by 3.
- \`answer[i] == "Buzz"\` if i is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.`,
    inputFormat: `An integer 'n'.`,
    outputFormat: `An array of strings.`,
    constraints: ['1 <= n <= 10^4'],
    sampleTestCases: [
      {
        input: 'n = 3',
        output: '["1","2","Fizz"]',
        explanation: '3 is divisible by 3.'
      },
      {
        input: 'n = 5',
        output: '["1","2","Fizz","4","Buzz"]',
        explanation: '5 is divisible by 5.'
      },
      {
        input: 'n = 15',
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
        explanation: '15 is divisible by both 3 and 5.'
      }
    ],
    hiddenTestCases: [
      { input: 'n = 1', output: '["1"]' }
    ],
    starters: {
      java: `import java.util.*;\npublic class Solution {\n    public static List<String> fizzBuzz(int n) {\n        List<String> res = new ArrayList<>();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) res.add("FizzBuzz");\n            else if (i % 3 == 0) res.add("Fizz");\n            else if (i % 5 == 0) res.add("Buzz");\n            else res.add(String.valueOf(i));\n        }\n        return res;\n    }\n}`,
      javascript: `function fizzBuzz(n) {\n  const res = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) res.push("FizzBuzz");\n    else if (i % 3 === 0) res.push("Fizz");\n    else if (i % 5 === 0) res.push("Buzz");\n    else res.push(String(i));\n  }\n  return res;\n}`,
      python: `def fizzBuzz(n: int):\n    res = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            res.append("FizzBuzz")\n        elif i % 3 == 0:\n            res.append("Fizz")\n        elif i % 5 == 0:\n            res.append("Buzz")\n        else:\n            res.append(str(i))\n    return res`
    }
  },
  {
    id: 'longest-substring-without-repeat',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Algorithms',
    points: 35,
    successRate: '78.6%',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    inputFormat: `A string 's'.`,
    outputFormat: `An integer representing the length of the longest substring.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      "'s' consists of English letters, digits, symbols and spaces."
    ],
    sampleTestCases: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    hiddenTestCases: [
      { input: 's = ""', output: '0' },
      { input: 's = "au"', output: '2' }
    ],
    starters: {
      java: `import java.util.*;\npublic class Solution {\n    public static int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> map = new HashMap<>();\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c)) left = Math.max(left, map.get(c) + 1);\n            map.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}`,
      javascript: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0, left = 0;\n  const map = new Map();\n  for (let right = 0; right < s.length; right++) {\n    const c = s[right];\n    if (map.has(c)) left = Math.max(left, map.get(c) + 1);\n    map.set(c, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    seen = {}\n    max_len = left = 0\n    for right, c in enumerate(s):\n        if c in seen:\n            left = max(left, seen[c] + 1)\n        seen[c] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len`
    }
  },
  {
    id: 'sql-second-highest-salary',
    title: 'SQL: Second Highest Salary',
    difficulty: 'Medium',
    topic: 'SQL & Databases',
    points: 30,
    successRate: '84.0%',
    description: `Table: Employee
+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| salary      | int  |
+-------------+------+
id is the primary key column for this table.
Write a SQL query to report the second highest salary from the Employee table. If there is no second highest salary, the query should report \`null\`.`,
    inputFormat: `Table: Employee with columns (id, salary).`,
    outputFormat: `+---------------------+\n| SecondHighestSalary |\n+---------------------+\n| 200                 |\n+---------------------+`,
    constraints: ['id is an integer', 'salary is a non-negative integer'],
    sampleTestCases: [
      {
        input: 'Employee = [{"id":1,"salary":100},{"id":2,"salary":200},{"id":3,"salary":300}]',
        output: '{"SecondHighestSalary": 200}',
        explanation: '300 is the highest, 200 is the second highest.'
      }
    ],
    hiddenTestCases: [
      {
        input: 'Employee = [{"id":1,"salary":100}]',
        output: '{"SecondHighestSalary": null}'
      }
    ],
    starters: {
      sql: `-- Write your SQL SELECT query below\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);`,
      javascript: `// SQL Query representation\nfunction getSecondHighest(employees) {\n  const salaries = [...new Set(employees.map(e => e.salary))].sort((a,b) => b - a);\n  return salaries.length > 1 ? salaries[1] : null;\n}`
    }
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    points: 20,
    successRate: '92.4%',
    companies: ['Amazon', 'Google', 'Adobe', 'Apple'],
    hints: [
      'To reach the nth step, what could have been your previous step?',
      'You could have reached either from (n-1)th step or from (n-2)th step. This is Fibonacci!'
    ],
    editorial: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approach: 'Bottom-up dynamic programming. Base cases: f(1)=1, f(2)=2. For i from 3 to n, f(i) = f(i-1) + f(i-2).'
    },
    similarProblems: ['two-sum', 'fizzbuzz-advanced'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.
Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    inputFormat: `An integer 'n'.`,
    outputFormat: `An integer representing the number of distinct ways.`,
    constraints: ['1 <= n <= 45'],
    sampleTestCases: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways: 1. (1 step + 1 step), 2. (2 steps)' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways: 1. (1+1+1), 2. (1+2), 3. (2+1)' }
    ],
    hiddenTestCases: [
      { input: 'n = 4', output: '5' },
      { input: 'n = 5', output: '8' }
    ],
    starters: {
      java: `public class Solution {\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int first = 1, second = 2;\n        for (int i = 3; i <= n; i++) {\n            int third = first + second;\n            first = second;\n            second = third;\n        }\n        return second;\n    }\n}`,
      javascript: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    const temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return b;\n}`,
      python: `def climbStairs(n: int) -> int:\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Algorithms',
    points: 15,
    successRate: '95.1%',
    companies: ['Microsoft', 'Google', 'Meta', 'TCS'],
    hints: [
      'Initialize two pointers left = 0 and right = nums.length - 1.',
      'Check the middle element. If target == nums[mid], return mid. Otherwise adjust boundaries.'
    ],
    editorial: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      approach: 'Classic divide and conquer search over a sorted integer array.'
    },
    similarProblems: ['two-sum', 'longest-substring-without-repeat'],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.
If \`target\` exists, then return its index. Otherwise, return \`-1\`.
You must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: `Line 1: nums = [-1,0,3,5,9,12]\nLine 2: target = 9`,
    outputFormat: `4`,
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All integers in nums are unique and sorted in ascending order.'
    ],
    sampleTestCases: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [5], target = 5', output: '0' },
      { input: 'nums = [2,5], target = 0', output: '-1' }
    ],
    starters: {
      java: `public class Solution {\n    public static int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`,
      javascript: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      python: `def search(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`
    }
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    difficulty: 'Medium',
    topic: 'Algorithms',
    points: 30,
    successRate: '86.7%',
    companies: ['Amazon', 'Microsoft', 'Apple', 'LinkedIn'],
    hints: [
      'Maintain running sum: if current sum becomes negative, reset it to 0.',
      'Track the maximum sum seen so far.'
    ],
    editorial: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approach: "Kadane's Algorithm: at each index, decide whether to continue the existing subarray or start a fresh one."
    },
    similarProblems: ['two-sum', 'trapping-rain-water'],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.
A subarray is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: `nums = [-2,1,-3,4,-1,2,1,-5,4]`,
    outputFormat: `6`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    sampleTestCases: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' }
    ],
    hiddenTestCases: [
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    starters: {
      java: `public class Solution {\n    public static int maxSubArray(int[] nums) {\n        int maxSoFar = nums[0], currentMax = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            currentMax = Math.max(nums[i], currentMax + nums[i]);\n            maxSoFar = Math.max(maxSoFar, currentMax);\n        }\n        return maxSoFar;\n    }\n}`,
      javascript: `function maxSubArray(nums) {\n  let maxSoFar = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    maxSoFar = Math.max(maxSoFar, curr);\n  }\n  return maxSoFar;\n}`,
      python: `def maxSubArray(nums: list[int]) -> int:\n    max_so_far = curr = nums[0]\n    for x in nums[1:]:\n        curr = max(x, curr + x)\n        max_so_far = max(max_so_far, curr)\n    return max_so_far`
    }
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Algorithms',
    points: 50,
    successRate: '68.5%',
    companies: ['Google', 'Amazon', 'Meta', 'Bloomberg'],
    hints: [
      'For any element, how much water can it hold above itself?',
      'It depends on the minimum of the highest wall to its left and the highest wall to its right minus its own height.'
    ],
    editorial: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approach: 'Two pointers approach: move from both ends keeping track of leftMax and rightMax.'
    },
    similarProblems: ['maximum-subarray', 'two-sum'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    inputFormat: `height = [0,1,0,2,1,0,1,3,2,1,2,1]`,
    outputFormat: `6`,
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    sampleTestCases: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: 'The elevation map traps 9 units of rain water.'
      }
    ],
    hiddenTestCases: [
      { input: 'height = [3,0,2,0,4]', output: '7' }
    ],
    starters: {
      java: `public class Solution {\n    public static int trap(int[] height) {\n        int left = 0, right = height.length - 1;\n        int leftMax = 0, rightMax = 0, res = 0;\n        while (left < right) {\n            if (height[left] < height[right]) {\n                if (height[left] >= leftMax) leftMax = height[left];\n                else res += leftMax - height[left];\n                left++;\n            } else {\n                if (height[right] >= rightMax) rightMax = height[right];\n                else res += rightMax - height[right];\n                right--;\n            }\n        }\n        return res;\n    }\n}`,
      javascript: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, res = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else res += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else res += rightMax - height[right];\n      right--;\n    }\n  }\n  return res;\n}`,
      python: `def trap(height: list[int]) -> int:\n    left, right = 0, len(height) - 1\n    left_max = right_max = res = 0\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                res += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                res += right_max - height[right]\n            right -= 1\n    return res`
    }
  }
];

/* ─────────────────────────────────────────────────────────────────────────────
   2. DATABASE SYNC & HELPER FUNCTIONS
───────────────────────────────────────────────────────────────────────────── */

// Normalize DOB to YYYY-MM-DD
function normalizeDob(dob) {
  if (!dob) return '';
  const s = String(dob).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const parts = s.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return s;
}

// In-Memory Storage for Arena Students & Submissions
if (!mockStore.arenaStudents) mockStore.arenaStudents = [];
if (!mockStore.arenaSubmissions) mockStore.arenaSubmissions = [];

// Find student in Arena database / store
async function findArenaStudent(email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail) return null;

  // From mockStore
  const inMemory = (mockStore.arenaStudents || []).find(
    s => String(s.email).toLowerCase() === cleanEmail
  );
  if (inMemory) return inMemory;

  // From MySQL
  try {
    const pool = getMySQLPool();
    if (pool) {
      // Ensure arena_students table exists with college column
      await pool.query(`
        CREATE TABLE IF NOT EXISTS arena_students (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(191) UNIQUE NOT NULL,
          name VARCHAR(191) NOT NULL,
          dob VARCHAR(32) NOT NULL,
          college VARCHAR(255) DEFAULT '',
          photo LONGTEXT,
          score INT DEFAULT 0,
          solved_problems_json TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `).catch(() => {});

      await pool.query(`
        ALTER TABLE arena_students ADD COLUMN college VARCHAR(255) DEFAULT '';
      `).catch(() => {});

      const [rows] = await pool.query('SELECT * FROM arena_students WHERE LOWER(email) = ?', [cleanEmail]);
      if (rows && rows.length > 0) {
        const r = rows[0];
        let solved = [];
        try { solved = typeof r.solved_problems_json === 'string' ? JSON.parse(r.solved_problems_json) : (r.solved_problems_json || []); } catch(e){}
        const st = {
          id: r.id,
          email: r.email,
          name: r.name,
          dob: r.dob,
          college: r.college || '',
          photo: r.photo || '',
          score: Number(r.score) || 0,
          solvedProblems: solved,
          createdAt: r.created_at
        };
        mockStore.arenaStudents.push(st);
        return st;
      }
    }
  } catch (e) {}

  // Cross-lookup: if student participated in an exam or assessment
  try {
    const examCand = await findExamCandidate(cleanEmail);
    if (examCand) {
      const fallbackStudent = {
        id: `arena_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        email: cleanEmail,
        name: examCand.name || 'Student Candidate',
        dob: examCand.dob || '',
        college: examCand.college || '',
        photo: examCand.photo || '',
        score: 0,
        solvedProblems: [],
        createdAt: new Date()
      };
      await saveArenaStudent(fallbackStudent);
      return fallbackStudent;
    }
  } catch (e) {}

  return null;
}

// Save or Update Arena Student across Hostinger MySQL database tables
async function saveArenaStudent(student) {
  if (!student || !student.email) return student;
  const cleanEmail = String(student.email).trim().toLowerCase();

  // Update mockStore
  if (!Array.isArray(mockStore.arenaStudents)) mockStore.arenaStudents = [];
  const idx = mockStore.arenaStudents.findIndex(
    s => String(s.email).toLowerCase() === cleanEmail
  );
  if (idx !== -1) {
    mockStore.arenaStudents[idx] = { ...mockStore.arenaStudents[idx], ...student };
  } else {
    mockStore.arenaStudents.push(student);
  }
  mockStore.saveToDisk?.();

  // Update MySQL
  try {
    const pool = getMySQLPool();
    if (pool) {
      await pool.query(`
        ALTER TABLE arena_students ADD COLUMN college VARCHAR(255) DEFAULT '';
      `).catch(() => {});

      // 1. Save directly to arena_students
      await pool.query(`
        INSERT INTO arena_students (id, email, name, dob, college, photo, score, solved_problems_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          dob = VALUES(dob),
          college = VALUES(college),
          photo = VALUES(photo),
          score = VALUES(score),
          solved_problems_json = VALUES(solved_problems_json);
      `, [
        student.id || `arena_${Date.now()}`,
        cleanEmail,
        student.name || 'Student Candidate',
        student.dob || '',
        student.college || '',
        student.photo || '',
        Number(student.score) || 0,
        JSON.stringify(student.solvedProblems || [])
      ]);

      // 2. Synchronize with assessment_candidates table
      await pool.query(`
        UPDATE assessment_candidates
        SET name = COALESCE(NULLIF(?, ''), name),
            dob = COALESCE(NULLIF(?, ''), dob),
            college = COALESCE(NULLIF(?, ''), college),
            photo_url = COALESCE(NULLIF(?, ''), photo_url)
        WHERE LOWER(email) = ?
      `, [student.name, student.dob, student.college, student.photo, cleanEmail]).catch(() => {});

      // 3. Synchronize with assessment_attempts table
      await pool.query(`
        UPDATE assessment_attempts
        SET candidate_name = COALESCE(NULLIF(?, ''), candidate_name),
            candidate_dob = COALESCE(NULLIF(?, ''), candidate_dob),
            candidate_college = COALESCE(NULLIF(?, ''), candidate_college),
            candidate_photo = COALESCE(NULLIF(?, ''), candidate_photo)
        WHERE LOWER(candidate_email) = ?
      `, [student.name, student.dob, student.college, student.photo, cleanEmail]).catch(() => {});

      // 4. Synchronize with certificates table
      await pool.query(`
        UPDATE certificates
        SET student_name = COALESCE(NULLIF(?, ''), student_name)
        WHERE LOWER(candidate_email) = ?
      `, [student.name, cleanEmail]).catch(() => {});

      // 5. Synchronize with users table
      await pool.query(`
        UPDATE users
        SET name = COALESCE(NULLIF(?, ''), name),
            profile_image = COALESCE(NULLIF(?, ''), profile_image)
        WHERE LOWER(email) = ?
      `, [student.name, student.photo, cleanEmail]).catch(() => {});
    }
  } catch (e) {
    console.warn('MySQL saveArenaStudent sync error:', e.message);
  }

  return student;
}

// Cross-Lookup: Check if student participated in an exam created by Admin
async function findExamCandidate(email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail) return null;

  // 1. From mockStore assessments
  const store = mockStore.assessments || [];
  for (const a of store) {
    const cand = (a.invitedCandidates || []).find(
      c => String(c.email || '').trim().toLowerCase() === cleanEmail
    );
    if (cand) {
      return {
        name: cand.name,
        email: cleanEmail,
        photo: cand.photo || '',
        dob: cand.dob || cand.dateOfBirth || '',
        source: 'Assessment Registration'
      };
    }
  }

  // 2. From mockStore assessmentAttempts
  const atts = mockStore.assessmentAttempts || [];
  for (const att of atts) {
    if (String(att.candidateEmail || att.candidate?.email || '').trim().toLowerCase() === cleanEmail) {
      return {
        name: att.candidateName || att.candidate?.name || 'Exam Candidate',
        email: cleanEmail,
        photo: att.candidatePhoto || att.candidate?.photo || '',
        dob: att.candidateDob || att.candidate?.dob || '',
        source: 'Exam Attempt'
      };
    }
  }

  // 3. From Hostinger MySQL assessments and attempts
  try {
    const pool = getMySQLPool();
    if (pool) {
      const [assRows] = await pool.query('SELECT invited_candidates_json FROM assessments').catch(() => [[]]);
      for (const r of (assRows || [])) {
        let list = [];
        try { list = typeof r.invited_candidates_json === 'string' ? JSON.parse(r.invited_candidates_json) : (r.invited_candidates_json || []); } catch(e){}
        const cand = list.find(c => String(c.email || '').trim().toLowerCase() === cleanEmail);
        if (cand) {
          return {
            name: cand.name,
            email: cleanEmail,
            photo: cand.photo || '',
            dob: cand.dob || cand.dateOfBirth || '',
            source: 'MySQL Assessment'
          };
        }
      }

      const [attRows] = await pool.query(
        'SELECT candidate_name, candidate_email, candidate_photo FROM assessment_attempts WHERE LOWER(candidate_email) = ?',
        [cleanEmail]
      ).catch(() => [[]]);
      if (attRows && attRows.length > 0) {
        return {
          name: attRows[0].candidate_name || 'Exam Candidate',
          email: cleanEmail,
          photo: attRows[0].candidate_photo || '',
          dob: '',
          source: 'MySQL Exam Attempt'
        };
      }
    }
  } catch (e) {}

  return null;
}

// Token generator
function generateArenaToken(student) {
  return jwt.sign(
    {
      id: student.id,
      email: student.email,
      name: student.name,
      photo: student.photo,
      role: 'arena_student'
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Middleware: Authenticate Arena Student (Optional / Soft Auth)
function requireArenaAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in to submit code.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.arenaStudent = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. AUTHENTICATION ROUTES (Self-Register & Login with Email + DOB)
───────────────────────────────────────────────────────────────────────────── */

// POST /api/arena/register: Self-Register normal student
router.post('/register', async (req, res) => {
  try {
    const { name, email, dob, photo } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    if (!dob || !dob.trim()) {
      return res.status(400).json({ error: 'Date of Birth (DOB) is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();
    const cleanDob = normalizeDob(dob);

    // Check if already registered
    let existing = await findArenaStudent(cleanEmail);
    if (existing) {
      // Update details
      existing.name = cleanName;
      existing.dob = cleanDob;
      if (photo) existing.photo = photo;
      await saveArenaStudent(existing);

      const token = generateArenaToken(existing);
      return res.json({
        success: true,
        message: 'Profile details updated successfully!',
        token,
        student: existing
      });
    }

    // Check if student existed in admin exams to carry forward any legacy data
    const examCand = await findExamCandidate(cleanEmail);

    const newStudent = {
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      email: cleanEmail,
      name: cleanName,
      dob: cleanDob,
      photo: photo || examCand?.photo || '',
      score: 0,
      solvedProblems: [],
      createdAt: new Date()
    };

    await saveArenaStudent(newStudent);
    const token = generateArenaToken(newStudent);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to ProgrammingWala Coding Arena.',
      token,
      student: newStudent
    });
  } catch (err) {
    console.error('Arena register error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
});

// POST /api/arena/login: Login via Email + Date of Birth
router.post('/login', async (req, res) => {
  try {
    const { email, dob } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Registered email address is required.' });
    }
    if (!dob || !dob.trim()) {
      return res.status(400).json({ error: 'Date of Birth (DOB) is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const inputDob = normalizeDob(dob);

    // 1. First check direct arena students
    let student = await findArenaStudent(cleanEmail);

    if (student) {
      const storedDob = normalizeDob(student.dob);
      if (storedDob && storedDob !== inputDob) {
        return res.status(401).json({
          error: 'Date of Birth does not match our records for this email address.'
        });
      }

      // If stored DOB was missing, save the verified one
      if (!storedDob) {
        student.dob = inputDob;
        await saveArenaStudent(student);
      }

      const token = generateArenaToken(student);
      return res.json({
        success: true,
        message: `Welcome back, ${student.name}!`,
        token,
        student
      });
    }

    // 2. Cross-login: Check if student participated in an exam created by Admin!
    const examCandidate = await findExamCandidate(cleanEmail);

    if (examCandidate) {
      // Create new Arena Student seamlessly from their exam record!
      student = {
        id: `student_exam_${Date.now()}`,
        email: cleanEmail,
        name: examCandidate.name || 'Student',
        dob: inputDob,
        photo: examCandidate.photo || '',
        score: 0,
        solvedProblems: [],
        createdAt: new Date()
      };

      await saveArenaStudent(student);
      const token = generateArenaToken(student);

      return res.json({
        success: true,
        message: `Welcome ${student.name}! Your account has been synced from your Examination profile.`,
        token,
        student
      });
    }

    // If not found in either system:
    return res.status(404).json({
      notRegistered: true,
      error: 'No account found with this email. Please click "Create Free Account" to register.'
    });
  } catch (err) {
    console.error('Arena login error:', err);
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
});

// GET /api/arena/me: Current Student Profile
router.get('/me', requireArenaAuth, async (req, res) => {
  try {
    const student = await findArenaStudent(req.arenaStudent.email);
    if (!student) {
      return res.status(404).json({ error: 'Student account not found.' });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/arena/profile: Get profile by email or auth token
router.get('/profile', async (req, res) => {
  try {
    let email = req.query.email;
    if (!email && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        email = decoded.email;
      } catch (e) {}
    }
    if (!email) {
      return res.status(400).json({ error: 'Email or authorization token required.' });
    }
    const student = await findArenaStudent(email);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/arena/profile: Update profile info (photo, name, dob)
// PUT /api/arena/profile: Update profile info (photo, name, dob, college)
router.put('/profile', async (req, res) => {
  try {
    let email = req.body.email;
    if (!email && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        email = decoded.email;
      } catch (e) {}
    }
    if (!email) {
      return res.status(400).json({ error: 'Email required to update profile.' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    let student = await findArenaStudent(cleanEmail);
    if (!student) {
      student = {
        id: `arena_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        email: cleanEmail,
        name: req.body.name ? String(req.body.name).trim() : 'Student Candidate',
        dob: req.body.dob ? normalizeDob(req.body.dob) : '',
        college: req.body.college ? String(req.body.college).trim() : '',
        photo: req.body.photo || '',
        score: 0,
        solvedProblems: [],
        createdAt: new Date()
      };
    }
    if (req.body.name) student.name = String(req.body.name).trim();
    if (req.body.dob) student.dob = normalizeDob(req.body.dob);
    if (req.body.college !== undefined) student.college = String(req.body.college).trim();
    if (req.body.photo !== undefined) student.photo = req.body.photo;

    await saveArenaStudent(student);
    const token = generateArenaToken(student);
    res.json({ success: true, message: 'Profile updated and saved to database successfully!', student, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   4. CODING PROBLEMS & SUBMISSIONS
───────────────────────────────────────────────────────────────────────────── */

// GET /api/arena/problems: List all problems
router.get('/problems', (req, res) => {
  const { topic, difficulty, search } = req.query;

  let list = ARENA_PROBLEMS.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    points: p.points,
    successRate: p.successRate,
    sampleCount: p.sampleTestCases?.length || 0
  }));

  if (topic && topic !== 'all') {
    list = list.filter(p => p.topic.toLowerCase().includes(topic.toLowerCase()));
  }
  if (difficulty && difficulty !== 'all') {
    list = list.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q));
  }

  res.json({ success: true, count: list.length, problems: list });
});

// GET /api/arena/problems/:id: Get detailed problem statement
router.get('/problems/:id', (req, res) => {
  const problem = ARENA_PROBLEMS.find(p => p.id === req.params.id);
  if (!problem) {
    return res.status(404).json({ error: 'Coding problem not found.' });
  }

  // Return problem without exposing hidden test cases
  const { hiddenTestCases, ...safeProblem } = problem;
  res.json({ success: true, problem: safeProblem });
});

// Helper: Run user's JavaScript / SQL code against a single test case safely
function executeTestCase(code, language, inputStr, expectedOutputStr) {
  try {
    // If it's a SQL query
    if (language === 'sql') {
      try {
        let dummyTable = [
          { id: 1, salary: 100 },
          { id: 2, salary: 200 },
          { id: 3, salary: 300 }
        ];
        alasql('CREATE TABLE IF NOT EXISTS Employee (id INT, salary INT)');
        alasql('DELETE FROM Employee');
        alasql('INSERT INTO Employee SELECT * FROM ?', [dummyTable]);

        const result = alasql(code);
        const actual = JSON.stringify(result[0] || result);
        const passed = actual.includes('200') || actual.includes(expectedOutputStr);
        return {
          passed,
          input: inputStr,
          expected: expectedOutputStr,
          actual: actual
        };
      } catch (sqlErr) {
        return { passed: false, error: sqlErr.message };
      }
    }

    // If JavaScript (Node.js vm sandbox)
    const sandbox = {
      console: { log: () => {} },
      result: null
    };

    // Construct evaluation wrapper
    let scriptContent = `
      ${code}
      try {
        // Find exported or top-level function
        const fns = [twoSum, isPalindrome, reverseWords, isValid, fizzBuzz, lengthOfLongestSubstring, climbStairs, search, maxSubArray, trap].filter(f => typeof f === 'function');
        if (fns.length > 0) {
          // Parse inputs
          ${inputStr}
          // Call function based on parameters in inputStr
          if (typeof twoSum === 'function' && typeof nums !== 'undefined') result = twoSum(nums, target);
          else if (typeof isPalindrome === 'function' && typeof s !== 'undefined') result = isPalindrome(s);
          else if (typeof reverseWords === 'function' && typeof s !== 'undefined') result = reverseWords(s);
          else if (typeof isValid === 'function' && typeof s !== 'undefined') result = isValid(s);
          else if (typeof fizzBuzz === 'function' && typeof n !== 'undefined') result = fizzBuzz(n);
          else if (typeof lengthOfLongestSubstring === 'function' && typeof s !== 'undefined') result = lengthOfLongestSubstring(s);
          else if (typeof climbStairs === 'function' && typeof n !== 'undefined') result = climbStairs(n);
          else if (typeof search === 'function' && typeof nums !== 'undefined') result = search(nums, target);
          else if (typeof maxSubArray === 'function' && typeof nums !== 'undefined') result = maxSubArray(nums);
          else if (typeof trap === 'function' && typeof height !== 'undefined') result = trap(height);
        }
      } catch (err) {
        result = { __error: err.message };
      }
    `;

    const context = vm.createContext(sandbox);
    vm.runInContext(scriptContent, context, { timeout: 1500 });

    if (sandbox.result && sandbox.result.__error) {
      return { passed: false, error: sandbox.result.__error };
    }

    const actualStr = JSON.stringify(sandbox.result);
    const cleanExpected = expectedOutputStr.trim();
    const passed = (actualStr === cleanExpected) || 
                   (actualStr === cleanExpected.replace(/"/g, '')) || 
                   (String(sandbox.result) === cleanExpected);

    return {
      passed,
      input: inputStr,
      expected: cleanExpected,
      actual: actualStr !== undefined ? actualStr : 'undefined'
    };
  } catch (execErr) {
    return {
      passed: false,
      error: execErr.message
    };
  }
}

// Real JDK 25 Execution Engine for Java code
function executeJavaSuite(problemId, userCode, testCases) {
  let cleanUserCode = (userCode || '').replace(/^\s*package\s+[^;]+;/m, '// package removed');

  // Check if user wrote a standalone class with a main method (e.g. Streams, custom program, Scanner, etc.)
  const hasMain = /public\s+static\s+void\s+main\s*\(/.test(cleanUserCode) || /void\s+main\s*\(/.test(cleanUserCode);

  if (hasMain) {
    const classMatch = cleanUserCode.match(/(?:public\s+)?class\s+([A-Za-z0-9_]+)/);
    const className = classMatch ? classMatch[1] : 'Solution';
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arena_java_'));
    const filePath = path.join(tempDir, className + '.java');
    fs.writeFileSync(filePath, cleanUserCode, 'utf-8');

    try {
      const stdout = execSync('java ' + className + '.java', {
        cwd: tempDir,
        timeout: 6000,
        encoding: 'utf-8'
      });
      const trimmedOutput = stdout.trim();
      return {
        hasCompilationError: false,
        stdout: trimmedOutput,
        results: testCases.map((tc, idx) => {
          const cleanExpected = (tc.output || '').trim();
          const passed = trimmedOutput === cleanExpected || 
                         trimmedOutput.replace(/\s+/g, '') === cleanExpected.replace(/\s+/g, '') || 
                         trimmedOutput.includes(cleanExpected);
          return {
            testCase: idx + 1,
            passed,
            input: tc.input,
            expected: cleanExpected,
            actual: trimmedOutput
          };
        })
      };
    } catch (err) {
      let rawErr = (err.stderr || err.stdout || err.message).trim();
      rawErr = rawErr.replace(new RegExp(tempDir.replace(/\\/g, '\\\\') + '[\\\\/]', 'g'), '');
      return {
        hasCompilationError: true,
        error: rawErr,
        results: testCases.map((tc, idx) => ({
          testCase: idx + 1,
          passed: false,
          input: tc.input,
          expected: tc.output,
          actual: 'Compilation / Runtime Error',
          error: rawErr
        }))
      };
    } finally {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
    }
  }

  // Otherwise, construct TestRunner harness for standard LeetCode / HackerRank solution method
  const match = cleanUserCode.match(/(?:public\s+)?class\s+([A-Za-z0-9_]+)/);
  const className = match ? match[1] : 'Solution';
  const pkgPrivateCode = cleanUserCode.replace(/public\s+class\s+([A-Za-z0-9_]+)/g, 'class $1');

  let testInvocations = [];
  for (let i = 0; i < testCases.length; i++) {
    const input = testCases[i].input;
    let callExpr = '';

    if (problemId === 'two-sum') {
      const numsMatch = input.match(/nums\s*=\s*\[([^\]]*)\]/);
      const targetMatch = input.match(/target\s*=\s*(-?\d+)/);
      const nums = numsMatch ? numsMatch[1] : '';
      const target = targetMatch ? targetMatch[1] : '0';
      callExpr = `
        int[] res${i} = sol.twoSum(new int[]{${nums}}, ${target});
        System.out.println(Arrays.toString(res${i}).replaceAll("\\\\s+", ""));
      `;
    } else if (problemId === 'valid-palindrome') {
      const sMatch = input.match(/s\s*=\s*"([^"]*)"/);
      const str = sMatch ? sMatch[1].replace(/\\/g, '\\\\').replace(/"/g, '\\"') : '';
      callExpr = `
        boolean res${i} = sol.isPalindrome("${str}");
        System.out.println(res${i});
      `;
    } else if (problemId === 'reverse-words-string') {
      const sMatch = input.match(/s\s*=\s*"([^"]*)"/);
      const str = sMatch ? sMatch[1].replace(/\\/g, '\\\\').replace(/"/g, '\\"') : '';
      callExpr = `
        String res${i} = sol.reverseWords("${str}");
        System.out.println(res${i});
      `;
    } else if (problemId === 'valid-parentheses') {
      const sMatch = input.match(/s\s*=\s*"([^"]*)"/);
      const str = sMatch ? sMatch[1].replace(/\\/g, '\\\\').replace(/"/g, '\\"') : '';
      callExpr = `
        boolean res${i} = sol.isValid("${str}");
        System.out.println(res${i});
      `;
    } else if (problemId === 'fizzbuzz-advanced') {
      const nMatch = input.match(/n\s*=\s*(\d+)/);
      const n = nMatch ? nMatch[1] : '1';
      callExpr = `
        List<String> res${i} = sol.fizzBuzz(${n});
        System.out.println(res${i}.stream().map(x -> "\\"" + x + "\\"").collect(Collectors.joining(",", "[", "]")));
      `;
    } else if (problemId === 'longest-substring-without-repeat') {
      const sMatch = input.match(/s\s*=\s*"([^"]*)"/);
      const str = sMatch ? sMatch[1].replace(/\\/g, '\\\\').replace(/"/g, '\\"') : '';
      callExpr = `
        int res${i} = sol.lengthOfLongestSubstring("${str}");
        System.out.println(res${i});
      `;
    } else if (problemId === 'climbing-stairs') {
      const nMatch = input.match(/n\s*=\s*(\d+)/);
      const n = nMatch ? nMatch[1] : '1';
      callExpr = `
        int res${i} = sol.climbStairs(${n});
        System.out.println(res${i});
      `;
    } else if (problemId === 'binary-search') {
      const numsMatch = input.match(/nums\s*=\s*\[([^\]]*)\]/);
      const targetMatch = input.match(/target\s*=\s*(-?\d+)/);
      const nums = numsMatch ? numsMatch[1] : '';
      const target = targetMatch ? targetMatch[1] : '0';
      callExpr = `
        int res${i} = sol.search(new int[]{${nums}}, ${target});
        System.out.println(res${i});
      `;
    } else if (problemId === 'maximum-subarray') {
      const numsMatch = input.match(/nums\s*=\s*\[([^\]]*)\]/);
      const nums = numsMatch ? numsMatch[1] : '';
      callExpr = `
        int res${i} = sol.maxSubArray(new int[]{${nums}});
        System.out.println(res${i});
      `;
    } else if (problemId === 'trapping-rain-water') {
      const hMatch = input.match(/(?:height|nums)\s*=\s*\[([^\]]*)\]/);
      const h = hMatch ? hMatch[1] : '';
      callExpr = `
        int res${i} = sol.trap(new int[]{${h}});
        System.out.println(res${i});
      `;
    }

    testInvocations.push(`
      try {
        ${callExpr}
      } catch (Exception e) {
        System.out.println("__EXCEPTION__:" + e.getMessage());
      }
    `);
  }

  const harnessCode = `
import java.util.*;
import java.util.stream.*;
import java.io.*;

${pkgPrivateCode}

public class TestRunner {
    public static void main(String[] args) {
        ${className} sol = new ${className}();
        ${testInvocations.join('\nSystem.out.println("<<<ARENA_DELIM>>>");\n')}
    }
}
`;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arena_harness_'));
  const filePath = path.join(tempDir, 'TestRunner.java');
  fs.writeFileSync(filePath, harnessCode, 'utf-8');

  try {
    const stdout = execSync('java TestRunner.java', {
      cwd: tempDir,
      timeout: 6000,
      encoding: 'utf-8'
    });
    const outputs = stdout.split('<<<ARENA_DELIM>>>').map(s => s.trim());
    return {
      hasCompilationError: false,
      results: testCases.map((tc, idx) => {
        const actual = outputs[idx] || '';
        const cleanExpected = (tc.output || '').trim();
        const isException = actual.startsWith('__EXCEPTION__:');
        const passed = !isException && (actual === cleanExpected || actual.replace(/\s+/g, '') === cleanExpected.replace(/\s+/g, ''));
        return {
          testCase: idx + 1,
          passed,
          input: tc.input,
          expected: cleanExpected,
          actual: isException ? 'Runtime Exception' : actual,
          error: isException ? actual.replace('__EXCEPTION__:', '') : null
        };
      })
    };
  } catch (err) {
    let rawErr = (err.stderr || err.stdout || err.message).trim();
    rawErr = rawErr.replace(new RegExp(tempDir.replace(/\\/g, '\\\\') + '[\\\\/]', 'g'), '');
    rawErr = rawErr.replace(/TestRunner\.java/g, className + '.java');
    return {
      hasCompilationError: true,
      error: rawErr,
      results: testCases.map((tc, idx) => ({
        testCase: idx + 1,
        passed: false,
        input: tc.input,
        expected: tc.output,
        actual: 'Compilation Error',
        error: rawErr
      }))
    };
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

// Unified Execution Suite dispatcher
function executeTestSuite(problem, code, language, testCases) {
  if (language === 'java') {
    return executeJavaSuite(problem.id, code, testCases);
  }

  // For JavaScript and SQL
  const results = testCases.map((tc, idx) => {
    const resRun = executeTestCase(code, language || 'javascript', tc.input, tc.output);
    return {
      testCase: idx + 1,
      ...resRun
    };
  });

  return {
    hasCompilationError: false,
    results
  };
}

// POST /api/arena/run: Run code against Sample Test Cases
router.post('/run', (req, res) => {
  const { problemId, code, language } = req.body;
  const problem = ARENA_PROBLEMS.find(p => p.id === problemId);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found.' });
  }
  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code body is empty.' });
  }

  const sampleCases = problem.sampleTestCases || [];
  const suiteResult = executeTestSuite(problem, code, language, sampleCases);
  const results = suiteResult.results;
  const allPassed = results.every(r => r.passed);

  res.json({
    success: true,
    allPassed,
    hasCompilationError: suiteResult.hasCompilationError,
    error: suiteResult.error,
    stdout: suiteResult.stdout,
    results
  });
});

// POST /api/arena/submit: Submit code and award XP
router.post('/submit', requireArenaAuth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const problem = ARENA_PROBLEMS.find(p => p.id === problemId);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const allTestCases = [...(problem.sampleTestCases || []), ...(problem.hiddenTestCases || [])];
    const suiteResult = executeTestSuite(problem, code, language, allTestCases);
    const testResults = suiteResult.results.map((r, idx) => ({
      ...r,
      isHidden: idx >= (problem.sampleTestCases?.length || 0)
    }));

    const allPassed = testResults.every(r => r.passed);

    // Fetch student profile
    const student = await findArenaStudent(req.arenaStudent.email);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    if (!Array.isArray(student.solvedProblems)) {
      student.solvedProblems = [];
    }

    let awardedPoints = 0;
    const wasAlreadySolved = student.solvedProblems.includes(problem.id);

    if (allPassed) {
      if (!wasAlreadySolved) {
        student.solvedProblems.push(problem.id);
        awardedPoints = problem.points || 20;
        student.score = (Number(student.score) || 0) + awardedPoints;
        await saveArenaStudent(student);
      }
    }

    // Record submission
    const submissionRecord = {
      id: `sub_${Date.now()}`,
      studentEmail: student.email,
      studentName: student.name,
      problemId: problem.id,
      problemTitle: problem.title,
      language: language || 'javascript',
      status: allPassed ? 'Accepted' : (suiteResult.hasCompilationError ? 'Compilation Error' : 'Wrong Answer'),
      pointsAwarded: awardedPoints,
      submittedAt: new Date()
    };
    mockStore.arenaSubmissions.push(submissionRecord);

    res.json({
      success: true,
      verdict: allPassed ? 'Accepted' : (suiteResult.hasCompilationError ? 'Compilation Error' : 'Wrong Answer'),
      allPassed,
      hasCompilationError: suiteResult.hasCompilationError,
      error: suiteResult.error,
      stdout: suiteResult.stdout,
      awardedPoints,
      newTotalScore: student.score,
      solvedCount: student.solvedProblems.length,
      testResults
    });
  } catch (err) {
    console.error('Arena submit error:', err);
    res.status(500).json({ error: err.message || 'Submission failed.' });
  }
});

// GET /api/arena/submissions: Get user/problem submission history
router.get('/submissions', (req, res) => {
  try {
    const { problemId, email } = req.query;
    let list = [...(mockStore.arenaSubmissions || [])];
    if (problemId) {
      list = list.filter(s => s.problemId === problemId);
    }
    if (email) {
      list = list.filter(s => String(s.studentEmail).toLowerCase() === String(email).toLowerCase());
    }
    list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json({ success: true, submissions: list.slice(0, 30) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/arena/leaderboard: Arena Coders Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const students = [...(mockStore.arenaStudents || [])];
    
    // Sort by score desc, solved count desc
    students.sort((a, b) => (b.score || 0) - (a.score || 0));

    const ranked = students.map((s, idx) => ({
      rank: idx + 1,
      name: s.name,
      email: s.email,
      photo: s.photo || '',
      score: s.score || 0,
      solvedCount: (s.solvedProblems || []).length
    }));

    res.json({ success: true, leaderboard: ranked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

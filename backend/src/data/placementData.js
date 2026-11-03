export const placementData = [
  {
    topicId: "linked-list",
    title: "Linked Lists in Technical Interviews",
    academicConcept: "Pointers, dynamic node linking, NULL termination",
    companies: ["Amazon", "Microsoft", "TCS Digital", "Zoho", "Cognizant"],
    interviewPatterns: [
      {
        patternName: "Two Pointers (Fast & Slow / Tortoise & Hare)",
        description: "Move slow by 1 step, fast by 2 steps. If they meet, loop exists. Halfway point occurs when fast hits NULL.",
        academicVsInterview: "College asks: 'Write code for singly linked list traversal'. Interviews ask: 'Detect cycle, find entry point of cycle, or find middle of list in single pass without counting length.'",
        problems: [
          { name: "Middle of the Linked List", leetcode: "LeetCode 876", difficulty: "Easy", cHint: "while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }" },
          { name: "Linked List Cycle II (Find Start)", leetcode: "LeetCode 142", difficulty: "Medium", cHint: "When fast and slow collide, reset slow to head. Move both 1 step; meeting point is loop head." },
          { name: "Remove Nth Node From End of List", leetcode: "LeetCode 19", difficulty: "Medium", cHint: "Advance fast by N steps first, then move both until fast hits end." }
        ]
      },
      {
        patternName: "In-Place Pointer Reversal",
        description: "Reversing pointers between nodes without allocating new nodes or memory.",
        academicVsInterview: "College asks: 'Reverse a list iteratively'. Interviews ask: 'Reverse Nodes in k-Group' or 'Palindrome Linked List'.",
        problems: [
          { name: "Reverse Linked List", leetcode: "LeetCode 206", difficulty: "Easy", cHint: "Iterative 3 pointers: prev, curr, next. Space O(1)." },
          { name: "Palindrome Linked List", leetcode: "LeetCode 234", difficulty: "Easy", cHint: "Find middle with fast/slow, reverse second half, compare both halves." },
          { name: "Reverse Nodes in k-Group", leetcode: "LeetCode 25", difficulty: "Hard", cHint: "Check if k nodes exist ahead, reverse k nodes, recursively link." }
        ]
      }
    ]
  },
  {
    topicId: "stack-queue",
    title: "Stack & Queue in Technical Interviews",
    academicConcept: "LIFO, FIFO, Infix to Postfix",
    companies: ["Google", "Adobe", "Morgan Stanley", "Infosys SP"],
    interviewPatterns: [
      {
        patternName: "Monotonic Stack Pattern",
        description: "Maintain a stack in strictly increasing or decreasing order to find the Next Greater or Smaller Element in O(N) time.",
        academicVsInterview: "College asks: 'Evaluate Postfix'. Interviews ask: 'Next Greater Element', 'Daily Temperatures', or 'Largest Rectangle in Histogram'.",
        problems: [
          { name: "Next Greater Element I", leetcode: "LeetCode 496", difficulty: "Easy", cHint: "Scan from right to left; pop elements smaller than current." },
          { name: "Daily Temperatures", leetcode: "LeetCode 739", difficulty: "Medium", cHint: "Stack stores indices of decreasing temperatures." },
          { name: "Largest Rectangle in Histogram", leetcode: "LeetCode 84", difficulty: "Hard", cHint: "Use monotonic increasing stack to find previous smaller and next smaller bars." }
        ]
      },
      {
        patternName: "Sliding Window / Monotonic Deque",
        description: "Double ended queue to maintain running minimum/maximum in a moving window of size K.",
        academicVsInterview: "College asks: 'Implement Deque with circular array'. Interviews ask: 'Sliding Window Maximum'.",
        problems: [
          { name: "Sliding Window Maximum", leetcode: "LeetCode 239", difficulty: "Hard", cHint: "Maintain deque of indices where values are strictly decreasing." }
        ]
      }
    ]
  },
  {
    topicId: "trees-bst",
    title: "Trees & BST in Technical Interviews",
    academicConcept: "Traversals, height, balance factor, BST property",
    companies: ["Microsoft", "Amazon", "Uber", "Oracle", "Goldman Sachs"],
    interviewPatterns: [
      {
        patternName: "Tree DFS / Path Traversal",
        description: "Bottom-up recursion returning height, diameter, or path sums.",
        academicVsInterview: "College asks: 'Write Inorder, Preorder, Postorder functions'. Interviews ask: 'Diameter of Binary Tree', 'Lowest Common Ancestor', or 'Max Path Sum'.",
        problems: [
          { name: "Maximum Depth of Binary Tree", leetcode: "LeetCode 104", difficulty: "Easy", cHint: "return 1 + max(depth(left), depth(right));" },
          { name: "Diameter of Binary Tree", leetcode: "LeetCode 543", difficulty: "Easy", cHint: "Compute longest path passing through any node: leftHeight + rightHeight." },
          { name: "Lowest Common Ancestor in BST", leetcode: "LeetCode 235", difficulty: "Medium", cHint: "If both p, q < root, go left. If both > root, go right. Else root is LCA." }
        ]
      },
      {
        patternName: "Tree BFS / Level Order",
        description: "Queue-based traversal tracking level boundaries using queue size.",
        academicVsInterview: "College asks: 'Write level order traversal'. Interviews ask: 'Binary Tree Right Side View' or 'Zigzag Traversal'.",
        problems: [
          { name: "Binary Tree Level Order Traversal", leetcode: "LeetCode 102", difficulty: "Medium", cHint: "Inside while(!q.empty()), record count = q.size() and loop count times." },
          { name: "Binary Tree Right Side View", leetcode: "LeetCode 199", difficulty: "Medium", cHint: "In each level, the last element popped from queue is visible from right side." }
        ]
      }
    ]
  },
  {
    topicId: "graphs",
    title: "Graphs in Technical Interviews",
    academicConcept: "Adjacency matrix, BFS, DFS, Dijkstra, Prim, Kruskal",
    companies: ["Google", "Meta", "Directi", "Paytm", "TCS Digital"],
    interviewPatterns: [
      {
        patternName: "Connected Components & Flood Fill (Matrix as Graph)",
        description: "Treating a 2D grid as an implicit graph with 4 or 8 directional edges.",
        academicVsInterview: "College gives: 'Graph with 5 vertices in adjacency matrix'. Interviews give: 'A 2D char grid representing water '0' and land '1'; count islands.'",
        problems: [
          { name: "Number of Islands", leetcode: "LeetCode 200", difficulty: "Medium", cHint: "Traverse grid. When '1' seen, increment count and trigger DFS/BFS to mark connected land visited." },
          { name: "Rotting Oranges", leetcode: "LeetCode 994", difficulty: "Medium", cHint: "Multi-source BFS from all rotten oranges simultaneously; count minutes elapsed." }
        ]
      },
      {
        patternName: "Topological Sort / Dependency Resolution",
        description: "Course schedules, build systems, task ordering using in-degrees.",
        academicVsInterview: "College asks: 'Trace Kahn's algorithm on DAG'. Interviews ask: 'Course Schedule I and II (detect if you can finish all courses)'.",
        problems: [
          { name: "Course Schedule", leetcode: "LeetCode 207", difficulty: "Medium", cHint: "Build graph of prerequisites. If topological sort processes all courses, schedule is possible." },
          { name: "Course Schedule II", leetcode: "LeetCode 210", difficulty: "Medium", cHint: "Output actual valid ordering of courses." }
        ]
      }
    ]
  }
];

export const mockQuestionsData = {
  mcq: [
    {
      id: "mcq-1",
      unit: 1,
      difficulty: "Easy",
      question: "Which C operator is used to access structure members through a structure pointer?",
      options: [". (dot)", "-> (arrow)", "* (dereference only)", "& (address of)"],
      answer: 1,
      explanation: "The arrow operator (->) is used to dereference a structure pointer and access its members, equivalent to (*ptr).member."
    },
    {
      id: "mcq-2",
      unit: 1,
      difficulty: "Medium",
      question: "What is the return type of malloc() in C?",
      options: ["int*", "char*", "void*", "struct Node*"],
      answer: 2,
      explanation: "malloc() returns a generic void pointer (void*), which represents raw un-typed heap memory and can be cast to any pointer type."
    },
    {
      id: "mcq-3",
      unit: 2,
      difficulty: "Easy",
      question: "What is the worst-case time complexity of inserting an element at the beginning of an array of size N?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
      answer: 2,
      explanation: "All existing N elements must be shifted one position to the right to make space at index 0, taking O(N) operations."
    },
    {
      id: "mcq-4",
      unit: 2,
      difficulty: "Hard",
      question: "In Floyd's Cycle-Finding Algorithm for linked lists, if the fast pointer moves at 2 steps and slow moves at 1 step, what is the maximum number of steps until they meet inside a loop of length L?",
      options: ["L steps", "2L steps", "L^2 steps", "log L steps"],
      answer: 0,
      explanation: "Once both pointers enter the loop, the relative distance between them decreases by 1 step in each iteration. Hence, they will meet in at most L iterations."
    },
    {
      id: "mcq-5",
      unit: 3,
      difficulty: "Easy",
      question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
      options: ["Queue", "Priority Queue", "Stack", "Binary Tree"],
      answer: 2,
      explanation: "A Stack strictly operates on LIFO order, where the element pushed last is the first to be popped."
    },
    {
      id: "mcq-6",
      unit: 3,
      difficulty: "Medium",
      question: "In a circular queue implemented using an array of size MAX with indices 0 to MAX-1, what is the condition for the queue being FULL?",
      options: [
        "rear == MAX - 1",
        "(rear + 1) % MAX == front",
        "front == rear",
        "rear - front == MAX"
      ],
      answer: 1,
      explanation: "When (rear + 1) % MAX == front, advancing the rear would overwrite the front element, indicating the circular queue is completely full."
    },
    {
      id: "mcq-7",
      unit: 4,
      difficulty: "Medium",
      question: "What is the inorder traversal of a Binary Search Tree (BST)?",
      options: [
        "Elements in reverse order",
        "Elements in level-by-level order",
        "Elements in strictly ascending sorted order",
        "Random permutation of keys"
      ],
      answer: 2,
      explanation: "Inorder traversal visits Left Subtree (< root) -> Root -> Right Subtree (> root). By definition of BST, this guarantees ascending sorted order."
    },
    {
      id: "mcq-8",
      unit: 4,
      difficulty: "Hard",
      question: "What is the allowed range of Balance Factors (BF) for every node in an AVL Tree?",
      options: ["{0}", "{-1, 0, +1}", "{-2, -1, 0, +1, +2}", "Any non-negative integer"],
      answer: 1,
      explanation: "In an AVL tree, the balance factor (height(left) - height(right)) of every single node must strictly be within {-1, 0, +1}."
    },
    {
      id: "mcq-9",
      unit: 5,
      difficulty: "Medium",
      question: "Which graph algorithm cannot handle graphs containing negative weight edges?",
      options: ["Bellman-Ford", "Floyd-Warshall", "Dijkstra's Algorithm", "Breadth First Search"],
      answer: 2,
      explanation: "Dijkstra's greedy assumption finalizes the shortest distance once a node is settled. A subsequent negative edge could produce a smaller path, causing Dijkstra to produce incorrect answers."
    },
    {
      id: "mcq-10",
      unit: 5,
      difficulty: "Hard",
      question: "What is the time complexity of Kruskal's algorithm on a graph with V vertices and E edges using Disjoint Set Union (DSU)?",
      options: ["O(V^2)", "O(E log E)", "O(V log V)", "O(V * E)"],
      answer: 1,
      explanation: "Sorting all E edges dominates the time complexity at O(E log E) (or O(E log V) since E <= V^2). DSU operations take near-linear O(E α(V)) with path compression."
    }
  ],
  twoMarks: [
    {
      id: "tm-1",
      unit: 1,
      difficulty: "Easy",
      question: "Define Self-Referential Structure with a C code example.",
      answer: "A self-referential structure is a structure that contains a pointer to an instance of the same structure type. Example:\\nstruct Node {\\n    int data;\\n    struct Node *next;\\n};"
    },
    {
      id: "tm-2",
      unit: 1,
      difficulty: "Medium",
      question: "Distinguish between malloc() and calloc() in C.",
      answer: "1. malloc(size) allocates uninitialized heap memory containing garbage values.\\n2. calloc(n, size) allocates memory for n elements and initializes all bytes to zero.\\nBoth return void* and require free() to deallocate."
    },
    {
      id: "tm-3",
      unit: 2,
      difficulty: "Easy",
      question: "State the advantages of Circular Linked List over Singly Linked List.",
      answer: "1. Any node can be a starting point for traversal.\\n2. Maintaining a tail pointer allows O(1) insertion at both the head (tail->next) and tail.\\n3. Useful for round-robin CPU scheduling and circular buffers."
    },
    {
      id: "tm-4",
      unit: 3,
      difficulty: "Medium",
      question: "Convert the infix expression (A + B) * (C - D) into postfix notation.",
      answer: "Step 1: (A + B) becomes AB+\\nStep 2: (C - D) becomes CD-\\nStep 3: Combine with '*' -> AB+CD-*\\nFinal Postfix: AB+CD-*"
    },
    {
      id: "tm-5",
      unit: 4,
      difficulty: "Medium",
      question: "Define Balance Factor in an AVL Tree and write its formula.",
      answer: "Balance Factor (BF) measures the height symmetry of a node.\\nFormula: Balance Factor = Height of Left Subtree - Height of Right Subtree\\nIn an AVL tree, BF must be in {-1, 0, 1} for every node."
    },
    {
      id: "tm-6",
      unit: 5,
      difficulty: "Easy",
      question: "Why does BFS use a Queue while DFS uses a Stack?",
      answer: "BFS explores vertices level-by-level in first-discovered order, requiring a FIFO queue. DFS explores as deeply as possible before backtracking, requiring a LIFO stack (or recursion call stack)."
    }
  ],
  fiveMarks: [
    {
      id: "fm-1",
      unit: 1,
      difficulty: "Medium",
      question: "Explain Big O, Big Omega, and Big Theta notations with mathematical definitions and graphical representations.",
      answer: "1. Big O (O): Upper bound. f(n) = O(g(n)) iff 0 <= f(n) <= c*g(n) for all n >= n0. Represents worst-case ceiling.\\n2. Big Omega (Ω): Lower bound. f(n) = Ω(g(n)) iff 0 <= c*g(n) <= f(n) for all n >= n0. Represents best-case floor.\\n3. Big Theta (Θ): Tight bound. f(n) = Θ(g(n)) iff c1*g(n) <= f(n) <= c2*g(n) for all n >= n0. Tightest asymptotic description."
    },
    {
      id: "fm-2",
      unit: 2,
      difficulty: "Medium",
      question: "Write an algorithm and C function to reverse a Singly Linked List iteratively.",
      answer: "Algorithm:\\n1. Initialize three pointers: prev = NULL, curr = head, next = NULL.\\n2. While curr != NULL:\\n   a. next = curr->next (save next)\\n   b. curr->next = prev (reverse pointer)\\n   c. prev = curr (advance prev)\\n   d. curr = next (advance curr)\\n3. Return prev as new head.\\n\\nC Code:\\nstruct Node* reverse(struct Node* head) {\\n    struct Node *prev = NULL, *curr = head, *next = NULL;\\n    while(curr) {\\n        next = curr->next;\\n        curr->next = prev;\\n        prev = curr;\\n        curr = next;\\n    }\\n    return prev;\\n}"
    },
    {
      id: "fm-3",
      unit: 3,
      difficulty: "Hard",
      question: "Explain how to evaluate a Postfix expression using a stack with an example: 5 3 + 8 2 - *.",
      answer: "Dry Run Table:\\nToken | Action | Stack\\n5     | Push 5 | [5]\\n3     | Push 3 | [5, 3]\\n+     | Pop 3, 5 -> 5+3=8, Push 8 | [8]\\n8     | Push 8 | [8, 8]\\n2     | Push 2 | [8, 8, 2]\\n-     | Pop 2, 8 -> 8-2=6, Push 6 | [8, 6]\\n*     | Pop 6, 8 -> 8*6=48, Push 48 | [48]\\nFinal Result = 48."
    },
    {
      id: "fm-4",
      unit: 4,
      difficulty: "Hard",
      question: "Explain the four rotation types in AVL Trees with suitable diagrams.",
      answer: "1. LL Rotation: Right rotation about node A when insertion is in left subtree of left child.\\n2. RR Rotation: Left rotation about node A when insertion is in right subtree of right child.\\n3. LR Rotation: Double rotation - Left rotate left child, then Right rotate node A.\\n4. RL Rotation: Double rotation - Right rotate right child, then Left rotate node A."
    },
    {
      id: "fm-5",
      unit: 5,
      difficulty: "Hard",
      question: "Trace Dijkstra's Algorithm on a graph with vertices {A, B, C, D} starting from source A.",
      answer: "Step 0: dist = [A:0, B:∞, C:∞, D:∞], visited = {}\\nStep 1: Pick A. Relax B (weight 4) and C (weight 2). dist = [A:0, B:4, C:2, D:∞].\\nStep 2: Pick min unvisited C (dist 2). Relax D via C (weight 3 -> dist 5). dist = [A:0, B:4, C:2, D:5].\\nStep 3: Pick min unvisited B (dist 4). No shorter path to D.\\nStep 4: Pick D (dist 5). All nodes visited. Final shortest paths from A: A=0, B=4, C=2, D=5."
    }
  ],
  tenMarks: [
    {
      id: "tmk-1",
      unit: 2,
      difficulty: "Hard",
      question: "Write a complete C program to implement Polynomial Addition using Linked Lists with step-by-step logic, structure definition, and complexity analysis.",
      answer: "Full implementation represents each term as (coeff, power, next). Algorithm traverses both lists: if pow1 == pow2, adds coeffs; if pow1 > pow2, appends term1; if pow2 > pow1, appends term2. Time Complexity: O(M + N). Space Complexity: O(M + N)."
    },
    {
      id: "tmk-2",
      unit: 4,
      difficulty: "Hard",
      question: "Discuss Binary Search Tree (BST) operations: Insertion, Deletion of node with 0, 1, and 2 children, and Search. Provide full C functions for each case.",
      answer: "Covers BST property, recursive insert, search, and the three deletion cases: Leaf (free), 1 child (bypass to child), 2 children (replace with inorder successor, delete successor recursively). Time: O(H) where H is height."
    },
    {
      id: "tmk-3",
      unit: 5,
      difficulty: "Hard",
      question: "Compare Prim's and Kruskal's algorithms for Minimum Spanning Trees. Write detailed C pseudocode and trace both on a given sample 5-vertex graph.",
      answer: "Prim's: Vertex-based, grows single tree, uses key array / min-heap, optimal for dense graphs O(E log V) or O(V^2). Kruskal's: Edge-based, sorts edges, uses Disjoint Set Union (DSU) to prevent cycles, optimal for sparse graphs O(E log E). Both yield the same total MST weight."
    }
  ]
};

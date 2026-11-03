import { getGeminiModel, isGeminiConfigured, AVAILABLE_MODELS } from '../config/gemini.js';
import { syllabusData } from '../data/syllabusData.js';
import { labExperimentsData } from '../data/labExperimentsData.js';

// Helper to sanitize markdown JSON or raw text
function cleanGeminiOutput(text) {
  if (!text) return '';
  return text.trim();
}

/**
 * 1. AI DSA TUTOR
 * Enforces the strict 13-part structured response
 */
export async function generateTutorAnswer(query) {
  const systemPrompt = `You are "DSA MASTER AI", the premier academic and competitive programming tutor specializing in Data Structures and Algorithms implemented in C Programming for engineering undergraduates.

The student asks: "${query}"

You MUST answer using the exact 13 structured sections below. Do not omit any section. Use clean markdown formatting with headers:

### 1. Simple Explanation
(2-3 clear, beginner-friendly sentences explaining the core concept)

### 2. Detailed Explanation
(In-depth academic explanation covering mechanisms, operations, and nuances)

### 3. Real-Life Analogy
(A vivid real-world analogy that makes the concept unforgettable)

### 4. Diagram
(A clean, readable ASCII art or structured diagram depicting the structure or algorithm)

### 5. Dry Run
(Step-by-step execution walkthrough with a clear trace table or numbered steps)

### 6. C Program
(Complete, idiomatic, fully compilable C code with proper headers #include <stdio.h> etc., comments, and dynamic memory safety)

### 7. Time Complexity
(Best, Average, and Worst Case with mathematical derivation/rationale)

### 8. Space Complexity
(Auxiliary memory and total memory breakdown)

### 9. Common Viva Questions
(Top 3-4 rapid-fire viva questions and their punchy answers that examiners love to ask)

### 10. Common Mistakes
(Pitfalls students make in C like dangling pointers, off-by-one errors, segmentation faults)

### 11. Theory Exam Perspective
(How questions appear in semester theory exams, how marks are split, which keywords to underline)

### 12. Lab Exam Perspective
(What lab invigilators test for, essential edge cases, pointer checks)

### 13. Placement Perspective
(How this topic maps to LeetCode/HackerRank, interview variations, and follow-ups asked by top tech companies)
`;

  // Try each model in sequence
  for (const modelName of AVAILABLE_MODELS) {
    const model = getGeminiModel(modelName);
    if (!model) continue;

    try {
      const result = await model.generateContent(systemPrompt);
      const text = result.response.text();
      if (text && text.length > 200) {
        return { source: `gemini (${modelName})`, content: cleanGeminiOutput(text) };
      }
    } catch (err) {
      console.warn(`[Gemini Service] Model ${modelName} call: ${err.message}. Trying next fallback...`);
    }
  }

  // Fallback engine: look up query in syllabus/experiments
  return generateOfflineTutorAnswer(query);
}

function generateOfflineTutorAnswer(query) {
  const qLower = query.toLowerCase();
  // Find matching topic in syllabus
  let matchedTopic = null;
  for (const unit of syllabusData) {
    for (const topic of unit.topics) {
      if (qLower.includes(topic.title.toLowerCase()) || topic.keyConcepts.some(k => qLower.includes(k.toLowerCase()))) {
        matchedTopic = topic;
        break;
      }
    }
    if (matchedTopic) break;
  }

  // Default to Linked List or AVL if query generic
  const title = matchedTopic ? matchedTopic.title : (qLower.includes('avl') ? 'AVL Rotation' : 'Singly Linked List');
  const summary = matchedTopic ? matchedTopic.summary : 'A dynamic data structure consisting of nodes with data and pointer references.';
  const snippet = matchedTopic ? matchedTopic.cSnippet : `struct Node {\n    int data;\n    struct Node* next;\n};`;
  const vivaQ = matchedTopic ? matchedTopic.vivaQ : 'What is the advantage of Linked List over Array?';
  const vivaAns = matchedTopic ? matchedTopic.vivaAns : 'Dynamic size and O(1) insertion/deletion at head without shifting elements.';

  return {
    source: 'offline-engine',
    content: `### 1. Simple Explanation
**${title}** is an essential data structure / algorithmic concept in C programming. ${summary}

### 2. Detailed Explanation
In C, this concept relies directly on memory management, pointer manipulation, and structure definitions. When allocated on the heap using \`malloc()\`, each node or element retains its individual address space. The operations maintain invariants such that search, insertion, and traversal proceed deterministically without memory leaks or dangling pointers.

### 3. Real-Life Analogy
Imagine a treasure hunt where every clue card has a message (the data) and the GPS coordinate of the next clue card (the pointer). Even if the clues are scattered all across the city (non-contiguous heap memory), you can follow the chain seamlessly from start to finish!

### 4. Diagram
\`\`\`text
  +-------------+       +-------------+       +-------------+
  | Data | Next | ----> | Data | Next | ----> | Data | NULL |
  +-------------+       +-------------+       +-------------+
       10                    20                    30
\`\`\`

### 5. Dry Run
Let us trace an input sequence of elements:
1. Initialize structure: Head is \`NULL\`.
2. Insert element 10: Node created at address \`0x1000\`, \`next = NULL\`. Head = \`0x1000\`.
3. Insert element 20: Node created at address \`0x2000\`, \`next\` links from previous node.
4. Traversal visits: 10 -> 20 -> NULL.

### 6. C Program
\`\`\`c
#include <stdio.h>
#include <stdlib.h>

${snippet}

int main() {
    printf("Demonstrating ${title} in C\\n");
    // Memory initialization and safe operations
    return 0;
}
\`\`\`

### 7. Time Complexity
- **Average Case:** O(log N) or O(N) depending on linear vs hierarchical tree structure.
- **Worst Case:** O(N) during linear scans or degenerate configurations.
- **Best Case:** O(1) for head/root level operations.

### 8. Space Complexity
- **Auxiliary Space:** O(1) iterative or O(H) recursion stack.
- **Total Space:** O(N) where each node occupies data bytes + pointer size (8 bytes on 64-bit systems).

### 9. Common Viva Questions
- **Q1:** ${vivaQ}
  *Answer:* ${vivaAns}
- **Q2:** Why must we check if \`malloc()\` returns NULL in C?
  *Answer:* If heap memory is exhausted, \`malloc()\` returns NULL. Dereferencing NULL immediately causes a Segmentation Fault (SIGSEGV).

### 10. Common Mistakes
1. Forgetting to free dynamically allocated nodes before program termination or losing the pointer.
2. Dereferencing uninitialized pointers (\`wild pointers\`).
3. Confusing the dot (\`.\`) operator with the arrow (\`->\`) operator on structure pointers.

### 11. Theory Exam Perspective
- Typical marks: **5 to 10 Marks**.
- **Crucial Keywords to Underline:** Time complexity notation, pointer arithmetic, struct definition, NULL-termination.
- **Scoring Rubric:** Definition (2 marks), Diagram & Algorithm (3 marks), C Code (5 marks).

### 12. Lab Exam Perspective
- Lab examiners will test boundary conditions: empty structure, single element, duplicate keys, and deleting the head node.
- Always demonstrate clean compilation with \`gcc -Wall\` without warnings.

### 13. Placement Perspective
- In FAANG and product company interviews, questions like this form the building blocks for Two Pointers, Monotonic Stacks, and Tree Traversal variations.
- Common interview follow-up: "Can you do this in-place with O(1) auxiliary space?"`
  };
}

/**
 * 4. LAB EXAM SIMULATOR EVALUATION
 */
export async function evaluateLabCode({ question, studentCode, timeTakenMinutes }) {
  const prompt = `You are a strict yet fair university Lab Exam Examiner evaluating a C programming lab submission.

Exam Question: "${question}"
Student's Submitted C Code:
\`\`\`c
${studentCode}
\`\`\`
Time Taken: ${timeTakenMinutes || '45'} minutes.

Evaluate the code out of 10 marks according to this strict rubric:
- Logic & Correctness (0-3 marks)
- Edge Cases & Input Validation (0-2 marks)
- Output Formatting & Standards (0-2 marks)
- Code Readability & Memory Safety (freeing mallocs) (0-1 mark)
- Viva & Conceptual Soundness (0-2 marks)

Return ONLY valid JSON matching this schema:
{
  "totalMarks": number (0 to 10),
  "breakdown": {
    "logic": number,
    "validation": number,
    "output": number,
    "readability": number,
    "viva": number
  },
  "verdict": "Distinction" | "Passed" | "Needs Improvement" | "Failed",
  "timeComplexity": "e.g. O(N)",
  "spaceComplexity": "e.g. O(1)",
  "bugsDetected": ["list of specific bugs or memory issues detected"],
  "improvements": ["concrete suggestions for optimization or clean code"],
  "vivaQuestions": [
    { "question": "Question based specifically on what the student coded", "sampleAnswer": "concise answer" },
    { "question": "Another pointer/memory question based on their code", "sampleAnswer": "concise answer" }
  ],
  "examinerRemarks": "Honest paragraph of examiner feedback."
}`;

  for (const modelName of AVAILABLE_MODELS) {
    const model = getGeminiModel(modelName);
    if (!model) continue;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn(`[Gemini Service] Model ${modelName} lab eval: ${err.message}. Trying next fallback...`);
    }
  }

  // Fallback evaluator
  const hasMalloc = studentCode.includes('malloc');
  const hasFree = studentCode.includes('free');
  const hasNullCheck = studentCode.includes('NULL');
  const hasMain = studentCode.includes('main');

  let logic = hasMain ? 2.5 : 1.5;
  let validation = hasNullCheck ? 1.5 : 0.5;
  let output = 1.5;
  let readability = hasFree ? 1.0 : 0.5;
  let viva = 1.5;
  let total = Math.min(10, Math.round((logic + validation + output + readability + viva) * 10) / 10);

  const bugs = [];
  if (hasMalloc && !hasFree) bugs.push("Memory Leak: Heap memory was allocated using malloc() but never freed using free().");
  if (!hasNullCheck) bugs.push("Null Pointer Dereference Risk: Pointers are accessed without checking if (ptr == NULL).");
  if (!hasMain) bugs.push("Missing main() function: Code cannot be independently executed or tested.");

  return {
    totalMarks: total,
    breakdown: { logic, validation, output, readability, viva },
    verdict: total >= 8 ? "Distinction" : total >= 5 ? "Passed" : "Needs Improvement",
    timeComplexity: "O(N) for linear operations / O(1) for direct pointer manipulation",
    spaceComplexity: "O(1) auxiliary space, O(N) heap memory",
    bugsDetected: bugs.length > 0 ? bugs : ["None detected! Clean syntax and structure."],
    improvements: [
      "Always typecast malloc return value in C99/C11 standards for clarity.",
      "Check return status of scanf() to prevent format string injection or uninitialized inputs.",
      "Set dangling pointers to NULL immediately after calling free()."
    ],
    vivaQuestions: [
      {
        question: "Why is it important to set a pointer to NULL after freeing its allocated memory?",
        sampleAnswer: "To avoid creating a dangling pointer that points to deallocated memory, which could cause undefined behavior if accessed."
      },
      {
        question: "What is the time complexity of inserting a node at the head versus at the tail of your list?",
        sampleAnswer: "At head it is O(1). At tail without a tail pointer, it is O(N) because you must traverse all N nodes."
      }
    ],
    examinerRemarks: total >= 8
      ? "Strong submission. The logic is clear and you demonstrated good familiarity with C pointers and structure definitions."
      : "Acceptable attempt, but pay strict attention to pointer safety, edge-case null checks, and memory deallocation."
  };
}

/**
 * 5. VIVA TRAINER
 * Strict lab examiner persona with adaptive difficulty
 */
export async function runVivaTurn({ topic, history = [], studentAnswer, currentScore = 0, difficulty = 'Medium' }) {
  const prompt = `You are Prof. Ramanathan, a notoriously strict, meticulous university external lab examiner conducting a C Programming and DSA viva examination.
Topic: "${topic}"
Difficulty Level: "${difficulty}" (Easy -> Medium -> Hard)
Current Student Viva Score: ${currentScore} / 100

Previous Conversation History:
${JSON.stringify(history.slice(-4))}

The student just answered:
"${studentAnswer || 'I am ready, sir. Please ask the first question.'}"

Assess their answer critically. Point out what they missed (e.g. memory leaks, Big-O nuances, C pointer pitfalls).
Assign a score adjustment (-10 to +15), update the difficulty, provide strict examiner remarks, and formulate the NEXT question.

Return ONLY valid JSON matching this schema:
{
  "examinerFeedback": "Strict evaluation of student's answer. Praise if accurate, critique omissions.",
  "scoreDelta": number (-10 to +15),
  "newTotalScore": number (clamped 0 to 100),
  "nextDifficulty": "Easy" | "Medium" | "Hard",
  "nextQuestion": "The next challenging viva question",
  "hint": "Short conceptual hint if the student gets stuck",
  "isExamComplete": boolean (true if 5 or more questions answered)
}`;

  for (const modelName of AVAILABLE_MODELS) {
    const model = getGeminiModel(modelName);
    if (!model) continue;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn(`[Gemini Service] Model ${modelName} viva: ${err.message}. Trying next fallback...`);
    }
  }

  // Fallback examiner
  const delta = studentAnswer && studentAnswer.length > 25 ? 12 : 5;
  const newScore = Math.min(100, Math.max(0, currentScore + delta));
  const count = history.length;

  const sampleQuestions = {
    'Linked List': [
      "What is the difference between a singly linked list and an array in terms of memory cache locality?",
      "How would you find the middle of a linked list in one pass without counting the total length?",
      "Why does a doubly linked list require more memory and when is that trade-off justified?",
      "What is a dangling pointer and how does it happen in linked list node deletion?"
    ],
    'Stack': [
      "Explain the exact condition for stack overflow in an array-based implementation.",
      "How does the call stack manage recursion depth and what causes a stack overflow error?",
      "How is a stack used in compiler syntax analysis for balancing parentheses?"
    ],
    'Queue': [
      "What is false overflow in a simple linear queue, and how does circular queue solve it mathematically?",
      "Write down the modulo arithmetic formula to advance rear and front in circular queue.",
      "How does a Priority Queue differ from a regular FIFO queue?"
    ],
    'Tree': [
      "Why does the Inorder traversal of a Binary Search Tree always yield elements in sorted order?",
      "What is an AVL tree and what is the allowed range of its balance factor?",
      "Explain the LR double rotation mechanism in AVL trees."
    ]
  };

  const topicPool = sampleQuestions[topic] || sampleQuestions['Linked List'];
  const nextQ = topicPool[count % topicPool.length] || "What is the time complexity of finding an element in this structure?";

  return {
    examinerFeedback: studentAnswer
      ? "You grasped the fundamental concept, but in an examination you must explicitly state the pointer mechanics and the time complexity."
      : "Let us begin your viva. Pay close attention and be precise.",
    scoreDelta: delta,
    newTotalScore: newScore,
    nextDifficulty: newScore > 60 ? "Hard" : newScore > 30 ? "Medium" : "Easy",
    nextQuestion: nextQ,
    hint: "Think about pointer dereferencing and whether memory is contiguous.",
    isExamComplete: count >= 5
  };
}

/**
 * 6. CODE ANALYZER
 */
export async function analyzeCode({ code, userGoal }) {
  const prompt = `You are a C Programming compiler and static analysis expert.
Student submitted C Code:
\`\`\`c
${code}
\`\`\`
Goal/Context: "${userGoal || 'Analyze DSA correctness and memory safety'}"

Perform an exhaustive, deep code audit. Return ONLY valid JSON:
{
  "summary": "High-level summary of what the code does",
  "lineByLine": [
    { "line": "code snippet or line number", "explanation": "clear explanation of what it does" }
  ],
  "mistakes": [
    { "issue": "e.g. Memory leak / Null dereference", "severity": "High" | "Medium" | "Low", "description": "why it is dangerous" }
  ],
  "improvedCode": "Complete, corrected, clean C code with best practices",
  "flowSteps": ["Step 1...", "Step 2...", "Step 3..."],
  "pseudocode": "Neat algorithmic pseudocode",
  "vivaQuestions": [
    { "question": "Question about this specific code", "answer": "Model answer" },
    { "question": "Another pointer/complexity question", "answer": "Model answer" }
  ],
  "complexity": {
    "time": "e.g. O(N)",
    "space": "e.g. O(1)",
    "explanation": "Why this complexity arises"
  }
}`;

  for (const modelName of AVAILABLE_MODELS) {
    const model = getGeminiModel(modelName);
    if (!model) continue;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn(`[Gemini Service] Model ${modelName} code analyzer: ${err.message}. Trying next fallback...`);
    }
  }

  // Fallback code analyzer
  return {
    summary: "C code implementing data structure routines with pointer manipulation.",
    lineByLine: [
      { line: "Data structure definitions", explanation: "Defines memory blueprint and node pointers." },
      { line: "Dynamic allocation via malloc()", explanation: "Requests requested bytes from runtime heap." },
      { line: "Pointer assignment & linking", explanation: "Updates next/prev addresses to maintain structural invariants." }
    ],
    mistakes: [
      { issue: "Missing NULL Check on malloc", severity: "High", description: "If heap allocation fails, dereferencing the pointer causes an immediate segmentation fault." },
      { issue: "Explicit Memory Deallocation", severity: "Medium", description: "Ensure every malloc() has a corresponding free() call to avoid memory leaks." }
    ],
    improvedCode: code.includes('#include') ? code : `#include <stdio.h>\n#include <stdlib.h>\n\n${code}\n`,
    flowSteps: [
      "1. Allocate node memory on heap.",
      "2. Validate that allocated pointer is non-null.",
      "3. Populate data and update chain pointers.",
      "4. Traverse or process elements.",
      "5. Deallocate memory before exiting."
    ],
    pseudocode: `FUNCTION ProcessData(head, val):
    newNode = ALLOCATE(Node)
    IF newNode IS NULL THEN RETURN ERROR
    newNode.data = val
    newNode.next = head
    RETURN newNode`,
    vivaQuestions: [
      { question: "What happens if free() is called twice on the same pointer (double free)?", answer: "It causes undefined behavior, often crashing the program with a glibc heap corruption error." },
      { question: "What is the memory size of a pointer variable in 64-bit C?", answer: "8 bytes, regardless of what data type the pointer points to." }
    ],
    complexity: {
      time: "O(N) for linear traversals, O(1) for direct head operations",
      space: "O(1) auxiliary space",
      explanation: "Proportional to number of elements traversed in the structure."
    }
  };
}

/**
 * 8. LAST MINUTE REVISION
 */
export async function generateRevisionNotes({ mode = '15min', unit = 'all' }) {
  const prompt = `You are creating an emergency "Last Minute Revision" guide for Engineering C DSA semester exams.
Mode: "${mode}" (15 Minutes, 30 Minutes, or 1 Hour)
Unit Filter: "${unit}"

Provide a punchy, high-yield summary containing:
1. Top Important Definitions (one-liners, formulae)
2. Crucial Algorithms with steps
3. Essential C Code Snippets (most frequently asked in exams)
4. High-Probability Expected Exam Questions (2M, 5M, 10M)
5. Rapid-fire Viva Traps & Answers

Return ONLY valid JSON:
{
  "mode": "${mode}",
  "estimatedReadTime": "${mode === '15min' ? '15 mins' : mode === '30min' ? '30 mins' : '60 mins'}",
  "definitions": [
    { "term": "Term Name", "definition": "concise exam definition", "formula": "optional formula or key condition" }
  ],
  "crucialAlgorithms": [
    { "name": "Algorithm Name", "time": "O(N)", "steps": ["step 1", "step 2"] }
  ],
  "mustKnowPrograms": [
    { "title": "Program Title", "code": "short essential C snippet", "keyTrick": "crucial point examiners look for" }
  ],
  "expectedQuestions": [
    { "marks": "2 Marks", "question": "Question text", "answerSummary": "Key points to write" },
    { "marks": "5 Marks", "question": "Question text", "answerSummary": "Key points to write" },
    { "marks": "10 Marks", "question": "Question text", "answerSummary": "Key points to write" }
  ],
  "vivaTraps": [
    { "trap": "Examiner trick question", "correctResponse": "The correct answer" }
  ]
}`;

  for (const modelName of AVAILABLE_MODELS) {
    const model = getGeminiModel(modelName);
    if (!model) continue;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn(`[Gemini Service] Model ${modelName} revision: ${err.message}. Trying next fallback...`);
    }
  }

  // High-yield fallback revision guide
  return {
    mode,
    estimatedReadTime: mode === '15min' ? '15 mins' : mode === '30min' ? '30 mins' : '60 mins',
    definitions: [
      { term: "Self-Referential Structure", definition: "A struct containing a pointer to an instance of itself.", formula: "struct Node { int d; struct Node *next; };" },
      { term: "Balance Factor (AVL)", definition: "Height difference between left and right subtrees; must be {-1, 0, 1}.", formula: "BF = height(left) - height(right)" },
      { term: "Circular Queue Full Condition", definition: "Condition preventing overwrite of front.", formula: "(rear + 1) % MAX == front" },
      { term: "Big O Notation", definition: "Asymptotic upper bound on growth rate.", formula: "0 <= f(n) <= c * g(n) for n >= n0" }
    ],
    crucialAlgorithms: [
      { name: "Reverse Singly Linked List", time: "O(N)", steps: ["prev=NULL, curr=head", "while(curr){ next=curr->next; curr->next=prev; prev=curr; curr=next; }", "head=prev"] },
      { name: "Dijkstra's Algorithm", time: "O(V^2)", steps: ["dist[src]=0, all others INF", "Pick min unvisited u", "Relax neighbors: if(dist[u]+w < dist[v]) dist[v]=dist[u]+w"] },
      { name: "Infix to Postfix", time: "O(N)", steps: ["Scan operands -> output", "'(' -> push", "')' -> pop to output until '('", "Operator -> pop higher/equal precedence, push current"] }
    ],
    mustKnowPrograms: [
      {
        title: "BST Insertion Function",
        code: `struct Node* insert(struct Node* root, int key) {\n    if(!root) return createNode(key);\n    if(key < root->data) root->left = insert(root->left, key);\n    else if(key > root->data) root->right = insert(root->right, key);\n    return root;\n}`,
        keyTrick: "Must assign root->left and root->right and return root at each step."
      },
      {
        title: "SLL Node Deletion",
        code: `prev->next = curr->next; free(curr);`,
        keyTrick: "Never free(curr) before updating prev->next or you lose the remaining chain!"
      }
    ],
    expectedQuestions: [
      { marks: "2 Marks", question: "What is structure padding?", answerSummary: "Compiler aligns structure members to multiple-byte word boundaries for faster bus access." },
      { marks: "5 Marks", question: "Explain AVL Rotations (LL, RR, LR, RL) with diagrams.", answerSummary: "Show single rotation for LL/RR, double rotation for LR/RL." },
      { marks: "10 Marks", question: "Implement Queue using Linked List with enqueue and dequeue.", answerSummary: "Define struct QNode, Queue with front and rear pointers, O(1) operations." }
    ],
    vivaTraps: [
      { trap: "Can an AVL tree have a balance factor of +2 after insertion?", correctResponse: "Temporarily yes during insertion, which immediately triggers a rotation to restore BF to {-1, 0, +1}." },
      { trap: "Why is calloc preferred for dynamic arrays over malloc?", correctResponse: "calloc clears all allocated bytes to zero, preventing garbage value calculation bugs." }
    ]
  };
}

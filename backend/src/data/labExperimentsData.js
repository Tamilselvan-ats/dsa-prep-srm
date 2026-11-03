export const labExperimentsData = [
  {
    id: 1,
    title: "Structures",
    aim: "To write a C program to declare, initialize, and process student records using structures, calculating total marks and displaying ranking.",
    algorithm: [
      "1. Define struct Student with members: id (int), name (char[50]), marks[3] (float), and total (float).",
      "2. Read the number of students N.",
      "3. Loop through N: input id, name, and 3 subject marks; compute total = marks[0] + marks[1] + marks[2].",
      "4. Sort or display student records in descending order of total marks.",
      "5. Print the formatted student report card table."
    ],
    program: `#include <stdio.h>
#include <string.h>

struct Student {
    int id;
    char name[50];
    float marks[3];
    float total;
};

int main() {
    int n;
    printf("Enter number of students: ");
    if (scanf("%d", &n) != 1 || n <= 0) return 1;

    struct Student s[100];
    for (int i = 0; i < n; i++) {
        printf("\\nEnter details for student %d (ID Name M1 M2 M3):\\n", i + 1);
        scanf("%d %s %f %f %f", &s[i].id, s[i].name, &s[i].marks[0], &s[i].marks[1], &s[i].marks[2]);
        s[i].total = s[i].marks[0] + s[i].marks[1] + s[i].marks[2];
    }

    printf("\\n--- STUDENT REPORT CARD ---\\n");
    printf("%-5s %-20s %-8s %-8s %-8s %-8s\\n", "ID", "Name", "M1", "M2", "M3", "Total");
    for (int i = 0; i < n; i++) {
        printf("%-5d %-20s %-8.1f %-8.1f %-8.1f %-8.1f\\n",
               s[i].id, s[i].name, s[i].marks[0], s[i].marks[1], s[i].marks[2], s[i].total);
    }
    return 0;
}`,
    sampleInput: `2
101 Rahul 85 90 88
102 Priya 92 95 94`,
    sampleOutput: `--- STUDENT REPORT CARD ---
ID    Name                 M1       M2       M3       Total   
101   Rahul                85.0     90.0     88.0     263.0   
102   Priya                92.0     95.0     94.0     281.0`,
    dryRun: "For N=2, loop reads student 1 (Rahul) -> calculates total 85+90+88=263. Student 2 (Priya) -> calculates total 92+95+94=281. Formats output with 281.0.",
    vivaQuestions: [
      { q: "What is the difference between structure and union in C?", a: "A structure allocates individual memory for each member (sum + padding). A union shares memory; size equals the largest member, and only one member can be held at any time." },
      { q: "What is structure padding and why is it used?", a: "Padding aligns data members to word boundaries (e.g., 4 or 8 bytes) so the CPU can read them with single clock cycle bus reads." }
    ],
    commonErrors: [
      "Forgetting semicolon after closing brace of struct definition.",
      "Passing struct by value instead of pointer when modifying members inside functions."
    ],
    memoryDiagram: `+-----------------------------------------+
| struct Student s[0]                     |
| [id: 4B] [name: 50B + 2B pad] [m1:4B]   |
| [m2: 4B] [m3: 4B] [total: 4B]           |
+-----------------------------------------+`,
    complexityAnalysis: "Time Complexity: O(N) to read and compute totals. Space Complexity: O(N) memory for N student structs."
  },
  {
    id: 2,
    title: "Structures using Pointers",
    aim: "To demonstrate passing structure pointers to functions and accessing members using the arrow (->) operator to modify records dynamically.",
    algorithm: [
      "1. Declare struct Book with title, author, price.",
      "2. Write function updatePrice(struct Book *b, float newPrice) using b->price = newPrice.",
      "3. In main(), create a Book instance, obtain its pointer, and call updatePrice.",
      "4. Print updated record values."
    ],
    program: `#include <stdio.h>

struct Book {
    int id;
    char title[40];
    float price;
};

void updatePrice(struct Book *b, float newPrice) {
    b->price = newPrice;
}

void printBook(const struct Book *b) {
    printf("Book ID: %d | Title: %s | Price: $%.2f\\n", b->id, b->title, b->price);
}

int main() {
    struct Book b1 = {101, "Data Structures in C", 450.00};
    printf("Original: ");
    printBook(&b1);

    updatePrice(&b1, 520.50);

    printf("After Price Revision: ");
    printBook(&b1);
    return 0;
}`,
    sampleInput: `(Predefined struct in code)`,
    sampleOutput: `Original: Book ID: 101 | Title: Data Structures in C | Price: $450.00
After Price Revision: Book ID: 101 | Title: Data Structures in C | Price: $520.50`,
    dryRun: "b1 is allocated on stack at address 0x7ffd. Pointer &b1 is passed to updatePrice. 'b->price = newPrice' writes directly to 0x7ffd offset for price without copying the 48-byte struct.",
    vivaQuestions: [
      { q: "Why should we pass structure pointers instead of structure variables to functions?", a: "Passing by value copies the entire struct (high stack memory and CPU overhead). Passing a pointer copies only 4 or 8 bytes, speeding up execution and allowing in-place modifications." },
      { q: "What does the arrow operator (->) do?", a: "ptr->member is shorthand for (*ptr).member (dereference pointer then access struct member)." }
    ],
    commonErrors: [
      "Writing ptr.price instead of ptr->price.",
      "Writing *ptr.price (dot has higher precedence than asterisk, causes compilation error)."
    ],
    memoryDiagram: `[Pointer b: 0x7ffd] ---> [Heap/Stack Memory at 0x7ffd: {id: 101, title: 'Data Structures...', price: 520.50}]`,
    complexityAnalysis: "Time Complexity: O(1) for direct pointer dereference. Space Complexity: O(1) auxiliary stack space."
  },
  {
    id: 3,
    title: "Matrix Multiplication using Dynamic Memory Allocation",
    aim: "To dynamically allocate 2D matrices using pointers-to-pointers (malloc), validate dimension compatibility, perform multiplication, and free memory.",
    algorithm: [
      "1. Read dimensions (r1, c1) and (r2, c2). Validate c1 == r2.",
      "2. Allocate int **A with r1 row pointers, and allocate each row of c1 integers.",
      "3. Allocate int **B with r2 row pointers and c2 integers; allocate C with r1 x c2.",
      "4. Compute C[i][j] = sum(A[i][k] * B[k][j]) for k=0 to c1-1.",
      "5. Print result matrix C and free all rows and pointer arrays."
    ],
    program: `#include <stdio.h>
#include <stdlib.h>

int** allocateMatrix(int r, int c) {
    int **mat = (int **)malloc(r * sizeof(int *));
    for (int i = 0; i < r; i++) {
        mat[i] = (int *)calloc(c, sizeof(int));
    }
    return mat;
}

void freeMatrix(int **mat, int r) {
    for (int i = 0; i < r; i++) free(mat[i]);
    free(mat);
}

int main() {
    int r1 = 2, c1 = 3, r2 = 3, c2 = 2;
    if (c1 != r2) { printf("Incompatible dimensions!\\n"); return 1; }

    int **A = allocateMatrix(r1, c1);
    int **B = allocateMatrix(r2, c2);
    int **C = allocateMatrix(r1, c2);

    int valA = 1, valB = 1;
    for(int i=0; i<r1; i++) for(int j=0; j<c1; j++) A[i][j] = valA++;
    for(int i=0; i<r2; i++) for(int j=0; j<c2; j++) B[i][j] = valB++;

    // Multiply
    for(int i=0; i<r1; i++) {
        for(int j=0; j<c2; j++) {
            for(int k=0; k<c1; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    printf("Result Matrix C (2x2):\\n");
    for(int i=0; i<r1; i++) {
        for(int j=0; j<c2; j++) printf("%4d ", C[i][j]);
        printf("\\n");
    }

    freeMatrix(A, r1); freeMatrix(B, r2); freeMatrix(C, r1);
    return 0;
}`,
    sampleInput: `Matrix A (2x3):
1 2 3
4 5 6
Matrix B (3x2):
1 2
3 4
5 6`,
    sampleOutput: `Result Matrix C (2x2):
  22   28 
  49   64`,
    dryRun: "C[0][0] = 1*1 + 2*3 + 3*5 = 1 + 6 + 15 = 22. C[0][1] = 1*2 + 2*4 + 3*6 = 2 + 8 + 18 = 28. C[1][0] = 4*1 + 5*3 + 6*5 = 49. C[1][1] = 4*2 + 5*4 + 6*6 = 64.",
    vivaQuestions: [
      { q: "Why do we free row pointers before freeing the main pointer array?", a: "If you free the main pointer array first, you lose the addresses of each individual row, causing orphan memory blocks and memory leaks." },
      { q: "What is calloc vs malloc?", a: "malloc allocates uninitialized heap memory. calloc takes (numElements, size) and initializes all allocated bytes to zero." }
    ],
    commonErrors: [
      "Accessing out-of-bounds indices in matrix loop conditions (mixing up r1, c1, r2, c2).",
      "Memory leak by calling free(mat) without freeing each mat[i] first."
    ],
    memoryDiagram: `A (int**) -> [ *row0 | *row1 ]
               |         |
               v         v
             [1,2,3]   [4,5,6]`,
    complexityAnalysis: "Time: O(r1 * c2 * c1) = O(N^3). Auxiliary Space: O(r1*c1 + r2*c2 + r1*c2) heap allocations."
  },
  {
    id: 4,
    title: "Array Implementation of List",
    aim: "To implement List ADT using a static array supporting insert at position, delete at position, search, and display operations.",
    algorithm: [
      "1. Maintain an array list[MAX] and integer size = 0.",
      "2. Insert(val, pos): Shift elements from index size-1 down to pos to the right by 1, assign list[pos] = val, increment size.",
      "3. Delete(pos): Shift elements from pos+1 up to size-1 to the left by 1, decrement size.",
      "4. Search(val): Linearly compare val with elements; return index or -1.",
      "5. Display: Loop from 0 to size-1."
    ],
    program: `#include <stdio.h>
#define MAX 100

int list[MAX], size = 0;

void insert(int pos, int val) {
    if (size >= MAX || pos < 0 || pos > size) {
        printf("Invalid position or List Overflow!\\n");
        return;
    }
    for (int i = size; i > pos; i--) list[i] = list[i - 1];
    list[pos] = val;
    size++;
    printf("Inserted %d at position %d\\n", val, pos);
}

void delete(int pos) {
    if (size <= 0 || pos < 0 || pos >= size) {
        printf("Invalid position or List Underflow!\\n");
        return;
    }
    int removed = list[pos];
    for (int i = pos; i < size - 1; i++) list[i] = list[i + 1];
    size--;
    printf("Deleted %d from position %d\\n", removed, pos);
}

void display() {
    printf("List elements (%d): [ ", size);
    for (int i = 0; i < size; i++) printf("%d ", list[i]);
    printf("]\\n");
}

int main() {
    insert(0, 10);
    insert(1, 20);
    insert(1, 15);
    display();
    delete(1);
    display();
    return 0;
}`,
    sampleInput: `Operations: insert(0, 10), insert(1, 20), insert(1, 15), delete(1)`,
    sampleOutput: `Inserted 10 at position 0
Inserted 20 at position 1
Inserted 15 at position 1
List elements (3): [ 10 15 20 ]
Deleted 15 from position 1
List elements (2): [ 10 20 ]`,
    dryRun: "Insert 10 at 0: [10]. Insert 20 at 1: [10, 20]. Insert 15 at 1: shifts 20 to index 2, writes 15 at index 1 -> [10, 15, 20]. Delete at 1: shifts 20 into index 1 -> [10, 20].",
    vivaQuestions: [
      { q: "What is the worst-case time complexity of insertion in array-based list?", a: "O(N), which happens when inserting at the beginning (index 0) because all N existing elements must shift right." },
      { q: "What is the primary advantage of array implementation over linked lists?", a: "Constant time O(1) random access by index and high cache locality because array elements are stored consecutively in RAM." }
    ],
    commonErrors: [
      "Not checking size >= MAX before insertion (array overflow).",
      "Off-by-one errors when shifting elements in insert and delete loops."
    ],
    memoryDiagram: `list: [ 10 | 20 | empty ... ] (Indices: 0, 1 ... 99), size = 2`,
    complexityAnalysis: "Access: O(1). Insert: O(N). Delete: O(N). Search: O(N). Auxiliary Space: O(MAX)."
  },
  {
    id: 5,
    title: "Linked List (Singly Linked List)",
    aim: "To implement Singly Linked List with operations: insert at beginning, insert at end, delete node by key, search, reverse, and traversal.",
    algorithm: [
      "1. Create struct Node { int data; struct Node* next; }.",
      "2. insertAtHead: allocate new node, set next = head, head = new node.",
      "3. insertAtTail: traverse till last node (next == NULL), attach new node.",
      "4. deleteKey: find key node while keeping prev pointer; set prev->next = curr->next; free(curr).",
      "5. reverse: use three pointers (prev = NULL, curr = head, next = NULL) to reverse links.",
      "6. display: traverse from head printing data until NULL."
    ],
    program: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* insertAtHead(struct Node* head, int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->data = val; n->next = head;
    return n;
}

struct Node* deleteNode(struct Node* head, int key) {
    struct Node *curr = head, *prev = NULL;
    if (curr && curr->data == key) {
        head = curr->next;
        free(curr);
        return head;
    }
    while (curr && curr->data != key) {
        prev = curr;
        curr = curr->next;
    }
    if (!curr) return head; // not found
    prev->next = curr->next;
    free(curr);
    return head;
}

struct Node* reverse(struct Node* head) {
    struct Node *prev = NULL, *curr = head, *next = NULL;
    while (curr) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

void display(struct Node* head) {
    while (head) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    head = insertAtHead(head, 30);
    head = insertAtHead(head, 20);
    head = insertAtHead(head, 10);
    printf("Original List: ");
    display(head);

    head = deleteNode(head, 20);
    printf("After deleting 20: ");
    display(head);

    head = reverse(head);
    printf("Reversed List: ");
    display(head);
    return 0;
}`,
    sampleInput: `Insert 30, 20, 10 at head. Delete 20. Reverse list.`,
    sampleOutput: `Original List: 10 -> 20 -> 30 -> NULL
After deleting 20: 10 -> 30 -> NULL
Reversed List: 30 -> 10 -> NULL`,
    dryRun: "10->20->30. deleteNode(20): prev=10, curr=20. prev->next = curr->next (30), free(20). List becomes 10->30. Reverse: prev starts NULL, 10 points to NULL, 30 points to 10. Head is 30.",
    vivaQuestions: [
      { q: "Why does reversing a singly linked list require three pointers?", a: "We need 'curr' for current node, 'prev' to redirect curr->next backward, and 'next' to temporarily store the forward pointer before curr->next is overwritten." },
      { q: "What is a memory leak in a linked list?", a: "Occurs when a node is unlinked from the list without calling free(), leaving unreachable heap memory consumed." }
    ],
    commonErrors: [
      "Dereferencing curr->next before checking if curr is NULL (causes Segmentation Fault).",
      "Losing reference to the rest of the list during insertion or deletion."
    ],
    memoryDiagram: `[Head] -> [10 | *] -> [30 | NULL]`,
    complexityAnalysis: "Insert at head: O(1). Delete key: O(N). Search: O(N). Reverse: O(N) time and O(1) space."
  },
  {
    id: 6,
    title: "Doubly Linked List",
    aim: "To implement Doubly Linked List with forward and backward traversal, insertion at position, and deletion in O(1) given node pointer.",
    algorithm: [
      "1. Define struct DNode { int data; struct DNode *prev, *next; }.",
      "2. insertAtEnd: if empty, head = new node. Else walk to last node, set last->next = new, new->prev = last.",
      "3. deleteNode: set curr->prev->next = curr->next and curr->next->prev = curr->prev, then free(curr).",
      "4. Traverse forward from head and backward from tail."
    ],
    program: `#include <stdio.h>
#include <stdlib.h>

struct DNode {
    int data;
    struct DNode *prev;
    struct DNode *next;
};

struct DNode* insertEnd(struct DNode* head, int val) {
    struct DNode* n = (struct DNode*)malloc(sizeof(struct DNode));
    n->data = val; n->next = NULL; n->prev = NULL;
    if (!head) return n;
    struct DNode* temp = head;
    while (temp->next) temp = temp->next;
    temp->next = n;
    n->prev = temp;
    return head;
}

void printForward(struct DNode* head) {
    printf("Forward:  ");
    while (head) {
        printf("%d <-> ", head->data);
        if (!head->next) break;
        head = head->next;
    }
    printf("NULL\\n");
}

int main() {
    struct DNode* head = NULL;
    head = insertEnd(head, 100);
    head = insertEnd(head, 200);
    head = insertEnd(head, 300);
    printForward(head);
    return 0;
}`,
    sampleInput: `Insert 100, 200, 300 at end.`,
    sampleOutput: `Forward:  100 <-> 200 <-> 300 <-> NULL`,
    dryRun: "Node 100 created with prev=NULL. Node 200 attached: 100->next = 200, 200->prev = 100. Node 300 attached: 200->next = 300, 300->prev = 200.",
    vivaQuestions: [
      { q: "What is the primary advantage of DLL over SLL?", a: "Bidirectional traversal and O(1) deletion when given a pointer to the node to be deleted (no need to traverse to find predecessor)." },
      { q: "What is the disadvantage of DLL?", a: "Extra memory overhead for the 'prev' pointer per node (8 bytes on 64-bit systems) and extra pointer updates during insert/delete." }
    ],
    commonErrors: [
      "Not setting prev of newly inserted node.",
      "Null pointer dereference when accessing curr->next->prev when curr is the tail node."
    ],
    memoryDiagram: `NULL <- [prev | 100 | next] <===> [prev | 200 | next] <===> [prev | 300 | next] -> NULL`,
    complexityAnalysis: "Insert End (with tail): O(1). Delete given node: O(1). Space: 2 pointers per node."
  },
  {
    id: 7,
    title: "Stack using Array and Linked List",
    aim: "To implement Stack ADT (push, pop, peek, isEmpty) using both Static Array and Dynamic Linked List in C.",
    algorithm: [
      "Array Stack: Maintain stack[MAX] and top = -1. Push increments top; pop decrements top.",
      "Linked List Stack: Push allocates new node and sets new->next = top, top = new. Pop deletes top node and sets top = top->next.",
      "Demonstrate LIFO order with both implementations."
    ],
    program: `#include <stdio.h>
#include <stdlib.h>

#define MAX 5
int arrStack[MAX];
int topArr = -1;

void pushArr(int x) {
    if (topArr == MAX - 1) { printf("Stack Overflow!\\n"); return; }
    arrStack[++topArr] = x;
}

int popArr() {
    if (topArr == -1) { printf("Stack Underflow!\\n"); return -1; }
    return arrStack[topArr--];
}

// Linked List Stack
struct StackNode {
    int data;
    struct StackNode* next;
};
struct StackNode* topLL = NULL;

void pushLL(int x) {
    struct StackNode* n = (struct StackNode*)malloc(sizeof(struct StackNode));
    n->data = x; n->next = topLL;
    topLL = n;
}

int popLL() {
    if (!topLL) { printf("LL Stack Underflow!\\n"); return -1; }
    struct StackNode* temp = topLL;
    int val = temp->data;
    topLL = topLL->next;
    free(temp);
    return val;
}

int main() {
    printf("--- ARRAY STACK ---\\n");
    pushArr(10); pushArr(20); pushArr(30);
    printf("Popped: %d, Popped: %d\\n", popArr(), popArr());

    printf("--- LINKED LIST STACK ---\\n");
    pushLL(50); pushLL(60);
    printf("Popped LL: %d, Popped LL: %d\\n", popLL(), popLL());
    return 0;
}`,
    sampleInput: `Push 10, 20, 30 to Array Stack; Pop two. Push 50, 60 to LL Stack; Pop two.`,
    sampleOutput: `--- ARRAY STACK ---
Popped: 30, Popped: 20
--- LINKED LIST STACK ---
Popped LL: 60, Popped LL: 50`,
    dryRun: "pushArr(10, 20, 30): topArr is 2 (val 30). popArr() returns 30 (top becomes 1), then 20 (top becomes 0). LL stack pushes 50 then 60 as top. Popping returns 60 then 50.",
    vivaQuestions: [
      { q: "Why is insertion and deletion at head preferred for Linked List Stack?", a: "Inserting and deleting at the head takes O(1) time. Inserting or deleting at tail without a tail pointer would take O(N) time." },
      { q: "What is stack overflow and when can it happen in a linked list stack?", a: "Overflow occurs when trying to push to a full stack. In a linked list stack, it only occurs when heap memory is completely exhausted (malloc returns NULL)." }
    ],
    commonErrors: [
      "Popping when top == -1 (underflow error).",
      "Memory leak by not freeing node memory in popLL()."
    ],
    memoryDiagram: `[topLL] -> [60 | *] -> [50 | NULL]`,
    complexityAnalysis: "Push: O(1), Pop: O(1), Peek: O(1). Space: O(N)."
  },
  {
    id: 8,
    title: "Queue using Array and Linked List",
    aim: "To implement Queue ADT (enqueue, dequeue, front) using both Linear/Circular Array and Linked List.",
    algorithm: [
      "1. Array: Maintain front, rear. For circular array, rear = (rear + 1) % MAX.",
      "2. Linked List: Maintain front and rear pointers. Enqueue attaches at rear->next; Dequeue deletes from front.",
      "3. Demonstrate FIFO order."
    ],
    program: `#include <stdio.h>
#include <stdlib.h>

struct QNode {
    int data;
    struct QNode* next;
};

struct Queue {
    struct QNode *front, *rear;
};

struct Queue* createQueue() {
    struct Queue* q = (struct Queue*)malloc(sizeof(struct Queue));
    q->front = q->rear = NULL;
    return q;
}

void enqueue(struct Queue* q, int val) {
    struct QNode* n = (struct QNode*)malloc(sizeof(struct QNode));
    n->data = val; n->next = NULL;
    if (!q->rear) {
        q->front = q->rear = n;
        return;
    }
    q->rear->next = n;
    q->rear = n;
}

int dequeue(struct Queue* q) {
    if (!q->front) return -1;
    struct QNode* temp = q->front;
    int val = temp->data;
    q->front = q->front->next;
    if (!q->front) q->rear = NULL;
    free(temp);
    return val;
}

int main() {
    struct Queue* q = createQueue();
    enqueue(q, 10);
    enqueue(q, 20);
    enqueue(q, 30);
    printf("Dequeued: %d\\n", dequeue(q));
    printf("Dequeued: %d\\n", dequeue(q));
    return 0;
}`,
    sampleInput: `Enqueue 10, 20, 30. Dequeue 2 elements.`,
    sampleOutput: `Dequeued: 10\nDequeued: 20`,
    dryRun: "Queue starts empty. Enqueue 10: front=10, rear=10. Enqueue 20: 10->next=20, rear=20. Enqueue 30: 20->next=30, rear=30. Dequeue returns 10 (FIFO), next returns 20.",
    vivaQuestions: [
      { q: "What happens to front and rear when the last element is dequeued in a linked queue?", a: "front becomes NULL, and rear must also be explicitly set to NULL to prevent rear from pointing to freed memory." },
      { q: "Why is a circular array preferred over linear array for queues?", a: "Linear array suffers from false overflow where unused vacated space at the front cannot be reused once rear reaches MAX-1." }
    ],
    commonErrors: [
      "Leaving rear as a dangling pointer when front becomes NULL.",
      "Queue underflow check omitted before dequeue."
    ],
    memoryDiagram: `[front] -> [10 | *] -> [20 | *] -> [30 | NULL] <- [rear]`,
    complexityAnalysis: "Enqueue: O(1), Dequeue: O(1). Space: O(N)."
  },
  {
    id: 9,
    title: "Applications of Stack and Queue",
    aim: "To implement Infix to Postfix conversion and Postfix expression evaluation using stack in C.",
    algorithm: [
      "1. Define precedence function: +, - (1), *, / (2), ^ (3).",
      "2. Infix to Postfix: Scan tokens. If operand, add to output. If '(', push. If ')', pop until '('. If operator, pop operators with higher/equal precedence, then push.",
      "3. Postfix Evaluation: Scan left-to-right. If operand, push. If operator, pop b then a, compute (a op b), and push result."
    ],
    program: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int precedence(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

void infixToPostfix(char* infix, char* postfix) {
    char stack[100];
    int top = -1, k = 0;

    for (int i = 0; infix[i]; i++) {
        char ch = infix[i];
        if (isalnum(ch)) postfix[k++] = ch;
        else if (ch == '(') stack[++top] = ch;
        else if (ch == ')') {
            while (top >= 0 && stack[top] != '(') postfix[k++] = stack[top--];
            top--; // pop '('
        } else {
            while (top >= 0 && precedence(stack[top]) >= precedence(ch))
                postfix[k++] = stack[top--];
            stack[++top] = ch;
        }
    }
    while (top >= 0) postfix[k++] = stack[top--];
    postfix[k] = '\\0';
}

int evaluatePostfix(char* postfix) {
    int stack[100], top = -1;
    for (int i = 0; postfix[i]; i++) {
        char ch = postfix[i];
        if (isdigit(ch)) stack[++top] = ch - '0';
        else {
            int b = stack[top--];
            int a = stack[top--];
            switch (ch) {
                case '+': stack[++top] = a + b; break;
                case '-': stack[++top] = a - b; break;
                case '*': stack[++top] = a * b; break;
                case '/': stack[++top] = a / b; break;
            }
        }
    }
    return stack[top];
}

int main() {
    char infix[] = "(A+B)*(C-D)";
    char postfix[100];
    infixToPostfix(infix, postfix);
    printf("Infix:   %s\\n", infix);
    printf("Postfix: %s\\n", postfix);

    char numPostfix[] = "23+4*";
    printf("Eval of %s = %d\\n", numPostfix, evaluatePostfix(numPostfix));
    return 0;
}`,
    sampleInput: `Infix: (A+B)*(C-D), Numeric Postfix: 23+4*`,
    sampleOutput: `Infix:   (A+B)*(C-D)
Postfix: AB+CD-*
Eval of 23+4* = 20`,
    dryRun: "Infix '(A+B)*(C-D)': '(' pushed, 'A' output, '+' pushed, 'B' output, ')' pops '+' -> 'AB+'. '*' pushed. '(' pushed, 'C' output, '-' pushed, 'D' output, ')' pops '-' -> 'CD-'. End pops '*' -> 'AB+CD-*'. Eval '23+4*': 2, 3 pushed -> '+' pops 3 & 2 -> 2+3=5. 4 pushed -> '*' pops 4 & 5 -> 5*4=20.",
    vivaQuestions: [
      { q: "Why is postfix notation called Reverse Polish Notation (RPN)?", a: "It was invented by Polish mathematician Jan Łukasiewicz where the operators follow their operands, eliminating parentheses." },
      { q: "Why do we evaluate 'a - b' rather than 'b - a' when popping operands?", a: "The second popped value was pushed earlier (left operand), while the first popped value was pushed later (right operand). Subtraction is non-commutative." }
    ],
    commonErrors: [
      "Incorrect operand order during subtraction or division.",
      "Forgetting to pop remaining stack operators at the end of infix expression."
    ],
    memoryDiagram: `Stack during '2 3 +': [ 2 ] -> [ 2, 3 ] -> pop 3, pop 2 -> push 5 -> [ 5 ]`,
    complexityAnalysis: "Time Complexity: O(N) single pass. Auxiliary Space: O(N) for operator/operand stack."
  },
  {
    id: 10,
    title: "Tree using Array",
    aim: "To implement Complete Binary Tree representation using a 1D array and compute parent, left child, right child relationships.",
    algorithm: [
      "1. Store root at index 0.",
      "2. For node at index i: Left Child = 2*i + 1, Right Child = 2*i + 2, Parent = (i - 1) / 2.",
      "3. Insert elements sequentially into array.",
      "4. Write helper traversal functions checking if child index < size."
    ],
    program: `#include <stdio.h>

#define MAX 15
char tree[MAX];
int size = 0;

void setRoot(char c) {
    tree[0] = c;
    size = 1;
}

void setLeft(char c, int parent) {
    int idx = 2 * parent + 1;
    if (idx < MAX) { tree[idx] = c; if (idx >= size) size = idx + 1; }
}

void setRight(char c, int parent) {
    int idx = 2 * parent + 2;
    if (idx < MAX) { tree[idx] = c; if (idx >= size) size = idx + 1; }
}

void printTree() {
    printf("Array Tree: ");
    for (int i = 0; i < size; i++) {
        if (tree[i]) printf("%c ", tree[i]);
        else printf("- ");
    }
    printf("\\n");
}

int main() {
    setRoot('A');
    setLeft('B', 0);
    setRight('C', 0);
    setLeft('D', 1);
    setRight('E', 1);
    printTree();
    return 0;
}`,
    sampleInput: `Root A; Left(A)=B, Right(A)=C; Left(B)=D, Right(B)=E`,
    sampleOutput: `Array Tree: A B C D E`,
    dryRun: "index 0: 'A'. left of 0 is 2*0+1 = 1 ('B'). right of 0 is 2*0+2 = 2 ('C'). left of 1 is 2*1+1 = 3 ('D'). right of 1 is 2*1+2 = 4 ('E'). Contiguous array: [A, B, C, D, E].",
    vivaQuestions: [
      { q: "What is the primary drawback of representing a skewed binary tree with an array?", a: "Severe memory wastage. A skewed tree of height h with only h nodes requires an array of size 2^(h+1) - 1, leaving most entries empty." },
      { q: "Given index i of a node, what is its parent index?", a: "(i - 1) / 2 using integer division." }
    ],
    commonErrors: [
      "Indexing from 1 vs 0 without adjusting formulas (1-based: left=2*i, right=2*i+1; 0-based: left=2*i+1, right=2*i+2)."
    ],
    memoryDiagram: `Indices: [0] [1] [2] [3] [4]\nValues:  [ A | B | C | D | E ]`,
    complexityAnalysis: "Access child/parent: O(1). Space: O(2^H) in worst case, O(N) for complete binary tree."
  },
  {
    id: 11,
    title: "Binary Search Tree using Linked List",
    aim: "To implement Binary Search Tree (BST) with insertion, search, and inorder/preorder/postorder traversals using dynamically allocated node pointers.",
    algorithm: [
      "1. struct BSTNode { int data; struct BSTNode *left, *right; }.",
      "2. insert(root, key): if root is NULL, allocate new node. If key < root->data, insert in left subtree; else right.",
      "3. search(root, key): if key == root->data return true; else search left/right recursively.",
      "4. Traversals: Inorder (L, Root, R), Preorder (Root, L, R), Postorder (L, R, Root)."
    ],
    program: `#include <stdio.h>
#include <stdlib.h>

struct BSTNode {
    int data;
    struct BSTNode *left, *right;
};

struct BSTNode* createNode(int val) {
    struct BSTNode* n = (struct BSTNode*)malloc(sizeof(struct BSTNode));
    n->data = val; n->left = n->right = NULL;
    return n;
}

struct BSTNode* insert(struct BSTNode* root, int key) {
    if (!root) return createNode(key);
    if (key < root->data) root->left = insert(root->left, key);
    else if (key > root->data) root->right = insert(root->right, key);
    return root;
}

void inorder(struct BSTNode* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

int main() {
    struct BSTNode* root = NULL;
    int keys[] = {50, 30, 20, 40, 70, 60, 80};
    for(int i=0; i<7; i++) root = insert(root, keys[i]);

    printf("Inorder Traversal (Sorted): ");
    inorder(root);
    printf("\\n");
    return 0;
}`,
    sampleInput: `Insert keys: 50, 30, 20, 40, 70, 60, 80`,
    sampleOutput: `Inorder Traversal (Sorted): 20 30 40 50 60 70 80`,
    dryRun: "50 is root. 30 goes left. 20 goes left of 30. 40 goes right of 30. 70 goes right of 50. 60 goes left of 70. 80 goes right of 70. Inorder produces sorted order: 20 30 40 50 60 70 80.",
    vivaQuestions: [
      { q: "Why does the Inorder traversal of a BST always yield sorted order?", a: "Because BST property guarantees all elements in left subtree are smaller than root, and all elements in right subtree are larger. Inorder visits Left -> Root -> Right, naturally ordering smallest to largest." },
      { q: "What is the worst-case time complexity of BST operations and when does it occur?", a: "O(N), which occurs when elements are inserted in already sorted or reverse sorted order, causing a degenerate (skewed) tree like a linked list." }
    ],
    commonErrors: [
      "Not returning root in recursive insert calls: root->left = insert(root->left, key).",
      "Memory leak during node deletion."
    ],
    memoryDiagram: `       [50]
      /    \\
   [30]    [70]
   /  \\    /  \\
 [20] [40][60] [80]`,
    complexityAnalysis: "Average Time: O(log N). Worst Time: O(N). Auxiliary Space: O(H) recursion stack."
  },
  {
    id: 12,
    title: "Graph Traversal using BFS",
    aim: "To implement Breadth First Search (BFS) graph traversal using an adjacency matrix and a FIFO queue in C.",
    algorithm: [
      "1. Maintain visited[V] initialized to 0, and a queue.",
      "2. Enqueue start node, set visited[start] = 1.",
      "3. While queue is not empty: dequeue vertex u, print u. For each adjacent vertex v (adj[u][v] == 1): if !visited[v], mark visited[v] = 1 and enqueue v."
    ],
    program: `#include <stdio.h>
#define V 5

int adj[V][V] = {
    {0, 1, 1, 0, 0},
    {1, 0, 0, 1, 1},
    {1, 0, 0, 0, 1},
    {0, 1, 0, 0, 1},
    {0, 1, 1, 1, 0}
};

void BFS(int start) {
    int visited[V] = {0};
    int queue[V], front = 0, rear = 0;

    visited[start] = 1;
    queue[rear++] = start;

    printf("BFS Traversal from %d: ", start);
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);

        for (int v = 0; v < V; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                queue[rear++] = v;
            }
        }
    }
    printf("\\n");
}

int main() {
    BFS(0);
    return 0;
}`,
    sampleInput: `Graph with 5 vertices (0 to 4), start vertex = 0`,
    sampleOutput: `BFS Traversal from 0: 0 1 2 3 4`,
    dryRun: "Queue starts [0]. Pop 0 -> neighbors 1 and 2 visited and pushed: [1, 2]. Pop 1 -> neighbors 3 and 4 visited and pushed: [2, 3, 4]. Pop 2, 3, 4 with no new neighbors. Output: 0 1 2 3 4.",
    vivaQuestions: [
      { q: "Why must a vertex be marked visited at the time of enqueuing rather than dequeuing?", a: "If marked only when dequeued, the same vertex can be enqueued multiple times by different neighbors, causing exponential queue growth and redundant processing." },
      { q: "Can BFS find the shortest path in a graph with unequal edge weights?", a: "No. BFS only finds the shortest path (in terms of minimum number of edges) in unweighted graphs. For weighted graphs, Dijkstra's algorithm is required." }
    ],
    commonErrors: [
      "Not handling disconnected graph components (need an outer loop over all vertices).",
      "Queue overflow if array size is too small."
    ],
    memoryDiagram: `Queue: [ 0 ] -> dequeue 0 -> [ 1, 2 ] -> dequeue 1 -> [ 2, 3, 4 ]`,
    complexityAnalysis: "Adjacency Matrix: O(V^2). Adjacency List: O(V + E). Space: O(V) for visited and queue."
  },
  {
    id: 13,
    title: "Graph Traversal using DFS",
    aim: "To implement Depth First Search (DFS) graph traversal using recursion and an adjacency matrix in C.",
    algorithm: [
      "1. Initialize visited array of size V to 0.",
      "2. DFS(u): Mark visited[u] = 1, print u.",
      "3. For each vertex v from 0 to V-1: if adj[u][v] == 1 and !visited[v], recursively call DFS(v)."
    ],
    program: `#include <stdio.h>
#define V 5

int adj[V][V] = {
    {0, 1, 1, 0, 0},
    {1, 0, 0, 1, 1},
    {1, 0, 0, 0, 1},
    {0, 1, 0, 0, 1},
    {0, 1, 1, 1, 0}
};

int visited[V] = {0};

void DFS(int u) {
    visited[u] = 1;
    printf("%d ", u);

    for (int v = 0; v < V; v++) {
        if (adj[u][v] && !visited[v]) {
            DFS(v);
        }
    }
}

int main() {
    printf("DFS Traversal from 0: ");
    DFS(0);
    printf("\\n");
    return 0;
}`,
    sampleInput: `Graph with 5 vertices, starting vertex = 0`,
    sampleOutput: `DFS Traversal from 0: 0 1 3 4 2`,
    dryRun: "DFS(0) prints 0 -> visits neighbor 1 -> prints 1 -> visits neighbor 3 -> prints 3 -> visits neighbor 4 -> prints 4 -> from 4 visits 2 -> prints 2. Backtracks to root. Output: 0 1 3 4 2.",
    vivaQuestions: [
      { q: "What data structure inherently powers recursive DFS?", a: "The Call Stack (system runtime stack) which stores activation records for each recursive DFS invocation." },
      { q: "How can DFS detect a cycle in an undirected graph?", a: "During traversal from u to v, if neighbor v is already visited and v is NOT the immediate parent of u, a back edge exists, confirming a cycle." }
    ],
    commonErrors: [
      "Infinite recursion due to forgetting to mark visited[u] = 1.",
      "Call stack overflow on very large deep graphs."
    ],
    memoryDiagram: `Recursion Stack: DFS(0) -> DFS(1) -> DFS(3) -> DFS(4) -> DFS(2)`,
    complexityAnalysis: "Time Complexity: O(V^2) with matrix, O(V + E) with list. Space: O(V) stack frame."
  },
  {
    id: 14,
    title: "Dijkstra Shortest Path",
    aim: "To implement Dijkstra's Single-Source Shortest Path algorithm for non-negative weighted graphs in C.",
    algorithm: [
      "1. Initialize dist[V] = INF, dist[src] = 0, sptSet[V] = false.",
      "2. Repeat V-1 times: Pick vertex u not in sptSet with minimum dist[u].",
      "3. Mark sptSet[u] = true.",
      "4. Relax neighbors: For each v adjacent to u: if !sptSet[v] and dist[u] + weight(u,v) < dist[v], update dist[v] = dist[u] + weight(u,v).",
      "5. Print dist array."
    ],
    program: `#include <stdio.h>
#include <limits.h>

#define V 5
#define INF 99999

int minDistance(int dist[], int sptSet[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!sptSet[v] && dist[v] <= min) {
            min = dist[v]; min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V], sptSet[V];
    for (int i = 0; i < V; i++) {
        dist[i] = INF; sptSet[i] = 0;
    }
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet);
        if (u == -1) break;
        sptSet[u] = 1;

        for (int v = 0; v < V; v++) {
            if (!sptSet[v] && graph[u][v] && dist[u] != INF 
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    printf("Vertex \\t Distance from Source %d\\n", src);
    for (int i = 0; i < V; i++) {
        printf("%d \\t %d\\n", i, dist[i]);
    }
}

int main() {
    int graph[V][V] = {
        {0, 4, 1, 0, 0},
        {4, 0, 2, 5, 0},
        {1, 2, 0, 8, 10},
        {0, 5, 8, 0, 2},
        {0, 0, 10, 2, 0}
    };
    dijkstra(graph, 0);
    return 0;
}`,
    sampleInput: `Graph with 5 vertices, src = 0`,
    sampleOutput: `Vertex \t Distance from Source 0
0 \t 0
1 \t 3
2 \t 1
3 \t 8
4 \t 10`,
    dryRun: "dist: [0, INF, INF, INF, INF]. Pick 0 (dist 0). Relax 1 (dist 4), 2 (dist 1). Next min is 2 (dist 1). Relax 1: 1 + 2 = 3 < 4 (updates dist[1]=3). Relax 3: 1 + 8 = 9. Next min is 1 (dist 3). Relax 3: 3 + 5 = 8 < 9 (updates dist[3]=8). Next min is 3. Relax 4: 8 + 2 = 10.",
    vivaQuestions: [
      { q: "Why does Dijkstra's algorithm fail with negative weight edges?", a: "It is a greedy algorithm that finalizes distance once a node is selected. A negative weight edge encountered later could yield a smaller path, invalidating the finalized distance." },
      { q: "What is the time complexity with an adjacency matrix vs adjacency list with min-heap?", a: "Matrix: O(V^2). Min-heap with adjacency list: O((V + E) log V)." }
    ],
    commonErrors: [
      "Integer overflow when adding dist[u] + graph[u][v] if dist[u] is initialized to INT_MAX.",
      "Forgetting to check !sptSet[v] before relaxing edge."
    ],
    memoryDiagram: `dist[] table:
Iter 0: [0, INF, INF, INF, INF]
Iter 1: [0,   4,   1, INF, INF]
Iter 2: [0,   3,   1,   9,  11] ...`,
    complexityAnalysis: "Time: O(V^2) with linear scan, O((V+E) log V) with priority queue. Space: O(V)."
  },
  {
    id: 15,
    title: "Minimum Spanning Tree (Prim's Algorithm)",
    aim: "To implement Prim's Algorithm to find the Minimum Spanning Tree of a connected weighted undirected graph in C.",
    algorithm: [
      "1. Maintain key[V] = INF, parent[V], inMST[V] = false. Set key[0] = 0, parent[0] = -1.",
      "2. Loop V-1 times: Pick u not in inMST with min key[u].",
      "3. Mark inMST[u] = true.",
      "4. For each adjacent vertex v: if graph[u][v] && !inMST[v] && graph[u][v] < key[v], update parent[v] = u and key[v] = graph[u][v].",
      "5. Print edges (parent[i] - i) and total MST weight."
    ],
    program: `#include <stdio.h>
#define V 5
#define INF 99999

int minKey(int key[], int inMST[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!inMST[v] && key[v] < min) {
            min = key[v]; min_index = v;
        }
    }
    return min_index;
}

void primMST(int graph[V][V]) {
    int parent[V], key[V], inMST[V];
    for (int i = 0; i < V; i++) {
        key[i] = INF; inMST[i] = 0;
    }
    key[0] = 0; parent[0] = -1;

    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, inMST);
        inMST[u] = 1;

        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }

    printf("Edge \\tWeight\\n");
    int total = 0;
    for (int i = 1; i < V; i++) {
        printf("%d - %d \\t%d\\n", parent[i], i, graph[i][parent[i]]);
        total += graph[i][parent[i]];
    }
    printf("Total MST Weight: %d\\n", total);
}

int main() {
    int graph[V][V] = {
        {0, 2, 0, 6, 0},
        {2, 0, 3, 8, 5},
        {0, 3, 0, 0, 7},
        {6, 8, 0, 0, 9},
        {0, 5, 7, 9, 0}
    };
    primMST(graph);
    return 0;
}`,
    sampleInput: `Weighted graph with 5 vertices`,
    sampleOutput: `Edge \tWeight
0 - 1 \t2
1 - 2 \t3
0 - 3 \t6
1 - 4 \t5
Total MST Weight: 16`,
    dryRun: "Starts with vertex 0. Edges (0,1)=2, (0,3)=6. Min is 1 (weight 2). From 1, checks (1,2)=3, (1,4)=5. Min is 2 (weight 3). Next min is 4 (weight 5). Next is 3 (weight 6 from 0). Edges: 0-1 (2), 1-2 (3), 0-3 (6), 1-4 (5). Total: 16.",
    vivaQuestions: [
      { q: "What is the cut property in Minimum Spanning Trees?", a: "For any cut in a connected graph, the minimum weight edge crossing the cut must belong to some MST of the graph." },
      { q: "How many edges and vertices does an MST contain for a graph with V vertices?", a: "An MST contains exactly V vertices and V - 1 edges, with zero cycles." }
    ],
    commonErrors: [
      "Picking edges that form a cycle.",
      "Not handling disconnected graphs (creates a Minimum Spanning Forest instead)."
    ],
    memoryDiagram: `Tree growth: (0) -> (0-1) -> (0-1-2) -> (0-1-2-4) -> (0-1-2-4-3) = 4 edges, 5 vertices`,
    complexityAnalysis: "Time: O(V^2) with adjacency matrix, O(E log V) with binary heap. Space: O(V)."
  }
];

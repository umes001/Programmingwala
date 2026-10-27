import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, Code2, Cpu, Database, Layers, Globe, 
  Terminal, Sparkles, Copy, Check, ExternalLink, Bookmark, 
  Share2, Clock, Award, ChevronRight, ChevronDown, ArrowRight, 
  Zap, CheckCircle2, FileCode, Box, Binary, Workflow, Layout, 
  Palette, FileText, HelpCircle, FolderTree, Filter, CheckCircle, 
  Tag, ShieldCheck, Server, RefreshCw, ThumbsUp, Star, Lightbulb,
  ListOrdered, CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TOPIC-WISE TUTORIAL ARTICLES (EXHAUSTIVE THEORY, HOW IT WORKS, METHODS, ADVANTAGES, CODE)
// ─────────────────────────────────────────────────────────────────────────────
const TUTORIAL_ARTICLES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ☕ 1. JAVA CORE & JVM ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'java-jvm-architecture-memory',
    title: 'Java Core & JVM Architecture: Memory Model, ClassLoader & Execution Engine',
    category: 'Java Core & JVM',
    domain: 'java',
    difficulty: 'Beginner to Advanced',
    readTime: '15 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Oracle', 'Google', 'Amazon', 'Microsoft', 'Goldman Sachs', 'AppleTree Infotech'],
    summary: 'A deep dive into how Java achieves platform independence via the Java Virtual Machine (JVM). Explore the compilation process, ClassLoader subsystems, runtime memory areas (Heap, Stack, Metaspace, PC Register), and the JIT compiler execution lifecycle.',
    
    // 📖 1. DETAILED THEORY
    theory: `Java is a high-level, class-based, object-oriented programming language designed around the philosophy of 'Write Once, Run Anywhere' (WORA). Unlike purely compiled languages (like C/C++) that compile directly into platform-specific machine code, or purely interpreted languages (like JavaScript/Python) that parse source text at runtime, Java uses a two-step hybrid approach:

1. **Compilation Phase**: The Java Compiler (\`javac\`) converts human-readable \`.java\` source code into intermediate, architecture-neutral bytecode (\`.class\` files).
2. **Execution Phase**: The platform-specific Java Virtual Machine (JVM) loads the bytecode, verifies its integrity, interprets instructions, and compiles performance-critical code segments into native machine instructions via the Just-In-Time (JIT) compiler.

This architecture ensures that Java programs run identically on Windows, Linux, macOS, and enterprise cloud servers without modifying a single line of code.`,

    // ⚙️ 2. HOW IT WORKS
    howItWorks: `The JVM execution lifecycle operates through three primary subsystems:

1. **ClassLoader Subsystem**:
   - **Loading**: Reads \`.class\` files from disk or network into memory using three hierarchical loaders: Bootstrap ClassLoader (loads core Java APIs like \`java.lang.*\`), Platform/Extension ClassLoader, and Application/System ClassLoader.
   - **Linking**: Performs Bytecode Verification (security check against memory corruption), Preparation (allocates memory for static variables and default values), and Resolution (maps symbolic references into direct memory pointers).
   - **Initialization**: Executes static initializers and assigns explicit values to static variables.

2. **JVM Run-Time Data Areas (Memory Model)**:
   - **Heap Memory (Shared across all threads)**: Allocates all Java objects and instance variables. Divided into Young Generation (Eden, Survivor Spaces S0 & S1) and Old Generation (Tenured) for generational Garbage Collection.
   - **Call Stack (Per-thread)**: Every thread creates its own stack containing Stack Frames for each invoked method. Stores local primitive variables and object memory references. Automatically freed when methods return (LIFO).
   - **Metaspace / Method Area (Shared)**: Replaces PermGen since Java 8. Stored in native OS memory to hold class definitions, method bytecode, static variables, and runtime constant pools.
   - **Program Counter (PC) Register (Per-thread)**: Stores the memory address of the current JVM bytecode instruction being executed.
   - **Native Method Stack (Per-thread)**: Executes C/C++ native code via Java Native Interface (JNI).

3. **Execution Engine**:
   - **Interpreter**: Reads and executes bytecode instructions line-by-line for fast immediate startup.
   - **JIT Compiler (HotSpot C1/C2)**: Detects frequently executed loops and methods ('hot spots') and compiles them into optimized native CPU machine code to achieve near-C++ speeds.
   - **Garbage Collector (GC)**: Automatically reclaims unreachable heap objects (G1GC, ZGC, Parallel GC).`,

    // 📋 3. CORE METHODS & API REFERENCE
    methodsList: [
      { name: 'System.gc()', signature: 'public static void gc()', description: 'Suggests to the JVM to run the Garbage Collector to reclaim unused heap memory.', timeComplexity: 'O(N) Heap Scan' },
      { name: 'Runtime.getRuntime()', signature: 'public static Runtime getRuntime()', description: 'Returns the runtime object associated with the current Java application to inspect memory & CPU cores.', timeComplexity: 'O(1)' },
      { name: 'Runtime.freeMemory()', signature: 'public long freeMemory()', description: 'Returns the approximate amount of free heap memory available in the JVM in bytes.', timeComplexity: 'O(1)' },
      { name: 'Runtime.totalMemory()', signature: 'public long totalMemory()', description: 'Returns the total memory currently allocated to the JVM heap.', timeComplexity: 'O(1)' },
      { name: 'Runtime.availableProcessors()', signature: 'public int availableProcessors()', description: 'Returns the number of CPU cores available to the Java runtime for multi-threading.', timeComplexity: 'O(1)' }
    ],

    // 🛠️ 4. STEP-BY-STEP IMPLEMENTATION GUIDE
    stepByStep: [
      'Write Java source code in a file named `Main.java` adhering to class naming conventions.',
      'Compile using `javac Main.java` to generate platform-independent `Main.class` bytecode.',
      'Execute with `java Main` to launch the JVM, initialize the ClassLoader, and allocate Stack/Heap memory.',
      'Observe how objects are instantiated on Heap while references and primitives reside on Stack frames.',
      'Allow unused objects to become unreachable so Garbage Collection automatically recovers memory.'
    ],

    // 💡 5. ADVANTAGES & INDUSTRY USE CASES
    advantages: [
      'Platform Independence (WORA): Deploy on any OS without recompilation.',
      'Automatic Memory Management: Robust garbage collection prevents memory leaks and manual pointer dangling.',
      'High Security: Bytecode verifier and security manager protect against malicious unauthorized memory access.',
      'High Enterprise Throughput: HotSpot JIT adaptive compilation achieves remarkable enterprise transaction performance.'
    ],

    diagramType: 'jvmArchitecture',
    complexity: {
      compilation: 'javac (.java Source -> .class Bytecode)',
      memoryModel: 'Heap (Shared) • Call Stack (Per-thread) • Metaspace (Native) • PC Register',
      jitExecution: 'HotSpot C1 Client & C2 Server Native CPU Compilation',
      gcCycle: 'Generational GC: Young Gen (Eden, S0, S1) -> Old Gen (Tenured)'
    },
    codeSnippets: {
      java: `// ============================================================================
// COMPLETE JAVA MEMORY MODEL & JVM LIFECYCLE DEMONSTRATION
// ============================================================================
package com.programmingwala.jvm;

public class JVMMemoryLifecycleDemo {
    // 1. METASPACE / METHOD AREA: Static constants and class metadata
    private static final String ACADEMY = "ProgrammingWala & AppleTree Infotech";
    private static int totalStudents = 0;

    // 2. HEAP MEMORY: Instance variables stored inside heap object allocation
    private final int id;
    private final String name;
    private final int[] marks;

    public JVMMemoryLifecycleDemo(int id, String name, int[] marks) {
        this.id = id;
        this.name = name; // String literal pooled or heap object
        this.marks = marks;
        totalStudents++;
    }

    // 3. CALL STACK FRAME: Allocated upon method entry, popped on return
    public double calculatePercentage() {
        // Local primitive variable 'sum' allocated on the Thread's Stack Frame
        double sum = 0.0;
        for (int m : this.marks) {
            sum += m;
        }
        return sum / this.marks.length;
    }

    public static void main(String[] args) {
        // Inspect JVM Environment
        Runtime rt = Runtime.getRuntime();
        System.out.println("⚡ CPU Cores Available: " + rt.availableProcessors());
        System.out.println("📦 Initial Total Heap Memory: " + (rt.totalMemory() / (1024 * 1024)) + " MB");

        // Object 'student1' reference created on Stack; Actual object instance created on Heap
        int[] scores = {92, 95, 98, 100};
        JVMMemoryLifecycleDemo student1 = new JVMMemoryLifecycleDemo(101, "Aarav Sharma", scores);

        double pct = student1.calculatePercentage();
        System.out.println("🎓 Student: " + student1.name + " | Percentage: " + pct + "%");
        System.out.println("👥 Total Active Students: " + totalStudents);

        // Object becomes eligible for Garbage Collection
        student1 = null; 
        System.gc(); // Suggests Garbage Collection cycle
        System.out.println("✅ Memory deallocation cycle triggered successfully.");
    }
}`,
      cpp: `// C++ Manual Stack vs Heap Comparison
#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Student {
public:
    int id;
    string name;
    vector<int> marks;

    Student(int i, string n, vector<int> m) : id(i), name(n), marks(m) {}

    double getPercentage() {
        double sum = 0;
        for (int m : marks) sum += m;
        return sum / marks.size();
    }
};

int main() {
    // Stack allocation (Automatic cleanup)
    Student s1(101, "Aarav Sharma", {92, 95, 98, 100});
    cout << "Student Percentage: " << s1.getPercentage() << "%" << endl;

    // Heap allocation (Requires manual delete to prevent memory leak)
    Student* s2 = new Student(102, "Rohan Verma", {85, 90, 88});
    delete s2; // Must explicitly deallocate memory in C++
    return 0;
}`,
      python: `# Python Memory Management: Reference Counting & Cyclic GC
import sys
import gc

class Student:
    def __init__(self, student_id: int, name: str, marks: list):
        self.student_id = student_id
        self.name = name
        self.marks = marks

    def get_percentage(self) -> float:
        return sum(self.marks) / len(self.marks)

s1 = Student(101, "Aarav Sharma", [92, 95, 98, 100])
print(f"Object Reference Count: {sys.getrefcount(s1) - 1}")
print(f"Percentage: {s1.get_percentage()}%")

# Deference and trigger garbage collection
s1 = None
gc.collect()`
    },
    keyTakeaways: [
      'Bytecode is the universal intermediate format that allows Java to run on any JVM implementation.',
      'Stack memory is fast, thread-private, and managed automatically (LIFO); Heap memory is shared across threads and reclaimed by Garbage Collection.',
      'The JIT compiler dynamically compiles hot bytecode blocks into native machine code at runtime for high execution performance.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧩 2. JAVA OOPS MASTERY & SOLID PRINCIPLES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'java-oops-four-pillars-solid',
    title: 'Java OOPs: The 4 Pillars, Dynamic Polymorphism & 5 SOLID Principles',
    category: 'Java OOPs & SOLID',
    domain: 'java',
    difficulty: 'Intermediate',
    readTime: '18 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Amazon', 'Oracle', 'Microsoft', 'Adobe', 'AppleTree Infotech'],
    summary: 'Master Object-Oriented Programming (OOP) in Java. Learn Encapsulation (data hiding), Inheritance (code reuse), Polymorphism (method overloading & overriding), Abstraction (interfaces & abstract classes), and the 5 SOLID engineering design principles.',
    
    // 📖 1. DETAILED THEORY
    theory: `Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects'—which contain data in the form of fields (attributes) and code in the form of methods (behaviors). Java is fundamentally built around OOP, structured upon 4 Core Pillars:

1. **Encapsulation**: Bundles variables and methods inside a single class and restricts direct access to internal state using access modifiers (\`private\`, \`protected\`, \`public\`). Access is mediated via validated getters and setters to protect data integrity.
2. **Abstraction**: Hides complex internal implementation details and exposes only essential features via \`interface\` and \`abstract class\` contracts.
3. **Inheritance**: Allows a child class (subclass) to inherit attributes and methods from a parent class (superclass) using the \`extends\` keyword, enabling modularity and eliminating code duplication.
4. **Polymorphism**: The ability for an entity to take multiple forms:
   - *Compile-Time (Static) Polymorphism*: Method Overloading (same method name, different parameter lists).
   - *Runtime (Dynamic) Polymorphism*: Method Overriding (subclass provides a specific implementation of a method declared in its parent, resolved dynamically at runtime via Virtual Method Tables).`,

    // ⚙️ 2. HOW IT WORKS
    howItWorks: `Behind the scenes, Java OOP mechanisms rely on JVM runtime mechanics:

1. **Dynamic Method Dispatch (Virtual Tables - vtable)**:
   - When an overridden method is invoked on a parent reference pointing to a child object (\`Parent p = new Child(); p.action();\`), the JVM looks up the object's actual class vtable at runtime to invoke the subclass version rather than the parent version.
2. **The 5 SOLID Engineering Principles**:
   - **S (Single Responsibility Principle)**: A class should have one, and only one, reason to change.
   - **O (Open-Closed Principle)**: Software entities should be open for extension, but closed for modification.
   - **L (Liskov Substitution Principle)**: Subtypes must be substitutable for their base types without altering system correctness.
   - **I (Interface Segregation Principle)**: Clients should not be forced to depend on interface methods they do not use. Split fat interfaces into smaller, cohesive ones.
   - **D (Dependency Inversion Principle)**: High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces).`,

    // 📋 3. CORE METHODS & API REFERENCE
    methodsList: [
      { name: 'super()', signature: 'super(arguments...)', description: 'Calls the constructor of the direct parent superclass from the subclass constructor.', timeComplexity: 'O(1)' },
      { name: 'super.method()', signature: 'super.methodName()', description: 'Explicitly invokes the parent class implementation of an overridden method.', timeComplexity: 'O(1)' },
      { name: 'this()', signature: 'this(arguments...)', description: 'Invokes another overloaded constructor within the same class (Constructor Chaining).', timeComplexity: 'O(1)' },
      { name: 'instanceof', signature: 'object instanceof ClassName', description: 'Checks whether an object is an instance of a specific class or implements an interface.', timeComplexity: 'O(1)' },
      { name: 'getClass()', signature: 'public final Class<?> getClass()', description: 'Returns the runtime class descriptor of the object.', timeComplexity: 'O(1)' }
    ],

    // 🛠️ 4. STEP-BY-STEP IMPLEMENTATION GUIDE
    stepByStep: [
      'Define an `interface` or `abstract class` specifying the core contract without implementation.',
      'Create concrete classes encapsulating private fields with public getters and setters.',
      'Extend base classes using `extends` and implement interfaces using `implements`.',
      'Override methods using `@Override` to enable runtime polymorphic behavior.',
      'Apply Dependency Injection by passing interface abstractions into service constructors.'
    ],

    // 💡 5. ADVANTAGES & INDUSTRY USE CASES
    advantages: [
      'High Maintainability: Encapsulation prevents unexpected side effects across large enterprise codebases.',
      'Code Reusability: Inheritance enables common logic to be written once and shared across classes.',
      'Extensibility: SOLID principles ensure new business features can be added without modifying tested production code.',
      'Loose Coupling: Abstraction allows easy mocking and unit testing in enterprise frameworks like Spring Boot.'
    ],

    diagramType: 'oopsPillarsSolid',
    complexity: {
      pillars: 'Encapsulation • Abstraction • Inheritance • Polymorphism',
      methodResolution: 'Static Binding (Overloading/private/final) vs Dynamic Binding (vtable Overriding)',
      solidPrinciples: 'Single Responsibility • Open-Closed • Liskov • Interface Segregation • Dependency Inversion',
      interfaceFeatures: 'Java 8 default & static methods • Java 9 private methods • Sealed Classes (Java 17+)'
    },
    codeSnippets: {
      java: `// ============================================================================
// COMPLETE JAVA OOPS & SOLID ARCHITECTURE IMPLEMENTATION
// ============================================================================
package com.programmingwala.oops;

import java.util.UUID;

// 1. ABSTRACTION & INTERFACE SEGREGATION (ISP)
interface PaymentGateway {
    boolean processPayment(double amount);
}

interface NotificationService {
    void sendNotification(String message, String recipient);
}

// 2. ENCAPSULATION: Base class protecting internal state
abstract class Account {
    private final String accountId;
    private String accountHolderName;
    private double balance;

    public Account(String name, double initialBalance) {
        this.accountId = UUID.randomUUID().toString();
        this.accountHolderName = name;
        this.balance = Math.max(0.0, initialBalance);
    }

    // Public Getters & Protected Mutators
    public String getAccountId() { return accountId; }
    public String getAccountHolderName() { return accountHolderName; }
    public double getBalance() { return balance; }

    protected void setBalance(double balance) {
        this.balance = balance;
    }

    // Abstract method: Enforces polymorphism
    public abstract String getRoleDetails();

    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
            System.out.println("💰 Deposited ₹" + amount + " | Current Balance: ₹" + this.balance);
        }
    }
}

// 3. INHERITANCE: StudentAccount inherits from Account
class StudentAccount extends Account {
    private final String enrolledCourse;
    private double feeRemaining;

    public StudentAccount(String name, double balance, String course, double feeRemaining) {
        super(name, balance); // Invoking parent constructor
        this.enrolledCourse = course;
        this.feeRemaining = feeRemaining;
    }

    // 4. POLYMORPHISM: Dynamic Method Overriding
    @Override
    public String getRoleDetails() {
        return "Student: " + getAccountHolderName() + " | Course: " + this.enrolledCourse + " [Fee Due: ₹" + this.feeRemaining + "]";
    }

    // Compile-Time Polymorphism (Method Overloading)
    public void payFee(double amount) {
        this.payFee(amount, "UPI Payment");
    }

    public void payFee(double amount, String paymentChannel) {
        this.feeRemaining = Math.max(0, this.feeRemaining - amount);
        System.out.println("✅ Payment of ₹" + amount + " verified via " + paymentChannel + ". Balance Fee: ₹" + this.feeRemaining);
    }
}

// 5. DEPENDENCY INVERSION PRINCIPLE (DIP): High-level service depends on abstraction
class EnrollmentService {
    private final PaymentGateway paymentGateway; // Decoupled interface
    private final NotificationService notifier;

    public EnrollmentService(PaymentGateway gateway, NotificationService notifier) {
        this.paymentGateway = gateway;
        this.notifier = notifier;
    }

    public boolean enroll(StudentAccount student, double admissionFee) {
        System.out.println("🔄 Processing admission for: " + student.getAccountHolderName());
        boolean success = paymentGateway.processPayment(admissionFee);
        if (success) {
            student.payFee(admissionFee, "Online Secure Gateway");
            notifier.sendNotification("Welcome to AppleTree Infotech RDC Ghaziabad!", student.getAccountHolderName());
            System.out.println("🎉 " + student.getRoleDetails());
        }
        return success;
    }
}

// Concrete Implementations
class RazorpayGateway implements PaymentGateway {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("⚡ Razorpay Gateway: Verified ₹" + amount + " transaction (256-bit SSL).");
        return true;
    }
}

class WhatsAppNotifier implements NotificationService {
    @Override
    public void sendNotification(String message, String recipient) {
        System.out.println("📲 WhatsApp Notification sent to " + recipient + ": " + message);
    }
}

public class OOPsDemo {
    public static void main(String[] args) {
        PaymentGateway gateway = new RazorpayGateway();
        NotificationService notifier = new WhatsAppNotifier();
        EnrollmentService enrollmentService = new EnrollmentService(gateway, notifier);

        // Polymorphic reference
        StudentAccount student = new StudentAccount("Priya Sharma", 5000.0, "Java Full Stack & AWS DevOps", 25000.0);
        enrollmentService.enroll(student, 5000.0);
    }
}`,
      cpp: `// C++ Polymorphic Hierarchy & SOLID Implementation
#include <iostream>
#include <string>
#include <memory>
using namespace std;

class Account {
protected:
    string name;
    double balance;
public:
    Account(string n, double b) : name(n), balance(b) {}
    virtual ~Account() {} // Virtual destructor for safe cleanup
    virtual string getRole() const = 0; // Pure virtual (Abstract)
};

class StudentAccount : public Account {
private:
    string course;
public:
    StudentAccount(string n, double b, string c) : Account(n, b), course(c) {}
    string getRole() const override {
        return "Student " + name + " enrolled in " + course;
    }
};

int main() {
    unique_ptr<Account> acc = make_unique<StudentAccount>("Priya Sharma", 5000, "Java Full Stack");
    cout << acc->getRole() << endl;
    return 0;
}`,
      python: `# Python OOP Implementation of 4 Pillars
from abc import ABC, abstractmethod

class Account(ABC):
    def __init__(self, name: str, balance: float):
        self._name = name          # Protected
        self.__balance = balance   # Private

    @abstractmethod
    def get_role(self) -> str:
        pass

class StudentAccount(Account):
    def __init__(self, name: str, balance: float, course: str):
        super().__init__(name, balance)
        self.course = course

    def get_role(self) -> str:
        return f"Student {self._name} enrolled in {self.course}"`
    },
    keyTakeaways: [
      'Encapsulation hides state and exposes safe access methods to protect object integrity.',
      'Dynamic method dispatch resolves overridden methods at runtime via virtual method tables.',
      'SOLID principles guarantee code is decoupled, testable, maintainable, and extensible.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📚 3. JAVA COLLECTION FRAMEWORK: LIST, SET, MAP & HASHMAP INTERNALS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'java-collections-framework-deep-dive',
    title: 'Java Collection Framework: List, Set, Map, Queue & Internal HashMap Architecture',
    category: 'Java Collections Framework',
    domain: 'java',
    difficulty: 'Advanced',
    readTime: '22 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Amazon', 'Microsoft', 'Uber', 'Morgan Stanley', 'AppleTree Infotech'],
    summary: 'Master the Java Collection Framework. Understand List (ArrayList vs LinkedList), Set (HashSet vs TreeSet), Queue/Deque, and Map (HashMap bucketing, collision resolution with Linked Lists and Red-Black Trees at threshold 8, ConcurrentHashMap, and TreeMap).',
    
    // 📖 1. DETAILED THEORY
    theory: `The Java Collection Framework (JCF) is a unified architecture for storing, manipulating, and querying groups of objects. It provides high-performance, reusable data structures and algorithms, reducing programming effort while optimizing speed and memory efficiency.

The hierarchy is structured around two root interfaces:
1. **\`java.util.Collection\`**: The top-level interface for collection groups:
   - **\`List<E>\`**: An ordered collection that permits duplicate elements and provides index-based access (e.g., \`ArrayList\`, \`LinkedList\`, \`Vector\`).
   - **\`Set<E>\`**: An unordered collection that disallows duplicate elements (e.g., \`HashSet\`, \`LinkedHashSet\`, \`TreeSet\`).
   - **\`Queue<E>\` & \`Deque<E>\`**: Designed for holding elements prior to processing (FIFO or LIFO, e.g., \`PriorityQueue\`, \`ArrayDeque\`).
2. **\`java.util.Map<K, V>\`**: Maps unique keys to values. Does not inherit from \`Collection\` but is an integral part of JCF (e.g., \`HashMap\`, \`LinkedHashMap\`, \`TreeMap\`, \`ConcurrentHashMap\`).`,

    // ⚙️ 2. HOW IT WORKS
    howItWorks: `Internal architecture and performance characteristics of core collections:

1. **ArrayList Internal Mechanism**:
   - Backed by a dynamic resizable array (\`Object[] elementData\`).
   - Default initial capacity is 10. When full, capacity grows by **50%** (\`newCapacity = oldCapacity + (oldCapacity >> 1)\`).
   - Random access (\`get(i)\`) is \`O(1)\`. Insertion/deletion at arbitrary positions is \`O(N)\` due to \`System.arraycopy()\` element shifting.

2. **LinkedList Internal Mechanism**:
   - Backed by a Doubly Linked List (\`Node<E> { E item; Node<E> next; Node<E> prev; }\`).
   - Insertion and deletion at ends (head/tail) is \`O(1)\`. Positional lookup is \`O(N)\`.

3. **HashMap Internal Architecture (Deep Dive)**:
   - Backed by an array of bucket nodes (\`Node<K, V>[] table\`). Default initial capacity is 16; default Load Factor is 0.75.
   - **Hashing Formula**: \`index = (n - 1) & hash(key)\`.
   - **Collision Resolution**: Multiple keys hashing to the same bucket are chained via a Singly Linked List.
   - **Treeification Threshold**: If a single bucket exceeds **8 nodes** and table capacity >= 64, Java 8 converts the linked list into a self-balancing **Red-Black Tree (\`TreeNode<K, V>\`)**, improving worst-case search from \`O(N)\` to \`O(log N)\`.
   - **hashCode() & equals() Contract**: If \`a.equals(b)\` is true, then \`a.hashCode()\` MUST equal \`b.hashCode()\`.`,

    // 📋 3. CORE METHODS & API REFERENCE
    methodsList: [
      { name: 'add(E e)', signature: 'boolean add(E e)', description: 'Appends element to list or inserts into set.', timeComplexity: 'O(1) amortized' },
      { name: 'get(int index)', signature: 'E get(int index)', description: 'Returns the element at the specified position in a List.', timeComplexity: 'O(1) ArrayList / O(N) LinkedList' },
      { name: 'put(K key, V val)', signature: 'V put(K key, V value)', description: 'Associates the specified value with the specified key in a Map.', timeComplexity: 'O(1) average / O(log N) treeified' },
      { name: 'getOrDefault(K, V)', signature: 'V getOrDefault(Object key, V defaultValue)', description: 'Returns mapped value, or default value if key is not found.', timeComplexity: 'O(1) average' },
      { name: 'computeIfAbsent(K, Fn)', signature: 'V computeIfAbsent(K key, Function mappingFunction)', description: 'Computes value if key is not already present in Map.', timeComplexity: 'O(1) average' },
      { name: 'remove(Object o)', signature: 'boolean remove(Object o)', description: 'Removes the first occurrence of the specified element.', timeComplexity: 'O(N) List / O(1) Set & Map' }
    ],

    // 🛠️ 4. STEP-BY-STEP IMPLEMENTATION GUIDE
    stepByStep: [
      'Select the right collection based on requirements (Order -> List, Uniqueness -> Set, Key-Value -> Map).',
      'Override both `hashCode()` and `equals()` when creating custom objects to be used as Map keys or Set elements.',
      'Specify initial capacity when dataset size is known in advance to avoid frequent array resizing and rehashing.',
      'Use `ConcurrentHashMap` for high-concurrency multi-threaded environments instead of `Hashtable` or `Collections.synchronizedMap()`.',
      'Leverage Streams and Collections utility methods (`Collections.sort()`, `Collections.unmodifiableList()`) for clean operations.'
    ],

    // 💡 5. ADVANTAGES & INDUSTRY USE CASES
    advantages: [
      'High Performance: Highly optimized data structures tuned over 25+ years of JVM engineering.',
      'Type Safety: Generics (`List<String>`) eliminate runtime ClassCastException bugs.',
      'Rich Ecosystem: Built-in sorting, searching, binary searching, and parallel streaming algorithms.',
      'Thread-Safe Concurrency: `java.util.concurrent` provides high-throughput lock-free structures (ConcurrentHashMap, CopyOnWriteArrayList).'
    ],

    diagramType: 'javaCollectionsHierarchy',
    complexity: {
      arrayList: 'O(1) random get(i) • O(1) amortized add • O(N) insert/delete shift',
      linkedList: 'O(1) insert/delete at head/tail • O(N) positional search',
      hashMap: 'O(1) average get/put • O(log N) worst-case bucket collision treeify (>= 8 nodes)',
      treeSetTreeMap: 'O(log N) sorted search/insert/delete via Red-Black Tree'
    },
    codeSnippets: {
      java: `// ============================================================================
// JAVA COLLECTION FRAMEWORK: LIST, SET, MAP & HASHMAP INTERNALS
// ============================================================================
package com.programmingwala.collections;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

// Custom Key with strict hashCode() and equals() Contract
class StudentKey implements Comparable<StudentKey> {
    private final int rollNumber;
    private final String courseCode;

    public StudentKey(int rollNumber, String courseCode) {
        this.rollNumber = rollNumber;
        this.courseCode = courseCode;
    }

    public int getRollNumber() { return rollNumber; }

    @Override
    public int hashCode() {
        return Objects.hash(rollNumber, courseCode); // Consistent Hash Code
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        StudentKey other = (StudentKey) obj;
        return this.rollNumber == other.rollNumber && Objects.equals(this.courseCode, other.courseCode);
    }

    @Override
    public int compareTo(StudentKey o) {
        return Integer.compare(this.rollNumber, o.rollNumber);
    }

    @Override
    public String toString() {
        return "[" + courseCode + "-#" + rollNumber + "]";
    }
}

public class CollectionsMasteryDemo {
    public static void main(String[] args) {
        System.out.println("── 1. LIST: ArrayList vs LinkedList ──");
        List<String> modules = new ArrayList<>(10);
        modules.add("Core Java");
        modules.add("Spring Boot");
        modules.add("AWS DevOps");
        System.out.println("ArrayList Fast Indexing [O(1)]: " + modules.get(0));

        LinkedList<String> taskQueue = new LinkedList<>();
        taskQueue.addFirst("Priority 1: Code Review");
        taskQueue.addLast("Priority 2: Deploy to Production");
        System.out.println("LinkedList Endpoints: " + taskQueue.getFirst());

        System.out.println("\\n── 2. SET: HashSet vs TreeSet ──");
        Set<String> uniqueSkills = new HashSet<>(Arrays.asList("Java", "React", "Docker", "Java"));
        System.out.println("HashSet (Unique, Unordered): " + uniqueSkills);

        Set<Integer> sortedRanks = new TreeSet<>(Arrays.asList(95, 40, 80, 10, 100));
        System.out.println("TreeSet (Sorted Red-Black Tree): " + sortedRanks);

        System.out.println("\\n── 3. MAP: HashMap Internal Bucketing ──");
        Map<StudentKey, String> studentRegistry = new HashMap<>(16, 0.75f);

        StudentKey k1 = new StudentKey(101, "JAVA-FS");
        StudentKey k2 = new StudentKey(102, "AWS-DEV");
        StudentKey k3 = new StudentKey(101, "JAVA-FS"); // Logical duplicate of k1

        studentRegistry.put(k1, "Manish Kumar (Full Stack Architect)");
        studentRegistry.put(k2, "Ishika Rani (React Engineer)");
        studentRegistry.put(k3, "Manish Kumar (Profile Updated)"); // Overwrites k1 correctly!

        System.out.println("HashMap Size (Duplicates handled via equals()): " + studentRegistry.size());
        System.out.println("Fetched Key k3: " + studentRegistry.get(k3));

        System.out.println("\\n── 4. CONCURRENTHASHMAP: High-Throughput Thread-Safety ──");
        ConcurrentHashMap<String, Integer> activeMetrics = new ConcurrentHashMap<>();
        activeMetrics.put("ConcurrentRequests", 1500);
        activeMetrics.computeIfPresent("ConcurrentRequests", (k, v) -> v + 1);
        System.out.println("ConcurrentHashMap Output: " + activeMetrics);
    }
}`,
      cpp: `// C++ STL Equivalents: vector, unordered_map, map, set
#include <iostream>
#include <vector>
#include <unordered_map>
#include <map>
#include <set>
using namespace std;

int main() {
    // std::vector = Java ArrayList
    vector<string> vec = {"Core Java", "Spring Boot", "AWS DevOps"};
    cout << "Vector Element: " << vec[0] << endl;

    // std::unordered_map = Java HashMap (Hash table O(1))
    unordered_map<int, string> hashMap;
    hashMap[101] = "Manish Kumar";

    // std::map = Java TreeMap (Red-Black Tree O(log N))
    map<int, string> treeMap;
    treeMap[105] = "Z";
    treeMap[101] = "A";

    // std::set = Java TreeSet (Sorted)
    set<int> sortedSet = {95, 40, 80, 10};
    for (int n : sortedSet) cout << n << " "; // Output: 10 40 80 95
    return 0;
}`,
      python: `# Python Equivalents: list, set, dict, heapq
tech_list = ["Core Java", "Spring Boot", "AWS DevOps"] # List (ArrayList)
unique_set = set(["Java", "React", "Docker", "Java"]) # Set (HashSet)
student_map = {101: "Manish Kumar", 102: "Ishika Rani"} # Dict (HashMap O(1))

print("Unique Set:", unique_set)
print("Dict Lookup:", student_map[101])`
    },
    keyTakeaways: [
      'Always override hashCode() and equals() together to ensure Map key and Set uniqueness.',
      'Java 8 converts bucket linked lists to Red-Black Trees once a bucket exceeds 8 nodes, reducing worst-case lookups to O(log N).',
      'ArrayList grows by 50% on overflow; LinkedList has higher memory overhead per element due to prev/next node references.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🌐 4. HTML & HTML5 SEMANTIC ELEMENTS, DOM TREE & ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'html5-semantic-dom-accessibility',
    title: 'HTML5 Semantic Layout: Document Object Model (DOM) Tree & Accessibility (a11y)',
    category: 'HTML & HTML5',
    domain: 'html',
    difficulty: 'Beginner to Intermediate',
    readTime: '14 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix', 'AppleTree Infotech'],
    summary: 'Master semantic HTML5 architecture. Understand the Document Object Model (DOM) Tree lifecycle, semantic landmark tags (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>), form validation attributes, ARIA accessibility, and browser rendering engines.',
    
    // 📖 1. DETAILED THEORY
    theory: `HTML5 (HyperText Markup Language 5) is the standard markup language for structuring web pages. Beyond simple presentation, HTML5 introduces semantic elements that provide structural meaning to both web browsers and assistive technologies (screen readers, search engine crawlers, and AI parsers).

A semantic element clearly describes its purpose and meaning:
- **\`<header>\`**: Contains introductory content, logos, or primary navigation landmarks.
- **\`<nav>\`**: Designates a section containing major navigation links.
- **\`<main>\`**: Houses the unique, dominant content of the document (only one per document).
- **\`<article>\`**: Represents a self-contained, independently distributable composition (e.g., blog post, tutorial card, news story).
- **\`<section>\`**: Defines a standalone thematic grouping of content, typically with a heading.
- **\`<aside>\`**: Identifies content tangentially related to surrounding content (sidebars, related notes).
- **\`<footer>\`**: Contains author information, copyright, and secondary links.`,

    // ⚙️ 2. HOW IT WORKS
    howItWorks: `The Browser Rendering Pipeline transforms raw HTML into pixels through 5 sequential steps:

1. **DOM Tree Construction**: The HTML parser converts HTML bytes -> characters -> tokens -> DOM nodes, constructing the hierarchical **Document Object Model (DOM) Tree**.
2. **CSSOM Tree Construction**: The CSS parser processes stylesheets to build the **CSS Object Model (CSSOM) Tree**.
3. **Render Tree Generation**: The browser combines visible DOM nodes with their computed CSSOM styles, omitting elements with \`display: none\`.
4. **Layout (Reflow) Phase**: Calculates the exact geometric position, coordinates, and pixel dimensions of every visible box on the viewport.
5. **Paint & Compositing Phase**: Rasterizes colors, borders, text, and images into bitmap layers, sending them to the GPU for screen compositing.`,

    // 📋 3. CORE METHODS & API REFERENCE
    methodsList: [
      { name: 'document.querySelector(sel)', signature: 'Element querySelector(String selector)', description: 'Returns the first Element within the document that matches the specified CSS selector.', timeComplexity: 'O(N) DOM Traversal' },
      { name: 'document.querySelectorAll(sel)', signature: 'NodeList querySelectorAll(String selector)', description: 'Returns a static NodeList of all elements matching the selector.', timeComplexity: 'O(N) DOM Traversal' },
      { name: 'element.addEventListener(evt, fn)', signature: 'void addEventListener(String type, Function listener)', description: 'Attaches an event handler function to an element for user interactions (click, input, submit).', timeComplexity: 'O(1)' },
      { name: 'form.checkValidity()', signature: 'boolean checkValidity()', description: 'Returns true if all form controls satisfy their HTML5 validation constraints.', timeComplexity: 'O(K) Form Inputs' },
      { name: 'form.setCustomValidity(msg)', signature: 'void setCustomValidity(String message)', description: 'Sets a custom validation error message on a form input element.', timeComplexity: 'O(1)' }
    ],

    // 🛠️ 4. STEP-BY-STEP IMPLEMENTATION GUIDE
    stepByStep: [
      'Declare `<!DOCTYPE html>` and `<html lang="en">` with appropriate metadata and responsive `<meta name="viewport">`.',
      'Structure page layout using semantic landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).',
      'Always associate form inputs with `<label for="inputId">` and enforce built-in constraints (`required`, `type="email"`, `pattern`).',
      'Provide descriptive `alt` text on all `<img>` tags to guarantee 100% accessibility compliance.',
      'Leverage HTML5 storage APIs (`localStorage`, `sessionStorage`) for clientside caching.'
    ],

    // 💡 5. ADVANTAGES & INDUSTRY USE CASES
    advantages: [
      'Superior SEO Ranking: Search engines rank semantic markup significantly higher due to clear content hierarchy.',
      'Accessibility (a11y): Screen readers enable visually impaired users to navigate easily using landmark jumps.',
      'Maintainability: Clean, standardized semantic tags eliminate "div soup" and reduce codebase cognitive load.',
      'Built-In Form Validation: Validates email formats, required fields, and character ranges without bloated JS scripts.'
    ],

    diagramType: 'htmlDomTree',
    complexity: {
      domParsing: 'O(N) Linear Tokenization & Tree Construction',
      rendering: 'HTML/CSS -> DOM + CSSOM -> Render Tree -> Layout (Reflow) -> Paint -> GPU Composite',
      accessibility: 'ARIA Landmarks (role="banner", "main", "navigation") & Screen Reader Compliance'
    },
    codeSnippets: {
      html: `<!-- Modern Accessible HTML5 Semantic Layout Template -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ProgrammingWala Interactive Learning Hub in RDC Ghaziabad">
  <title>Accessible Semantic HTML5 Layout</title>
</head>
<body>
  <!-- Header Landmark with Semantic Navigation -->
  <header role="banner" class="site-header">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <nav role="navigation" aria-label="Main Navigation">
      <ul class="nav-list">
        <li><a href="/courses">Courses</a></li>
        <li><a href="/tutorials">Tutorials Hub</a></li>
        <li><a href="/practice">1000 DSA Practice</a></li>
      </ul>
    </nav>
  </header>

  <!-- Main Landmark: Primary Page Content -->
  <main id="main-content" role="main">
    <article class="tutorial-card">
      <header>
        <h1>Mastering HTML5 DOM Architecture</h1>
        <p>Published: <time datetime="2026-09-01">September 1, 2026</time></p>
      </header>
      
      <section aria-labelledby="form-heading">
        <h2 id="form-heading">Student Admissions Enrollment Form</h2>
        <form id="enroll-form" action="/api/enroll" method="POST" novalidate>
          <div class="form-group">
            <label for="student-name">Full Name <span aria-hidden="true">*</span>:</label>
            <input type="text" id="student-name" name="name" required minlength="3" placeholder="e.g. Ishika Rani" autocomplete="name">
          </div>

          <div class="form-group">
            <label for="student-email">Email Address <span aria-hidden="true">*</span>:</label>
            <input type="email" id="student-email" name="email" required placeholder="name@example.com" autocomplete="email">
          </div>

          <div class="form-group">
            <label for="course-select">Select Specialization:</label>
            <select id="course-select" name="course" required>
              <option value="">-- Choose Career Track --</option>
              <option value="java-fullstack">Java Full Stack & AWS DevOps</option>
              <option value="python-ai">Python AI & Machine Learning</option>
              <option value="mern-stack">MERN Full Stack Web Development</option>
            </select>
          </div>

          <button type="submit" class="submit-btn">Enroll with 100% Placement Support</button>
        </form>
      </section>

      <aside aria-label="Campus Information" class="sidebar-note">
        <h3>📍 RDC Ghaziabad Campus</h3>
        <p>Classes held at C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad.</p>
      </aside>
    </article>
  </main>

  <!-- Footer Landmark -->
  <footer role="contentinfo" class="site-footer">
    <p>&copy; 2026 ProgrammingWala &amp; AppleTree Infotech. All rights reserved.</p>
  </footer>
</body>
</html>`,
      javascript: `// JavaScript DOM Manipulation & Constraint Validation
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enroll-form');
  const nameInput = document.getElementById('student-name');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!nameInput.value || nameInput.value.length < 3) {
      alert('⚠️ Please enter a valid name with at least 3 characters.');
      nameInput.focus();
      return;
    }
    console.log('✅ Form successfully validated and submitted!');
  });
});`
    },
    keyTakeaways: [
      'Semantic tags communicate document landmarks to assistive technologies and search crawlers.',
      'The browser constructs DOM and CSSOM trees before generating the combined Render Tree for layout and paint.',
      'Always bind labels to input IDs and provide accessible alt text for all visual assets.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎨 5. CSS & CSS3 LAYOUT ARCHITECTURE: BOX MODEL, FLEXBOX & GRID
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'css3-box-model-flexbox-grid',
    title: 'CSS3 Layout Architecture: Box Model, Flexbox Axes, 2D Grid & Specificity Hierarchy',
    category: 'CSS & Modern CSS3',
    domain: 'css',
    difficulty: 'Beginner to Intermediate',
    readTime: '16 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Meta', 'Apple', 'Google', 'Airbnb', 'Stripe', 'AppleTree Infotech'],
    summary: 'Master modern CSS layout systems. Understand the CSS Box Model (Content, Padding, Border, Margin, box-sizing: border-box), 1D Flexbox axis alignment, 2D CSS Grid templates, Specificity calculation hierarchy, and custom properties (variables).',
    
    // 📖 1. DETAILED THEORY
    theory: `Cascading Style Sheets (CSS3) is the language used to describe the presentation, layout, and visual formatting of web documents. Modern CSS is modular, powerful, and hardware-accelerated.

Core fundamental pillars of CSS architecture:
1. **The CSS Box Model**: Every HTML element rendered in the browser is represented as a rectangular box composed of 4 concentric layers:
   - **Content**: The text, images, or media of the element.
   - **Padding**: The transparent clearance area between the content and the border.
   - **Border**: The stroke line wrapping around the padding and content.
   - **Margin**: The transparent outer spacing separating the element from neighboring elements.
2. **\`box-sizing: border-box\`**: By default (\`content-box\`), adding padding expands the element beyond declared width. Setting \`box-sizing: border-box\` incorporates padding and borders inside the declared width and height, preventing layout breakage.
3. **1D Flexbox Layout**: Optimized for distributing space and aligning items along a single dimension (either a row or a column).
4. **2D CSS Grid Layout**: Designed for two-dimensional grid layouts, controlling rows and columns simultaneously.`,

    // ⚙️ 2. HOW IT WORKS
    howItWorks: `CSS Specificity and Layout Computation Rules:

1. **CSS Specificity Calculation (The Cascade Hierarchy)**:
   When conflicting rules target the same element, the browser computes a specificity score:
   - **\`!important\`**: Overrides all other declarations (Highest priority).
   - **Inline Styles (\`style="..."\`)**: Specificity value = **1,000**.
   - **ID Selectors (\`#header\`)**: Specificity value = **100**.
   - **Classes, Attributes & Pseudo-Classes (\`.btn\`, \`[type="text"]\`, \`:hover\`)**: Specificity value = **10**.
   - **Element Tags & Pseudo-Elements (\`h1\`, \`p\`, \`::before\`)**: Specificity value = **1**.
   - **Universal Selector (\`*\`)**: Specificity value = **0**.

2. **Flexbox Coordinate Space**:
   - **Main Axis**: Defined by \`flex-direction\` (\`row\` [horizontal] or \`column\` [vertical]). Controlled via \`justify-content\`.
   - **Cross Axis**: Perpendicular to the main axis. Controlled via \`align-items\` and \`align-content\`.`,

    // 📋 3. CORE METHODS & API REFERENCE
    methodsList: [
      { name: 'box-sizing: border-box', signature: 'box-sizing: content-box | border-box', description: 'Forces width/height to include padding and border boundaries.', timeComplexity: 'Layout Engine' },
      { name: 'justify-content', signature: 'justify-content: flex-start | center | space-between | space-around', description: 'Aligns flex/grid items along the main axis.', timeComplexity: 'Layout Engine' },
      { name: 'align-items', signature: 'align-items: stretch | center | flex-start | flex-end', description: 'Aligns flex/grid items across the perpendicular cross axis.', timeComplexity: 'Layout Engine' },
      { name: 'grid-template-columns', signature: 'repeat(auto-fit, minmax(280px, 1fr))', description: 'Defines responsive fluid grid columns without media query breakpoints.', timeComplexity: 'Layout Engine' },
      { name: 'var(--custom-property)', signature: 'color: var(--primary-color, #ec4899)', description: 'Accesses CSS Custom Properties (Theme Variables) dynamically.', timeComplexity: 'CSSOM Engine' }
    ],

    // 🛠️ 4. STEP-BY-STEP IMPLEMENTATION GUIDE
    stepByStep: [
      'Apply universal box-sizing reset: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`.',
      'Declare root theme variables using `:root { --primary: #ec4899; }` for centralized maintainability.',
      'Use Flexbox (`display: flex; align-items: center; justify-content: space-between;`) for 1D headers and toolbars.',
      'Use CSS Grid (`display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));`) for 2D card decks.',
      'Add smooth transitions (`transition: transform 0.2s ease;`) for delightful interactive feedback.'
    ],

    // 💡 5. ADVANTAGES & INDUSTRY USE CASES
    advantages: [
      'Pixel-Perfect Responsive Design: Adapts cleanly from mobile screens (320px) to 4K ultra-wide monitors.',
      'Zero-JS Layouts: Fluid CSS Grid eliminates brittle JavaScript window resize calculations.',
      'GPU Acceleration: CSS transforms (`transform: translate3d`) run smoothly at 60/120 FPS on the GPU thread.',
      'Dynamic Theme Switching: CSS Variables enable instant light/dark mode toggling with zero latency.'
    ],

    diagramType: 'cssBoxModel',
    complexity: {
      boxModel: 'Content -> Padding -> Border -> Margin (box-sizing: border-box)',
      flexbox: '1D Axis: Main Axis (justify-content) • Cross Axis (align-items)',
      grid: '2D Matrix: Columns + Rows (repeat(auto-fit, minmax(280px, 1fr)))',
      specificityOrder: '!important -> Inline (1000) -> ID (100) -> Class (10) -> Tag (1)'
    },
    codeSnippets: {
      css: `/* ============================================================================
   MODERN RESPONSIVE CSS3 STYLESHEET WITH VARIABLES, FLEXBOX & GRID
   ============================================================================ */

/* 1. Theme Custom Properties (Variables) */
:root {
  --primary-color: #ec4899;
  --secondary-color: #8b5cf6;
  --bg-canvas: #f8fafc;
  --surface-card: #ffffff;
  --text-main: #0f172a;
  --border-subtle: #e2e8f0;
  --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

/* 2. Global Box Model Reset */
*, *::before, *::after {
  box-sizing: border-box; /* Crucial: Prevents padding from breaking layout width */
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--bg-canvas);
  color: var(--text-main);
  line-height: 1.6;
}

/* 3. 2D Responsive CSS Grid Layout */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 4. Glassmorphism Card with Flexbox Layout */
.course-card {
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(236, 72, 153, 0.2);
}

/* 5. Flexbox Header Navigation Bar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px); /* Glass effect */
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}`
    },
    keyTakeaways: [
      'box-sizing: border-box ensures padding and borders do not expand an element beyond declared width/height.',
      'Use Flexbox for 1D single-axis layouts and CSS Grid for 2D multi-track responsive matrices.',
      'CSS Specificity scores determine which rule wins in cascading conflicts (Inline 1000 > ID 100 > Class 10 > Tag 1).'
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. 1000 CURATED DSA QUESTIONS DIRECTORY & TAXONOMY
// ─────────────────────────────────────────────────────────────────────────────
const DSA_QUESTION_BANK = [
  { id: 1, title: 'Two Sum (Hash Map Lookup)', topic: 'Arrays & Hashing', difficulty: 'Easy', companies: ['Google', 'Amazon', 'Meta'], time: 'O(N)', space: 'O(N)' },
  { id: 2, title: 'Longest Substring Without Repeating Characters', topic: 'Sliding Window', difficulty: 'Medium', companies: ['Amazon', 'Microsoft'], time: 'O(N)', space: 'O(min(N, M))' },
  { id: 3, title: 'Trapping Rain Water', topic: 'Two Pointers', difficulty: 'Hard', companies: ['Google', 'Meta', 'Amazon'], time: 'O(N)', space: 'O(1)' },
  { id: 4, title: 'Reverse a Linked List (Iterative & Recursive)', topic: 'Linked Lists', difficulty: 'Easy', companies: ['Microsoft', 'Adobe', 'Apple'], time: 'O(N)', space: 'O(1)' },
  { id: 5, title: 'Detect & Remove Loop in Linked List (Floyd Cycle)', topic: 'Linked Lists', difficulty: 'Medium', companies: ['Amazon', 'Qualcomm'], time: 'O(N)', space: 'O(1)' },
  { id: 6, title: 'Binary Tree Level Order Traversal (BFS Queue)', topic: 'Trees & BST', difficulty: 'Medium', companies: ['Meta', 'Uber', 'LinkedIn'], time: 'O(N)', space: 'O(N)' },
  { id: 7, title: 'Lowest Common Ancestor in Binary Tree', topic: 'Trees & BST', difficulty: 'Medium', companies: ['Meta', 'Amazon', 'Microsoft'], time: 'O(N)', space: 'O(H)' },
  { id: 8, title: '0/1 Knapsack Problem (DP State Compression)', topic: 'Dynamic Programming', difficulty: 'Medium', companies: ['Google', 'Goldman Sachs'], time: 'O(N*W)', space: 'O(W)' },
  { id: 9, title: 'Longest Common Subsequence (LCS Matrix)', topic: 'Dynamic Programming', difficulty: 'Medium', companies: ['Microsoft', 'Amazon'], time: 'O(N*M)', space: 'O(N*M)' },
  { id: 10, title: 'Word Ladder (Shortest Path in Word Graph BFS)', topic: 'Graphs & BFS/DFS', difficulty: 'Hard', companies: ['Amazon', 'Google'], time: 'O(M^2 * N)', space: 'O(M * N)' }
];

export default function Tutorials() {
  const [selectedArticleId, setSelectedArticleId] = useState(TUTORIAL_ARTICLES[0].id);
  const [activeCodeTab, setActiveCodeTab] = useState('java');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomainFilter, setActiveDomainFilter] = useState('all');

  const selectedArticle = TUTORIAL_ARTICLES.find(a => a.id === selectedArticleId) || TUTORIAL_ARTICLES[0];

  // Filter articles based on search query and category domain
  const filteredArticles = useMemo(() => {
    return TUTORIAL_ARTICLES.filter(art => {
      const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeDomainFilter === 'all' || art.domain === activeDomainFilter;
      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeDomainFilter]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] text-slate-900 font-sans pb-24 text-base sm:text-lg">
      
      {/* ── 1. TECH WIKI & INTERACTIVE TUTORIAL HERO HEADER ── */}
      <section className="bg-[#1c1d21] text-white pt-12 pb-16 px-4 sm:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>ProgrammingWala Engineering Encyclopedia</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-quicksand text-white tracking-tight leading-tight">
                Java Core, OOPs, Collections, HTML5 &amp; CSS3
              </h1>
              <p className="text-base sm:text-xl text-slate-300 max-w-3xl mt-3 font-medium leading-relaxed">
                In-depth conceptual theory, internal execution mechanisms, complete method API references, step-by-step guides, code examples, and key industry advantages.
              </p>
            </div>

            {/* Platform Stats Badge */}
            <div className="bg-white/10 border border-white/15 p-5 rounded-3xl backdrop-blur-md text-sm space-y-2 max-w-sm">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                🚀 Complete Educational Framework
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Includes <strong>Detailed Theory</strong>, <strong>Internal Architecture</strong>, <strong>API Methods Table</strong>, <strong>Step-by-Step Implementation</strong>, and <strong>Code Workbench</strong>.
              </p>
            </div>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="pt-3 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Java, JVM, OOPs, Collections, HTML5, CSS3, 1000 DSA..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-base text-white placeholder:text-slate-400 outline-none focus:bg-white/15 focus:border-pink-400 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm font-bold scrollbar-none">
              {[
                { id: 'all', label: 'All Modules' },
                { id: 'java', label: '☕ Java Core & JVM' },
                { id: 'html', label: '🌐 HTML & HTML5' },
                { id: 'css', label: '🎨 CSS & CSS3' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomainFilter(tab.id)}
                  className={"px-4 py-3 rounded-2xl transition-all whitespace-nowrap cursor-pointer " + (
                    activeDomainFilter === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black shadow-lg scale-105'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 1.5 INTERACTIVE DIGITAL COURSE HANDBOOK & CURRICULUM FLIPBOOK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-600 text-xs font-black uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Interactive Digital Handbook</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Digital Curriculum &amp; Learning Flipbook
              </h2>
              <p className="text-xs sm:text-base text-slate-600 font-medium">
                Flip through our complete interactive student handbook, syllabus, and live practical coding modules directly below.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://online.anyflip.com/sjnor/uvbj/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Fullscreen Flipbook</span>
              </a>
            </div>
          </div>

          {/* Embedded AnyFlip Flipbook iframe with responsive container */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex justify-center items-center">
            <iframe
              title="Interactive Digital Curriculum Flipbook"
              src="https://online.anyflip.com/sjnor/uvbj/index.html"
              className="w-full h-[380px] sm:h-[480px] md:h-[560px] border-0"
              seamless="seamless"
              scrolling="no"
              frameBorder="0"
              allowTransparency="true"
              allowFullScreen={true}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 pt-1">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Use the page arrows or click &amp; drag the book corners to flip pages.</span>
            </span>
            <span className="font-semibold text-slate-700">
              Powered by AnyFlip Digital Cloud Reader
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN TUTORIAL LAYOUT (SIDEBAR + ARTICLE CONTENT) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Topic Navigator */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-pink-500" />
                  <span>Topic Curriculum</span>
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {filteredArticles.length} Modules
                </span>
              </div>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredArticles.map((art) => {
                  const isSelected = art.id === selectedArticle.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => {
                        setSelectedArticleId(art.id);
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className={"p-4 rounded-2xl border transition-all cursor-pointer " + (
                        isSelected
                          ? 'bg-[#1c1d21] text-white border-slate-900 shadow-xl ring-2 ring-pink-500/50'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={"text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md " + (
                          isSelected ? 'bg-pink-500 text-white' : 'bg-slate-200 text-slate-800'
                        )}>
                          {art.category}
                        </span>
                        <span className={"text-xs font-extrabold " + (
                          art.difficulty.includes('Easy') || art.difficulty.includes('Beginner')
                            ? 'text-emerald-500' 
                            : 'text-amber-500'
                        )}>
                          {art.difficulty}
                        </span>
                      </div>
                      <h4 className={"text-sm font-extrabold line-clamp-2 leading-snug " + (isSelected ? 'text-white' : 'text-slate-900')}>
                        {art.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{art.readTime}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Offline Classroom Callout */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-white border border-pink-200 shadow-md space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-pink-600 block">
                Classroom Labs in RDC Ghaziabad
              </span>
              <h4 className="text-base font-black text-slate-900 leading-snug">Need Real-Time Mentorship?</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Join our offline coding lab batches at C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad.
              </p>
              <Link
                to="/courses-in-ghaziabad"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-600 hover:text-pink-700 pt-1"
              >
                <span>View RDC Campus &amp; Google Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Right Content Area: Rich Article Details */}
          <div className="lg:col-span-8 space-y-10">
            <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8">
              
              {/* Article Header */}
              <div className="space-y-4 border-b border-slate-100 pb-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold">
                    {selectedArticle.difficulty}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{selectedArticle.readTime}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                  {selectedArticle.summary}
                </p>

                {/* Target Companies */}
                {selectedArticle.companies && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-bold text-slate-500">Interviewed At:</span>
                    {selectedArticle.companies.map(c => (
                      <span key={c} className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── 1. DETAILED THEORETICAL FOUNDATION ── */}
              <div className="space-y-3">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-pink-500" />
                  <span>1. Detailed Theoretical Concept</span>
                </h3>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
                  {selectedArticle.theory}
                </div>
              </div>

              {/* ── 2. HOW IT WORKS & INTERNAL ARCHITECTURE ── */}
              <div className="space-y-3">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-purple-600" />
                  <span>2. How It Works (Internal Architecture &amp; Mechanics)</span>
                </h3>
                <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-200 text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
                  {selectedArticle.howItWorks}
                </div>
              </div>

              {/* ── 3. VISUAL FLOWDIAGRAM & ARCHITECTURE ── */}
              <div className="space-y-3">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-pink-500" />
                  <span>3. Architecture Flowchart &amp; Execution Diagram</span>
                </h3>

                <div className="p-6 rounded-3xl bg-[#0f172a] text-white border border-slate-800 shadow-inner overflow-x-auto flex items-center justify-center min-h-[220px]">
                  
                  {/* DIAGRAM 1: JVM ARCHITECTURE */}
                  {selectedArticle.diagramType === 'jvmArchitecture' && (
                    <div className="space-y-4 text-center w-full max-w-2xl font-mono text-xs sm:text-sm">
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="p-3 bg-blue-900/60 border border-blue-500/50 rounded-2xl">
                          <span className="text-blue-300 font-bold block text-sm">1. .java Source</span>
                          <span className="text-xs text-slate-300">Human Readable Code</span>
                        </div>
                        <div className="p-3 bg-purple-900/60 border border-purple-500/50 rounded-2xl">
                          <span className="text-purple-300 font-bold block text-sm">2. javac Compiler</span>
                          <span className="text-xs text-slate-300">Generates .class Bytecode</span>
                        </div>
                        <div className="p-3 bg-emerald-900/60 border border-emerald-500/50 rounded-2xl">
                          <span className="text-emerald-300 font-bold block text-sm">3. ClassLoader</span>
                          <span className="text-xs text-slate-300">Loading, Linking, Init</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900 border border-slate-700 rounded-3xl space-y-3">
                        <span className="text-xs sm:text-sm font-black text-amber-300 uppercase block">
                          JVM Run-Time Data Areas (Memory Allocation)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                            <strong className="text-amber-300 block text-xs sm:text-sm">Heap Memory</strong>
                            <span>Objects &amp; Instance Vars (Shared)</span>
                          </div>
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                            <strong className="text-cyan-300 block text-xs sm:text-sm">Call Stack</strong>
                            <span>Stack Frames &amp; Primitives (Per-Thread)</span>
                          </div>
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                            <strong className="text-rose-300 block text-xs sm:text-sm">Metaspace</strong>
                            <span>Class Metadata &amp; Statics</span>
                          </div>
                          <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                            <strong className="text-emerald-300 block text-xs sm:text-sm">PC Register</strong>
                            <span>Bytecode Instruction Pointer</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200 font-sans text-left">
                        ⚡ <strong>Execution Engine</strong>: Interpreter runs line-by-line &rarr; HotSpot JIT (C1/C2) compiles hot loops to native CPU machine code &rarr; Garbage Collector reclaims dead Heap objects.
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 2: OOPS 4 PILLARS & SOLID */}
                  {selectedArticle.diagramType === 'oopsPillarsSolid' && (
                    <div className="space-y-4 text-center w-full max-w-2xl font-mono text-xs sm:text-sm">
                      <div className="p-3 bg-purple-700 rounded-2xl font-bold text-white text-sm sm:text-base">
                        4 Core Pillars of Object-Oriented Programming (OOPs)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <strong className="text-amber-300 block text-sm">1. Encapsulation</strong>
                          <span>Data Hiding &amp; Accessors</span>
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <strong className="text-blue-300 block text-sm">2. Abstraction</strong>
                          <span>Interfaces &amp; Contracts</span>
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <strong className="text-emerald-300 block text-sm">3. Inheritance</strong>
                          <span>Code Reuse &amp; Superclass</span>
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <strong className="text-rose-300 block text-sm">4. Polymorphism</strong>
                          <span>Overloading &amp; Dispatch</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs sm:text-sm text-amber-200">
                        SOLID: Single Responsibility • Open-Closed • Liskov Substitution • Interface Segregation • Dependency Inversion
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 3: JAVA COLLECTIONS HIERARCHY */}
                  {selectedArticle.diagramType === 'javaCollectionsHierarchy' && (
                    <div className="space-y-4 text-center w-full max-w-2xl font-mono text-xs sm:text-sm">
                      <div className="p-3 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl font-black text-white text-sm sm:text-base">
                        Iterable &lt;T&gt; &rarr; Collection &lt;E&gt; Interface
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3.5 bg-slate-800 border border-blue-500/40 rounded-2xl space-y-1 text-left">
                          <strong className="text-blue-300 block text-sm">List &lt;E&gt; (Ordered, Index)</strong>
                          <div className="text-slate-300 space-y-1">
                            <div>• ArrayList (Fast O(1) Indexing)</div>
                            <div>• LinkedList (Fast Insert/Delete)</div>
                            <div>• Vector / Stack (Legacy)</div>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-800 border border-purple-500/40 rounded-2xl space-y-1 text-left">
                          <strong className="text-purple-300 block text-sm">Set &lt;E&gt; (Unique Elements)</strong>
                          <div className="text-slate-300 space-y-1">
                            <div>• HashSet (Hashing, Unordered)</div>
                            <div>• LinkedHashSet (Insertion Order)</div>
                            <div>• TreeSet (Red-Black Tree O(logN))</div>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-800 border border-emerald-500/40 rounded-2xl space-y-1 text-left">
                          <strong className="text-emerald-300 block text-sm">Queue &lt;E&gt; / Deque &lt;E&gt;</strong>
                          <div className="text-slate-300 space-y-1">
                            <div>• PriorityQueue (Min/Max Heap)</div>
                            <div>• ArrayDeque (Fast LIFO/FIFO)</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-900 border border-amber-500/40 rounded-2xl">
                        <strong className="text-amber-300 block text-sm mb-2">Map &lt;K, V&gt; (Key-Value Key-Set Mapping)</strong>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                          <div className="p-2 bg-slate-800 rounded-lg">HashMap (O(1) Hash Table)</div>
                          <div className="p-2 bg-slate-800 rounded-lg">LinkedHashMap (Insertion Order)</div>
                          <div className="p-2 bg-slate-800 rounded-lg">TreeMap (Sorted Red-Black)</div>
                          <div className="p-2 bg-slate-800 rounded-lg">ConcurrentHashMap (Lock-Free)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 4: HTML DOM TREE */}
                  {selectedArticle.diagramType === 'htmlDomTree' && (
                    <div className="space-y-3 text-center w-full max-w-lg font-mono text-xs sm:text-sm">
                      <div className="p-2.5 bg-blue-600 rounded-xl font-bold">Document Root</div>
                      <div className="p-2.5 bg-purple-600 rounded-xl font-bold">&lt;html lang="en"&gt;</div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <strong className="text-amber-300 block text-sm">&lt;head&gt;</strong>
                          <span>meta, title, link, script</span>
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <strong className="text-emerald-300 block text-sm">&lt;body&gt;</strong>
                          <span>header, main, article, footer</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 5: CSS BOX MODEL */}
                  {selectedArticle.diagramType === 'cssBoxModel' && (
                    <div className="p-4 bg-slate-900 rounded-3xl border border-slate-700 w-full max-w-md text-center font-mono text-xs sm:text-sm space-y-2">
                      <div className="p-3.5 bg-amber-600/30 border border-amber-500 rounded-2xl">
                        <span className="text-amber-300 block font-bold text-xs sm:text-sm">MARGIN (Outer Spacing)</span>
                        <div className="p-3.5 bg-purple-600/30 border border-purple-500 rounded-2xl my-2">
                          <span className="text-purple-300 block font-bold text-xs sm:text-sm">BORDER (Stroke Boundary)</span>
                          <div className="p-3.5 bg-emerald-600/30 border border-emerald-500 rounded-2xl my-2">
                            <span className="text-emerald-300 block font-bold text-xs sm:text-sm">PADDING (Inner Clearance)</span>
                            <div className="p-3 bg-blue-600 text-white rounded-xl font-bold text-xs sm:text-sm">
                              CONTENT (Text / Media)
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-sans">
                        box-sizing: border-box includes Padding &amp; Border inside width.
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* ── 4. METHODS & API REFERENCE TABLE ── */}
              {selectedArticle.methodsList && (
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <ListOrdered className="w-6 h-6 text-pink-500" />
                    <span>4. Key Methods &amp; API Reference</span>
                  </h3>
                  <div className="overflow-x-auto rounded-3xl border border-slate-200">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-100 text-slate-800 font-black uppercase text-xs">
                        <tr>
                          <th className="p-4">Method / Property</th>
                          <th className="p-4">Method Signature</th>
                          <th className="p-4">Description &amp; Purpose</th>
                          <th className="p-4">Complexity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {selectedArticle.methodsList.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            <td className="p-4 font-bold text-pink-600 font-mono">{m.name}</td>
                            <td className="p-4 font-mono text-slate-700 text-xs">{m.signature}</td>
                            <td className="p-4 text-slate-700">{m.description}</td>
                            <td className="p-4 font-mono font-bold text-slate-900">{m.timeComplexity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── 5. STEP-BY-STEP IMPLEMENTATION GUIDE ── */}
              {selectedArticle.stepByStep && (
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-emerald-600" />
                    <span>5. How To Implement This (Step-by-Step Guide)</span>
                  </h3>
                  <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                    {selectedArticle.stepByStep.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-base sm:text-lg text-slate-800">
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 6. PRODUCTION CODE IMPLEMENTATION ── */}
              {selectedArticle.codeSnippets && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <Code2 className="w-6 h-6 text-pink-500" />
                      <span>6. Complete Working Code Implementation</span>
                    </h3>

                    {/* Language Switcher Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                      {Object.keys(selectedArticle.codeSnippets).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setActiveCodeTab(lang)}
                          className={"px-3.5 py-1.5 rounded-xl uppercase transition-all cursor-pointer " + (
                            activeCodeTab === lang
                              ? 'bg-white text-slate-900 shadow-md font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          )}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Editor Frame */}
                  <div className="relative rounded-3xl bg-[#0d1117] text-slate-200 border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-[#161b22] border-b border-slate-800 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        <span className="ml-3 text-xs sm:text-sm uppercase font-bold text-slate-300">
                          {activeCodeTab} Source Code
                        </span>
                      </span>

                      <button
                        onClick={() => handleCopyCode(selectedArticle.codeSnippets[activeCodeTab] || Object.values(selectedArticle.codeSnippets)[0])}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
                        <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <pre className="p-6 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto max-h-[550px] text-slate-200">
                      <code>{selectedArticle.codeSnippets[activeCodeTab] || Object.values(selectedArticle.codeSnippets)[0]}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* ── 7. ADVANTAGES & INDUSTRY USE CASES ── */}
              {selectedArticle.advantages && (
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <ThumbsUp className="w-6 h-6 text-emerald-600" />
                    <span>7. Key Advantages &amp; Real-World Industry Benefits</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedArticle.advantages.map((adv, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-slate-800 font-semibold">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 8. INTERVIEW CHEAT SHEET & KEY TAKEAWAYS ── */}
              {selectedArticle.keyTakeaways && (
                <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-3">
                  <span className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-900 block flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>Key Takeaways &amp; Interview Notes</span>
                  </span>
                  <ul className="space-y-2 text-sm sm:text-base text-slate-800">
                    {selectedArticle.keyTakeaways.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Star className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </article>

            {/* ── 9. CURATED DSA QUESTIONS SECTION ── */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-pink-600 block">
                    Enterprise Technical Prep
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black text-slate-900">
                    Curated FAANG &amp; Product Company Questions
                  </h3>
                </div>
                <Link
                  to="/practice"
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition flex items-center gap-2 shadow-lg"
                >
                  <span>Open Live Compiler</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {DSA_QUESTION_BANK.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2 hover:border-pink-300 transition">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-extrabold text-slate-900 line-clamp-1">
                        #{q.id} {q.title}
                      </span>
                      <span className={"text-xs font-black px-2.5 py-0.5 rounded-md shrink-0 " + (
                        q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                        q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                      )}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>{q.topic}</span>
                      <span className="font-bold text-slate-700">Time: {q.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>
      </div>

    </div>
  );
}

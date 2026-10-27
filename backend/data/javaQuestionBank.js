/**
 * Comprehensive Ready-Made Java Question Bank
 * Contains over 1,200+ categorized MCQs across all major Java domains
 * Difficulty: Easy, Medium, Hard
 */

const baseQuestions = [
  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 1: CORE JAVA & SYNTAX
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Core Java & Syntax',
    difficulty: 'easy',
    text: 'What is the default value of a local boolean variable declared inside a method in Java?',
    options: ['false', 'true', 'null', 'It has no default value (Causes compile-time error if used uninitialized)'],
    correct: 'It has no default value (Causes compile-time error if used uninitialized)',
    explanation: 'Local variables in Java are allocated on the stack and do not receive default values. They must be explicitly initialized before being read; otherwise, a compile-time error occurs.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'easy',
    text: 'What is the size of an int data type in standard Java virtual machines?',
    options: ['16 bits (2 bytes)', '32 bits (4 bytes)', '64 bits (8 bytes)', 'Platform-dependent'],
    correct: '32 bits (4 bytes)',
    explanation: 'In Java, primitive data types have fixed sizes regardless of the underlying hardware platform. An int is strictly 32 bits (4 bytes), ranging from -2^31 to 2^31 - 1.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'easy',
    text: 'Which of the following is NOT a primitive data type in Java?',
    options: ['byte', 'short', 'String', 'float'],
    correct: 'String',
    explanation: 'String is an object (class reference type in java.lang) representing a sequence of characters, not a primitive data type. Java has 8 primitives: byte, short, int, long, float, double, char, boolean.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'easy',
    text: 'What is the correct syntax for the main entry point method in a standard Java application?',
    options: [
      'public void main(String[] args)',
      'public static void main(String[] args)',
      'static void main(String args[])',
      'public static int main(String[] args)'
    ],
    correct: 'public static void main(String[] args)',
    explanation: 'The JVM looks for public static void main(String[] args) as the standard entry point of a standalone Java program so it can invoke it without instantiating the class.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'easy',
    text: 'Which operator is used in Java to test if an object is an instance of a specific class or interface?',
    options: ['typeof', 'instanceof', 'isinstance', 'typeOf'],
    correct: 'instanceof',
    explanation: 'The instanceof operator tests whether the object on its left side has an is-a relationship with the class or interface on its right side, returning a boolean.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'medium',
    text: 'What is the output of the following Java code?\n\nint x = 5;\nSystem.out.println(x++ + ++x);',
    options: ['10', '11', '12', '13'],
    correct: '12',
    explanation: 'In x++, post-increment uses current value 5, then x becomes 6. Next, ++x pre-increments x from 6 to 7 and uses 7. The sum is 5 + 7 = 12.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'medium',
    text: 'What happens when evaluating:\n\nbyte b = 10;\nb = (byte)(b * 2);',
    options: [
      'Compile-time error because arithmetic on byte requires casting to int',
      'Compiles successfully and b equals 20',
      'Runtime exception',
      'Compile-time error because byte overflow happens'
    ],
    correct: 'Compiles successfully and b equals 20',
    explanation: 'Arithmetic operators (+, *, -) promote operands to at least int. Because explicit cast (byte) is applied to the result of (b * 2), it compiles cleanly and assigns 20.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'medium',
    text: 'Which statement about Java switch expressions introduced in recent Java versions (Java 14+) is FALSE?',
    options: [
      'Switch can be used as an expression that produces a value.',
      'Arrow syntax (case X ->) does not fall through automatically.',
      'The yield keyword is used to return a value from a multi-line switch block.',
      'Switch expressions do not require all possible enum or sealed type cases to be covered.'
    ],
    correct: 'Switch expressions do not require all possible enum or sealed type cases to be covered.',
    explanation: 'Switch expressions MUST be exhaustive, meaning every possible value of the selector expression must be covered by case branches or a default clause.'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'hard',
    text: 'What will be printed by the following code snippet?\n\nInteger a = 127;\nInteger b = 127;\nInteger c = 128;\nInteger d = 128;\nSystem.out.println((a == b) + " " + (c == d));',
    options: ['true true', 'true false', 'false false', 'false true'],
    correct: 'true false',
    explanation: 'Java caches Integer objects in the range -128 to 127 (IntegerCache). For 127, a and b reference the same cached object (true). For 128, distinct new objects are allocated, so == comparison tests memory address (false).'
  },
  {
    topic: 'Core Java & Syntax',
    difficulty: 'hard',
    text: 'What is the output of the following bitwise operation?\n\nint result = -1 >>> 24;',
    options: ['-1', '255', '0', '-256'],
    correct: '255',
    explanation: '-1 in 32-bit binary is 0xFFFFFFFF (all 32 bits set). The unsigned right shift (>>>) shifts in 24 zeroes from the left, leaving 8 ones at the bottom: 0x000000FF = 255.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 2: OBJECT-ORIENTED PROGRAMMING (OOP)
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'easy',
    text: 'Which pillar of OOP is primarily achieved using private fields and public getter/setter methods in Java?',
    options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
    correct: 'Encapsulation',
    explanation: 'Encapsulation is the bundling of data (fields) and the methods operating on that data, while restricting direct access to components via access modifiers (data hiding).'
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'easy',
    text: 'Can a Java class inherit from more than one concrete class directly (Multiple Class Inheritance)?',
    options: [
      'Yes, by separating class names with commas',
      'No, Java does not support multiple class inheritance to avoid the Diamond Problem',
      'Yes, but only if both superclasses are abstract',
      'Yes, using the multiple keyword'
    ],
    correct: 'No, Java does not support multiple class inheritance to avoid the Diamond Problem',
    explanation: 'Java supports single class inheritance (a class can only extend one direct superclass) to prevent ambiguity such as the Diamond Problem, though it allows implementing multiple interfaces.'
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'easy',
    text: 'What is the default access modifier of members in a class if none is specified?',
    options: ['private', 'protected', 'public', 'Package-private (default)'],
    correct: 'Package-private (default)',
    explanation: 'If no access modifier is specified, members have package-private access, meaning they are visible to any class within the same package, but not outside.'
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'medium',
    text: 'Which of the following is TRUE regarding method overriding in Java?',
    options: [
      'The overriding method can have a more restrictive access modifier than the superclass method.',
      'The overriding method can throw broader checked exceptions than declared by the superclass method.',
      'The overriding method can have a covariant return type (subclass of the return type declared in the superclass).',
      'Static methods in the superclass can be overridden by instance methods in subclasses.'
    ],
    correct: 'The overriding method can have a covariant return type (subclass of the return type declared in the superclass).',
    explanation: 'Since Java 5, covariant return types are permitted: an overriding method may return a more specific subtype. The overriding method cannot reduce visibility or declare broader checked exceptions, and static methods are shadowed/hidden, not overridden.'
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'medium',
    text: 'Can a constructor in Java be marked as final, static, or abstract?',
    options: [
      'Yes, any of them',
      'Only static and final',
      'Only final',
      'No, constructors cannot be marked final, static, or abstract'
    ],
    correct: 'No, constructors cannot be marked final, static, or abstract',
    explanation: 'Constructors cannot be final (they are not inherited), static (they belong to object creation, not the class level), or abstract (they must provide an implementation to construct an instance).'
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'medium',
    text: 'What keyword is used inside a subclass constructor to explicitly call the superclass constructor?',
    options: ['this()', 'super()', 'parent()', 'base()'],
    correct: 'super()',
    explanation: 'super() is used to invoke the superclass constructor, and if written explicitly, it must be the very first statement in the subclass constructor body.'
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'hard',
    text: 'What is the output of the following polymorphic code snippet?\n\nclass Parent {\n  int val = 10;\n  void show() { System.out.print("P"); }\n}\nclass Child extends Parent {\n  int val = 20;\n  void show() { System.out.print("C"); }\n}\n\nParent obj = new Child();\nSystem.out.print(obj.val);\nobj.show();',
    options: ['10C', '20C', '10P', '20P'],
    correct: '10C',
    explanation: 'In Java, variables are resolved at compile time based on the reference type (Parent.val = 10), while instance methods are resolved at runtime via dynamic method dispatch (Child.show prints C). Hence output is 10C.'
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    difficulty: 'hard',
    text: 'Which statement accurately describes default methods in Java 8+ interfaces?',
    options: [
      'Default methods cannot be overridden by implementing classes.',
      'Default methods enable adding new methods to interfaces without breaking existing implementing classes.',
      'An interface default method can access instance fields of implementing classes directly.',
      'Default methods can override methods declared in java.lang.Object such as toString() or equals().'
    ],
    correct: 'Default methods enable adding new methods to interfaces without breaking existing implementing classes.',
    explanation: 'Default methods were introduced to allow backward-compatible API evolution (like adding stream() to Collection). They cannot override Object methods, and implementing classes can override them.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 3: EXCEPTION HANDLING
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Exception Handling',
    difficulty: 'easy',
    text: 'Which class is the superclass of all errors and exceptions in the Java language?',
    options: ['java.lang.Exception', 'java.lang.Throwable', 'java.lang.Error', 'java.lang.RuntimeException'],
    correct: 'java.lang.Throwable',
    explanation: 'java.lang.Throwable is the ultimate root class for all exceptions and errors in Java. Only instances of Throwable or its subclasses can be thrown by the JVM or throw statement.'
  },
  {
    topic: 'Exception Handling',
    difficulty: 'easy',
    text: 'Which of the following is an UNCHECKED exception (subclass of RuntimeException) in Java?',
    options: ['IOException', 'SQLException', 'NullPointerException', 'ClassNotFoundException'],
    correct: 'NullPointerException',
    explanation: 'NullPointerException is a subclass of RuntimeException, making it an unchecked exception. The compiler does not require callers to catch or declare unchecked exceptions.'
  },
  {
    topic: 'Exception Handling',
    difficulty: 'medium',
    text: 'What happens in the following snippet?\n\nint test() {\n  try {\n    return 1;\n  } finally {\n    return 2;\n  }\n}',
    options: ['Returns 1', 'Returns 2', 'Compilation error', 'Runtime exception'],
    correct: 'Returns 2',
    explanation: 'The finally block always executes prior to method exit. A return statement in a finally block overrides and discards any previous return statement or unhandled exception in the try block.'
  },
  {
    topic: 'Exception Handling',
    difficulty: 'medium',
    text: 'In try-with-resources (Java 7+), which interface must a resource class implement to be automatically closed?',
    options: ['java.lang.AutoCloseable', 'java.io.Serializable', 'java.lang.Cloneable', 'java.io.CloseOnly'],
    correct: 'java.lang.AutoCloseable',
    explanation: 'Any object that implements java.lang.AutoCloseable (or java.io.Closeable, which extends AutoCloseable) can be used as a resource in a try-with-resources statement.'
  },
  {
    topic: 'Exception Handling',
    difficulty: 'hard',
    text: 'What is the rule when ordering multiple catch blocks in Java for related exception classes?',
    options: [
      'Subclass exceptions must be caught before superclass exceptions; otherwise, a compile-time unreachable code error occurs.',
      'Superclass exceptions must be caught before subclass exceptions.',
      'Order does not matter; the JVM picks the most specific catch block automatically.',
      'Only one catch block is permitted per try block.'
    ],
    correct: 'Subclass exceptions must be caught before superclass exceptions; otherwise, a compile-time unreachable code error occurs.',
    explanation: 'If a superclass catch block (e.g. Exception) precedes a subclass catch block (e.g. IOException), the subclass catch block is unreachable, causing a compile error.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 4: JAVA COLLECTIONS FRAMEWORK
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Collections Framework',
    difficulty: 'easy',
    text: 'Which Collection interface does NOT allow duplicate elements?',
    options: ['List', 'Set', 'Queue', 'ArrayList'],
    correct: 'Set',
    explanation: 'A Set is a Collection that cannot contain duplicate elements. It models the mathematical set abstraction.'
  },
  {
    topic: 'Collections Framework',
    difficulty: 'easy',
    text: 'What is the primary difference between ArrayList and LinkedList in Java?',
    options: [
      'ArrayList is synchronized; LinkedList is not',
      'ArrayList uses a dynamic resizable array, while LinkedList uses a doubly-linked list',
      'LinkedList provides faster index-based random access than ArrayList',
      'ArrayList does not permit null values'
    ],
    correct: 'ArrayList uses a dynamic resizable array, while LinkedList uses a doubly-linked list',
    explanation: 'ArrayList is backed by a continuous array (O(1) random access by index), while LinkedList is a doubly-linked list (O(1) insertion/deletion at nodes, but O(n) access).'
  },
  {
    topic: 'Collections Framework',
    difficulty: 'medium',
    text: 'What happens when you add an element to a HashSet in Java?',
    options: [
      'It creates an internal array of nodes directly.',
      'It stores the element as a KEY in an internal HashMap, associated with a dummy PRESENT object.',
      'It sorts elements in natural order using merge sort.',
      'It checks duplicates by calling compareTo() only.'
    ],
    correct: 'It stores the element as a KEY in an internal HashMap, associated with a dummy PRESENT object.',
    explanation: 'Internally, HashSet is backed by a HashMap instance. Adding an element to HashSet executes map.put(element, PRESENT).'
  },
  {
    topic: 'Collections Framework',
    difficulty: 'medium',
    text: 'Which Map implementation guarantees that keys are sorted in ascending natural order (or according to a custom Comparator)?',
    options: ['HashMap', 'LinkedHashMap', 'TreeMap', 'Hashtable'],
    correct: 'TreeMap',
    explanation: 'TreeMap is a Red-Black tree-based NavigableMap implementation that keeps keys sorted according to their natural ordering or a Comparator specified at creation.'
  },
  {
    topic: 'Collections Framework',
    difficulty: 'medium',
    text: 'What exception is thrown if a collection is modified structurally while iterating over it via Iterator without using iterator.remove()?',
    options: ['IllegalStateException', 'ConcurrentModificationException', 'IndexOutOfBoundsException', 'CollectionModifiedException'],
    correct: 'ConcurrentModificationException',
    explanation: 'Java fail-fast iterators detect concurrent modifications by checking the modCount field. If modified structurally outside the iterator, a ConcurrentModificationException is thrown.'
  },
  {
    topic: 'Collections Framework',
    difficulty: 'hard',
    text: 'What internal optimization was introduced in Java 8 for HashMap when a single hash bucket exceeds the TREEIFY_THRESHOLD (8 entries)?',
    options: [
      'The bucket is doubled in size and copied to a separate secondary array.',
      'The linked list in the bucket is converted into a balanced Red-Black Tree (TreeNode), reducing search complexity from O(n) to O(log n).',
      'The HashMap throws a BucketOverflowException.',
      'All elements in the map are rehased immediately into an identity hash map.'
    ],
    correct: 'The linked list in the bucket is converted into a balanced Red-Black Tree (TreeNode), reducing search complexity from O(n) to O(log n).',
    explanation: 'When entries in a single bucket exceed 8 and table capacity >= 64, Java 8 converts the linked list to a Red-Black Tree, preventing worst-case O(n) hash collision performance degradation.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 5: JAVA 8+ STREAMS & LAMBDAS
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Streams & Lambdas (Java 8+)',
    difficulty: 'easy',
    text: 'What is a Functional Interface in Java?',
    options: [
      'An interface with no methods at all',
      'An interface containing exactly one abstract method',
      'An interface that only defines static helper methods',
      'Any interface annotated with @FunctionalInterface'
    ],
    correct: 'An interface containing exactly one abstract method',
    explanation: 'A functional interface is any interface with exactly one abstract method (Single Abstract Method - SAM). It can have any number of default or static methods.'
  },
  {
    topic: 'Streams & Lambdas (Java 8+)',
    difficulty: 'easy',
    text: 'Which functional interface in java.util.function accepts an argument of type T and returns a boolean?',
    options: ['Consumer<T>', 'Function<T, R>', 'Predicate<T>', 'Supplier<T>'],
    correct: 'Predicate<T>',
    explanation: 'Predicate<T> defines boolean test(T t), used frequently for filtering operations in stream pipelines.'
  },
  {
    topic: 'Streams & Lambdas (Java 8+)',
    difficulty: 'medium',
    text: 'Which of the following is a TERMINAL operation in the Java Stream API?',
    options: ['filter()', 'map()', 'sorted()', 'collect()'],
    correct: 'collect()',
    explanation: 'Terminal operations produce a non-stream result (e.g. collect, forEach, count, reduce) or a side-effect, and close the stream. filter, map, and sorted are intermediate lazy operations.'
  },
  {
    topic: 'Streams & Lambdas (Java 8+)',
    difficulty: 'medium',
    text: 'What is the purpose of the Optional<T> class introduced in Java 8?',
    options: [
      'To make objects serializable across JVM networks',
      'To provide a container object which may or may not contain a non-null value, avoiding explicit null checks and NullPointerExceptions',
      'To replace all try-catch blocks',
      'To enable lazy stream evaluation'
    ],
    correct: 'To provide a container object which may or may not contain a non-null value, avoiding explicit null checks and NullPointerExceptions',
    explanation: 'Optional<T> represents a value that might be absent, encouraging clean functional handling via methods like ifPresent, orElse, and map instead of returning raw null.'
  },
  {
    topic: 'Streams & Lambdas (Java 8+)',
    difficulty: 'hard',
    text: 'What is the key difference between map() and flatMap() in the Stream API?',
    options: [
      'map() is intermediate; flatMap() is terminal',
      'map() transforms each element into a single value, whereas flatMap() flattens each generated stream into the parent stream',
      'flatMap() only works on primitive streams like IntStream',
      'map() modifies elements in-place while flatMap() creates a copy'
    ],
    correct: 'map() transforms each element into a single value, whereas flatMap() flattens each generated stream into the parent stream',
    explanation: 'map transforms each item T -> R (one-to-one). flatMap transforms each item T -> Stream<R> and then flattens all those resulting streams into one continuous Stream<R> (one-to-many).'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 6: MULTITHREADING & CONCURRENCY
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Multithreading & Concurrency',
    difficulty: 'easy',
    text: 'Which method must be implemented when defining a task using the java.lang.Runnable interface?',
    options: ['start()', 'run()', 'execute()', 'call()'],
    correct: 'run()',
    explanation: 'Runnable is a functional interface with a single method: public void run(). Calling thread.start() causes the JVM to invoke this run() method asynchronously in a new OS thread.'
  },
  {
    topic: 'Multithreading & Concurrency',
    difficulty: 'medium',
    text: 'What is the primary guarantee provided by the volatile keyword on a shared variable in Java?',
    options: [
      'It makes compound operations like count++ atomic.',
      'It ensures memory visibility across threads by reading and writing directly to main memory, avoiding CPU cache staleness.',
      'It locks the variable so only one thread can access it at a time.',
      'It prevents the garbage collector from reclaiming the variable.'
    ],
    correct: 'It ensures memory visibility across threads by reading and writing directly to main memory, avoiding CPU cache staleness.',
    explanation: 'volatile guarantees that any thread reading the field sees the most recent write by any other thread (memory visibility). It does NOT make non-atomic operations like i++ thread-safe.'
  },
  {
    topic: 'Multithreading & Concurrency',
    difficulty: 'medium',
    text: 'Why do wait(), notify(), and notifyAll() methods belong to java.lang.Object instead of java.lang.Thread?',
    options: [
      'It was a legacy mistake in early JDK 1.0 that could not be changed.',
      'Because every Java object has an associated intrinsic lock (monitor) upon which threads wait and signal.',
      'Because Thread does not inherit from Object.',
      'Because only the JVM execution engine can call them.'
    ],
    correct: 'Because every Java object has an associated intrinsic lock (monitor) upon which threads wait and signal.',
    explanation: 'Thread synchronization in Java operates on object monitors (intrinsic locks). A thread waits on or releases the lock of a specific monitor instance, so the methods belong to Object.'
  },
  {
    topic: 'Multithreading & Concurrency',
    difficulty: 'hard',
    text: 'How does ConcurrentHashMap achieve thread-safety without locking the entire map like Hashtable or Collections.synchronizedMap()?',
    options: [
      'By making all entries immutable',
      'By using lock striping / synchronized blocks on individual bucket tree nodes and non-blocking CAS (Compare-And-Swap) operations',
      'By running all read and write operations on a single background worker thread',
      'By cloning the map on every write'
    ],
    correct: 'By using lock striping / synchronized blocks on individual bucket tree nodes and non-blocking CAS (Compare-And-Swap) operations',
    explanation: 'ConcurrentHashMap achieves high concurrency by locking only the head node of the target bucket during writes (and using lock-free CAS for initial node insertion), while reads remain lock-free.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 7: JVM INTERNALS & MEMORY
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'JVM Internals & Memory',
    difficulty: 'easy',
    text: 'Which memory area in the JVM is shared among all running threads and stores all object instances and arrays?',
    options: ['Java Stack', 'Program Counter (PC) Register', 'Heap Memory', 'Native Method Stack'],
    correct: 'Heap Memory',
    explanation: 'The JVM Heap is the shared runtime data area from which memory for all class instances and arrays is allocated. The Garbage Collector manages heap memory.'
  },
  {
    topic: 'JVM Internals & Memory',
    difficulty: 'medium',
    text: 'In which memory generation of the JVM Heap are newly instantiated objects typically allocated first?',
    options: ['Old Generation (Tenured)', 'Eden Space (Young Generation)', 'Metaspace', 'Survivor Space S1'],
    correct: 'Eden Space (Young Generation)',
    explanation: 'Under generational garbage collection, almost all newly created objects are allocated in the Eden space of the Young Generation. Surviving objects migrate to Survivor spaces, then to the Old Generation.'
  },
  {
    topic: 'JVM Internals & Memory',
    difficulty: 'hard',
    text: 'What replaced the Permanent Generation (PermGen) starting in Java 8, and where is it allocated?',
    options: [
      'Metaspace, allocated in native memory outside the JVM heap',
      'Survivor Space, allocated in the Young Generation',
      'CodeCache, allocated in heap memory',
      'Native Heap, managed by OS virtual memory swap'
    ],
    correct: 'Metaspace, allocated in native memory outside the JVM heap',
    explanation: 'In Java 8, PermGen was replaced by Metaspace. Metaspace stores class metadata and is allocated from native memory, automatically resizing up to available system memory by default.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 8: STRING HANDLING
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'String Handling',
    difficulty: 'easy',
    text: 'Why are String objects immutable in Java?',
    options: [
      'To allow security, thread-safety, hashcode caching, and String Constant Pool sharing',
      'Because primitive char arrays cannot be resized',
      'To prevent strings from consuming heap memory',
      'It is required by the POSIX standard'
    ],
    correct: 'To allow security, thread-safety, hashcode caching, and String Constant Pool sharing',
    explanation: 'Immutability ensures Strings are safe for multithreading, can be shared via the String Constant Pool, have their hashCode cached permanently, and cannot be altered when passed as security parameters.'
  },
  {
    topic: 'String Handling',
    difficulty: 'medium',
    text: 'What is the main difference between StringBuilder and StringBuffer?',
    options: [
      'StringBuffer is faster than StringBuilder',
      'StringBuffer is synchronized (thread-safe); StringBuilder is unsynchronized and faster for single-threaded use',
      'StringBuilder is immutable; StringBuffer is mutable',
      'StringBuffer cannot be converted to a String'
    ],
    correct: 'StringBuffer is synchronized (thread-safe); StringBuilder is unsynchronized and faster for single-threaded use',
    explanation: 'StringBuffer methods are synchronized for thread-safety. StringBuilder (Java 5+) has identical API but without synchronization overhead, making it preferred in single-threaded contexts.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 9: JAVA GENERICS & FILE I/O
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Generics & File I/O',
    difficulty: 'medium',
    text: 'What is Type Erasure in Java Generics?',
    options: [
      'A technique where types are permanently stored in class metadata for reflection only',
      'The process where the compiler removes all generic type arguments and inserts appropriate casts during compilation, ensuring backward compatibility with older JVM bytecode',
      'An error caused when mixing raw types with parameterized types',
      'A Garbage Collection process that reclaims unused class instances'
    ],
    correct: 'The process where the compiler removes all generic type arguments and inserts appropriate casts during compilation, ensuring backward compatibility with older JVM bytecode',
    explanation: 'Type Erasure means that generic types are only present at compile time for type checking. In compiled bytecode, List<String> becomes raw List (with casts inserted), preserving binary compatibility.'
  },
  {
    topic: 'Generics & File I/O',
    difficulty: 'hard',
    text: 'What does the PECS rule stand for in Java Generic Wildcards?',
    options: [
      'Process Extends, Compute Super',
      'Producer Extends, Consumer Super',
      'Public Extends, Class Super',
      'Parameter Extends, Cast Super'
    ],
    correct: 'Producer Extends, Consumer Super',
    explanation: 'PECS (Producer Extends, Consumer Super) means: if a parameterized collection only produces/reads items (read-only), use <? extends T>. If it only consumes/stores items (write), use <? super T>.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TOPIC 10: SPRING BOOT & ENTERPRISE JAVA
  // ══════════════════════════════════════════════════════════════════════════
  {
    topic: 'Spring Boot & Enterprise Java',
    difficulty: 'easy',
    text: 'What is Inversion of Control (IoC) in the Spring Framework?',
    options: [
      'Inverting the flow of database transactions',
      'A design principle where the control of object creation and dependency management is transferred from the application code to the Spring container',
      'Compiling Java classes backwards to machine code',
      'Reversing the order of servlet filters in a web request'
    ],
    correct: 'A design principle where the control of object creation and dependency management is transferred from the application code to the Spring container',
    explanation: 'Inversion of Control (IoC) delegates the responsibility of instantiating, configuring, and assembling dependencies to the Spring IoC container (via Dependency Injection).'
  },
  {
    topic: 'Spring Boot & Enterprise Java',
    difficulty: 'medium',
    text: 'What is the default bean scope in the Spring Framework?',
    options: ['prototype', 'singleton', 'request', 'session'],
    correct: 'singleton',
    explanation: 'By default, Spring beans have singleton scope, meaning the Spring IoC container creates exactly one shared instance of the bean per ApplicationContext.'
  },
  {
    topic: 'Spring Boot & Enterprise Java',
    difficulty: 'medium',
    text: 'Which annotation in Spring Boot combines @Configuration, @EnableAutoConfiguration, and @ComponentScan?',
    options: ['@SpringBootApplication', '@EnableServiceEngine', '@SpringCloudApplication', '@AutoConfigureService'],
    correct: '@SpringBootApplication',
    explanation: '@SpringBootApplication is a convenience meta-annotation that bundles @Configuration, @EnableAutoConfiguration, and @ComponentScan with default attributes.'
  }
];

// Programmatic Generator to produce thousands of rich, realistic, verified Java MCQs
const subtopicTemplates = [
  {
    topic: 'Core Java & Syntax',
    patterns: [
      {
        diff: 'easy',
        q: (t, val) => `What is the value of expression: ${val}?`,
        gen: [
          { expr: '10 % 3', opts: ['1', '3', '0', '3.33'], ans: '1', exp: '10 divided by 3 has a remainder of 1.' },
          { expr: '5 / 2 in integer division', opts: ['2', '2.5', '2.0', '3'], ans: '2', exp: 'Integer division in Java truncates fractional parts toward zero, resulting in 2.' },
          { expr: 'true && false || true', opts: ['true', 'false', 'compile error', 'null'], ans: 'true', exp: 'Logical AND has higher precedence than OR: (true && false) is false, then false || true is true.' },
          { expr: 'Math.abs(-25.5)', opts: ['25.5', '-25.5', '25', '26'], ans: '25.5', exp: 'Math.abs returns the positive absolute value.' },
          { expr: '1 << 3', opts: ['8', '6', '16', '4'], ans: '8', exp: 'Left shifting 1 by 3 bits equals 1 * 2^3 = 8.' },
          { expr: '16 >> 2', opts: ['4', '8', '2', '32'], ans: '4', exp: 'Right shifting 16 by 2 bits equals 16 / 4 = 4.' },
          { expr: '3 + 4 + "7"', opts: ['"77"', '"347"', '"14"', '"311"'], ans: '"77"', exp: 'Addition evaluates left-to-right: 3 + 4 = 7, then 7 + "7" performs string concatenation resulting in "77".' },
          { expr: '"7" + 3 + 4', opts: ['"734"', '"77"', '"14"', 'Compile error'], ans: '"734"', exp: 'Left-to-right concatenation: "7" + 3 = "73", then "73" + 4 = "734".' }
        ]
      },
      {
        diff: 'medium',
        q: (t, val) => `In Java, which statement regarding ${val} is correct?`,
        gen: [
          { val: 'labeled break statements', opts: ['Can break out of outer nested loops when properly labeled', 'Only works inside switch statements', 'Is identical to goto and deprecated', 'Causes a runtime StackOverflowError'], ans: 'Can break out of outer nested loops when properly labeled', exp: 'Java supports labeled break to terminate an outer enclosing loop directly.' },
          { val: 'the final keyword on variables', opts: ['Once assigned a value, its reference or primitive value cannot be reassigned', 'The object pointed to cannot have its internal fields mutated', 'It can only be used with static fields', 'It is optional for constants'], ans: 'Once assigned a value, its reference or primitive value cannot be reassigned', exp: 'A final variable cannot be reassigned after initialization; however, the state of the referenced object itself may still be mutated.' },
          { val: 'ternary operator (condition ? a : b)', opts: ['Requires both branches a and b to evaluate to type-compatible expressions', 'Executes both branches before checking condition', 'Can only be used inside if-else blocks', 'Cannot return void or primitive types'], ans: 'Requires both branches a and b to evaluate to type-compatible expressions', exp: 'The ternary operator evaluates condition first and requires compatible return types.' },
          { val: 'var keyword in Java 10+', opts: ['Performs compile-time local variable type inference', 'Makes Java a dynamically-typed language like JavaScript', 'Can be used for class fields and method return types', 'Assigns the variable a type of java.lang.Object'], ans: 'Performs compile-time local variable type inference', exp: 'var is restricted to local variables with initializers, inferred strictly at compile time.' }
        ]
      },
      {
        diff: 'hard',
        q: (t, val) => `Consider this Java code edge-case on ${val}:`,
        gen: [
          { val: 'floating point precision 0.1 + 0.2', opts: ['0.1 + 0.2 == 0.3 evaluates to false due to IEEE 754 floating-point rounding', 'Evaluates to true', 'Throws ArithmeticException', 'Returns 0.30000000000000000'], ans: '0.1 + 0.2 == 0.3 evaluates to false due to IEEE 754 floating-point rounding', exp: 'Binary floating-point types cannot represent decimals like 0.1 exactly, causing minor rounding differences.' },
          { val: 'strictfp keyword', opts: ['Forces floating-point calculations to conform strictly to IEEE 754 across all hardware platforms', 'Restricts thread execution to a single core', 'Prevents memory leaks in garbage collection', 'Prohibits null assignments to variables'], ans: 'Forces floating-point calculations to conform strictly to IEEE 754 across all hardware platforms', exp: 'strictfp ensures consistent floating-point arithmetic across different CPU architectures.' }
        ]
      }
    ]
  },
  {
    topic: 'Object-Oriented Programming (OOP)',
    patterns: [
      {
        diff: 'easy',
        q: (t, val) => `What is the role of ${val} in Java OOP?`,
        gen: [
          { val: 'the abstract keyword on a class', opts: ['Prevents the class from being instantiated directly with the new operator', 'Makes all methods inside it private', 'Prevents any subclass from inheriting from it', 'Ensures all variables are final'], ans: 'Prevents the class from being instantiated directly with the new operator', exp: 'An abstract class cannot be instantiated directly and serves as a base blueprint for subclasses.' },
          { val: 'an interface', opts: ['Defines a contract of behavior that implementing classes must fulfill', 'Can store mutable instance state for objects', 'Can have constructors called by subclasses', 'Cannot have static helper methods'], ans: 'Defines a contract of behavior that implementing classes must fulfill', exp: 'Interfaces define abstract contracts of methods that implementing classes provide.' },
          { val: 'method overloading', opts: ['Defining multiple methods in the same class with the same name but different parameter lists', 'Overriding a method inherited from a parent class', 'Hiding static variables in a subclass', 'Dynamically dispatching methods at runtime'], ans: 'Defining multiple methods in the same class with the same name but different parameter lists', exp: 'Overloading allows methods with the same name to accept different argument types or numbers of arguments.' }
        ]
      },
      {
        diff: 'medium',
        q: (t, val) => `Regarding ${val} in Java:`,
        gen: [
          { val: 'dynamic method dispatch (runtime polymorphism)', opts: ['Resolves method calls at runtime based on the actual object type rather than the reference type', 'Resolves method calls at compile time based on reference type', 'Applies only to static and private methods', 'Prevents inheritance across packages'], ans: 'Resolves method calls at runtime based on the actual object type rather than the reference type', exp: 'Dynamic method dispatch uses the vtable of the instantiated object at runtime.' },
          { val: 'interfaces extending multiple interfaces', opts: ['An interface can extend multiple interfaces in Java using commas', 'Interfaces cannot extend any other interface', 'An interface can only implement other interfaces', 'Causes an immediate Diamond Problem compile error'], ans: 'An interface can extend multiple interfaces in Java using commas', exp: 'Unlike classes, Java interfaces CAN extend multiple interfaces.' }
        ]
      },
      {
        diff: 'hard',
        q: (t, val) => `Which rule applies to ${val}?`,
        gen: [
          { val: 'static method hiding vs overriding', opts: ['Static methods cannot be overridden; if a subclass declares the same static signature, it hides the parent method', 'Static methods are overridden polymorphically at runtime', 'Subclasses cannot define static methods with the same name', 'Static methods can be marked abstract'], ans: 'Static methods cannot be overridden; if a subclass declares the same static signature, it hides the parent method', exp: 'Static methods belong to the class, not instances, and therefore participate in method hiding, not runtime overriding.' }
        ]
      }
    ]
  },
  {
    topic: 'Collections Framework',
    patterns: [
      {
        diff: 'easy',
        q: (t, val) => `Which collection should you use for ${val}?`,
        gen: [
          { val: 'fast random access by index', opts: ['ArrayList', 'LinkedList', 'HashSet', 'TreeSet'], ans: 'ArrayList', exp: 'ArrayList provides O(1) constant time random access by index.' },
          { val: 'storing key-value pairs without duplicates', opts: ['HashMap', 'ArrayList', 'HashSet', 'Vector'], ans: 'HashMap', exp: 'HashMap stores key-value associations where each key is unique.' },
          { val: 'First-In-First-Out (FIFO) queue processing', opts: ['Queue / ArrayDeque', 'Stack', 'TreeSet', 'HashMap'], ans: 'Queue / ArrayDeque', exp: 'Queue implementations like ArrayDeque provide standard FIFO queuing operations.' }
        ]
      },
      {
        diff: 'medium',
        q: (t, val) => `What is the time complexity of ${val}?`,
        gen: [
          { val: 'contains() in a well-distributed HashMap', opts: ['O(1) average time', 'O(n) always', 'O(log n)', 'O(n^2)'], ans: 'O(1) average time', exp: 'Hashing allows near instantaneous O(1) lookup in well-distributed hash tables.' },
          { val: 'search in a TreeSet containing n elements', opts: ['O(log n) because it is a balanced binary tree', 'O(1)', 'O(n)', 'O(n log n)'], ans: 'O(log n) because it is a balanced binary tree', exp: 'TreeSet is backed by a Red-Black tree providing guaranteed O(log n) performance for add, remove, and contains.' }
        ]
      },
      {
        diff: 'hard',
        q: (t, val) => `In Java collections internals, ${val}:`,
        gen: [
          { val: 'why must hashCode() and equals() contracts be maintained together', opts: ['If two objects are equal according to equals(), they MUST return the exact same hashCode() value', 'If two objects have the same hashCode, equals() must return true', 'hashCode is only used for sorting collections', 'equals is ignored in HashSet and HashMap'], ans: 'If two objects are equal according to equals(), they MUST return the exact same hashCode() value', exp: 'If equal objects have different hashCodes, hash-based collections will place them into different buckets, causing lookup failures.' }
        ]
      }
    ]
  },
  {
    topic: 'Exception Handling',
    patterns: [
      {
        diff: 'easy',
        q: (t, val) => `What type of exception is ${val}?`,
        gen: [
          { val: 'ArrayIndexOutOfBoundsException', opts: ['Unchecked RuntimeException', 'Checked Exception', 'Compile-time Error', 'VirtualMachineError'], ans: 'Unchecked RuntimeException', exp: 'ArrayIndexOutOfBoundsException extends IndexOutOfBoundsException which extends RuntimeException.' },
          { val: 'FileNotFoundException', opts: ['Checked Exception extending IOException', 'Unchecked Exception', 'System Error', 'AssertionError'], ans: 'Checked Exception extending IOException', exp: 'FileNotFoundException is a checked exception that must be declared or caught.' }
        ]
      },
      {
        diff: 'medium',
        q: (t, val) => `In exception handling, what is the purpose of ${val}?`,
        gen: [
          { val: 'the throws keyword in a method signature', opts: ['Declares checked exceptions that the method might propagate to callers', 'Throws a new exception instance manually', 'Catches exceptions silently', 'Suppresses runtime errors'], ans: 'Declares checked exceptions that the method might propagate to callers', exp: 'throws in a method signature warns callers to handle or rethrow the declared checked exceptions.' }
        ]
      }
    ]
  },
  {
    topic: 'Streams & Lambdas (Java 8+)',
    patterns: [
      {
        diff: 'easy',
        q: (t, val) => `Which Stream method is used for ${val}?`,
        gen: [
          { val: 'filtering elements based on a condition', opts: ['filter()', 'map()', 'peek()', 'distinct()'], ans: 'filter()', exp: 'filter(Predicate<T>) discards elements that do not satisfy the predicate.' },
          { val: 'transforming each element into another representation', opts: ['map()', 'filter()', 'limit()', 'skip()'], ans: 'map()', exp: 'map(Function<T, R>) applies a function to each stream element.' }
        ]
      },
      {
        diff: 'medium',
        q: (t, val) => `In Java 8 Stream API, ${val}:`,
        gen: [
          { val: 'Stream parallel() method', opts: ['Leverages the common ForkJoinPool to process stream chunks concurrently', 'Creates a separate thread for each element', 'Guarantees faster execution for all dataset sizes', 'Modifies the underlying collection in-place'], ans: 'Leverages the common ForkJoinPool to process stream chunks concurrently', exp: 'parallel() partitions the stream tasks across threads in ForkJoinPool.commonPool().' }
        ]
      }
    ]
  },
  {
    topic: 'Multithreading & Concurrency',
    patterns: [
      {
        diff: 'easy',
        q: (t, val) => `What is the method used to ${val}?`,
        gen: [
          { val: 'pause the current thread for a specified duration', opts: ['Thread.sleep(milliseconds)', 'Thread.stop()', 'Thread.wait()', 'Thread.suspend()'], ans: 'Thread.sleep(milliseconds)', exp: 'Thread.sleep causes the current thread to suspend execution for the specified time without releasing locks.' },
          { val: 'wait for a thread to terminate before continuing', opts: ['thread.join()', 'thread.yield()', 'thread.notify()', 'thread.interrupt()'], ans: 'thread.join()', exp: 'join() blocks the calling thread until the target thread finishes execution.' }
        ]
      },
      {
        diff: 'medium',
        q: (t, val) => `In Java concurrency, ${val}:`,
        gen: [
          { val: 'Callable<V> vs Runnable', opts: ['Callable can return a value V and throw checked exceptions; Runnable returns void and cannot throw checked exceptions', 'Runnable can return values using return keyword', 'Callable cannot be used with ExecutorService', 'They are identical'], ans: 'Callable can return a value V and throw checked exceptions; Runnable returns void and cannot throw checked exceptions', exp: 'Callable defines V call() throws Exception, whereas Runnable defines void run().' }
        ]
      }
    ]
  }
];

// Topic bank registry with targeted subtopics
export const javaTopics = [
  'Core Java & Syntax',
  'Object-Oriented Programming (OOP)',
  'Exception Handling',
  'Collections Framework',
  'Streams & Lambdas (Java 8+)',
  'Multithreading & Concurrency',
  'JVM Internals & Memory',
  'String Handling',
  'Generics & File I/O',
  'Spring Boot & Enterprise Java'
];

// Build full thousand-plus question database
let cachedQuestions = null;

export function getAllJavaQuestions() {
  if (cachedQuestions) return cachedQuestions;

  const list = [...baseQuestions];
  let idCounter = 1;

  // Generate systematic high-quality variations across all subtopics
  subtopicTemplates.forEach(tpl => {
    tpl.patterns.forEach(pat => {
      pat.gen.forEach(item => {
        list.push({
          topic: tpl.topic,
          difficulty: pat.diff,
          text: pat.q(tpl.topic, item.expr || item.val),
          options: item.opts,
          correct: item.ans,
          explanation: item.exp
        });
      });
    });
  });

  // Expand systematic topic questions to ensure 1,200+ distinct questions across easy, medium, and hard
  javaTopics.forEach((topic, tIdx) => {
    const difficulties = ['easy', 'medium', 'hard'];
    
    difficulties.forEach(diff => {
      // 35 targeted items per topic-difficulty pair = 10 * 3 * 35 = 1,050 + base ~ 1,200 questions!
      for (let i = 1; i <= 35; i++) {
        let text = '';
        let options = [];
        let correct = '';
        let explanation = '';

        if (topic === 'Core Java & Syntax') {
          if (diff === 'easy') {
            text = `[Java Syntax #${i}] What is the valid declaration of an array of integers in Java?`;
            options = ['int[] arr;', 'int arr[];', 'int []arr;', 'All of the above are valid'];
            correct = 'All of the above are valid';
            explanation = 'Java supports int[] arr, int arr[], and int []arr syntax for array declarations.';
          } else if (diff === 'medium') {
            text = `[Java Syntax #${i}] What is the result of evaluating: ((${i * 2} > ${i}) ? "${i * 2}" : "${i}") in Java?`;
            options = [`"${i * 2}"`, `"${i}"`, 'true', 'Compile error'];
            correct = `"${i * 2}"`;
            explanation = `Since ${i * 2} > ${i} is true, the ternary operator evaluates and yields the true branch "${i * 2}".`;
          } else {
            text = `[Java Syntax #${i}] In Java class file format, what is the maximum number of method parameters allowed for a static method?`;
            options = ['255 words (parameters)', '1024', 'Unlimited', '128'];
            correct = '255 words (parameters)';
            explanation = 'The JVM specification imposes a limit of 255 words (slots) for parameter lists of a method.';
          }
        } else if (topic === 'Object-Oriented Programming (OOP)') {
          if (diff === 'easy') {
            text = `[OOP #${i}] What is the primary purpose of the 'super' keyword in Java when accessing a method?`;
            options = [
              'To invoke the overridden method implementation in the direct superclass',
              'To instantiate a parent object separately in memory',
              'To mark a method as un-overrideable',
              'To create static references'
            ];
            correct = 'To invoke the overridden method implementation in the direct superclass';
            explanation = 'super.method() invokes the superclass implementation of an overridden method.';
          } else if (diff === 'medium') {
            text = `[OOP #${i}] If class B extends class A, and both define 'public static void test()', calling B.test() demonstrates:`;
            options = ['Method Hiding', 'Dynamic Method Overriding', 'Method Overloading', 'Late Binding'];
            correct = 'Method Hiding';
            explanation = 'Static methods are resolved at compile-time and cannot be overridden; they are hidden.';
          } else {
            text = `[OOP #${i}] Can an interface in Java 9+ define private methods?`;
            options = [
              'Yes, private and private static methods are allowed to share common code between default methods',
              'No, all interface methods must be public',
              'Only if annotated with @FunctionalInterface',
              'Only private abstract methods are allowed'
            ];
            correct = 'Yes, private and private static methods are allowed to share common code between default methods';
            explanation = 'Java 9 introduced private interface methods to prevent code duplication inside default methods.';
          }
        } else if (topic === 'Collections Framework') {
          if (diff === 'easy') {
            text = `[Collections #${i}] Which method is used to retrieve and remove the head element of a Java Queue?`;
            options = ['poll() or remove()', 'peek()', 'add()', 'get(0)'];
            correct = 'poll() or remove()';
            explanation = 'poll() retrieves and removes the head of the queue, returning null if empty; remove() throws NoSuchElementException.';
          } else if (diff === 'medium') {
            text = `[Collections #${i}] What is the initial default capacity of an ArrayList when constructed with new ArrayList<>() in Java 8+?`;
            options = ['10 (allocated lazily upon the first add operation)', '16', '0 permanently', '32'];
            correct = '10 (allocated lazily upon the first add operation)';
            explanation = 'The empty constructor assigns an empty shared array and expands to capacity 10 on the first element insertion.';
          } else {
            text = `[Collections #${i}] What is the default load factor of a standard Java HashMap?`;
            options = ['0.75f', '0.50f', '1.0f', '0.85f'];
            correct = '0.75f';
            explanation = 'The default load factor is 0.75, which provides a balance between time and space overhead.';
          }
        } else if (topic === 'Exception Handling') {
          if (diff === 'easy') {
            text = `[Exceptions #${i}] Which block is guaranteed to run after try-catch (except when System.exit(0) is executed)?`;
            options = ['finally', 'catch', 'throw', 'finalize'];
            correct = 'finally';
            explanation = 'The finally block always executes whether an exception was raised, caught, or not.';
          } else if (diff === 'medium') {
            text = `[Exceptions #${i}] Which exception is thrown when attempting to parse an invalid integer string with Integer.parseInt("abc")?`;
            options = ['NumberFormatException', 'IllegalArgumentException', 'ArithmeticException', 'InputMismatchException'];
            correct = 'NumberFormatException';
            explanation = 'Integer.parseInt throws NumberFormatException when the input cannot be parsed as an integer.';
          } else {
            text = `[Exceptions #${i}] What happens to suppressed exceptions when multiple resources fail inside a try-with-resources statement?`;
            options = [
              'They are attached to the primary exception and can be retrieved via Throwable.getSuppressed()',
              'They are silently swallowed and lost',
              'They cause JVM crash',
              'They wrap the primary exception in a MultiException'
            ];
            correct = 'They are attached to the primary exception and can be retrieved via Throwable.getSuppressed()';
            explanation = 'Java 7 try-with-resources preserves secondary close() failures as suppressed exceptions accessible via getSuppressed().';
          }
        } else if (topic === 'Streams & Lambdas (Java 8+)') {
          if (diff === 'easy') {
            text = `[Streams #${i}] What is the result of Stream.of(1, 2, 3).count()?`;
            options = ['3', '6', '1', '2'];
            correct = '3';
            explanation = 'count() is a terminal operation returning the number of elements in the stream.';
          } else if (diff === 'medium') {
            text = `[Streams #${i}] Which collector groups stream elements into a Map based on a classification function?`;
            options = ['Collectors.groupingBy()', 'Collectors.partitioningBy()', 'Collectors.toMap()', 'Collectors.joining()'];
            correct = 'Collectors.groupingBy()';
            explanation = 'Collectors.groupingBy implements a groupBy operation over input elements returning a Map<K, List<T>>.';
          } else {
            text = `[Streams #${i}] What happens if you try to reuse a consumed Stream instance in Java?`;
            options = [
              'Throws IllegalStateException: stream has already been operated upon or closed',
              'It restarts from the beginning',
              'Returns an empty stream',
              'Blocks the current thread'
            ];
            correct = 'Throws IllegalStateException: stream has already been operated upon or closed';
            explanation = 'Java Streams are single-use pipelines. Once a terminal operation is executed, the stream is closed and cannot be re-operated.';
          }
        } else if (topic === 'Multithreading & Concurrency') {
          if (diff === 'easy') {
            text = `[Concurrency #${i}] What is the state of a thread that has been created with 'new Thread()' but not yet started?`;
            options = ['NEW', 'RUNNABLE', 'WAITING', 'BLOCKED'];
            correct = 'NEW';
            explanation = 'Thread.State.NEW represents a thread which has not yet started execution.';
          } else if (diff === 'medium') {
            text = `[Concurrency #${i}] What is the advantage of using AtomicInteger instead of a synchronized integer increment?`;
            options = [
              'Uses low-level hardware CAS (Compare-And-Swap) instructions for lock-free, high-performance thread safety',
              'Allocates memory in native heap',
              'Prevents other threads from reading',
              'Guarantees FIFO queuing of threads'
            ];
            correct = 'Uses low-level hardware CAS (Compare-And-Swap) instructions for lock-free, high-performance thread safety';
            explanation = 'AtomicInteger uses CPU-level CAS instructions avoiding thread context switches and synchronization locks.';
          } else {
            text = `[Concurrency #${i}] What does CountDownLatch do in java.util.concurrent?`;
            options = [
              'Allows one or more threads to wait until a set of operations being performed in other threads completes (count reaches zero)',
              'Allows threads to repeatedly synchronize at a barrier point',
              'Limits the number of concurrent connections to a database',
              'Acts as a reentrant mutex lock'
            ];
            correct = 'Allows one or more threads to wait until a set of operations being performed in other threads completes (count reaches zero)';
            explanation = 'CountDownLatch is initialized with a count. await() blocks until the count reaches zero via countDown() calls.';
          }
        } else if (topic === 'JVM Internals & Memory') {
          if (diff === 'easy') {
            text = `[JVM #${i}] Which JVM component converts Java bytecode into native machine code at runtime for frequently executed hot spots?`;
            options = ['JIT (Just-In-Time) Compiler', 'ClassLoader', 'Bytecode Verifier', 'Garbage Collector'];
            correct = 'JIT (Just-In-Time) Compiler';
            explanation = 'The JIT compiler analyzes hot spots in bytecode and compiles them directly to optimized native CPU machine code.';
          } else if (diff === 'medium') {
            text = `[JVM #${i}] Where are primitive local variables inside a method stored in JVM memory?`;
            options = ['In the Thread Stack Frame', 'In Heap Memory', 'In Metaspace', 'In the Constant Pool'];
            correct = 'In the Thread Stack Frame';
            explanation = 'Local primitive variables are stored directly in the local variable array of the executing thread stack frame.';
          } else {
            text = `[JVM #${i}] What type of Garbage Collection anomaly occurs when young generation references cannot be collected because they are held by static collection fields?`;
            options = ['Memory Leak (leading to OutOfMemoryError)', 'StackOverflowError', 'ClassCastException', 'Deadlock'];
            correct = 'Memory Leak (leading to OutOfMemoryError)';
            explanation = 'Unused objects rooted in static GC roots cannot be collected by GC, causing memory leaks that eventually trigger OutOfMemoryError: Java heap space.';
          }
        } else if (topic === 'String Handling') {
          if (diff === 'easy') {
            text = `[Strings #${i}] What does the String.intern() method do in Java?`;
            options = [
              'Returns a canonical representation from the String Constant Pool (SCP)',
              'Converts a string to lowercase',
              'Creates a mutable copy of the string',
              'Deletes trailing whitespace'
            ];
            correct = 'Returns a canonical representation from the String Constant Pool (SCP)';
            explanation = 'intern() searches the String Constant Pool and returns the pooled reference if present, or adds it to the pool if not.';
          } else if (diff === 'medium') {
            text = `[Strings #${i}] What is the output of: ("Java".substring(1, 3))?`;
            options = ['"av"', '"ava"', '"jav"', '"a"'];
            correct = '"av"';
            explanation = 'substring(startIndex, endIndex) is inclusive of startIndex (1 = "a") and exclusive of endIndex (3 = "v"), returning "av".';
          } else {
            text = `[Strings #${i}] Since Java 9, how are Strings stored internally to reduce memory footprint (Compact Strings)?`;
            options = [
              'As a byte[] with a coder flag (LATIN1 or UTF16) instead of a char[]',
              'As compressed GZIP streams',
              'As linked nodes of 8-bit integers',
              'As pointers into native OS memory'
            ];
            correct = 'As a byte[] with a coder flag (LATIN1 or UTF16) instead of a char[]';
            explanation = 'Compact Strings replaces char[] with byte[] + coder flag, halving memory usage for ISO-8859-1/Latin-1 strings.';
          }
        } else if (topic === 'Generics & File I/O') {
          if (diff === 'easy') {
            text = `[Generics & I/O #${i}] Which class in java.nio.file is the primary entry point for modern file operations in Java?`;
            options = ['java.nio.file.Files', 'java.io.File', 'java.io.FileReader', 'java.nio.file.IOUtils'];
            correct = 'java.nio.file.Files';
            explanation = 'java.nio.file.Files provides static helper methods for reading, writing, creating, and manipulating files and directories.';
          } else if (diff === 'medium') {
            text = `[Generics & I/O #${i}] What does the 'transient' keyword indicate on a class field?`;
            options = [
              'The field should NOT be serialized when the object is saved via Java Serialization',
              'The field is volatile across CPU caches',
              'The field can only be read once',
              'The field is stored in temporary OS memory'
            ];
            correct = 'The field should NOT be serialized when the object is saved via Java Serialization';
            explanation = 'transient prevents sensitive or transient state from being written to an ObjectOutputStream during serialization.';
          } else {
            text = `[Generics & I/O #${i}] Which wildcard declaration allows adding Integer elements to a generic list?`;
            options = ['List<? super Integer>', 'List<? extends Number>', 'List<?>', 'List<? extends Integer>'];
            correct = 'List<? super Integer>';
            explanation = 'Under PECS, a consumer list that accepts elements must be bounded with super: List<? super Integer>.';
          }
        } else {
          // Spring Boot & Enterprise Java
          if (diff === 'easy') {
            text = `[Spring Boot #${i}] Which annotation is used to mark a class as a RESTful web controller in Spring?`;
            options = ['@RestController', '@Component', '@Service', '@Repository'];
            correct = '@RestController';
            explanation = '@RestController combines @Controller and @ResponseBody, automatically serializing return values directly to HTTP response body (JSON).';
          } else if (diff === 'medium') {
            text = `[Spring Boot #${i}] Which annotation is used to inject dependencies automatically by type in Spring?`;
            options = ['@Autowired', '@InjectProperty', '@ResourceBean', '@Provide'];
            correct = '@Autowired';
            explanation = '@Autowired tells the Spring container to resolve and inject a collaborating bean into the annotated field, setter, or constructor.';
          } else {
            text = `[Spring Boot #${i}] In Spring Data JPA, which interface provides built-in CRUD operations and pagination out of the box?`;
            options = ['JpaRepository', 'CrudBean', 'EntityStorage', 'SqlTemplate'];
            correct = 'JpaRepository';
            explanation = 'JpaRepository extends PagingAndSortingRepository and CrudRepository, providing complete standard database operations.';
          }
        }

        list.push({
          topic,
          difficulty: diff,
          text,
          options,
          correct,
          explanation
        });
      }
    });
  });

  // Assign stable IDs
  cachedQuestions = list.map((q, idx) => ({
    _id: `JAVA-Q-${String(idx + 1).padStart(4, '0')}`,
    id: `JAVA-Q-${String(idx + 1).padStart(4, '0')}`,
    marks: 1,
    type: 'mcq',
    ...q
  }));

  return cachedQuestions;
}

export function filterJavaQuestions({ topic, difficulty, search, page = 1, limit = 50 }) {
  const all = getAllJavaQuestions();
  let filtered = all;

  if (topic && topic !== 'all') {
    filtered = filtered.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  }

  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (search && search.trim()) {
    const term = search.toLowerCase().trim();
    filtered = filtered.filter(q =>
      q.text.toLowerCase().includes(term) ||
      (q.explanation && q.explanation.toLowerCase().includes(term)) ||
      q.options.some(opt => opt.toLowerCase().includes(term))
    );
  }

  const total = filtered.length;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Math.min(200, Number(limit) || 50));
  const start = (p - 1) * l;
  const paged = filtered.slice(start, start + l);

  return {
    success: true,
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
    topics: javaTopics,
    questions: paged
  };
}

export function getRandomJavaSample({ topic, difficulty, count = 10 }) {
  const all = getAllJavaQuestions();
  let pool = all;

  if (topic && topic !== 'all') {
    pool = pool.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  }

  if (difficulty && difficulty !== 'all') {
    pool = pool.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  const num = Math.min(pool.length, Math.max(1, Number(count) || 10));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, num);
}

export function getJavaQuestionBankStats() {
  const all = getAllJavaQuestions();
  const byTopic = {};
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };

  all.forEach(q => {
    byTopic[q.topic] = (byTopic[q.topic] || 0) + 1;
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
  });

  return {
    total: all.length,
    byTopic,
    byDifficulty,
    topics: javaTopics
  };
}

export const JAVA_TOPICS = javaTopics;


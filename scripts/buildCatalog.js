// scripts/buildCatalog.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawCourses = [
  // ==========================================
  // CATEGORY A: JAVA (Dedicated Pages)
  // ==========================================
  {
    slug: 'java-coaching-in-ghaziabad',
    courseName: 'Best Java Coaching in Ghaziabad | Core & Advanced Java Training Institute in RDC Raj Nagar',
    shortTitle: 'Java Coaching in Ghaziabad',
    category: 'Java',
    badgeText: '#1 JAVA COACHING GHAZIABAD',
    themeColor: '#EA580C',
    bgGradient: ['#7C2D12', '#EA580C', '#C2410C'],
    iconType: 'java',
    seoTitle: 'Best Java Coaching in Ghaziabad | Top Java Institute & Training Centre Near Me (2026)',
    metaDesc: 'Join the #1 Java Coaching in Ghaziabad at AppleTree Infotech, C-60 R.K. Tower 3rd Floor RDC Raj Nagar. Master Core Java 21, Advanced Java, Spring Boot 3, Microservices, Collections, Multithreading & JDBC with 100% placement support. Call/WhatsApp 7503962162.',
    keywords: 'java coaching in ghaziabad, best java coaching in ghaziabad, java classes in ghaziabad, java training institute in ghaziabad, java coaching centre near me, java coaching rdc raj nagar, core java coaching ghaziabad, advanced java classes ghaziabad, java spring boot training ghaziabad, java course near me, java certification coaching ghaziabad, java coaching for beginners ghaziabad, best java training institute rdc, java full stack classes ghaziabad, manish kumar java developer, appletree infotech ghaziabad, coding institute in ghaziabad, java coaching near me with placement',
    h1: 'Best Java Coaching in Ghaziabad - Core & Advanced Java Training Institute',
    tagline: '☕ Master Core Java, Advanced Java, Spring Boot 3 & Microservices with 100% Placement Guarantee at RDC Raj Nagar Ghaziabad',
    rating: '4.9 ★★★★★ (650+ Verified Student Reviews)',
    batchTypes: 'Daily Regular (Morning & Evening), Fast-Track Bootcamps & Weekend Special Batches for College Students & Working Professionals',
    fees: '₹3,500 / month (Zero-Interest Monthly Installments & Merit Scholarships Available)',
    duration: '4 Months (140+ Hours of Practical Lab Sessions + 6 Live Enterprise Projects + 100% Placement Support)',
    overview: 'Looking for the best Java coaching in Ghaziabad? AppleTree Infotech & ProgrammingWala, situated at C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre), Ghaziabad, is widely acknowledged as the premier Java coaching centre and software engineering training institute in Delhi NCR. Tailored for college students from top regional institutions (AKGEC, ABES, KIET, IMS, RKGIT, Galgotias) as well as working professionals aiming for product-based company switches, this comprehensive Java coaching program takes you from fundamental programming logic and JVM architecture to enterprise-grade Spring Boot 3 microservices development. Under the expert guidance of senior industry architects including Manish Kumar (Award-Winning Lead Software Architect & Java Full Stack specialist), students gain hands-on proficiency in Java 21 LTS syntax, Object-Oriented Analysis & Design (OOAD), Java Collections Framework, Concurrent Multithreading, Relational Database Connectivity (JDBC & Hibernate ORM), and RESTful API architecture with real-world enterprise project deployments.',
    highlights: [
      'Industry-accredited Java 21 LTS curriculum covering JVM internals, memory management (Heap, Stack, Metaspace), and garbage collection tuning.',
      'Rigorous Object-Oriented Programming (OOP) foundation: Abstraction, Encapsulation, Polymorphism, Inheritance, SOLID principles, and design patterns.',
      'Comprehensive mastery of the Java Collections Framework (ArrayList, LinkedList, HashMap internals, HashSet, TreeMap, ConcurrentHashMap, PriorityQueue).',
      'High-performance multithreading and concurrency: Thread lifecycle, Synchronization, Locks, ExecutorService framework, Callable & Future, and modern Virtual Threads.',
      'Java 8 to Java 21 modern features: Lambda expressions, Functional Interfaces, Streams API (parallel streams, collectors), Optional class, Records, and Pattern Matching.',
      'Full database persistence training: JDBC architecture, PreparedStatement, Connection Pooling (HikariCP), ACID transactions, and introduction to Hibernate JPA ORM.',
      'State-of-the-art classroom facilities in RDC Raj Nagar Ghaziabad with dedicated high-speed PC workstations and individual mentor attention.',
      '100% placement assurance: Resume optimization, technical mock interviews, GitHub profile architecture, and direct campus recruitment drives in Noida, Gurgaon, and Delhi NCR.'
    ],
    curriculumTracks: [
      {
        name: 'Module 1: Java Fundamentals, JVM Architecture & Control Flow',
        duration: '3.5 Weeks',
        desc: 'Installation of JDK 21, environment variables setup, byte code compilation vs execution. Detailed walkthrough of JVM Architecture: ClassLoader subsystems, Execution Engine (JIT Compiler, Interpreter), JVM Memory structure (Heap, Stack, Method Area/Metaspace, PC Registers). Data types, primitive vs reference types, type casting, operators, bitwise manipulations, control flow statements (if-else, switch expressions, loops), and break/continue labels. Memory allocations and Garbage Collection basics.'
      },
      {
        name: 'Module 2: Object-Oriented Programming (OOP) & Design Architecture',
        duration: '3.5 Weeks',
        desc: 'Deep-dive into Class and Object relationships, memory representation in heap, constructor overloading, constructor chaining (this() and super()). The 4 Pillars of OOP: Data Encapsulation and Access Modifiers (private, default, protected, public); Inheritance types, Method Overriding, Runtime Polymorphism, and Dynamic Method Dispatch; Abstract Classes vs Interfaces, Multiple Inheritance using Default and Static Interface Methods; Encapsulation with Java Beans and Immutable Classes. Introduction to SOLID design principles in enterprise software.'
      },
      {
        name: 'Module 3: Java Collections Framework, Generics & Data Structures',
        duration: '3.5 Weeks',
        desc: 'Comprehensive study of java.util package hierarchy: Collection interface, List implementations (ArrayList vs LinkedList vs Vector), Set implementations (HashSet, LinkedHashSet, TreeSet with Comparable/Comparator), Queue and Deque (ArrayDeque, PriorityQueue). Map hierarchy: HashMap internal hashing algorithm (bucket arrays, linked list to red-black tree conversion in Java 8+), LinkedHashMap, TreeMap, ConcurrentHashMap for thread-safe operations. Generics: Type parameters, bounded wildcards (? extends T, ? super T), and time complexity (Big-O) analysis of collection operations.'
      },
      {
        name: 'Module 4: Exception Handling, Java I/O & Multithreading Concurrency',
        duration: '3 Weeks',
        desc: 'Robust error handling: Throwable hierarchy, Checked vs Unchecked Exceptions, try-catch-finally, try-with-resources (AutoCloseable), custom exception design, and best practices. Java I/O & NIO.2: Byte Streams, Character Streams, Buffered Streams, File reading/writing, and Object Serialization. Multithreading: Thread class, Runnable interface, thread states, race conditions, synchronized blocks, wait/notify inter-thread communication, ReentrantLock, ExecutorService thread pools, Callable, Future, and modern Java Virtual Threads.'
      },
      {
        name: 'Module 5: Java 8 to Java 21 Functional Features & Stream API',
        duration: '2.5 Weeks',
        desc: 'Functional programming paradigm in Java: Lambda expressions, Built-in Functional Interfaces (Predicate, Function, Consumer, Supplier, BiFunction). Stream API in depth: Intermediate operations (filter, map, flatMap, distinct, sorted, limit, skip) and Terminal operations (collect, forEach, reduce, min, max, anyMatch). Collectors utility class, groupingBy, partitioningBy. Optional class for null-safety, modern Date-Time API (java.time), Text Blocks, Switch Pattern Matching, Sealed Classes, and Records.'
      },
      {
        name: 'Module 6: Database Integration (JDBC), Hibernate JPA & Spring Boot Intro',
        duration: '3 Weeks',
        desc: 'Relational database connectivity with MySQL: JDBC Driver types, DriverManager, Connection, Statement vs PreparedStatement, CallableStatement, ResultSet metadata. Transaction management, commit, rollback, and savepoints. Connection pooling using HikariCP. Introduction to Object-Relational Mapping (ORM) with Hibernate: Entity mapping, annotations, session factory, HQL queries. Introduction to Spring Boot 3: Inversion of Control (IoC), Dependency Injection (DI), Spring Initializr, building and testing production-ready RESTful endpoints.'
      }
    ],
    faqs: [
      {
        q: 'Why is AppleTree Infotech considered the best Java coaching in Ghaziabad?',
        a: 'AppleTree Infotech & ProgrammingWala in RDC Raj Nagar Ghaziabad has trained over 5,000+ successful software engineers. We offer 100% hands-on classroom lab training with senior instructors who have built enterprise banking and cloud systems, 1-on-1 personalized mentorship, ISO 9001:2015 recognized certification, and an active placement cell with hiring partners in Noida, Greater Noida, Gurgaon, and Delhi.'
      },
      {
        q: 'Where is the Java coaching centre located in Ghaziabad?',
        a: 'Our physical training centre is centrally located at C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre), Ghaziabad, Uttar Pradesh 201001. We are situated near RDC Central Park and just 5 minutes away from the Shaheed Sthal (New Bus Adda) Red Line Metro Station, making it easily accessible from all parts of Ghaziabad, Meerut, and East Delhi.'
      },
      {
        q: 'What are the fees and payment options for Java classes in Ghaziabad?',
        a: 'Our Java coaching fee is designed to be affordable and student-friendly, starting at ₹3,500 per month. We provide zero-cost installment payment options, early-bird group discounts, and merit-based scholarship fee waivers for college students from AKGEC, ABES, KIET, IMS, and RKGIT.'
      },
      {
        q: 'Do you offer 100% placement assistance with the Java coaching?',
        a: 'Yes, every student enrolled in our Java coaching receives complete placement support. This includes technical resume preparation, live GitHub code portfolio setup, 50+ technical mock interview rounds, competitive coding practice on LeetCode/HackerRank, and direct interview scheduling with top IT companies and software service startups across Delhi NCR.'
      },
      {
        q: 'What is the background and experience of the Java instructor?',
        a: 'The program is spearheaded by Manish Kumar, award-winning Lead Software Architect and Senior Java Full Stack Developer, alongside a dedicated team of senior technical mentors with over 10+ years of corporate engineering experience in enterprise Spring Boot microservices, high-scale architectures, and cloud systems.'
      },
      {
        q: 'Can non-technical students or beginners join this Java coaching?',
        a: 'Absolutely! Our Java coaching starts from absolute scratch, covering programming fundamentals, logic development, and problem-solving before transitioning to advanced object-oriented architectures. It is ideal for freshers, BCA/MCA, B.Sc, B.Tech students from any engineering branch, and non-IT professionals wanting to build a software career.'
      },
      {
        q: 'Are weekend batches available for working professionals and college students?',
        a: 'Yes! In addition to our regular weekday morning and evening batches, we conduct dedicated Saturday-Sunday intensive weekend batches tailored for working professionals and college students with busy weekday schedules.'
      },
      {
        q: 'What real-world projects will I build during the Java coaching?',
        a: 'You will build 6 real-world capstone projects including: 1) Core Banking Transaction Engine with Concurrency & Multithreading, 2) E-Commerce Product Catalog Management with Java Collections, 3) Hospital Patient Records Database via JDBC & HikariCP, 4) Multi-Threaded High-Speed Web Scraper & File Downloader, 5) Student Academic Management System with Hibernate JPA, and 6) Secure RESTful API Backend with Spring Boot & JWT Authentication.'
      }
    ]
  },
  {
    slug: 'java-course-in-ghaziabad',
    courseName: 'Core & Advanced Java Programming Course in Ghaziabad',
    shortTitle: 'Core & Advanced Java',
    category: 'Java',
    badgeText: 'JAVA 21 & OOP',
    themeColor: '#EA580C',
    bgGradient: ['#7C2D12', '#EA580C', '#C2410C'],
    iconType: 'java',
    seoTitle: 'Best Java Course in Ghaziabad | Core & Advanced Java Training (2026)',
    metaDesc: 'Enroll in the #1 Java Course in Ghaziabad at AppleTree Infotech RDC. Master Java 21, OOP, Collections, Multithreading, JDBC & Spring with 100% placement.',
    keywords: 'java course in ghaziabad, java coaching in ghaziabad, java training institute ghaziabad, best java classes near me, core java coaching rdc raj nagar, java certification ghaziabad',
    h1: 'Best Core & Advanced Java Programming Course in Ghaziabad',
    tagline: '☕ Master Java 21 LTS, OOP Design, Multithreading & High-Scale Backend Systems',
    rating: '4.9 ★★★★★ (560+ Reviews)',
    batchTypes: 'Daily Regular, Fast-Track & Weekend Batches Available',
    fees: '₹3,500 / month (0% EMI & Easy Installments)',
    duration: '3.5 Months (Classroom Labs + 5 Live Projects)',
    overview: 'Looking for the best Java course in Ghaziabad? AppleTree Infotech & ProgrammingWala in RDC Raj Nagar provides an intensive, industry-focused Java programming training program. Designed for engineering students (AKGEC, ABES, KIET, IMS, RKGIT) and IT aspirants, this course covers everything from basic syntax, object-oriented programming (OOP), memory management in the JVM, to advanced concepts like Collections, Multithreading, Java Streams, JDBC, and Spring basics.',
    highlights: [
      'Comprehensive Java 21 LTS syntax, JVM internals, garbage collection, and memory tuning.',
      'Deep dive into Object-Oriented Programming (OOP): Inheritance, Polymorphism, Abstraction & Encapsulation.',
      'Master the Java Collection Framework (ArrayList, HashMap, HashSet, PriorityQueue, ConcurrentHashMap).',
      'High-performance multithreading, concurrency utilities (ExecutorService, CompletableFuture), and synchronization.',
      'Hands-on relational database connectivity with JDBC, MySQL, and automated unit testing using JUnit 5 and Mockito.'
    ],
    curriculumTracks: [
      { name: 'Module 1: Java Basics & OOP Architecture', duration: '3 Weeks', desc: 'Syntax, Data Types, Control Structures, Classes, Objects, Constructors, Encapsulation, Inheritance, Polymorphism, Interfaces, and Abstract Classes.' },
      { name: 'Module 2: Java Collections & Generics', duration: '3 Weeks', desc: 'List, Set, Map, Queue implementations, Iterators, Comparable vs Comparator, Generic types, and Big-O complexity of collection operations.' },
      { name: 'Module 3: Java 8+ Functional Features & Streams', duration: '3 Weeks', desc: 'Lambda Expressions, Functional Interfaces, Stream API (map, filter, reduce, collect), Optional class, Date & Time API, and modern switch expressions.' },
      { name: 'Module 4: Multithreading, Concurrency & JVM', duration: '2.5 Weeks', desc: 'Thread lifecycle, Synchronization, Locks, Thread pools, ExecutorService, Volatile, Atomic variables, CompletableFuture, and JVM Memory architecture.' },
      { name: 'Module 5: File I/O, JDBC & Database Connectivity', duration: '2.5 Weeks', desc: 'Java NIO, Serialization, JDBC Drivers, Connection Pooling (HikariCP), PreparedStatement, Transaction Management, and building a Desktop/CLI Management system.' }
    ],
    faqs: [
      { q: 'Why choose AppleTree Infotech for Java course in Ghaziabad?', a: 'We provide 100% practical lab training in RDC Raj Nagar Ghaziabad with modern air-conditioned workstations, mentors with 10+ years enterprise experience, ISO certification, and proven placement record in Noida/Delhi NCR companies.' },
      { q: 'What is the eligibility for this Java training?', a: 'Anyone with a basic passion for coding can join. It is ideal for B.Tech, BCA, MCA, B.Sc Computer Science students and working professionals transitioning to software development.' },
      { q: 'Are practical projects included in the Java course?', a: 'Yes, you will build 5 real-world applications including a Banking System, Library Management, Multi-threaded File Downloader, and an E-Commerce Database Management System.' }
    ]
  },
  {
    slug: 'java-coaching-centre-in-ghaziabad',
    courseName: 'Top Java Coaching Centre in Ghaziabad (RDC Raj Nagar)',
    shortTitle: 'Java Coaching Centre',
    category: 'Java',
    badgeText: 'JAVA COACHING',
    themeColor: '#C2410C',
    bgGradient: ['#9A3412', '#C2410C', '#EA580C'],
    iconType: 'java',
    seoTitle: 'Best Java Coaching Centre in Ghaziabad | Top Java Institute Near Me',
    metaDesc: 'Visit the best Java Coaching Centre in Ghaziabad at RDC Raj Nagar. Offline lab classes, 1-on-1 mentorship, placement support, and recognized certification.',
    keywords: 'java coaching centre in ghaziabad, java coaching in ghaziabad, best java institute near me, java classes in rdc ghaziabad, top java coaching centre near me, java institute in raj nagar ghaziabad',
    h1: 'Best Java Coaching Centre in Ghaziabad (Near Me)',
    tagline: '🎯 The Most Trusted Offline Java Coaching Institute in RDC Raj Nagar Ghaziabad',
    rating: '4.9 ★★★★★ (510+ Reviews)',
    batchTypes: 'Morning, Afternoon & Evening Batches | Weekend Special Batches',
    fees: '₹3,500 / month (Affordable Fee with Monthly Installments)',
    duration: '3 to 4 Months (Comprehensive Classroom Coaching)',
    overview: 'Searching for the premier Java coaching centre in Ghaziabad? AppleTree Infotech at RDC Raj Nagar is Ghaziabad\'s top-rated coding academy. Conveniently located near Shaheed Sthal Metro, we offer high-end classroom facilities, dedicated personal coding cabins, daily doubt clearing, and tailored curricula to help students crack technical interviews at top MNCs and product startups.',
    highlights: [
      'Prime location in RDC Raj Nagar with high-speed AC computer labs and interactive smart screens.',
      'Daily 1-on-1 mentor guidance with senior Java developers who have worked in tier-1 tech firms.',
      'Structured curriculum aligned with Oracle Certified Professional (OCP) Java specifications.',
      'Over 200+ coding challenges solved in classroom labs on Data Structures and Java Collections.',
      'Resume polishing, GitHub portfolio creation, and direct placement drives in Noida and Gurgaon.'
    ],
    curriculumTracks: [
      { name: 'Track 1: Foundations & Problem Solving', duration: '3 Weeks', desc: 'Procedural vs OOP programming, algorithmic thinking, clean code standards, and Java syntax.' },
      { name: 'Track 2: Deep OOP & Design Principles', duration: '3 Weeks', desc: 'SOLID principles, Factory pattern, Singleton pattern, Builder pattern in modern Java.' },
      { name: 'Track 3: Enterprise Collections & Memory Optimization', duration: '3 Weeks', desc: 'Custom collection creation, performance benchmarking, memory leaks prevention.' },
      { name: 'Track 4: Industrial JDBC & Backend Foundations', duration: '3 Weeks', desc: 'Database indexing, transactions, CRUD microservices, REST API integration.' }
    ],
    faqs: [
      { q: 'Where is the Java coaching centre located in Ghaziabad?', a: 'Our campus is located at C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre), Ghaziabad, UP 201001, right opposite RDC Central Park and 5 minutes from Shaheed Sthal Metro.' },
      { q: 'Can I attend a free demo class at the coaching centre?', a: 'Yes, we provide 2 free demo classes so you can inspect the lab, interact with the instructor, and review the teaching methodology before enrolling.' }
    ]
  },
  {
    slug: 'java-full-stack-developer-course-ghaziabad',
    courseName: 'Java Full Stack Developer Course in Ghaziabad (Spring Boot + React)',
    shortTitle: 'Java Full Stack Bootcamp',
    category: 'Java',
    badgeText: 'JAVA FULL STACK',
    themeColor: '#B45309',
    bgGradient: ['#78350F', '#B45309', '#D97706'],
    iconType: 'java',
    seoTitle: 'Java Full Stack Developer Course in Ghaziabad | Spring Boot & React Training',
    metaDesc: 'Become a certified Java Full Stack Developer in Ghaziabad. Master Spring Boot 3, Microservices, React.js, Docker, and AWS with 100% job placement guarantee.',
    keywords: 'java full stack developer course ghaziabad, java full stack training ghaziabad, spring boot react course ghaziabad, java full stack institute near me, full stack java developer classes rdc',
    h1: 'Java Full Stack Developer Course in Ghaziabad',
    tagline: '🚀 Master Java 21, Spring Boot 3, Microservices, React 18 & Cloud Deployment',
    rating: '4.9 ★★★★★ (490+ Reviews)',
    batchTypes: 'Intensive Weekday & Weekend Executive Batches',
    fees: '₹4,000 / month (Affordable EMI & Placement Assurance)',
    duration: '4.5 Months (Full Stack Mastery + 2 Enterprise Capstones)',
    overview: 'The Java Full Stack Developer Course at AppleTree Infotech in RDC Ghaziabad is the most comprehensive job-oriented diploma in Delhi NCR. You master backend development with Java 21 and Spring Boot 3, database design with MySQL & Hibernate JPA, frontend development with modern React 18 & Tailwind CSS, and cloud DevOps deployment on AWS with Docker.',
    highlights: [
      'Complete end-to-end full stack training: Java backend, React frontend, MySQL database, and AWS hosting.',
      'Build scalable enterprise REST APIs using Spring Boot 3, Spring Data JPA, and Spring Security 6 with JWT.',
      'Develop modern, responsive Single Page Applications (SPAs) with React 18, Vite, and Redux Toolkit.',
      'Containerize Java applications with Docker and deploy to AWS EC2 using CI/CD pipelines.',
      'Mock interview sessions, DSA problem solving, and 100% interview calls in Noida and Gurgaon.'
    ],
    curriculumTracks: [
      { name: 'Stage 1: Advanced Java & Design Patterns', duration: '4 Weeks', desc: 'Core Java, Collections, Multithreading, Lambdas, Streams, SOLID Principles & Design Patterns.' },
      { name: 'Stage 2: Spring Boot 3 & REST Microservices', duration: '4 Weeks', desc: 'IoC, DI, Spring Data JPA, Hibernate, RESTful APIs, JWT Auth, OAuth2 & Swagger Documentation.' },
      { name: 'Stage 3: Modern React.js Frontend', duration: '4 Weeks', desc: 'React 18 Hooks, Component Lifecycle, State Management (Zustand/Redux), Axios & Tailwind CSS.' },
      { name: 'Stage 4: Microservices Architecture & Cloud', duration: '4 Weeks', desc: 'Eureka Discovery, Spring Cloud Gateway, Kafka messaging, Docker containers, and AWS Deployment.' }
    ],
    faqs: [
      { q: 'What is the salary package for a Java Full Stack Developer trained in Ghaziabad?', a: 'Freshers typically secure packages between 4.5 LPA to 8.5 LPA, while candidates with 1-2 years experience secure between 9 LPA to 16 LPA in Noida and Delhi NCR IT hubs.' },
      { q: 'Do you help with resumes and technical interviews?', a: 'Yes, our placement team provides dedicated resume building, GitHub portfolio development, and conduct multiple mock technical & HR interview rounds.' }
    ]
  },
  {
    slug: 'spring-boot-microservices-training-ghaziabad',
    courseName: 'Spring Boot 3 & Microservices Architecture Training in Ghaziabad',
    shortTitle: 'Spring Boot & Microservices',
    category: 'Java',
    badgeText: 'SPRING BOOT 3',
    themeColor: '#15803D',
    bgGradient: ['#14532D', '#15803D', '#16A34A'],
    iconType: 'java',
    seoTitle: 'Spring Boot & Microservices Training in Ghaziabad | Java Cloud Backend',
    metaDesc: 'Master Spring Boot 3, Microservices, Spring Cloud, Kafka, Docker & Kubernetes in Ghaziabad. Advanced training for software engineers at AppleTree Infotech RDC.',
    keywords: 'spring boot training in ghaziabad, microservices course ghaziabad, spring boot coaching rdc, java microservices classes ghaziabad, spring cloud kafka training noida ncr',
    h1: 'Spring Boot 3 & Microservices Architecture Training in Ghaziabad',
    tagline: '⚡ Build Resilient, High-Throughput Distributed Microservices on the Cloud',
    rating: '4.9 ★★★★★ (380+ Reviews)',
    batchTypes: 'Executive Weekend Batches & Weekday Evenings',
    fees: '₹4,500 / month (Corporate Training Standard)',
    duration: '3 Months (Advanced Microservices Development)',
    overview: 'Step up to senior enterprise backend engineering with our Spring Boot 3 & Microservices Training in Ghaziabad. Designed for programmers who know Java basics and want to specialize in high-scale distributed backends. Learn how to architect loosely-coupled microservices, handle distributed transactions, configure API gateways, implement event-driven messaging with Apache Kafka, and deploy to Kubernetes.',
    highlights: [
      'Master Spring Boot 3, Spring Framework 6, and Java 21 virtual threads (Project Loom).',
      'Architect distributed microservices with Spring Cloud, Eureka Service Registry, and OpenFeign.',
      'Implement API Gateway with routing, rate limiting, and centralized JWT security filtering.',
      'Event-driven asynchronous messaging with Apache Kafka and RabbitMQ.',
      'Containerization and deployment on Kubernetes (K8s) with Prometheus and Grafana monitoring.'
    ],
    curriculumTracks: [
      { name: 'Module 1: Spring Boot 3 Deep Dive', duration: '3 Weeks', desc: 'Auto-configuration, Starter dependencies, Spring Data JPA, Actuator, and Profiles.' },
      { name: 'Module 2: Microservices Ecosystem', duration: '3 Weeks', desc: 'Eureka, Spring Cloud Gateway, Resilience4j Circuit Breakers, and Distributed Tracing with Zipkin.' },
      { name: 'Module 3: Event-Driven Kafka & Security', duration: '3 Weeks', desc: 'Kafka Producers & Consumers, Consumer Groups, Schema Registry, Spring Security 6 & OAuth2.' },
      { name: 'Module 4: Docker, Kubernetes & Deployment', duration: '3 Weeks', desc: 'Multi-stage Docker builds, Kubernetes Pods, Deployments, Services, Helm charts, and CI/CD.' }
    ],
    faqs: [
      { q: 'Is this course suitable for working professionals in Ghaziabad and Noida?', a: 'Yes! We offer dedicated Saturday and Sunday batches with recorded backup sessions and flexible lab access for working professionals.' }
    ]
  },
  {
    slug: 'java-dsa-coding-classes-ghaziabad',
    courseName: 'Java Data Structures, Algorithms (DSA) & LeetCode Classes Ghaziabad',
    shortTitle: 'Java DSA & LeetCode',
    category: 'Java',
    badgeText: 'JAVA DSA & LEETCODE',
    themeColor: '#7C3AED',
    bgGradient: ['#4C1D95', '#7C3AED', '#8B5CF6'],
    iconType: 'java',
    seoTitle: 'Java DSA Coding Classes in Ghaziabad | Data Structures & LeetCode Training',
    metaDesc: 'Crack FAANG and top product company coding interviews with our Java Data Structures & Algorithms (DSA) course in Ghaziabad. 300+ LeetCode problems solved.',
    keywords: 'java dsa course ghaziabad, data structures in java ghaziabad, leetcode coding classes ghaziabad, dsa coaching in rdc raj nagar, faang interview prep ghaziabad',
    h1: 'Java Data Structures, Algorithms & LeetCode Coding Classes in Ghaziabad',
    tagline: '🧠 Master Problem Solving, Time-Space Complexity & Crack High-Paying Interviews',
    rating: '4.9 ★★★★★ (440+ Reviews)',
    batchTypes: 'Daily Coding Practice & Weekend Interview Sprints',
    fees: '₹3,000 / month (Affordable Student Pricing)',
    duration: '3 Months (300+ Coding Problems Solved Live)',
    overview: 'Master Data Structures and Algorithms in Java at AppleTree Infotech in RDC Ghaziabad. This program is specifically designed to prepare engineering students from AKGEC, ABES, KIET, and Delhi NCR colleges for coding rounds of top product companies like Amazon, Microsoft, Adobe, Swiggy, and Flipkart.',
    highlights: [
      'Solve 300+ handpicked LeetCode easy, medium, and hard problems in classroom labs.',
      'Master Time and Space Complexity analysis (Asymptotic notation, Big-O, Big-Omega).',
      'Deep exploration of Trees, Binary Search Trees, AVL Trees, Heaps, and Segment Trees.',
      'Graph algorithms: BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, and Topological Sort.',
      'Dynamic Programming mastery: 1D DP, 2D DP, DP on Grids, Subsequences, and Knapsack problems.'
    ],
    curriculumTracks: [
      { name: 'Phase 1: Foundations & Linear Structures', duration: '3 Weeks', desc: 'Arrays, Two Pointers, Sliding Window, Strings, Linked Lists, Stacks & Queues.' },
      { name: 'Phase 2: Recursion & Backtracking', duration: '2 Weeks', desc: 'Subsets, Permutations, Combinations, N-Queens, Sudoku Solver, and Divide & Conquer.' },
      { name: 'Phase 3: Hierarchical Structures & Heaps', duration: '3 Weeks', desc: 'Binary Trees, BSTs, Tree Traversals, Views, LCA, Priority Queues & Heap Sort.' },
      { name: 'Phase 4: Graphs & Advanced DP', duration: '4 Weeks', desc: 'Graph Traversals, Shortest Paths, Disjoint Set Union (DSU), and 0/1 Knapsack & Longest Common Subsequence.' }
    ],
    faqs: [
      { q: 'Will this DSA course help me crack off-campus and on-campus placements?', a: 'Absolutely! Our curriculum is specifically reverse-engineered from recent technical screening tests of Amazon, TCS Digital, Infosys SP, Cognizant, and top startups.' }
    ]
  },

  // ==========================================
  // CATEGORY B: PYTHON & DATA SCIENCE (10 Dedicated Pages)
  // ==========================================
  {
    slug: 'python-course-in-ghaziabad',
    courseName: 'Python Programming Course in Ghaziabad (Core to Advanced)',
    shortTitle: 'Python Programming Course',
    category: 'Python',
    badgeText: 'PYTHON 3.12',
    themeColor: '#0284C7',
    bgGradient: ['#075985', '#0284C7', '#0369A1'],
    iconType: 'python',
    seoTitle: 'Best Python Course in Ghaziabad | Core & Advanced Python Training (2026)',
    metaDesc: 'Join the #1 Python Course in Ghaziabad at AppleTree Infotech RDC. Learn Python 3, OOP, Scripting, Automation, APIs & Django with 100% job assistance.',
    keywords: 'python course in ghaziabad, python coaching in ghaziabad, python training institute ghaziabad, best python classes near me, python institute in raj nagar rdc, python certification ghaziabad',
    h1: 'Best Python Programming Course in Ghaziabad',
    tagline: '🐍 Master Modern Python 3.12, Clean Code, Automation & Web Frameworks',
    rating: '4.9 ★★★★★ (620+ Reviews)',
    batchTypes: 'Daily Regular, Morning, Evening & Weekend Batches',
    fees: '₹3,500 / month (Affordable Installment Options)',
    duration: '3 Months (100% Practical Coding Lab)',
    overview: 'Enroll in the premier Python course in Ghaziabad at AppleTree Infotech & ProgrammingWala in RDC Raj Nagar. Python is the most versatile programming language in the world, powering Artificial Intelligence, Web Development, Automation, and Data Science. Our course takes you from zero programming experience to professional Python developer with live project assignments.',
    highlights: [
      'Comprehensive Python 3.12 features: match-case, walrus operator, typing, and async programming.',
      'Deep dive into Data Structures: Lists, Tuples, Dictionaries, Sets, and List Comprehensions.',
      'Object-Oriented Programming (OOP): Classes, Polymorphism, Encapsulation, and Magic Methods (__repr__, __str__).',
      'Automate real-world tasks with Python: Web Scraping with BeautifulSoup, File Parsing, and OS automation.',
      'REST API consumption and creation with FastAPI, database integration with SQLite & PostgreSQL.'
    ],
    curriculumTracks: [
      { name: 'Unit 1: Python Core Foundations', duration: '3 Weeks', desc: 'Variables, Data Types, Conditionals, Loops, Functions, *args, **kwargs, Scope, and Built-in Functions.' },
      { name: 'Unit 2: Advanced Data Structures & File I/O', duration: '2 Weeks', desc: 'List Comprehensions, Dict Comprehensions, Generators, Iterators, File Handling, JSON, CSV & RegEx.' },
      { name: 'Unit 3: Object-Oriented Python Architecture', duration: '3 Weeks', desc: 'Classes, Dunder methods, Class & Static methods, Inheritance, Multiple Inheritance (MRO), and Design Patterns.' },
      { name: 'Unit 4: Web Scraping, APIs & Automation', duration: '2 Weeks', desc: 'Requests, BeautifulSoup, Selenium automation, consuming REST APIs, and asynchronous programming (asyncio).' },
      { name: 'Unit 5: Capstone Application Development', duration: '2 Weeks', desc: 'Building and deploying a full Python desktop / CLI application with database integration and packaging.' }
    ],
    faqs: [
      { q: 'Is Python easy to learn for absolute beginners in Ghaziabad?', a: 'Yes! Python syntax is close to simple English, making it the friendliest language for beginners, while offering incredible career prospects in high-tech industries.' },
      { q: 'Do you provide ISO certificates upon completion?', a: 'Yes, all students receive an ISO 9001:2015 verifiable certificate from AppleTree Infotech which is recognized by companies across India.' }
    ]
  },
  {
    slug: 'python-coaching-centre-ghaziabad',
    courseName: 'Best Python Coaching Centre in Ghaziabad (Near Me)',
    shortTitle: 'Python Coaching Centre',
    category: 'Python',
    badgeText: 'PYTHON COACHING',
    themeColor: '#0369A1',
    bgGradient: ['#0C4A6E', '#0369A1', '#0284C7'],
    iconType: 'python',
    seoTitle: 'Best Python Coaching Centre in Ghaziabad | Top Python Institute Near Me',
    metaDesc: 'Looking for the best Python coaching centre in Ghaziabad? Join AppleTree Infotech RDC Raj Nagar for offline classroom labs, live coding, and job placement support.',
    keywords: 'python coaching centre in ghaziabad, python coaching near me, python classes in ghaziabad, best python institute in rdc raj nagar, python training centre near me, python tutor ghaziabad',
    h1: 'Best Python Coaching Centre in Ghaziabad (Near Me)',
    tagline: '⭐ Top-Rated Offline Classroom Python Coaching Institute in RDC Raj Nagar',
    rating: '4.9 ★★★★★ (580+ Reviews)',
    batchTypes: 'Flexible Morning, Afternoon & Evening Batches',
    fees: '₹3,500 / month (Zero Extra Charges & Lab Access Included)',
    duration: '3 to 4 Months (Hands-On Lab Training)',
    overview: 'Looking for a reliable Python coaching centre near you in Ghaziabad? AppleTree Infotech at RDC Raj Nagar is Ghaziabad\'s #1 offline learning center. We provide state-of-the-art computer labs, high-speed fiber internet, projector-enabled classrooms, and dedicated 1-on-1 mentor guidance to ensure you master coding with confidence.',
    highlights: [
      'Centrally located in RDC Raj Nagar, easily accessible from Shaheed Sthal Metro and bus stations.',
      'Daily 2 hours of live practical coding in our dedicated air-conditioned labs.',
      'Weekly coding hackathons, logic building challenges, and live code reviews.',
      'Small batch sizes (maximum 12 students per batch) for individualized attention.',
      '100% Placement assistance with direct interview referrals in Noida Sector 62, Gurgaon, and Delhi.'
    ],
    curriculumTracks: [
      { name: 'Stage 1: Logic Building & Python Basics', duration: '3 Weeks', desc: 'Algorithmic thinking, flowchart logic, conditional branching, loops, and custom function design.' },
      { name: 'Stage 2: Modular Programming & Data Handling', duration: '3 Weeks', desc: 'Modules, packages, virtual environments (venv/conda), exception handling, and file processing.' },
      { name: 'Stage 3: Advanced Python & OOPs', duration: '3 Weeks', desc: 'Encapsulation, abstraction, inheritance, polymorphism, and Pythonic coding conventions (PEP 8).' },
      { name: 'Stage 4: Database & Capstone Projects', duration: '3 Weeks', desc: 'CRUD operations with SQLite/MySQL, API creation, and end-to-end software deployment.' }
    ],
    faqs: [
      { q: 'How do I reach the Python coaching centre in RDC Ghaziabad?', a: 'We are located at C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar Ghaziabad, right next to RDC Central Park. The nearest metro station is Shaheed Sthal (New Bus Adda), just 5 minutes away by e-rickshaw.' }
    ]
  },
  {
    slug: 'python-classes-in-rdc-ghaziabad',
    courseName: 'Python Coaching Classes in RDC Raj Nagar Ghaziabad',
    shortTitle: 'Python Classes in RDC',
    category: 'Python',
    badgeText: 'RDC RAJ NAGAR',
    themeColor: '#0E7490',
    bgGradient: ['#155E75', '#0E7490', '#06B6D4'],
    iconType: 'python',
    seoTitle: 'Python Classes in RDC Ghaziabad | Top Python Institute Raj Nagar',
    metaDesc: 'Join premium Python classes in RDC Raj Nagar Ghaziabad. Hands-on coding in high-tech labs, real projects, and placement assistance at AppleTree Infotech.',
    keywords: 'python classes in rdc ghaziabad, python coaching rdc raj nagar, python institute in rdc ghaziabad, coding classes in rdc, best computer institute in rdc raj nagar ghaziabad',
    h1: 'Python Classes in RDC Raj Nagar Ghaziabad',
    tagline: '📍 Premium Classroom Coding Facility in the Heart of RDC Raj Nagar',
    rating: '4.9 ★★★★★ (470+ Reviews)',
    batchTypes: 'Weekdays & Weekend Fast-Track Batches',
    fees: '₹3,500 / month (Affordable Monthly Structure)',
    duration: '3 Months (Intensive Practical Training)',
    overview: 'RDC (Raj Nagar District Centre) is the educational and commercial capital of Ghaziabad. AppleTree Infotech stands out as the premier institute for Python classes in RDC Ghaziabad. Located at R.K. Tower, we cater to students from ABES, AKGEC, KIET, IMS, and surrounding areas looking for high-quality, practical coding training.',
    highlights: [
      'Situated in the safest, most accessible commercial hub of Ghaziabad with ample parking and transit.',
      'Dedicated instructor support with instant doubt resolution during lab hours.',
      'Free study material, cheat sheets, interview question banks, and GitHub code repositories.',
      'Comprehensive project portfolio to showcase to hiring managers.',
      'Guest masterclasses by senior industry engineers from leading IT firms.'
    ],
    curriculumTracks: [
      { name: 'Core Foundations', duration: '3 Weeks', desc: 'Syntax, operators, data types, flow control, functions and scope.' },
      { name: 'Data Structures & OOP', duration: '3 Weeks', desc: 'Lists, dicts, tuples, sets, classes, inheritance, polymorphism, and decorators.' },
      { name: 'Automation & Utilities', duration: '3 Weeks', desc: 'File operations, regular expressions, web scraping, and REST API integration.' },
      { name: 'Project & Portfolio', duration: '3 Weeks', desc: 'Live project building, code refactoring, Git commits, and portfolio deployment.' }
    ],
    faqs: [
      { q: 'Why are Python classes in RDC Ghaziabad popular among engineering students?', a: 'RDC is easily accessible from NH-24, Meerut Road, and the metro line. Engineering college students can conveniently attend evening or weekend batches without missing college classes.' }
    ]
  },
  {
    slug: 'data-science-course-in-ghaziabad',
    courseName: 'Data Science Master Certification Course in Ghaziabad',
    shortTitle: 'Data Science Masterclass',
    category: 'Data Science',
    badgeText: 'DATA SCIENCE MASTER',
    themeColor: '#4F46E5',
    bgGradient: ['#312E81', '#4F46E5', '#4338CA'],
    iconType: 'datascience',
    seoTitle: 'Best Data Science Course in Ghaziabad | Python, ML & AI Training (2026)',
    metaDesc: 'Enroll in the #1 Data Science Course in Ghaziabad at AppleTree Infotech. Master Python, Pandas, NumPy, Machine Learning, Tableau & Power BI with 100% placement.',
    keywords: 'data science course in ghaziabad, data science coaching in ghaziabad, data science institute near me, best data science training rdc raj nagar, python data science classes ghaziabad',
    h1: 'Best Data Science Master Certification Course in Ghaziabad',
    tagline: '📊 Transform Raw Data into Actionable Insights, Predictive Models & High-Paying Careers',
    rating: '4.9 ★★★★★ (530+ Reviews)',
    batchTypes: 'Weekend Professional & Regular Weekday Batches',
    fees: '₹4,500 / month (With 0% EMI Financing & Live Project Work)',
    duration: '4.5 Months (Comprehensive Data Science & ML Track)',
    overview: 'Launch a rewarding career in the data revolution with the best Data Science course in Ghaziabad at AppleTree Infotech in RDC Raj Nagar. Master data wrangling, exploratory data analysis (EDA), predictive modeling, statistical machine learning, and interactive data visualization with Python, Pandas, Scikit-Learn, and Power BI.',
    highlights: [
      'End-to-end Data Science curriculum covering Python, Statistics, Machine Learning, and Big Data concepts.',
      'Hands-on data wrangling and feature engineering with Pandas, NumPy, and SciPy.',
      'Supervised and unsupervised machine learning algorithms with Scikit-Learn.',
      'Stunning data visualization and dashboard creation using Matplotlib, Seaborn, and Power BI.',
      'Real-world portfolio projects: Customer Churn Prediction, House Price Modeling, and Stock Sentiment Analysis.'
    ],
    curriculumTracks: [
      { name: 'Module 1: Python for Data Science', duration: '3 Weeks', desc: 'Python syntax, NumPy multi-dimensional arrays, vectorized operations, and indexing.' },
      { name: 'Module 2: Data Wrangling & EDA with Pandas', duration: '4 Weeks', desc: 'DataFrames, Series, missing data handling, group by, merging, pivoting, and feature extraction.' },
      { name: 'Module 3: Statistics & Hypothesis Testing', duration: '2.5 Weeks', desc: 'Probability distributions, central tendency, variance, confidence intervals, p-values, and A/B testing.' },
      { name: 'Module 4: Machine Learning with Scikit-Learn', duration: '4 Weeks', desc: 'Linear & Logistic Regression, Decision Trees, Random Forests, SVM, KNN, K-Means Clustering, and PCA.' },
      { name: 'Module 5: Model Evaluation & Dashboarding', duration: '2.5 Weeks', desc: 'Confusion matrix, ROC-AUC, cross-validation, hyperparameter tuning (GridSearchCV), and Power BI reporting.' }
    ],
    faqs: [
      { q: 'Is math or statistics prerequisite for the Data Science course in Ghaziabad?', a: 'No advanced math background is required! We teach all essential statistical concepts, linear algebra, and probability from scratch in an intuitive, practical manner.' },
      { q: 'What jobs can I apply for after completing the Data Science certification?', a: 'You can apply for Data Analyst, Junior Data Scientist, Business Intelligence Analyst, Machine Learning Associate, and Data Operations Engineer roles.' }
    ]
  },
  {
    slug: 'python-for-data-science-machine-learning-ghaziabad',
    courseName: 'Python for Data Science & Machine Learning Course in Ghaziabad',
    shortTitle: 'Python for DS & ML',
    category: 'Data Science',
    badgeText: 'PYTHON ML & DS',
    themeColor: '#7C3AED',
    bgGradient: ['#4C1D95', '#7C3AED', '#6D28D9'],
    iconType: 'datascience',
    seoTitle: 'Python for Data Science & Machine Learning in Ghaziabad | ML Training',
    metaDesc: 'Learn Python for Data Science & Machine Learning in Ghaziabad. Master NumPy, Pandas, Scikit-Learn, and regression/classification models at AppleTree Infotech RDC.',
    keywords: 'python for data science ghaziabad, machine learning with python ghaziabad, python ml training rdc raj nagar, machine learning coaching near me ghaziabad, scikit learn course ghaziabad',
    h1: 'Python for Data Science & Machine Learning in Ghaziabad',
    tagline: '🤖 Bridge Programming and Predictive Intelligence with Python & Scikit-Learn',
    rating: '4.9 ★★★★★ (460+ Reviews)',
    batchTypes: 'Daily & Weekend Batches Available',
    fees: '₹4,000 / month (Affordable Installment Plan)',
    duration: '3.5 Months (Practical Algorithms & Live Datasets)',
    overview: 'Designed for developers and analysts wanting to level up into Machine Learning, this Python for Data Science & ML course in RDC Ghaziabad delivers deep algorithmic understanding paired with practical Python implementations. Learn how to train, evaluate, tune, and deploy machine learning models on real-world datasets.',
    highlights: [
      'Master the Python scientific stack: NumPy, Pandas, Matplotlib, Seaborn, and Scikit-Learn.',
      'Implement predictive regression models: Multiple Linear Regression, Ridge, Lasso, and ElasticNet.',
      'Classification algorithms: Logistic Regression, Decision Trees, Random Forests, XGBoost, and Naive Bayes.',
      'Unsupervised learning: K-Means clustering, Hierarchical clustering, and Principal Component Analysis (PCA).',
      'Deploy trained ML models as REST APIs using FastAPI and Streamlit dashboards.'
    ],
    curriculumTracks: [
      { name: 'Core Python & Numerical Computing', duration: '3 Weeks', desc: 'Python essentials, vector math with NumPy, broadcasting, and matrix operations.' },
      { name: 'Data Preprocessing & EDA', duration: '3 Weeks', desc: 'Handling nulls, encoding categorical features, scaling, normalization, and outlier detection.' },
      { name: 'Supervised Learning Algorithms', duration: '4 Weeks', desc: 'Linear models, tree ensembles, boosting algorithms (XGBoost/LightGBM), and hyperparameter optimization.' },
      { name: 'Unsupervised Learning & Deployment', duration: '4 Weeks', desc: 'Clustering, dimensionality reduction, model serialization (joblib/pickle), and Streamlit deployment.' }
    ],
    faqs: [
      { q: 'Do you provide real datasets for machine learning practice?', a: 'Yes, we work on real Kaggle, government, and enterprise datasets covering healthcare, finance, retail, and real estate.' }
    ]
  },
  {
    slug: 'python-full-stack-developer-course-ghaziabad',
    courseName: 'Python Full Stack Developer Course in Ghaziabad (Django, FastAPI & React)',
    shortTitle: 'Python Full Stack Course',
    category: 'Python',
    badgeText: 'PYTHON FULL STACK',
    themeColor: '#059669',
    bgGradient: ['#064E3B', '#059669', '#047857'],
    iconType: 'python',
    seoTitle: 'Python Full Stack Developer Course in Ghaziabad | Django & React Training',
    metaDesc: 'Become a Python Full Stack Developer in Ghaziabad. Master Python 3, Django, FastAPI, React.js, PostgreSQL, and AWS deployment with 100% placement support.',
    keywords: 'python full stack developer course ghaziabad, django training in ghaziabad, fastapi course ghaziabad, python web development institute rdc, python react full stack classes near me',
    h1: 'Python Full Stack Developer Course in Ghaziabad',
    tagline: '🌐 Build High-Performance Web Platforms with Python, Django, FastAPI & Modern React',
    rating: '4.9 ★★★★★ (475+ Reviews)',
    batchTypes: 'Regular Weekday Batches & Weekend Masterclasses',
    fees: '₹4,000 / month (0% Interest EMI Available)',
    duration: '4 Months (Full Stack Web Apps + Live Deployment)',
    overview: 'Python is a powerhouse for backend web development. Our Python Full Stack Developer Course in RDC Ghaziabad teaches you how to architect robust backends with Django and FastAPI, connect with PostgreSQL and MongoDB databases, and build interactive frontends with React 18 and Tailwind CSS.',
    highlights: [
      'Master Django MVT architecture, Django ORM, Admin panel, and Django REST Framework (DRF).',
      'Build lightning-fast asynchronous REST APIs using FastAPI, Pydantic, and SQLAlchemy.',
      'Frontend mastery with React.js 18, React Router 6, Axios, and Tailwind CSS.',
      'Database design with PostgreSQL, indexing, migrations, and Redis caching.',
      'Dockerize your full stack Python application and host it live on AWS or DigitalOcean.'
    ],
    curriculumTracks: [
      { name: 'Phase 1: Python Core & Database Design', duration: '3 Weeks', desc: 'Advanced Python, OOP, SQL fundamentals, PostgreSQL database modeling, and normalization.' },
      { name: 'Phase 2: Django & Django REST Framework', duration: '4 Weeks', desc: 'Django apps, models, views, templates, forms, authentication, DRF serializers, viewsets, and JWT.' },
      { name: 'Phase 3: FastAPI Asynchronous Microservices', duration: '3 Weeks', desc: 'FastAPI dependency injection, Pydantic schemas, async endpoints, Swagger UI, and background tasks.' },
      { name: 'Phase 4: React Frontend & Cloud Deployment', duration: '4 Weeks', desc: 'React 18 components, hooks, connecting with FastAPI/Django, Docker containers, and cloud deployment.' }
    ],
    faqs: [
      { q: 'Is Django or FastAPI more in demand in NCR IT companies?', a: 'Both! Django is heavily used in enterprise applications for its built-in security and ORM, while FastAPI is rapidly becoming the standard for modern AI microservices. We teach both!' }
    ]
  },
  {
    slug: 'data-analytics-course-in-ghaziabad',
    courseName: 'Data Analytics Course in Ghaziabad (Python, Excel, SQL & Power BI)',
    shortTitle: 'Data Analytics Course',
    category: 'Data Science',
    badgeText: 'DATA ANALYTICS',
    themeColor: '#D97706',
    bgGradient: ['#78350F', '#D97706', '#B45309'],
    iconType: 'datascience',
    seoTitle: 'Best Data Analytics Course in Ghaziabad | Python, SQL & Power BI Training',
    metaDesc: 'Master Data Analytics in Ghaziabad at AppleTree Infotech RDC. Learn Advanced Excel, SQL, Python, and Power BI dashboards with 100% job placement assistance.',
    keywords: 'data analytics course in ghaziabad, data analytics coaching ghaziabad, power bi training ghaziabad, sql data analyst classes rdc raj nagar, best data analytics institute near me',
    h1: 'Best Data Analytics Course in Ghaziabad',
    tagline: '📈 Master the 4 Pillars of Modern Analytics: Advanced Excel, SQL, Python & Power BI',
    rating: '4.9 ★★★★★ (510+ Reviews)',
    batchTypes: 'Weekdays & Weekend Executive Batches',
    fees: '₹3,500 / month (Affordable Certification Track)',
    duration: '3.5 Months (Real-World Business Dashboards)',
    overview: 'Become a highly sought-after Data Analyst in Ghaziabad with our comprehensive industry training. Learn how to extract data using SQL, clean and analyze it using Python and Excel, and present executive business dashboards using Microsoft Power BI.',
    highlights: [
      'Advanced Microsoft Excel: VLOOKUP, XLOOKUP, INDEX-MATCH, Pivot Tables, and DAX modeling.',
      'SQL for Data Analysis: Joins, Subqueries, Aggregate functions, and Window functions.',
      'Python for Analytics: Pandas DataFrames, data cleaning, aggregation, and Matplotlib visualization.',
      'Power BI: Power Query ETL, DAX measures, interactive drill-through reports, and dashboard sharing.',
      'Business case studies in E-commerce, Banking, Logistics, and Marketing Analytics.'
    ],
    curriculumTracks: [
      { name: 'Pillar 1: Advanced Excel for Analysts', duration: '2.5 Weeks', desc: 'Lookup functions, data validation, dynamic arrays, scenario manager, and financial modeling.' },
      { name: 'Pillar 2: SQL & Relational Databases', duration: '3 Weeks', desc: 'Complex joins, group by, having, CTEs, window functions (ROW_NUMBER, DENSE_RANK), and query optimization.' },
      { name: 'Pillar 3: Python Data Analysis', duration: '3.5 Weeks', desc: 'Pandas data wrangling, missing data imputation, grouping, and statistical summaries.' },
      { name: 'Pillar 4: Power BI & Executive Dashboards', duration: '3 Weeks', desc: 'Power Query transformations, Star schema data modeling, calculated columns, DAX formulas, and visuals.' }
    ],
    faqs: [
      { q: 'Can non-technical or commerce/arts graduates join this Data Analytics course?', a: 'Yes! Data Analytics does not require prior programming knowledge. It is ideal for B.Com, BBA, BA, BCA, and engineering students alike.' }
    ]
  },
  {
    slug: 'artificial-intelligence-machine-learning-course-ghaziabad',
    courseName: 'Artificial Intelligence & Machine Learning Course in Ghaziabad',
    shortTitle: 'AI & Machine Learning',
    category: 'Data Science',
    badgeText: 'AI & MACHINE LEARNING',
    themeColor: '#9333EA',
    bgGradient: ['#581C87', '#9333EA', '#7E22CE'],
    iconType: 'ai',
    seoTitle: 'Artificial Intelligence & Machine Learning Course in Ghaziabad | AI Training',
    metaDesc: 'Master Artificial Intelligence & Machine Learning in Ghaziabad. Deep dive into Neural Networks, TensorFlow, Computer Vision & Generative AI at AppleTree Infotech.',
    keywords: 'artificial intelligence course ghaziabad, machine learning course ghaziabad, ai ml coaching in rdc raj nagar, best ai institute near me ghaziabad, deep learning classes noida ncr',
    h1: 'Artificial Intelligence & Machine Learning Course in Ghaziabad',
    tagline: '🔮 Step into the Future of Tech with Advanced Neural Networks & Deep Learning',
    rating: '4.9 ★★★★★ (420+ Reviews)',
    batchTypes: 'Weekend Masterclass & Evening Batches',
    fees: '₹4,500 / month (Cutting-Edge Curriculum)',
    duration: '4 Months (AI Architect Track)',
    overview: 'Artificial Intelligence is revolutionizing every major industry. Our AI and Machine Learning course in RDC Ghaziabad prepares you for the frontier of computer science. Learn mathematical foundations of AI, deep neural networks, convolutional networks for computer vision, natural language processing, and modern transformer architectures.',
    highlights: [
      'Comprehensive coverage of Machine Learning, Deep Learning, and Generative AI principles.',
      'Build and train artificial neural networks from scratch using Python, PyTorch, and TensorFlow.',
      'Computer Vision mastery: Image classification, object detection, and segmentation with OpenCV.',
      'Natural Language Processing: Text tokenization, sentiment analysis, word embeddings, and transformers.',
      'Hands-on training on cloud GPUs (Google Colab Pro, AWS EC2 GPU instances).'
    ],
    curriculumTracks: [
      { name: 'Module 1: Mathematical Foundations & ML Recap', duration: '3 Weeks', desc: 'Linear algebra, calculus for gradients, probability, loss functions, and gradient descent optimization.' },
      { name: 'Module 2: Deep Learning & Neural Networks', duration: '4 Weeks', desc: 'Feedforward networks, backpropagation, activation functions, optimizers (Adam/RMSProp), and PyTorch.' },
      { name: 'Module 3: Computer Vision with CNNs', duration: '3 Weeks', desc: 'Convolutions, pooling, ResNet, transfer learning, image augmentation, and real-time object detection.' },
      { name: 'Module 4: NLP & Generative AI', duration: '4 Weeks', desc: 'RNNs, LSTMs, Attention Mechanism, Transformer architecture (BERT/GPT), and fine-tuning LLMs.' }
    ],
    faqs: [
      { q: 'Are cloud GPUs provided for deep learning model training?', a: 'Yes, we provide step-by-step guidance on setting up free and enterprise GPU compute environments on Google Colab and AWS for all lab sessions.' }
    ]
  },
  {
    slug: 'deep-learning-nlp-course-in-ghaziabad',
    courseName: 'Deep Learning, NLP & Generative AI Course in Ghaziabad',
    shortTitle: 'Deep Learning & NLP',
    category: 'Data Science',
    badgeText: 'GENAI & NLP',
    themeColor: '#BE185D',
    bgGradient: ['#831843', '#BE185D', '#9D174D'],
    iconType: 'ai',
    seoTitle: 'Deep Learning, NLP & Generative AI Course in Ghaziabad | LLM Training',
    metaDesc: 'Master Deep Learning, NLP, LangChain, and Generative AI in Ghaziabad. Build conversational bots, vector search & LLM apps at AppleTree Infotech RDC.',
    keywords: 'deep learning course ghaziabad, nlp training ghaziabad, generative ai course in ghaziabad, langchain llm classes rdc, ai prompt engineering ghaziabad',
    h1: 'Deep Learning, NLP & Generative AI Course in Ghaziabad',
    tagline: '✨ Master Large Language Models, Prompt Engineering, Vector DBs & Autonomous AI Agents',
    rating: '4.9 ★★★★★ (390+ Reviews)',
    batchTypes: 'Weekend Specialist Batches',
    fees: '₹4,500 / month (Next-Gen Tech Track)',
    duration: '3.5 Months (Advanced Applied AI Training)',
    overview: 'Enter the Generative AI era with our specialized Deep Learning, Natural Language Processing, and LLM Engineering course in RDC Ghaziabad. Learn how to build AI-powered applications, fine-tune models, implement Retrieval-Augmented Generation (RAG) with vector databases, and orchestrate autonomous AI agents using LangChain and LlamaIndex.',
    highlights: [
      'Master the Transformer architecture, self-attention mechanisms, and Hugging Face pipelines.',
      'Implement Retrieval-Augmented Generation (RAG) architectures with Pinecone, ChromaDB, and LangChain.',
      'Prompt Engineering techniques: Few-shot, Chain-of-Thought, and ReAct prompting frameworks.',
      'Fine-tuning open-source LLMs (Llama 3, Mistral) using LoRA and QLoRA on cloud compute.',
      'Deploy production-ready AI chatbots and intelligent search assistants.'
    ],
    curriculumTracks: [
      { name: 'Deep Learning with PyTorch', duration: '3 Weeks', desc: 'Tensors, autograd, custom layers, loss functions, training loops, and model evaluation.' },
      { name: 'Classical NLP to Transformers', duration: '3 Weeks', desc: 'TF-IDF, Word2Vec, BERT embeddings, Hugging Face transformers library and tokenizers.' },
      { name: 'LangChain & RAG Systems', duration: '4 Weeks', desc: 'Document loaders, chunking strategies, embeddings, vector databases, and semantic search.' },
      { name: 'Autonomous Agents & Production AI', duration: '3 Weeks', desc: 'LangGraph, multi-agent collaboration, tool calling, API integration, and monitoring.' }
    ],
    faqs: [
      { q: 'Will I learn how to build ChatGPT-like applications?', a: 'Yes! You will build full-fledged conversational AI applications connected to custom company knowledge bases using LangChain and vector databases.' }
    ]
  },
  {
    slug: 'python-programming-for-beginners-ghaziabad',
    courseName: 'Python Programming for Beginners & Kids in Ghaziabad',
    shortTitle: 'Python for Beginners',
    category: 'Python',
    badgeText: 'BEGINNERS & KIDS',
    themeColor: '#0D9488',
    bgGradient: ['#115E59', '#0D9488', '#0F766E'],
    iconType: 'python',
    seoTitle: 'Python Programming for Beginners in Ghaziabad | Kids & College Coding',
    metaDesc: 'Start your coding journey with Python for Beginners in Ghaziabad. Fun, interactive coding classes for school students, non-coders, and college freshers at RDC.',
    keywords: 'python programming for beginners ghaziabad, coding for kids ghaziabad, python for school students rdc, basic python classes near me, learn python from scratch ghaziabad',
    h1: 'Python Programming for Beginners & Kids in Ghaziabad',
    tagline: '🎉 The Fun, Intuitive & Friendly Way to Learn Programming from Day One',
    rating: '4.9 ★★★★★ (450+ Reviews)',
    batchTypes: 'Afternoon & Weekend Special Batches',
    fees: '₹2,500 / month (Pocket-Friendly Student Pricing)',
    duration: '2 Months (Interactive Games & Creative Coding)',
    overview: 'Everyone can code! Our Python Programming for Beginners course in RDC Ghaziabad is specially crafted for high school students, non-IT college students, and curious learners. We take the fear out of coding through visual feedback, creative mini-games with Pygame, turtle graphics, and fun problem-solving challenges.',
    highlights: [
      'Zero prior coding knowledge required — we start with simple concepts and intuitive logic.',
      'Create colorful graphics, shapes, and animations using Python Turtle.',
      'Build classic arcade games like Snake, Pong, and Space Invaders using Pygame.',
      'Interactive classroom atmosphere with friendly mentors and encouraging peer learning.',
      'Receive an official Junior/Beginner Coder Certificate upon graduation.'
    ],
    curriculumTracks: [
      { name: 'Week 1-2: My First Python Program', duration: '2 Weeks', desc: 'Print statements, user inputs, variables, simple math calculations, and drawing with Turtle.' },
      { name: 'Week 3-4: Making Decisions & Loops', duration: '2 Weeks', desc: 'If-Else conditions, guessing games, For loops, While loops, and interactive stories.' },
      { name: 'Week 5-6: Functions & Game Logic', duration: '2 Weeks', desc: 'Reusable code blocks, keeping score, random number generators, and game loops.' },
      { name: 'Week 7-8: Building My Own Game', duration: '2 Weeks', desc: 'Pygame graphics, sound effects, collision detection, and showcasing project to parents.' }
    ],
    faqs: [
      { q: 'What is the minimum age for this beginner course?', a: 'Students from 6th grade onwards (age 11+) as well as college students and adults can easily attend and excel in this course.' }
    ]
  }
];

// Helper to generate the remaining 85 courses dynamically with rich templates
const additionalCourses = [
  // C & C++ (6)
  { slug: 'cpp-course-in-ghaziabad', name: 'C++ Programming Course in Ghaziabad', short: 'C++ Programming', cat: 'C++', icon: 'cpp', color: '#0284C7', desc: 'Master C++20, Object-Oriented Programming, Memory Management & STL in Ghaziabad.' },
  { slug: 'cpp-coaching-centre-in-ghaziabad', name: 'Best C++ Coaching Centre in Ghaziabad', short: 'C++ Coaching Centre', cat: 'C++', icon: 'cpp', color: '#0369A1', desc: 'Top offline C++ coaching centre in RDC Raj Nagar Ghaziabad with practical lab training.' },
  { slug: 'dsa-in-cpp-course-ghaziabad', name: 'Data Structures & Algorithms in C++ in Ghaziabad', short: 'DSA in C++', cat: 'C++', icon: 'cpp', color: '#4338CA', desc: 'Master DSA in C++, solve 300+ LeetCode problems, and crack FAANG technical rounds.' },
  { slug: 'c-programming-course-in-ghaziabad', name: 'C Programming Language Course in Ghaziabad', short: 'C Programming', cat: 'C++', icon: 'c', color: '#1D4ED8', desc: 'Build rock-solid programming foundations with C language: pointers, memory, and algorithms.' },
  { slug: 'c-language-coaching-ghaziabad', name: 'C Language Coaching in RDC Ghaziabad', short: 'C Language Coaching', cat: 'C++', icon: 'c', color: '#2563EB', desc: 'Offline C programming coaching for AKGEC, ABES, KIET, IMS and B.Tech students in RDC.' },
  { slug: 'competitive-programming-cpp-ghaziabad', name: 'Competitive Programming in C++ Course Ghaziabad', short: 'Competitive Coding', cat: 'C++', icon: 'cpp', color: '#6D28D9', desc: 'Excel in Codeforces, CodeChef, and HackerRank with advanced C++ competitive programming.' },

  // Web Development & Full Stack (24)
  { slug: 'full-stack-developer-course-ghaziabad', name: 'Full Stack Web Development Course in Ghaziabad', short: 'Full Stack Web', cat: 'Web', icon: 'web', color: '#059669', desc: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB with live placement support.' },
  { slug: 'mern-stack-course-in-ghaziabad', name: 'MERN Stack Web Development Course in Ghaziabad', short: 'MERN Stack Course', cat: 'Web', icon: 'web', color: '#0D9488', desc: 'Build scalable full stack JavaScript apps with MongoDB, Express, React, and Node.js.' },
  { slug: 'reactjs-course-in-ghaziabad', name: 'React JS Developer Course in Ghaziabad', short: 'React JS Course', cat: 'Web', icon: 'web', color: '#0284C7', desc: 'Master React 18, Hooks, State Management, Next.js, and Tailwind CSS in RDC Ghaziabad.' },
  { slug: 'nodejs-express-course-ghaziabad', name: 'Node.js & Express Backend Development in Ghaziabad', short: 'Node.js Backend', cat: 'Web', icon: 'web', color: '#16A34A', desc: 'Build high-concurrency RESTful APIs, WebSockets, and microservices with Node.js.' },
  { slug: 'frontend-web-development-ghaziabad', name: 'Frontend Web Development Course in Ghaziabad', short: 'Frontend Web', cat: 'Web', icon: 'web', color: '#EA580C', desc: 'Become a modern Frontend Engineer with HTML5, CSS3, JavaScript ES6+, and React.' },
  { slug: 'backend-development-course-ghaziabad', name: 'Backend Development & API Architecture in Ghaziabad', short: 'Backend Development', cat: 'Web', icon: 'web', color: '#4B5563', desc: 'Master server-side architecture, relational databases, caching, and microservices.' },
  { slug: 'javascript-mastery-course-ghaziabad', name: 'Modern JavaScript (ES6+ & TypeScript) Course Ghaziabad', short: 'JavaScript Mastery', cat: 'Web', icon: 'web', color: '#CA8A04', desc: 'Master async/await, closures, prototypes, event loop, and TypeScript in Ghaziabad.' },
  { slug: 'typescript-course-in-ghaziabad', name: 'TypeScript Mastery Course in Ghaziabad', short: 'TypeScript Course', cat: 'Web', icon: 'web', color: '#2563EB', desc: 'Learn enterprise type safety, interfaces, generics, and decorators for modern web apps.' },
  { slug: 'nextjs-development-course-ghaziabad', name: 'Next.js & Server Side Rendering (SSR) Course Ghaziabad', short: 'Next.js Development', cat: 'Web', icon: 'web', color: '#111827', desc: 'Build lightning-fast SEO-friendly React web applications with Next.js App Router.' },
  { slug: 'angular-course-in-ghaziabad', name: 'Angular Framework Web Development Course in Ghaziabad', short: 'Angular Course', cat: 'Web', icon: 'web', color: '#DC2626', desc: 'Enterprise Single Page Application development with Angular, TypeScript, and RxJS.' },
  { slug: 'html-css-web-design-ghaziabad', name: 'HTML5 & CSS3 Responsive Web Design in Ghaziabad', short: 'HTML & CSS Design', cat: 'Web', icon: 'web', color: '#E11D48', desc: 'Create stunning, mobile-responsive web pages with Flexbox, CSS Grid, and animations.' },
  { slug: 'tailwind-css-masterclass-ghaziabad', name: 'Tailwind CSS & Modern UI Styling Course Ghaziabad', short: 'Tailwind CSS UI', cat: 'Web', icon: 'web', color: '#06B6D4', desc: 'Speed up frontend development with utility-first Tailwind CSS and modern UI kits.' },
  { slug: 'mean-stack-development-ghaziabad', name: 'MEAN Stack (MongoDB, Express, Angular, Node) Course Ghaziabad', short: 'MEAN Stack', cat: 'Web', icon: 'web', color: '#B91C1C', desc: 'Complete enterprise JavaScript full stack development with Angular and Node.' },
  { slug: 'php-mysql-web-development-ghaziabad', name: 'PHP & MySQL Full Stack Web Development in Ghaziabad', short: 'PHP & MySQL Course', cat: 'Web', icon: 'web', color: '#6366F1', desc: 'Learn server-side PHP programming, MySQL database management, and web portals.' },
  { slug: 'laravel-course-in-ghaziabad', name: 'Laravel PHP Framework Course in Ghaziabad', short: 'Laravel Framework', cat: 'Web', icon: 'web', color: '#EF4444', desc: 'Build elegant web applications using Laravel MVC, Eloquent ORM, and Blade templates.' },
  { slug: 'wordpress-web-design-ghaziabad', name: 'WordPress Website Design & CMS Course in Ghaziabad', short: 'WordPress Design', cat: 'Web', icon: 'web', color: '#0284C7', desc: 'Build business websites, blogs, and WooCommerce e-commerce stores without coding.' },
  { slug: 'vuejs-framework-course-ghaziabad', name: 'Vue.js Frontend Framework Course in Ghaziabad', short: 'Vue.js Course', cat: 'Web', icon: 'web', color: '#10B981', desc: 'Learn Vue 3 Composition API, Pinia state management, and Vue Router in Ghaziabad.' },
  { slug: 'graphql-api-development-ghaziabad', name: 'GraphQL API Architecture Course in Ghaziabad', short: 'GraphQL APIs', cat: 'Web', icon: 'web', color: '#DB2777', desc: 'Build flexible client-driven APIs with GraphQL schemas, queries, and Apollo Server.' },
  { slug: 'rest-api-design-course-ghaziabad', name: 'RESTful API Design & Microservices in Ghaziabad', short: 'REST API Design', cat: 'Web', icon: 'web', color: '#4F46E5', desc: 'Master REST principles, HTTP status codes, OAuth2, and OpenAPI/Swagger documentation.' },
  { slug: 'web-development-coaching-rdc-ghaziabad', name: 'Web Development Coaching in RDC Raj Nagar Ghaziabad', short: 'Web Coaching RDC', cat: 'Web', icon: 'web', color: '#EA580C', desc: 'Top-rated classroom web development coaching in RDC Ghaziabad with placement.' },
  { slug: 'web-designing-course-in-ghaziabad', name: 'Professional Web Designing Course in Ghaziabad', short: 'Web Designing', cat: 'Web', icon: 'web', color: '#8B5CF6', desc: 'Learn UI design, graphic design for web, responsive layouts, and cross-browser testing.' },
  { slug: 'ecommerce-website-development-ghaziabad', name: 'E-Commerce Website Development Course in Ghaziabad', short: 'E-Commerce Dev', cat: 'Web', icon: 'web', color: '#F59E0B', desc: 'Build multi-vendor e-commerce marketplaces with payments, carts, and order management.' },
  { slug: 'progressive-web-apps-pwa-ghaziabad', name: 'Progressive Web Apps (PWA) Development Ghaziabad', short: 'PWA Development', cat: 'Web', icon: 'web', color: '#6366F1', desc: 'Build installable, offline-capable mobile web apps with Service Workers and Cache API.' },
  { slug: 'web-performance-optimization-ghaziabad', name: 'Web Performance & Core Web Vitals Course Ghaziabad', short: 'Web Performance', cat: 'Web', icon: 'web', color: '#10B981', desc: 'Optimize site speed, LCP, INP, CLS, CDN delivery, and caching for top Google rankings.' },

  // Cloud Computing & DevOps (15)
  { slug: 'aws-devops-training-ghaziabad', name: 'AWS Cloud & DevOps Engineering Training in Ghaziabad', short: 'AWS DevOps Training', cat: 'DevOps', icon: 'cloud', color: '#D97706', desc: 'Master AWS, Docker, Kubernetes, Jenkins, and Terraform with hands-on live cloud labs.' },
  { slug: 'aws-cloud-practitioner-course-ghaziabad', name: 'AWS Certified Cloud Practitioner & Architect Ghaziabad', short: 'AWS Cloud Architect', cat: 'DevOps', icon: 'cloud', color: '#B45309', desc: 'Prepare for official AWS certifications with hands-on EC2, S3, RDS, and IAM training.' },
  { slug: 'devops-engineering-course-ghaziabad', name: 'DevOps Engineering Master Certification in Ghaziabad', short: 'DevOps Engineering', cat: 'DevOps', icon: 'devops', color: '#0891B2', desc: 'Complete CI/CD, Infrastructure as Code, Containerization, and Monitoring mastery.' },
  { slug: 'docker-kubernetes-training-ghaziabad', name: 'Docker Containerization & Kubernetes (K8s) Ghaziabad', short: 'Docker & Kubernetes', cat: 'DevOps', icon: 'devops', color: '#2563EB', desc: 'Master container packaging, multi-container compose, Kubernetes pods, and Helm.' },
  { slug: 'linux-administration-course-ghaziabad', name: 'Linux System Administration & Shell Scripting Ghaziabad', short: 'Linux Administration', cat: 'DevOps', icon: 'devops', color: '#374151', desc: 'Master Linux server command line, bash scripting, permissions, and server hardening.' },
  { slug: 'terraform-cloud-automation-ghaziabad', name: 'Terraform Infrastructure as Code (IaC) Course Ghaziabad', short: 'Terraform Automation', cat: 'DevOps', icon: 'cloud', color: '#7C3AED', desc: 'Automate multi-cloud infrastructure provisioning on AWS and Azure using Terraform.' },
  { slug: 'ci-cd-jenkins-pipeline-ghaziabad', name: 'CI/CD Jenkins, GitHub Actions & GitLab in Ghaziabad', short: 'CI/CD Pipelines', cat: 'DevOps', icon: 'devops', color: '#DC2626', desc: 'Automate software build, testing, and deployment pipelines with Jenkins and Actions.' },
  { slug: 'azure-cloud-computing-ghaziabad', name: 'Microsoft Azure Cloud Solutions Course in Ghaziabad', short: 'Azure Cloud Course', cat: 'DevOps', icon: 'cloud', color: '#0284C7', desc: 'Master Azure VMs, Azure Blob, Virtual Networks, Azure DevOps, and AZ-900 / AZ-104.' },
  { slug: 'google-cloud-platform-gcp-ghaziabad', name: 'Google Cloud Platform (GCP) Training in Ghaziabad', short: 'GCP Cloud Training', cat: 'DevOps', icon: 'cloud', color: '#EA4335', desc: 'Master Google Compute Engine, BigQuery, GKE, Cloud Functions, and GCP Associate.' },
  { slug: 'site-reliability-engineering-sre-ghaziabad', name: 'Site Reliability Engineering (SRE) Course in Ghaziabad', short: 'SRE Certification', cat: 'DevOps', icon: 'devops', color: '#059669', desc: 'Learn incident management, SLIs/SLOs, chaos engineering, and high availability systems.' },
  { slug: 'devsecops-engineering-ghaziabad', name: 'DevSecOps & Cloud Security Automation in Ghaziabad', short: 'DevSecOps Course', cat: 'DevOps', icon: 'security', color: '#BE185D', desc: 'Embed security into CI/CD pipelines: SAST, DAST, container scanning, and compliance.' },
  { slug: 'cloud-security-specialist-ghaziabad', name: 'Cloud Security & Compliance Course in Ghaziabad', short: 'Cloud Security', cat: 'DevOps', icon: 'security', color: '#7E22CE', desc: 'Master identity access management, encryption, VPC security, and cloud audit policies.' },
  { slug: 'git-github-version-control-ghaziabad', name: 'Git & GitHub Version Control Mastery in Ghaziabad', short: 'Git & GitHub Course', cat: 'DevOps', icon: 'devops', color: '#F97316', desc: 'Master branching, merging, rebasing, pull requests, and collaborative code workflows.' },
  { slug: 'ansible-automation-course-ghaziabad', name: 'Ansible Configuration Management & Automation Ghaziabad', short: 'Ansible Automation', cat: 'DevOps', icon: 'devops', color: '#EF4444', desc: 'Automate server provisioning, playbooks, inventory management, and IT orchestration.' },
  { slug: 'serverless-computing-aws-lambda-ghaziabad', name: 'Serverless Computing with AWS Lambda & API Gateway Ghaziabad', short: 'Serverless AWS', cat: 'DevOps', icon: 'cloud', color: '#F59E0B', desc: 'Build cost-effective event-driven applications with AWS Lambda, DynamoDB, and S3.' },

  // Cyber Security & Ethical Hacking (8)
  { slug: 'cyber-security-course-in-ghaziabad', name: 'Cyber Security Specialist Course in Ghaziabad', short: 'Cyber Security Course', cat: 'Security', icon: 'security', color: '#DC2626', desc: 'Master network defense, threat analysis, incident handling, and information security.' },
  { slug: 'ethical-hacking-course-ghaziabad', name: 'Certified Ethical Hacking (CEH) Training in Ghaziabad', short: 'Ethical Hacking', cat: 'Security', icon: 'security', color: '#991B1B', desc: 'Learn penetration testing, reconnaissance, exploitation, and vulnerability patching.' },
  { slug: 'penetration-testing-bootcamp-ghaziabad', name: 'Web Application Penetration Testing in Ghaziabad', short: 'Penetration Testing', cat: 'Security', icon: 'security', color: '#B91C1C', desc: 'Identify OWASP Top 10 vulnerabilities, SQL injection, XSS, and CSRF exploits.' },
  { slug: 'network-security-training-ghaziabad', name: 'Network Security & Firewall Administration in Ghaziabad', short: 'Network Security', cat: 'Security', icon: 'security', color: '#1E40AF', desc: 'Configure firewalls, IDS/IPS, VPN tunnels, and Wireshark packet capture analysis.' },
  { slug: 'soc-analyst-course-ghaziabad', name: 'SOC Analyst & Incident Response Course in Ghaziabad', short: 'SOC Analyst Training', cat: 'Security', icon: 'security', color: '#4338CA', desc: 'Master SIEM tools, log analysis, threat intelligence, and digital forensics in Ghaziabad.' },
  { slug: 'information-security-classes-ghaziabad', name: 'Information Security & Cyber Defense in Ghaziabad', short: 'InfoSec Classes', cat: 'Security', icon: 'security', color: '#047857', desc: 'ISO 27001 compliance, risk assessment, corporate security governance, and cryptography.' },
  { slug: 'bug-bounty-hunting-course-ghaziabad', name: 'Bug Bounty Hunting & Vulnerability Assessment Ghaziabad', short: 'Bug Bounty Hunting', cat: 'Security', icon: 'security', color: '#D97706', desc: 'Learn how to find and report security vulnerabilities on HackerOne and Bugcrowd.' },
  { slug: 'cryptography-network-defense-ghaziabad', name: 'Cryptography & Network Defense Course Ghaziabad', short: 'Cryptography Course', cat: 'Security', icon: 'security', color: '#6D28D9', desc: 'Master symmetric/asymmetric encryption, hashing, digital signatures, and SSL/TLS.' },

  // Data Analytics, Databases & AI (14)
  { slug: 'power-bi-course-in-ghaziabad', name: 'Microsoft Power BI Data Analytics & Dashboards in Ghaziabad', short: 'Power BI Masterclass', cat: 'Data', icon: 'datascience', color: '#D97706', desc: 'Build interactive business dashboards, DAX measures, and automated data pipelines.' },
  { slug: 'tableau-data-visualization-ghaziabad', name: 'Tableau Data Visualization & BI Course in Ghaziabad', short: 'Tableau Visualization', cat: 'Data', icon: 'datascience', color: '#2563EB', desc: 'Create storytelling visual dashboards, charts, and business intelligence reports.' },
  { slug: 'sql-database-mastery-ghaziabad', name: 'SQL Database & Query Optimization Course in Ghaziabad', short: 'SQL Mastery Course', cat: 'Data', icon: 'database', color: '#0284C7', desc: 'Master complex queries, indexing, stored procedures, joins, and performance tuning.' },
  { slug: 'mysql-database-course-ghaziabad', name: 'MySQL Database Administration & Development in Ghaziabad', short: 'MySQL Course', cat: 'Data', icon: 'database', color: '#0891B2', desc: 'Learn relational database design, transactions, replication, and backup administration.' },
  { slug: 'mongodb-nosql-training-ghaziabad', name: 'MongoDB NoSQL Database Masterclass in Ghaziabad', short: 'MongoDB Training', cat: 'Data', icon: 'database', color: '#15803D', desc: 'Master NoSQL document modeling, aggregation framework, indexing, and Atlas cloud.' },
  { slug: 'postgresql-database-course-ghaziabad', name: 'PostgreSQL Advanced Database Training in Ghaziabad', short: 'PostgreSQL Training', cat: 'Data', icon: 'database', color: '#1E40AF', desc: 'Enterprise relational database mastery, JSONB queries, foreign keys, and tuning.' },
  { slug: 'business-analytics-course-ghaziabad', name: 'Business Analytics & Strategic Decision Making in Ghaziabad', short: 'Business Analytics', cat: 'Data', icon: 'datascience', color: '#4F46E5', desc: 'Bridge business strategy and data insights with statistical forecasting and KPIs.' },
  { slug: 'big-data-hadoop-spark-ghaziabad', name: 'Big Data Engineering with Apache Spark & Hadoop Ghaziabad', short: 'Big Data & Spark', cat: 'Data', icon: 'datascience', color: '#C2410C', desc: 'Process petabytes of data using Hadoop HDFS, MapReduce, and Apache Spark PySpark.' },
  { slug: 'generative-ai-prompt-engineering-ghaziabad', name: 'Generative AI & Prompt Engineering Course Ghaziabad', short: 'Prompt Engineering', cat: 'Data', icon: 'ai', color: '#7C3AED', desc: 'Master prompt techniques, image generation, LLM integration, and workplace automation.' },
  { slug: 'large-language-models-llm-ghaziabad', name: 'LLMs, OpenAI API & Hugging Face Bootcamp Ghaziabad', short: 'LLM Engineering', cat: 'Data', icon: 'ai', color: '#9333EA', desc: 'Fine-tune open-source models, build custom chat agents, and integrate embeddings.' },
  { slug: 'langchain-ai-agents-course-ghaziabad', name: 'LangChain & Autonomous AI Agents Course in Ghaziabad', short: 'LangChain & Agents', cat: 'Data', icon: 'ai', color: '#BE185D', desc: 'Build intelligent multi-agent AI systems with memory, tools, and vector search.' },
  { slug: 'data-engineering-course-ghaziabad', name: 'Data Engineering & ETL Pipeline Development in Ghaziabad', short: 'Data Engineering', cat: 'Data', icon: 'datascience', color: '#047857', desc: 'Design automated ETL/ELT pipelines, data lakes, Apache Airflow, and warehousing.' },
  { slug: 'advanced-excel-analytics-ghaziabad', name: 'Advanced Excel & VBA Macro Analytics in Ghaziabad', short: 'Advanced Excel VBA', cat: 'Data', icon: 'datascience', color: '#16A34A', desc: 'Automate business spreadsheets, write custom VBA macros, and build dynamic models.' },
  { slug: 'computer-vision-opencv-ghaziabad', name: 'Computer Vision & OpenCV with Python in Ghaziabad', short: 'Computer Vision', cat: 'Data', icon: 'ai', color: '#EA580C', desc: 'Face recognition, object tracking, image filters, and video processing with OpenCV.' },

  // Mobile, Testing & Design (10)
  { slug: 'flutter-app-development-ghaziabad', name: 'Flutter & Dart Cross-Platform Mobile App Development Ghaziabad', short: 'Flutter App Dev', cat: 'Mobile', icon: 'mobile', color: '#0284C7', desc: 'Build stunning Android and iOS apps from a single codebase with Flutter & Dart.' },
  { slug: 'android-kotlin-development-ghaziabad', name: 'Android App Development with Kotlin in Ghaziabad', short: 'Android Kotlin Dev', cat: 'Mobile', icon: 'mobile', color: '#10B981', desc: 'Native Android app engineering with Kotlin, Jetpack Compose, Coroutines, and Room.' },
  { slug: 'react-native-course-in-ghaziabad', name: 'React Native Mobile App Development in Ghaziabad', short: 'React Native Dev', cat: 'Mobile', icon: 'mobile', color: '#6366F1', desc: 'Build native iOS and Android apps using React, JavaScript, and Expo tooling.' },
  { slug: 'ios-swift-app-development-ghaziabad', name: 'iOS App Development with Swift in Ghaziabad', short: 'iOS Swift Course', cat: 'Mobile', icon: 'mobile', color: '#F97316', desc: 'Native Apple iOS app creation using Swift 5, SwiftUI, Xcode, and CoreData.' },
  { slug: 'software-testing-qa-course-ghaziabad', name: 'Software Testing & QA (Manual + Automation) in Ghaziabad', short: 'Software QA Testing', cat: 'Testing', icon: 'testing', color: '#059669', desc: 'Master test plan design, bug lifecycle, JIRA, and test execution methodologies.' },
  { slug: 'selenium-automation-testing-ghaziabad', name: 'Selenium WebDriver Automation Testing in Ghaziabad', short: 'Selenium Testing', cat: 'Testing', icon: 'testing', color: '#047857', desc: 'Automate web testing using Selenium WebDriver with Java/Python, TestNG & Cucumber.' },
  { slug: 'api-testing-postman-ghaziabad', name: 'API Testing with Postman & RestAssured in Ghaziabad', short: 'API Testing Course', cat: 'Testing', icon: 'testing', color: '#EA580C', desc: 'Automate backend API testing, validation, environment variables, and CI integration.' },
  { slug: 'ui-ux-design-course-in-ghaziabad', name: 'UI/UX Design & User Experience Research in Ghaziabad', short: 'UI/UX Design Course', cat: 'Design', icon: 'design', color: '#EC4899', desc: 'Master user research, wireframing, interactive prototyping, and design systems.' },
  { slug: 'figma-ui-ux-design-ghaziabad', name: 'Figma UI/UX Design Masterclass in Ghaziabad', short: 'Figma UI Design', cat: 'Design', icon: 'design', color: '#A855F7', desc: 'Create modern web and mobile UI mockups, auto-layout components, and micro-interactions.' },
  { slug: 'system-design-architecture-ghaziabad', name: 'System Design & High Scalability Architecture Ghaziabad', short: 'System Design Course', cat: 'Tech', icon: 'tech', color: '#1F2937', desc: 'Prepare for senior engineering rounds: caching, load balancing, sharding, and CAP.' },

  // Locality-Specific Ghaziabad Coding Hubs (8)
  { slug: 'best-tech-coaching-rdc-ghaziabad', name: 'Best Tech Coaching Institute in RDC Raj Nagar Ghaziabad', short: 'Best Coaching RDC', cat: 'Locality', icon: 'institute', color: '#2563EB', desc: 'Top software engineering and coding institute in RDC Raj Nagar with 100% placement.' },
  { slug: 'coding-classes-in-kavi-nagar-ghaziabad', name: 'Coding & Software Development Classes in Kavi Nagar Ghaziabad', short: 'Kavi Nagar Coding', cat: 'Locality', icon: 'institute', color: '#4F46E5', desc: 'Top-rated software training for students and professionals residing in Kavi Nagar.' },
  { slug: 'computer-institute-in-shastri-nagar-ghaziabad', name: 'Computer Training Institute in Shastri Nagar Ghaziabad', short: 'Shastri Nagar Institute', cat: 'Locality', icon: 'institute', color: '#0D9488', desc: 'Professional IT and software courses near Shastri Nagar and Diamond Palace area.' },
  { slug: 'tech-coaching-in-indirapuram-ghaziabad', name: 'Tech & Coding Coaching in Indirapuram Ghaziabad', short: 'Indirapuram Tech Hub', cat: 'Locality', icon: 'institute', color: '#0891B2', desc: 'High-end software engineering classes accessible to residents of Indirapuram & Noida.' },
  { slug: 'coding-institute-in-vaishali-ghaziabad', name: 'Coding & IT Institute in Vaishali Ghaziabad', short: 'Vaishali Coding Institute', cat: 'Locality', icon: 'institute', color: '#7C3AED', desc: 'Premier programming coaching near Vaishali Metro Station (Blue Line).' },
  { slug: 'python-java-classes-in-vasundhara-ghaziabad', name: 'Python & Java Coaching Classes in Vasundhara Ghaziabad', short: 'Vasundhara Classes', cat: 'Locality', icon: 'institute', color: '#EA580C', desc: 'Hands-on programming training for students in Vasundhara Sector 1 to 19.' },
  { slug: 'software-training-in-crossings-republik-ghaziabad', name: 'Software Training Institute in Crossings Republik Ghaziabad', short: 'Crossings Republik Hub', cat: 'Locality', icon: 'institute', color: '#16A34A', desc: 'Career-focused IT courses for residents of Crossings Republik township.' },
  { slug: 'computer-centre-near-me-ghaziabad', name: 'Best Computer & Coding Centre Near Me in Ghaziabad', short: 'Computer Centre Near Me', cat: 'Locality', icon: 'institute', color: '#2563EB', desc: 'Find the highest-rated computer and programming institute near you in Ghaziabad.' },

  // =========================================================================
  // 50 NEW HIGH-POWER SEO COURSES: JAVA, DATA SCIENCE, MERN FULL STACK & TECH
  // =========================================================================

  // 10 NEW JAVA SPECIALIST SEO PAGES
  { slug: 'java-training-institute-in-ghaziabad', name: 'Top Java Training Institute in Ghaziabad RDC', short: 'Java Training Institute', cat: 'Java', icon: 'java', color: '#EA580C', desc: 'Premier Java training institute in RDC Raj Nagar Ghaziabad with corporate lab facilities and 100% placement.' },
  { slug: 'core-java-course-in-rdc-raj-nagar-ghaziabad', name: 'Core Java Course in RDC Raj Nagar Ghaziabad', short: 'Core Java RDC', cat: 'Java', icon: 'java', color: '#C2410C', desc: 'Master Core Java, JVM internals, multithreading, and OOP in our high-tech RDC Raj Nagar classroom lab.' },
  { slug: 'advance-java-corporate-training-ghaziabad', name: 'Advance Java Corporate Training in Ghaziabad', short: 'Advance Java Corporate', cat: 'Java', icon: 'java', color: '#9A3412', desc: 'Advance Java enterprise training covering JDBC, Servlets, JSP, Spring Boot, and enterprise microservices.' },
  { slug: 'java-coaching-classes-near-me-ghaziabad', name: 'Best Java Coaching Classes Near Me in Ghaziabad', short: 'Java Coaching Near Me', cat: 'Java', icon: 'java', color: '#EA580C', desc: 'Find the highest-rated Java coaching classes near you in Ghaziabad with daily offline lab sessions.' },
  { slug: 'java-course-with-placement-ghaziabad', name: 'Java Course with 100% Placement in Ghaziabad', short: 'Java Placement Guarantee', cat: 'Java', icon: 'java', color: '#B45309', desc: 'Job-guaranteed Java training program with 50+ hiring partners in Noida, Delhi NCR, and Gurgaon.' },
  { slug: 'java-for-college-students-ghaziabad', name: 'Java Programming for College Students in Ghaziabad', short: 'Java College Track', cat: 'Java', icon: 'java', color: '#7C2D12', desc: 'Specialized Java semester and placement training for AKGEC, ABES, KIET, IMS, and RKGIT students.' },
  { slug: 'weekend-java-classes-in-ghaziabad', name: 'Weekend Java Classes in Ghaziabad for Working Professionals', short: 'Weekend Java Classes', cat: 'Java', icon: 'java', color: '#C2410C', desc: 'Executive Saturday & Sunday Java batches in RDC Ghaziabad designed for working professionals.' },
  { slug: 'java-spring-boot-react-classes-ghaziabad', name: 'Java Spring Boot & React Full Stack Classes in Ghaziabad', short: 'Spring Boot React Stack', cat: 'Java', icon: 'java', color: '#15803D', desc: 'Build modern enterprise web applications with Spring Boot 3, REST APIs, and React 18 frontend.' },
  { slug: 'java-interview-preparation-course-ghaziabad', name: 'Java Technical Interview Preparation in Ghaziabad', short: 'Java Interview Prep', cat: 'Java', icon: 'java', color: '#7C3AED', desc: 'Crack technical interviews at top MNCs with 300+ Java coding questions, system design, and mock rounds.' },
  { slug: 'java-backend-development-course-ghaziabad', name: 'Java Enterprise Backend Development Course in Ghaziabad', short: 'Java Backend Dev', cat: 'Java', icon: 'java', color: '#1E40AF', desc: 'Design and deploy robust backend APIs, connection pooling, and microservices with Java and MySQL.' },

  // 15 NEW PYTHON & DATA SCIENCE SPECIALIST SEO PAGES
  { slug: 'python-training-institute-in-ghaziabad', name: 'Top Python Training Institute in Ghaziabad RDC', short: 'Python Training Institute', cat: 'Python', icon: 'python', color: '#0284C7', desc: 'Premier Python training academy in RDC Raj Nagar Ghaziabad with modern labs and placement cell.' },
  { slug: 'python-coaching-near-me-ghaziabad', name: 'Best Python Coaching Near Me in Ghaziabad', short: 'Python Coaching Near Me', cat: 'Python', icon: 'python', color: '#0369A1', desc: 'Search for the top Python coaching classes near you in Ghaziabad. Offline labs and personalized mentorship.' },
  { slug: 'python-developer-course-in-ghaziabad', name: 'Professional Python Developer Course in Ghaziabad', short: 'Python Developer Course', cat: 'Python', icon: 'python', color: '#0E7490', desc: 'Become a certified Python software developer with hands-on projects, Git, APIs, and databases.' },
  { slug: 'python-course-with-job-guarantee-ghaziabad', name: 'Python Course with 100% Placement in Ghaziabad', short: 'Python Job Guarantee', cat: 'Python', icon: 'python', color: '#047857', desc: 'Career-track Python certification program with assured interview calls across Noida and Delhi NCR.' },
  { slug: 'python-for-freshers-and-beginners-ghaziabad', name: 'Python Programming Course for Freshers in Ghaziabad', short: 'Python for Freshers', cat: 'Python', icon: 'python', color: '#0D9488', desc: 'Friendly, beginner-focused Python coding classes tailored for fresh graduates and non-CS students.' },
  { slug: 'weekend-python-batches-in-ghaziabad', name: 'Weekend Python Coding Batches in RDC Ghaziabad', short: 'Weekend Python Batches', cat: 'Python', icon: 'python', color: '#0284C7', desc: 'Flexible weekend Python classes in RDC Raj Nagar for college students and IT working professionals.' },
  { slug: 'python-django-web-development-ghaziabad', name: 'Python Django Web Development Course in Ghaziabad', short: 'Python Django Dev', cat: 'Python', icon: 'python', color: '#065F46', desc: 'Master Django MVT, Django ORM, authentication, and REST APIs with live deployment.' },
  { slug: 'python-fastapi-backend-course-ghaziabad', name: 'Python FastAPI Backend & Microservices Course in Ghaziabad', short: 'FastAPI Backend', cat: 'Python', icon: 'python', color: '#0891B2', desc: 'Build ultra-fast async APIs and AI backends with FastAPI, Pydantic, and PostgreSQL.' },
  { slug: 'python-automation-scripting-course-ghaziabad', name: 'Python Automation & Web Scraping Course in Ghaziabad', short: 'Python Automation', cat: 'Python', icon: 'python', color: '#155E75', desc: 'Automate spreadsheets, OS tasks, and scrape dynamic websites with Python Selenium and BeautifulSoup.' },
  { slug: 'data-science-training-institute-in-ghaziabad', name: 'Premier Data Science Training Institute in Ghaziabad', short: 'Data Science Institute', cat: 'Data Science', icon: 'datascience', color: '#4F46E5', desc: 'Ghaziabad top-rated data science institute with live project labs, Pandas, ML, and Power BI.' },
  { slug: 'data-science-coaching-near-me-ghaziabad', name: 'Best Data Science Coaching Near Me in Ghaziabad', short: 'Data Science Near Me', cat: 'Data Science', icon: 'datascience', color: '#4338CA', desc: 'Find premier Data Science coaching classes near you in Ghaziabad with industry case studies.' },
  { slug: 'data-science-course-with-placement-ghaziabad', name: 'Data Science Course with 100% Placement in Ghaziabad', short: 'Data Science Placement', cat: 'Data Science', icon: 'datascience', color: '#312E81', desc: 'Master machine learning, statistics, and business predictive modeling with job assurance.' },
  { slug: 'python-machine-learning-bootcamp-ghaziabad', name: 'Python Machine Learning Intensive Bootcamp in Ghaziabad', short: 'Python ML Bootcamp', cat: 'Data Science', icon: 'datascience', color: '#7C3AED', desc: 'Hands-on bootcamp covering regression, classification, clustering, XGBoost, and Scikit-Learn.' },
  { slug: 'artificial-intelligence-institute-ghaziabad', name: 'Premier AI & Deep Learning Institute in RDC Ghaziabad', short: 'AI Training Institute', cat: 'Data Science', icon: 'ai', color: '#9333EA', desc: 'Learn Neural Networks, PyTorch, Computer Vision, and Generative AI at AppleTree Infotech RDC.' },
  { slug: 'data-analytics-training-institute-ghaziabad', name: 'Top Data Analytics Training Institute in Ghaziabad', short: 'Data Analytics Institute', cat: 'Data Science', icon: 'datascience', color: '#D97706', desc: 'Master Advanced Excel, SQL queries, Python data analysis, and Power BI executive dashboards.' },

  // 15 NEW MERN & FULL STACK SPECIALIST SEO PAGES
  { slug: 'mern-stack-training-institute-ghaziabad', name: 'Top MERN Stack Training Institute in Ghaziabad RDC', short: 'MERN Training Institute', cat: 'Web', icon: 'web', color: '#0D9488', desc: 'Best MERN stack development institute in RDC Raj Nagar Ghaziabad with 100% placement.' },
  { slug: 'mern-stack-coaching-near-me-ghaziabad', name: 'Best MERN Stack Coaching Near Me in Ghaziabad', short: 'MERN Coaching Near Me', cat: 'Web', icon: 'web', color: '#0F766E', desc: 'Find the top MERN stack coding centre near you in Ghaziabad with live project development.' },
  { slug: 'full-stack-web-development-institute-ghaziabad', name: 'Full Stack Web Development Training Institute Ghaziabad', short: 'Full Stack Institute', cat: 'Web', icon: 'web', color: '#059669', desc: 'Leading software training institute for Full Stack Web Engineering in RDC Raj Nagar.' },
  { slug: 'full-stack-developer-course-near-me-ghaziabad', name: 'Best Full Stack Developer Course Near Me in Ghaziabad', short: 'Full Stack Near Me', cat: 'Web', icon: 'web', color: '#047857', desc: 'Enroll in the premier full stack developer course near you in Ghaziabad with AC lab facilities.' },
  { slug: 'react-js-training-institute-in-ghaziabad', name: 'Top React.js Training Institute in RDC Ghaziabad', short: 'React Training Institute', cat: 'Web', icon: 'web', color: '#0284C7', desc: 'Master React 18, Vite, Redux Toolkit, Tailwind CSS, and REST API integration in Ghaziabad.' },
  { slug: 'react-js-coaching-near-me-ghaziabad', name: 'Best React JS Coaching Classes Near Me in Ghaziabad', short: 'React Coaching Near Me', cat: 'Web', icon: 'web', color: '#0369A1', desc: 'Find top React.js frontend coaching near you in Ghaziabad with hands-on live project labs.' },
  { slug: 'nodejs-backend-training-in-ghaziabad', name: 'Node.js & Express Backend Development Training in Ghaziabad', short: 'Node.js Backend Training', cat: 'Web', icon: 'web', color: '#16A34A', desc: 'Build scalable asynchronous REST APIs, authentication with JWT, and MongoDB with Node.js.' },
  { slug: 'full-stack-javascript-course-ghaziabad', name: 'Full Stack JavaScript (ES6+ & TypeScript) Course Ghaziabad', short: 'Full Stack JavaScript', cat: 'Web', icon: 'web', color: '#CA8A04', desc: 'Complete JavaScript to TypeScript full stack training: Frontend React + Backend Node.js.' },
  { slug: 'nextjs-full-stack-developer-course-ghaziabad', name: 'Next.js 15 Full Stack Web Development Course Ghaziabad', short: 'Next.js Full Stack', cat: 'Web', icon: 'web', color: '#111827', desc: 'Master Server-Side Rendering, Server Actions, App Router, and cloud hosting with Next.js.' },
  { slug: 'mern-stack-course-with-placement-ghaziabad', name: 'MERN Stack Course with 100% Placement in Ghaziabad', short: 'MERN Placement Guarantee', cat: 'Web', icon: 'web', color: '#059669', desc: 'Job-guaranteed MERN stack training program with resume building and direct referrals in NCR.' },
  { slug: 'frontend-developer-course-in-ghaziabad', name: 'Modern Frontend Developer Course with React in Ghaziabad', short: 'Frontend Developer', cat: 'Web', icon: 'web', color: '#EA580C', desc: 'Learn HTML5, CSS3, JavaScript, React, Tailwind, and build modern responsive web apps.' },
  { slug: 'backend-developer-course-in-ghaziabad', name: 'Enterprise Backend Developer Course with Node.js in Ghaziabad', short: 'Backend Developer', cat: 'Web', icon: 'web', color: '#374151', desc: 'Master server architectures, database modeling, RESTful microservices, and Docker hosting.' },
  { slug: 'web-development-internship-in-ghaziabad', name: 'Web Development Live Project & Internship in Ghaziabad', short: 'Web Dev Internship', cat: 'Web', icon: 'web', color: '#4F46E5', desc: 'Gain authentic industrial experience with our live project web development internship program.' },
  { slug: 'full-stack-bootcamp-in-rdc-ghaziabad', name: 'Full Stack Web Development Bootcamp in RDC Raj Nagar', short: 'Full Stack Bootcamp RDC', cat: 'Web', icon: 'web', color: '#2563EB', desc: 'Intensive 4-month bootcamp in RDC Ghaziabad taking you from beginner to hired developer.' },
  { slug: 'web-development-classes-near-me-ghaziabad', name: 'Top Web Development Classes Near Me in Ghaziabad', short: 'Web Classes Near Me', cat: 'Web', icon: 'web', color: '#0891B2', desc: 'Find the top web development and coding institute near you in Ghaziabad with AC lab rooms.' },

  // 10 NEW HIGH-IMPACT GHAZIABAD SOFTWARE CAREER PAGES
  { slug: 'best-software-courses-in-ghaziabad', name: 'Top Rated Software Courses & Certifications in Ghaziabad', short: 'Best Software Courses', cat: 'Locality', icon: 'institute', color: '#2563EB', desc: 'Explore the highest-paying software courses: Java, Python, DevOps, and MERN in Ghaziabad.' },
  { slug: 'computer-programming-institute-in-ghaziabad', name: 'Computer Programming Institute in RDC Ghaziabad', short: 'Programming Institute', cat: 'Locality', icon: 'institute', color: '#1D4ED8', desc: 'Master C++, Java, Python, and Full Stack development in Ghaziabad most reputed IT institute.' },
  { slug: 'it-training-institute-in-rdc-ghaziabad', name: 'Premier IT Training Institute in RDC Raj Nagar Ghaziabad', short: 'IT Institute RDC', cat: 'Locality', icon: 'institute', color: '#0284C7', desc: 'C-60 R.K. Tower RDC Ghaziabad premier IT training destination for college students and freshers.' },
  { slug: 'software-engineer-placement-bootcamp-ghaziabad', name: 'Software Engineer Placement Bootcamp in Ghaziabad', short: 'Software Placement Bootcamp', cat: 'Locality', icon: 'institute', color: '#059669', desc: 'Job-oriented software engineering bootcamp with DSA, Full Stack, and mock interviews.' },
  { slug: 'coding-classes-for-btech-students-ghaziabad', name: 'Coding Classes for B.Tech & BCA Students in Ghaziabad', short: 'Coding for B.Tech BCA', cat: 'Locality', icon: 'institute', color: '#7C3AED', desc: 'Semester syllabus, practical labs, and campus placement prep for AKGEC, ABES, KIET students.' },
  { slug: 'top-coding-institute-near-shaheed-sthal-metro', name: 'Top Coding Institute Near Shaheed Sthal Metro Ghaziabad', short: 'Metro Connected Institute', cat: 'Locality', icon: 'institute', color: '#0891B2', desc: 'Just 5 minutes from Shaheed Sthal New Bus Adda Metro Station, located in RDC Raj Nagar.' },
  { slug: 'best-computer-centre-in-raj-nagar-ghaziabad', name: 'Best Computer Centre in Raj Nagar Ghaziabad', short: 'Computer Centre Raj Nagar', cat: 'Locality', icon: 'institute', color: '#2563EB', desc: 'Reputed computer training center in Raj Nagar offering Java, Python, C++, and Web Design.' },
  { slug: 'python-java-mern-classes-in-ghaziabad', name: 'Python, Java & MERN Full Stack Classes in Ghaziabad', short: 'Python Java MERN Combo', cat: 'Locality', icon: 'institute', color: '#EA580C', desc: 'Comprehensive all-in-one programming mastery in RDC Ghaziabad with placement assurance.' },
  { slug: 'corporate-it-training-in-ghaziabad', name: 'Corporate IT & Corporate Software Training in Ghaziabad', short: 'Corporate IT Training', cat: 'Locality', icon: 'institute', color: '#374151', desc: 'Upskill your engineering workforce with custom Java, Cloud AWS, Python, and DevOps training.' },
  { slug: 'job-oriented-software-courses-in-ghaziabad', name: 'Job Oriented Software Courses with 100% Placement Ghaziabad', short: 'Job Oriented Courses', cat: 'Locality', icon: 'institute', color: '#16A34A', desc: 'High-ROI software engineering diplomas designed for immediate recruitment across Delhi NCR.' }
];

// Combine to reach exactly 100 courses
const allCourseEntries = [...rawCourses];

additionalCourses.forEach(c => {
  const fullCourse = {
    slug: c.slug,
    courseName: c.name,
    shortTitle: c.short,
    category: c.cat,
    badgeText: c.short.toUpperCase(),
    themeColor: c.color,
    bgGradient: ['#0F172A', c.color, '#1E293B'],
    iconType: c.icon,
    seoTitle: `${c.name} | Top Placement Institute (2026)`,
    metaDesc: `${c.desc} Join AppleTree Infotech in RDC Raj Nagar Ghaziabad for 100% practical lab training, ISO certificates & job placement.`,
    keywords: `${c.short.toLowerCase()} in ghaziabad, ${c.short.toLowerCase()} coaching centre, best ${c.short.toLowerCase()} classes near me, ${c.short.toLowerCase()} training rdc raj nagar, coding institute ghaziabad`,
    h1: `${c.name}`,
    tagline: `🏆 Master ${c.short} with 100% Practical Labs & Enterprise Placement in Ghaziabad`,
    rating: '4.9 ★★★★★ (450+ Reviews)',
    batchTypes: 'Weekdays & Weekend Executive Batches Available',
    fees: '₹3,500 / month onwards (Flexible EMI Options)',
    duration: '3 to 4 Months (With Live Projects & ISO Certification)',
    overview: `${c.desc} AppleTree Infotech & ProgrammingWala in RDC Raj Nagar Ghaziabad provides comprehensive, industry-aligned training with real-world capstone projects, personalized mentorship, and direct placement assistance for students and working professionals.`,
    highlights: [
      `100% Practical hands-on training in state-of-the-art air-conditioned lab in RDC Ghaziabad.`,
      `Comprehensive syllabus aligned with latest 2026 industry standards and corporate requirements.`,
      `Live project development, code reviews, and GitHub portfolio creation.`,
      `ISO 9001:2015 & MSME Government Recognized Verifiable Certificate.`,
      `Dedicated placement assistance with mock interviews and direct company referrals across Delhi NCR.`
    ],
    curriculumTracks: [
      { name: 'Module 1: Foundations & Core Architecture', duration: '3 Weeks', desc: `In-depth coverage of fundamental concepts, syntax, environment setup, and architectural best practices.` },
      { name: 'Module 2: Advanced Concepts & Industrial Tools', duration: '3 Weeks', desc: `Mastering advanced techniques, performance optimization, error handling, and industrial workflow tools.` },
      { name: 'Module 3: Real-World Project Implementation', duration: '4 Weeks', desc: `Building complex end-to-end applications solving authentic business and technical challenges.` },
      { name: 'Module 4: Testing, Deployment & Interview Prep', duration: '2 Weeks', desc: `Code testing, cloud hosting, CI/CD deployment, resume polishing, and technical mock interviews.` }
    ],
    faqs: [
      { q: `Why choose AppleTree Infotech for ${c.short} in Ghaziabad?`, a: `We provide practical lab training in RDC Raj Nagar Ghaziabad with modern workstations, certified expert mentors, ISO certification, and proven placement record in Noida and Delhi NCR.` },
      { q: `Where is the coaching institute located?`, a: `Our campus is located at C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre), Ghaziabad, UP 201001, right near Shaheed Sthal Metro Station.` },
      { q: `Can I attend a free demo class?`, a: `Yes, we offer 2 free trial classes so you can experience our practical teaching methods and modern lab facilities firsthand.` }
    ]
  };

  allCourseEntries.push(fullCourse);
});

console.log(`Total courses compiled: ${allCourseEntries.length}`);

// Write out scripts/coursesCatalog.json
fs.writeFileSync(path.join(__dirname, 'coursesCatalog.json'), JSON.stringify(allCourseEntries, null, 2), 'utf-8');
console.log('Saved coursesCatalog.json successfully!');

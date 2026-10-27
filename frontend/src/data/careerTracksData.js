export const CAREER_TRACKS = {
  'java-full-stack-developer': {
    slug: 'java-full-stack-developer',
    title: 'Java Full Stack Developer',
    subtitle: 'Enterprise Backend Microservices, React.js & AWS Cloud',
    seoTitle: 'Java Full Stack Developer Jobs, Salary & Roadmap (2026) | ProgrammingWala',
    metaDesc: 'Master Java 21, Spring Boot 3, Microservices, React.js, and AWS. High-paying Java Full Stack Developer jobs in Ghaziabad, Noida, Delhi NCR & Remote. 100% Placement Support.',
    keywords: 'Java Full Stack Developer Jobs, Spring Boot Microservices Developer, Core Java Developer Ghaziabad, Java React Fullstack, Java Developer Salary India, Java Backend Engineer 2026, Java Interview Questions',
    h1: 'Java Full Stack Developer Career Track & Job Guide 2026',
    heroTag: '🔥 #1 Trending Enterprise Career in 2026',
    iconName: 'Server',
    accentColor: 'from-orange-500 to-amber-600',
    avgSalaryIndia: '₹6.5 LPA – ₹24 LPA',
    avgSalaryGlobal: '$85,000 – $155,000 / yr',
    demandScore: '99% High Demand',
    openRolesCount: '25,000+ Active Openings',
    topCompanies: ['Amazon', 'Oracle', 'Infosys', 'TCS', 'Capgemini', 'Cognizant', 'AppleTree Infotech', 'Afsha Enterprises'],
    summary: 'Java Full Stack Developers build robust enterprise-grade backend systems using Java 17/21 LTS, Spring Boot 3, and Microservices while creating dynamic, modern user interfaces with React.js and Tailwind CSS.',
    skills: [
      { name: 'Core Java & Multithreading', level: 'Mastery', tags: ['Java 21', 'OOP', 'Collections', 'Streams API', 'Concurrency'] },
      { name: 'Spring Boot 3 & Microservices', level: 'Mastery', tags: ['REST APIs', 'Spring Security', 'JWT', 'Eureka', 'API Gateway'] },
      { name: 'Hibernate & JPA ORM', level: 'Advanced', tags: ['MySQL', 'PostgreSQL', 'Connection Pooling', 'Indexing'] },
      { name: 'Frontend with React & Vite', level: 'Advanced', tags: ['React 18', 'JavaScript ES6+', 'Tailwind CSS', 'Redux'] },
      { name: 'Cloud & Docker DevOps', level: 'Essential', tags: ['AWS EC2/S3', 'Docker Containers', 'Jenkins CI/CD', 'Git'] }
    ],
    roadmap: [
      { phase: 'Month 1: Core Java & Data Structures', topics: 'Object-Oriented Programming, Memory Management, Exception Handling, Collections, Algorithms, Streams.' },
      { phase: 'Month 2: Backend Architecture & Spring Boot', topics: 'Spring Core, Dependency Injection, RESTful APIs with Spring Boot 3, Spring Data JPA, Hibernate ORM.' },
      { phase: 'Month 3: Security & Microservices Ecosystem', topics: 'JWT Authentication, OAuth2, Eureka Service Discovery, Feign Client, Resilience4j Circuit Breaker.' },
      { phase: 'Month 4: Modern React Frontend & Cloud Deploy', topics: 'React Components, Hooks, State Management, Axios Integration, Dockerization, AWS EC2 & S3 Deployment.' }
    ],
    interviewQuestions: [
      {
        q: 'What are the key differences between HashMap and ConcurrentHashMap in Java?',
        a: 'HashMap is non-synchronized and not thread-safe, allowing one null key. ConcurrentHashMap is thread-safe using bucket-level / segment locking in Java 8+ without locking the entire map, maximizing high-concurrency throughput.'
      },
      {
        q: 'How does Spring Boot Auto-Configuration work internally?',
        a: 'Spring Boot checks the classpath dependencies using @EnableAutoConfiguration and META-INF/spring.factories (or AutoConfiguration.imports in Boot 3) to conditionally register beans via @ConditionalOnClass and @ConditionalOnMissingBean.'
      },
      {
        q: 'What is the advantage of Microservices over Monolithic Architecture in Java?',
        a: 'Microservices allow independent deployment, isolated failure domains, technology agility, scalable auto-scaling per service, and continuous delivery via Docker and Kubernetes.'
      },
      {
        q: 'How do you prevent SQL Injection in Spring Data JPA?',
        a: 'Spring Data JPA uses prepared statements and parameterized queries by default when using repository methods or named parameters with @Query and :param syntax.'
      }
    ]
  },

  'aws-devops-engineer': {
    slug: 'aws-devops-engineer',
    title: 'AWS DevOps Engineer',
    subtitle: 'Cloud Infrastructure, Docker, Kubernetes & CI/CD Pipelines',
    seoTitle: 'AWS DevOps Engineer Jobs, Roadmap & Salary (2026) | ProgrammingWala',
    metaDesc: 'Become a certified AWS DevOps Engineer. Learn Docker, Kubernetes, Jenkins CI/CD, Terraform, AWS EC2, S3, ECS, and Linux Administration. High-paying Cloud DevOps roles.',
    keywords: 'AWS DevOps Engineer Jobs, Cloud DevOps Architect, Docker Kubernetes Specialist, CI/CD Pipeline Engineer, Terraform Infrastructure as Code, AWS Certified DevOps Engineer India',
    h1: 'AWS DevOps Engineer Career Track & Cloud Jobs Guide 2026',
    heroTag: '☁️ Top Paying Cloud Engineering Career',
    iconName: 'Cloud',
    accentColor: 'from-sky-500 to-indigo-600',
    avgSalaryIndia: '₹8 LPA – ₹30 LPA',
    avgSalaryGlobal: '$110,000 – $180,000 / yr',
    demandScore: '98% High Demand',
    openRolesCount: '18,000+ Active Openings',
    topCompanies: ['AWS', 'Microsoft', 'Accenture', 'Wipro', 'Deloitte', 'HCL', 'AppleTree Infotech', 'Afsha Enterprises'],
    summary: 'AWS DevOps Engineers bridge software development and cloud operations by automating deployments, provisioning infrastructure as code, maintaining high availability (99.99%), and securing containerized microservices.',
    skills: [
      { name: 'AWS Cloud Core Infrastructure', level: 'Mastery', tags: ['EC2', 'S3', 'RDS', 'IAM', 'VPC', 'Route53', 'CloudFront', 'Lambda'] },
      { name: 'Docker & Containerization', level: 'Mastery', tags: ['Dockerfile', 'Multi-stage Builds', 'Docker Compose', 'Docker Registry'] },
      { name: 'Kubernetes Container Orchestration', level: 'Advanced', tags: ['Pods', 'Deployments', 'Ingress', 'Cluster Networking', 'Helm Charts'] },
      { name: 'CI/CD Automation Pipelines', level: 'Mastery', tags: ['Jenkins', 'GitHub Actions', 'SonarQube', 'ArgoCD', 'Automated Testing'] },
      { name: 'Infrastructure as Code (IaC) & Linux', level: 'Advanced', tags: ['Terraform', 'Bash Scripting', 'Nginx', 'SSL/TLS', 'Prometheus/Grafana'] }
    ],
    roadmap: [
      { phase: 'Month 1: Linux Administration & Shell Scripting', topics: 'Server Security, File Systems, Networking, SSH, Systemd, Cron Jobs, Bash Automation.' },
      { phase: 'Month 2: AWS Cloud Architecture Fundamentals', topics: 'VPC Subnetting, Security Groups, IAM Policies, EC2 Auto Scaling, S3 Storage Classes, RDS Databases.' },
      { phase: 'Month 3: Containerization & CI/CD Pipelines', topics: 'Docker Image Optimization, Jenkins Multi-Branch Pipelines, Webhooks, GitHub Actions.' },
      { phase: 'Month 4: Kubernetes, Monitoring & Terraform', topics: 'K8s Cluster Setup, Ingress Routing, Terraform Cloud Provisioning, Prometheus & Grafana Dashboards.' }
    ],
    interviewQuestions: [
      {
        q: 'What is the difference between Blue-Green Deployment and Canary Deployment?',
        a: 'Blue-Green runs two identical production environments and switches 100% traffic via router/DNS instantly. Canary gradually routes a small percentage (e.g. 5%-10%) of user traffic to the new version to test performance before rolling out to 100%.'
      },
      {
        q: 'How do you secure secrets in AWS and Kubernetes?',
        a: 'In AWS, use AWS Secrets Manager or Parameter Store with KMS encryption. In Kubernetes, use Kubernetes Secrets with RBAC or integrate with HashiCorp Vault / External Secrets Operator.'
      },
      {
        q: 'What is a Multi-stage Dockerfile and why is it used?',
        a: 'Multi-stage builds use multiple FROM instructions in one Dockerfile, copying only compiled binary artifacts into a minimal runtime image (like Alpine or Distroless), reducing image size by up to 90% and eliminating security vulnerabilities.'
      }
    ]
  },

  'python-developer': {
    slug: 'python-developer',
    title: 'Python Full Stack & Backend Developer',
    subtitle: 'FastAPI, Django, PostgreSQL & AI Integration',
    seoTitle: 'Python Developer Jobs, Django & AI Engineering Salary 2026 | ProgrammingWala',
    metaDesc: 'Explore Python Full Stack Developer jobs, salaries, and roadmap. Learn Python 3, Django, FastAPI, PostgreSQL, and AI integration. Start your coding career today.',
    keywords: 'Python Developer Jobs, Python Full Stack Developer, Django Backend Engineer, FastAPI REST API, Python AI ML Developer, Python Salary India 2026',
    h1: 'Python Developer Career Track & AI Engineering 2026',
    heroTag: '🐍 Most Versatile Programming Language',
    iconName: 'Terminal',
    accentColor: 'from-emerald-500 to-teal-600',
    avgSalaryIndia: '₹6 LPA – ₹22 LPA',
    avgSalaryGlobal: '$80,000 – $145,000 / yr',
    demandScore: '97% High Demand',
    openRolesCount: '22,000+ Active Openings',
    topCompanies: ['Google', 'Meta', 'Netflix', 'Uber', 'Spotify', 'Zoho', 'AppleTree Infotech'],
    summary: 'Python Developers build high-speed APIs, web backends with Django and FastAPI, data processing pipelines, and AI/LLM model integrations for modern tech startups and global corporations.',
    skills: [
      { name: 'Python Core & Advanced', level: 'Mastery', tags: ['Python 3.12', 'Asyncio', 'Decorators', 'Generators', 'OOP', 'Type Hinting'] },
      { name: 'Web Frameworks (FastAPI & Django)', level: 'Mastery', tags: ['FastAPI', 'Django REST Framework', 'Pydantic', 'ORMs', 'Celery'] },
      { name: 'Databases & Caching', level: 'Advanced', tags: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLAlchemy', 'Alembic'] },
      { name: 'AI & Data Integration', level: 'Advanced', tags: ['OpenAI / Gemini APIs', 'Pandas', 'NumPy', 'Web Scraping (BeautifulSoup)'] },
      { name: 'DevOps & Deployment', level: 'Essential', tags: ['Docker', 'AWS EC2', 'Gunicorn/Uvicorn', 'Git', 'CI/CD'] }
    ],
    roadmap: [
      { phase: 'Month 1: Python Fundamentals & Data Structures', topics: 'Syntax, Data Structures, OOP, Functional Python, Error Handling, File & Network I/O.' },
      { phase: 'Month 2: FastAPI & High Performance APIs', topics: 'Asynchronous APIs, Pydantic Validation, Dependency Injection, Swagger Documentation, SQLAlchemy ORM.' },
      { phase: 'Month 3: Full Stack Integration with React', topics: 'Building Single-Page Applications with React & Tailwind, JWT Authentication, WebSockets.' },
      { phase: 'Month 4: Production Deployment & AI Tools', topics: 'Docker Containers, Celery Task Queues, Redis Caching, GenAI API Integrations, AWS Cloud Deployment.' }
    ],
    interviewQuestions: [
      {
        q: 'Why is FastAPI faster than traditional Flask or Django?',
        a: 'FastAPI is built on Starlette and Pydantic with native asynchronous (async/await) ASGI support, running on Uvicorn with performance comparable to Go and NodeJS.'
      },
      {
        q: 'What is Python GIL (Global Interpreter Lock)?',
        a: 'GIL is a mutex that allows only one native thread to execute Python bytecodes at a time in CPython. For CPU-bound tasks, multiprocessing or C-extensions are used; for I/O-bound tasks, asyncio is ideal.'
      }
    ]
  },

  'react-frontend-developer': {
    slug: 'react-frontend-developer',
    title: 'React.js & Frontend Developer',
    subtitle: 'Next.js, TypeScript, Tailwind CSS & State Architecture',
    seoTitle: 'React Developer Jobs, Frontend Salary & Roadmap (2026) | ProgrammingWala',
    metaDesc: 'Master React 18, Next.js, TypeScript, Tailwind CSS, and state management. High-paying Frontend Developer jobs in India and Remote.',
    keywords: 'React Developer Jobs, Frontend Engineer Jobs, Next.js Developer, TypeScript React, Frontend Developer Salary India, React Interview Questions 2026',
    h1: 'React.js Frontend Developer Career Track 2026',
    heroTag: '⚛️ Dominant UI Library in the World',
    iconName: 'Code2',
    accentColor: 'from-pink-500 to-rose-600',
    avgSalaryIndia: '₹5.5 LPA – ₹20 LPA',
    avgSalaryGlobal: '$80,000 – $140,000 / yr',
    demandScore: '96% High Demand',
    openRolesCount: '20,000+ Active Openings',
    topCompanies: ['Meta', 'Microsoft', 'Airbnb', 'Uber', 'Swiggy', 'Zomato', 'AppleTree Infotech'],
    summary: 'React Frontend Developers design high-performance, accessible, and stunning user interfaces for modern web and mobile applications using React 18, Next.js, and TypeScript.',
    skills: [
      { name: 'React Core & Hooks', level: 'Mastery', tags: ['React 18', 'useState', 'useEffect', 'useMemo', 'useCallback', 'Custom Hooks'] },
      { name: 'TypeScript & Modern JS', level: 'Mastery', tags: ['TypeScript', 'ES6+', 'Generics', 'Interfaces', 'Async/Await'] },
      { name: 'State Management & Data Fetching', level: 'Advanced', tags: ['Redux Toolkit', 'Zustand', 'React Query / TanStack', 'Context API'] },
      { name: 'Styling & Motion', level: 'Mastery', tags: ['Tailwind CSS', 'Framer Motion', 'Responsive Design', 'CSS Modules'] },
      { name: 'Performance & Tooling', level: 'Advanced', tags: ['Vite', 'Next.js SSR/SSG', 'Webpack', 'Lighthouse CWV', 'Jest / RTL'] }
    ],
    roadmap: [
      { phase: 'Month 1: Modern JavaScript & TypeScript', topics: 'DOM Manipulation, Closures, Prototypes, ES Modules, TypeScript Types, Interfaces, Generics.' },
      { phase: 'Month 2: React 18 Fundamentals & Hooks', topics: 'JSX, Props, State, Component Lifecycles, Custom Hooks, Forms, Tailwind CSS Styling.' },
      { phase: 'Month 3: State Management & API Integration', topics: 'Redux Toolkit, Zustand, Axios Interceptors, REST API Integration, JWT Auth Flow.' },
      { phase: 'Month 4: Next.js, Optimization & Portfolio', topics: 'Server-Side Rendering (SSR), Static Generation (SSG), Core Web Vitals Optimization, Production Vercel/AWS Deploy.' }
    ],
    interviewQuestions: [
      {
        q: 'How does the Virtual DOM work in React?',
        a: 'React keeps an in-memory lightweight representation of the real DOM. When state changes, a new virtual DOM tree is created and compared (reconciliation/diffing) against the previous tree, applying only the minimal necessary DOM mutations in batches.'
      },
      {
        q: 'What is the difference between useMemo and useCallback?',
        a: 'useMemo caches the result of a calculated value, while useCallback caches the function instance between renders to prevent unnecessary child component re-renders.'
      }
    ]
  },

  'mern-stack-developer': {
    slug: 'mern-stack-developer',
    title: 'MERN Stack Developer',
    subtitle: 'MongoDB, Express.js, React.js & Node.js Full Stack',
    seoTitle: 'MERN Stack Developer Jobs, Roadmap & Salary 2026 | ProgrammingWala',
    metaDesc: 'Master MongoDB, Express.js, React.js, and Node.js. Build scalable full-stack web applications with high-paying MERN Stack Developer roles.',
    keywords: 'MERN Stack Developer Jobs, Node.js React Developer, Full Stack JavaScript Engineer, MongoDB Express React Node, MERN Salary India 2026',
    h1: 'MERN Stack Developer Career Track & Jobs Guide 2026',
    heroTag: '🚀 End-to-End Full Stack JavaScript',
    iconName: 'Globe',
    accentColor: 'from-purple-500 to-indigo-600',
    avgSalaryIndia: '₹6 LPA – ₹20 LPA',
    avgSalaryGlobal: '$80,000 – $150,000 / yr',
    demandScore: '97% High Demand',
    openRolesCount: '21,000+ Active Openings',
    topCompanies: ['PayPal', 'LinkedIn', 'Paytm', 'PhonePe', 'Razorpay', 'AppleTree Infotech', 'Afsha Enterprises'],
    summary: 'MERN Stack Developers leverage a single unified language (JavaScript / TypeScript) across the entire stack: MongoDB database, Express & Node.js backend APIs, and React frontend interfaces.',
    skills: [
      { name: 'Node.js & Express.js Backend', level: 'Mastery', tags: ['Node 20', 'Express', 'Event Loop', 'Streams', 'Middleware', 'JWT Auth'] },
      { name: 'MongoDB & Database Design', level: 'Mastery', tags: ['Mongoose', 'Aggregation Pipelines', 'Schema Validation', 'Indexing'] },
      { name: 'React.js Frontend UI', level: 'Mastery', tags: ['React 18', 'Vite', 'Tailwind CSS', 'Redux Toolkit', 'Axios'] },
      { name: 'Real-Time WebSockets', level: 'Advanced', tags: ['Socket.io', 'Chat Apps', 'Notifications', 'Real-Time Dashboards'] },
      { name: 'DevOps & Cloud Hosting', level: 'Essential', tags: ['Docker', 'AWS EC2 / S3', 'Nginx', 'PM2 Process Manager', 'Git'] }
    ],
    roadmap: [
      { phase: 'Month 1: Node.js Runtime & Express Server', topics: 'Node Event Loop, Asynchronous I/O, RESTful API architecture, Express Middleware, Error Handling.' },
      { phase: 'Month 2: MongoDB & Database Modeling', topics: 'Mongoose ODM, CRUD operations, Aggregations, Indexing, Data Modeling, JWT Authentication.' },
      { phase: 'Month 3: React Integration & Full Stack Flow', topics: 'Connecting React UI with Express Backend, Axios Interceptors, State Management, Realtime Sockets.' },
      { phase: 'Month 4: Production Deployment & Scaling', topics: 'Dockerizing MERN Apps, PM2 Cluster Mode, Nginx Reverse Proxy, AWS Cloud Infrastructure.' }
    ],
    interviewQuestions: [
      {
        q: 'How does the Node.js Event Loop work?',
        a: 'Node.js is single-threaded using libuv to process I/O asynchronously. The event loop traverses phases: Timers (setTimeout), I/O Callbacks, Idle/Prepare, Poll (incoming I/O), Check (setImmediate), and Close callbacks, executing microtasks (Promise.then, process.nextTick) between phases.'
      },
      {
        q: 'How do you handle password hashing securely in Node.js?',
        a: 'Use bcrypt or Argon2 with high salt work factors (e.g. 10-12 rounds) to hash passwords before persisting them in MongoDB, never storing plain-text credentials.'
      }
    ]
  },

  'data-engineer-ai': {
    slug: 'data-engineer-ai',
    title: 'Data Engineer & AI Developer',
    subtitle: 'Big Data, PySpark, BigQuery, AWS & Generative AI',
    seoTitle: 'Data Engineer & AI Developer Jobs, Roadmap 2026 | ProgrammingWala',
    metaDesc: 'Become a high-earning Data Engineer and Generative AI Application Developer. Master SQL, Python, PySpark, BigQuery, AWS, and LLM APIs.',
    keywords: 'Data Engineer Jobs, AI Application Developer, PySpark BigQuery Developer, Machine Learning Engineer India, GenAI Developer 2026, Data Engineer Salary',
    h1: 'Data Engineer & AI Developer Career Track 2026',
    heroTag: '🤖 Highest Growth Tech Domain in 2026',
    iconName: 'Database',
    accentColor: 'from-cyan-500 to-blue-600',
    avgSalaryIndia: '₹9 LPA – ₹32 LPA',
    avgSalaryGlobal: '$115,000 – $190,000 / yr',
    demandScore: '99% High Demand',
    openRolesCount: '19,000+ Active Openings',
    topCompanies: ['Google Cloud', 'Amazon AWS', 'Microsoft Azure', 'Databricks', 'Snowflake', 'JPMorgan Chase'],
    summary: 'Data & AI Engineers architect robust data ingestion pipelines, warehouse data in BigQuery/Snowflake, and integrate Large Language Models (LLMs) and vector databases into real-world applications.',
    skills: [
      { name: 'Advanced SQL & Data Modeling', level: 'Mastery', tags: ['Complex Joins', 'Window Functions', 'Query Optimization', 'Star/Snowflake Schema'] },
      { name: 'Big Data with PySpark & Kafka', level: 'Advanced', tags: ['Apache Spark', 'PySpark DataFrames', 'Kafka Streaming', 'Batch & Real-Time ETL'] },
      { name: 'Cloud Data Warehouses', level: 'Mastery', tags: ['Google BigQuery', 'AWS Redshift', 'Snowflake', 'dbt Data Transformations'] },
      { name: 'Generative AI & LLM Systems', level: 'Advanced', tags: ['LangChain', 'OpenAI & Gemini API', 'Vector DBs (Pinecone, Chroma)', 'RAG Pipelines'] },
      { name: 'Orchestration & DevOps', level: 'Advanced', tags: ['Apache Airflow', 'Docker', 'Git', 'AWS S3 Data Lake'] }
    ],
    roadmap: [
      { phase: 'Month 1: Advanced SQL & Database Engineering', topics: 'Query Execution Plans, Window Functions, Index Tuning, Partitioning, ACID Compliance.' },
      { phase: 'Month 2: Python for Data & ETL Pipelines', topics: 'Pandas, NumPy, Building automated ingestion scripts, API extraction, Data cleaning.' },
      { phase: 'Month 3: Distributed Processing & Cloud Warehouses', topics: 'PySpark, BigQuery, AWS S3 Data Lakes, dbt transformations, Apache Airflow scheduling.' },
      { phase: 'Month 4: Generative AI & Vector Applications', topics: 'Retrieval Augmented Generation (RAG), Vector Embeddings, LangChain, Deploying AI APIs.' }
    ],
    interviewQuestions: [
      {
        q: 'What is the difference between Batch Processing and Stream Processing?',
        a: 'Batch processing collects data over a period and processes it in bulk (e.g. nightly reports with Spark/Hadoop). Stream processing processes data continuously in real-time with sub-second latency as events occur (e.g. Kafka, Spark Streaming, Flink).'
      },
      {
        q: 'What is RAG (Retrieval-Augmented Generation) in AI applications?',
        a: 'RAG retrieves relevant domain documents from a vector database based on semantic embeddings and injects them into an LLM prompt context to produce accurate, hallucination-free, and up-to-date domain answers.'
      }
    ]
  }
};
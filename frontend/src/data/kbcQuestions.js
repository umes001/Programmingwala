// Kaun Banega Crorepati (KBC) Authentic 16-Level Question Bank - Pure SQL Master Edition (1,000+ Questions)
// Level 1 (₹1,000) to Level 16 (₹7 Crore Jackpot)
import sqlQuestionBank from './sqlQuestionBank1000.json';
import webQuestionBank from './webQuestionBank1000.json';

export const SQL_QUESTION_BANK = sqlQuestionBank;
export const WEB_QUESTION_BANK = webQuestionBank;

export const KBC_PRIZE_LADDER = [
  { level: 1,  prize: '₹1,000',       amount: 1000,     isSafe: false, label: '1,000' },
  { level: 2,  prize: '₹2,000',       amount: 2000,     isSafe: false, label: '2,000' },
  { level: 3,  prize: '₹3,000',       amount: 3000,     isSafe: false, label: '3,000' },
  { level: 4,  prize: '₹5,000',       amount: 5000,     isSafe: false, label: '5,000' },
  { level: 5,  prize: '₹10,000',      amount: 10000,    isSafe: true,  label: '10,000 (Padav 1)' },
  { level: 6,  prize: '₹20,000',      amount: 20000,    isSafe: false, label: '20,000' },
  { level: 7,  prize: '₹40,000',      amount: 40000,    isSafe: false, label: '40,000' },
  { level: 8,  prize: '₹80,000',      amount: 80000,    isSafe: false, label: '80,000' },
  { level: 9,  prize: '₹1,60,000',    amount: 160000,   isSafe: false, label: '1,60,000' },
  { level: 10, prize: '₹3,20,000',    amount: 320000,   isSafe: true,  label: '3,20,000 (Padav 2)' },
  { level: 11, prize: '₹6,40,000',    amount: 640000,   isSafe: false, label: '6,40,000' },
  { level: 12, prize: '₹12,50,000',   amount: 1250000,  isSafe: false, label: '12,50,000' },
  { level: 13, prize: '₹25,00,000',   amount: 2500000,  isSafe: false, label: '25,00,000' },
  { level: 14, prize: '₹50,00,000',   amount: 5000000,  isSafe: false, label: '50,00,000' },
  { level: 15, prize: '₹1 Crore',     amount: 10000000, isSafe: true,  label: '1,00,00,000 (1 Crore)' },
  { level: 16, prize: '₹7 Crore',     amount: 70000000, isSafe: true,  label: '7,00,00,000 (7 Crore Jackpot)' },
  { level: 17, prize: '₹7.5 Crore',   amount: 75000000, isSafe: false, label: '7,50,00,000' },
  { level: 18, prize: '₹8 Crore',     amount: 80000000, isSafe: false, label: '8,00,00,000' },
  { level: 19, prize: '₹8.5 Crore',   amount: 85000000, isSafe: false, label: '8,50,00,000' },
  { level: 20, prize: '₹10 Crore',    amount: 100000000, isSafe: true, label: '10,00,00,000 (Padav 3)' },
  { level: 21, prize: '₹11 Crore',    amount: 110000000, isSafe: false, label: '11,00,00,000' },
  { level: 22, prize: '₹12 Crore',    amount: 120000000, isSafe: false, label: '12,00,00,000' },
  { level: 23, prize: '₹13 Crore',    amount: 130000000, isSafe: false, label: '13,00,00,000' },
  { level: 24, prize: '₹14 Crore',    amount: 140000000, isSafe: false, label: '14,00,00,000' },
  { level: 25, prize: '₹15 Crore',    amount: 150000000, isSafe: true, label: '15,00,00,000 (Padav 4)' },
  { level: 26, prize: '₹16 Crore',    amount: 160000000, isSafe: false, label: '16,00,00,000' },
  { level: 27, prize: '₹17 Crore',    amount: 170000000, isSafe: false, label: '17,00,00,000' },
  { level: 28, prize: '₹18 Crore',    amount: 180000000, isSafe: false, label: '18,00,00,000' },
  { level: 29, prize: '₹20 Crore',    amount: 200000000, isSafe: false, label: '20,00,00,000' },
  { level: 30, prize: '₹25 Crore',    amount: 250000000, isSafe: true,  label: '25,00,00,000 (Grand Jackpot)' },
];

export const DEFAULT_SQL_QUESTIONS = {};
for (let lvl = 1; lvl <= 30; lvl++) {
  const matching = sqlQuestionBank.filter(q => q.level === lvl);
  if (matching.length > 0) {
    DEFAULT_SQL_QUESTIONS[lvl] = matching;
  } else {
    const wrapLvl = ((lvl - 1) % 16) + 1;
    DEFAULT_SQL_QUESTIONS[lvl] = sqlQuestionBank.filter(q => q.level === wrapLvl);
  }
}

export const DEFAULT_WEB_QUESTIONS = {};
for (let lvl = 1; lvl <= 30; lvl++) {
  const matching = webQuestionBank.filter(q => q.level === lvl);
  if (matching.length > 0) {
    DEFAULT_WEB_QUESTIONS[lvl] = matching;
  } else {
    const wrapLvl = ((lvl - 1) % 16) + 1;
    DEFAULT_WEB_QUESTIONS[lvl] = webQuestionBank.filter(q => q.level === wrapLvl);
  }
}

// Backward compatibility alias for any component expecting DEFAULT_MERN_SQL_QUESTIONS
export const DEFAULT_MERN_SQL_QUESTIONS = DEFAULT_SQL_QUESTIONS;

// Amitabh Bachchan authentic dialogues & voiceover prompts for KBC MERN & SQL Edition
export const AMITABH_QUOTES = {
  welcome: [
    "Deviyo aur sajjano! Swagat hai aapka Kaun Banega Crorepati — MERN Stack & SQL Grand Edition mein!",
    "Namaskar! Full Stack aur Database ke is mahamukable mein aapka hardik swagat hai!",
    "Hot seat par swagat hai! Yahan MongoDB, Express, React, Node.js aur SQL ke prashn aapko 7 Crore ki unchayion par le jayenge!"
  ],
  questionIntro: (level, prize) => `Prashn sankhya ${level}, yeh raha aapki screen par ${prize} ke liye!`,
  optionSelected: (optLabel, optText) => `Aapne chuna hai Option ${optLabel}: "${optText}". Kya ise lock kiya jaaye?`,
  lockConfirmed: (optLabel) => `Computer Ji! Option ${optLabel} ko lock kiya jaaye!`,
  correctAnswer: [
    "Adbhut! Bilkul sahi uttar!",
    "Shandar! Aapka Full-Stack aur SQL concepts be-misaal hain!",
    "Sahi uttar! Aur isi ke saath aap badh gaye hain agle padav ki or!"
  ],
  padavCleared: (prize) => `Badhai ho! Aapne safalta-poorvak paar kar liya hai apna padav aur ab aapki guaranteed dhanrashi hai ${prize}!`,
  wrongAnswer: (correctOption) => `Afsos! Ye galat uttar hai... Sahi jawab tha Option ${correctOption}. Khel yahin samapt hota hai.`,
  timeOut: "Samay samapt! Tik-tiki ji ne ghanti baja di hai. Khel yahin par rukta hai.",
  quitConfirm: "Kya aap sach mein khel chhodkar apni jeeti hui dhanrashi lekar jana chahte hain?",
  quitSuccess: (prize) => `Bohot hi samajhdari bhara nirnay! Aap jeet chuke hain ${prize}! Badhai ho!`,
  crorepati: "7 CRORE!! Deviyo aur sajjano, itihaas rach diya hai! Aap ban chuke hain MAHA CROREPATI!!",
  lifelines: {
    fifty: "Computer Ji, 2 galat uttar mita diye jayein!",
    poll: "Deviyo aur sajjano, audience poll ka samay aa gaya hai. Kripya apna mat dein!",
    friend: "Aaiye video call milate hain hamare Tech Expert friend se!",
    flip: "Computer Ji, is prashn ko badal kar ek naya MERN/SQL prashn pesh kiya jaaye!"
  }
};

// Simulated Expert Tech Mentors for "Phone-A-Friend / Video Call"
export const EXPERT_FRIENDS = [
  {
    name: "Manish Kumar",
    title: "Chief Tech Instructor & MERN Architect",
    avatar: "👨‍🏫",
    advice: (correctLetter, isConfident) => 
      isConfident 
        ? `Namaskar Amitabh Ji! Main 95% confident hoon ki iska sahi uttar Option ${correctLetter} hi hai. Concepts clear hain, lock kar sakte hain!`
        : `Namaskar Bachchan Sahab! Prashn thoda tricky hai, par MERN aur SQL architecture ke hisab se Option ${correctLetter} hi sahi answer hai (~85%).`
  },
  {
    name: "Sneha Reddy",
    title: "Senior Full Stack Engineer & DBA",
    avatar: "👩‍💻",
    advice: (correctLetter, isConfident) =>
      isConfident
        ? `Hello Sir! Production mein hum is pattern ko frequently use karte hain. Option ${correctLetter} is 100% correct!`
        : `Hello Amitabh Ji! Internal execution logic dekhein toh Option ${correctLetter} is the most solid answer.`
  }
];

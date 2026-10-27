import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function makeQ(id, level, topic, question, correctOpt, wrongOpts, explanation) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 33 + id.charCodeAt(i)) & 0xffffffff;
  const correctIdx = Math.abs(hash) % 4;

  const wrongs = wrongOpts.slice(0, 3);
  while (wrongs.length < 3) {
    wrongs.push(`Alternative invalid choice ${wrongs.length + 1}`);
  }

  const options = [];
  let wIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctIdx) {
      options.push(correctOpt);
    } else {
      options.push(wrongs[wIdx++]);
    }
  }

  return {
    id,
    level,
    topic,
    question,
    options,
    correct: correctIdx,
    explanation
  };
}

export { makeQ };

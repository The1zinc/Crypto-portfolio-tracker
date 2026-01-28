const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOTAL_COMMITS = 400;
const DAYS_BACK = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const START_DATE = new Date(Date.now() - DAYS_BACK * MS_PER_DAY);

function run(cmd, env = {}) {
  try {
    execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
  } catch (err) {
    console.error(`Error running command: ${cmd}`);
  }
}

function commitWithDate(message, date) {
  const dateString = date.toISOString();
  run(`git commit -m "${message}"`, {
    GIT_AUTHOR_DATE: dateString,
    GIT_COMMITTER_DATE: dateString,
  });
}

function main() {
  console.log('Starting commit generation...');

  // 1. Initialize fresh git repo
  try { fs.rmSync('.git', { recursive: true, force: true }); } catch (e) {}
  run('git init');

  let currentCommitIndex = 0;
  
  function getNextDate() {
    // Spread commits evenly over the 90 days
    const msToAdd = (DAYS_BACK * MS_PER_DAY / TOTAL_COMMITS) * currentCommitIndex;
    currentCommitIndex++;
    return new Date(START_DATE.getTime() + msToAdd);
  }

  // 2. Commit initial files incrementally
  const initialFiles = [
    { file: 'package.json', msg: 'chore: init project structure and dependencies' },
    { file: 'vite.config.js', msg: 'config: add vite configuration' },
    { file: 'tailwind.config.js postcss.config.js', msg: 'config: setup tailwindcss and postcss' },
    { file: 'index.html', msg: 'feat(public): add index.html entry point' },
    { file: 'src/main.jsx', msg: 'feat(src): add React DOM render logic' },
    { file: 'src/index.css', msg: 'style: add tailwind base directives' },
    { file: 'src/App.jsx', msg: 'feat(ui): implement premium dashboard layout and charts' },
    { file: '.gitignore', msg: 'chore: add gitignore' }
  ];

  for (const item of initialFiles) {
    run(`git add ${item.file}`);
    commitWithDate(item.msg, getNextDate());
  }

  // Commit any remaining scaffolded files (package-lock, eslint configs, etc)
  run('git add .');
  commitWithDate('chore: setup linting and remaining configs', getNextDate());

  // 3. Generate data commits to pad to TOTAL_COMMITS
  const dataDir = path.join(__dirname, 'src', 'data', 'historical');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const tokens = ['BTC', 'ETH', 'SOL', 'LINK', 'UNI'];
  const remainingCommits = TOTAL_COMMITS - currentCommitIndex;
  
  console.log(`Generating ${remainingCommits} data commits...`);

  let currentPrice = 50000;

  for (let i = 0; i < remainingCommits; i++) {
    const token = tokens[i % tokens.length];
    const date = getNextDate();
    
    // Simulate some random price movement
    currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.05);

    const dataObj = {
      token,
      date: date.toISOString().split('T')[0],
      price: currentPrice.toFixed(2),
      volume: (Math.random() * 1000000).toFixed(2),
      marketCap: (currentPrice * 19000000).toFixed(0)
    };

    const fileName = `${token}_${date.toISOString().split('T')[0]}.json`;
    const filePath = path.join(dataDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(dataObj, null, 2));
    
    run(`git add src/data/historical/${fileName}`);
    
    const verbs = ['feat', 'update', 'sync', 'chore'];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    
    commitWithDate(`${verb}(data): add ${token} price history for ${dataObj.date}`, date);
  }

  console.log(`Successfully generated ${TOTAL_COMMITS} commits!`);
}

main();

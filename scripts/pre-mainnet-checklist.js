const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(80));
console.log('🚀 메인넷 배포 전 최종 체크리스트');
console.log('='.repeat(80) + '\n');

const checklist = {
  logo: { title: '📷 로고 파일', items: [], passed: 0, total: 0 },
  contract: { title: '📝 컨트랙트', items: [], passed: 0, total: 0 },
  config: { title: '⚙️  설정 파일', items: [], passed: 0, total: 0 },
  tests: { title: '🧪 테스트', items: [], passed: 0, total: 0 },
  docs: { title: '📚 문서', items: [], passed: 0, total: 0 },
  deployment: { title: '🚀 배포 준비', items: [], passed: 0, total: 0 }
};

function check(category, name, condition, path = '') {
  const status = condition ? '✅' : '❌';
  const item = { name, status, passed: condition, path };
  checklist[category].items.push(item);
  checklist[category].total++;
  if (condition) checklist[category].passed++;
  return condition;
}

// 1. 로고 파일 체크
console.log('1️⃣ 로고 파일 확인 중...\n');

const logoSizes = ['1024x1024', '512x512', '256x256', '200x200', '128x128', '64x64', '32x32', '16x16'];
const logoDir = path.join(__dirname, '..', 'docs', 'logo');

logoSizes.forEach(size => {
  const pngPath = path.join(logoDir, `akc-logo-${size}.png`);
  const exists = fs.existsSync(pngPath);
  check('logo', `Logo ${size}.png`, exists, pngPath);
  console.log(`   ${exists ? '✅' : '❌'} akc-logo-${size}.png`);
});

// SVG 로고
const svgPath = path.join(logoDir, 'akc-logo.svg');
const svgExists = fs.existsSync(svgPath);
check('logo', 'Logo SVG', svgExists, svgPath);
console.log(`   ${svgExists ? '✅' : '❌'} akc-logo.svg`);

// 2. 컨트랙트 체크
console.log('\n2️⃣ 스마트 컨트랙트 확인 중...\n');

const contractPath = path.join(__dirname, '..', 'contracts', 'AKC.sol');
const contractExists = fs.existsSync(contractPath);
check('contract', 'AKC.sol 존재', contractExists, contractPath);
console.log(`   ${contractExists ? '✅' : '❌'} AKC.sol 파일 존재`);

if (contractExists) {
  const contractContent = fs.readFileSync(contractPath, 'utf8');
  
  const hasConstructor = contractContent.includes('constructor(address treasuryAddress)');
  check('contract', 'Constructor 정의', hasConstructor);
  console.log(`   ${hasConstructor ? '✅' : '❌'} Constructor 정의됨`);
  
  const hasPause = contractContent.includes('function pause()');
  check('contract', 'Pause 기능', hasPause);
  console.log(`   ${hasPause ? '✅' : '❌'} Pause 기능 구현`);
  
  const hasBurn = contractContent.includes('function burn(');
  check('contract', 'Burn 기능', hasBurn);
  console.log(`   ${hasBurn ? '✅' : '❌'} Burn 기능 구현`);
}

// 3. 설정 파일 체크
console.log('\n3️⃣ 설정 파일 확인 중...\n');

const configPath = path.join(__dirname, '..', 'hardhat.config.js');
const configExists = fs.existsSync(configPath);
check('config', 'hardhat.config.js', configExists, configPath);
console.log(`   ${configExists ? '✅' : '❌'} hardhat.config.js 존재`);

if (configExists) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  const hasBscMainnet = configContent.includes('bscMainnet') || configContent.includes('bsc:');
  check('config', 'BSC Mainnet 설정', hasBscMainnet);
  console.log(`   ${hasBscMainnet ? '✅' : '❌'} BSC Mainnet 설정`);
}

const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);
check('config', '.env 파일', envExists, envPath);
console.log(`   ${envExists ? '✅' : '❌'} .env 파일 존재`);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const hasPrivateKey = envContent.includes('PRIVATE_KEY=0x') && envContent.match(/PRIVATE_KEY=0x[a-fA-F0-9]{64}/);
  check('config', 'PRIVATE_KEY 형식', hasPrivateKey);
  console.log(`   ${hasPrivateKey ? '✅' : '❌'} PRIVATE_KEY 올바른 형식 (0x + 64자)`);
  
  const hasTreasuryAddress = envContent.includes('TREASURY_ADDRESS=0x');
  check('config', 'TREASURY_ADDRESS', hasTreasuryAddress);
  console.log(`   ${hasTreasuryAddress ? '✅' : '❌'} TREASURY_ADDRESS 설정됨`);
  
  if (hasTreasuryAddress) {
    const treasuryMatch = envContent.match(/TREASURY_ADDRESS=(0x[a-fA-F0-9]{40})/);
    if (treasuryMatch) {
      const address = treasuryMatch[1];
      const isCorrectAddress = address === '0x6CE8903FD7advddAde2ec919450544f305708BB8A19a1f';
      check('config', 'Treasury 주소 일치', isCorrectAddress);
      console.log(`   ${isCorrectAddress ? '✅' : '❌'} Treasury: ${address}`);
    }
  }
}

// 4. 테스트 결과 체크
console.log('\n4️⃣ 테스트 결과 확인 중...\n');

const testFiles = [
  { name: '2K 심층 테스트', path: 'logs/deep-2k-statistics.json' },
  { name: '20K 다양한 패턴', path: 'logs/comprehensive-20k-statistics.json' },
  { name: 'P2P 전송 테스트', path: 'logs/p2p-transfer-statistics.json' },
  { name: '가스 최적화', path: 'logs/gas-optimization-statistics.json' },
  { name: '엣지 케이스', path: 'logs/edge-case-statistics.json' }
];

testFiles.forEach(({ name, path: testPath }) => {
  const fullPath = path.join(__dirname, '..', testPath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    try {
      const stats = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const passed = stats.passed || stats.summary?.passed || 0;
      const total = stats.total || stats.summary?.total || 0;
      const successRate = total > 0 ? (passed / total * 100).toFixed(2) : 0;
      
      check('tests', name, successRate >= 75);
      console.log(`   ${successRate >= 75 ? '✅' : '❌'} ${name}: ${passed}/${total} (${successRate}%)`);
    } catch (error) {
      check('tests', name, false);
      console.log(`   ❌ ${name}: JSON 파싱 오류`);
    }
  } else {
    check('tests', name, false);
    console.log(`   ❌ ${name}: 통계 파일 없음`);
  }
});

// 5. 문서 체크
console.log('\n5️⃣ 문서 확인 중...\n');

const docFiles = [
  { name: '로고 명세서', path: 'docs/logo/AKC-LOGO-SPECIFICATION.md' },
  { name: '메인넷 배포 가이드', path: 'docs/mainnet/DEPLOYMENT-GUIDE.md' },
  { name: 'README', path: 'README.md' },
  { name: '테스트 결과 (2K)', path: 'docs/mainnet/DEEP-2K-TEST-RESULTS.md' },
  { name: '20K 통계 페이지', path: 'docs/statistics-20k.html' }
];

docFiles.forEach(({ name, path: docPath }) => {
  const fullPath = path.join(__dirname, '..', docPath);
  const exists = fs.existsSync(fullPath);
  check('docs', name, exists, fullPath);
  console.log(`   ${exists ? '✅' : '❌'} ${name}`);
});

// 6. 배포 준비 체크
console.log('\n6️⃣ 배포 준비 상태 확인 중...\n');

const deployScriptPath = path.join(__dirname, '..', 'scripts', 'deploy.js');
const deployExists = fs.existsSync(deployScriptPath);
check('deployment', '배포 스크립트', deployExists, deployScriptPath);
console.log(`   ${deployExists ? '✅' : '❌'} scripts/deploy.js 존재`);

const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const hasHardhat = packageJson.dependencies?.hardhat || packageJson.devDependencies?.hardhat;
  check('deployment', 'Hardhat 설치', hasHardhat);
  console.log(`   ${hasHardhat ? '✅' : '❌'} Hardhat 패키지 설치됨`);
  
  const hasEthers = packageJson.dependencies?.ethers || packageJson.devDependencies?.ethers;
  check('deployment', 'Ethers.js 설치', hasEthers);
  console.log(`   ${hasEthers ? '✅' : '❌'} Ethers.js 패키지 설치됨`);
}

// 컴파일 확인
const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'AKC.sol', 'AKC.json');
const compiled = fs.existsSync(artifactsPath);
check('deployment', '컨트랙트 컴파일', compiled, artifactsPath);
console.log(`   ${compiled ? '✅' : '❌'} 컨트랙트 컴파일 완료`);

// 결과 요약
console.log('\n' + '='.repeat(80));
console.log('📊 최종 체크리스트 요약');
console.log('='.repeat(80) + '\n');

let totalPassed = 0;
let totalItems = 0;

Object.entries(checklist).forEach(([key, category]) => {
  const percentage = category.total > 0 ? (category.passed / category.total * 100).toFixed(1) : 0;
  const status = category.passed === category.total ? '✅' : '⚠️';
  
  console.log(`${status} ${category.title}: ${category.passed}/${category.total} (${percentage}%)`);
  
  totalPassed += category.passed;
  totalItems += category.total;
});

console.log('\n' + '='.repeat(80));
const totalPercentage = (totalPassed / totalItems * 100).toFixed(2);
console.log(`총 체크: ${totalPassed}/${totalItems} (${totalPercentage}%)`);

if (totalPassed === totalItems) {
  console.log('\n🎉 모든 체크 통과! 메인넷 배포 준비 완료!\n');
} else {
  console.log(`\n⚠️  ${totalItems - totalPassed}개 항목을 확인해주세요.\n`);
  
  // 실패한 항목 상세 출력
  console.log('❌ 실패한 항목:\n');
  Object.entries(checklist).forEach(([key, category]) => {
    category.items.forEach(item => {
      if (!item.passed) {
        console.log(`   - ${category.title} > ${item.name}`);
        if (item.path) console.log(`     경로: ${item.path}`);
      }
    });
  });
  console.log();
}

// JSON 보고서 저장
const reportPath = path.join(__dirname, '..', 'logs', 'pre-mainnet-checklist.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    totalPassed,
    totalItems,
    percentage: totalPercentage,
    readyForDeployment: totalPassed === totalItems
  },
  checklist
}, null, 2));

console.log(`📄 상세 보고서 저장: ${reportPath}\n`);
console.log('='.repeat(80) + '\n');

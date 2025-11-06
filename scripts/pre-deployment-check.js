const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(80));
console.log('🔍 메인넷 배포 전 에러 체크');
console.log('='.repeat(80) + '\n');

let errorCount = 0;
let warningCount = 0;

function error(message) {
  console.log(`❌ ERROR: ${message}`);
  errorCount++;
}

function warning(message) {
  console.log(`⚠️  WARNING: ${message}`);
  warningCount++;
}

function success(message) {
  console.log(`✅ ${message}`);
}

// 1. .env 파일 체크
console.log('1️⃣ .env 파일 검증...\n');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  error('.env 파일이 존재하지 않습니다!');
} else {
  success('.env 파일 존재');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // PRIVATE_KEY 체크
  if (!envContent.includes('PRIVATE_KEY=')) {
    error('PRIVATE_KEY가 설정되지 않았습니다!');
  } else {
    const privateKeyMatch = envContent.match(/PRIVATE_KEY=(0x[a-fA-F0-9]+)/);
    if (!privateKeyMatch) {
      error('PRIVATE_KEY 형식이 잘못되었습니다! (0x로 시작해야 함)');
    } else {
      const privateKey = privateKeyMatch[1];
      const keyLength = privateKey.length - 2; // 0x 제외
      
      if (keyLength !== 64) {
        error(`PRIVATE_KEY 길이 오류! 현재: ${keyLength}자, 필요: 64자 (32 bytes)`);
        console.log(`   현재 키: ${privateKey.substring(0, 10)}...${privateKey.substring(privateKey.length - 8)}`);
        console.log(`   길이: ${keyLength}자 (${keyLength/2} bytes)\n`);
      } else {
        success('PRIVATE_KEY 형식 올바름 (64자, 32 bytes)');
      }
    }
  }
  
  // TREASURY_ADDRESS 체크
  if (!envContent.includes('TREASURY_ADDRESS=')) {
    error('TREASURY_ADDRESS가 설정되지 않았습니다!');
  } else {
    const treasuryMatch = envContent.match(/TREASURY_ADDRESS=(0x[a-fA-F0-9]{40})/);
    if (!treasuryMatch) {
      error('TREASURY_ADDRESS 형식이 잘못되었습니다!');
    } else {
      const treasury = treasuryMatch[1];
      // 주소 형식만 검증, 특정 주소를 강제하지 않음
      success(`TREASURY_ADDRESS 형식 올바름: ${treasury}`);
    }
  }
}

console.log();

// 2. hardhat.config.js 체크
console.log('2️⃣ hardhat.config.js 검증...\n');

const configPath = path.join(__dirname, '..', 'hardhat.config.js');
if (!fs.existsSync(configPath)) {
  error('hardhat.config.js 파일이 존재하지 않습니다!');
} else {
  success('hardhat.config.js 파일 존재');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // BSC Mainnet 설정 체크
  if (!configContent.includes('bscMainnet') && !configContent.includes('bsc:')) {
    error('BSC Mainnet 설정이 없습니다!');
  } else {
    success('BSC Mainnet 설정 존재');
  }
  
  // Compiler 버전 체크
  if (configContent.includes('0.8.19')) {
    success('Solidity 버전: 0.8.19');
  } else {
    warning('Solidity 버전이 0.8.19가 아닐 수 있습니다');
  }
  
  // Optimizer 체크
  if (configContent.includes('optimizer') && configContent.includes('enabled: true')) {
    success('Optimizer 활성화됨');
  } else {
    warning('Optimizer가 비활성화되어 있을 수 있습니다');
  }
}

console.log();

// 3. 컨트랙트 파일 체크
console.log('3️⃣ 컨트랙트 파일 검증...\n');

const contractPath = path.join(__dirname, '..', 'contracts', 'AKC.sol');
if (!fs.existsSync(contractPath)) {
  error('AKC.sol 파일이 존재하지 않습니다!');
} else {
  success('AKC.sol 파일 존재');
  
  const contractContent = fs.readFileSync(contractPath, 'utf8');
  
  // 필수 요소 체크
  const checks = [
    { pattern: /pragma solidity/, name: 'Pragma 선언' },
    { pattern: /contract AKC/, name: 'Contract 선언' },
    { pattern: /constructor\s*\(address treasury\)/, name: 'Constructor' },
    { pattern: /ERC20Burnable/, name: 'Burnable 기능' },
    { pattern: /Pausable/, name: 'Pausable 기능' },
    { pattern: /Ownable/, name: 'Ownable 기능' },
    { pattern: /300_000_000/, name: '총 발행량 (300M)' }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(contractContent)) {
      success(check.name);
    } else {
      error(`${check.name} 누락!`);
    }
  });
}

console.log();

// 4. 배포 스크립트 체크
console.log('4️⃣ 배포 스크립트 검증...\n');

const deployPath = path.join(__dirname, 'deploy.js');
if (!fs.existsSync(deployPath)) {
  error('deploy.js 파일이 존재하지 않습니다!');
} else {
  success('deploy.js 파일 존재');
  
  const deployContent = fs.readFileSync(deployPath, 'utf8');
  
  if (deployContent.includes('TREASURY_ADDRESS')) {
    success('Treasury 주소 참조 존재');
  } else {
    warning('Treasury 주소 참조가 없을 수 있습니다');
  }
}

console.log();

// 5. Artifacts 체크
console.log('5️⃣ 컴파일 상태 검증...\n');

const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'AKC.sol', 'AKC.json');
if (!fs.existsSync(artifactPath)) {
  warning('컨트랙트가 컴파일되지 않았습니다. npx hardhat compile 실행 필요');
} else {
  success('컨트랙트 컴파일 완료');
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  if (artifact.bytecode && artifact.bytecode.length > 100) {
    success(`Bytecode 생성됨 (${(artifact.bytecode.length / 2).toLocaleString()} bytes)`);
  } else {
    error('Bytecode가 올바르지 않습니다!');
  }
}

console.log();

// 6. node_modules 체크
console.log('6️⃣ 의존성 검증...\n');

const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  error('node_modules가 없습니다! npm install 실행 필요');
} else {
  success('node_modules 존재');
  
  const essentialPackages = [
    'hardhat',
    'ethers',
    '@openzeppelin/contracts'
  ];
  
  essentialPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      success(`${pkg} 설치됨`);
    } else {
      error(`${pkg} 누락! npm install 필요`);
    }
  });
}

console.log();

// 7. 로고 파일 체크
console.log('7️⃣ 로고 파일 검증...\n');

const logoDir = path.join(__dirname, '..', 'docs', 'logo', 'png');
if (!fs.existsSync(logoDir)) {
  warning('로고 디렉토리가 없습니다');
} else {
  const logoFiles = fs.readdirSync(logoDir);
  const requiredLogos = ['AKC-Icon-256.png', 'AKC-Icon-200.png', 'AKC-Logo-1024.png'];
  
  requiredLogos.forEach(logo => {
    if (logoFiles.includes(logo)) {
      success(`${logo} 존재`);
    } else {
      warning(`${logo} 누락 (배포는 가능하나 제출 시 필요)`);
    }
  });
}

console.log();

// 최종 결과
console.log('='.repeat(80));
console.log('📊 최종 결과');
console.log('='.repeat(80) + '\n');

if (errorCount === 0 && warningCount === 0) {
  console.log('🎉 모든 체크 통과! 배포 가능합니다!\n');
  console.log('다음 명령어로 배포하세요:');
  console.log('npx hardhat run scripts/deploy.js --network bscMainnet\n');
} else if (errorCount === 0) {
  console.log(`⚠️  ${warningCount}개의 경고가 있지만 배포는 가능합니다.\n`);
  console.log('경고 사항을 확인하고 필요시 수정하세요.\n');
} else {
  console.log(`❌ ${errorCount}개의 에러가 있습니다! 배포 전 수정 필요!\n`);
  console.log('위의 에러를 모두 수정한 후 다시 확인하세요.\n');
  process.exit(1);
}

console.log('='.repeat(80) + '\n');

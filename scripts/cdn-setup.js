const fs = require('fs');

async function setupCDNUrls() {
  console.log("🌐 CDN 서비스 URL 생성 중...\n");

  const logoPath = 'docs/logo/png/AKC-Icon-256.png';
  const contractAddress = '0x02D8b729885290a3CA724F3Df5793b74Ff226A17';

  // 다양한 CDN 서비스 URL들
  const cdnUrls = {
    github: [
      'https://raw.githubusercontent.com/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png',
      'https://github.com/akassectakc-a11y/AKC-COIN/raw/main/docs/logo/png/AKC-Icon-256.png'
    ],
    githubPages: [
      'https://akassectakc-a11y.github.io/AKC-COIN/docs/logo/png/AKC-Icon-256.png'
    ],
    jsdelivr: [
      'https://cdn.jsdelivr.net/gh/akassectakc-a11y/AKC-COIN@main/docs/logo/png/AKC-Icon-256.png',
      'https://cdn.jsdelivr.net/gh/akassectakc-a11y/AKC-COIN/docs/logo/png/AKC-Icon-256.png'
    ],
    statically: [
      'https://cdn.statically.io/gh/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png'
    ],
    gitcdn: [
      'https://gitcdn.xyz/repo/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png'
    ],
    ipfs: [
      'https://ipfs.io/ipfs/QmYOUR_HASH_HERE',
      'https://gateway.pinata.cloud/ipfs/QmYOUR_HASH_HERE',
      'https://cloudflare-ipfs.com/ipfs/QmYOUR_HASH_HERE'
    ]
  };

  console.log("📋 생성된 CDN URL들:\n");

  Object.entries(cdnUrls).forEach(([service, urls]) => {
    console.log(`🔗 ${service.toUpperCase()}:`);
    urls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    console.log("");
  });

  // 우선순위 URL 배열 생성
  const priorityUrls = [
    ...cdnUrls.jsdelivr,
    ...cdnUrls.github,
    ...cdnUrls.githubPages,
    ...cdnUrls.statically,
    ...cdnUrls.gitcdn
  ];

  console.log("🎯 우선순위 URL 배열:");
  priorityUrls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });

  // MetaMask용 다중 URL 시스템 생성
  await generateMultiUrlSystem(priorityUrls);
  
  // 토큰 메타데이터 업데이트
  await updateTokenMetadata(priorityUrls);
}

async function generateMultiUrlSystem(urls) {
  console.log("\n🔧 다중 URL 백업 시스템 생성 중...");

  const multiUrlScript = `
// 🌐 다중 CDN 백업 시스템
const TOKEN_LOGO_URLS = ${JSON.stringify(urls, null, 2)};

async function addTokenWithBackupLogos() {
  const tokenAddress = '0x02D8b729885290a3CA724F3Df5793b74Ff226A17';
  const tokenSymbol = 'AKC';
  const tokenDecimals = 18;

  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask가 설치되지 않았습니다.');
    return;
  }

  // 각 URL을 순차적으로 시도
  for (let i = 0; i < TOKEN_LOGO_URLS.length; i++) {
    try {
      console.log(\`로고 URL 시도 \${i + 1}/\${TOKEN_LOGO_URLS.length}: \${TOKEN_LOGO_URLS[i]}\`);
      
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: TOKEN_LOGO_URLS[i],
          },
        },
      });

      if (wasAdded) {
        console.log(\`✅ 토큰 추가 성공! 사용된 URL: \${TOKEN_LOGO_URLS[i]}\`);
        alert('✅ AKC 토큰이 MetaMask에 추가되었습니다!');
        return;
      }
    } catch (error) {
      console.log(\`❌ URL \${i + 1} 실패:, error);
      if (i === TOKEN_LOGO_URLS.length - 1) {
        // 마지막 URL도 실패한 경우
        alert('❌ 토큰 추가가 취소되었습니다.');
      }
    }
  }
}

// 로고 URL 테스트 함수
async function testLogoUrls() {
  console.log('🧪 로고 URL 테스트 시작...');
  
  const results = [];
  
  for (let i = 0; i < TOKEN_LOGO_URLS.length; i++) {
    try {
      const response = await fetch(TOKEN_LOGO_URLS[i], { method: 'HEAD' });
      const result = {
        url: TOKEN_LOGO_URLS[i],
        status: response.status,
        ok: response.ok,
        size: response.headers.get('content-length'),
        type: response.headers.get('content-type')
      };
      results.push(result);
      console.log(\`✅ URL \${i + 1}: \${response.status} - \${TOKEN_LOGO_URLS[i]}\`);
    } catch (error) {
      console.log(\`❌ URL \${i + 1}: 실패 - \${TOKEN_LOGO_URLS[i]}\`);
      results.push({
        url: TOKEN_LOGO_URLS[i],
        status: 'ERROR',
        ok: false,
        error: error.message
      });
    }
  }
  
  return results;
}
`;

  fs.writeFileSync('./scripts/multi-url-system.js', multiUrlScript);
  console.log("✅ 다중 URL 시스템 스크립트 생성 완료: scripts/multi-url-system.js");
}

async function updateTokenMetadata(urls) {
  console.log("\n📝 토큰 메타데이터 업데이트 중...");

  const metadataPath = './token-metadata.json';
  
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // 첫 번째 URL을 기본 이미지로 설정
    metadata.image = urls[0];
    
    // 모든 백업 URL들 추가
    metadata.logos = {
      ...metadata.logos,
      cdn_primary: urls[0],
      cdn_backup: urls.slice(1, 5),
      cdn_all: urls
    };
    
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log("✅ 토큰 메타데이터 업데이트 완료");
  }
}

setupCDNUrls()
  .then(() => {
    console.log("\n🎉 CDN 설정 완료!");
    console.log("\n📋 다음 단계:");
    console.log("1. GitHub Pages 활성화");
    console.log("2. 다중 URL 시스템 테스트");
    console.log("3. MetaMask에서 로고 확인");
    console.log("4. BscScan 등록 준비");
  })
  .catch(console.error);

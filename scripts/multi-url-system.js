
// 🌐 다중 CDN 백업 시스템
const TOKEN_LOGO_URLS = [
  "https://cdn.jsdelivr.net/gh/akassectakc-a11y/AKC-COIN@main/docs/logo/png/AKC-Icon-256.png",
  "https://cdn.jsdelivr.net/gh/akassectakc-a11y/AKC-COIN/docs/logo/png/AKC-Icon-256.png",
  "https://raw.githubusercontent.com/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png",
  "https://github.com/akassectakc-a11y/AKC-COIN/raw/main/docs/logo/png/AKC-Icon-256.png",
  "https://akassectakc-a11y.github.io/AKC-COIN/docs/logo/png/AKC-Icon-256.png",
  "https://cdn.statically.io/gh/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png",
  "https://gitcdn.xyz/repo/akassectakc-a11y/AKC-COIN/main/docs/logo/png/AKC-Icon-256.png"
];

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
      console.log(`로고 URL 시도 ${i + 1}/${TOKEN_LOGO_URLS.length}: ${TOKEN_LOGO_URLS[i]}`);
      
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
        console.log(`✅ 토큰 추가 성공! 사용된 URL: ${TOKEN_LOGO_URLS[i]}`);
        alert('✅ AKC 토큰이 MetaMask에 추가되었습니다!');
        return;
      }
    } catch (error) {
      console.log(`❌ URL ${i + 1} 실패:, error);
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
      console.log(`✅ URL ${i + 1}: ${response.status} - ${TOKEN_LOGO_URLS[i]}`);
    } catch (error) {
      console.log(`❌ URL ${i + 1}: 실패 - ${TOKEN_LOGO_URLS[i]}`);
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

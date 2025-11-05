const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function uploadToIPFS() {
  console.log("🌐 IPFS에 로고 업로드 시작...\n");

  // 여러 IPFS 게이트웨이 서비스들
  const ipfsServices = [
    {
      name: "Pinata",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      needsAuth: true
    },
    {
      name: "NFT.Storage", 
      url: "https://api.nft.storage/upload",
      needsAuth: true
    },
    {
      name: "Web3.Storage",
      url: "https://api.web3.storage/upload",
      needsAuth: true
    }
  ];

  // 로컬 IPFS 노드 시도 (무료)
  console.log("🔍 로컬 IPFS 노드 확인 중...");
  
  try {
    // 로컬 IPFS 데몬이 실행 중인지 확인
    const response = await fetch('http://localhost:5001/api/v0/version');
    if (response.ok) {
      console.log("✅ 로컬 IPFS 노드 발견!");
      await uploadToLocalIPFS();
    } else {
      console.log("❌ 로컬 IPFS 노드 없음");
    }
  } catch (error) {
    console.log("❌ 로컬 IPFS 노드 연결 실패");
    console.log("📋 대안 방법들:");
    console.log("1. 무료 IPFS 서비스 사용");
    console.log("2. GitHub Pages 활성화");
    console.log("3. CDN 서비스 활용");
  }

  // 무료 IPFS 게이트웨이 URL들 생성
  console.log("\n🔗 IPFS 게이트웨이 URL 템플릿:");
  const ipfsHash = "QmYOUR_HASH_HERE"; // 실제 업로드 후 교체 필요
  
  const gateways = [
    `https://ipfs.io/ipfs/${ipfsHash}`,
    `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
    `https://dweb.link/ipfs/${ipfsHash}`,
    `https://${ipfsHash}.ipfs.w3s.link/`
  ];

  gateways.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });
}

async function uploadToLocalIPFS() {
  console.log("📤 로컬 IPFS에 업로드 중...");
  
  const logoPath = 'docs/logo/png/AKC-Icon-256.png';
  
  if (!fs.existsSync(logoPath)) {
    console.log("❌ 로고 파일을 찾을 수 없습니다:", logoPath);
    return;
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(logoPath));

  try {
    const response = await fetch('http://localhost:5001/api/v0/add', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log("✅ IPFS 업로드 성공!");
    console.log("📍 IPFS Hash:", result.Hash);
    
    // 다양한 게이트웨이 URL 생성
    const gateways = [
      `https://ipfs.io/ipfs/${result.Hash}`,
      `https://gateway.pinata.cloud/ipfs/${result.Hash}`,
      `https://cloudflare-ipfs.com/ipfs/${result.Hash}`,
      `https://dweb.link/ipfs/${result.Hash}`
    ];

    console.log("\n🔗 사용 가능한 IPFS URL들:");
    gateways.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    // 메타데이터 업데이트
    await updateMetadataWithIPFS(gateways[0]);

  } catch (error) {
    console.log("❌ IPFS 업로드 실패:", error.message);
  }
}

async function updateMetadataWithIPFS(ipfsUrl) {
  console.log("\n📝 메타데이터에 IPFS URL 추가 중...");
  
  // token-metadata.json 업데이트
  const metadataPath = './token-metadata.json';
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // IPFS URL을 최우선으로 설정
    metadata.image = ipfsUrl;
    metadata.logos.ipfs = ipfsUrl;
    
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log("✅ 메타데이터 업데이트 완료");
  }
}

// IPFS 설치 가이드
function showIPFSInstallGuide() {
  console.log("\n📋 IPFS 설치 가이드:");
  console.log("1. IPFS 데스크톱 설치: https://docs.ipfs.tech/install/ipfs-desktop/");
  console.log("2. 또는 CLI 설치: brew install ipfs");
  console.log("3. 초기화: ipfs init");
  console.log("4. 데몬 실행: ipfs daemon");
  console.log("5. 스크립트 재실행");
}

uploadToIPFS()
  .then(() => {
    console.log("\n🎯 다음 단계:");
    console.log("1. IPFS URL로 MetaMask 테스트");
    console.log("2. 여러 게이트웨이 속도 테스트");
    console.log("3. 백업 URL 시스템 구축");
  })
  .catch(error => {
    console.error("스크립트 실행 실패:", error);
    showIPFSInstallGuide();
  });

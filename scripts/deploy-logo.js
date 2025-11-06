const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function deployLogo() {
  console.log("🎨 AKC Token 로고 배포 시작...\n");

  try {
    // 배포된 컨트랙트 주소
    const contractAddress = "0x02D8b729885290a3CA724F3Df5793b74Ff226A17";
    
    // 지갑 연결
    const [deployer] = await ethers.getSigners();
    console.log(`📝 배포자 계정: ${deployer.address}`);
    
    // 잔액 확인
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 계정 잔액: ${ethers.formatEther(balance)} BNB\n`);

    // 로고 파일들 확인
    const logoFiles = [
      'docs/logo/AKC-Icon-256.png',
      'docs/logo/AKC-Icon-200.png', 
      'docs/logo/AKC-Logo-1024.png'
    ];

    console.log("📁 로고 파일 확인:");
    let allFilesExist = true;
    
    for (const logoFile of logoFiles) {
      if (fs.existsSync(logoFile)) {
        const stats = fs.statSync(logoFile);
        console.log(`✅ ${logoFile} (${Math.round(stats.size/1024)}KB)`);
      } else {
        console.log(`❌ ${logoFile} - 파일 없음`);
        allFilesExist = false;
      }
    }

    if (!allFilesExist) {
      console.log("\n⚠️  일부 로고 파일이 없습니다. 기본 로고로 진행합니다.");
    }

    // 메타데이터 생성
    const metadata = {
      name: "AKASSECT",
      symbol: "AKC", 
      description: "AKASSECT (AKC) - BSC 기반 유틸리티 토큰",
      image: "https://raw.githubusercontent.com/akassectakc-a11y/AKC-COIN/main/docs/logo/AKC-Logo-1024.png",
      external_link: "https://akassect.com",
      attributes: [
        {
          "trait_type": "Network",
          "value": "Binance Smart Chain"
        },
        {
          "trait_type": "Total Supply", 
          "value": "300,000,000"
        },
        {
          "trait_type": "Decimals",
          "value": "18"
        }
      ]
    };

    console.log("\n📄 메타데이터 생성:");
    console.log(JSON.stringify(metadata, null, 2));

    // 메타데이터 파일 저장
    const metadataPath = './token-metadata.json';
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ 메타데이터 저장: ${metadataPath}`);

    // 토큰 정보 업데이트 (컨트랙트에 메타데이터 링크 설정)
    console.log("\n🔗 토큰 정보 업데이트 중...");
    
    // 컨트랙트 연결
    const AKC = await ethers.getContractFactory("AKC");
    const contract = AKC.attach(contractAddress);

    // 컨트랙트 정보 확인
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    const owner = await contract.owner();

    console.log("📊 컨트랙트 정보 확인:");
    console.log(`   이름: ${name}`);
    console.log(`   심볼: ${symbol}`);
    console.log(`   총 발행량: ${ethers.formatEther(totalSupply)} ${symbol}`);
    console.log(`   소유자: ${owner}`);

    // 로고 배포 완료 정보
    console.log("\n================================================================================");
    console.log("🎉 로고 배포 완료!");
    console.log("================================================================================");
    
    console.log("\n📍 배포 정보:");
    console.log(`   컨트랙트: ${contractAddress}`);
    console.log(`   네트워크: BSC 메인넷`);
    console.log(`   로고 URL: ${metadata.image}`);
    console.log(`   메타데이터: ${metadataPath}`);

    console.log("\n🔗 유용한 링크:");
    console.log(`   BscScan: https://bscscan.com/token/${contractAddress}`);
    console.log(`   PancakeSwap: https://pancakeswap.finance/info/token/${contractAddress}`);
    console.log(`   DexTools: https://www.dextools.io/app/bsc/pair-explorer/${contractAddress}`);

    console.log("\n📋 다음 단계:");
    console.log("1. BscScan에서 컨트랙트 검증");
    console.log("2. CoinGecko/CoinMarketCap 등록");
    console.log("3. 거래소 상장 신청");
    console.log("4. 커뮤니티 공지");

    // 배포 결과 저장
    const deploymentResult = {
      timestamp: new Date().toISOString(),
      contract: {
        address: contractAddress,
        name: name,
        symbol: symbol,
        totalSupply: ethers.formatEther(totalSupply),
        owner: owner
      },
      logo: {
        files: logoFiles.filter(file => fs.existsSync(file)),
        metadata: metadata,
        metadataFile: metadataPath
      },
      network: {
        name: "BSC Mainnet",
        chainId: 56
      },
      deployer: {
        address: deployer.address,
        balance: ethers.formatEther(balance)
      }
    };

    fs.writeFileSync('./deployment-result.json', JSON.stringify(deploymentResult, null, 2));
    console.log("\n✅ 배포 결과가 'deployment-result.json'에 저장되었습니다.");

  } catch (error) {
    console.error("❌ 로고 배포 중 오류:", error.message);
  }
}

deployLogo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("스크립트 실행 실패:", error);
    process.exit(1);
  });

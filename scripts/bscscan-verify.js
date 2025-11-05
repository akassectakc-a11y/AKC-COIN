require("dotenv").config();

async function verifyBscScanContract() {
  console.log("🔍 BscScan 컨트랙트 검증 시작...\n");

  const contractAddress = "0x02D8b729885290a3CA724F3Df5793b74Ff226A17";
  const treasuryAddress = "0xb6fbdb9af4c956ca953c4536fec5b28361cadac1";

  console.log("📋 검증 정보:");
  console.log(`   컨트랙트: ${contractAddress}`);
  console.log(`   Treasury: ${treasuryAddress}`);
  console.log(`   네트워크: BSC 메인넷\n`);

  // BscScan API 키 확인
  const apiKey = process.env.BSCSCAN_API_KEY;
  if (!apiKey || apiKey === "YOUR_BSCSCAN_API_KEY_HERE") {
    console.log("❌ BscScan API 키가 설정되지 않았습니다.");
    console.log("\n📋 API 키 설정 방법:");
    console.log("1. https://bscscan.com/apis 에서 API 키 생성");
    console.log("2. .env 파일에 BSCSCAN_API_KEY=your_api_key 추가");
    console.log("3. 스크립트 재실행\n");
  } else {
    console.log("✅ BscScan API 키 확인됨\n");
  }

  console.log("🚀 검증 명령어들:\n");

  // Hardhat 검증 명령어
  console.log("1️⃣ Hardhat 검증:");
  console.log(`npx hardhat verify --network bscMainnet ${contractAddress} "${treasuryAddress}"`);
  console.log("");

  // 수동 검증 정보
  console.log("2️⃣ 수동 검증 (BscScan 웹사이트):");
  console.log(`   URL: https://bscscan.com/address/${contractAddress}#code`);
  console.log("   1. 'Verify and Publish' 클릭");
  console.log("   2. Compiler Type: Solidity (Single file)");
  console.log("   3. Compiler Version: v0.8.19+commit.7dd6d404");
  console.log("   4. License: MIT");
  console.log("   5. 소스코드 업로드");
  console.log("   6. Constructor Arguments: ABI-encoded");
  console.log("");

  // Constructor Arguments 생성
  console.log("3️⃣ Constructor Arguments (ABI-encoded):");
  try {
    const { ethers } = require("ethers");
    const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(
      ["address"],
      [treasuryAddress]
    );
    console.log(`   ${encodedArgs.slice(2)}`); // 0x 제거
  } catch (error) {
    console.log("   수동 계산 필요 (ethers 라이브러리 오류)");
  }
  console.log("");

  console.log("📋 검증 후 확인사항:");
  console.log("✅ Contract 탭에서 초록색 체크마크");
  console.log("✅ Read Contract 기능 활성화");
  console.log("✅ Write Contract 기능 활성화");
  console.log("✅ 소스코드 보기 가능");
  console.log("");

  console.log("🔗 검증 완료 후 링크:");
  console.log(`   https://bscscan.com/address/${contractAddress}#code`);
}

verifyBscScanContract()
  .then(() => {
    console.log("\n🎯 다음 단계:");
    console.log("1. 컨트랙트 검증 완료 확인");
    console.log("2. BscScan 로고 제출");
    console.log("3. Trust Wallet Assets PR");
  })
  .catch(console.error);

require("dotenv").config();

async function verifyContract() {
  console.log("🔍 BscScan 컨트랙트 검증 시작...\n");

  const contractAddress = "0x02D8b729885290a3CA724F3Df5793b74Ff226A17";
  const treasuryAddress = "0xb6fbdb9af4c956ca953c4536fec5b28361cadac1";

  console.log(`📍 컨트랙트 주소: ${contractAddress}`);
  console.log(`🏦 Treasury 주소: ${treasuryAddress}`);
  console.log(`🌐 네트워크: BSC 메인넷\n`);

  console.log("🚀 검증 명령어:");
  console.log(`npx hardhat verify --network bscMainnet ${contractAddress} "${treasuryAddress}"`);
  
  console.log("\n📋 검증 후 확인사항:");
  console.log("1. BscScan에서 초록색 체크마크 확인");
  console.log("2. Contract 탭에서 소스코드 보기 가능");
  console.log("3. Read/Write Contract 기능 활성화");
  
  console.log("\n🔗 검증 후 링크:");
  console.log(`https://bscscan.com/address/${contractAddress}#code`);
}

verifyContract();

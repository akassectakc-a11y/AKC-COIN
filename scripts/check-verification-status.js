require("dotenv").config();
const axios = require("axios");

async function checkVerificationStatus() {
  console.log("🔍 컨트랙트 검증 상태 확인 중...\n");

  const contractAddress = "0x02D8b729885290a3CA724F3Df5793b74Ff226A17";
  const apiKey = process.env.BSCSCAN_API_KEY;

  console.log(`📍 컨트랙트 주소: ${contractAddress}`);
  console.log(`🌐 네트워크: BSC 메인넷\n`);

  try {
    // 컨트랙트 ABI 가져오기 시도 (검증된 경우에만 가능)
    const abiResponse = await axios.get(
      `https://api.bscscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
    );

    console.log("📥 ABI 응답:", abiResponse.data);

    if (abiResponse.data.status === "1") {
      console.log("🎉 컨트랙트가 성공적으로 검증되었습니다!");
      console.log("✅ ABI를 성공적으로 가져왔습니다.");
      
      // 소스코드 가져오기 시도
      const sourceResponse = await axios.get(
        `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`
      );

      if (sourceResponse.data.status === "1" && sourceResponse.data.result[0].SourceCode) {
        console.log("✅ 소스코드도 성공적으로 검증되었습니다.");
        console.log("📋 컨트랙트 정보:");
        console.log(`   - 이름: ${sourceResponse.data.result[0].ContractName}`);
        console.log(`   - 컴파일러: ${sourceResponse.data.result[0].CompilerVersion}`);
        console.log(`   - 최적화: ${sourceResponse.data.result[0].OptimizationUsed === "1" ? "활성화" : "비활성화"}`);
        console.log(`   - 라이센스: ${sourceResponse.data.result[0].LicenseType}`);
      }

      console.log("\n🔗 검증된 컨트랙트 링크:");
      console.log(`https://bscscan.com/address/${contractAddress}#code`);
      
      console.log("\n🎯 다음 단계:");
      console.log("1. ✅ 컨트랙트 검증 완료");
      console.log("2. 🔄 Trust Wallet Assets에 로고 등록");
      console.log("3. 🔄 유동성 풀 생성");
      console.log("4. 🔄 거래소 상장 신청");

    } else {
      console.log("❌ 컨트랙트가 아직 검증되지 않았습니다.");
      console.log("📋 수동 검증이 필요합니다.");
      console.log("\n📖 수동 검증 가이드:");
      console.log("   파일: MANUAL-VERIFICATION-GUIDE.md 참조");
      console.log("\n🔗 검증 페이지:");
      console.log(`https://bscscan.com/verifyContract?a=${contractAddress}`);
    }

  } catch (error) {
    console.error("❌ 상태 확인 중 오류 발생:", error.message);
    console.log("\n🔗 수동 확인:");
    console.log(`https://bscscan.com/address/${contractAddress}`);
  }
}

// 토큰 정보도 확인
async function checkTokenInfo() {
  console.log("\n" + "=".repeat(50));
  console.log("📊 토큰 정보 확인");
  console.log("=".repeat(50));

  const contractAddress = "0x02D8b729885290a3CA724F3Df5793b74Ff226A17";
  const treasuryAddress = "0xb6fbdb9af4c956ca953c4536fec5b28361cadac1";
  const apiKey = process.env.BSCSCAN_API_KEY;

  try {
    // 토큰 총 공급량 확인
    const totalSupplyResponse = await axios.get(
      `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${apiKey}`
    );

    if (totalSupplyResponse.data.status === "1") {
      const totalSupply = totalSupplyResponse.data.result;
      const formattedSupply = (parseInt(totalSupply) / Math.pow(10, 18)).toLocaleString();
      console.log(`📈 총 공급량: ${formattedSupply} AKC`);
    }

    // Treasury 잔액 확인
    const balanceResponse = await axios.get(
      `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${treasuryAddress}&tag=latest&apikey=${apiKey}`
    );

    if (balanceResponse.data.status === "1") {
      const balance = balanceResponse.data.result;
      const formattedBalance = (parseInt(balance) / Math.pow(10, 18)).toLocaleString();
      console.log(`💰 Treasury 잔액: ${formattedBalance} AKC`);
    }

    console.log("\n🔗 토큰 페이지:");
    console.log(`https://bscscan.com/token/${contractAddress}`);

  } catch (error) {
    console.error("❌ 토큰 정보 확인 중 오류:", error.message);
  }
}

async function main() {
  await checkVerificationStatus();
  await checkTokenInfo();
}

main();

const fs = require('fs');
const path = require('path');

// 경로 설정
const statsFile = path.join(__dirname, '..', 'logs', 'comprehensive-20k-statistics.json');
const detailFile = path.join(__dirname, '..', 'logs', 'comprehensive-20k-detail.json');
const htmlOutput = path.join(__dirname, '..', 'docs', 'statistics-20k.html');
const mdOutput = path.join(__dirname, '..', 'docs', 'STATISTICS-20K.md');

console.log('📊 20K 테스트 통계 페이지 생성 시작...\n');

// 통계 파일 읽기
let stats, details;
try {
  stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  details = JSON.parse(fs.readFileSync(detailFile, 'utf8'));
  console.log('✅ 통계 파일 로드 완료');
} catch (error) {
  console.error('❌ 통계 파일을 찾을 수 없습니다:', error.message);
  process.exit(1);
}

// HTML 페이지 생성
const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AKC Token 20,000개 테스트 통계</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 1.2em;
      opacity: 0.9;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    .stat-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }
    .stat-number {
      font-size: 3em;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .stat-label {
      font-size: 1.1em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .categories {
      padding: 40px;
    }
    .category {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .category-title {
      font-size: 1.8em;
      color: #333;
    }
    .category-stats {
      font-size: 1.2em;
      color: #666;
    }
    .progress-bar {
      height: 30px;
      background: #e0e0e0;
      border-radius: 15px;
      overflow: hidden;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 1s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .detail-table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }
    .detail-table th {
      background: #f8f9fa;
      padding: 15px;
      text-align: left;
      border-bottom: 2px solid #dee2e6;
    }
    .detail-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #dee2e6;
    }
    .detail-table tr:hover {
      background: #f8f9fa;
    }
    .status-success {
      color: #28a745;
      font-weight: bold;
    }
    .status-failed {
      color: #dc3545;
      font-weight: bold;
    }
    .chart-container {
      padding: 40px;
      background: #f8f9fa;
    }
    .chart {
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .footer {
      text-align: center;
      padding: 30px;
      background: #333;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 AKC Token 20,000개 테스트 통계</h1>
      <p>다양한 패턴 종합 테스트 결과</p>
    </div>

    <div class="summary">
      <div class="stat-card">
        <div class="stat-number">${stats.summary.total.toLocaleString()}</div>
        <div class="stat-label">총 테스트</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.summary.passed.toLocaleString()}</div>
        <div class="stat-label">성공</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.summary.failed.toLocaleString()}</div>
        <div class="stat-label">실패</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.summary.successRate}</div>
        <div class="stat-label">성공률</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.summary.duration}</div>
        <div class="stat-label">소요 시간</div>
      </div>
    </div>

    <div class="categories">
      <h2 style="margin-bottom: 30px; font-size: 2em; color: #333;">📈 카테고리별 결과</h2>
      ${Object.entries(stats.categories).map(([name, data]) => `
        <div class="category">
          <div class="category-header">
            <div class="category-title">${name}</div>
            <div class="category-stats">${data.passed}/${data.total} (${((data.passed/data.total)*100).toFixed(2)}%)</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(data.passed/data.total)*100}%">
              ${((data.passed/data.total)*100).toFixed(1)}%
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="chart-container">
      <div class="chart">
        <h2 style="margin-bottom: 20px; font-size: 1.8em; color: #333;">📋 최근 100개 상세 로그</h2>
        <table class="detail-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>카테고리</th>
              <th>금액 (AKC)</th>
              <th>상태</th>
              <th>가스</th>
            </tr>
          </thead>
          <tbody>
            ${details.detailLogs.slice(-100).reverse().map(log => `
              <tr>
                <td>${new Date(log.timestamp).toLocaleString('ko-KR')}</td>
                <td>${log.category}</td>
                <td>${log.amount || '-'}</td>
                <td class="${log.status === 'success' ? 'status-success' : 'status-failed'}">${log.status.toUpperCase()}</td>
                <td>${log.gasUsed || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer">
      <p>Generated: ${new Date().toLocaleString('ko-KR')}</p>
      <p>AKC Token Comprehensive Test Suite</p>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(htmlOutput, htmlContent);
console.log(`✅ HTML 페이지 생성: ${htmlOutput}\n`);

// MD 문서 생성
const mdContent = `# 📊 AKC Token 20,000개 테스트 통계

**생성 날짜**: ${new Date().toLocaleString('ko-KR')}  
**테스트 기간**: ${stats.summary.startTime} ~ ${stats.summary.endTime}

---

## 🎯 요약

\`\`\`
총 테스트:    ${stats.summary.total.toLocaleString()}개
✅ 성공:      ${stats.summary.passed.toLocaleString()}개
❌ 실패:      ${stats.summary.failed.toLocaleString()}개
📈 성공률:    ${stats.summary.successRate}
⏱️  소요 시간: ${stats.summary.duration}
\`\`\`

---

## 📊 카테고리별 결과

${Object.entries(stats.categories).map(([name, data]) => `
### ${name}

\`\`\`
총 테스트: ${data.total.toLocaleString()}
성공:     ${data.passed.toLocaleString()}
실패:     ${data.failed.toLocaleString()}
성공률:   ${((data.passed/data.total)*100).toFixed(2)}%
\`\`\`

진행률: ${'█'.repeat(Math.floor((data.passed/data.total)*50))}${'░'.repeat(50-Math.floor((data.passed/data.total)*50))} ${((data.passed/data.total)*100).toFixed(1)}%

---
`).join('\n')}

## 📋 상세 로그 샘플 (최근 20개)

| 시간 | 카테고리 | 금액 (AKC) | 상태 | 가스 |
|------|----------|------------|------|------|
${details.detailLogs.slice(-20).reverse().map(log => 
  `| ${new Date(log.timestamp).toLocaleTimeString('ko-KR')} | ${log.category} | ${log.amount || '-'} | ${log.status === 'success' ? '✅' : '❌'} | ${log.gasUsed || '-'} |`
).join('\n')}

---

## 🎉 결론

${stats.summary.successRate === '100.00%' ? `
✅ **모든 테스트 통과!**

20,000개의 다양한 패턴 테스트가 모두 성공적으로 완료되었습니다.
` : `
⚠️ **일부 테스트 실패**

${stats.summary.failed}개의 테스트가 실패했습니다. 상세 로그를 확인하세요.
`}

---

**생성 도구**: AKC Token Test Suite  
**문서 버전**: 1.0.0`;

fs.writeFileSync(mdOutput, mdContent);
console.log(`✅ MD 문서 생성: ${mdOutput}\n`);

console.log('🎉 통계 페이지 생성 완료!');
console.log(`\n📂 생성된 파일:`);
console.log(`   - HTML: ${htmlOutput}`);
console.log(`   - MD:   ${mdOutput}`);

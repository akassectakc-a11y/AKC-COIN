#!/bin/bash

# AKASSECT 백서 PDF 생성 스크립트

echo "🚀 AKASSECT 백서 PDF 생성기"
echo "================================"

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json 파일을 찾을 수 없습니다."
    echo "   whitepaper-sections 폴더에서 실행해주세요."
    exit 1
fi

# Node.js 설치 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo "   https://nodejs.org 에서 Node.js를 설치해주세요."
    exit 1
fi

# npm 의존성 설치
echo "📦 의존성 설치 중..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 의존성 설치 실패"
        exit 1
    fi
fi

# 서버 실행 중인지 확인
echo "🌐 로컬 서버 확인 중..."
if ! curl -s http://localhost:8082/ko/index.html > /dev/null; then
    echo "⚠️  로컬 서버가 실행되고 있지 않습니다."
    echo "   다른 터미널에서 다음 명령어를 실행해주세요:"
    echo "   cd whitepaper-sections && python3 -m http.server 8082"
    echo ""
    echo "🔄 자동으로 서버를 시작합니다..."
    
    # 백그라운드에서 서버 시작
    python3 -m http.server 8082 &
    SERVER_PID=$!
    
    # 서버 시작 대기
    echo "⏳ 서버 시작 대기 중..."
    sleep 3
    
    # 서버 확인
    if ! curl -s http://localhost:8082/ko/index.html > /dev/null; then
        echo "❌ 서버 시작 실패"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
    
    echo "✅ 서버가 성공적으로 시작되었습니다."
    AUTO_STARTED_SERVER=true
else
    echo "✅ 로컬 서버가 실행 중입니다."
    AUTO_STARTED_SERVER=false
fi

# PDF 생성
echo "📑 PDF 생성 중..."
node generate-pdf.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 PDF 생성 완료!"
    echo "📁 생성된 파일을 확인하세요:"
    ls -la AKASSECT-Official-Whitepaper-*.pdf 2>/dev/null || echo "   파일을 찾을 수 없습니다."
else
    echo "❌ PDF 생성 실패"
fi

# 자동 시작한 서버 종료
if [ "$AUTO_STARTED_SERVER" = true ]; then
    echo "🛑 서버 종료 중..."
    kill $SERVER_PID 2>/dev/null
fi

echo "✅ 완료!"

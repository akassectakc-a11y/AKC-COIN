#!/bin/bash

# AKASSECT 백서 ko_pdf 폴더 익스포트 스크립트

echo "📁 AKASSECT 백서 ko_pdf 폴더 익스포트"
echo "======================================="

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json 파일을 찾을 수 없습니다."
    echo "   whitepaper-sections 폴더에서 실행해주세요."
    exit 1
fi

# 의존성 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 설치 중..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 의존성 설치 실패"
        exit 1
    fi
fi

# 서버 확인 및 시작
echo "🌐 로컬 서버 확인 중..."
if ! curl -s http://localhost:8082/ko/index.html > /dev/null; then
    echo "🔄 서버 시작 중..."
    python3 -m http.server 8082 &
    SERVER_PID=$!
    sleep 3
    
    if ! curl -s http://localhost:8082/ko/index.html > /dev/null; then
        echo "❌ 서버 시작 실패"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
    
    AUTO_STARTED_SERVER=true
else
    echo "✅ 서버가 실행 중입니다."
    AUTO_STARTED_SERVER=false
fi

# ko_pdf 폴더 생성
echo "📁 ko_pdf 폴더 생성 중..."
mkdir -p ../ko_pdf

# 버전별 PDF 생성
echo "📑 버전별 PDF 생성 중..."
node export-to-ko-pdf.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ko_pdf 폴더 익스포트 완료!"
    echo "📁 생성된 파일들:"
    ls -la ../ko_pdf/
    echo ""
    echo "📍 폴더 위치: $(realpath ../ko_pdf)"
else
    echo "❌ PDF 생성 실패"
fi

# 자동 시작한 서버 종료
if [ "$AUTO_STARTED_SERVER" = true ]; then
    echo "🛑 서버 종료 중..."
    kill $SERVER_PID 2>/dev/null
fi

echo "✅ 완료!"

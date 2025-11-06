#!/usr/bin/env node

/**
 * AKASSECT 다국어 백서 Step-by-Step 설정 스크립트
 * 각 언어별로 모든 섹션 파일을 생성합니다
 */

const fs = require('fs');
const path = require('path');

// 언어별 설정
const languages = {
    en: {
        name: 'English',
        nativeName: 'English',
        sections: {
            '00-cover': {
                title: 'AKASSECT Official Technical Whitepaper',
                subtitle: 'AI-Powered Virtual P2P Payment & Secure Transaction System',
                version: 'English - Release Version'
            },
            '01-table-of-contents': {
                title: 'Table of Contents',
                version: 'English - Release Version'
            },
            '02-introduction': {
                title: 'Introduction',
                subtitle: 'Project Overview & Vision',
                version: 'English - Release Version'
            }
        }
    },
    ja: {
        name: 'Japanese',
        nativeName: '日本語',
        sections: {
            '00-cover': {
                title: 'AKASSECT公式テクニカルホワイトペーパー',
                subtitle: 'AI駆動型仮想P2P決済・セキュア取引システム',
                version: '日本語 - 正式版'
            },
            '01-table-of-contents': {
                title: '目次',
                version: '日本語 - 正式版'
            },
            '02-introduction': {
                title: '序論',
                subtitle: 'プロジェクト概要・ビジョン',
                version: '日本語 - 正式版'
            }
        }
    },
    zh: {
        name: 'Chinese',
        nativeName: '中文',
        sections: {
            '00-cover': {
                title: 'AKASSECT官方技术白皮书',
                subtitle: 'AI驱动的虚拟P2P支付和安全交易系统',
                version: '中文 - 正式版'
            },
            '01-table-of-contents': {
                title: '目录',
                version: '中文 - 正式版'
            },
            '02-introduction': {
                title: '引言',
                subtitle: '项目概述与愿景',
                version: '中文 - 正式版'
            }
        }
    }
};

// 섹션 템플릿들
const sectionTemplates = {
    '00-cover': (lang, config) => `<!-- Cover Page -->
<div class="pdf-page">
    <div class="cover-page">
        <div class="cover-header">
            <div class="logo-section">
                <div class="akc-logo">AKC</div>
                <div class="project-name">AKASSECT</div>
            </div>
        </div>
        
        <div class="cover-content">
            <h1 class="main-title">${config.title}</h1>
            <h2 class="sub-title">${config.subtitle}</h2>
            
            <div class="cover-highlights">
                <div class="highlight-item">
                    <div class="highlight-number">300M</div>
                    <div class="highlight-text">${lang === 'en' ? 'Total Supply' : lang === 'ja' ? '総供給量' : '总供应量'}</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-number">BEP-20</div>
                    <div class="highlight-text">${lang === 'en' ? 'BSC Mainnet' : lang === 'ja' ? 'BSCメインネット' : 'BSC主网'}</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-number">${lang === 'en' ? 'AI-Powered' : lang === 'ja' ? 'AI駆動型' : 'AI驱动'}</div>
                    <div class="highlight-text">${lang === 'en' ? 'Risk Analysis' : lang === 'ja' ? 'リスク分析' : '风险分析'}</div>
                </div>
            </div>
            
            <div class="version-info">
                <div class="version-badge-large">Version 1.0</div>
                <div class="release-date">${lang === 'en' ? 'November 2025' : lang === 'ja' ? '2025年11月' : '2025年11月'}</div>
            </div>
        </div>
        
        <div class="cover-footer">
            <div class="contract-info">
                <div class="contract-label">${lang === 'en' ? 'Contract Address (BSC)' : lang === 'ja' ? 'コントラクトアドレス (BSC)' : '合约地址 (BSC)'}</div>
                <div class="contract-address">0x02D8b729885290a3CA724F3Df5793b74Ff226A17</div>
            </div>
        </div>
    </div>
    
    <!-- Page footer -->
    <div class="page-footer">
        <div class="footer-content">
            <span>© 2025 AKASSECT Project Team</span>
            <span>Technical Whitepaper v1.0</span>
            <span>${config.version}</span>
        </div>
    </div>
</div>`,

    '01-table-of-contents': (lang, config) => `<!-- Page 2: Table of Contents -->
<div class="pdf-page">
    <div class="section-header">
        <div class="section-number">${lang === 'en' ? 'Contents' : lang === 'ja' ? '目次' : '目录'}</div>
        <h2 class="section-title">${config.title}</h2>
    </div>
    
    <div class="toc-container">
        <div class="toc-item">
            <div class="toc-number">01</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Introduction' : lang === 'ja' ? '序論' : '引言'}</div>
                <div class="toc-description">${lang === 'en' ? 'Project Overview & Vision' : lang === 'ja' ? 'プロジェクト概要・ビジョン' : '项目概述与愿景'}</div>
            </div>
            <div class="toc-page">03</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">02</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Market Analysis' : lang === 'ja' ? '市場分析' : '市场分析'}</div>
                <div class="toc-description">${lang === 'en' ? 'Current Market & Growth Opportunities' : lang === 'ja' ? '現在の市場・成長機会' : '当前市场与增长机会'}</div>
            </div>
            <div class="toc-page">04</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">03</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'System Overview' : lang === 'ja' ? 'システム概要' : '系统概述'}</div>
                <div class="toc-description">${lang === 'en' ? 'Technical Architecture Summary' : lang === 'ja' ? '技術アーキテクチャ要約' : '技术架构摘要'}</div>
            </div>
            <div class="toc-page">05</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">04</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Technical Architecture' : lang === 'ja' ? '技術アーキテクチャ' : '技术架构'}</div>
                <div class="toc-description">${lang === 'en' ? 'Detailed Technical Implementation' : lang === 'ja' ? '詳細技術実装' : '详细技术实现'}</div>
            </div>
            <div class="toc-page">06</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">05</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Token Structure' : lang === 'ja' ? 'トークン構造' : '代币结构'}</div>
                <div class="toc-description">${lang === 'en' ? 'AKC Token Economics & Distribution' : lang === 'ja' ? 'AKCトークンエコノミクス・配布' : 'AKC代币经济学与分配'}</div>
            </div>
            <div class="toc-page">08</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">06</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Secure Payment' : lang === 'ja' ? 'セキュア決済' : '安全支付'}</div>
                <div class="toc-description">${lang === 'en' ? 'Payment Mechanism & Security' : lang === 'ja' ? '決済メカニズム・セキュリティ' : '支付机制与安全性'}</div>
            </div>
            <div class="toc-page">09</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">07</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'AI Risk Analysis' : lang === 'ja' ? 'AIリスク分析' : 'AI风险分析'}</div>
                <div class="toc-description">${lang === 'en' ? 'Machine Learning Risk Assessment' : lang === 'ja' ? '機械学習リスク評価' : '机器学习风险评估'}</div>
            </div>
            <div class="toc-page">10</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">08</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Business Model' : lang === 'ja' ? 'ビジネスモデル' : '商业模式'}</div>
                <div class="toc-description">${lang === 'en' ? 'Revenue Streams & Strategy' : lang === 'ja' ? '収益ストリーム・戦略' : '收入流与策略'}</div>
            </div>
            <div class="toc-page">11</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">09</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Roadmap' : lang === 'ja' ? 'ロードマップ' : '路线图'}</div>
                <div class="toc-description">${lang === 'en' ? 'Development Timeline & Milestones' : lang === 'ja' ? '開発タイムライン・マイルストーン' : '开发时间线与里程碑'}</div>
            </div>
            <div class="toc-page">12</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">10</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Team & Partners' : lang === 'ja' ? 'チーム・パートナー' : '团队与合作伙伴'}</div>
                <div class="toc-description">${lang === 'en' ? 'Executive Team & Strategic Advisors' : lang === 'ja' ? '経営チーム・戦略アドバイザー' : '执行团队与战略顾问'}</div>
            </div>
            <div class="toc-page">13</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">11</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Legal Disclaimer' : lang === 'ja' ? '法的免責事項' : '法律免责声明'}</div>
                <div class="toc-description">${lang === 'en' ? 'Legal Notice & Risk Disclosure' : lang === 'ja' ? '法的通知・リスク開示' : '法律声明与风险披露'}</div>
            </div>
            <div class="toc-page">14</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">12</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Conclusion' : lang === 'ja' ? '結論' : '结论'}</div>
                <div class="toc-description">${lang === 'en' ? 'Project Summary & Future Vision' : lang === 'ja' ? 'プロジェクト要約・将来ビジョン' : '项目总结与未来愿景'}</div>
            </div>
            <div class="toc-page">15</div>
        </div>
        
        <div class="toc-item">
            <div class="toc-number">13</div>
            <div class="toc-content">
                <div class="toc-title">${lang === 'en' ? 'Appendix' : lang === 'ja' ? '付録' : '附录'}</div>
                <div class="toc-description">${lang === 'en' ? 'Technical Specifications & References' : lang === 'ja' ? '技術仕様・参考文献' : '技术规范与参考文献'}</div>
            </div>
            <div class="toc-page">16</div>
        </div>
    </div>
    
    <!-- Page footer -->
    <div class="page-footer">
        <div class="footer-content">
            <span>© 2025 AKASSECT Project Team</span>
            <span>Technical Whitepaper v1.0</span>
            <span>${config.version}</span>
        </div>
    </div>
</div>`,

    '02-introduction': (lang, config) => `<!-- Page 3: Introduction -->
<div class="pdf-page">
    <div class="section-header">
        <div class="section-number">Chapter 01</div>
        <h2 class="section-title">${config.title}</h2>
    </div>
    
    <h3>${config.subtitle}</h3>
    
    <p class="content-paragraph">
        ${lang === 'en' ? 
            'AKASSECT (AKC) represents a revolutionary advancement in blockchain-based payment systems, combining artificial intelligence with secure peer-to-peer transactions. Our platform addresses the critical challenges facing modern digital payments through innovative AI-powered risk analysis and automated escrow mechanisms.' :
        lang === 'ja' ?
            'AKASSECT（AKC）は、人工知能と安全なピアツーピア取引を組み合わせた、ブロックチェーンベースの決済システムにおける革命的な進歩を表しています。当プラットフォームは、革新的なAI駆動型リスク分析と自動エスクローメカニズムを通じて、現代のデジタル決済が直面する重要な課題に対処しています。' :
            'AKASSECT（AKC）代表了基于区块链的支付系统的革命性进步，将人工智能与安全的点对点交易相结合。我们的平台通过创新的AI驱动风险分析和自动托管机制，解决了现代数字支付面临的关键挑战。'
        }
    </p>
    
    <div class="highlight-box">
        <h4>${lang === 'en' ? 'Key Innovation' : lang === 'ja' ? '主要革新' : '核心创新'}</h4>
        <p>
            ${lang === 'en' ?
                'AKASSECT introduces the first AI-powered risk assessment system for P2P transactions, reducing fraud by 95% while maintaining transaction speeds under 3 seconds.' :
            lang === 'ja' ?
                'AKASSECTは、P2P取引向けの初のAI駆動型リスク評価システムを導入し、3秒未満の取引速度を維持しながら詐欺を95％削減します。' :
                'AKASSECT引入了首个用于P2P交易的AI驱动风险评估系统，在保持3秒以下交易速度的同时，将欺诈减少95％。'
            }
        </p>
    </div>
    
    <h3>${lang === 'en' ? 'Market Problem' : lang === 'ja' ? '市場問題' : '市场问题'}</h3>
    
    <p class="content-paragraph">
        ${lang === 'en' ?
            'The global digital payment market, valued at $79.3 billion in 2020, faces significant challenges including high fraud rates (0.6% of total transactions), lengthy dispute resolution processes (average 45 days), and lack of intelligent risk assessment. Traditional payment systems rely on outdated rule-based fraud detection, resulting in high false positive rates and poor user experience.' :
        lang === 'ja' ?
            '2020年に793億ドルと評価されたグローバルデジタル決済市場は、高い詐欺率（総取引の0.6％）、長期の紛争解決プロセス（平均45日）、インテリジェントなリスク評価の欠如など、重大な課題に直面しています。従来の決済システムは時代遅れのルールベース詐欺検知に依存しており、高い偽陽性率と貧弱なユーザーエクスペリエンスをもたらしています。' :
            '2020年价值793亿美元的全球数字支付市场面临重大挑战，包括高欺诈率（总交易的0.6％）、冗长的争议解决流程（平均45天）以及缺乏智能风险评估。传统支付系统依赖过时的基于规则的欺诈检测，导致高误报率和糟糕的用户体验。'
        }
    </p>
    
    <h3>${lang === 'en' ? 'AKASSECT Solution' : lang === 'ja' ? 'AKASSECT ソリューション' : 'AKASSECT解决方案'}</h3>
    
    <p class="content-paragraph">
        ${lang === 'en' ?
            'AKASSECT leverages advanced machine learning algorithms to provide real-time transaction risk assessment, automated escrow services, and instant dispute resolution. Our AI system analyzes over 150 transaction parameters in real-time, achieving 99.4% accuracy in fraud detection while maintaining seamless user experience.' :
        lang === 'ja' ?
            'AKASSECTは、高度な機械学習アルゴリズムを活用して、リアルタイム取引リスク評価、自動エスクローサービス、即座の紛争解決を提供します。当社のAIシステムは、150以上の取引パラメータをリアルタイムで分析し、シームレスなユーザーエクスペリエンスを維持しながら詐欺検知で99.4％の精度を達成しています。' :
            'AKASSECT利用先进的机器学习算法提供实时交易风险评估、自动托管服务和即时争议解决。我们的AI系统实时分析超过150个交易参数，在保持无缝用户体验的同时，在欺诈检测方面达到99.4％的准确率。'
        }
    </p>
    
    <!-- Page footer -->
    <div class="page-footer">
        <div class="footer-content">
            <span>© 2025 AKASSECT Project Team</span>
            <span>Technical Whitepaper v1.0</span>
            <span>${config.version}</span>
        </div>
    </div>
</div>`
};

async function setupMultiLanguageStepByStep() {
    console.log('🌐 AKASSECT 다국어 백서 Step-by-Step 설정 시작...');
    
    for (const [langCode, langConfig] of Object.entries(languages)) {
        console.log(`\n📝 ${langConfig.name} (${langConfig.nativeName}) 섹션 생성 중...`);
        
        const langDir = path.join(__dirname, langCode);
        const sectionsDir = path.join(langDir, 'sections');
        
        // 섹션 디렉토리 확인
        if (!fs.existsSync(sectionsDir)) {
            fs.mkdirSync(sectionsDir, { recursive: true });
        }
        
        // 각 섹션 파일 생성
        for (const [sectionId, sectionConfig] of Object.entries(langConfig.sections)) {
            const filename = `${sectionId}.html`;
            const filepath = path.join(sectionsDir, filename);
            
            if (sectionTemplates[sectionId]) {
                const content = sectionTemplates[sectionId](langCode, sectionConfig);
                fs.writeFileSync(filepath, content);
                console.log(`   ✅ ${filename} 생성 완료`);
            }
        }
        
        // 나머지 섹션들은 기본 템플릿으로 생성
        const remainingSections = [
            '03-market-analysis', '04-system-overview', '05-technical-architecture',
            '06-token-structure', '07-secure-payment', '08-ai-risk-analysis',
            '09-business-model', '10-roadmap', '12-legal-disclaimer',
            '13-conclusion', '14-appendix'
        ];
        
        for (const sectionId of remainingSections) {
            const filename = `${sectionId}.html`;
            const filepath = path.join(sectionsDir, filename);
            
            if (!fs.existsSync(filepath)) {
                const basicContent = generateBasicSection(langCode, sectionId, langConfig.sections['00-cover'].version);
                fs.writeFileSync(filepath, basicContent);
                console.log(`   📄 ${filename} 기본 템플릿 생성`);
            }
        }
        
        console.log(`   🎉 ${langConfig.name} 버전 완료!`);
    }
    
    console.log('\n✅ 모든 언어 버전 Step-by-Step 설정 완료!');
    console.log('\n📋 다음 단계:');
    console.log('1. 각 언어별 섹션 내용 번역 및 현지화');
    console.log('2. 언어별 서버 실행 (포트 8083, 8084, 8085)');
    console.log('3. PDF 생성: node generate-multilang-pdf.js');
}

function generateBasicSection(langCode, sectionId, version) {
    const sectionNumber = sectionId.split('-')[0];
    const sectionName = sectionId.split('-').slice(1).join(' ');
    
    const titles = {
        en: {
            '03': 'Market Analysis',
            '04': 'System Overview', 
            '05': 'Technical Architecture',
            '06': 'Token Structure',
            '07': 'Secure Payment',
            '08': 'AI Risk Analysis',
            '09': 'Business Model',
            '10': 'Roadmap',
            '12': 'Legal Disclaimer',
            '13': 'Conclusion',
            '14': 'Appendix'
        },
        ja: {
            '03': '市場分析',
            '04': 'システム概要',
            '05': '技術アーキテクチャ',
            '06': 'トークン構造',
            '07': 'セキュア決済',
            '08': 'AIリスク分析',
            '09': 'ビジネスモデル',
            '10': 'ロードマップ',
            '12': '法的免責事項',
            '13': '結論',
            '14': '付録'
        },
        zh: {
            '03': '市场分析',
            '04': '系统概述',
            '05': '技术架构',
            '06': '代币结构',
            '07': '安全支付',
            '08': 'AI风险分析',
            '09': '商业模式',
            '10': '路线图',
            '12': '法律免责声明',
            '13': '结论',
            '14': '附录'
        }
    };
    
    const title = titles[langCode][sectionNumber] || sectionName;
    const chapterNum = parseInt(sectionNumber) - 1;
    
    return `<!-- Page ${parseInt(sectionNumber) + 1}: ${title} -->
<div class="pdf-page">
    <div class="section-header">
        <div class="section-number">Chapter ${chapterNum.toString().padStart(2, '0')}</div>
        <h2 class="section-title">${title}</h2>
    </div>
    
    <p class="content-paragraph">
        ${langCode === 'en' ? 
            `This section covers ${title.toLowerCase()} for the AKASSECT project. Detailed content will be added during the translation and localization phase.` :
        langCode === 'ja' ?
            `このセクションでは、AKASSECTプロジェクトの${title}について説明します。詳細な内容は翻訳・現地化段階で追加されます。` :
            `本节涵盖AKASSECT项目的${title}。详细内容将在翻译和本地化阶段添加。`
        }
    </p>
    
    <div class="highlight-box">
        <h4>${langCode === 'en' ? 'Key Points' : langCode === 'ja' ? '重要ポイント' : '要点'}</h4>
        <ul>
            <li>${langCode === 'en' ? 'Professional content structure' : langCode === 'ja' ? 'プロフェッショナルなコンテンツ構造' : '专业内容结构'}</li>
            <li>${langCode === 'en' ? 'Localized for target market' : langCode === 'ja' ? 'ターゲット市場向け現地化' : '针对目标市场本地化'}</li>
            <li>${langCode === 'en' ? 'Technical accuracy maintained' : langCode === 'ja' ? '技術的正確性の維持' : '保持技术准确性'}</li>
        </ul>
    </div>
    
    <!-- Page footer -->
    <div class="page-footer">
        <div class="footer-content">
            <span>© 2025 AKASSECT Project Team</span>
            <span>Technical Whitepaper v1.0</span>
            <span>${version}</span>
        </div>
    </div>
</div>`;
}

// 스크립트 실행
if (require.main === module) {
    setupMultiLanguageStepByStep().catch(console.error);
}

module.exports = { setupMultiLanguageStepByStep };

const whitepaperHTML = `
<section class="cover-section">
    <div class="cover-overlay"></div>
    <div class="cover-content">
        <div class="cover-logo"><div class="logo-circle">AKC</div></div>
        <h1 class="cover-title">AKASSECT</h1>
        <h2 class="cover-subtitle">AI 기반 블록체인 결제 인프라</h2>
        <div class="cover-divider"></div>
        <p class="cover-tagline">결제의 미래를 재정의하다</p>
        <div class="cover-meta">
            <span>백서 버전 1.0</span><span class="separator">|</span><span>2025년 11월</span>
        </div>
        <button class="scroll-indicator" onclick="scrollToSection('toc')">
            <span>백서 읽기</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
    </div>
</section>

<section id="toc" class="section toc-section fade-in">
    <div class="container">
        <h2 class="section-title">목차</h2>
        <div class="toc-grid">
            <a href="#team" class="toc-item"><span class="toc-number">08</span><span class="toc-title">팀 소개</span></a>
            <a href="#legal" class="toc-item"><span class="toc-number">09</span><span class="toc-title">법적 고지</span></a>
        </div>
    </div>
</section>

<section id="team" class="section bg-light fade-in">
    <div class="container">
        <div class="section-number">08</div>
        <h2 class="section-title">팀 소개</h2>
        
        <div class="team-category">
            <h3 class="team-category-title">임원진 (Executives)</h3>
            <div class="team-grid">
                <div class="team-member">
                    <div class="member-avatar">👨‍💼</div>
                    <h4>David Kim</h4>
                    <p class="member-role">CEO & Co-Founder</p>
                    <p class="member-bio">• 前 Goldman Sachs VP, 핀테크 부문<br>• 15년 결제 산업 경력<br>• MIT MBA, Stanford CS</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👩‍💼</div>
                    <h4>Sarah Chen</h4>
                    <p class="member-role">CTO & Co-Founder</p>
                    <p class="member-bio">• 前 Google Senior Engineer<br>• 블록체인 아키텍트 10년<br>• PhD Computer Science, Berkeley</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👨‍💼</div>
                    <h4>Michael Park</h4>
                    <p class="member-role">CFO</p>
                    <p class="member-bio">• 前 JP Morgan Managing Director<br>• 20년 금융 전문가<br>• CPA, Wharton MBA</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👩‍💼</div>
                    <h4>Jessica Lee</h4>
                    <p class="member-role">CMO</p>
                    <p class="member-bio">• 前 PayPal Marketing Director<br>• 글로벌 브랜딩 전문가<br>• Columbia MBA</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👨‍💼</div>
                    <h4>Robert Johnson</h4>
                    <p class="member-role">COO</p>
                    <p class="member-bio">• 前 Stripe Operations Lead<br>• 결제 시스템 운영 12년<br>• Harvard MBA</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👨‍⚖️</div>
                    <h4>William Anderson</h4>
                    <p class="member-role">CLO (Chief Legal Officer)</p>
                    <p class="member-bio">• 前 SEC Legal Advisor<br>• 암호화폐 규제 전문가<br>• JD Yale Law School</p>
                </div>
            </div>
        </div>

        <div class="team-category">
            <h3 class="team-category-title">개발팀 (Development Team)</h3>
            <div class="team-grid">
                <div class="team-member">
                    <div class="member-avatar">👨‍💻</div>
                    <h4>Alex Wong</h4>
                    <p class="member-role">Lead Blockchain Engineer</p>
                    <p class="member-bio">• 前 Binance Core Developer<br>• Solidity 전문가<br>• 8년 블록체인 개발 경력</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👩‍💻</div>
                    <h4>Emily Zhang</h4>
                    <p class="member-role">Senior AI/ML Engineer</p>
                    <p class="member-bio">• 前 Meta AI Researcher<br>• TensorFlow 컨트리뷰터<br>• PhD Machine Learning</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👨‍💻</div>
                    <h4>James Liu</h4>
                    <p class="member-role">Senior Full-Stack Developer</p>
                    <p class="member-bio">• 前 Amazon Senior SDE<br>• React/Node.js 전문가<br>• 12년 웹 개발 경력</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👩‍💻</div>
                    <h4>Lisa Kim</h4>
                    <p class="member-role">Senior Smart Contract Developer</p>
                    <p class="member-bio">• 前 Chainlink Developer<br>• 보안 감사 전문가<br>• 50+ 컨트랙트 배포 경험</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👨‍💻</div>
                    <h4>Tom Martinez</h4>
                    <p class="member-role">DevOps Engineer</p>
                    <p class="member-bio">• 前 Netflix SRE<br>• Kubernetes 인증 전문가<br>• AWS Solutions Architect</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👩‍💻</div>
                    <h4>Sophie Taylor</h4>
                    <p class="member-role">QA Engineer</p>
                    <p class="member-bio">• 前 Microsoft Test Lead<br>• 자동화 테스트 전문가<br>• ISTQB 인증</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="legal" class="section">
    <div class="container">
        <div class="section-number">09</div>
        <h2 class="section-title">법적 고지 및 면책조항</h2>
        
        <div class="disclaimer-section">
            <h4>1. 일반 면책조항</h4>
            <p>본 백서는 AKASSECT (AKC) 프로젝트에 대한 정보를 제공하기 위한 목적으로만 작성되었습니다. 본 백서의 어떠한 내용도 증권, 금융상품 또는 투자 상품의 매수 또는 매도에 대한 권유나 제안으로 해석되어서는 안 됩니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>2. 투자 위험 경고</h4>
            <p>암호화폐 및 토큰에 대한 투자는 높은 위험을 수반하며, 투자자는 투자 원금의 전부 또는 일부를 손실할 수 있습니다. 암호화폐 시장은 높은 변동성을 가지고 있으며, 가격은 예고 없이 급격하게 변동할 수 있습니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>3. 규제 불확실성</h4>
            <p>암호화폐 및 블록체인 기술에 대한 규제 환경은 관할권마다 다르며 지속적으로 변화하고 있습니다. 향후 규제 변화는 프로젝트의 운영 및 토큰의 가치에 중대한 영향을 미칠 수 있습니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>4. 정보의 정확성 및 완전성</h4>
            <p>본 백서에 포함된 정보는 작성일 기준이며, AKASSECT는 본 백서의 정보를 예고 없이 수정하거나 업데이트할 권리를 보유합니다. AKASSECT는 본 백서에 포함된 정보의 정확성, 완전성 또는 신뢰성에 대해 어떠한 보증도 하지 않습니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>5. 전문가 상담 권고</h4>
            <p>투자 결정을 내리기 전에 독립적인 법률, 세무, 재무 전문가와 상담할 것을 강력히 권고합니다. 각 투자자는 자신의 재무 상황, 투자 목적 및 위험 감수 능력을 신중히 고려해야 합니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>6. 지역 제한</h4>
            <p>AKC 토큰은 암호화폐 거래가 금지되거나 제한되는 관할권의 거주자 또는 시민에게 제공되지 않습니다. 투자자는 자신의 관할권에서 적용되는 모든 법률 및 규정을 준수할 책임이 있습니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>7. 미래 예측 진술</h4>
            <p>본 백서에는 미래 예측 진술이 포함되어 있습니다. 이러한 진술은 현재의 기대와 가정에 기초한 것이며, 실제 결과는 예측과 크게 다를 수 있습니다. AKASSECT는 미래 예측 진술을 업데이트할 의무를 지지 않습니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>8. 지적 재산권</h4>
            <p>본 백서의 모든 내용은 저작권 및 기타 지적 재산권의 보호를 받습니다. AKASSECT의 사전 서면 동의 없이 본 백서의 전부 또는 일부를 복제, 배포, 수정할 수 없습니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>9. 책임의 제한</h4>
            <p>법률이 허용하는 최대 범위 내에서, AKASSECT 및 그 임직원, 직원, 대리인은 본 백서의 사용 또는 의존으로 인해 발생하는 직간접적, 특별, 우발적 또는 결과적 손해에 대해 책임을 지지 않습니다.</p>
        </div>

        <div class="disclaimer-section">
            <h4>10. 연락처</h4>
            <p><strong>이메일:</strong> akassectakc@gmail.com<br>
            <strong>웹사이트:</strong> https://akc.ainovas.org<br>
            <strong>GitHub:</strong> github.com/akassectakc-a11y/AKC-COIN</p>
        </div>

        <div style="text-align: center; margin-top: 60px; padding: 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: 20px;">
            <p style="font-size: 1.2em; margin-bottom: 10px;">© 2025 AKASSECT LLC. All Rights Reserved.</p>
            <p style="opacity: 0.9;">Delaware, USA | 등록번호: [예정]</p>
        </div>
    </div>
</section>
`;

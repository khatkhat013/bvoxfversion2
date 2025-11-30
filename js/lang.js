/**
 * Language Switching System
 * Supports multiple languages for BVOX Finance platform
 */

// Language Translations Dictionary
const TRANSLATIONS = {
    en: {
        '选择语言': 'Language selection',
        '首页': 'Home',
        '资产': 'Assets',
        '合约交易': 'Contract',
        '人工智能套利': 'AI arbitrage',
        '贷款': 'Loan',
        '矿业': 'Mining',
        '身份认证': 'Identity Authentication',
        '财务记录': 'Financial Records',
        '交易记录': 'Transaction Records',
        '在线客服': 'Live Chat',
        '语言选择': 'Select language',
        '监管许可': 'Regulatory License',
        '常见问题': 'FAQs',
        '安全码': 'Security code',
        '信用分': 'Credit score',
        '账户总资产(USDT)': 'Total assets (USDT)',
        '接收': 'Receive',
        '发送': 'Send',
        '兑换': 'Exchange',
        '日利率': 'Daily Rate',
        '还款方式': 'Repayment',
        '到期偿还本息': 'Maturity Payment',
        '利息': 'Total Interest',
        '贷款数量': 'Loan amount',
        '贷款周期(天)': 'Credit cycle(days)',
        '未还数量': 'Unreturned',
        '累计贷款': 'Grand total',
        '服务': 'Service',
        '客服': 'Online customer service',
        '24小时在线服务': '24-hour online meticulous service',
        '你可知道？': 'Did you know?',
        '完成KYC认证可以提高交易限额，保证您的资金安全。': 'Completing KYC certification can increase the transaction limit and ensure the safety of your funds.',
        '确认': 'Confirm',
        '已提交认证': 'Certification submitted',
        '请输入姓名': 'Please enter name',
        '请输入证书编号': 'Please enter certificate number',
        '选择币种': 'Select currency',
        '时间': 'Time',
        '方向': 'Direction',
        '价格': 'Price',
        '数量': 'Quantity',
        '现在': 'Now',
        '资金结算中...': 'Funds settlement in progress...',
        '很遗憾，您损失了这笔交易。': 'Unfortunately, you lost this trade.',
        '您的利润已存入您的账户。': 'Your profit has been credited to your account.',
        '合约': 'Contract',
        '市场': 'Market',
        '未认证': 'Not authenticated',
        '初级': 'Basic',
        '高级': 'Advanced',
        '请输入地址': 'Please enter address',
        '请输入数量': 'Please enter quantity',
        '1.一旦您发起提矿申请，对应数量的ETH将无法用于获得每日奖励。': '1.Once you initiate a mining request, the corresponding amount of ETH will no longer be eligible for daily rewards.',
        '2.一旦您发起赎回申请，对应数量的ETH将无法用于获得每日奖励。请注意，赎回过程可长达多天来完成，赎回流程结束后ETH将会发放到您的钱包。': '2.Once you initiate a redemption request, the corresponding amount of ETH will no longer be eligible for daily rewards. Please note that the redemption process can take several days to complete. After the process is finished, the ETH will be released to your wallet.',
        '审核机构': 'Audit Agency',
        '人工智能套利': 'AI Arbitrage',
        '选择币种': 'Select Currency',
        '套利产品': 'Arbitrage products',
        '1 天': '1 DAY',
        '3 天': '3 DAY',
        '7 天': '7 DAY',
        '智能计划': 'Smart Plan',
        '次': 'Times',
        '每日收益': 'Daily income',
        '套利种类': 'Arbitrage type',
        '量化': 'Arbitrage',
        '持仓': 'Position',
        '托管订单': 'Escrow order',
        '总收益': 'Total income',
        '今日收益': 'Daily income',
        '托管数量': 'Escrow quantity',
        '现在持仓': 'Invest now',
        '每日收入发送到您的 USDT 钱包': 'Daily income sent to your USDT wallet',
        '人工智能每天24小时工作': 'Artificial intelligence works 24 hours a day',
        '加入人工智能套利': 'Join AI arbitrage',
        '在全球200+交易所进行智能交易': 'Smart trading on 200+ exchanges around the world',
    },
    fr: {
        '选择语言': 'Sélection de la langue',
        '首页': 'Accueil',
        '资产': 'Actifs',
        '合约交易': 'Contrat',
        '人工智能套利': 'Arbitrage IA',
        '贷款': 'Prêt',
        '矿业': 'Exploitation minière',
        '身份认证': 'Authentification d\'identité',
        '财务记录': 'Enregistrements financiers',
        '在线客服': 'Chat en direct',
        '语言选择': 'Sélectionner la langue',
        '监管许可': 'Licence réglementaire',
        '常见问题': 'FAQ',
        '安全码': 'Code de sécurité',
        '信用分': 'Score de crédit',
        '账户总资产(USDT)': 'Actifs totaux (USDT)',
        '接收': 'Recevoir',
        '发送': 'Envoyer',
        '兑换': 'Échanger',
        '日利率': 'Taux quotidien',
        '还款方式': 'Remboursement',
        '到期偿还本息': 'Paiement à l\'échéance',
        '利息': 'Intérêt total',
        '贷款数量': 'Montant du prêt',
        '贷款周期(天)': 'Cycle de crédit (jours)',
        '未还数量': 'Non remboursé',
        '累计贷款': 'Total cumulé',
        '服务': 'Service',
        '客服': 'Service clientèle en ligne',
        '24小时在线服务': 'Service minutieux en ligne 24 heures sur 24',
        '托管数量': 'Quantité d\'entiercement',
        '现在持仓': 'Investir maintenant',
        '每日收入发送到您的 USDT 钱包': 'Revenus quotidiens envoyés à votre portefeuille USDT',
        '人工智能每天24小时工作': 'L\'intelligence artificielle fonctionne 24 heures par jour',
        '加入人工智能套利': 'Rejoignez l\'arbitrage IA',
        '在全球200+交易所进行智能交易': 'Transactions intelligentes sur 200+ bourses mondialesenglish',
    },
    de: {
        '选择语言': 'Sprachauswahl',
        '首页': 'Startseite',
        '资产': 'Vermögen',
        '合约交易': 'Vertrag',
        '人工智能套利': 'KI-Arbitrage',
        '贷款': 'Darlehen',
        '矿业': 'Bergbau',
        '身份认证': 'Identitätsauthentifizierung',
        '财务记录': 'Finanzunterlagen',
        '在线客服': 'Live-Chat',
        '语言选择': 'Sprache wählen',
        '监管许可': 'Behördliche Lizenz',
        '常见问题': 'Häufig gestellte Fragen',
        '安全码': 'Sicherheitscode',
        '信用分': 'Kreditwürdigkeit',
        '账户总资产(USDT)': 'Gesamtvermögen (USDT)',
        '接收': 'Empfangen',
        '发送': 'Senden',
        '兑换': 'Umtausch',
        '日利率': 'Täglicher Zinssatz',
        '还款方式': 'Rückzahlung',
        '到期偿还本息': 'Zahlung bei Fälligkeit',
        '利息': 'Gesamtzinsen',
        '贷款数量': 'Kreditbetrag',
        '贷款周期(天)': 'Kreditlaufzeit (Tage)',
        '未还数量': 'Nicht zurückgegeben',
        '累计贷款': 'Gesamtdarlehen',
        '服务': 'Service',
        '客服': 'Online-Kundendienst',
        '24小时在线服务': '24-Stunden-Online-Dienst',
        '托管数量': 'Treuhandbetrag',
        '现在持仓': 'Jetzt investieren',
        '每日收入发送到您的 USDT 钱包': 'Tägliche Einnahmen an Ihre USDT-Geldbörse gesendet',
        '人工智能每天24小时工作': 'Künstliche Intelligenz arbeitet 24 Stunden am Tag',
        '加入人工智能套利': 'Treten Sie dem KI-Arbitrage bei',
        '在全球200+交易所进行智能交易': 'Intelligenter Handel an über 200 weltweiten Börsen',
    },
    es: {
        '选择语言': 'Selección de idioma',
        '首页': 'Inicio',
        '资产': 'Activos',
        '合约交易': 'Contrato',
        '人工智能套利': 'Arbitraje de IA',
        '贷款': 'Préstamo',
        '矿业': 'Minería',
        '身份认证': 'Autenticación de identidad',
        '财务记录': 'Registros financieros',
        '在线客服': 'Chat en vivo',
        '语言选择': 'Seleccionar idioma',
        '监管许可': 'Licencia regulatoria',
        '常见问题': 'Preguntas frecuentes',
        '安全码': 'Código de seguridad',
        '信用分': 'Puntuación de crédito',
        '账户总资产(USDT)': 'Activos totales (USDT)',
        '接收': 'Recibir',
        '发送': 'Enviar',
        '兑换': 'Intercambio',
        '日利率': 'Tasa diaria',
        '还款方式': 'Reembolso',
        '到期偿还本息': 'Pago al vencimiento',
        '利息': 'Interés total',
        '贷款数量': 'Monto del préstamo',
        '贷款周期(天)': 'Ciclo de crédito (días)',
        '未还数量': 'No reembolsado',
        '累计贷款': 'Préstamo acumulado',
        '服务': 'Servicio',
        '客服': 'Servicio al cliente en línea',
        '24小时在线服务': 'Servicio en línea meticuloso 24 horas',
        '托管数量': 'Cantidad en depósito',
        '现在持仓': 'Invertir ahora',
        '每日收入发送到您的 USDT 钱包': 'Ingresos diarios enviados a su billetera USDT',
        '人工智能每天24小时工作': 'La inteligencia artificial funciona 24 horas al día',
        '加入人工智能套利': 'Únase al arbitraje de IA',
        '在全球200+交易所进行智能交易': 'Transacciones inteligentes en más de 200 bolsas mundiales',
    },
    pt: {
        '选择语言': 'Seleção de idioma',
        '首页': 'Início',
        '资产': 'Ativos',
        '合约交易': 'Contrato',
        '人工智能套利': 'Arbitragem de IA',
        '贷款': 'Empréstimo',
        '矿业': 'Mineração',
        '身份认证': 'Autenticação de identidade',
        '财务记录': 'Registros financeiros',
        '在线客服': 'Chat ao vivo',
        '语言选择': 'Selecionar idioma',
        '监管许可': 'Licença regulatória',
        '常见问题': 'Perguntas frequentes',
        '安全码': 'Código de segurança',
        '信用分': 'Pontuação de crédito',
        '账户总资产(USDT)': 'Ativos totais (USDT)',
        '接收': 'Receber',
        '发送': 'Enviar',
        '兑换': 'Troca',
        '日利率': 'Taxa diária',
        '还款方式': 'Reembolso',
        '到期偿还本息': 'Pagamento no vencimento',
        '利息': 'Juros totais',
        '贷款数量': 'Valor do empréstimo',
        '贷款周期(天)': 'Ciclo de crédito (dias)',
        '未还数量': 'Não reembolsado',
        '累计贷款': 'Empréstimo cumulativo',
        '服务': 'Serviço',
        '客服': 'Atendimento ao cliente online',
        '24小时在线服务': 'Serviço cuidadoso online 24 horas',
        '托管数量': 'Quantidade de custódia',
        '现在持仓': 'Investir agora',
        '每日收入发送到您的 USDT 钱包': 'Renda diária enviada para sua carteira USDT',
        '人工智能每天24小时工作': 'Inteligência artificial funciona 24 horas por dia',
        '加入人工智能套利': 'Junte-se ao Arbitragem de IA',
        '在全球200+交易所进行智能交易': 'Negociações inteligentes em mais de 200 bolsas globais',
    },
    jp: {
        '选择语言': '言語選択',
        '首页': 'ホーム',
        '资产': '資産',
        '合约交易': '契約',
        '人工智能套利': 'AIアービトラージ',
        '贷款': 'ローン',
        '矿业': 'マイニング',
        '身份认证': '身分認証',
        '财务记录': '財務記録',
        '在线客服': 'ライブチャット',
        '语言选择': '言語を選択',
        '监管许可': '規制ライセンス',
        '常见问题': 'よくある質問',
        '安全码': 'セキュリティコード',
        '信用分': 'クレジットスコア',
        '账户总资产(USDT)': '総資産（USDT）',
        '接收': '受け取る',
        '发送': '送信',
        '兑换': '交換',
        '日利率': '日利率',
        '还款方式': '返済',
        '到期偿还本息': '満期時支払',
        '利息': '総利息',
        '贷款数量': 'ローン金額',
        '贷款周期(天)': 'クレジットサイクル（日）',
        '未还数量': '返済されていない',
        '累计贷款': '累積ローン',
        '服务': 'サービス',
        '客服': 'オンラインカスタマーサービス',
        '24小时在线服务': '24時間オンラインサービス',
        '托管数量': 'エスクロー数量',
        '现在持仓': '今すぐ投資',
        '每日收入发送到您的 USDT 钱包': '毎日の収入をUSDTウォレットに送信',
        '人工智能每天24小时工作': '人工知能は24時間年中無休で動作します',
        '加入人工智能套利': 'AIアービトラージに参加',
        '在全球200+交易所进行智能交易': '200以上のグローバル取引所でのインテリジェント取引',
    },
    kr: {
        '选择语言': '언어 선택',
        '首页': '홈',
        '资产': '자산',
        '合约交易': '계약',
        '人工智能套利': 'AI 중재',
        '贷款': '대출',
        '矿业': '채굴',
        '身份认证': '신원 인증',
        '财务记录': '재무 기록',
        '在线客服': '라이브 채팅',
        '语言选择': '언어 선택',
        '监管许可': '규제 라이선스',
        '常见问题': '자주 묻는 질문',
        '安全码': '보안 코드',
        '信用分': '신용 점수',
        '账户总资产(USDT)': '총 자산 (USDT)',
        '接收': '수신',
        '发送': '전송',
        '兑换': '환전',
        '日利率': '일일 이율',
        '还款方式': '상환',
        '到期偿还本息': '만기 지불',
        '利息': '총 이자',
        '贷款数量': '대출 금액',
        '贷款周期(天)': '신용 주기(일)',
        '未还数量': '미상환',
        '累计贷款': '누적 대출',
        '服务': '서비스',
        '客服': '온라인 고객 서비스',
        '24小时在线服务': '24시간 온라인 서비스',
        '托管数량': '에스크로 수량',
        '现在持仓': '지금 투자',
        '每日收入发送到您的 USDT 钱包': '매일 수익이 USDT 지갑으로 전송됩니다',
        '人工智能每天24小时工作': '인공지능은 매일 24시간 작동합니다',
        '加入人工智能套利': 'AI 중재에 참여',
        '在全球200+交易所进行智能交易': '200개 이상의 글로벌 거래소에서 스마트 거래',
    },
    cn: {
        '选择语言': '选择语言',
        '首页': '首页',
        '资产': '资产',
        '合约交易': '合约交易',
        '人工智能套利': '人工智能套利',
        '贷款': '贷款',
        '矿业': '矿业',
        '身份认证': '身份认证',
        '财务记录': '财务记录',
        '在线客服': '在线客服',
        '语言选择': '语言选择',
        '监管许可': '监管许可',
        '常见问题': '常见问题',
        '安全码': '安全码',
        '信用分': '信用分',
        '账户总资产(USDT)': '账户总资产(USDT)',
        '接收': '接收',
        '发送': '发送',
        '兑换': '兑换',
        '日利率': '日利率',
        '还款方式': '还款方式',
        '到期偿还本息': '到期偿还本息',
        '利息': '利息',
        '贷款数量': '贷款数量',
        '贷款周期(天)': '贷款周期(天)',
        '未还数量': '未还数量',
        '累计贷款': '累计贷款',
        '服务': '服务',
        '客服': '客服',
        '24小时在线服务': '24小时在线服务',
        '托管数量': '托管数量',
        '现在持仓': '现在持仓',
        '每日收入发送到您的 USDT 钱包': '每日收入发送到您的 USDT 钱包',
        '人工智能每天24小时工作': '人工智能每天24小时工作',
        '加入人工智能套利': '加入人工智能套利',
        '在全球200+交易所进行智能交易': '在全球200+交易所进行智能交易',
    },
    in: {
        '选择语言': 'भाषा चयन',
        '首页': 'होम',
        '资产': 'संपत्ति',
        '合约交易': 'अनुबंध',
        '人工智能套利': 'एआई आर्बिट्रेज',
        '贷款': 'ऋण',
        '矿业': 'खनन',
        '身份认证': 'पहचान सत्यापन',
        '财务记录': 'वित्तीय रिकॉर्ड',
        '在线客服': 'लाइव चैट',
        '语言选择': 'भाषा चुनें',
        '监管许可': 'नियामक लाइसेंस',
        '常见问题': 'अक्सर पूछे जाने वाले प्रश्न',
        '安全码': 'सुरक्षा कोड',
        '信用分': 'क्रेडिट स्कोर',
        '账户总资产(USDT)': 'कुल संपत्ति (USDT)',
        '接收': 'प्राप्त करें',
        '发送': 'भेजें',
        '兑换': 'विनिमय',
        '日利率': 'दैनिक दर',
        '还款方式': 'चुकौती',
        '到期偿还本息': 'परिपक्वता भुगतान',
        '利息': 'कुल ब्याज',
        '贷款数量': 'ऋण राशि',
        '贷款周期(天)': 'क्रेडिट चक्र (दिन)',
        '未还数量': 'अनुपलब्ध',
        '累计贷款': 'संचयी ऋण',
        '服务': 'सेवा',
        '客服': 'ऑनलाइन ग्राहक सेवा',
        '24小时在线服务': '24 घंटे ऑनलाइन सेवा',
        '托管数量': 'एस्क्रो मात्रा',
        '现在持仓': 'अभी निवेश करें',
        '每日收入发送到您的 USDT 钱包': 'दैनिक आय आपके USDT वॉलेट को भेजी गई',
        '人工智能每天24小时工作': 'कृत्रिम बुद्धिमत्ता 24 घंटे काम करती है',
        '加入人工智能套利': 'AI आर्बिट्रेज में शामिल हों',
        '在全球200+交易所进行智能交易': '200+ वैश्विक एक्सचेंजों पर स्मार्ट ट्रेडिंग',
    },
};

// Language Manager Class
class LanguageManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'en';
        this.init();
    }

    /**
     * Initialize language system
     */
    init() {
        this.applyLanguage(this.currentLang);
    }

    /**
     * Get stored language from cookie
     */
    getStoredLanguage() {
        const lang = Cookies.get('ylang');
        return lang && Object.keys(TRANSLATIONS).includes(lang) ? lang : 'en';
    }

    /**
     * Set language and apply translations
     */
    setLanguage(lang) {
        if (!Object.keys(TRANSLATIONS).includes(lang)) {
            console.warn(`Language '${lang}' not supported. Using English.`);
            lang = 'en';
        }
        
        this.currentLang = lang;
        Cookies.set('ylang', lang, { expires: 30 });
        this.applyLanguage(lang);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    }

    /**
     * Apply language to all elements with data-translate attribute
     */
    applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const chineseText = element.getAttribute('data-translate');
            const translation = this.translate(chineseText, lang);
            element.textContent = translation;
        });
    }

    /**
     * Translate text to specified language
     */
    translate(text, lang = null) {
        const targetLang = lang || this.currentLang;
        
        if (!TRANSLATIONS[targetLang]) {
            return text;
        }
        
        return TRANSLATIONS[targetLang][text] || text;
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages() {
        return Object.keys(TRANSLATIONS);
    }
}

// Initialize language manager globally
let languageManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        languageManager = new LanguageManager();
    });
} else {
    languageManager = new LanguageManager();
}

// Global function for translation (backward compatibility with gy())
function gy(text) {
    if (typeof languageManager !== 'undefined' && languageManager) {
        return languageManager.translate(text);
    }
    return text;
}

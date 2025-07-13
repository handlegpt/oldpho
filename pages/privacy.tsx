import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Language } from '../utils/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';
import { useState, useEffect } from 'react';

const Privacy: NextPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setCurrentLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
  };

  const privacyContent = {
    en: {
      title: 'Privacy & Security',
      subtitle: 'Your privacy and data security are our top priorities',
      sections: {
        dataCollection: {
          title: 'Data Collection',
          content: [
            'We only collect the minimum data necessary to provide our service',
            'Uploaded photos are processed securely and deleted after 24 hours',
            'We do not store or share your personal photos with third parties',
            'User authentication is handled securely through Google OAuth'
          ]
        },
        dataSecurity: {
          title: 'Data Security',
          content: [
            'All data transmission is encrypted using HTTPS/TLS',
            'Photos are processed in secure, isolated environments',
            'We use industry-standard security practices and protocols',
            'Regular security audits and vulnerability assessments'
          ]
        },
        userRights: {
          title: 'Your Rights',
          content: [
            'Right to access your personal data',
            'Right to request deletion of your data',
            'Right to opt-out of data collection',
            'Right to export your data'
          ]
        },
        thirdParty: {
          title: 'Third-Party Services',
          content: [
            'We use Replicate API for AI photo processing',
            'Google OAuth for secure authentication',
            'All third-party services are GDPR compliant',
            'No data is sold to advertisers or marketers'
          ]
        },
        cookies: {
          title: 'Cookies & Tracking',
          content: [
            'Essential cookies for service functionality',
            'Analytics cookies to improve user experience',
            'No tracking cookies for advertising',
            'You can disable non-essential cookies'
          ]
        }
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about our privacy practices, please contact us at privacy@oldpho.com'
      }
    },
    'zh-TW': {
      title: '隱私與安全',
      subtitle: '您的隱私和數據安全是我們的首要任務',
      sections: {
        dataCollection: {
          title: '數據收集',
          content: [
            '我們只收集提供服務所需的最少數據',
            '上傳的照片會安全處理，24小時後自動刪除',
            '我們不會存儲或與第三方分享您的個人照片',
            '用戶認證通過 Google OAuth 安全處理'
          ]
        },
        dataSecurity: {
          title: '數據安全',
          content: [
            '所有數據傳輸都使用 HTTPS/TLS 加密',
            '照片在安全、隔離的環境中處理',
            '我們使用行業標準的安全實踐和協議',
            '定期安全審計和漏洞評估'
          ]
        },
        userRights: {
          title: '您的權利',
          content: [
            '訪問您個人數據的權利',
            '請求刪除您數據的權利',
            '選擇退出數據收集的權利',
            '導出您數據的權利'
          ]
        },
        thirdParty: {
          title: '第三方服務',
          content: [
            '我們使用 Replicate API 進行 AI 照片處理',
            'Google OAuth 用於安全認證',
            '所有第三方服務都符合 GDPR 標準',
            '不會向廣告商或營銷商出售數據'
          ]
        },
        cookies: {
          title: 'Cookie 和追蹤',
          content: [
            '服務功能必需的基本 Cookie',
            '改善用戶體驗的分析 Cookie',
            '沒有用於廣告的追蹤 Cookie',
            '您可以禁用非必需的 Cookie'
          ]
        }
      },
      contact: {
        title: '聯繫我們',
        content: '如果您對我們的隱私實踐有任何疑問，請聯繫我們：privacy@oldpho.com'
      }
    },
    ja: {
      title: 'プライバシーとセキュリティ',
      subtitle: 'お客様のプライバシーとデータセキュリティが私たちの最優先事項です',
      sections: {
        dataCollection: {
          title: 'データ収集',
          content: [
            'サービス提供に必要な最小限のデータのみを収集します',
            'アップロードされた写真は安全に処理され、24時間後に自動削除されます',
            '個人写真を第三者と保存または共有することはありません',
            'ユーザー認証は Google OAuth で安全に処理されます'
          ]
        },
        dataSecurity: {
          title: 'データセキュリティ',
          content: [
            'すべてのデータ転送は HTTPS/TLS で暗号化されています',
            '写真は安全で隔離された環境で処理されます',
            '業界標準のセキュリティ実践とプロトコルを使用します',
            '定期的なセキュリティ監査と脆弱性評価'
          ]
        },
        userRights: {
          title: 'お客様の権利',
          content: [
            '個人データにアクセスする権利',
            'データの削除を要求する権利',
            'データ収集をオプトアウトする権利',
            'データをエクスポートする権利'
          ]
        },
        thirdParty: {
          title: '第三者サービス',
          content: [
            'AI 写真処理に Replicate API を使用',
            '安全な認証に Google OAuth を使用',
            'すべての第三者サービスは GDPR 準拠',
            'データを広告主やマーケターに販売しません'
          ]
        },
        cookies: {
          title: 'Cookie とトラッキング',
          content: [
            'サービス機能に必要な基本的な Cookie',
            'ユーザー体験を改善する分析 Cookie',
            '広告用のトラッキング Cookie はありません',
            '非必須の Cookie を無効にできます'
          ]
        }
      },
      contact: {
        title: 'お問い合わせ',
        content: 'プライバシー慣行についてご質問がございましたら、privacy@oldpho.com までお問い合わせください'
      }
    }
  };

  const content = privacyContent[currentLanguage];

  return (
    <div className='flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>Privacy & Security - OldPho</title>
        <meta name="description" content="Learn about OldPho's privacy practices and data security measures." />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8'>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className='text-4xl font-bold text-slate-900 mb-4'>
              {content.title}
            </h1>
            <p className="text-xl text-gray-600">
              {content.subtitle}
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(content.sections).map(([key, section]) => (
              <div key={key} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3 text-left">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                {content.contact.title}
              </h2>
              <p className="text-blue-800">
                {content.contact.content}
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/restore"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Restoring Photos
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy; 
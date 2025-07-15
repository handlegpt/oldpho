import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Language, translations } from '../utils/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';
import AnimatedCard from '../components/AnimatedCard';
import { useEffect } from 'react';

const Help: NextPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const t = translations[currentLanguage];

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setCurrentLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
  };

  const getHelpText = (key: string) => {
    const texts = {
      title: {
        'en': 'Help & Support',
        'zh-TW': '帮助与支持',
        'ja': 'ヘルプ＆サポート'
      },
      subtitle: {
        'en': 'Find answers to common questions and get support',
        'zh-TW': '查找常见问题答案并获得支持',
        'ja': 'よくある質問の回答を見つけ、サポートを受ける'
      },
      faq: {
        'en': 'Frequently Asked Questions',
        'zh-TW': '常见问题',
        'ja': 'よくある質問'
      },
      contact: {
        'en': 'Contact Us',
        'zh-TW': '联系我们',
        'ja': 'お問い合わせ'
      },
      email: {
        'en': 'Email Support',
        'zh-TW': '邮件支持',
        'ja': 'メールサポート'
      },
      responseTime: {
        'en': 'Response within 24 hours',
        'zh-TW': '24小时内回复',
        'ja': '24時間以内に回答'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const faqs = [
    {
      question: currentLanguage === 'zh-TW' 
        ? '如何上传照片？' 
        : currentLanguage === 'ja' 
        ? '写真をアップロードするには？'
        : 'How do I upload photos?',
      answer: currentLanguage === 'zh-TW'
        ? '点击上传区域或将照片拖拽到指定区域。支持JPG、PNG格式，文件大小不超过10MB。'
        : currentLanguage === 'ja'
        ? 'アップロードエリアをクリックするか、写真を指定エリアにドラッグ＆ドロップしてください。JPG、PNG形式をサポートし、ファイルサイズは10MB以下です。'
        : 'Click the upload area or drag and drop your photo to the designated area. We support JPG and PNG formats with a maximum file size of 10MB.'
    },
    {
      question: currentLanguage === 'zh-TW'
        ? '处理需要多长时间？'
        : currentLanguage === 'ja'
        ? '処理にどのくらい時間がかかりますか？'
        : 'How long does processing take?',
      answer: currentLanguage === 'zh-TW'
        ? '通常需要1-3分钟，具体时间取决于照片大小和服务器负载。'
        : currentLanguage === 'ja'
        ? '通常1-3分かかります。写真のサイズとサーバーの負荷によって異なります。'
        : 'Processing typically takes 1-3 minutes, depending on photo size and server load.'
    },
    {
      question: currentLanguage === 'zh-TW'
        ? '免费用户有什么限制？'
        : currentLanguage === 'ja'
        ? '無料ユーザーの制限は？'
        : 'What are the limits for free users?',
      answer: currentLanguage === 'zh-TW'
        ? '免费用户每月可修复5张照片，处理结果会带有水印。'
        : currentLanguage === 'ja'
        ? '無料ユーザーは月5枚の写真を復元でき、処理結果にウォーターマークが付きます。'
        : 'Free users can restore 5 photos per month, and processed results will have watermarks.'
    },
    {
      question: currentLanguage === 'zh-TW'
        ? '如何升级到专业版？'
        : currentLanguage === 'ja'
        ? 'プロ版にアップグレードするには？'
        : 'How do I upgrade to Pro?',
      answer: currentLanguage === 'zh-TW'
        ? '访问价格页面，选择专业计划并完成支付即可升级。'
        : currentLanguage === 'ja'
        ? '料金ページにアクセスし、プロプランを選択して支払いを完了してください。'
        : 'Visit the pricing page, select a Pro plan and complete the payment to upgrade.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>Help & Support - OldPho</title>
        <meta name="description" content="Get help and support for OldPho" />
      </Head>
      
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {getHelpText('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {getHelpText('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div>
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {getHelpText('faq')}
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                        className="w-full px-4 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            activeFAQ === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {activeFAQ === index && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* Contact Section */}
            <div>
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {getHelpText('contact')}
                </h2>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 className="font-medium text-blue-900">{getHelpText('email')}</h3>
                    </div>
                    <p className="text-blue-700 mb-2">support@oldpho.com</p>
                    <p className="text-sm text-blue-600">{getHelpText('responseTime')}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-medium text-green-900">
                        {currentLanguage === 'zh-TW' ? '在线文档' : currentLanguage === 'ja' ? 'オンラインドキュメント' : 'Documentation'}
                      </h3>
                    </div>
                    <p className="text-green-700">
                      {currentLanguage === 'zh-TW' 
                        ? '查看详细的使用指南和教程' 
                        : currentLanguage === 'ja' 
                        ? '詳細な使用ガイドとチュートリアルを確認'
                        : 'View detailed guides and tutorials'
                      }
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help; 
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedCard from '../components/AnimatedCard';

const Support: NextPage = () => {
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const getSupportText = (key: string) => {
    const texts = {
      title: {
        'en': 'Help & Support',
        'zh-TW': '帮助与支持',
        'ja': 'ヘルプ＆サポート'
      },
      faq: {
        'en': 'FAQ',
        'zh-TW': '常见问题',
        'ja': 'よくある質問'
      },
      contact: {
        'en': 'Contact Us',
        'zh-TW': '联系我们',
        'ja': 'お問い合わせ'
      },
      howToUse: {
        'en': 'How to Use',
        'zh-TW': '使用指南',
        'ja': '使用方法'
      },
      faqTitle: {
        'en': 'Frequently Asked Questions',
        'zh-TW': '常见问题',
        'ja': 'よくある質問'
      },
      contactTitle: {
        'en': 'Get in Touch',
        'zh-TW': '联系我们',
        'ja': 'お問い合わせ'
      },
      howToUseTitle: {
        'en': 'How to Use OldPho',
        'zh-TW': '如何使用OldPho',
        'ja': 'OldPhoの使用方法'
      },
      name: {
        'en': 'Name',
        'zh-TW': '姓名',
        'ja': '氏名'
      },
      email: {
        'en': 'Email',
        'zh-TW': '邮箱',
        'ja': 'メール'
      },
      subject: {
        'en': 'Subject',
        'zh-TW': '主题',
        'ja': '件名'
      },
      message: {
        'en': 'Message',
        'zh-TW': '消息',
        'ja': 'メッセージ'
      },
      sendMessage: {
        'en': 'Send Message',
        'zh-TW': '发送消息',
        'ja': 'メッセージを送信'
      },
      faqItems: {
        'en': [
          {
            question: 'How does photo restoration work?',
            answer: 'Our AI technology analyzes your old photos and intelligently repairs damage, enhances quality, and restores missing details using advanced machine learning algorithms.'
          },
          {
            question: 'What file formats are supported?',
            answer: 'We support JPEG, PNG, TIFF, and BMP formats. For best results, we recommend using high-resolution images.'
          },
          {
            question: 'How long does restoration take?',
            answer: 'Most restorations are completed within 2-5 minutes. Complex restorations may take up to 10 minutes.'
          },
          {
            question: 'Can I restore multiple photos at once?',
            answer: 'Currently, we process one photo at a time to ensure the best quality results. We\'re working on batch processing for future updates.'
          },
          {
            question: 'What if I\'m not satisfied with the result?',
            answer: 'We offer a satisfaction guarantee. If you\'re not happy with the restoration, contact our support team for a refund or re-processing.'
          }
        ],
        'zh-TW': [
          {
            question: '照片修复是如何工作的？',
            answer: '我们的AI技术分析您的旧照片，使用先进的机器学习算法智能修复损坏、提升质量并恢复缺失的细节。'
          },
          {
            question: '支持哪些文件格式？',
            answer: '我们支持JPEG、PNG、TIFF和BMP格式。为了获得最佳效果，我们建议使用高分辨率图像。'
          },
          {
            question: '修复需要多长时间？',
            answer: '大多数修复在2-5分钟内完成。复杂的修复可能需要长达10分钟。'
          },
          {
            question: '我可以同时修复多张照片吗？',
            answer: '目前，我们一次处理一张照片以确保最佳质量结果。我们正在为未来的更新开发批量处理功能。'
          },
          {
            question: '如果我对结果不满意怎么办？',
            answer: '我们提供满意度保证。如果您对修复不满意，请联系我们的支持团队进行退款或重新处理。'
          }
        ],
        'ja': [
          {
            question: '写真復元はどのように機能しますか？',
            answer: '私たちのAI技術は古い写真を分析し、高度な機械学習アルゴリズムを使用して損傷を修復し、品質を向上させ、欠けている詳細を復元します。'
          },
          {
            question: 'どのファイル形式がサポートされていますか？',
            answer: 'JPEG、PNG、TIFF、BMP形式をサポートしています。最良の結果を得るために、高解像度の画像を使用することをお勧めします。'
          },
          {
            question: '復元にはどのくらい時間がかかりますか？',
            answer: 'ほとんどの復元は2-5分で完了します。複雑な復元は最大10分かかる場合があります。'
          },
          {
            question: '複数の写真を一度に復元できますか？',
            answer: '現在、最高品質の結果を確保するために一度に1枚の写真を処理しています。将来のアップデートでバッチ処理を開発中です。'
          },
          {
            question: '結果に満足できない場合はどうなりますか？',
            answer: '満足度保証を提供しています。復元に満足できない場合は、サポートチームにお問い合わせください。返金または再処理を行います。'
          }
        ]
      },
      howToUseSteps: {
        'en': [
          {
            title: 'Upload Your Photo',
            description: 'Click the upload button and select the old photo you want to restore. We support most common image formats.'
          },
          {
            title: 'Choose Restoration Type',
            description: 'Select the type of restoration you need: basic repair, color restoration, or full enhancement.'
          },
          {
            title: 'Process Your Photo',
            description: 'Our AI will analyze and process your photo. This usually takes 2-5 minutes depending on the complexity.'
          },
          {
            title: 'Download Result',
            description: 'Once processing is complete, you can download your restored photo in high quality.'
          }
        ],
        'zh-TW': [
          {
            title: '上传照片',
            description: '点击上传按钮并选择您想要修复的旧照片。我们支持大多数常见图像格式。'
          },
          {
            title: '选择修复类型',
            description: '选择您需要的修复类型：基础修复、颜色恢复或全面增强。'
          },
          {
            title: '处理照片',
            description: '我们的AI将分析并处理您的照片。这通常需要2-5分钟，具体取决于复杂性。'
          },
          {
            title: '下载结果',
            description: '处理完成后，您可以下载高质量的修复照片。'
          }
        ],
        'ja': [
          {
            title: '写真をアップロード',
            description: 'アップロードボタンをクリックして復元したい古い写真を選択します。ほとんどの一般的な画像形式をサポートしています。'
          },
          {
            title: '復元タイプを選択',
            description: '必要な復元タイプを選択します：基本修復、色復元、または完全強化。'
          },
          {
            title: '写真を処理',
            description: 'AIが写真を分析して処理します。複雑さによって通常2-5分かかります。'
          },
          {
            title: '結果をダウンロード',
            description: '処理が完了すると、高品質の復元された写真をダウンロードできます。'
          }
        ]
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
      setIsSubmitting(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const renderFAQTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{getSupportText('faqTitle')}</h2>
      <div className="space-y-4">
        {getSupportText('faqItems').map((item: any, index: number) => (
          <AnimatedCard key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{getSupportText('contactTitle')}</h2>
      
      {submitMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {submitMessage}
        </div>
      )}
      
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getSupportText('name')}
          </label>
          <input
            type="text"
            required
            value={contactForm.name}
            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getSupportText('email')}
          </label>
          <input
            type="email"
            required
            value={contactForm.email}
            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getSupportText('subject')}
          </label>
          <input
            type="text"
            required
            value={contactForm.subject}
            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getSupportText('message')}
          </label>
          <textarea
            required
            rows={5}
            value={contactForm.message}
            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : getSupportText('sendMessage')}
        </button>
      </form>
    </div>
  );

  const renderHowToUseTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{getSupportText('howToUseTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getSupportText('howToUseSteps').map((step: any, index: number) => (
          <AnimatedCard key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">{step.description}</p>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{getSupportText('title')} - OldPho</title>
        <meta name="description" content="Help and support for OldPho photo restoration service" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getSupportText('title')}
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're here to help you get the most out of OldPho
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'faq', label: getSupportText('faq') },
                    { id: 'contact', label: getSupportText('contact') },
                    { id: 'howToUse', label: getSupportText('howToUse') }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'faq' && renderFAQTab()}
                {activeTab === 'contact' && renderContactTab()}
                {activeTab === 'howToUse' && renderHowToUseTab()}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Support; 
import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Language, translations } from '../utils/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface FeedbackForm {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  email: string;
}

const Feedback: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [form, setForm] = useState<FeedbackForm>({
    type: 'feature',
    title: '',
    description: '',
    priority: 'medium',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[currentLanguage];

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setCurrentLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 模拟提交反馈
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFeedbackText = (key: string) => {
    const texts = {
      title: {
        'en': 'Feedback & Suggestions',
        'zh-TW': '反馈与建议',
        'ja': 'フィードバック＆提案'
      },
      subtitle: {
        'en': 'Help us improve OldPho by sharing your thoughts',
        'zh-TW': '通过分享您的想法帮助我们改进 OldPho',
        'ja': 'あなたの考えを共有してOldPhoの改善にご協力ください'
      },
      formTitle: {
        'en': 'Submit Feedback',
        'zh-TW': '提交反馈',
        'ja': 'フィードバックを送信'
      },
      type: {
        'en': 'Feedback Type',
        'zh-TW': '反馈类型',
        'ja': 'フィードバックタイプ'
      },
      titleLabel: {
        'en': 'Title',
        'zh-TW': '标题',
        'ja': 'タイトル'
      },
      description: {
        'en': 'Description',
        'zh-TW': '描述',
        'ja': '説明'
      },
      priority: {
        'en': 'Priority',
        'zh-TW': '优先级',
        'ja': '優先度'
      },
      email: {
        'en': 'Email (optional)',
        'zh-TW': '邮箱（可选）',
        'ja': 'メール（任意）'
      },
      submit: {
        'en': 'Submit Feedback',
        'zh-TW': '提交反馈',
        'ja': 'フィードバックを送信'
      },
      submitting: {
        'en': 'Submitting...',
        'zh-TW': '提交中...',
        'ja': '送信中...'
      },
      success: {
        'en': 'Thank you for your feedback!',
        'zh-TW': '感谢您的反馈！',
        'ja': 'フィードバックをありがとうございます！'
      },
      successMessage: {
        'en': 'We have received your feedback and will review it carefully.',
        'zh-TW': '我们已收到您的反馈，将仔细审查。',
        'ja': 'フィードバックを受け取りました。慎重に検討いたします。'
      },
      bug: {
        'en': 'Bug Report',
        'zh-TW': '错误报告',
        'ja': 'バグ報告'
      },
      feature: {
        'en': 'Feature Request',
        'zh-TW': '功能请求',
        'ja': '機能リクエスト'
      },
      improvement: {
        'en': 'Improvement Suggestion',
        'zh-TW': '改进建议',
        'ja': '改善提案'
      },
      other: {
        'en': 'Other',
        'zh-TW': '其他',
        'ja': 'その他'
      },
      low: {
        'en': 'Low',
        'zh-TW': '低',
        'ja': '低'
      },
      medium: {
        'en': 'Medium',
        'zh-TW': '中',
        'ja': '中'
      },
      high: {
        'en': 'High',
        'zh-TW': '高',
        'ja': '高'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" color="blue" text="Loading..." />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        <main className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <AnimatedCard className="p-12 text-center">
              <div className="text-green-600 mb-6">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {getFeedbackText('success')}
              </h2>
              <p className="text-gray-600 mb-8">
                {getFeedbackText('successMessage')}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {currentLanguage === 'zh-TW' ? '提交新反馈' : currentLanguage === 'ja' ? '新しいフィードバックを送信' : 'Submit New Feedback'}
              </button>
            </AnimatedCard>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>Feedback - OldPho</title>
        <meta name="description" content="Submit feedback and suggestions" />
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
              {getFeedbackText('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {getFeedbackText('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feedback Form */}
            <div>
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {getFeedbackText('formTitle')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Feedback Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getFeedbackText('type')}
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="bug">{getFeedbackText('bug')}</option>
                      <option value="feature">{getFeedbackText('feature')}</option>
                      <option value="improvement">{getFeedbackText('improvement')}</option>
                      <option value="other">{getFeedbackText('other')}</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getFeedbackText('titleLabel')}
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentLanguage === 'zh-TW' ? '简短描述您的反馈' : currentLanguage === 'ja' ? 'フィードバックの簡単な説明' : 'Brief description of your feedback'}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getFeedbackText('description')}
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder={currentLanguage === 'zh-TW' ? '详细描述您的反馈或建议...' : currentLanguage === 'ja' ? 'フィードバックや提案の詳細を説明してください...' : 'Please describe your feedback or suggestion in detail...'}
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getFeedbackText('priority')}
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">{getFeedbackText('low')}</option>
                      <option value="medium">{getFeedbackText('medium')}</option>
                      <option value="high">{getFeedbackText('high')}</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getFeedbackText('email')}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={session.user?.email || 'your@email.com'}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? getFeedbackText('submitting') : getFeedbackText('submit')}
                  </button>
                </form>
              </AnimatedCard>
            </div>

            {/* Guidelines */}
            <div>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentLanguage === 'zh-TW' ? '反馈指南' : currentLanguage === 'ja' ? 'フィードバックガイドライン' : 'Feedback Guidelines'}
                </h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      {currentLanguage === 'zh-TW' 
                        ? '请提供具体和详细的描述，这样我们可以更好地理解您的需求。' 
                        : currentLanguage === 'ja' 
                        ? '具体的で詳細な説明を提供してください。これにより、あなたのニーズをよりよく理解できます。'
                        : 'Please provide specific and detailed descriptions so we can better understand your needs.'
                      }
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      {currentLanguage === 'zh-TW' 
                        ? '如果是错误报告，请包含重现步骤和您使用的设备信息。' 
                        : currentLanguage === 'ja' 
                        ? 'バグ報告の場合は、再現手順と使用しているデバイス情報を含めてください。'
                        : 'For bug reports, please include steps to reproduce and information about your device.'
                      }
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      {currentLanguage === 'zh-TW' 
                        ? '功能请求时，请解释为什么这个功能对您有用。' 
                        : currentLanguage === 'ja' 
                        ? '機能リクエストの場合は、その機能がどのように役立つかを説明してください。'
                        : 'For feature requests, please explain why this feature would be useful to you.'
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

export default Feedback; 
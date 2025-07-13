import React, { useState } from 'react';
import { Language } from '../utils/translations';

interface FeedbackWidgetProps {
  currentLanguage: Language;
  onClose: () => void;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  currentLanguage,
  onClose
}) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [category, setCategory] = useState<string>('general');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const getText = (key: string) => {
    const texts = {
      title: {
        'en': 'Help us improve OldPho',
        'zh-TW': '帮助改进 OldPho',
        'ja': 'OldPhoの改善にご協力ください'
      },
      subtitle: {
        'en': 'Your feedback helps us make OldPho better for everyone.',
        'zh-TW': '您的反馈帮助我们为所有人改进 OldPho。',
        'ja': 'あなたのフィードバックがOldPhoをより良くするのに役立ちます。'
      },
      rating: {
        'en': 'How would you rate your experience?',
        'zh-TW': '您如何评价您的使用体验？',
        'ja': '体験をどのように評価しますか？'
      },
      category: {
        'en': 'What type of feedback is this?',
        'zh-TW': '这是什么类型的反馈？',
        'ja': 'これはどのような種類のフィードバックですか？'
      },
      feedback: {
        'en': 'Tell us more (optional)',
        'zh-TW': '告诉我们更多（可选）',
        'ja': '詳しく教えてください（任意）'
      },
      submit: {
        'en': 'Submit Feedback',
        'zh-TW': '提交反馈',
        'ja': 'フィードバックを送信'
      },
      thanks: {
        'en': 'Thank you for your feedback!',
        'zh-TW': '感谢您的反馈！',
        'ja': 'フィードバックをありがとうございます！'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const categories = [
    { value: 'general', label: { 'en': 'General', 'zh-TW': '一般', 'ja': '一般' } },
    { value: 'bug', label: { 'en': 'Bug Report', 'zh-TW': '错误报告', 'ja': 'バグ報告' } },
    { value: 'feature', label: { 'en': 'Feature Request', 'zh-TW': '功能请求', 'ja': '機能リクエスト' } },
    { value: 'performance', label: { 'en': 'Performance', 'zh-TW': '性能', 'ja': 'パフォーマンス' } },
    { value: 'ui', label: { 'en': 'User Interface', 'zh-TW': '用户界面', 'ja': 'ユーザーインターフェース' } }
  ];

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback,
          category,
          language: currentLanguage,
          timestamp: new Date().toISOString()
        })
      });
      
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {getText('thanks')}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {getText('title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">{getText('subtitle')}</p>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {getText('rating')}
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  rating >= star 
                    ? 'text-yellow-400 bg-yellow-50' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {getText('category')}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label[currentLanguage] || cat.label['en']}
              </option>
            ))}
          </select>
        </div>

        {/* Feedback */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {getText('feedback')}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder={getText('feedback')}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
            rating === 0 || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 active:scale-95'
          }`}
        >
          {isSubmitting ? '...' : getText('submit')}
        </button>
      </div>
    </div>
  );
};

export default FeedbackWidget; 
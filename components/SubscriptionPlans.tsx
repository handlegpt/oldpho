import React from 'react';
import { useSession } from 'next-auth/react';
import AnimatedCard from './AnimatedCard';

interface Plan {
  id: string;
  name: string;
  price: number;
  generations: number;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonAction: () => void;
}

interface SubscriptionPlansProps {
  currentLanguage: 'zh-TW' | 'en' | 'ja';
  onSubscribe: (planId: string) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  currentLanguage, 
  onSubscribe 
}) => {
  const { data: session } = useSession();

  const plans: Plan[] = [
    {
      id: 'free',
      name: currentLanguage === 'zh-TW' ? '免费计划' : currentLanguage === 'ja' ? '無料プラン' : 'Free',
      price: 0,
      generations: 5,
      features: [
        currentLanguage === 'zh-TW' ? '5次/月图片修复' : currentLanguage === 'ja' ? '月5回の画像復元' : '5 generations/month',
        currentLanguage === 'zh-TW' ? '带水印' : currentLanguage === 'ja' ? 'ウォーターマーク付き' : 'With watermark',
        currentLanguage === 'zh-TW' ? '基础支持' : currentLanguage === 'ja' ? '基本サポート' : 'Basic support'
      ],
      buttonText: currentLanguage === 'zh-TW' ? '当前计划' : currentLanguage === 'ja' ? '現在のプラン' : 'Current Plan',
      buttonAction: () => {}
    },
    {
      id: 'pro',
      name: currentLanguage === 'zh-TW' ? '专业计划' : currentLanguage === 'ja' ? 'プロプラン' : 'Pro',
      price: 9.99,
      generations: 50,
      features: [
        currentLanguage === 'zh-TW' ? '50次/月图片修复' : currentLanguage === 'ja' ? '月50回の画像復元' : '50 generations/month',
        currentLanguage === 'zh-TW' ? '无水印' : currentLanguage === 'ja' ? 'ウォーターマークなし' : 'No watermark',
        currentLanguage === 'zh-TW' ? '优先处理' : currentLanguage === 'ja' ? '優先処理' : 'Priority processing',
        currentLanguage === 'zh-TW' ? '高级支持' : currentLanguage === 'ja' ? '高度なサポート' : 'Premium support'
      ],
      popular: true,
      buttonText: currentLanguage === 'zh-TW' ? '升级到专业版' : currentLanguage === 'ja' ? 'プロにアップグレード' : 'Upgrade to Pro',
      buttonAction: () => onSubscribe('pro')
    },
    {
      id: 'enterprise',
      name: currentLanguage === 'zh-TW' ? '企业计划' : currentLanguage === 'ja' ? 'エンタープライズプラン' : 'Enterprise',
      price: 29.99,
      generations: -1, // 无限
      features: [
        currentLanguage === 'zh-TW' ? '无限次图片修复' : currentLanguage === 'ja' ? '無制限の画像復元' : 'Unlimited generations',
        currentLanguage === 'zh-TW' ? '无水印' : currentLanguage === 'ja' ? 'ウォーターマークなし' : 'No watermark',
        currentLanguage === 'zh-TW' ? '最高优先级处理' : currentLanguage === 'ja' ? '最高優先度処理' : 'Highest priority',
        currentLanguage === 'zh-TW' ? '专属客服支持' : currentLanguage === 'ja' ? '専用カスタマーサポート' : 'Dedicated support',
        currentLanguage === 'zh-TW' ? 'API访问' : currentLanguage === 'ja' ? 'APIアクセス' : 'API access'
      ],
      buttonText: currentLanguage === 'zh-TW' ? '升级到企业版' : currentLanguage === 'ja' ? 'エンタープライズにアップグレード' : 'Upgrade to Enterprise',
      buttonAction: () => onSubscribe('enterprise')
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {currentLanguage === 'zh-TW' ? '选择您的计划' : currentLanguage === 'ja' ? 'プランを選択' : 'Choose Your Plan'}
        </h1>
        <p className="text-xl text-gray-600">
          {currentLanguage === 'zh-TW' 
            ? '选择最适合您需求的计划' 
            : currentLanguage === 'ja' 
            ? 'ニーズに最適なプランを選択'
            : 'Choose the plan that best fits your needs'
          }
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <AnimatedCard 
            key={plan.id}
            className={`relative p-8 ${
              plan.popular 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {currentLanguage === 'zh-TW' ? '最受欢迎' : currentLanguage === 'ja' ? '人気' : 'Most Popular'}
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">
                  {currentLanguage === 'zh-TW' ? '/月' : currentLanguage === 'ja' ? '/月' : '/month'}
                </span>
              </div>

              <div className="mb-6">
                <span className="text-lg text-gray-600">
                  {plan.generations === -1 
                    ? (currentLanguage === 'zh-TW' ? '无限次' : currentLanguage === 'ja' ? '無制限' : 'Unlimited')
                    : `${plan.generations} ${currentLanguage === 'zh-TW' ? '次/月' : currentLanguage === 'ja' ? '回/月' : '/month'}`
                  }
                </span>
              </div>

              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.buttonAction}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans; 
export type Language = 'en' | 'zh-TW' | 'ja';

export interface Translations {
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  navigation: {
    home: string;
    restore: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  stats: {
    photos: string;
    satisfaction: string;
    support: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  beforeAfter: {
    title: string;
    subtitle: string;
    before: string;
    after: string;
    examples: Array<{
      title: string;
      description: string;
    }>;
  };
  trust: {
    title: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  finalCta: {
    title: string;
    subtitle: string;
    button: string;
  };
  share: {
    title: string;
    description: string;
  };
  title: string;
  description: string;
  upload: {
    success: string;
  };
  original: string;
  restored: string;
  processing: string;
  download: string;
  reset: string;
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      content: string;
      rating: number;
    }>;
  };
  privacy: {
    title: string;
    description: string;
    learnMore: string;
    startRestoring: string;
  };
}

export const translations: Record<Language, Translations> = {
  'en': {
    seo: {
      title: 'OldPho - AI Photo Restoration | Restore Old Photos with AI',
      description: 'Transform old, blurry, and damaged photos into crystal-clear memories using advanced AI technology. Free photo restoration service.',
      keywords: 'AI photo restoration, old photo repair, blurry photo fix, photo enhancement, image restoration, AI photo repair'
    },
    navigation: {
      home: 'Home',
      restore: 'Restore'
    },
    hero: {
      title: 'Restore Your Memories with AI',
      subtitle: 'Transform old, blurry, and damaged photos into crystal-clear memories using advanced AI technology. Bring your precious moments back to life.',
      cta: 'Start Restoring Now'
    },
    stats: {
      photos: 'Photos Restored',
      satisfaction: 'User Satisfaction',
      support: 'Customer Support'
    },
    features: {
      title: 'Why Choose OldPho?',
      subtitle: 'Advanced AI technology combined with user-friendly interface for the best photo restoration experience.',
      items: [
        {
          icon: '⚡',
          title: 'Lightning Fast',
          description: 'Get your restored photos in seconds with our optimized AI processing.'
        },
        {
          icon: '🎯',
          title: 'High Quality',
          description: 'Advanced AI algorithms ensure the highest quality restoration results.'
        },
        {
          icon: '🔒',
          title: 'Privacy First',
          description: 'Your photos are processed securely and never stored permanently.'
        },
        {
          icon: '💎',
          title: 'Free to Use',
          description: 'Start restoring your photos for free with generous monthly limits.'
        },
        {
          icon: '🌍',
          title: 'Multi-Language',
          description: 'Available in English, Traditional Chinese, and Japanese.'
        },
        {
          icon: '📱',
          title: 'Mobile Friendly',
          description: 'Works perfectly on all devices - desktop, tablet, and mobile.'
        }
      ]
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Restore your photos in just three simple steps.',
      steps: [
        {
          title: 'Upload Photo',
          description: 'Upload your old, blurry, or damaged photo. We support JPEG, PNG, and JPG formats.'
        },
        {
          title: 'AI Processing',
          description: 'Our advanced AI analyzes and restores your photo, enhancing details and removing imperfections.'
        },
        {
          title: 'Download Result',
          description: 'Download your beautifully restored photo in high quality, ready to share and preserve.'
        }
      ]
    },
    beforeAfter: {
      title: 'See the Magic',
      subtitle: 'Witness the transformation from old, damaged photos to crystal-clear memories.',
      before: 'Before',
      after: 'After',
      examples: [
        {
          title: 'Family Portrait Restoration',
          description: 'Bring back the clarity and warmth of precious family moments.'
        },
        {
          title: 'Historical Photo Enhancement',
          description: 'Preserve and enhance historical photographs for future generations.'
        }
      ]
    },
    trust: {
      title: 'Trusted by Millions',
      subtitle: 'Join millions of users who trust OldPho for their photo restoration needs.',
      items: [
        {
          icon: '🛡️',
          title: 'Secure Processing',
          description: 'Your photos are processed securely and never stored permanently.'
        },
        {
          icon: '⚡',
          title: 'Fast Results',
          description: 'Get your restored photos in seconds with our optimized AI.'
        },
        {
          icon: '💎',
          title: 'High Quality',
          description: 'Advanced AI ensures the highest quality restoration results.'
        },
        {
          icon: '🎯',
          title: 'Easy to Use',
          description: 'Simple, intuitive interface designed for everyone to use.'
        }
      ]
    },
    finalCta: {
      title: 'Ready to Restore Your Memories?',
      subtitle: 'Join millions of users who have already transformed their old photos with OldPho.',
      button: 'Start Restoring Now'
    },
    share: {
      title: 'OldPho - AI Photo Restoration',
      description: 'Transform old, blurry, and damaged photos into crystal-clear memories using AI technology.'
    },
    title: 'Restore Your Photos with AI',
    description: 'Transform old, blurry, and damaged photos into crystal-clear memories using advanced AI technology.',
    upload: {
      success: 'Photo uploaded successfully!'
    },
    original: 'Original',
    restored: 'Restored',
    processing: 'Processing your photo...',
    download: 'Download',
    reset: 'Start Over',
    testimonials: {
      title: 'What Our Users Say',
      subtitle: 'Join thousands of satisfied users who have restored their precious memories.',
      items: [
        {
          name: 'Sarah Johnson',
          role: 'Family Historian',
          content: 'OldPho helped me restore my grandmother\'s wedding photo. The results were incredible - I could see details I never noticed before!',
          rating: 5
        },
        {
          name: 'Michael Chen',
          role: 'Photographer',
          content: 'As a professional photographer, I\'m amazed by the quality of OldPho\'s restoration. It\'s become my go-to tool for client work.',
          rating: 5
        },
        {
          name: 'Emma Rodriguez',
          role: 'Genealogy Researcher',
          content: 'I\'ve restored hundreds of family photos with OldPho. The AI technology is simply outstanding - it brings history back to life.',
          rating: 5
        }
      ]
    },
    privacy: {
      title: 'Your Privacy Matters',
      description: 'We take your privacy seriously. Your photos are processed securely and never stored permanently. Your memories stay yours.',
      learnMore: 'Learn More',
      startRestoring: 'Start Restoring'
    }
  },
  'zh-TW': {
    seo: {
      title: 'OldPho - AI 照片修復 | 使用 AI 修復老照片',
      description: '使用先進的 AI 技術將老舊、模糊和損壞的照片轉化為清晰的回憶。免費照片修復服務。',
      keywords: 'AI 照片修復, 老照片修復, 模糊照片修復, 照片增強, 圖像修復, AI 照片修復'
    },
    navigation: {
      home: '首頁',
      restore: '修復'
    },
    hero: {
      title: '使用 AI 修復您的回憶',
      subtitle: '使用先進的 AI 技術將老舊、模糊和損壞的照片轉化為清晰的回憶。讓您珍貴的時刻重獲新生。',
      cta: '立即開始修復'
    },
    stats: {
      photos: '已修復照片',
      satisfaction: '用戶滿意度',
      support: '客戶支持'
    },
    features: {
      title: '為什麼選擇 OldPho？',
      subtitle: '先進的 AI 技術結合用戶友好的界面，提供最佳的照片修復體驗。',
      items: [
        {
          icon: '⚡',
          title: '極速處理',
          description: '通過我們優化的 AI 處理，在幾秒內獲得修復的照片。'
        },
        {
          icon: '🎯',
          title: '高品質',
          description: '先進的 AI 算法確保最高品質的修復結果。'
        },
        {
          icon: '🔒',
          title: '隱私優先',
          description: '您的照片安全處理，絕不永久儲存。'
        },
        {
          icon: '💎',
          title: '免費使用',
          description: '免費開始修復您的照片，每月有慷慨的使用限制。'
        },
        {
          icon: '🌍',
          title: '多語言支援',
          description: '支援英文、繁體中文和日文。'
        },
        {
          icon: '📱',
          title: '行動裝置友善',
          description: '在所有裝置上完美運行 - 桌面、平板和手機。'
        }
      ]
    },
    howItWorks: {
      title: '如何使用',
      subtitle: '只需三個簡單步驟即可修復您的照片。',
      steps: [
        {
          title: '上傳照片',
          description: '上傳您的老舊、模糊或損壞的照片。我們支援 JPEG、PNG 和 JPG 格式。'
        },
        {
          title: 'AI 處理',
          description: '我們的先進 AI 分析並修復您的照片，增強細節並去除瑕疵。'
        },
        {
          title: '下載結果',
          description: '下載您美麗修復的高品質照片，準備分享和保存。'
        }
      ]
    },
    beforeAfter: {
      title: '見證奇蹟',
      subtitle: '見證從老舊、損壞的照片到清晰回憶的轉變。',
      before: '修復前',
      after: '修復後',
      examples: [
        {
          title: '家庭肖像修復',
          description: '重現珍貴家庭時刻的清晰度和溫暖。'
        },
        {
          title: '歷史照片增強',
          description: '為後代保存和增強歷史照片。'
        }
      ]
    },
    trust: {
      title: '數百萬用戶信賴',
      subtitle: '加入數百萬信賴 OldPho 進行照片修復的用戶行列。',
      items: [
        {
          icon: '🛡️',
          title: '安全處理',
          description: '您的照片安全處理，絕不永久儲存。'
        },
        {
          icon: '⚡',
          title: '快速結果',
          description: '通過我們優化的 AI 在幾秒內獲得修復的照片。'
        },
        {
          icon: '💎',
          title: '高品質',
          description: '先進的 AI 確保最高品質的修復結果。'
        },
        {
          icon: '🎯',
          title: '易於使用',
          description: '為每個人設計的簡單、直觀界面。'
        }
      ]
    },
    finalCta: {
      title: '準備好修復您的回憶了嗎？',
      subtitle: '加入已經用 OldPho 轉變老照片的數百萬用戶行列。',
      button: '立即開始修復'
    },
    share: {
      title: 'OldPho - AI Photo Restoration',
      description: '使用 AI 技術將老舊、模糊和損壞的照片轉換為清晰的回憶。'
    },
    title: '用 AI 修復您的照片',
    description: '使用先進的 AI 技術將老舊、模糊和損壞的照片轉換為清晰的回憶。',
    upload: {
      success: '照片上傳成功！'
    },
    original: '原圖',
    restored: '修復後',
    processing: '正在處理您的照片...',
    download: '下載',
    reset: '重新開始',
    testimonials: {
      title: '用戶評價',
      subtitle: '加入數千名已經修復珍貴回憶的滿意用戶。',
      items: [
        {
          name: '陳美玲',
          role: '家族史研究者',
          content: 'OldPho 幫助我修復了祖母的婚禮照片。結果令人驚嘆 - 我看到了以前從未注意到的細節！',
          rating: 5
        },
        {
          name: '王建國',
          role: '攝影師',
          content: '作為專業攝影師，我對 OldPho 修復的品質感到驚訝。它已成為我客戶工作的首選工具。',
          rating: 5
        },
        {
          name: '林雅婷',
          role: '家譜研究員',
          content: '我已經用 OldPho 修復了數百張家庭照片。AI 技術簡直太出色了 - 它讓歷史重獲新生。',
          rating: 5
        }
      ]
    },
    privacy: {
      title: '您的隱私很重要',
      description: '我們認真對待您的隱私。您的照片安全處理，絕不永久儲存。您的回憶永遠屬於您。',
      learnMore: '了解更多',
      startRestoring: '開始修復'
    }
  },
  'ja': {
    seo: {
      title: 'OldPho - AI写真復元 | AIで古い写真を復元',
      description: '先進的なAI技術を使用して、古く、ぼやけた、損傷した写真を水晶のように鮮明な思い出に変換します。無料の写真復元サービス。',
      keywords: 'AI写真復元, 古い写真修復, ぼやけた写真修正, 写真強化, 画像復元, AI写真修復'
    },
    navigation: {
      home: 'ホーム',
      restore: '復元'
    },
    hero: {
      title: 'AIで思い出を復元',
      subtitle: '先進的なAI技術を使用して、古く、ぼやけた、損傷した写真を水晶のように鮮明な思い出に変換します。大切な瞬間を蘇らせましょう。',
      cta: '復元を開始'
    },
    stats: {
      photos: '復元された写真',
      satisfaction: 'ユーザー満足度',
      support: 'カスタマーサポート'
    },
    features: {
      title: 'なぜOldPhoを選ぶのか？',
      subtitle: '先進的なAI技術とユーザーフレンドリーなインターフェースを組み合わせた最高の写真復元体験。',
      items: [
        {
          icon: '⚡',
          title: '超高速処理',
          description: '最適化されたAI処理により、数秒で復元された写真を取得。'
        },
        {
          icon: '🎯',
          title: '高品質',
          description: '先進的なAIアルゴリズムが最高品質の復元結果を保証。'
        },
        {
          icon: '🔒',
          title: 'プライバシー重視',
          description: 'お客様の写真は安全に処理され、永久に保存されることはありません。'
        },
        {
          icon: '💎',
          title: '無料使用',
          description: '寛大な月間制限で写真の復元を無料で開始。'
        },
        {
          icon: '🌍',
          title: '多言語対応',
          description: '英語、繁体中国語、日本語をサポート。'
        },
        {
          icon: '📱',
          title: 'モバイル対応',
          description: 'デスクトップ、タブレット、スマートフォンなど、すべてのデバイスで完璧に動作。'
        }
      ]
    },
    howItWorks: {
      title: '使い方',
      subtitle: 'わずか3つの簡単なステップで写真を復元。',
      steps: [
        {
          title: '写真をアップロード',
          description: '古く、ぼやけた、または損傷した写真をアップロード。JPEG、PNG、JPG形式をサポート。'
        },
        {
          title: 'AI処理',
          description: '先進的なAIが写真を分析・復元し、詳細を強化して欠陥を除去。'
        },
        {
          title: '結果をダウンロード',
          description: '美しく復元された高品質写真をダウンロードし、共有と保存の準備完了。'
        }
      ]
    },
    beforeAfter: {
      title: '魔法を体験',
      subtitle: '古く、損傷した写真から鮮明な思い出への変身を目撃。',
      before: '復元前',
      after: '復元後',
      examples: [
        {
          title: '家族写真復元',
          description: '大切な家族の瞬間の鮮明さと温かさを取り戻します。'
        },
        {
          title: '歴史写真強化',
          description: '将来の世代のために歴史写真を保存・強化。'
        }
      ]
    },
    trust: {
      title: '数百万人に信頼される',
      subtitle: '写真復元ニーズでOldPhoを信頼する数百万人のユーザーに参加。',
      items: [
        {
          icon: '🛡️',
          title: '安全な処理',
          description: 'お客様の写真は安全に処理され、永久に保存されることはありません。'
        },
        {
          icon: '⚡',
          title: '高速結果',
          description: '最適化されたAIにより、数秒で復元された写真を取得。'
        },
        {
          icon: '💎',
          title: '高品質',
          description: '先進的なAIが最高品質の復元結果を保証。'
        },
        {
          icon: '🎯',
          title: '使いやすい',
          description: '誰でも使えるシンプルで直感的なインターフェース。'
        }
      ]
    },
    finalCta: {
      title: '思い出を復元する準備はできましたか？',
      subtitle: 'すでにOldPhoで古い写真を変身させた数百万人のユーザーに参加。',
      button: '今すぐ復元開始'
    },
    share: {
      title: 'OldPho - AI写真復元',
      description: 'AI技術を使用して古く、ぼやけた、損傷した写真を鮮明な思い出に変換。'
    },
    title: 'AIで写真を復元',
    description: '先進的なAI技術を使用して古く、ぼやけた、損傷した写真を鮮明な思い出に変換。',
    upload: {
      success: '写真のアップロードが完了しました！'
    },
    original: '元の写真',
    restored: '復元後',
    processing: '写真を処理中...',
    download: 'ダウンロード',
    reset: 'やり直し',
    testimonials: {
      title: 'ユーザーの声',
      subtitle: '大切な思い出を復元した何千人もの満足したユーザーに参加。',
      items: [
        {
          name: '田中花子',
          role: '家族史研究者',
          content: 'OldPhoが祖母の結婚写真の復元を手伝ってくれました。結果は素晴らしく、以前気づかなかった細部が見えました！',
          rating: 5
        },
        {
          name: '佐藤健一',
          role: '写真家',
          content: 'プロの写真家として、OldPhoの復元品質に驚いています。クライアントワークの定番ツールになりました。',
          rating: 5
        },
        {
          name: '山田美咲',
          role: '家系図研究者',
          content: 'OldPhoで何百枚もの家族写真を復元しました。AI技術は素晴らしく、歴史を蘇らせます。',
          rating: 5
        }
      ]
    },
    privacy: {
      title: 'プライバシーを重視',
      description: 'お客様のプライバシーを真剣に考えています。写真は安全に処理され、永久に保存されることはありません。思い出はお客様のものです。',
      learnMore: '詳細を見る',
      startRestoring: '復元開始'
    }
  }
}; 
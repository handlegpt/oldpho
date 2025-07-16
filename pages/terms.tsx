import { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const Terms: NextPage = () => {
  const { currentLanguage } = useLanguage();

  const getTermsContent = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return {
          title: '服务条款',
          lastUpdated: '最后更新：2024年1月',
          sections: [
            {
              title: '1. 服务说明',
              content: 'OldPho提供基于AI技术的照片修复服务。我们致力于通过先进的人工智能技术帮助用户恢复和增强老照片。'
            },
            {
              title: '2. 用户责任',
              content: '用户有责任确保上传的照片拥有合法权利，并同意不会上传任何侵犯他人知识产权或隐私的内容。'
            },
            {
              title: '3. 服务限制',
              content: '免费用户每月可修复5张照片，专业用户每月可修复50张照片，企业用户无限制。所有修复后的照片仅供个人使用。'
            },
            {
              title: '4. 隐私保护',
              content: '我们严格保护用户隐私，上传的照片仅用于AI处理，不会用于其他目的。详细隐私政策请参见隐私政策页面。'
            },
            {
              title: '5. 免责声明',
              content: '我们尽力提供高质量的服务，但不保证修复结果完全符合用户期望。用户应自行评估修复结果。'
            },
            {
              title: '6. 服务变更',
              content: '我们保留随时修改服务条款的权利。重大变更将通过邮件或网站公告通知用户。'
            },
            {
              title: '7. 联系方式',
              content: '如有任何问题或建议，请通过网站联系表单或发送邮件至support@oldpho.com联系我们。'
            }
          ]
        };
      case 'ja':
        return {
          title: '利用規約',
          lastUpdated: '最終更新：2024年1月',
          sections: [
            {
              title: '1. サービス説明',
              content: 'OldPhoはAI技術を活用した写真復元サービスを提供します。先進的な人工知能技術により、古い写真の復元と強化を支援します。'
            },
            {
              title: '2. ユーザーの責任',
              content: 'ユーザーは、アップロードする写真の法的権利を確保し、他人の知的財産権やプライバシーを侵害するコンテンツをアップロードしないことに同意する責任があります。'
            },
            {
              title: '3. サービス制限',
              content: '無料ユーザーは月5枚、プロユーザーは月50枚、エンタープライズユーザーは無制限で写真を復元できます。復元された写真は個人使用のみに限定されます。'
            },
            {
              title: '4. プライバシー保護',
              content: 'ユーザーのプライバシーを厳格に保護し、アップロードされた写真はAI処理のみに使用され、他の目的には使用されません。詳細はプライバシーポリシーページをご覧ください。'
            },
            {
              title: '5. 免責事項',
              content: '高品質なサービスを提供するよう努めますが、復元結果がユーザーの期待に完全に合致することを保証しません。ユーザーは復元結果を自己判断してください。'
            },
            {
              title: '6. サービス変更',
              content: '利用規約を随時変更する権利を留保します。重要な変更はメールまたはウェブサイトでユーザーに通知されます。'
            },
            {
              title: '7. お問い合わせ',
              content: 'ご質問やご提案がございましたら、ウェブサイトの問い合わせフォームまたはsupport@oldpho.comまでメールでお問い合わせください。'
            }
          ]
        };
      default:
        return {
          title: 'Terms of Service',
          lastUpdated: 'Last updated: January 2024',
          sections: [
            {
              title: '1. Service Description',
              content: 'OldPho provides photo restoration services based on AI technology. We are committed to helping users restore and enhance old photos through advanced artificial intelligence technology.'
            },
            {
              title: '2. User Responsibilities',
              content: 'Users are responsible for ensuring they have legal rights to uploaded photos and agree not to upload any content that infringes on others\' intellectual property or privacy.'
            },
            {
              title: '3. Service Limitations',
              content: 'Free users can restore 5 photos per month, Pro users can restore 50 photos per month, and Enterprise users have unlimited access. All restored photos are for personal use only.'
            },
            {
              title: '4. Privacy Protection',
              content: 'We strictly protect user privacy. Uploaded photos are only used for AI processing and will not be used for other purposes. Please see our Privacy Policy page for details.'
            },
            {
              title: '5. Disclaimer',
              content: 'We strive to provide high-quality services but do not guarantee that restoration results will completely meet user expectations. Users should evaluate restoration results themselves.'
            },
            {
              title: '6. Service Changes',
              content: 'We reserve the right to modify these terms of service at any time. Significant changes will be notified to users via email or website announcements.'
            },
            {
              title: '7. Contact Information',
              content: 'If you have any questions or suggestions, please contact us through the website contact form or send an email to support@oldpho.com.'
            }
          ]
        };
    }
  };

  const content = getTermsContent();

  return (
    <>
      <Head>
        <title>{content.title} | OldPho</title>
        <meta name="description" content={currentLanguage === 'zh-TW' ? 'OldPho服务条款 - 了解我们的服务规则和使用条款' : currentLanguage === 'ja' ? 'OldPho利用規約 - サービスルールと利用条件について' : 'OldPho Terms of Service - Learn about our service rules and terms of use'} />
      </Head>
      
      <Header photo={undefined} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            <p className="text-gray-600">
              {content.lastUpdated}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              {content.sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                {currentLanguage === 'zh-TW' 
                  ? '通过使用我们的服务，您同意遵守这些条款。'
                  : currentLanguage === 'ja'
                  ? '当社のサービスをご利用いただくことで、これらの規約に同意したものとみなされます。'
                  : 'By using our services, you agree to comply with these terms.'
                }
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Terms; 
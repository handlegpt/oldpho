import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdvancedSettingsProps {
  onSettingsChange?: (settings: any) => void;
}

interface Settings {
  processingQuality: 'standard' | 'high' | 'ultra';
  autoSave: boolean;
  emailNotifications: boolean;
  processingNotifications: boolean;
  batchProcessing: boolean;
  apiAccess: boolean;
  customModels: boolean;
  dataRetention: number;
  privacyMode: boolean;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ 
  onSettingsChange 
}) => {
  const { data: session } = useSession();
  const { currentLanguage } = useLanguage();
  const [settings, setSettings] = useState<Settings>({
    processingQuality: 'standard',
    autoSave: true,
    emailNotifications: true,
    processingNotifications: true,
    batchProcessing: false,
    apiAccess: false,
    customModels: false,
    dataRetention: 30,
    privacyMode: false
  });

  const handleSettingChange = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">
        {currentLanguage === 'zh-TW' ? '高级设置' : currentLanguage === 'ja' ? '詳細設定' : 'Advanced Settings'}
      </h3>
      
      <div className="space-y-6">
        {/* Processing Quality */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {currentLanguage === 'zh-TW' ? '处理质量' : currentLanguage === 'ja' ? '処理品質' : 'Processing Quality'}
          </h4>
          <div className="space-y-2">
            {[
              { value: 'standard', label: currentLanguage === 'zh-TW' ? '标准质量' : currentLanguage === 'ja' ? '標準品質' : 'Standard Quality' },
              { value: 'high', label: currentLanguage === 'zh-TW' ? '高质量' : currentLanguage === 'ja' ? '高品質' : 'High Quality' },
              { value: 'ultra', label: currentLanguage === 'zh-TW' ? '超高质量' : currentLanguage === 'ja' ? '超高品質' : 'Ultra Quality' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="processingQuality"
                  value={option.value}
                  checked={settings.processingQuality === option.value}
                  onChange={(e) => handleSettingChange('processingQuality', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {currentLanguage === 'zh-TW' ? '通知设置' : currentLanguage === 'ja' ? '通知設定' : 'Notification Settings'}
          </h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {currentLanguage === 'zh-TW' ? '邮件通知' : currentLanguage === 'ja' ? 'メール通知' : 'Email Notifications'}
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.processingNotifications}
                onChange={(e) => handleSettingChange('processingNotifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {currentLanguage === 'zh-TW' ? '处理进度通知' : currentLanguage === 'ja' ? '処理進捗通知' : 'Processing Notifications'}
              </span>
            </label>
          </div>
        </div>

        {/* Advanced Features */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {currentLanguage === 'zh-TW' ? '高级功能' : currentLanguage === 'ja' ? '高度な機能' : 'Advanced Features'}
          </h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {currentLanguage === 'zh-TW' ? '自动保存' : currentLanguage === 'ja' ? '自動保存' : 'Auto Save'}
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.batchProcessing}
                onChange={(e) => handleSettingChange('batchProcessing', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {currentLanguage === 'zh-TW' ? '批量处理' : currentLanguage === 'ja' ? 'バッチ処理' : 'Batch Processing'}
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.apiAccess}
                onChange={(e) => handleSettingChange('apiAccess', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {currentLanguage === 'zh-TW' ? 'API 访问' : currentLanguage === 'ja' ? 'API アクセス' : 'API Access'}
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.customModels}
                onChange={(e) => handleSettingChange('customModels', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {currentLanguage === 'zh-TW' ? '自定义模型' : currentLanguage === 'ja' ? 'カスタムモデル' : 'Custom Models'}
              </span>
            </label>
          </div>
        </div>

        {/* Privacy & Data */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {currentLanguage === 'zh-TW' ? '隐私与数据' : currentLanguage === 'ja' ? 'プライバシーとデータ' : 'Privacy & Data'}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {currentLanguage === 'zh-TW' ? '数据保留时间（天）' : currentLanguage === 'ja' ? 'データ保持期間（日）' : 'Data Retention (days)'}
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>7 {currentLanguage === 'zh-TW' ? '天' : currentLanguage === 'ja' ? '日' : 'days'}</option>
                <option value={30}>30 {currentLanguage === 'zh-TW' ? '天' : currentLanguage === 'ja' ? '日' : 'days'}</option>
                <option value={90}>90 {currentLanguage === 'zh-TW' ? '天' : currentLanguage === 'ja' ? '日' : 'days'}</option>
                <option value={365}>365 {currentLanguage === 'zh-TW' ? '天' : currentLanguage === 'ja' ? '日' : 'days'}</option>
              </select>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacyMode}
                onChange={(e) => handleSettingChange('privacyMode', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {currentLanguage === 'zh-TW' ? '隐私模式' : currentLanguage === 'ja' ? 'プライバシーモード' : 'Privacy Mode'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => onSettingsChange?.(settings)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {currentLanguage === 'zh-TW' ? '保存设置' : currentLanguage === 'ja' ? '設定を保存' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdvancedSettings; 
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  maxGenerations: number;
  features: string[];
}

interface UserRoleManagerProps {
  onRoleChange?: (role: string) => void;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ 
  onRoleChange 
}) => {
  const { data: session } = useSession();
  const { currentLanguage } = useLanguage();
  const [userRole, setUserRole] = useState<string>('free');
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    // Define available roles
    const roles: UserRole[] = [
      {
        id: 'free',
        name: currentLanguage === 'zh-TW' ? '免费用户' : currentLanguage === 'ja' ? '無料ユーザー' : 'Free User',
        permissions: ['basic_restoration', 'view_history'],
        maxGenerations: 5,
        features: ['basic_ai_restoration', 'standard_quality']
      },
      {
        id: 'pro',
        name: currentLanguage === 'zh-TW' ? '专业用户' : currentLanguage === 'ja' ? 'プロユーザー' : 'Pro User',
        permissions: ['advanced_restoration', 'priority_processing', 'bulk_upload'],
        maxGenerations: 50,
        features: ['advanced_ai_restoration', 'high_quality', 'batch_processing']
      },
      {
        id: 'enterprise',
        name: currentLanguage === 'zh-TW' ? '企业用户' : currentLanguage === 'ja' ? 'エンタープライズユーザー' : 'Enterprise User',
        permissions: ['unlimited_restoration', 'api_access', 'custom_models'],
        maxGenerations: -1, // Unlimited
        features: ['unlimited_ai_restoration', 'highest_quality', 'api_integration', 'custom_models']
      }
    ];
    setAvailableRoles(roles);
  }, [currentLanguage]);

  const handleRoleChange = (roleId: string) => {
    setUserRole(roleId);
    onRoleChange?.(roleId);
  };

  const getCurrentRole = () => {
    return availableRoles.find(role => role.id === userRole);
  };

  const currentRole = getCurrentRole();

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {currentLanguage === 'zh-TW' ? '用户权限管理' : currentLanguage === 'ja' ? 'ユーザー権限管理' : 'User Role Management'}
      </h3>
      
      <div className="space-y-4">
        {availableRoles.map((role) => (
          <div
            key={role.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              userRole === role.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleRoleChange(role.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{role.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {role.maxGenerations === -1 
                    ? (currentLanguage === 'zh-TW' ? '无限次数' : currentLanguage === 'ja' ? '無制限' : 'Unlimited')
                    : `${role.maxGenerations} ${currentLanguage === 'zh-TW' ? '次/月' : currentLanguage === 'ja' ? '回/月' : 'times/month'}`
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {role.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {userRole === role.id && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {currentLanguage === 'zh-TW' ? '当前权限' : currentLanguage === 'ja' ? '現在の権限' : 'Current Permissions'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {currentRole && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            {currentLanguage === 'zh-TW' ? '当前角色信息' : currentLanguage === 'ja' ? '現在のロール情報' : 'Current Role Info'}
          </h4>
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">
                {currentLanguage === 'zh-TW' ? '角色' : currentLanguage === 'ja' ? 'ロール' : 'Role'}
              </span>
              : {currentRole.name}
            </p>
            <p>
              <span className="font-medium">
                {currentLanguage === 'zh-TW' ? '生成次数' : currentLanguage === 'ja' ? '生成回数' : 'Generations'}
              </span>
              : {currentRole.maxGenerations === -1 
                ? (currentLanguage === 'zh-TW' ? '无限制' : currentLanguage === 'ja' ? '無制限' : 'Unlimited')
                : currentRole.maxGenerations
              }
            </p>
            <p>
              <span className="font-medium">
                {currentLanguage === 'zh-TW' ? '功能' : currentLanguage === 'ja' ? '機能' : 'Features'}
              </span>
              : {currentRole.features.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManager; 
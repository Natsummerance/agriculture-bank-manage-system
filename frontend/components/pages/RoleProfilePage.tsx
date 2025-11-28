import { useRole } from '../../contexts/RoleContext';
import { ProfilePage } from '../ProfilePage';

// 所有角色共用ProfilePage，但会根据RoleContext显示不同内容
export function RoleProfilePage() {
  return <ProfilePage />;
}

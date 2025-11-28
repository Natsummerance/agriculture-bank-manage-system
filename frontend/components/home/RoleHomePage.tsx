import { FarmerHome } from './FarmerHome';
import { BuyerHome } from './BuyerHome';
import { BankHome } from './BankHome';
import { ExpertHome } from './ExpertHome';
import { AdminHome } from './AdminHome';
import { useRole } from '../../contexts/RoleContext';

export function RoleHomePage() {
  const { role } = useRole();

  if (!role) {
    // 默认显示农户主页
    return <FarmerHome />;
  }

  switch (role) {
    case 'farmer':
      return <FarmerHome />;
    case 'buyer':
      return <BuyerHome />;
    case 'bank':
      return <BankHome />;
    case 'expert':
      return <ExpertHome />;
    case 'admin':
      return <AdminHome />;
    default:
      return <FarmerHome />;
  }
}

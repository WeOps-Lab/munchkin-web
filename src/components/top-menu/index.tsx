import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserInfo from '../user-info';
import Icon from '@/components/icon';
import { useTranslation } from '@/utils/i18n';
import menuStyle from './index.module.less';

const TopMenu = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const menuItems = [
    { label: t('knowledge.menu'), icon: 'zhishiku1', path: '/knowledge' },
    { label: t('skill.menu'), icon: 'weibiaoti3', path: '/skill' },
    { label: t('provider.menu'), icon: 'moxing2', path: '/provider' },
  ];

  return (
    <div className="z-30 flex flex-col grow-0 shrink-0 w-full basis-auto min-h-[56px]">
      <div className="flex flex-1 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Image src="/logo-site.png" className="block w-auto h-10" alt="logo" width={100} height={40} />
          <div>WeOps</div>
        </div>
        <div className="flex items-center space-x-4">
          {menuItems.map((item) => {
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            return (
              <Link key={item.path} prefetch={false} href={item.path} legacyBehavior>
                <a className={`px-3 py-2 rounded-[10px] flex items-center ${menuStyle.menuCol} ${isActive ? menuStyle.active : ''}`}>
                  <Icon type={item.icon} className="mr-2 w-4 h-4" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center flex-shrink-0 space-x-4">
          <UserInfo />
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
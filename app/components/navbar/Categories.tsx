'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  GiCampingTent, GiFlyingTrout
  , GiHutsVillage, GiMountainCave, GiSofa, GiWaterTower, GiWaveSurfer,
} from 'react-icons/gi';
import { FaHotel, FaSchool } from 'react-icons/fa';

import { MdPool, MdWarehouse } from 'react-icons/md';

import CategoryBox from '../CategoryBox';
import Container from '../Container';
import { AiTwotoneHome } from 'react-icons/ai';
import { FcHome } from 'react-icons/fc';
import { SiInfluxdb } from 'react-icons/si';
import { TbHomeStar } from 'react-icons/tb';

export const categories = [
  {
    label: 'طيرمان',
    icon: GiFlyingTrout,
    description: 'هذا العقار يحتوي على طيرمان !',
  },
  {
    label: 'دشمة',
    icon: GiWaterTower,
    description: 'هذا المكان يحتوي على دشمة ',
  },
  {
    label: 'شاليهات',
    icon: GiSofa,
    description: 'هذا المكان شالي ',
  }, {
    label: 'قاعة اعراس ومناسبات',
    icon: FaSchool,
    description: 'هذا المكان قاعة اعراس ومناسبات ',
  }, {
    label: 'عصري',
    icon: SiInfluxdb,
    description: 'هذا المكان عصري',
  },
  {
    label: 'ريف',
    icon: GiHutsVillage,
    description: 'هذا المكان يتواجد في الريف ',
  },
  {
    label: 'مسابح',
    icon: MdPool,
    description: 'هذا المكان يحتوي على مسبح',
  },
  {
    label: 'جبال',
    icon: GiMountainCave,
    description: 'هذا العقار يتواجد في جبال',
  },
  {
    label: 'ساحل',
    icon: GiWaveSurfer,
    description: 'هذا المكان يتواجد على الساحل',
  },
  {
    label: 'فنادق',
    icon: FaHotel,
    description: 'هذا المكان يتواجد في فندق',
  },
  {
    label: 'مخيمات',
    icon: GiCampingTent,
    description: 'للتخييم',
  },
  {
    label: 'بيوت للأيجار',
    icon: AiTwotoneHome,
    description: 'هذا العقار للأيجار',
  },
  {
    label: 'بيوت للبيع',
    icon: TbHomeStar,
    description: 'This property is brand new and luxurious!',
  },
  {
    label: 'هناجر',
    icon: MdWarehouse,
    description: 'هذا العقار يتواجد فية مخزن',
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className='
          pt-4
          flex
          flex-row
          items-center
          justify-between
          overflow-x-auto
        '
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;

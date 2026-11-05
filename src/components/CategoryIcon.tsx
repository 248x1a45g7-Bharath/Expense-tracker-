import React from 'react';
import {
  Utensils,
  Plane,
  ShoppingBag,
  GraduationCap,
  Receipt,
  Film,
  MoreHorizontal,
  LucideIcon,
} from 'lucide-react';
import { ExpenseCategory } from '../types/expense';
import { CATEGORIES } from '../constants/categories';

interface CategoryIconProps {
  category: ExpenseCategory;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Plane,
  ShoppingBag,
  GraduationCap,
  Receipt,
  Film,
  MoreHorizontal,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 20,
  className = '',
  showBackground = true,
}) => {
  const cat = CATEGORIES[category] || CATEGORIES.Others;
  const IconComponent = iconMap[cat.iconName] || MoreHorizontal;

  if (!showBackground) {
    return <IconComponent size={size} style={{ color: cat.color }} className={className} />;
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl shrink-0 transition-transform ${className}`}
      style={{
        backgroundColor: cat.bgColor,
        width: size * 2,
        height: size * 2,
        border: `1.5px solid ${cat.borderColor}`,
      }}
    >
      <IconComponent size={size} style={{ color: cat.color }} strokeWidth={2.2} />
    </div>
  );
};

import React from 'react';

interface BadgeProps {
  icon: string;
  label: string;
  category: 'tom' | 'vies' | 'contradicao';
}

const Badge = React.memo<BadgeProps>(({ icon, label, category }) => {
  return (
    <div className={`badge ${category}`}>
      <span>{icon}</span> {label}
    </div>
  );
});

export default Badge;
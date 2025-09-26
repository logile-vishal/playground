import SvgIcon from '@/core/components/icon/Icon';
import { icons } from '@/core/constants/icons';
import type { IconName } from '@/core/types/icon.type';

export const IconsDemo: React.FC = () => {
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem 0'}}>
    {
        Object.keys(icons).map((name) => (
            <div style={
                {
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    border: '1px solid #ccc', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    height: '120px',
                    width: '120px'
            }} key={name}>
            <SvgIcon component={name as IconName} size={64} fill="#888888" /> 
            <span>{name}</span>
            </div>
        ))
    }
    </div>
  );
};
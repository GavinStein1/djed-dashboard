// components/Icon.tsx
import React from 'react';
import Image from 'next/image';
import { read } from 'fs';

interface IconProps {
  name: string; // Assuming you have SVG files with the corresponding names
  size?: number;
  color?: string;
  fileType?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor', fileType ='svg'}) => {
    const filePath = `/${name}.${fileType}`;
    return (
        <Image 
            src={filePath}
            width={size}
            height={size}
            alt="button icon"
            color={color}
        />
    );
};

export default Icon;

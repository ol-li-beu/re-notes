"use client"; 

import { usePathname } from 'next/navigation';

import RectangularLogo from '@/components/ui/RectangularLogo/RectangularLogo';
import { Icon } from '@/components/ui/Icons/Icons';

import styles from './footer.module.css'

interface FooterProps {
    dict: any
}

export function Footer({dict} : FooterProps) {

    // not rendering when on canvas
    const pathname = usePathname();
    const inCanvas = pathname.includes('/canvas');

    const socials = { name: dict.footer.repo , url: 'https://github.com/ol-li-beu/re-notes' };
    const collaborators = [
        { name: 'agustnlee', url: 'https://github.com/agustnlee' },
        { name: 'tomasaromero', url: 'https://github.com/tomasaromero' }
    ]

    return (
        <footer className={styles['footer']} >
            <div className={`${styles['footer-container']}`}>
            {/* Left Panel LogoOnly */}
                <div>
                    <RectangularLogo type="footer"/>
                </div>

            {/* Middle Panel (future terms and services)*/} 
                <div>
                    <p> {dict.footer.rights} </p>
                </div>

            {/* Right Panel Socials*/}
                <div>
                    
                    <ul className={styles['social-list']}>
                        <a href={socials.url}  target="_blank" rel="noopener noreferrer"> 
                            <Icon name="repo"/> {socials.name} 
                        </a> 
                        {collaborators.map((collaborator) => (
                            <li key={collaborator.name}>
                                <a href={collaborator.url} target="_blank" rel="noopener noreferrer">
                                    <Icon name="github"/> {collaborator.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
  );
}

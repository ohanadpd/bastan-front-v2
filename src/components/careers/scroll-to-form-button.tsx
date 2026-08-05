'use client';

import { Button } from '@/components/ui/button';

interface ScrollToFormButtonProps {
    children: React.ReactNode;
    className?: string;
}

export default function ScrollToFormButton({ children, className }: ScrollToFormButtonProps) {
    const handleClick = () => {
        const resumeForm = document.getElementById('resume-form');
        if (resumeForm) {
            resumeForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Button className={className} onClick={handleClick}>
            {children}
        </Button>
    );
}

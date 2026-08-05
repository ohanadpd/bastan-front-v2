'use client';
import { useSettingsStore } from '@/store/settingsStore';
import { SettingsPageData } from '@/types/settings.types';
import { useEffect } from 'react';

export default function SetSettings({ init }: { init: SettingsPageData }) {
    const setSettings = useSettingsStore((state) => state.setSettings);
    useEffect(() => {
        setSettings(init)
    }, [init, setSettings])
    
    return null
}
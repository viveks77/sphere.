"use client";

import React from 'react'
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const supabase = createClient();
    const router = useRouter();
    const signOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }

    return (
    <Button variant="ghost" onClick={signOut}>Logout</Button>
  )
}

export default LogoutButton
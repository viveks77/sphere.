"use client";

import React from 'react'
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';

const LogoutButton = () => {
    const supabase = createClient();
    
    const signOut = async () => {
        await supabase.auth.signOut();
    }

    return (
    <Button variant="ghost" onClick={signOut}>Logout</Button>
  )
}

export default LogoutButton
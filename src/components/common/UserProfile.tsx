"use client";

import React from "react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CircleUserRound, UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type props = {
	user: User;
};

const UserProfile = ({ user }: props) => {
	const supabase = createClient();

	const router = useRouter();
	const signOut = async () => {
		await supabase.auth.signOut();
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size={"icon"} className="rounded-full outline-none">
					<CircleUserRound size={"20px"} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
        <DropdownMenuItem className="mb-1">
          <strong>{user.email}</strong>
        </DropdownMenuItem>
        <hr />
        <DropdownMenuItem className="mt-1" onClick={signOut}>
          Signout
        </DropdownMenuItem>
      </DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserProfile;

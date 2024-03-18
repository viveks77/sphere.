
import React from "react";
import MaxwidthWrapper from "./common/MaxwidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./common/LogoutButton";

const Navbar = async () => {
	const supabase = createClient();
	const { data, error  } = await supabase.auth.getUser();
	const user = data?.user;
    
    return (
		<nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b bg-background/50 backdrop-blur-lg transition-all">
			<MaxwidthWrapper>
				<div className="flex h-14 items-center justify-between">
					<Link href="/" className="flex z-40 font-semibold">
						PDFspace
					</Link>
					<div className="hidden items-center space-x-4 sm:flex">
						<>
							<Link href="/pricing" className={buttonVariants({ variant: "ghost", size: "sm" })}>
								Pricing
							</Link>
							{ user ? <LogoutButton />:
								<Link className={buttonVariants({ variant: "ghost", size: "sm" })} href="/login">
									Sign in
								</Link>
							}
							<ModeToggle />
						</>
					</div>
				</div>
			</MaxwidthWrapper>
		</nav>
	);
};

export default Navbar;

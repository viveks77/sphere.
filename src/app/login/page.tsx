"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});

export default function LoginPage() {
	const supabase = createClient();
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(true);
	const [buttonLoading, setButtonLoading] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (data.user) {
				router.replace("/dashboard");
			} else {
				setLoading(false);
			}
		})();
	}, []);

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function submit(values: z.infer<typeof loginSchema>) {
		setButtonLoading(true);
		const { error } = await supabase.auth.signInWithPassword(values);

		if (error) {
			console.log(error);
			setButtonLoading(false);
			return;
		}
		router.replace("/dashboard");
		router.refresh();
	}

	return (
		<>
			{loading ? (
				<div className="mt-[8rem]">
					<Loader2 className='mx-auto my-auto h-6 w-6 animate-spin'/>
				</div>
			) : (
				<Card className="mx-auto max-w-sm mt-[8rem]">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>Enter your email below to login to your account</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<div className="grid gap-2">
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="Enter your email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<div className="grid gap-2">
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input placeholder="Enter your password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
								<Button type="submit" className="w-full">
									{buttonLoading ? <Loader2 className="mx-auto my-auto h-6 w-6 animate-spin" /> : "Login"}
								</Button>
							</form>
						</Form>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link href="#" className="underline">
								Sign up
							</Link>
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}

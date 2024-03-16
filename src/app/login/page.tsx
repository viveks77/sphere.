"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});

export default function LoginPage() {
  const router = useRouter();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function submit(values: z.infer<typeof loginSchema>) {
		console.log(values);
		const supabase = createClient();
		const { error } = await supabase.auth.signInWithPassword(values);

		if (error) {
			console.log(error);
			return;
		}

		router.push("/dashboard");
	}

	return (
		<div className="mt-[7rem]">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submit)} className="mx-auto space-y-2 w-[340px] p-2">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input placeholder="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className="w-full" type="submit">
						Login
					</Button>
				</form>
			</Form>
		</div>
	);
}

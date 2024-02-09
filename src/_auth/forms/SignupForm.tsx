import { z } from "zod"
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"


const SignupForm = () => {
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      name : '',
      email : '',
      password : ''
    },
  })

  const isLoading = false;
  const handleSignup = (values: z.infer<typeof SignupValidation>) => {
      
  }
  return (
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src='https://res.cloudinary.com/dd1ynbj52/image/upload/v1689249785/socialMedia/logo-image_xzr5s6.png' alt='log' className="sm:w-60 "/>
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
              Create a new account
          </h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
              To use Knot media, Please enter your details.
          </p>
        
          <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
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
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">
              {
                isLoading ? (
                  <div className="flex-center gap-2">
                    <Loader/> Loading...
                  </div>
                ) : "Sign Up"
              }
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">
                Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
          </form>
      </div>
    </Form>
  )
}

export default SignupForm
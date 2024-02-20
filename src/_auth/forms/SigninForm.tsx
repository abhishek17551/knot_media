import { z } from "zod"
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import {  useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { SigninValidation } from "@/lib/validation"




const SigninForm = () => {
  const {checkAuthUser, isLoading : isUserLoading} = useUserContext()
  const {mutateAsync : signInAccount } = useSignInAccount()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email : '',
      password : ''
    },
  })

  const { toast } = useToast()

  const handleSignin = async (values: z.infer<typeof SigninValidation>) => {

      const session = await signInAccount({
        email : values.email,
        password : values.password
      })

      if(!session) {
        return  toast({
          title: "Sign Up failed. Please try again.",
        })
      }

      const isLoggedIn = await checkAuthUser();

      if(isLoggedIn) {
        form.reset()
        navigate('/')
      } else {
        return  toast({
          title: "Sign Up failed. Please try again.",
        })
      }
  }
  return (
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src='https://res.cloudinary.com/dd1ynbj52/image/upload/v1689249785/socialMedia/logo-image_xzr5s6.png' alt='log' className="sm:w-60 "/>
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
              Login in to your account
          </h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
              Welcome back! Please enter your details
          </p>
        
          <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full mt-4">

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
                isUserLoading? (
                  <div className="flex-center gap-2">
                    <Loader/> Loading...
                  </div>
                ) : "Sign In"
              }
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">
                Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign Up
            </Link>
          </p>
          </form>
      </div>
    </Form>
  )
}

export default SigninForm
import { z } from "zod"

export const SignupValidation = z.object({
    name : z.string().min(2,{message : 'Name too short.'}),
    username: z.string().min(2, {message : 'Username too short'}),
    email : z.string().email(),
    password : z.string().min(8, {message : 'Password must be atleast 8 characters long.'})
  })

  export const SigninValidation = z.object({
    email : z.string().email(),
    password : z.string().min(8, {message : 'Password must be atleast 8 characters long.'})
  })

import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const isAuthenticated = false;
  
  return (
    
      <>
        {
          isAuthenticated ? (
            <Navigate to='/'/>
          ) : (
            <>
              <section className='flex flex-1 justify-center items-center flex-col py-10'>
                <Outlet/>
              </section>
              <img 
                src='https://res.cloudinary.com/dd1ynbj52/image/upload/v1689605616/login-hero-image_yakrea.jpg' 
                alt='landing-page-image'
                className="xl:block h-screen w-1/2 object-cover bg-no-repeat"
                />

            </>
          )
        }
      </>
    
  )
}

export default AuthLayout
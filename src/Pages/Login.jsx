import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthProvider';
import google from '../Assets/img/icon/google.png'

const Login = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const handleLogin = data => {
    const { email, password } = data;
    signIn(email, password)
      .then(result => {
        const user = result.user;
        // setAuthToken(user)
        console.log(user);
        navigate(from, { replace: true });
      })
      .then(error => console.error(error))
  };
  return (
    <div className='lg:h-[89vh] flex justify-center'>
      <div className='lg:w-1/3 mx-2 lg:mx-0 shadow-xl mt-8 mb-80 p-5 rounded-xl bg-white'>
        <h2 className='text-2xl font-semibold mb-5'>Please Login</h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className='form-control w-full'>
            <label className="label">
              <span className="label-email">Email</span>
            </label>
            <input type='email' {...register("email", { required: 'Email address is required' })} className='rounded-lg input-bordered input' />
            {errors.email && <p className='text-red-600 text-left'>{errors.email?.message}</p>}
          </div>
          <div className='form-control w-full'>
            <label className="label">
              <span className="label-password">Password</span>
            </label>
            <input type='password' {...register("password", {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be min 6 characters' }
            })} className='rounded-lg input-bordered input' />
            {errors.password && <p className='text-red-600 text-left'>{errors.password?.message}</p>}
            <label className="label">
              <a href="/" className="label-text-alt link link-hover">Forgot password?</a>
            </label>
          </div>
          <input type="submit" value='Login' className='btn btn-primary text-white my-4 w-full' />
        </form>
        <p>New to Camera Crew ? <Link to='/signup' className='text-primary font-semibold' >Create new account</Link></p>
        <div className="divider">OR</div>
        <button className='btn btn-outline btn-primary w-full'><img src={google} className='h-8 mr-2' alt="google" /> Continue with Google</button>
      </div>
    </div>
  );
};

export default Login;
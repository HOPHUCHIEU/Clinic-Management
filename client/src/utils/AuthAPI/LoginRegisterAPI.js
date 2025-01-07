import axios from "../../config/axios.customize";
const LoginApi= (email, password) =>{
    const URL_API="/api/auth/login";
    const data ={
        email,password
     }
     return axios.post(URL_API, data)
}
const ResgisterApi= (first_name,last_name,email,password,phone,address,gender,birthdate)=>{
    const URL_API="/api/auth/register";
    const data ={
        first_name,last_name,email,password,phone,address,gender,birthdate
     }
     return axios.post(URL_API, data)
}
export  {LoginApi,ResgisterApi};
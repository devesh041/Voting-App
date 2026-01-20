import React, { useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { voteActions } from "./store/vote-slice";


const Login = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error , setError] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(state => state?.vote?.currentVoter?.token);

  useEffect(() => {
    if(token){
      navigate("/");
    }
  }, [token, navigate])

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const loginVoter = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/login`, userData)
      const newVoter = await response.data;
      localStorage.setItem("currentVoter" , JSON.stringify(newVoter))
      dispatch(voteActions.changeCurrentVoter(newVoter))
      navigate("/")
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  console.log(userData)
  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign in</h2>

        <form onSubmit={loginVoter}>
          {error && <p className="form__error-message">
            {error}
          </p>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={changeInputHandler}
            autoComplete="true"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={changeInputHandler}
            autoComplete="true"
            autoFocus
          />

          <p>
            Don't have an account?{" "}
            <Link to="/register">Sign up</Link>
          </p>

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
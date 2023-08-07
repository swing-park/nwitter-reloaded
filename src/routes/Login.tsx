import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/Auth";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<{ [key: string]: string }>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || form.email === "" || form.password === "") return;

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={handleOnSubmit}>
        <Input
          onChange={handleOnChange}
          name="email"
          value={form.email}
          placeholder="Email"
          type="text"
          required
        />
        <Input
          onChange={handleOnChange}
          name="password"
          value={form.password}
          placeholder="Password"
          type="text"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으신가요 ? <Link to="/create-account">계정 만들기 →</Link>
      </Switcher>
    </Wrapper>
  );
};

export default Login;

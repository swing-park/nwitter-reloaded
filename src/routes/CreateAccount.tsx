import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

const CreateAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<{ [key: string]: string }>({
    name: "",
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
    if (
      isLoading ||
      form.name === "" ||
      form.email === "" ||
      form.password === ""
    )
      return;

    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(credentials.user, { displayName: form.name });
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
      <Title>Join 𝕏</Title>
      <Form onSubmit={handleOnSubmit}>
        <Input
          onChange={handleOnChange}
          name="name"
          value={form.name}
          placeholder="Name"
          type="text"
        />
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
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 이미 있으신가요 ? <Link to="/login">로그인 →</Link>
      </Switcher>
    </Wrapper>
  );
};

export default CreateAccount;

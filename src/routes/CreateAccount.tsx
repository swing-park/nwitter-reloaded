import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;

  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

const CreateAccount = () => {
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

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // create an account
      // set the name of the user
      // redirect to the homepage
    } catch (e) {
      setError(`${e}`);
    } finally {
      setIsLoading(false);
    }
    console.log(form);
  };

  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
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
    </Wrapper>
  );
};

export default CreateAccount;

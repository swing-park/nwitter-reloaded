import { auth } from "../firebase";

const Home = () => {
  const logout = () => auth.signOut();
  return (
    <>
      <h1>Home</h1>
      <button onClick={logout}>Log Out</button>
    </>
  );
};

export default Home;

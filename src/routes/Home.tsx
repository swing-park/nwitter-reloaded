import { auth } from "../firebase";

const Home = () => {
  const logout = () => auth.signOut();
  return (
    <>
      <button onClick={logout}>Log Out</button>
    </>
  );
};

export default Home;

import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { ReactComponent as Home } from "../assets/home.svg";
import { ReactComponent as Profile } from "../assets/profile.svg";
import { ReactComponent as LogOut } from "../assets/logout.svg";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  padding: 50px 0px;
  width: 100%;
  height: 100%;
  max-width: 860px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  height: 50px;
  width: 50px;
  border-radius: 50%;

  svg {
    width: 30px;
    fill: white;
  }

  &.log-out {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
`;

const Layout = () => {
  const navigate = useNavigate();
  const onLogOut = async () => {
    const isConfirm = confirm("Are you sure you want to log out?");

    if (isConfirm) {
      await auth.signOut();
      navigate("/login");
    }
  };

  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem>
            <Home />
          </MenuItem>
        </Link>

        <Link to="/profile">
          <MenuItem>
            <Profile />
          </MenuItem>
        </Link>
        <MenuItem className="log-out" onClick={onLogOut}>
          <LogOut />
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
};

export default Layout;

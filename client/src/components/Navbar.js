import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button } from "./ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@radix-ui/react-menubar";

// create a Navbar function
function Navbar() {
  // call for the logout function
  const { logout } = useLogout();
  // call for the user context from useAuthContext to show the email of the user if he has logged in
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between">
      <Menubar className="flex items-center space-x-4">
        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          </MenubarTrigger>
        </MenubarMenu>
  
        <MenubarMenu>
          <MenubarTrigger className="text-white hover:text-gray-300">Inspect</MenubarTrigger>
          <MenubarContent className="bg-gray-700 rounded shadow-lg">
            <MenubarItem>
              <Link to="/users" className="block px-4 py-2 text-white hover:bg-gray-600">Users</Link>
            </MenubarItem>
            <MenubarSeparator className="border-t border-gray-600" />
            <MenubarItem>
              <Link to="/teams" className="block px-4 py-2 text-white hover:bg-gray-600">Teams</Link>
            </MenubarItem>
            <MenubarSeparator className="border-t border-gray-600" />
            <MenubarItem>
              <Link to="/tournaments" className="block px-4 py-2 text-white hover:bg-gray-600">Tournaments</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
  
        <MenubarMenu>
          <MenubarTrigger className="text-white hover:text-gray-300">Configure</MenubarTrigger>
          <MenubarContent className="bg-gray-700 rounded shadow-lg">
            <MenubarItem>
              <Link to="/games" className="block px-4 py-2 text-white hover:bg-gray-600">Games</Link>
            </MenubarItem>
            <MenubarSeparator className="border-t border-gray-600" />
            <MenubarItem>
              <Link to="/venues" className="block px-4 py-2 text-white hover:bg-gray-600">Venues</Link>
            </MenubarItem>
            <MenubarSeparator className="border-t border-gray-600" />
            <MenubarItem>
              <Link to="/referees" className="block px-4 py-2 text-white hover:bg-gray-600">Referees</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
  
      <div className="flex items-center space-x-4">
        <span className="text-white">{user.email}</span>
        <Button onClick={handleClick} className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-3xl">Logout</Button>
      </div>
    </div>
  );
  
}

// export Navbar
export default Navbar;

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
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        {user && (
          <>
            <MenubarMenu>
              <MenubarTrigger className="text-white hover:text-gray-300">
                Tournament
              </MenubarTrigger>
              <MenubarContent className="bg-gray-700 rounded shadow-lg">
                <MenubarItem>
                  <Link
                    to="/tournaments/join"
                    className="block px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Join
                  </Link>
                </MenubarItem>
                <MenubarSeparator className="border-t border-gray-600" />
                <MenubarItem>
                  <Link
                    to="/tournaments/create"
                    className="block px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Create
                  </Link>
                </MenubarItem>
                <MenubarSeparator className="border-t border-gray-600" />
                <MenubarItem>
                  <Link
                    to="/tournaments/monitor"
                    className="block px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Monitor
                  </Link>
                </MenubarItem>
                <MenubarSeparator className="border-t border-gray-600" />
                <MenubarItem>
                  <Link
                    to="/tournaments/setting"
                    className="block px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Setting
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-white hover:text-gray-300">
                Team
              </MenubarTrigger>
              <MenubarContent className="bg-gray-700 rounded shadow-lg">
                <MenubarItem>
                  <Link
                    to="/teams/create"
                    className="block px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Create
                  </Link>
                </MenubarItem>
                <MenubarSeparator className="border-t border-gray-600" />
                <MenubarItem>
                  <Link
                    to="/teams/monitor"
                    className="block px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Monitor
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-white hover:text-gray-300">
                Payment
              </MenubarTrigger>
              <MenubarContent className="bg-gray-700 rounded shadow-lg">
                <MenubarSeparator className="border-t border-gray-600" />
                <MenubarItem>
                  <Link
                    to="/payments/history"
                    className="block px-4 py-2 text-white hover:bg-gray-600"
                  >
                    History
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </>
        )}

        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/about" className="text-white hover:text-gray-300">
              About
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/contact" className="text-white hover:text-gray-300">
              Contact Us
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      {!user ? (
        <div>
          <Button asChild variant="link">
            <Link to="/login" className="text-white">Login</Link>
          </Button>
          <Button asChild variant="link">
            <Link to="/signup" className="text-white">Signup</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-white">{user.email}</span>
          <Button
            onClick={handleClick}
            className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-3xl"
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}

// export Navbar
export default Navbar;

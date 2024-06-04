import { Route, Routes } from "react-router-dom";
import UserList from "../pages/User/UserList";
import User from "../pages/User/User";
import NotFound from "../pages/NotFound";

function UserRoutes() {
  return (
    <Routes>
      <Route index element={<UserList />} />
      <Route path=":id" element={<User />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default UserRoutes;

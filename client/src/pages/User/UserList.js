import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import React from "react";
import { useUserContext } from "src/hooks/useUserContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { format } from "date-fns";
import { Button } from "src/components/ui/button";
import { useAuthContext } from "src/hooks/useAuthContext";

const UserList = () => {
  const { users, dispatch } = useUserContext();
  const { user } = useAuthContext();

  const handleClick = async ({ id }) => {
    if(!user){
      return
    }

    // fetch the delete API
    const response = await fetch(
      "http://localhost:3002/api/users/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    // get the json response
    const json = await response.json()

    // if ok, proceed
    if(response.ok){
      dispatch({type: "DELETE_USER",payload: json})
    }

  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Users List</h2>
      <Table className="w-3/4 divide-y divide-gray-200 mx-auto">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
              User ID
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user._id}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(user.createdAt), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              <Button onClick={() => handleClick({ id: user._id })}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;

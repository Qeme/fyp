import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { RefereeEditTrigger } from "./RefereeEditTrigger";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useInitialUser } from "src/hooks/useInitialUser";

// create a function to handle Listing all users to user
const RefereeList = () => {
  const { users, dispatch } = useInitialUser();
  const { user } = useAuthContext();

  // create a function to handle DELETE user by grabbing the id of the user as argument
  const handleClick = async (id) => {
    // if no user at all, just disable the delete button functionality
    if (!user) {
      return;
    }

    try {
      // create a variable to delete one particular id, make sure include method: DELETE
      const response = await fetch("http://localhost:3002/api/users/" + id, {
        method: "DELETE",
      });

      // pass the json data from response either as single data (deleted) or error data
      const json = await response.json();

      if (response.ok) {
        // as we grab all the json users data, we now DELETE that user by using the dispatch (filter the users)
        dispatch({ type: "DELETE_USER", payload: json });
      } else {
        // if no response, send error to console
        console.error("Error deleting the user:", response.statusText);
      }
    } catch (error) {
      // this error indicates the fetching process not working at all, has backend problem
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-left">Referee List:</h3>
      {users &&
        users
          .filter((user) => user.role === "referee")
          .map((referee) => (
            <Card key={referee._id} className="mb-2 shadow-sm p-2">
              <CardHeader className="p-2">
                <h4 className="text-lg font-bold">
                  {referee.name}
                </h4>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-gray-700 text-sm">
                  <strong>email: </strong>
                  {referee.email}
                </p>
                <p className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(referee.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </CardContent>
              {user && user.role === "admin" && (
                <CardFooter className="text-right p-2">
                  <Button
                    size="sm"
                    onClick={() => handleClick(referee._id)}
                    className="mr-4 bg-red-500 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                  <RefereeEditTrigger referee={referee} />
                </CardFooter>
              )}
            </Card>
          ))}
    </div>
  );
};

export default RefereeList;

import { useEffect } from "react";
import { useVenueContext } from "../../hooks/useVenueContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { VenueEditTrigger } from "./VenueEditTrigger";

// create a function to handle Listing all venues to user
const VenueList = () => {
  // grab the venues and dispatch context data from VenueContext by using custom hook
  const { venues, dispatch } = useVenueContext();
  // grab the current user context data (it has _id and token information)
  const { user } = useAuthContext();

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [dispatch] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // create a function to fetch ALL the venues
    const fetchVenue = async () => {
      try {
        // create a variable to fetch
        const response = await fetch("http://localhost:3002/api/venues", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        // take the user input and pass it as json
        const json = await response.json();

        // check if response is ok or not
        if (response.ok) {
          // as we grab all the json venues data, we now SET the VENUES by using the dispatch (from null to venues: venues)
          dispatch({ type: "SET_VENUES", payload: json });
        } else {
          // if no response, send error to console
          console.error("Error fetching venues:", response.statusText);
        }
      } catch (error) {
        // this error indicates the fetching process not working at all, has backend problem
        console.error("Error fetching venues:", error);
      }
    };

    // when there is user, then run
    if (user) {
      fetchVenue(); // call the fetchVenue here
    }
  }, [dispatch, user, venues]);

  // create a function to handle DELETE venue by grabbing the id of the venue as argument
  const handleClick = async (id) => {
    // if no user at all, just disable the delete button functionality
    if (!user) {
      return;
    }

    try {
      // create a variable to delete one particular id, make sure include method: DELETE
      const response = await fetch("http://localhost:3002/api/venues/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // pass the json data from response either as single data (deleted) or error data
      const json = await response.json();

      if (response.ok) {
        // as we grab all the json venues data, we now DELETE that VENUE by using the dispatch (filter the venues)
        dispatch({ type: "DELETE_VENUE", payload: json });
      } else {
        // if no response, send error to console
        console.error("Error deleting the venue:", response.statusText);
      }
    } catch (error) {
      // this error indicates the fetching process not working at all, has backend problem
      console.error("Error fetching venues:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-left">Venues List:</h3>
      {venues &&
        venues.map((venue) => (
          <Card key={venue._id} className="mb-2 shadow-sm p-2">
            <CardHeader className="p-2">
              <h4 className="text-lg font-bold">
                {venue.building}, {venue.place}
              </h4>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-gray-700 text-sm">
                <strong>Postcode: </strong>
                {venue.postcode}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>State: </strong>
                {venue.state}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Country: </strong>
                {venue.country}
              </p>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(venue.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </CardContent>
            {user && user.role === "admin" && (
              <CardFooter className="text-right p-2">
                <Button
                  size="sm"
                  onClick={() => handleClick(venue._id)}
                  className="mr-4 bg-red-500 hover:bg-red-700"
                >
                  Delete
                </Button>
                <VenueEditTrigger venue={venue} />
              </CardFooter>
            )}
          </Card>
        ))}
    </div>
  );
};

export default VenueList;

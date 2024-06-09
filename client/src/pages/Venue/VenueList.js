import { useEffect } from "react";
import { useVenueContext } from "../../hooks/useVenueContext";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

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
  }, [dispatch, user]);

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
    <>
      <div>
        <h3>Venues List:</h3>
        {/* 
          iterate all the venues that you have found where venues ISNT NULL
          we also use () instead of {} because we return a template 

          we use key (key={venue._id}) for unique properties only & to optimize the rendering process and taking venue parameter as well
        */}
        {venues &&
          venues.map((venue) => (
            <div key={venue._id}>
              {/* we use the Link routes to link to detail of one particular venue, we did pass the VENUE._ID as PARAMS */}
              <h4>
                <Link to={`/venues/${venue._id}`}>
                  Venue: {venue.building}, {venue.place}
                </Link>
              </h4>
              <p>
                <strong>State: </strong>
                {venue.state}
              </p>
              <p>
                <strong>Country: </strong>
                {venue.country}
              </p>
              {/* instead of just showing the string of the date, u can use the date-fns to format them */}
              <p>
                {formatDistanceToNow(new Date(venue.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <span
                className="material-symbols-outlined"
                onClick={() => handleClick(venue._id)}
              >
                delete
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default VenueList;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVenueContext } from "../../hooks/useVenueContext";

// create a function to get the detail of one particular venue
const Venue = () => {
  // we grab the id as params, similar to backend 
  const { id } = useParams();
  // grab the updated venues from the VenueContext()
  const { venues } = useVenueContext();
  // create 2 useState variables for this particular page
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [id, venues] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // during the finding the venue, make the Loading equals to true
    setLoading(true);
    // try find the that particular venue from the venues using id params
    const foundVenue = venues.find((v) => v._id === id);

    if (foundVenue) {
      // if found, execute setVenue to change the value from null to that venue information
      setVenue(foundVenue);
    } else {
      // if not found, just reset it back to null
      setVenue(null);
    }

    // after all finish, change back Loading to false
    setLoading(false);
    
  }, [id, venues]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!venue) {
    return <div>Venue not found</div>;
  }

  return (
    <div>
      <h2>Venue ID: {venue._id}</h2>
      <p>Building: {venue.building}</p>
      <p>Place: {venue.place}</p>
      <p>Postcode: {venue.postcode}</p>
      <p>State: {venue.state}</p>
      <p>Country: {venue.country}</p>
    </div>
  );
};

export default Venue;

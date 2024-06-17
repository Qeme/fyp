import React from "react";
import VenueList from "./VenueList";
import VenueForm from "./VenueForm";

function VenuePage() {
  return (
    <div className="container mx-auto my-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <VenueList />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-4 ">
            <VenueForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenuePage;

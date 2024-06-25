import React from "react";
import VenueList from "./VenueList";
import VenueForm from "./VenueForm";

function VenuePage() {
  return (
    <main>
      <div className="flex justify-between">
        <div className="w-3/5">
          <VenueList />
        </div>
        <div className="w-2/5 mt-16">
          <div>
            <VenueForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default VenuePage;

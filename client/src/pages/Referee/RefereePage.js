import React from "react";
import RefereeList from "./RefereeList";
import RefereeForm from "./RefereeForm";

function RefereePage() {
  return (
    <div className="container mx-auto my-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <RefereeList />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-4 ">
            <RefereeForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefereePage;

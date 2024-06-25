import React from "react";
import RefereeList from "./RefereeList";
import RefereeForm from "./RefereeForm";

function RefereePage() {
  return (
    <div className="flex justify-between">
      <div className="w-3/5">
        <RefereeList />
      </div>
      <div className="w-2/5 mt-16">
        <div className="sticky top-8">
          <RefereeForm />
        </div>
      </div>
    </div>
  );
}

export default RefereePage;

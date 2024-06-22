import React, { useState } from "react";
import PaymentList from "./PaymentList";
import PaymentPreview from "./PaymentPreview";

function GamePage() {
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selecetedPayment, setSelectedPayment] = useState(null);

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <PaymentList onSelectTournament={setSelectedTournamentId} onSelectPayment={setSelectedPayment}/>
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-4">
            <PaymentPreview tournamentid={selectedTournamentId} payment={selecetedPayment}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;

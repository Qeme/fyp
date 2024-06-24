import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "src/components/ui/pagination";
import { Card, CardContent } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import PreviewImage from "src/components/PreviewImage";
import { differenceInDays } from "date-fns";
import { useGameContext } from "src/hooks/useGameContext";
import { useVenueContext } from "src/hooks/useVenueContext";
import { useNavigate } from "react-router-dom";

function TournamentCard({ tournaments }) {
  const { games } = useGameContext();
  const { venues } = useVenueContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = (tourid) => {
    navigate(`/tournaments/${tourid}`);
  };

  // set up each of the page only has 8 cards (can be editted later)
  const CARDS_PER_PAGES = 8;

  // find the total number of pages, Math.ceil will round up the division result like 9/8 = 1.125 so 2
  const totalPages = Math.ceil(tournaments.length / CARDS_PER_PAGES);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // this part will divide the cards into 8 only for each pages
  const paginatedTournaments = tournaments.slice(
    (currentPage - 1) * CARDS_PER_PAGES,
    currentPage * CARDS_PER_PAGES
  );

  return (
    <div className="pt-12">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
        {paginatedTournaments &&
          paginatedTournaments.map((tournament) => (
            <Card
              key={tournament._id}
              className="flex flex-col justify-between overflow-hidden shadow-md relative"
              onClick={() => handleClick(tournament._id)}
            >
              <PreviewImage
                topic={"tour_banner"}
                tournamentid={tournament._id}
              />
              {differenceInDays(new Date(), new Date(tournament.createdAt)) <
                7 && (
                <Badge
                  variant={"newly"}
                  className="absolute top-0 right-0 mt-2 mr-2"
                >
                  NEW
                </Badge>
              )}
              <CardContent>
                <div className="m-2 text-center">
                  <p className="uppercase font-bold text-sm">
                    {tournament.name}
                  </p>
                  <span className="block text-gray-500 text-sm">
                    {games &&
                      games.find((game) => game._id === tournament.meta.game_id)
                        ?.name}
                  </span>
                  <span className="block text-gray-500 text-sm">
                    {venues &&
                      venues.find(
                        (venue) => venue._id === tournament.meta.venue_id
                      )?.building}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))} //ensure the page doesnt go below than 1
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={
                  () => handlePageChange(Math.min(totalPages, currentPage + 1)) //ensure the page doesnt go more than totalPages
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default TournamentCard;

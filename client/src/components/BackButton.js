import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

function BackButton({ className }) {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button className={className} onClick={handleBack}>
      Back
    </Button>
  );
}

BackButton.propTypes = {
  className: PropTypes.string, // Define prop type for className
};

export default BackButton;

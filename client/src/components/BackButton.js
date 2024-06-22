import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function BackButton({ className }) {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className={className} onClick={handleBack}>
      Back
    </button>
  );
}

BackButton.propTypes = {
  className: PropTypes.string, // Define prop type for className
};

export default BackButton;

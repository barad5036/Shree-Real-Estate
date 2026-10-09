import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// Legacy component — now redirects to the new agents marketplace
const AgentsList = () => {
  const history = useHistory();

  useEffect(() => {
    history.replace("/agents");
  }, [history]);

  return null;
};

export default AgentsList;

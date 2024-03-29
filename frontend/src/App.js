import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import OneSpot from "./components/OneSpot";
import SearchPage from "./components/SearchPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path = '/'>
            <AllSpots />
          </Route>
          <Route path='/spots/:spotId'>
              <OneSpot />
          </Route>
          <Route path='/search/:q'>
            <SearchPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
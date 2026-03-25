import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { DeeplinkRunner } from './DeeplinkRunner';
import { PwaInitPage } from './PwaInitPage';

export const PwaPages = () => {
  return (
    <Switch>
      <Route exact path="/">
        <PwaInitPage />
      </Route>
      <Route exact path="/deeplink-runner">
        <DeeplinkRunner />
      </Route>
    </Switch>
  );
};

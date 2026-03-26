import { Button } from '@omega/ui-retail';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { DeeplinkRunner } from './DeeplinkRunner';
import { PwaInitPage } from './PwaInitPage';

export const PwaPages = () => {
  const history = useHistory();

  return (
    <>
      <Button onClick={() => history.push('/deeplink-runner')}>Перейти на DeeplinkRunner</Button>
      <Switch>
        <Route exact path="/">
          <PwaInitPage />
        </Route>
        <Route exact path="/deeplink-runner">
          <DeeplinkRunner />
        </Route>
      </Switch>
    </>
  );
};

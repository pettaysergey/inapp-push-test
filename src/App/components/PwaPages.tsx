import { Button } from '@omega/ui-retail';
import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { DeeplinkRunner } from './DeeplinkRunner';
import { PwaInitPage } from './PwaInitPage';

export const PwaPages = () => {
  const history = useHistory();

  useEffect(() => {
    const ulrParams = new URLSearchParams(window.location.search);
    const redirect = ulrParams.get('redirect');
    console.log('redirect: ', redirect);

    if (redirect) {
      history.push(redirect);
    }
  }, []);

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

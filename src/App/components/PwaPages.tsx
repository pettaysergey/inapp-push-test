import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { DeeplinkRunner } from './DeeplinkRunner';
import { PwaInitPage } from './PwaInitPage';
import { TYPE_BROADCAST_CHANNAL_SW } from '../constants';

export const PwaPages = () => {
  const history = useHistory();
  const channel =
    'BroadcastChannel' in window && typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel(TYPE_BROADCAST_CHANNAL_SW)
      : null;

  const messageHandler = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
    // если PWA открывается в первый раз для перехода на /deeplink-runner
    const ulrParams = new URLSearchParams(window.location.search);
    const redirect = ulrParams.get('redirect');
    console.log('redirect: ', redirect);

    if (redirect) {
      history.push(`/${redirect}`);
    }
  }, []);

  useEffect(() => {
    // для корректного перехода на /deeplink-runner
    if (channel) {
      channel.onmessage = (e) => {
        console.log('e.data?.type: ', e.data);
        if (e.data?.type === 'SW:Redirect' && e.data.payload) {
          messageHandler(e.data.payload);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [channel]);

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

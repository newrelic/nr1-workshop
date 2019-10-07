import React from 'react';
import MyNerdlet from './main';
import { PlatformStateContext, NerdletStateContext } from 'nr1';


export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
                  <MyNerdlet
                    launcherUrlState={platformUrlState}
                    nerdletUrlState={nerdletUrlState}
                  />
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    );
  }
}

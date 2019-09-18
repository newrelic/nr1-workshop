import React from 'react';
import { Spinner, HeadingText,  EntityByGuidQuery, PlatformStateContext, NerdletStateContext, AutoSizer } from 'nr1';
import MyNerdlet from './main';

export default class Wrapper extends React.PureComponent {

    render() {
        return <PlatformStateContext.Consumer>
        {(platformUrlState) => (
          <NerdletStateContext.Consumer>
            {(nerdletUrlState) => {
                if (!nerdletUrlState || !nerdletUrlState.entityGuid) {
                    return <HeadingText>Go find a Service or Browser App to compare</HeadingText>
                }
                return <AutoSizer>
                {({height, width}) => (<EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                    {({data, loading, error}) => {
                        console.debug("EntityByGuidQuery", [loading, data, error]); //eslint-disable-line
                        if (loading) {
                            return <Spinner fillContainer />;
                        }
                        if (error) {
                            return <BlockText>{error.message}</BlockText>
                        }
                        const entity = data.entities[0];
                        return <MyNerdlet
                            launcherUrlState={platformUrlState}
                            nerdletUrlState={nerdletUrlState}
                            height={height}
                            width={width}
                            entity={entity}
                          />
                    }}
                    </EntityByGuidQuery>
                )}
                </AutoSizer>
          }}
          </NerdletStateContext.Consumer>
        )}
        </PlatformStateContext.Consumer>
    }
}
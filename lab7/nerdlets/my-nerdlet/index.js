import React from 'react';
import { Grid, GridItem, AutoSizer } from 'nr1';

export default class MyNerdlet extends React.Component {


    constructor(props) {
        super(props);
        console.debug(props); //eslint-disable-line
    }

    render() {
        //we're going to replace these in the lab INSTRUCTIONS.md, so watch while you can.
        return <AutoSizer>
            {({ height }) => (<Grid>
                <GridItem columnStart={1} columnEnd={12}>
                    <h1>Here's a little fun with Grid...</h1>
                </GridItem>
                <GridItem columnStart={1} columnEnd={6}>
                    <iframe width="100%" height={height/3} src="https://www.youtube.com/embed/caIsN_PjaHY" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={7} columnEnd={12}>
                    <iframe width="100%" height={height/3} src="https://www.youtube.com/embed/9S1EzkRpelY" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={1} columnEnd={1}>
                    <iframe width="100%" height={height/12} src="https://www.youtube.com/embed/LTunhRVyREU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={2} columnEnd={2}>
                    <iframe width="100%" height={height/12} src="https://www.youtube.com/embed/GM-e46xdcUo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={3} columnEnd={3}>
                    <iframe width="100%" height={height/12} src="https://www.youtube.com/embed/QH2-TGUlwu4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={4} columnEnd={4}>
                    <iframe width="100%" height={height/12} src="https://www.youtube.com/embed/LTunhRVyREU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={5} columnEnd={5}>
                    <iframe width="100%" height={height/12} src="https://www.youtube.com/embed/GM-e46xdcUo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={6} columnEnd={11}>
                    <h2>The point is, it's really flexible.</h2>
                </GridItem>
                <GridItem columnStart={12} columnEnd={12}>
                    <iframe width="100%" height={height/12} src="https://www.youtube.com/embed/QH2-TGUlwu4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={1} columnEnd={2}>
                    <iframe width="100%" height={height/6} src="https://www.youtube.com/embed/LTunhRVyREU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={3} columnEnd={4}>
                    <iframe width="100%" height={height/6} src="https://www.youtube.com/embed/GM-e46xdcUo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={5} columnEnd={6}>
                    <iframe width="100%" height={height/6} src="https://www.youtube.com/embed/QH2-TGUlwu4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={7} columnEnd={8}>
                    <iframe width="100%" height={height/6} src="https://www.youtube.com/embed/LTunhRVyREU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={9} columnEnd={10}>
                    <iframe width="100%" height={height/6} src="https://www.youtube.com/embed/GM-e46xdcUo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={11} columnEnd={12}>
                    <iframe width="100%" height={height/6} src="https://www.youtube.com/embed/QH2-TGUlwu4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={1} columnEnd={4}>
                    <iframe width="100%" height={height/4} src="https://www.youtube.com/embed/LTunhRVyREU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={5} columnEnd={8}>
                    <iframe width="100%" height={height/4} src="https://www.youtube.com/embed/GM-e46xdcUo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={9} columnEnd={12}>
                    <iframe width="100%" height={height/4} src="https://www.youtube.com/embed/QH2-TGUlwu4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={1} columnEnd={3}>
                    <iframe width="100%" height={height/4} src="https://www.youtube.com/embed/LTunhRVyREU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={4} columnEnd={6}>
                    <iframe width="100%" height={height/4} src="https://www.youtube.com/embed/GM-e46xdcUo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={7} columnEnd={9}>
                    <iframe width="100%" height={height/4} src="https://www.youtube.com/embed/QH2-TGUlwu4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
                <GridItem columnStart={10} columnEnd={12}>
                    <iframe width="100%" height={height/4} src="https://www.youtube.com/embed/GM-e46xdcUo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                </GridItem>
            </Grid>
        )}
        </AutoSizer>;
    }
}

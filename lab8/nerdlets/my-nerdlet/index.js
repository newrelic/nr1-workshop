import React from 'react';
import PropTypes from 'prop-types';
//import the appropriate NR1 components
import { Tabs, TabsItem, Spinner, Stack, StackItem, NrqlQuery, navigation } from 'nr1';
//import our 3rd party libraries for the geo mapping features
import { CircleMarker, Map, TileLayer } from 'react-leaflet';
//import utilities we're going to need
import { loadEntity, decodeEntityGuid } from './utils';
import SummaryBar from '../../components/summary-bar';
import JavaScriptErrorSummary from './javascript-error-summary';

const COLORS = [
    "#2dc937",
    "#99c140",
    "#e7b416",
    "#db7b2b",
    "#cc3232"
];

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        launcherUrlState: PropTypes.object,
        nerdletUrlState: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            entity: null,
            center: [10.5731, -7.5898],
            zoom: 2
        }
    }

    render() {
        return <h1>Hello, lab8 my-nerdlet World!</h1>
    }
}
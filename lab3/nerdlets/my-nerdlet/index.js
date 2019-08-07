import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Stack, StackItem, ChartGroup, AreaChart, BarChart, LineChart, TableChart, PieChart, Button, HeadingText, TextField, Modal, Toast } from 'nr1';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
    };

    render() {
        return <HeadingText>Lab 3 Hello World.</HeadingText>
    }
}
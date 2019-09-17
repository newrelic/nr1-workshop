import React from 'react';

const COLORS = [
    "#2dc937",
    "#99c140",
    "#e7b416",
    "#db7b2b",
    "#cc3232"
];

export default class MyNerdlet extends React.Component {

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
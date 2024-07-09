import React, { Component } from "react";
import { Map, View } from "ol";
import { Tile } from "ol/layer";
import { OSM } from "ol/source";

class MapView extends Component {
    constructor(props) {
        super(props);

        this.state = { center: [0, 0], zoom: 1 };

        this.Map = new Map({
            target: null,
            layers: [
                new Tile({
                    source: new OSM()
                })
            ],
            view: new View({
                center: this.state.center,
                zoom: this.state.zoom
            })
        });
    }

    componentDidMount() {
        this.Map.setTarget("map");

        // Listen to map changes
        this.Map.on("moveend", () => {
            const center = this.Map.getView().getCenter();
            const zoom = this.Map.getView().getZoom();
            this.setState({ center, zoom });
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const center = this.Map.getView().getCenter();
        const zoom = this.Map.getView().getZoom();
        if (center === nextState.center && zoom === nextState.zoom) return false;
        return true;
    }

    updateMap() {
        this.Map.getView().setCenter(this.state.center);
        this.Map.getView().setZoom(this.state.zoom);
    }

    userAction() {
        this.setState({ center: [546000, 6868000], zoom: 5 });
    }

    render() {
        this.updateMap(); // Update map on render?
        return (
            <div id="map" style={{ width: "100%", height: "360px" }}>
                <button onClick={this.userAction()} type="button">
                    setState on click
                </button>
            </div>
        );
    }
}

export default MapView;

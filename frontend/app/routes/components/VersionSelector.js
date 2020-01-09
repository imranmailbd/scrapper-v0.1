import React from 'react';
import fetch from 'node-fetch';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from './../../components';

const SERVICE_URL = "http://dashboards.webkom.co:8000";

export class VersionSelector extends React.Component {
    static propTypes = {
        dashboard: PropTypes.string,
        down: PropTypes.bool,
        compact: PropTypes.bool,
        render: PropTypes.func,
        className: PropTypes.string,
        sidebar: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.state = {
            versions: [],
            isError: false,
            render: null
        };
    }

    async fetchVersions() {
        const { dashboard } = this.props;
        let versions;
        try {
            versions = await fetch(`${SERVICE_URL}/dashboards/versions`)
                .then(response => response.json());
        } catch(exc) {
            this.setState({ isError: true })
        }
        const targetVersions = _.filter(versions, { dashboardName: dashboard });
        
        this.setState({ versions: targetVersions });
    }

    componentDidMount() {
        this.fetchVersions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dashboard !== this.props.dashboard) {
            this.fetchVersions();
        }
    }

    render() {
        const { down, render, className, sidebar } = this.props;
        const { versions } = this.state;
        const currentVersion = _.find(versions, { label: "React" });

        return (
            <UncontrolledButtonDropdown direction={ down ? "down" : "up" } className={ className }>
                
            </UncontrolledButtonDropdown>
        );
    }
}
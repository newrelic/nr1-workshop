import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EntitySearchQuery, Modal, Stack, StackItem, TextField, Spinner } from 'nr1';
import { alertSeverityToColor, decodeEntityFromEntityId } from './utils';

export default class AddEntityModal extends Component {
  static propTypes = {
    entities: PropTypes.arrayOf(PropTypes.object),
    entityType: PropTypes.shape({
      type: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired
    }),
    onSearchSelect: PropTypes.func,
    onClose: PropTypes.func,
    openModal: PropTypes.bool
  };

  static defaultProps = {
    entityType: { type: 'APPLICATION', domain: "APM" }
  };

  constructor(props) {
    super(props);
    this.state = {
      results: null,
      isLoading: false,
      openModal: this.props.openModal
    };
    this.onClick = this.onClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (this.state.openModal != nextProps.openModal) {
      this.setState({ openModal: nextProps.openModal });
    }
  }

  onSearch(e) {
    const query = e.target.value;
    //console.debug("onSearch", query);
    if (query && query.length > 2) {
      const { entityType } = this.props;
      this.setState({ isLoading: true });
      const filters = [{
        type: 'searchQuery',
        value: query
      },
      {
        type: 'entityType',
        value: { type: entityType.type, domain: entityType.domain }
      }];
      const { entities } = this.props;
      if (entities) {
        const entity = decodeEntityFromEntityId(entities[0].id);
        filters.push({
          type:'tag',
          value: { key: 'accountId', value: entity.accountId }
        });
      }
      EntitySearchQuery.query({ filters }).then(rs => {
        //console.log("onSearch results", rs);
        if (rs.data) {
          //filter the results to those that are NOT already in the entities prop AND those that are reporting some status or another (non-alert services won't show up in the charts and will therefore be confusing for the example)
          const results = rs.data.actor.entitySearch.results.entities.filter(entity => !entities || (!entities.find(ex => ex.id == entity.id) && entity.alertSeverity != "NOT_REPORTING" && entity.alertSeverity != "NOT_CONFIGURED" ));
          //console.debug("Found the following in the search", results);
          this.setState({ isLoading: false, results });
        } else {
          this.setState({ isLoading: false });
        }
      }).catch(error => {
          console.error(error); //eslint-disable-line
      });
    }
  }

  onClick(entity) {
    this.props.onSearchSelect(entity);
  }

  render() {
    const { results, isLoading, openModal } = this.state;
    const { entityType } = this.props;
    const label = entityType.domain == 'BROWSER' ? 'Browser Apps' : 'APM Services';
    console.log(results);
    return (
      <Modal hidden={!openModal} onClose={(...args) => {
          this.setState({ openModal: false });
          //console.debug(args);
        }}>
        <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL} distributionType="fill">
          <StackItem>
            <TextField
              label={`Search ${label}`}
              type="search"
              onChange={this.onSearch}
            />
          </StackItem>
          <StackItem>
            {isLoading ?
              <Spinner className="centered" /> :
              <div>
                {results && <p>{results.length} {results.length == 1 ? 'result' : 'results'}...</p>}
                <ul className="resultSet">
                  {results ? results.map((entity, i) => {
                    return <li key={i} onClick={() => { this.onClick(entity); }} style={{borderLeft: `4px solid ${alertSeverityToColor(entity)}` }}>{entity.name}</li>
                  }) : <li>
                    No results available.
                  </li>}
                </ul>
              </div>
            }
          </StackItem>
        </Stack>
      </Modal>
    )
  }
}
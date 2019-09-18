import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EntitySearchQuery, Modal, Stack, StackItem, TextField, Spinner } from 'nr1';
import { alertSeverityToColor } from './utils';

export default class AddEntityModal extends Component {
  static propTypes = {
    entity: PropTypes.object,
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

  async onSearch(e) {
    const query = e.target.value;
    //console.debug("onSearch", query);
    if (query && query.length > 2) {
      let { entityType, entity, entities } = this.props;
      if (entity) {
        entityType = { type: entity.type, domain: entity.domain };
      }
      this.setState({ isLoading: true });
      const filters = [{
        type: 'searchQuery',
        value: query
      },
      {
        type: 'entityType',
        value: { type: entityType.type, domain: entityType.domain }
      }];
      if (entity) {
        filters.push({
          type:'tag',
          value: { key: 'accountId', value: entity.accountId }
        });
      }
      const rs  = await EntitySearchQuery.query({ filters });
      console.debug(rs);
      if (rs.data) {
        //filter the results to those that are NOT already in the entities prop AND those that are reporting some status or another (non-alert services won't show up in the charts and will therefore be confusing for the example)
        const results = rs.data.entities.filter((entity) => {
          if (!entities) {
            return true;
          }
          if (!entities.find(ex => ex.guid == entity.guid)) {
            return true;
          }
          return entity.alertSeverity != "NOT_REPORTING" && entity.alertSeverity != "NOT_CONFIGURED";
        });
        this.setState({ isLoading: false, results });
      } else {
        this.setState({ isLoading: false });
      }
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
        <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL}>
          <StackItem>
            <TextField
              label={`Search ${label}`}
              type="search"
              onChange={this.onSearch}
            />
          </StackItem>
          <StackItem>
            {isLoading ?
              <Spinner/> :
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
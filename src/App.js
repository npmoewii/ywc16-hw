import React, { Component } from 'react';
import InfiniteScoll from 'react-infinite-scroller';
import { Card, Input, Button, Spin, Select } from 'antd';
import Parallax from 'parallax-js';
import './App.css';
import getSchool, { findSchoolWithOption } from './api';

const fields = [
  'ลำดับ',
  'SchoolID',
  'SchoolName',
  'SubDistrict',
  'District',
  'Province',
  'PostCode',
  'SchoolType',
  'Department',
  'Telephone',
  'Fax',
  'Website',
  'Email',
  'Latitude',
  'Longtitude'
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      filter: 0,
      schools: [],
      pageSize: 3,
      hasMoreItems: false,
      loading: false,
      currPage: 1
    };
  }

  componentDidMount() {
    this.inputRef.focus();
    this.parallax = new Parallax(this.bg, {
      relativeInput: true
    });
    this.parallax.friction(0.2, 0.2);
    this.parallax.enable();
  }

  componentWillUnmount() {
    this.parallax.disable();
  }

  loader = <Spin size="large" className="loader" />;

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSelectChange = value => {
    this.setState({
      filter: value
    });
  };

  search = () => {
    this.setState({
      hasMoreItems: true,
      schools: [],
      loading: true,
      currPage: 1
    });
  };

  loadItems = async page => {
    let data = [];
    if (this.state.input === '')
      data = await getSchool(this.state.pageSize, this.state.currPage);
    else
      data = await findSchoolWithOption(
        this.state.filter,
        this.state.input,
        this.state.pageSize,
        this.state.currPage
      );
    if (data !== [] && data[0]['1@SchoolID'] !== '-')
      this.setState({
        schools: [...this.state.schools, ...data],
        loading: false,
        currPage: this.state.currPage + 1
      });
    else
      this.setState({
        hasMoreItems: false,
        loading: false
      });
  };

  renderSchool = () => {
    return this.state.schools.map(school => {
      return (
        <Card
          className="schoolItem"
          key={school['1@SchoolID']}
          title={school['2@SchoolName']}
        >
          {fields.map((field, id) =>
            [1, 2, 3, 4, 5, 6, 7, 9].includes(id) ? (
              <p key={school['1@SchoolID'] + field}>
                <label className="info-label">{field}: </label>{' '}
                {school[id + '@' + field]}
              </p>
            ) : null
          )}
          <p key={school['1@SchoolID'] + 'Website'}>
            <label className="info-label">Website: </label>
            {school['11@Website'] === '-' ? (
              '-'
            ) : (
              <a
                href={school['11@Website']}
                target="_blank"
                rel="noopener noreferrer"
              >
                {school['11@Website']}
              </a>
            )}
          </p>
        </Card>
      );
    });
  };

  render() {
    return (
      <div className="App">
        <div className="bg" ref={el => (this.bg = el)}>
          <div className="color-bg" />
          <div className="img-bg" data-depth="0.1" />
        </div>
        <header className="App-header" data-depth="0.0">
          <div className="main">
            <div className="title">
              <h1>THAILAND's SCHOOL INFORMATION</h1>
              <h5>
                <em>
                  <b>Retrieve from: </b>
                  <a href="https://api.data.go.th">https://api.data.go.th</a>
                </em>
              </h5>
            </div>
            <div className="search">
              <Input.Group size="large" compact>
                <Select
                  name="filter"
                  onChange={this.onSelectChange}
                  value={this.state.filter}
                  className="search-select"
                >
                  {fields.map((field, id) => (
                    <Select.Option key={id} value={id}>
                      {field}
                    </Select.Option>
                  ))}
                </Select>
                <Input
                  className="search-input"
                  size="large"
                  placeholder={'Search by ' + fields[this.state.filter] + '...'}
                  onChange={this.onChange}
                  value={this.state.input}
                  name="input"
                  ref={input => {
                    this.inputRef = input;
                  }}
                  onKeyPress={e => {
                    if (e.key === 'Enter') this.search();
                  }}
                />
              </Input.Group>
              <Button
                type="primary"
                size="large"
                onClick={this.search}
                loading={this.state.loading}
              >
                Search
              </Button>
            </div>
          </div>
          {this.state.data !== [] || this.state.loading ? (
            <InfiniteScoll
              pageStart={0}
              loadMore={this.loadItems}
              hasMore={this.state.hasMoreItems}
              loader={this.loader}
              className="showSchool"
            >
              {this.renderSchool()}
            </InfiniteScoll>
          ) : null}
        </header>
        <footer className="App-footer" data-depth="0.0">
          <a href="https://www.freepik.com/free-vector/school-building-with-small-fence-around_3297805.htm">
            Background by Katemangostar
          </a>
        </footer>
      </div>
    );
  }
}

export default App;

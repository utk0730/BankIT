import React, { Component } from "react";
import axios from "axios";
import Table from "../Table/Table";
import Spinner from "../Spinner/Spinner";
import "./Form.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankData: [],
      showTable: false,
      city: "Mumbai",
      searchKey: ""
    };
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  resetData() {
    this.setState({
      bankData: [],
      showTable: false,
      city: "",
      searchKey: ""
    });
  }
  fetchData(city) {
    this.resetData();
    let City = city.toUpperCase();
    let url = `https://vast-shore-74260.herokuapp.com/banks?city=${City}`;

    let cachedData = localStorage.getItem(url);
    if (cachedData) {
      console.log('fetching from cache')
      const data = JSON.parse(cachedData);
      this.setState({
        ...this.state,
        bankData: data,
        showTable: true,
        city
      });
    } else {
      console.log('fetching from apis')
      axios
        .get(url)
        .then(data => {
          this.setState({
            ...this.state,
            bankData: data.data,
            showTable: true,
            city
          });
          localStorage.setItem(url,JSON.stringify(data.data))
        })
        .catch(err => console.log(err));
    }
  }

  handleInputChange(e) {
    console.log("input change triggering");
    this.setState({
      ...this.state,
      searchKey: e.target.value
    });
  }
  handleCityChange(event) {
    console.log("city change triggered");
    let city = event.target.value;
    this.fetchData(city);
  }
  componentDidMount() {
    console.log("form did mount");
    this.fetchData(this.state.city);
  }

  render() {
    console.log("form rendering with state", this.state);
    let data = this.state.bankData;
    let key = this.state.searchKey.toLowerCase();
    if (key) {
      data = this.state.bankData.filter(row => {
        return (
          String(row.bank_name)
            .toLowerCase()
            .includes(key) ||
          String(row.ifsc)
            .toLowerCase()
            .includes(key) ||
          String(row.bank_id)
            .toLowerCase()
            .includes(key) ||
          String(row.city)
            .toLowerCase()
            .includes(key) ||
          String(row.district)
            .toLowerCase()
            .includes(key) ||
          String(row.state)
            .toLowerCase()
            .includes(key) ||
          String(row.branch)
            .toLowerCase()
            .includes(key) ||
            String(row.address)
            .toLowerCase()
            .includes(key)
        );
      });
      // console.log("filtereed data", data);
    }
    return (
      <div className="container">
        <h1 className="display-4 mt-3 text-center">Banks' branches</h1>
        <div className="container search-container">
          <select
            value={this.state.city}
            onChange={this.handleCityChange}
            className="mr-2 p-2 bg-dark text-white border-none"
          >
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
          <input
            type="text"
            className="form-control p-2"
            value={this.state.searchKey}
            onChange={this.handleInputChange}
          />
        </div>

        {this.state.showTable ? <Table data={data} /> : <Spinner />}
      </div>
    );
  }
}
export default Form;

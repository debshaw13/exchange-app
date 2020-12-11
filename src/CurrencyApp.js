import React from "react";
import {DebounceInput} from 'react-debounce-input';
import { json, checkStatus } from './utils';

class CurrencyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table_base_currency: 'USD',
      rates: [],
      converter_base_currency: 'GBP',
      cross_currency: 'USD',
      base_amount: 100,
      cross_amount: '',
      exchange_rate: [],
    };

    this.handleTableInput = this.handleTableInput.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);

    this.handleConverterBaseInput = this.handleConverterBaseInput.bind(this);
    this.handleConverterCrossInput = this.handleConverterCrossInput.bind(this);
    this.handleConverterBaseAmount = this.handleConverterBaseAmount.bind(this);
    this.handleConverterCrossAmount = this.handleConverterCrossAmount.bind(this);
    this.processedExchangeRate = this.processedExchangeRate.bind(this);
  }

  componentDidMount() {
    this.fetchConverterTasks();
    this.fetchTableTasks();
  }

  fetchConverterTasks() {
    fetch("https://alt-exchange-rate.herokuapp.com/latest?base=" + this.state.converter_base_currency + "&symbols=" + this.state.cross_currency)
    .then(checkStatus)
      .then(json)
      .then((response) => {
        this.setState({
          exchange_rate: Object.entries(response.rates),
          cross_amount: parseFloat(this.state.base_amount * this.processedExchangeRate(Object.entries(response.rates))),
        });
      })
      .catch(error => {
        console.error(error.message);
      })
  }

  fetchTableTasks() {
    fetch("https://alt-exchange-rate.herokuapp.com/latest?base=" + this.state.table_base_currency)
    .then(checkStatus)
      .then(json)
      .then((response) => {
        this.setState({rates: Object.entries(response.rates)});
      })
      .catch(error => {
        console.error(error.message);
      })
  }

  handleTableInput(event) {
    this.setState({ table_base_currency: event.target.value });
  }

  handleTableChange(event) {

    fetch("https://alt-exchange-rate.herokuapp.com/latest?base=" + this.state.table_base_currency)
    .then(checkStatus)
      .then(json)
      .then((response) => {
        this.setState({rates: Object.entries(response.rates)});
      })
      .catch(error => {
        console.error(error.message);
      })
  }

  handleConverterBaseInput(event) {

    const changeBaseCurrency = event.target.value;

    fetch("https://alt-exchange-rate.herokuapp.com/latest?base=" + event.target.value + "&symbols=" + this.state.cross_currency)
    .then(checkStatus)
      .then(json)
      .then((response) => {
        this.setState({
          exchange_rate: Object.entries(response.rates),
          converter_base_currency: changeBaseCurrency,
          cross_amount: (parseFloat(this.state.base_amount * this.processedExchangeRate(Object.entries(response.rates)))),
        });
      })
      .catch(error => {
        console.error(error.message);
      })
  }

  handleConverterCrossInput(event) {

    const changeCrossCurrency = event.target.value;

    fetch("https://alt-exchange-rate.herokuapp.com/latest?base=" + this.state.converter_base_currency + "&symbols=" + event.target.value)
    .then(checkStatus)
      .then(json)
      .then((response) => {
        this.setState({
          exchange_rate: Object.entries(response.rates),
          cross_currency: changeCrossCurrency,
          base_amount: (parseFloat(this.state.cross_amount * ( 1 / this.processedExchangeRate(Object.entries(response.rates) )))),
        });
      })
      .catch(error => {
        console.error(error.message);
      })
  }

  handleConverterBaseAmount(event) {
    this.setState({
      base_amount: parseFloat(event.target.value),
      cross_amount: parseFloat(parseFloat(event.target.value) * this.processedExchangeRate(this.state.exchange_rate))
    });
  }

  handleConverterCrossAmount(event) {
    this.setState({
      cross_amount: parseFloat(event.target.value),
      base_amount: parseFloat(parseFloat(event.target.value) * ( 1 / this.processedExchangeRate(this.state.exchange_rate)))
    });
  }

  processedExchangeRate(rate) {
    const thisRate = rate.map(element => element[1]);
    return thisRate;
  }


  render() {
    const { rates, table_base_currency, converter_base_currency, cross_currency, exchange_rate, base_amount, cross_amount } = this.state;

    console.log(exchange_rate);
    console.log(base_amount);
    console.log(cross_amount);

    const rateProcessor = (rawRate) => {
      if (rawRate < 0.0001) {
        return rawRate.toFixed(6);
      } else if (rawRate < 0.001) {
        return rawRate.toFixed(5);
      } else if (rawRate < 0.01) {
        return rawRate.toFixed(4);
      } else if (rawRate < 1) {
        return rawRate.toFixed(3);
      } else if (rawRate < 99) {
        return rawRate.toFixed(2);
      } else if (rawRate > 1000) {
        return rawRate.toFixed(0);
      } else {
        return rawRate.toFixed(2);
      }
    }

    const processedRates = rates.map((rate) => {
      const thisRate = parseFloat(rate[1]);
      return rateProcessor(thisRate);
    });

    const inverseRates = rates.map((rate) => {
      const thisInverseRate = 1 / (parseFloat(rate[1]));
      return rateProcessor(thisInverseRate);
    });

    function processedAmount(input) {
      if(typeof input === "string") {
        return '';
      } else {
        return rateProcessor(input);
      }
    }

    const processedCrossAmount = processedAmount(cross_amount);
    const processedBaseAmount = processedAmount(base_amount);

    return (
      <div className="container p-01">
        <div className="row">
          <div className="col-12 pt-4 mt-4">
            <h5 className="text-center" id="currency-converter">Currency Converter</h5>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-6 col-md-3 my-3 pl-4">
            <DebounceInput minLength={1} debounceTimeout={1000} value={processedBaseAmount} className="form-control" type="number" onChange={this.handleConverterBaseAmount}/>
          </div>
          <div className="col-6 col-md-3 my-3 d-flex justify-content-center pr-4">
            <select value={converter_base_currency} className="custom-select bg-primary text-white" onInput={this.handleConverterBaseInput}>
              {rates.map((element, index) => <option key={index}>
              {element[0]}</option>
              )}
            </select>
          </div>
          <div className="col-6 col-md-3 my-3 pl-4">
            <DebounceInput minLength={1} debounceTimeout={1000} value={processedCrossAmount} className="form-control" type="number" onChange={this.handleConverterCrossAmount}/>
          </div>
          <div className="col-6 col-md-3 my-3 d-flex justify-content-center pr-4">
            <select value={cross_currency} className="custom-select bg-primary text-white" onInput={this.handleConverterCrossInput}>
              {rates.map((element, index) => <option key={index}>
              {element[0]}</option>
              )}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-4 mt-4">
            <h5 className="text-center" id="currency-table">Currency Table</h5>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-4 col-md-5 p-0">
          </div>
          <div className="col-4 col-md-2 p-0">
            <select value={table_base_currency} className="custom-select bg-primary text-white" onInput={this.handleTableInput} onChange={this.handleTableChange}>
              {rates.map((element, index) => <option key={index}>
              {element[0]}</option>
              )}
            </select>
            <br />
            <br />
          </div>
          <div className="col-4 col-md-5 p-0">
          </div>
        </div>
        <div className="row">
          <div className="col-1 col-md-3 p-0">
          </div>
          <div className="col-10 col-md-6 p-2">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Currency</th>
                  <th className="text-center" scope="col">Exchange Rate</th>
                  <th className="text-center" scope="col">Inverse Exchange Rate</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((element, index) => <tr key={index}>
                  <td>{element[0]}</td>
                  <td className="text-center">{processedRates[index]}</td>
                  <td className="text-center">{(inverseRates[index])}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="col-1 col-md-3 p-0">
          </div>
        </div>
      </div>
    );
  }
}

export default CurrencyApp;

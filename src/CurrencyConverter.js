import React from "react";
import { json, checkStatus } from './utils';

class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base_rate: 'USD',
      cross_rate: 'GBP',
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

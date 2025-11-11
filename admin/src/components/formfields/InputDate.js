import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Input } from "semantic-ui-react";
import { Field, Fields, reduxForm } from "redux-form";

import { DayPicker, SingleDatePicker } from "react-dates";
import StringFormatValidation from "string-format-validation";
import StringMask from "string-mask";

import { connect } from "react-redux";
import { si3, si3Actions } from "actions/index";
import * as util from "util/s3util";

import FormField from "./FormField";
import onlyDOMProps from "util/onlyDOMProps";

import moment from "moment";
moment.locale("pt-br");

// Input Date
//---------------------------
export default class InputDate extends React.Component {
  defaultProps = {
    saveFormat: "YYYY-MM-DD",
    disabled: false,
  };

  state = { data: "" };

  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  componentDidMount() {
    if (this.props.input.value != "") {
      this.setState({
        data: moment(this.props.input.value).format("DD/MM/YYYY"),
      });
    }
  }

  componentWillReceiveProps(nextProps) {}

  dateClick = (e) => {
    //e é um objeto momentum
    console.log(e);
    const data = e.format("YYYY-MM-DD"); //como salvo no reduxstore
    this.props.input.onChange(data);
    this.setState({ open: false });
    var val = e.format("DD/MM/YYYY");
    this.setState({ data: val });
  };

  onChangeInputData = (e) => {
    // alert('a')
    var val = e.target.value;

    const valAtual = val;

    let dataAtualFormatada = valAtual;

    var num = valAtual.replace(/[^\d]/g, "") + "";

    if (num.length < 8) {
      this.setState({ data: val });
    } else {
      //considero uma data formatada, tranformo em data
      let dataAtual = moment(num, [
        "MM-DD-YYYY",
        "YYYY-MM-DD",
        "DD/MM/YYYY",
        "DD/MM/YY",
      ]);
      if (dataAtual._isValid === true) {
        const data = dataAtual.format("YYYY-MM-DD"); //como salvo no reduxstore
        this.props.input.onChange(data);
        this.setState({ data: valAtual });
      }
    }
  };

  closeCal = (v = 0) => {
    this.setState({ open: false });
  };

  delayCloseCal = () => {
    this.closeTimeout = setTimeout(() => this.setState({ open: false }), 2000);
  };

  openCal = () => {
    this.setState({ open: true });
  };

  toogleCal = () => {
    this.setState({ open: !this.state.open });
  };

  canceloDelayClose = () => {
    clearTimeout(this.closeTimeout);
  };

  dateInputChange = (e) => {};

  render() {
    const {
      input,
      label,
      meta: { active, touched, error, valid, dirty },
      ...custom
    } = this.props;
    //crio a data conrespondente
    //para nao passar req para os fildes interno
    delete custom.req;
    //
    const valAtual = this.props.input.value;
    let dataAtualFormatada = valAtual;
    let mesAtual = moment();
    // console.log("%cvalAtual %o",'colore:red;font-size:24px',valAtual)
    var num = valAtual.replace(/[^\d]/g, "") + "";

    if (num.length < 8) {
      //nao considero uma data formatada ainda, deixo escrever
      dataAtualFormatada = valAtual;

      dataAtualFormatada = StringFormatValidation.format("##/##/####", num);

      mesAtual = moment(dataAtualFormatada, [
        "DD",
        "DD/MM",
        "DD/MM/YYYY",
        "DD/MM/YY",
      ]);

      if (mesAtual._isValid === false) mesAtual = moment();

      // }
    } else {
      //considero uma data formatada, tranformo em data
      let dataAtual = moment(this.props.input.value, [
        "MM-DD-YYYY",
        "YYYY-MM-DD",
        "DD/MM/YYYY",
        "DD/MM/YY",
      ]);
      if (dataAtual._isValid === true) {
        dataAtualFormatada = dataAtual.format("DD/MM/YYYY");
        mesAtual = dataAtual;
      }
    }

    return (
      <FormField
        {...this.props}
        icon="calendar"
        dica="Digite a data no formato DD/MM/AAAA"
      >
        <div className="input-wrap ui input fluid f-calendario">
          <input
            {...input}
            disabled={this.props.disabled}
            {...onlyDOMProps(custom)}
            value={StringFormatValidation.format("##/##/####", this.state.data)}
            onClick={this.toogleCal}
            spellCheck="false"
            autoComplete="false"
            autoCorrect="false"
            onBlur={(e) => {
              this.delayCloseCal();
              input.onBlur();
            }}
            onChange={this.onChangeInputData}
          />

          <div className="ui icon icone">
            {" "}
            {(this.props.icone && this.props.icone) || (
              <i className="fa fa-calendar"></i>
            )}{" "}
          </div>

          {this.state.open && !this.props.disabled && (
            <div
              className="elemento-complemento"
              onClick={() => {
                this.canceloDelayClose();
                alert("a3");
              }}
            >
              <div
                className=" ui calendario"
                onClick={() => {
                  this.canceloDelayClose();
                  alert("a1");
                }}
              >
                <DayPicker
                  tabindex="-10"
                  onClick={() => {
                    this.canceloDelayClose();
                    alert("a2");
                  }}
                  numberOfMonths={1}
                  key={dataAtualFormatada}
                  initialVisibleMonth={() => mesAtual}
                  hideKeyboardShortcutsPanel={true}
                  onDayClick={this.dateClick}
                  onOutsideClick={this.closeCal}
                  onNextMonthClick={this.canceloDelayClose}
                  onPrevMonthClick={this.canceloDelayClose}
                />
              </div>

              {this.props.dica && (
                <div className=" f-dica dica ui label-dica">
                  {this.props.dica}
                </div>
              )}
            </div>
          )}
        </div>
      </FormField>
    );
  }
}

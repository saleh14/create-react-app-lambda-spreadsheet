import React, { Component } from 'react'
import './css/form.css'

export default class Form extends Component {
  state = {
    user_fullName: '',
    nationalID: ''
  }
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
    setTimeout(_ => this.props.getFields(this.state))
  }
  render () {
    return (
      <form>
        <label htmlFor='user_fullName'>
          الاسم الكامل:
        </label>
        <input
          type='text'
          name='user_fullName'
          onChange={e => this.change(e)}
        />
        <br />
        <label htmlFor='nationalID'>
          رقم الهوية:
        </label>
        <input type='text' name='nationalID' onChange={e => this.change(e)} />
        <br />
        <label htmlFor='gender'>
          الجنس:
        </label>
        <input
          type='radio'
          name='gender'
          value='ذكر'
          onChange={e => this.change(e)}
        />
        ذكر
        <input
          type='radio'
          name='gender'
          value='أنثى'
          onChange={e => this.change(e)}
        />
        أنثى
      </form>
    )
  }
}

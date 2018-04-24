import React, { Component } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import Form from './Form'
import './App.css'

class SlackMessage extends Component {
  constructor (props) {
    super(props)
    this.state = { loading: false, fields: null, error: null, success: false }
  }
  getFields (fields) {
    this.setState({ fields: fields })
  }
  handleText = e => {
    this.setState({ text: e.target.value })
  }

  generateHeaders () {
    const headers = { 'Content-Type': 'application/json' }
    if (netlifyIdentity.currentUser()) {
      return netlifyIdentity.currentUser().jwt().then(token => {
        return { ...headers, Authorization: `Bearer ${token}` }
      })
    }
    return Promise.resolve(headers)
  }
  handleSubmit = e => {
    e.preventDefault()
    // testing fields to value format

    const { fields } = this.state
    const row = Object.keys(fields).reduce(
      (row, k) => row.concat([fields[k]]),
      []
    )
    console.log(row)

    // end of testing of fields
    this.myref.current.value = this.state.text
    console.log(this.state.text)
    this.setState({ loading: true })
    this.generateHeaders().then(headers => {
      fetch('/.netlify/functions/slack', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          row
        })
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(err => {
              throw err
            })
          }
        })
        .then(text =>
          this.setState({
            loading: false,
            text: JSON.stringify(text),
            success: true,
            error: null
          })
        )
        .catch(err =>
          this.setState({
            loading: false,
            success: false,
            error: err.toString()
          })
        )
    })
  }
  myref = React.createRef()
  render () {
    const { loading, text, error, success } = this.state
    return (
      <React.Fragment>
        <Form getFields={fields => this.getFields(fields)} />
        <form onSubmit={this.handleSubmit}>
          {error && <p><strong>Error sending message: {error}</strong></p>}
          {success &&
            <p><strong>Done! Message sent to Slack {text}</strong></p>}
          <p>
            <label>
              Your Message: <br />
              <textarea onChange={this.handleText} value={text || ''} />
            </label>
          </p>
          <p>
            <button type='submit' disabled={loading}>
              {loading ? 'Sending Slack Message...' : 'Send a Slack Message'}
            </button>
            <textarea ref={this.myref} />
          </p>
        </form>
      </React.Fragment>
    )
  }
}
class App extends Component {
  state = {
    fields: { hello: 'helloo' }
  }
  componentDidMount () {
    netlifyIdentity.init()
  }
  handleIdentity = e => {
    e.preventDefault()
    netlifyIdentity.open()
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Slack Messenger</h1>
        </header>
        <p><a href='#' onClick={this.handleIdentity}>User Status</a></p>
        <SlackMessage />
      </div>
    )
  }
}
export default App

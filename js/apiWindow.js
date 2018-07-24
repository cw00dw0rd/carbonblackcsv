// API Window has the user put in API credentials to authenticate with Carbon Black
// Primary reason for this is to allow the application to not require code updates if a new
// API key is assigned or the URL is updated.

const ipcRenderer = require('electron').ipcRenderer
let data
window.onload = function () {
  document.getElementById('closeBtn').onclick = function () {
    ipcRenderer.send(`closeBtn`, data)
  }
  document.getElementById('saveAPIBtn').onclick = function () {
    if (document.getElementById('apiKey').value && document.getElementById('connectorId').value && document.getElementById('url').value) {
      if (document.getElementById('error')) {
        document.getElementById('error').remove()
      }
      // Creates apiKey and sets url for use in the parent window
      data = document.getElementById('apiKey').value + '/' +
      document.getElementById('connectorId').value +
      '*' + document.getElementById('url').value
      let h2 = document.createElement('h2')
      let loading = document.createTextNode('loading data...')
      h2.setAttribute('id', 'loading')
      h2.appendChild(loading)
      document.body.appendChild(h2)
      ipcRenderer.sendTo(1, 'getAPI', data)
    }
  }
  ipcRenderer.on('apiResponse', (event, arg) => {
    // confirms valid response and close apiWindow or notifies user
    if (arg === true) {
      ipcRenderer.sendSync('saveAPIBtn', data.response)
    } else {
      let loading = document.getElementById('loading')
      loading.remove()
      let h3 = document.createElement('h3')
      h3.setAttribute('id', 'error')
      let apiError = document.createTextNode('Invalid request, try again')
      h3.appendChild(apiError)
      document.body.appendChild(h3)
    }
  })
}

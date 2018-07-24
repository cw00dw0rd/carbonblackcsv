/* global fetch */
const {dialog} = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer
const fs = require('fs')
const converter = require('json-2-csv')
let data
let newData = []
let apiInfo
let url

window.onload = function () {
  document.getElementById('closeBtn').onclick = function () {
    ipcRenderer.send(`closeBtn`, data)
  }
  const setButtons = () => {
    let buttons = document.getElementsByClassName('mainButtons')
    for (let i in buttons) {
      if (buttons[i].id != null) {
        let id = buttons[i].id
        document.getElementById(id).onclick = function () {
          // Each button does the same thing currently, but can be updated when API functionality is improved
          let options = { checkSchemaDifferences: false, array: true, sortHeader: true }
          data = converter.json2csv(newData, saveFile, options)
        }
      }
    }
  }
  const fetchData = (param) => {
    let data
    url = url + '/integrationServices/v3/' + param
    console.log(url)
    fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'X-Auth-Token': apiInfo
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(function (response) { if (response.ok) { return response.json() } })
      .then(function (data) {
        sortData(data)
        setButtons()
        ipcRenderer.sendTo(2, 'apiResponse', true)
      })
      .catch(error => { return Promise.reject(ipcRenderer.sendTo(2, 'apiResponse', error)) })
  }

  const sortData = (data) => {
    let newObj = []
    // Intended to iterate through results to find any events that may have an incidentId
    // This functionality works as expected but due to, now confirmed, limitations of the CB API
    // getting all of the 'Events' and iterating would be the only solution, at least until 'Alert' poling is implemented.
    // Events are the most general version of data and would include millions of results.
    for (let i in data.results) {
      // I have removed the check for incidentId due to API constraints but still have it
      // create an object with common headers from the killChain reports
      // if (data.results[i].incidentId != null) {
      let nextObj = {}
      newObj.push(data.results[i])
      nextObj.Alert_ID = data.results[i].incidentId
      nextObj.event1 = data.results[i].eventId
      nextObj.Threat_Score = data.results[i].alertScore
      nextObj.Target_Priority = data.results[i].deviceDetails.targetPriorityType
      nextObj.Stage = data.results[i].attackStage
      nextObj.First_Seen = data.results[i].createTime
      nextObj.Device_Hostname = data.results[i].deviceDetails.deviceName
      nextObj.Username = data.results[i].deviceDetails.email
      nextObj.Policy = data.results[i].deviceDetails.policyName
      nextObj.Premise_Location = data.results[i].deviceDetails.agentLocation
      nextObj.TTPs = data.results[i].threatIndicators
      newData.push(nextObj)
      // }
    }
  }
  const saveFile = (err, csv) => {
    dialog.showSaveDialog({ filters: [

      { name: 'csv', extensions: ['csv'] }
    ]}, function (fileName) {
      if (fileName === undefined) return

      fs.writeFile(fileName, csv, function (err) {
        if (err) {
          console.log('ERROR' + err)
        }
      })
      if (err) {
        console.log('ERROR' + err)
      }
    })
  }
  ipcRenderer.on('getAPI', (event, arg) => {
    arg = arg.split('*')
    apiInfo = arg[0]
    url = arg[1]
    // Creates a date range of 2 weeks from current Date
    // Two weeks is the limit for each API call, it also only gives 100 events per call
    // Does not iterate past the initial 100 due to the data not being useful without being able to pull every 'Alert'
    let d = new Date()
    let n = new Date(d.getFullYear(), d.getMonth(), 0)
    let endTime = (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
    let startDay = d.getDate() - 14
    let startMonth = d.getMonth() + 1
    // Makes sure that we don't get any off months or days when determining startTime
    if ((d.getDate() - 14) < 1) {
      startDay = (d.getDate() - 14) + n.getDate()
      startMonth = (d.getMonth())
    }
    let startTime = (d.getFullYear() + '-' + startMonth + '-' + startDay)
    fetchData('event?startTime=' + startTime + '&endTime=' + endTime)
  })
}

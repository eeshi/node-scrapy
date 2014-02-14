exports.getColoredStatus = function(casper) {
  var status = casper.status().currentHTTPStatus;
  switch(status) {
    case 200: var statusStyle = { fg: 'green', bold: true }; break;
    case 404: var statusStyle = { fg: 'red', bold: true }; break;
    default: var statusStyle = { fg: 'magenta', bold: true }; break;
  }
  return casper.colorizer.format(status, statusStyle)
}
const axios = require('axios');
axios.get('http://localhost:4000/api/dashboard/map-data')
  .then(res => console.log(JSON.stringify(res.data, null, 2)))
  .catch(err => console.error(err.message));

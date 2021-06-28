const redis = require('redis');

const client = redis.createClient({
    port: 6379,
    host: process.env.REDIS_HOST || 'localhost',
    enable_offline_queue: true,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // end reconnecting on a specific error and flush all commands with a individual error
        return new Error('The server refused the connection')
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // end reconnecting after a specific timeout and flush all commands with a individual error
        return new Error('Retry time exhausted')
      }
      if (options.attempt > 10) {
        // end reconnecting with built in error
        return 'undefined'
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000)
    }
  });

  function get(key) {
    try {
      return new Promise((resolve, reject) => {
        client.get(key, (err, res) => {
          if (err) {
            console.log("GETTING ERROR FROM CACHE for", key, err);
            reject(err)
          } else if (res) {
            resolve(JSON.parse(res));
          } else {
            console.log("GETTING NULL RESPONSE FROM CACHE", key);
            resolve(null)
          }
        })
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  // add key, value to cache
  function put(key, value, interval = 3600) {
    try {
      return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(value), 'EX', interval, (err, res) => {
          if (err) {
            console.log("INSIDE PUT OF CACHE FAIL", err);
            reject(err);
          } else if (res == 'OK') {
            console.log("INSIDE PUT OF CACHE SUCCESS", res);
            resolve(res);
          } else {
            resolve(null);
          }
        });
      });
    }
    catch (error) {
      console.log("INSIDE PUT OF CACHE CATCH", error);
      console.log(error);
    }
  }
  
  // delete a particular key
  function del(key) {
    try {
      return new Promise((resolve, reject) => {
        client.exists(key, (err, res) => {
          if (res === 1) {
            // if key exists get value
            client.del(key, (err, res) => {
              if (err) {
                reject(err);
              }
              else if (res) {
                resolve(res);
              } else {
                resolve(null);
              }
            });
          }
          else {
            resolve(null);
          }
        });
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  client.on('connect', () => {
    console.info('Redis Connected Successfully')
  })
  
  client.on('error', () => {
    console.info('Connection Error Reddis')
  })

module.exports = {
    client,
    get,
    put,
    del
}
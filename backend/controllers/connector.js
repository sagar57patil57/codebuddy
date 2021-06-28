const axios = require('axios');
const cache = require('../services/cache');

sortData = (data, order) => {
    let result = null;
    if (order === 'asc') {
        result = data.sort((a, b) => a.index - b.index);
    } else if (order === 'dsc') {
        result = data.sort((a, b) => b.index - a.index);
    }
    return result || [];
}

exports.getProblems = async (req, res) => { 
   try {
        let tags = Array.isArray(req.query.tags) ? req.query.tags.join(";") : req.query.tags;
        let orderBy = req.query.orderBy;
        tags = tags ? ('?tags=' + tags) : '';
        let cacheResponse = await cache.get(`cf-${tags}`);
        if (cacheResponse) {
            // if (orderBy === 'asc' || orderBy === 'desc') {
            //     cacheResponse = sortData(cacheResponse, orderBy);
            // }
            console.log("from cache...")
            cacheResponse = cacheResponse.slice(0, 150)
            return res.status(200).json({ message: "Successfully fetched from cache", data: cacheResponse });
        }
        const response = await axios.get(`https://codeforces.com/api/problemset.problems${tags}`);
        let result = response.data.result.problems;
        await cache.put(`cf-${tags}`, result, 3600 * 5)
        // if (orderBy === 'asc' || orderBy === 'desc') {
        //     result.sort(mycomparator)
        // }
        result = result.slice(0, 150)
        return res.status(200).json({ message: "Successfully fetched", data: result, success: true });
    } catch(err) {
        console.log(err)
        return res.status(500).json({ message: "Error from codeforces", data: null, success: false });
    }
}

exports.getProfile = async (req, res) => {
    try {
        let profileName = req.query.profileName;
        if (!profileName) {
            return res.status(500).json({ message: "Invalid profile name", data: null });
        }
        const queryProfileName = `?handles=${profileName}`;
        const cacheResponse = await cache.get(`profile-${profileName}`);
        if (cacheResponse) {
            return res.status(200).json({ message: "Successfully fetched Profile from cache", data: cacheResponse });
        }
        const response = await axios.get(`https://codeforces.com/api/user.info${queryProfileName}`);
        await cache.put(`profile-${profileName}`, response.data, 3600 * 10)
        return res.status(200).json({ message: "Successfully fetched", data: response.data });
    } catch(err) {
        console.log(err)
        return res.status(500).json({ message: "Error from codeforces", data: null });
    }
}

exports.getRandomProblem = async (req, res) => {

    try {
        const type = req.query.type;
        //  Get all problems
        let result = await cache.get(`cf-${type}`);
        if (!result) {
            const response = await axios.get(`https://codeforces.com/api/problemset.problems`);
            result = response.data.result.problems;
        }
        let difficultyIndex = [];
        //  Check category
        if (type === 'easy') {
            difficultyIndex = ['A', 'B', 'B1'];
        } else if (type === 'medium') {
            difficultyIndex = ['C', 'D'];
        } else if (type === 'hard') {
            difficultyIndex = ['E', 'F', 'G', 'H', 'I', 'J', 'K'];
        }
        //  Filter based on difficulty
        result = result.filter(res => difficultyIndex.includes(res.index));
        //  Cache cf-easy / cf-medium / cf-hard
        await cache.put(`cf-${type}`, result, 3600*5);
        let randomQuestion = result[Math.floor(Math.random()*result.length)];
        return res.status(200).json({
            data: randomQuestion
        });
    } catch (err) {
        console.log(err);
    }

}
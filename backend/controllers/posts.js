const Post = require("../models/post");
const User = require("../models/user");
const SendMail = require("../services/mail");

exports.createPost = (req, res) => {
  //const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    //imagePath: url + "/images/" + req.file.filename,
    creator: req.userData && req.userData.userId,
    createdAt: Date.now(),
    status: 'pending'
  });
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res) => {
  //let imagePath = req.body.imagePath;
  // if (req.file) {
  //   const url = req.protocol + "://" + req.get("host");
  //   imagePath = url + "/images/" + req.file.filename;
  // }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    // imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getPosts = (req, res) => {
  let queryStatus = 'approved'
  if (req.userData.role === 'admin') {
    queryStatus = 'pending';
  }
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find({ status: queryStatus });
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count({ status: queryStatus });
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!!!",
        posts: fetchedPosts,
        maxPosts: count,
        showStatus: req.userData.role === 'admin'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json({ data: post, showUpdate: req.userData.role === 'admin' });
      } else {
        res.status(404).json({ message: "Post not found!", success: false });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!",
        success: false
      });
    });
};

exports.deletePost = (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!", success: true });
      } else {
        res.status(401).json({ message: "Not authorized!", success: false });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!",
        success: false
      });
    });
};


/*
  body = { userId, postId, action('like'/'dislike') }
*/
exports.likePost = async (req, res) => {
  const postId = req.body.postId;

  //  check if user has already like/disliked the post
  // const post = await Post.findOne({ _id: postId }, 
  //   { 
  //     "likeCount": 1, "likes": { 
  //     "$elemMatch": { "$eq": req.body.userId }
  //     }
  //   });
  //   console.log(post)
    //return;

  //  update like/dislike in the db
  try {
    const counter = req.body.action === 'like' ? 1 : -1;
    let result = null;
    let resCount = 0;
    //  adds a userId to likes array
    if (req.body.action === 'like') {
      result = await Post.updateOne({ "_id": postId, "likes": { "$ne": req.userData.userId } },
                        { "$inc": { "likeCount": counter }, "$push": { "likes": req.userData.userId } }
      );
      resCount = 1;
    } else if (req.body.action === 'dislike') {
      //  removes a userId rom likes array
      result = await Post.updateOne({ "_id": postId, "likes": req.userData.userId },
                        { "$inc": { "likeCount": counter }, "$pull": { "likes": req.userData.userId } }
      );
      resCount = -1;
    }
    if (result.nModified < 1) {
      resCount = 0;
    }
    return res.status(200).json({ message: "Success", success: true, data: resCount });
  } catch (err) {
    console.log(err)
    res.status(200).json({ message: "Failed", success: false });
  }

}

//  @TODO: correct query
exports.getTopContributors = async (req, res) => {
  try {
    const result = await Post.aggregate([
      { "$match": { status: 'approved' } }, //change
      { "$group": { "_id": "$creator", "count": { "$sum": 1 } } },
      // { "$lookup": {from: 'users', localField: 'creator', foreignField:'_id.str', as: 'users' }},
      // { "$project": { "_id": 1, "creator": 1, "title": 1, "likeCount": 1 } },
      { "$sort" : {"count" : -1} },
      { "$limit" : 10 },
      ]
    )
    //const data = await Post.populate(result, { path: 'creator' })
    //const data = result.populate('userId')
    let response = result.map(async (res) => {
      post = await User.findById(res._id).select('_id email');
      return { post, count: res.count };
    })
    const data = await Promise.all(response);
  
    res.status(200).json({
      response: data,
      success: true,
      message: "Success"
    });
  } catch (err) {
    res.status(500).json({
      response: null,
      success: true,
      message: "Success"
    });
  }
}

exports.updatePostStatus = (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    status: req.body.status
  });
  Post.updateOne({ _id: req.body.id }, post)
    .then(result => {
      if (result.n > 0) {
        if (req.body.status !== 'pending') {
          //https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4OcaqB3O6wv5FRolFt9O3aV-hC7xiZ2KpLGXhjV6yJazYBIEe05MYWzCIWNgZeK1vqucrVeVYOB80CTOPqNf42jkOCyPA
          //SendMail.send(req.body.status, req.userData.email);
        }
        res.status(200).json({ message: "Updated successful!", success: true });
      } else {
        res.status(401).json({ message: "Not authorized!", success: false });
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

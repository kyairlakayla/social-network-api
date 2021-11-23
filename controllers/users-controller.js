const { Users, Thoughts } = require('../models');

const usersController = {

    getAllUser(req, res) {
        Users.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },


    getUserById({ params }, res) {
        Users.findOne({ _id: params.userId })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    addUser({ params, body }, res) {
        console.log(params);
        Users.create(body)
            .then(dbUserData => {
                console.log(dbUserData);
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },


    addFriend({ params, body }, res) {
        Users.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbFriendData => {
                if (!dbFriendData) {
                    res.status(404).json({ message: 'No user found with this id dound !!!' });
                    return;
                }
                res.json(dbFriendData);
            })
            .catch(err => res.json(err));
    }
};


module.exports = usersController;
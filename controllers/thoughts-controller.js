const { Users, Thoughts } = require('../models');


const thoughtsController = {
    getAllThought(req, res) {
        Thoughts.find({})
            .select('-__v')
            .sort({ createdAt: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },


    getThoughtById({ params }, res) {
        Thoughts.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    addThought({ params, body }, res) {
        console.log(params);
        Thoughts.create(body)
            .then(dbThoughtData => {
                Users.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true, runValidators: true }
                )
                console.log(dbThoughtData);
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },


    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id found !!!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },
}

module.exports = thoughtsController;
const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    datasetId: {
        type: String,
        ref: 'Dataset',
        required: true,
    },
    role: {
        type: String,
        enum: ['Editor', 'Owner', 'Reader'],
        required: true,
    },
});

PermissionSchema.index({ userId: 1, datasetId: 1 }, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema);
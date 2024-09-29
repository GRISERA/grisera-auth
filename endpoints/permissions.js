const express = require('express');
const router = express.Router();
const Permission = require('../models/Permission');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

router.use('/', authMiddleware);

router.get('/:id',async(req, res) => {
    try {
        const { id } = req.params;
        const permissions = await Permission.find({ userId: id });
        
        if (!permissions) {
            return res.status(404).json({ error: 'Permissions not found' });
        }

        res.json(permissions);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async(req, res) => {
    try {
        const existingPermission = await Permission.findOne({
            userId: req.body.userId,
            datasetId: req.body.datasetId,
        });

        if (existingPermission) {
            return res.status(400).json({ error: 'Permission already exist' });
        }

        const permission = new Permission(req.body);

        await permission.save();

        if (req.body.userId === req.user.userId){
            const permissions = await Permission.find({ userId: req.body.userId });

            const newToken = jwt.sign({
                userId: req.user.userId,
                email: req.user.email,
                permissions: permissions,
            },
                process.env.JWT_SECRET, {
                    expiresIn: "1d",
                }
            );

            res.status(201).send({token: newToken});
        } else {
            res.status(201).json(permission);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/dataset/:datasetId', async(req, res) => {
    try {
        const { datasetId } = req.params;

        const permissions = await Permission.find({ datasetId: datasetId });

        if(!permissions || permissions.length === 0) {
            return res.status(404).json({ error: 'Permissions not found' });
        }

        res.json(permissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        let permission = await Permission.findById(id);

        if(!permission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        permission.role = req.body.role;

        permission = await permission.save();

        res.json(permission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);

        if (!permission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        await Permission.deleteOne({ _id: id });
        res.json({ message: 'Permission deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
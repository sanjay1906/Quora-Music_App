const router = require('express').Router();

const musicController = require('../controller/musicController');
router.get('/', musicController.getAllMusics);
router.post('/', musicController.addNewMusic);
router.delete('/:musicId', musicController.deleteMusic);
module.exports = router;

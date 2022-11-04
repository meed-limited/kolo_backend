import express, { Router } from 'express';

const router: Router = express.Router({ caseSensitive: true, mergeParams: true, strict: true });

const { protect } = require('./middleware/auth');

const {
    getUserAuthorization,

    increaseAdsCount,
    getAdsAndTokenCount,

    requestTokenTransfer,

    submitVote,
    getCurrentPoll,
    getCurrentProposals,
    getOneProposal
} = require('./controller/user');

const {
    addNewProject,
    editProject,
    getProject
} = require('./controller/project');

const {
    getRate,
    sendCoin,
} = require('./controller/external');

router.post('/users/auth', getUserAuthorization);

router.post('/projects/', addNewProject);
router.put('/projects/', editProject);
router.post('/projects/one', getProject);

// router.post('/user', createUser);
router.post('/users/adscount', protect, increaseAdsCount);
router.post('/users/adstokencount', protect, getAdsAndTokenCount);

router.post('/users/token/transfer', protect, requestTokenTransfer);

router.post('/users/poll/vote', protect, submitVote);
router.post('/users/poll/current', protect, getCurrentPoll);
router.post('/users/poll/proposals', protect, getCurrentProposals);
router.post('/users/poll/proposal', getOneProposal, getCurrentProposals);

router.post('/exchange/rate', getRate);
router.post('/exchange/coin/send', sendCoin);

export = { router };
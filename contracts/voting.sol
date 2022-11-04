// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

/// @title Voting with delegation.
contract Ballot {
    address public chairPerson;

    IERC20 public daoToken;

    bool acceptingProposals = false;
    bool pollOpened = false;

    uint256 private _pollId = 1;
    uint256 private _proposalId = 1;

    Proposal private submission;

    mapping(uint256 => mapping(uint256 => Proposal)) private pollHistory;
    mapping(uint256 => uint256) private pollWinner;
    // mapping(address => uint256) private bakersWeights;
    mapping(uint256 => uint256[]) private tracker;

    modifier onlyOwner() {
        require(msg.sender == chairPerson, "Not owner");
        _;
    }

    event NewProposal(uint256 id, bytes32 title, address owner);
    event VoteSubmitted(address voter, uint256 proposalId);

    // This is a type for a single proposal.
    struct Proposal {
        uint256 id;
        bytes32 title; // short title (up to 32 bytes)
        uint256 voteCount; // total votes
    }

    constructor(IERC20 _daoToken) {
        chairPerson = msg.sender;
        daoToken = _daoToken;
    }

    /*
    function addWeights(address[] calldata bakers, uint256[] calldata weights)
        external
    {
        require(msg.sender == chairPerson, "Only the chair can add weights");
        require(
            bakers.length == weights.length,
            "The length of the bakers and weights must be the same"
        );
        for (uint256 i = 0; i < bakers.length; i++) {
            bakersWeights[bakers[i]] = bakersWeights[bakers[i]].add(weights[i]);
        }
    }
    */

    // change the status of the acceptingroposal
    function setProposalAcceptanceStatus() external onlyOwner {
        if (acceptingProposals == false) {
            acceptingProposals = true;
        } else {
            acceptingProposals = false;
        }
    }

    // change the status of the acceptingroposal
    function setPollStatus() external onlyOwner {
        if (pollOpened == false) {
            pollOpened = true;
        } else {
            pollOpened = false;
        }
    }

    // Append new proposal to the to the end of `proposals`.
    function submitProposal(bytes32 title) external returns (uint256) {
        require(acceptingProposals == true, "Not taking proposals now");
        submission = Proposal({id: _proposalId, title: title});

        pollHistory[_pollId][_proposalId] = submission;

        tracker[_pollId].push(_proposalId);
        emit NewProposal(_proposalId, title, msg.sender);
        _proposalId = _proposalId.add(1);
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(address sender, uint256 proposaId) external onlyOwner {
        require(pollOpened == true, "No poll is currently open");
        // require(
        //     bakersWeights[sender] > 0,
        //     "You've already voted or you have now new right to vote"
        // );
        require(proposaId <= _proposalId, "The proposal identifier is unknown");

        Proposal memory candidate = pollHistory[_pollId][proposaId];
        candidate.voteCount = candidate.voteCount.add(bakersWeights[sender]);
        pollHistory[_pollId][proposaId] = candidate;

        bakersWeights[sender] = 0;
        emit VoteSubmitted(sender, proposaId);
    }

    function getProposals(uint256 pollId)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory ids = tracker[pollId];

        return (ids);
    }

    function declarePollWinner(uint256 pollId, uint256 proposalId)
        external
        onlyOwner
    {
        pollWinner[pollId] = proposalId;
    }

    function getPollWinner(uint256 pollId)
        external
        view
        returns (
            string memory,
            string memory,
            uint256,
            address,
            address
        )
    {
        uint256 winnerId = pollWinner[pollId];
        Proposal storage proposal = pollHistory[pollId][winnerId];
        return (
            proposal.title,
            proposal.description,
            proposal.voteCount,
            proposal.account,
            proposal.owner
        );
    }

    function currentPollId() external view returns (uint256) {
        return _pollId;
    }

    function currentProposalId() external view returns (uint256) {
        return _proposalId;
    }

    function voteWeight(address owner) external view returns (uint256) {
        return bakersWeights[owner];
    }

    function isAcceptingProposals() external view returns (bool) {
        return acceptingProposals;
    }

    function isPollOpened() external view returns (bool) {
        return pollOpened;
    }
}

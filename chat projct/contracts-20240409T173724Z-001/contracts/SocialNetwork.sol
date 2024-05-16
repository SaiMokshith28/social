// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocialMedia {
    struct Post {
        address author;
        string content;
    }

    mapping(uint256 => Post) public posts;
    uint256 public totalPostCount;

    event PostCreated(address indexed author, uint256 indexed postId, string content);

    function createPost(string memory _content) public {
        uint256 postId = totalPostCount;
        posts[postId] = Post(msg.sender, _content);
        totalPostCount++;
        emit PostCreated(msg.sender, postId, _content);
    }

    function getPost(uint256 _postId) public view returns (address, string memory) {
        return (posts[_postId].author, posts[_postId].content);
    }
}

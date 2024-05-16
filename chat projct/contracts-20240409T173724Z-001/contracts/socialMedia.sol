// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocialMedia {
    // Structure to represent a post
    struct Post {
        uint postId;
        address author;
        string content;
        uint timestamp; // New variable to store timestamp
    }

    // Mapping to track individual user post counts
    mapping(address => uint) public userPostCounts;

    // Array to store all posts
    Post[] public posts;

    // Function to create a new post
    function createPost(string memory _content) public {
        // Increment total post count
        uint postId = posts.length;
        uint timestamp = block.timestamp; // Capture current timestamp
        posts.push(Post(postId, msg.sender, _content, timestamp));
        
        // Increment user's post count
        userPostCounts[msg.sender]++;
    }

    // Function to get total post count
    function getTotalPostCount() public view returns (uint) {
        return posts.length;
    }

    // Function to get user's post count
    function getUserPostCount(address _user) public view returns (uint) {
        return userPostCounts[_user];
    }
    
}

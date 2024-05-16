// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageSender {
    struct Message {
        address sender;
        address receiver;
        string data;
    }

    Message[] public messages;

    event MessageSent(address indexed sender, address indexed receiver, string data);

    function sendMessage(address _receiver, string memory _data) external {
        require(_receiver != address(0), "Invalid receiver address");
        require(bytes(_data).length > 0, "Data cannot be empty");

        Message memory newMessage = Message({
            sender: msg.sender,
            receiver: _receiver,
            data: _data
        });

        messages.push(newMessage);
        emit MessageSent(msg.sender, _receiver, _data);
    }

    function getMessagesForReceiver(address _receiver) external view returns (address[] memory senders, string[] memory allMessages) {
        uint256 messageCount = 0;
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].receiver == _receiver) {
                messageCount++;
            }
        }

        senders = new address[](messageCount);
        allMessages = new string[](messageCount);

        uint256 index = 0;
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].receiver == _receiver) {
                senders[index] = messages[i].sender;
                allMessages[index] = messages[i].data;
                index++;
            }
        }

        return (senders, allMessages);
    }
}

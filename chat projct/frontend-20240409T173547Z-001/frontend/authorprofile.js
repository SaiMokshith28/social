document.addEventListener('DOMContentLoaded', async () => {
    try {
        const usernameElement = document.getElementById('username');
        const postCountElement = document.getElementById('postCount');
        const fullAddressElement = document.getElementById('fullAddress');
        const postContainer = document.getElementById('postContainer');
        const partialAddress = document.getElementById('partialAddress');
        const fullAddress = document.getElementById('fullAddress');
        const disconnectButton = document.getElementById('disconnectButton');
        
        function displayPartialAddress(address) {
            if (address.length >= 10) {
                const partial = address.slice(0, 5) + '...' + address.slice(-5);
                partialAddress.textContent = `Connected Wallet: ${partial}`;
            } else {
                partialAddress.textContent = `Connected Wallet: ${address}`;
            }
        }
        function displayFullAddress(address) {
            fullAddress.textContent = `Full Wallet Address: ${address}`;
        }

        // Initialize Web3
        if (typeof web3 === 'undefined') {
            alert('Please install MetaMask or use a web3-enabled browser.');
            return;
        }
        const web3Provider = new Web3(window.ethereum);

        // Initialize contracts
        const socialMediaContractAddress = '0x4e6ca7eb71ae560030640a0ee9cfa8da5454c255'; // Replace with actual address
        const userRegistryContractAddress = '0xf52f810d6b3dc884762db051cbaebf08a222fb22'; // Replace with actual address

        const socialMediaContractAbi = [{"inputs":[{"internalType":"string","name":"_content","type":"string"}],"name":"createPost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getTotalPostCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserPostCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"posts","outputs":[{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"address","name":"author","type":"address"},{"internalType":"string","name":"content","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userPostCounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
        const userRegistryContractAbi = [{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"getUsername","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"isAddressRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"isUsernameAvailable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"registerUsername","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userAddressesToUsernames","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"usernamesToUserAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

        const socialMediaContract = new web3Provider.eth.Contract(socialMediaContractAbi, socialMediaContractAddress);
        const userRegistryContract = new web3Provider.eth.Contract(userRegistryContractAbi, userRegistryContractAddress);

        // Fetch address from URL query parameters
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const profileAddress = urlParams.get('address');

        // Fetch and display user's profile information
        async function fetchProfileInfo() {
            // Fetch username from UserRegistry contract
            const username = await userRegistryContract.methods.getUsername(profileAddress).call();

            // Fetch post count from SocialMedia contract
            const postCount = await socialMediaContract.methods.getUserPostCount(profileAddress).call();

            // Display fetched information
            displayUsername(username);
            displayPostCount(postCount);
            displayFullAddress(profileAddress);
        }

        // Fetch and display user's posts
        async function fetchAndDisplayPosts() {
            // Fetch user's posts from SocialMedia contract
            const totalPostCount = await socialMediaContract.methods.getTotalPostCount().call();
            for (let i = totalPostCount - 1; i >= 0; i--) {
                const post = await socialMediaContract.methods.posts(i).call();
                if (post.author.toLowerCase() === profileAddress.toLowerCase()) {
                    displayPost(post);
                }
            }
        }

        // Function to display the connected wallet username
        function displayUsername(username) {
            usernameElement.textContent = username;
        }

        // Function to display the number of posts
        function displayPostCount(postCount) {
            postCountElement.textContent = postCount;
        }

        // Function to display a new post with timestamp
        function displayPost(post) {
            const postDiv = document.createElement('div');
            postDiv.classList.add('card', 'mb-3');
            const timestamp = new Date(post.timestamp * 1000).toLocaleString(); // Convert timestamp to date string
            postDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${post.author}</h5>
                    <p class="card-text">${post.content}</p>
                    <p class="card-text"><small class="text-muted">Posted at: ${timestamp}</small></p>
                </div>
            `;
            postContainer.prepend(postDiv); // Prepend to display recent post first
        }

        // Fetch user's profile information and posts when the page loads
        fetchProfileInfo();
        fetchAndDisplayPosts();

        // Get the connected wallet address
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const walletAddress = accounts[0];

        // Display the partial address initially
        displayPartialAddress(walletAddress);

        // Display the full address when hovered over the partial address
        partialAddress.addEventListener('mouseover', () => {
            displayFullAddress(walletAddress);
        });

        // Display the partial address again when mouse leaves 
partialAddress.addEventListener('mouseleave', () => {
    displayPartialAddress(walletAddress);
});

// Disconnect button functionality
disconnectButton.addEventListener('click', async () => {
    try {
        // Disconnect logic here
        // For example, you can reset the displayed information or handle the disconnection process
    } catch (error) {
        console.error('Error disconnecting:', error);
        alert('An error occurred while disconnecting. Please try again.');
    }
});

} catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
}
});


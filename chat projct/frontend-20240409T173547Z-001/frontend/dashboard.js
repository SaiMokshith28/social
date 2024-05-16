document.addEventListener('DOMContentLoaded', async () => {
    try {
        const partialAddress = document.getElementById('partialAddress');
        const fullAddress = document.getElementById('fullAddress');
        const disconnectButton = document.getElementById('disconnectButton');
        const postContentInput = document.getElementById('postContent');
        const submitPostButton = document.getElementById('submitPostButton');
        const postContainer = document.getElementById('postContainer');
        const loadingAnimation = document.getElementById('loadingAnimation');

        // Function to display the partial address
        function displayPartialAddress(address) {
            if (address.length >= 10) {
                const partial = address.slice(0, 5) + '...' + address.slice(-5);
                partialAddress.textContent = `Connected Wallet: ${partial}`;
            } else {
                partialAddress.textContent = `Connected Wallet: ${address}`;
            }
        }

        // Function to display the full address
        function displayFullAddress(address) {
            fullAddress.textContent = `Full Wallet Address: ${address}`;
        }
        // Function to display a new post with timestamp
        function displayPost(post) {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            const timestamp = new Date(post.timestamp * 1000).toLocaleString(); // Convert timestamp to date string
            postDiv.innerHTML = `
            <section>
            <div class="container  mt-2 pt-5 mx-5">
                <div class="row">
                    <div class="col-md-9">
                        <div class="details d-flex align-items-center">
                            <div class="profiel-picture-icon">
                                <img src="th.jpg" class="rounded-circle" style="width: 40px; height: 40px;" alt="Profile Picture">
                            </div>
                            
                            <span class="author-name ml-3 ">${post.author}</span>
                            <span class="timestamp ml-auto">${timestamp}</span>
                        </div>
                        <div class="post-content mt-1 ml-3 pt-4">
                        ${post.content}
                        </div>
                        <div class="interactive-icons d-flex ml-3 mt-2 pt-4 ">
                        <div class="interactive-icons d-flex ml-3 mt-2 pt-4 ">
                             <div class="like-icon  btn btn-secondary">
                                <i class="fas fa-heart"></i>
                            </div>

                            <div class="regroup ml-5 pl-5 ">
                                <div class="share-icon btn btn-secondary">
                                    <i class="fas fa-share"></i>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <hr class="border-dark">

            `;
            // Inserting the new post at the beginning of the post container
            postContainer.prepend(postDiv);

            // Add event listeners for like and reply icons
           

        

           
        }

        // Function to open the profile page of the corresponding user
        function openUserProfile(address) {
            // Implement logic to open the profile page of the user with the given address
            // For example:
            window.location.href = `authorprofile.html?address=${address}`;
        }

        // Show loading animation
        function showLoadingAnimation() {
            loadingAnimation.style.display = 'block';
            loadingAnimation.innerHTML = `
                <div class="spinner-border text-primary mr-2" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <span id="loadingText">Posting</span>
            `;
        }

        // Show success animation
        function showSuccessAnimation() {
            loadingAnimation.innerHTML = `
                <i class="fas fa-check-circle text-success mr-2"></i>
                <span id="loadingText">Posted</span>
            `;
            // Hide animation after 5 seconds
            setTimeout(() => {
                loadingAnimation.style.display = 'none';
            }, 5000);
        }

        // Event listener for disconnect button
        disconnectButton.addEventListener('click', () => {
            try {
                // Add logic to disconnect the wallet here
                window.ethereum.disconnect();
                // You can also reset the UI or perform any necessary cleanup
            } catch (error) {
                console.error('Error disconnecting wallet:', error);
                alert('Error disconnecting wallet. Please try again.');
            }
        });

        // Event listener for submitting a post
        submitPostButton.addEventListener('click', async () => {
            const postData = postContentInput.value.trim(); // Get post data
            if (postData === '') {
                alert('Please enter some content to post.');
                return;
            }

            // Show loading animation when submitting a post
            showLoadingAnimation();

            try {
                // Initialize web3 provider
                if (typeof web3 === 'undefined') {
                    alert('Please install MetaMask or use a web3-enabled browser.');
                    return;
                }
                const web3Provider = new Web3(window.ethereum);

                // Prompt user to sign transaction
                const accounts = await web3Provider.eth.requestAccounts();
                const sender = accounts[0];

                // Initialize contract interface
                const contractAddress = '0x4e6ca7eb71ae560030640a0ee9cfa8da5454c255'; // Your contract address
                const contractAbi = [{"inputs":[{"internalType":"string","name":"_content","type":"string"}],"name":"createPost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getTotalPostCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserPostCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"posts","outputs":[{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"address","name":"author","type":"address"},{"internalType":"string","name":"content","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userPostCounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Your contract ABI
                const contract = new web3Provider.eth.Contract(contractAbi, contractAddress);

                // Submit the post to the contract
                await contract.methods.createPost(postData).send({ from: sender });

                // Display success animation
                showSuccessAnimation();

                // Clear post input field
                postContentInput.value = '';

                // Fetch and display posts again after posting
                await fetchAndDisplayPosts();
            } catch (error) {
                console.error('Error submitting post:', error);
                alert('Error submitting post. Please try again.');
            }
        });

       // Fetch and display posts from the smart contract
async function fetchAndDisplayPosts() {
    try {
        // Clear existing posts
        postContainer.innerHTML = '';

        // Initialize web3 provider
        const web3Provider = new Web3(window.ethereum);

        // Prompt user to connect their wallet
        const accounts = await web3Provider.eth.requestAccounts();
        const address = accounts[0]; // Get the first account address

        // Display the wallet address
        displayPartialAddress(address);
        displayFullAddress(address);

        // Initialize contract interface
        const contractAddress = '0x4e6ca7eb71ae560030640a0ee9cfa8da5454c255'; // Your contract address
        const contractAbi = [{"inputs":[{"internalType":"string","name":"_content","type":"string"}],"name":"createPost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getTotalPostCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserPostCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"posts","outputs":[{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"address","name":"author","type":"address"},{"internalType":"string","name":"content","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userPostCounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
        const contract = new web3Provider.eth.Contract(contractAbi, contractAddress);

        // Get total post count
        const totalPostCount = await contract.methods.getTotalPostCount().call();

        // Fetch and display each post
        for (let i = 0; i < totalPostCount; i++) {
            const post = await contract.methods.posts(i).call();
            displayPost(post);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Error fetching posts. Please try again.');
    }
}

// Get the connected wallet address
const accounts = await ethereum.request({ method: 'eth_accounts' });
const walletAddress = accounts[0];

// Display the partial address initially
displayPartialAddress(walletAddress);

// Display the full address when hovered over the partial address
partialAddress.addEventListener('mouseover', () => {
    displayFullAddress(walletAddress);
});

// Display the partial address again when the mouse leaves the partial address
partialAddress.addEventListener('mouseleave', () => {
    displayPartialAddress(walletAddress);
});

// Fetch and display posts when the page loads
await fetchAndDisplayPosts();
    } catch (error) {
        console.error('Error getting wallet address:', error);
        alert('Error getting wallet address. Please make sure MetaMask is properly installed and configured.');
    }
});


               

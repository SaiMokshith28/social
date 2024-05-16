const web3 = new Web3(window.ethereum);

document.addEventListener('DOMContentLoaded', async () => {
    const connectWalletButton = document.getElementById('connectWallet');
    const usernameInput = document.getElementById('username');
    const signupForm = document.getElementById('signupForm');
    const walletAddressDisplay = document.getElementById('walletAddress');

    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask or another Ethereum wallet provider not detected. Please install MetaMask or use a compatible Ethereum wallet provider.');
        return;
    }

    connectWalletButton.addEventListener('click', async () => {
        try {
            // Requesting access to the user's Ethereum accounts
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            walletAddressDisplay.textContent = `Connected Wallet: ${walletAddress}`;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet. Please make sure MetaMask is properly installed and configured.');
        }
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        try {
            // Get connected wallet address
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            const walletAddress = accounts[0]; // Assuming only one account is connected

            const username = usernameInput.value.trim();
            if (!username) {
                alert('Please enter a username.');
                return;
            }

            // Contract address and ABI
            const userRegistryAddress = '0xea44bef31e2f040a3e877723cc2569303b9284eb'; // Replace with actual address
            const userRegistryABI = [{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"registerUsername","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"getAddressByUsername","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"getUsername","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_username","type":"string"}],"name":"isUsernameAvailable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"isUserSignedUp","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

            // Create contract instance
            const userRegistryContract = new web3.eth.Contract(userRegistryABI, userRegistryAddress, { from: walletAddress });

            // Check if username is available
            const isAvailable = await userRegistryContract.methods.isUsernameAvailable(username).call();

            if (!isAvailable) {
                alert('Username not available. Please choose a different username.');
                return;
            }

            // Prompt user to sign a transaction to register the username
            try {
                await userRegistryContract.methods.registerUsername(username).send({ from: walletAddress });
                console.log('Username registered successfully:', username);
                alert('Sign up successful!');

                // Redirect to the login page
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error registering username:', error);
                alert('Failed to register username. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please check console for details.');
        }
    });
});
